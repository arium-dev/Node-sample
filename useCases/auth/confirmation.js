const moment = require("moment");
const { decoder } = require("../../utils");
const Errors = require("../../errors");
const {
  HttpStatusCode,
  UserMessages,
  UserConstants,
  UserStatus,
} = require("../../constants");

async function confirmation(
  body,
  { userRepository, activityRepository },
  session
) {
  const decoded = await decoder(body.token);

  if (!decoded?.id) {
    throw new Errors.BadRequest(UserMessages.CONFIRMATION_TOKEN_INVALID);
  }

  if (decoded && moment().isAfter(decoded.expireTime)) {
    throw new Errors.BadRequest(UserMessages.TOKEN_EXPIRED);
  }

  const user = await userRepository.findOne({
    _id: decoded.id,
    emailToken: body.token,
    status: { $nin: [UserStatus.SUSPENDED, UserStatus.DELETED] },
  });

  if (!user) {
    throw new Errors.BadRequest(UserMessages.TOKEN_EXPIRED);
  }
  let userUpdation = null;
  user.emailToken = "";
  user.status = UserStatus.VERIFIED;
  user.setPassword(body.password);
  userUpdation = await userRepository.save(user, session);

  if (!userUpdation) {
    throw new Errors.InternalServerError(UserMessages.FAILED_TO_SAVE_USER);
  }

  await activityRepository.addActivityLog(
    user.id,
    user.id,
    decoded.type,
    null,
    UserConstants.VERIFIED_ACCOUNT,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    data: {
      userInfo: userUpdation.toUserInfo({}),
      loginKey: userUpdation.toLoginKey(body.password),
    },
    message: UserMessages.CONFIRMATION_SUCCESS_WITH_PASSWORD,
  };
}
module.exports = { confirmation };
