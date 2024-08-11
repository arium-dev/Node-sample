const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  HttpStatusCode,
  FiatManagment,
  GenericMessages,
  TransactionStatus,
  Permissions,
  Roles,
  QueueType,
  QueueSubType,
  singleAttempQueue,
} = require("../../../constants");
const Errors = require("../../../errors");

const updateDepositStatus = async (
  { id },
  { status },
  { role, permissions },
  { transactionRepository, queueService },
  session
) => {
  if (
    !(
      role === Roles.SUPER_ADMIN ||
      (status === TransactionStatus.APPROVED &&
        permissions.includes(Permissions.APPROVE_PENDING_DEPOSIT)) ||
      (status === TransactionStatus.REJECTED &&
        permissions.includes(Permissions.REJECT_PENDING_DEPOSIT))
    )
  ) {
    throw new Errors.BadRequest(GenericMessages.NOT_AUTHORIZED);
  }

  const deposit = await transactionRepository.findById(id);

  if (!deposit) {
    throw new Errors.Conflict(GenericMessages.RECORD_NOT_FOUND);
  }

  if (
    deposit.status === TransactionStatus.APPROVED ||
    deposit.status === TransactionStatus.REJECTED
  ) {
    throw new Errors.Conflict(
      `${FiatManagment.DEPOSIT_TRANSACTION_ALREADY}${deposit.status}.`
    );
  }

  deposit.updatedBy = new ObjectId(id);
  deposit.status = status ? status : deposit.status;
  const newDeposit = await transactionRepository.save(deposit, session);

  await session.commitTransaction();
  session.endSession();

  // add in queue
  if (status === TransactionStatus.APPROVED) {
    await queueService.addQueue(
      QueueType.TRANSACTION,
      {
        type: QueueType.TRANSACTION,
        subType: QueueSubType.DEPOSIT_APPROVED,
        data: { transactionId: deposit.id, adminId: id, status },
      },
      singleAttempQueue
    );
  } else {
    await queueService.addQueue(QueueType.MAIL, {
      type: QueueType.MAIL,
      subType: QueueSubType.DEPOSIT_REJECTED_MAIL,
      data: { userId: deposit.userId, transactionId: deposit.id },
    });
  }

  return {
    code: HttpStatusCode.OK,
    data: newDeposit,
    message: FiatManagment.DEPOSIT_STATUS_UPDATED,
  };
};

module.exports = { updateDepositStatus };
