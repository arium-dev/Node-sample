const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  GenericMessages,
  GenericConstants,
  ActivityMessages,
  HttpStatusCode,
  UserConstants,
  TransactionStatus,
  UserMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
  EddStatus,
} = require("../../../constants");
const { Transaction } = require("../../../models/Transaction");
const { EddVerification } = require("../../../models/EddVerification");
const createDepositAndUpdateBalance = async (
  { userId, body, type, user, isKycAlertEmail },
  {
    transactionRepository,
    balanceRepository,
    activityRepository,
    queueService,
  },
  session
) => {
  let userBalance = await balanceRepository.findOne({
    userId,
  });

  userBalance.balance =
    parseFloat(userBalance.balance) + parseFloat(body.Amount);

  userBalance = await balanceRepository.save(userBalance, session);
  if (!userBalance) {
    throw new Errors.NotFound(GenericMessages.WEBHOOK_NOT_EXECUTABLE);
  }

  let deposit = new Transaction({
    type: "deposit",
    transactionId: body.TransactionId,
    status: TransactionStatus.APPROVED,
    amount: body.Amount?.toString(),
    note: "Deposit transaction approved by the system",
    userId: userId,
    transactionDetails: { ...body, type },
  });

  deposit = await transactionRepository.save(deposit, session);
  if (!(deposit && deposit.id)) {
    throw new Errors.NotFound(GenericMessages.WEBHOOK_NOT_EXECUTABLE);
  }

  await activityRepository.addActivityLog(
    userId,
    userId,
    UserConstants.USER,
    deposit?.id,
    GenericConstants.DEPOSIT_APPROVED,
    {
      type: GenericConstants.DEPOSIT_APPROVED,
      message: ActivityMessages.DEPOSIT_APPROVED(body.Amount),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();

  // add queue for email sending to user
  if (user?.level !== 3 && !isKycAlertEmail) {
    await queueService.addQueue(
      QueueType.MAIL,
      {
        type: QueueType.MAIL,
        subType: QueueSubType.KYC_ALERT_EMAIL,
        data: { userId },
      },
      QueueOptions
    );
  } else {
    await queueService.addQueue(
      QueueType.MAIL,
      {
        type: QueueType.MAIL,
        subType: QueueSubType.DEPOSIT_RECEIVED,
        data: { userId, amount: deposit.amount },
      },
      QueueOptions
    );
  }
  return {
    transactionId: body.TransactionId,
    accountNumber: body.AccountNumber,
    amount: body.Amount,
    status: HttpStatusCode.OK,
  };
};

async function manageDeposit(
  { type = GenericConstants.NPP, body },
  {
    userRepository,
    walletRepository,
    userPreferenceRepository,
    transactionRepository,
    balanceRepository,
    eddVerificationRepository,
    activityRepository,
    queueService,
  },
  session
) {
  const wallet = await walletRepository.findOne({
    "data.accountNumber": body.AccountNumber?.toString(),
  });

  const userId = wallet?.userId;
  const user = await userRepository.findById(userId);

  if (!(wallet && user)) {
    throw new Errors.NotFound(
      UserMessages.USER_ACCOUNT_NOT_FOUND(body.AccountNumber)
    );
  }

  let currentTime = new Date();
  // Time 24 hours ago
  let twentyFourHoursAgo = new Date(currentTime);
  twentyFourHoursAgo.setHours(currentTime.getHours() - 24);
  const deposits = await transactionRepository.find({
    userId,
    type: "deposit",
    createdAt: {
      $gte: twentyFourHoursAgo,
      $lte: currentTime,
    },
  });

  let totalAmount =
    deposits.length > 0 &&
    deposits.reduce((a, dep) => parseFloat(dep.amount) + a, 0);
  totalAmount = parseFloat(body.Amount) + totalAmount;

  const userPreference = await userPreferenceRepository.findOne({
    userId,
  });

  const { eddVerified, threshold, isKycAlertEmail } = userPreference?.deposit;

  let resp = {};
  if (eddVerified || parseFloat(totalAmount) < parseFloat(threshold)) {
    resp = await createDepositAndUpdateBalance(
      { userId, body, type, user, isKycAlertEmail },
      {
        userRepository,
        walletRepository,
        userPreferenceRepository,
        transactionRepository,
        balanceRepository,
        activityRepository,
        queueService,
      },
      session
    );
  } else {
    resp = await createDepositTransaction(
      { userId, body, type },
      {
        transactionRepository,
        eddVerificationRepository,
        queueService,
      },
      session
    );
  }

  return {
    data: resp,
    code: HttpStatusCode.OK,
  };
}

const createDepositTransaction = async (
  { userId, body, type },
  { transactionRepository, eddVerificationRepository, queueService },
  session
) => {
  const pendingDeposit = await transactionRepository.findOne({
    userId,
    type: "deposit",
    status: TransactionStatus.PENDING,
  });

  const isToSendMail = pendingDeposit && pendingDeposit.id ? true : false;

  let deposit = new Transaction({
    type: "deposit",
    transactionId: body.TransactionId,
    status: TransactionStatus.PENDING,
    amount: body.Amount?.toString(),
    note: "Deposit transaction save by the system",
    userId: userId,
    transactionDetails: { ...body, type },
  });

  deposit = await transactionRepository.save(deposit, session);

  if (!(deposit && deposit.id)) {
    throw new Errors.NotFound(GenericMessages.WEBHOOK_NOT_EXECUTABLE);
  }

  const eddVerification = await eddVerificationRepository.findOne({
    userId: new ObjectId(userId),
    status: { $ne: EddStatus.COMPLETED },
  });

  let currentVerification = null;
  if (!eddVerification) {
    currentVerification = await eddVerificationRepository.save(
      new EddVerification({
        status: EddStatus.PENDING,
        emailStatus: 1,
        userId: new ObjectId(userId),
      }),
      session
    );
  }

  await session.commitTransaction();
  session.endSession();

  if (!isToSendMail) {
    await queueService.addQueue(
      QueueType.MAIL,
      {
        type: QueueType.MAIL,
        subType: QueueSubType.INITIAL_EMAIL,
        data: { userId, eddVerificationId: currentVerification.id },
      },
      QueueOptions
    );
  }
  return {
    transactionId: body.TransactionId,
    accountNumber: body.AccountNumber,
    amount: body.Amount,
    status: HttpStatusCode.OK,
  };
};

module.exports = { manageDeposit };
