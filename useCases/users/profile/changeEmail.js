const Errors = require("../../../errors");
const {
  UserMessages,
  GenericMessages,
  HttpStatusCode,
  UserConstants,
  QueueSubType,
  QueueType,
  QueueOptions,
} = require("../../../constants");

async function changeEmail(
  id,
  email,
  emailToken,
  { userRepository, activityRepository, queueService },
  session
) {
  const isExists = await userRepository.findOne({ email });
  const user = await userRepository.findById(id);

  if (user.emailToken !== emailToken) {
    throw new Errors.BadRequest(GenericMessages.EMAIL_TOKEN_IS_INVALID);
  }

  if (isExists?.email === user?.email) {
    throw new Errors.BadRequest(UserMessages.USER_SAME_EMAIL);
  }

  if (isExists) {
    throw new Errors.Conflict(UserMessages.USER_ALREADY_EXISTS);
  }

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.CHANGE_EMAIL,
      data: { userId: user.id, email },
    },
    QueueOptions
  );

  await activityRepository.addActivityLog(
    user.id,
    user.id,
    UserConstants.USER,
    null,
    UserConstants.CHANGE_EMAIL_REQUEST,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: UserMessages.USER_CHANGE_EMAIL_REQUEST_SENT,
    data: { email: email },
  };
}

module.exports = { changeEmail };
