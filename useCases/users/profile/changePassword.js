const Errors = require("../../../errors");
const {
  UserMessages,
  GenericMessages,
  HttpStatusCode,
  UserConstants,
} = require("../../../constants");

async function changePassword(
  id,
  password,
  currentPassword,
  { userRepository, activityRepository },
  session
) {
  let user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  if (currentPassword === password) {
    throw new Errors.BadRequest(UserMessages.SAME_NEW_PASSWORD);
  }

  if (!user.validatePassword(currentPassword)) {
    throw new Errors.BadRequest(UserMessages.CURRENT_PASSWORD_INVALID);
  }

  user.setPassword(password);

  let updateUser = await userRepository.save(user, session);
  if (!updateUser) {
    throw new Errors.InternalServerError(UserMessages.RESET_PASSWORD_FAILURE);
  }

  await activityRepository.addActivityLog(
    user.id,
    user.id,
    UserConstants.USER,
    null,
    UserConstants.CHANGE_PASSWORD,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: UserMessages.USER_PASSWORD_UPDATED,
    user: user.toProfile(),
  };
}

module.exports = { changePassword };
