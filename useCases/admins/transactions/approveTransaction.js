const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  TransactionMessages,
  TransactionStatus,
  QueueType,
  QueueSubType,
  SingleAttempQueue,
  UserConstants,
  GenericConstants,
  ActivityMessages,
} = require("../../../constants");
const { Transaction } = require("../../../models/Transaction");

async function approveTransaction(
  adminId,
  transactionId,
  data,
  { transactionRepository, activityRepository, queueService },
  session
) {
  const { status } = data;

  const transaction = await transactionRepository.findById(transactionId);

  if (transaction?.queueStatus) {
    throw new Errors.BadRequest(TransactionMessages.ALREADY_PROCESSING);
  }
  if (transaction?.status !== TransactionStatus.PENDING) {
    throw new Errors.BadRequest(TransactionMessages.APPROVED_FAILED);
  }

  transaction.queueStatus = TransactionStatus.PENDING;

  await transactionRepository.save(new Transaction(transaction), session);

  await activityRepository.addActivityLog(
    adminId,
    adminId,
    UserConstants.ADMIN,
    transaction.id,
    GenericConstants.TRANSFER,
    {
      type: GenericConstants.TRANSFER,
      message: ActivityMessages.ADMIN_APPRROVAL_TRANSACTION(
        transaction,
        data.status
      ),
    },
    session
  );

  await session.commitTransaction();
  await session.endSession();

  await queueService.addQueue(
    QueueType.TRANSACTION,
    {
      type: QueueType.TRANSACTION,
      subType: QueueSubType.TRANSFER,
      data: { transactionId: transaction.id, adminId, status },
    },
    SingleAttempQueue
  );

  return {
    code: HttpStatusCode.OK,
    message: TransactionMessages.PROCESSING,
  };
}

module.exports = { approveTransaction };
