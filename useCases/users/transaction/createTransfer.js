const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const Errors = require("../../../errors");
const { getExchangeRate } = require("../currency/getExchangeRate");
const { Transaction } = require("../../../models/Transaction");
const {
  UserMessages,
  WalletMessages,
  UserConstants,
  RecipientMessages,
  CurrencyMessages,
  UserStatus,
  TransactionType,
  TransactionStatus,
  QueueType,
  QueueSubType,
  SingleAttempQueue,
  ActivityMessages,
  FeeType,
  GenericConstants,
} = require("../../../constants");

const SOURCE_CURRENCY = "AUD";

async function createTransfer(
  id,
  body,
  {
    userRepository,
    currencyRepository,
    currencyService,
    balanceRepository,
    activityRepository,
    transactionRepository,
    systemPreferenceRepository,
    queueService,
  },
  session
) {
  const information = await fetchTransactionInformation(id, body, {
    userRepository,
    currencyRepository,
    currencyService,
    balanceRepository,
    systemPreferenceRepository,
  });

  const transaction = await createTransaction(
    id,
    information,
    {
      transactionRepository,
    },
    session
  );

  await activityRepository.addActivityLog(
    id,
    transaction?.userId,
    UserConstants.USER,
    transaction?.id,
    GenericConstants.INITIATED_TRANSFER,
    {
      type: GenericConstants.TRANSFER,
      message: ActivityMessages.INITIATED_TRANSFER(
        transaction?.sentAmount,
        transaction?.receiver?.email
      ),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();

  await queueService.addQueue(
    QueueType.TRANSACTION,
    {
      type: QueueType.TRANSACTION,
      subType: QueueSubType.LOCK_TRANSFER,
      data: { transactionId: transaction.id },
    },
    SingleAttempQueue
  );

  return transaction;
}

async function createTransaction(
  createdBy,
  data,
  { transactionRepository },
  session
) {
  const transfer = await transactionRepository.save(
    new Transaction(transactionPayload(createdBy, data)),
    session
  );
  if (!transfer) {
    throw new Errors.NotFound(WalletMessages.FAILED_CREATE_TRANSACTION);
  }

  return {
    ...transfer,
    receiver: {
      id: data?.receiver?.id,
      firstName: data?.receiver?.firstName,
      lastName: data?.receiver?.lastName,
      email: data?.receiver?.email,
    },
    baseCurrency: data?.baseCurrency,
    exchangeCurrency: data?.exchangeCurrency,
    sentAmount: `${transfer?.amount} ${data?.baseCurrency?.code}`,
  };
}

const transactionPayload = (createdBy, data) => {
  return {
    type: TransactionType.TRANSFER,
    transactionId: "",
    status:
      data?.receiver?.level === 3
        ? TransactionStatus.PENDING
        : TransactionStatus.PENDING_INVITATION,
    queueStatus: TransactionStatus.PENDING,
    amount: data?.amount,
    date: moment().format(GenericConstants.DATE_TIME_FORMAT),
    userId: new ObjectId(createdBy),
    createdBy: new ObjectId(createdBy),
    updatedBy: new ObjectId(createdBy),
    transactionDetails: {
      amount: data.actualAmount,
      fee: data.feeAmount,
      refId: "",
      receipt: "",
      senderDetails: {
        sourceCurrencyId: new ObjectId(data?.baseCurrency?.id),
        sourceConversionRate: data?.baseCurrency?.conversionRate,
        exchangedCurrencyId: new ObjectId(data?.exchangeCurrency?.id),
        exchangedConversionRate: data?.exchangeCurrency?.conversionRate,
      },
      receiverDetails: {
        recipientId: new ObjectId(data?.receiver?.id),
        currencyId: new ObjectId(data?.baseCurrency?.id),
        currencyConversionRate: data?.baseCurrency?.conversionRate,
      },
    },
  };
};

async function fetchTransactionInformation(
  id,
  body,
  {
    userRepository,
    currencyRepository,
    currencyService,
    balanceRepository,
    systemPreferenceRepository,
  }
) {
  const { recipientId, amount, exchangeCurrencyId } = body;

  let sender = await userRepository.findById(id);

  if (!sender) {
    throw new Errors.NotFound(UserMessages.USER_NOT_FOUND);
  }
  if (sender.level !== 3) {
    throw new Errors.NotFound(UserMessages.KYC_VERIFIED);
  }

  const balance = await balanceRepository.findOne({
    userId: new ObjectId(id),
  });

  if (!balance) {
    throw new Errors.BadRequest(WalletMessages.BALANCE_FETCHED_FAILED);
  } else if (Number(balance?.balance) < Number(amount)) {
    throw new Errors.BadRequest(WalletMessages.INSUFFICIENT_BALANCE);
  }

  let receiver = await userRepository.findOne({
    _id: new ObjectId(recipientId),
  });

  if (!receiver) {
    throw new Errors.NotFound(UserMessages.USER_NOT_FOUND);
  } else if (receiver?.status === UserStatus.SUSPENDED) {
    throw new Errors.BadRequest(WalletMessages.RECEIVER_SUSPENDED);
  } else if (receiver?.status === UserStatus.DELETED) {
    throw new Errors.BadRequest(WalletMessages.RECEIVER_DELETED);
  }

  let baseCurrency = await currencyRepository.findOne({
    code: SOURCE_CURRENCY,
  });
  if (!baseCurrency) {
    throw new Errors.NotFound(CurrencyMessages.NOT_FOUND);
  }

  let exchangeCurrency = await currencyRepository.findById(exchangeCurrencyId);
  if (!exchangeCurrency) {
    throw new Errors.NotFound(CurrencyMessages.NOT_FOUND);
  }

  let latestExchangeRate = await getExchangeRate(
    {
      sourceCurrency: SOURCE_CURRENCY,
      destinationCurrency: exchangeCurrency.code,
    },
    { currencyService }
  );

  exchangeCurrency = {
    ...exchangeCurrency,
    conversionRate: latestExchangeRate?.data?.conversionRate?.toString(),
  };

  const systemPreference = await systemPreferenceRepository.findOne({});
  if (!systemPreference || !systemPreference?.transactionFee?.value) {
    throw new Errors.NotFound(WalletMessages.FEE_FETCHED_FAILED);
  }

  let actualAmount = "0";
  let feeAmount = "0";

  let fee = systemPreference?.transactionFee;
  if (fee?.mode === FeeType.PERCENTAGE) {
    feeAmount = (Number(amount) * Number(fee.value)) / 100;
    actualAmount = Number(amount) - feeAmount;
  }
  return {
    sender,
    receiver,
    baseCurrency,
    exchangeCurrency,
    amount,
    feeAmount: feeAmount?.toString(),
    actualAmount: actualAmount?.toString(),
  };
}
module.exports = { createTransfer };
