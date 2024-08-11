const Errors = require("../../../errors");
const {
  HttpStatusCode,
  GenericConstants,
  GenericMessages,
  ActivityMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../../constants");

async function resetUserPassword(
  adminId,
  userId,
  { userRepository, activityRepository, queueService }
) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.PASSWORD_RESET,
      data: { userId: userId },
    },
    QueueOptions
  );

  await activityRepository.addActivityLog(
    user.id,
    adminId,
    GenericConstants.ADMIN,
    null,
    GenericConstants.RESET_PASSWORD,
    {
      type: GenericConstants.RESET_PASSWORD,
      message: ActivityMessages.ADMIN_RESET_PASSWORD(user.email),
    }
  );

  return {
    code: HttpStatusCode.OK,
    message: ActivityMessages.ADMIN_RESET_PASSWORD(),
  };
}

module.exports = { resetUserPassword };
