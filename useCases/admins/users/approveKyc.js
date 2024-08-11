const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  ActivityMessages,
  UserMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
  GenericConstants,
  SingleAttempQueue,
} = require("../../../constants");

async function approveKyc(
  { userRepository, queueService, activityRepository },
  session
) {
  const user = await userRepository.findById(externalUserId);
  if (!user) {
    throw new Errors.NotFound(UserMessages.USER_NOT_FOUND);
  }

  user.level = 3;
  await userRepository.save(user, session);

  await activityRepository.addActivityLog(
    adminId,
    adminId,
    GenericConstants.ADMIN,
    null,
    GenericConstants.KYC_APPROVAL,
    {
      type: GenericConstants.KYC_APPROVED,
      message: ActivityMessages.ADMIN_APPROVED_KYC(user.email),
    },
    session
  );

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.KYC_APPROVED_MAIL,
      data: { userId: user.id },
    },
    QueueOptions
  );

  await queueService.addQueue(
    QueueType.TRANSACTION,
    {
      type: QueueType.TRANSACTION,
      subType: QueueSubType.INVITATION_PENDING,
      data: { userId: user.id },
    },
    SingleAttempQueue
  );

  await session.commitTransaction();
  await session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: ActivityMessages.ADMIN_APPROVED_KYC(),
  };
}

module.exports = { approveKyc };
