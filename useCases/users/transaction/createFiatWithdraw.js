const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { FormatTwoDecimals } = require("../../../utils/parser");
const Errors = require("../../../errors");
const { Batch } = require("../../../models/Batch");
const { Transaction } = require("../../../models/Transaction");
const {
  HttpStatusCode,
  GenericMessages,
  FiatManagment,
  GenericConstants,
  TransactionStatus,
  Currencies,
  CurrencyCodes,
  QueueType,
  QueueSubType,
  SingleAttempQueue,
} = require("../../../constants");

async function createFiatWithdraw(
  id,
  body,
  {
    transactionRepository,
    userRepository,
    batchRepository,
    currencyRepository,
    balanceRepository,
    walletRepository,
    queueService,
  },
  session
) {
  const { walletId, amount } = body;

  const { user, wallet, userBalance, currency } = await isExecutableTransaction(
    id,
    body,
    {
      userRepository,
      balanceRepository,
      walletRepository,
      currencyRepository,
    }
  );

  // create fiat batch withdraw transaction
  const { batch } = await createBatch(
    { id, amount },
    { batchRepository },
    session
  );

  // create fiat withdraw transaction
  const { transaction } = await createWithdrawTransaction(
    { id, amount, walletId, batch, currency },
    { transactionRepository },
    session
  );

  await session.commitTransaction();
  session.endSession();

  await queueService.addQueue(
    QueueType.TRANSACTION,
    {
      type: QueueType.TRANSACTION,
      subType: QueueSubType.WITHDRAW,
      data: { transactionId: transaction.id, walletId, userId: id },
    },
    SingleAttempQueue
  );

  return {
    code: HttpStatusCode.CREATED,
    ...transaction,
    message: GenericMessages.WITHDRAW_INITIATED,
  };
}

async function isExecutableTransaction(
  id,
  body,
  { userRepository, balanceRepository, walletRepository, currencyRepository }
) {
  const { walletId, amount } = body;

  // find and check user
  let user = await userRepository.findById(id);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }
  // check kyc of user
  if (!(user?.level === 3)) {
    throw new Errors.BadRequest(GenericMessages.KYC_NOT_VERIFIED);
  }

  // check wallet bank exists or not
  const wallet = await walletRepository.findOne({
    _id: new ObjectId(walletId),
    userId: id,
    type: GenericConstants._WITHDRAW,
    deleted: false,
  });
  if (!wallet?.id) {
    throw new Errors.Conflict(GenericMessages.DATA_CHANGE_ERROR);
  }

  // find and check balance exists or not
  const userBalance = await balanceRepository.findOne({ userId: id });
  if (!(userBalance && parseFloat(userBalance.balance) >= parseFloat(amount))) {
    throw new Errors.BadRequest(GenericMessages.INSUFICIENT_BALANCE);
  }

  // find and check currency
  const currency = await currencyRepository.findOne({
    code: Currencies.find((currency) => currency?.code === CurrencyCodes?.AUD)
      ?.code,
  });
  if (!currency.id) {
    throw new Errors.InternalServerError(FiatManagment.FAIL_TO_SAVE_WITHDRAWAL);
  }

  return { user, wallet, userBalance, currency };
}

async function createBatch({ id, amount }, { batchRepository }, session) {
  let batch = new Batch({
    type: GenericConstants._WITHDRAW,
    status: TransactionStatus.UN_APPROVED,
    amount: FormatTwoDecimals(amount).toString() || "0",
    createdBy: new ObjectId(id),
    updatedBy: null,
  });
  batch = await batchRepository.save(batch, session);
  if (!batch) {
    throw new Errors.InternalServerError(FiatManagment.FAIL_TO_SAVE_WITHDRAWAL);
  }

  return { batch };
}

async function createWithdrawTransaction(
  { id, amount, walletId, batch, currency },
  { transactionRepository },
  session
) {
  let transaction = new Transaction({
    type: GenericConstants._WITHDRAW,
    status: TransactionStatus.UN_APPROVED,
    queueStatus: TransactionStatus.PENDING,
    amount: FormatTwoDecimals(amount).toString() || "0",
    userId: new ObjectId(id),
    transactionDetails: {
      walletId: new ObjectId(walletId),
      batchId: new ObjectId(batch?.id),
      receipt: "",
      message: "",
      response: {
        duration: "",
        status: "",
        description: "",
      },
      currencyId: new ObjectId(currency.id),
      conversionAmount: amount,
    },
    createdBy: new ObjectId(id),
    updatedBy: null,
  });

  transaction = await transactionRepository.save(transaction, session);
  if (!transaction) {
    throw new Errors.InternalServerError(FiatManagment.FAIL_TO_SAVE_WITHDRAWAL);
  }

  return { transaction };
}
module.exports = { createFiatWithdraw };
