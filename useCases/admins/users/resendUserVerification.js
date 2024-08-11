const Errors = require("../../../errors");
const {
  HttpStatusCode,
  UserMessages,
  GenericConstants,
  UserStatus,
  GenericMessages,
  ActivityMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../../constants");

async function resendUserVerification(
  adminId,
  userId,
  { userRepository, activityRepository, queueService }
) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }
  if (user?.status === UserStatus.VERIFIED) {
    throw new Errors.BadRequest(UserMessages.ALREADY_VERIFIED);
  }

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.CREATE_ACCOUNT,
      data: { userId: userId },
    },
    QueueOptions
  );

  await activityRepository.addActivityLog(
    user.id,
    adminId,
    GenericConstants.ADMIN,
    null,
    GenericConstants.RESENT_INVITATION,
    {
      type: GenericConstants.RESENT_INVITATION,
      message: ActivityMessages.ADMIN_RESENT_INVITATION(),
    }
  );

  return {
    code: HttpStatusCode.OK,
    message: ActivityMessages.ADMIN_RESENT_INVITATION(user.email),
  };
}

module.exports = { resendUserVerification };
