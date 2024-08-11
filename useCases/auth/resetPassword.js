const moment = require("moment");
const Errors = require("../../errors");
const { decoder } = require("../../utils");
const {
  UserMessages,
  UserConstants,
  HttpStatusCode,
  UserStatus,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../constants");

async function resetPassword(
  body,
  { userRepository, activityRepository, queueService },
  session
) {
  const decoded = await decoder(body.token);
  if (!decoded?.id) {
    throw new Errors.BadRequest(UserMessages.TOKEN_INVALID);
  }

  if (decoded && moment().isAfter(decoded.expireTime)) {
    throw new Errors.BadRequest(UserMessages.TOKEN_EXPIRED);
  }

  let user = await userRepository.findOne({
    _id: decoded.id,
    emailToken: body.token,
    status: { $nin: [UserStatus.SUSPENDED, UserStatus.DELETED] },
  });

  if (!user) {
    throw new Errors.BadRequest(UserMessages.TOKEN_EXPIRED);
  }

  user.emailToken = "";
  user.status = UserStatus.VERIFIED;
  user.setPassword(body.password);

  let userUpdation = await userRepository.save(user, session);

  if (!userUpdation) {
    throw new Errors.InternalServerError(UserMessages.RESET_PASSWORD_FAILURE);
  }

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.PASSWORD_RESET_SUCCESS,
      data: { userId: userUpdation.id },
    },
    QueueOptions
  );

  await activityRepository.addActivityLog(
    userUpdation.id,
    userUpdation.id,
    decoded.type,
    null,
    UserConstants.RESET_PASSWORD,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: UserMessages.PASSWORD_RESET_SUCCESS,
  };
}
module.exports = { resetPassword };
