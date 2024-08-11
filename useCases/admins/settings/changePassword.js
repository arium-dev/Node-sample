const Errors = require("../../../errors");
const {
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
    throw new Errors.BadRequest(GenericMessages.SAME_NEW_PASSWORD);
  }

  if (!user.validatePassword(currentPassword)) {
    throw new Errors.BadRequest(GenericMessages.CURRENT_PASSWORD_INVALID);
  }

  user.setPassword(password);

  let updateUser = await userRepository.save(user, session);
  if (!updateUser) {
    throw new Errors.InternalServerError(
      GenericMessages.RESET_PASSWORD_FAILURE
    );
  }

  await activityRepository.addActivityLog(
    user.id,
    user.id,
    UserConstants.ADMIN,
    null,
    UserConstants.CHANGE_PASSWORD,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: GenericMessages.PASSWORD_UPDATED_SUCCESS,
    user: user.toProfile(),
  };
}

module.exports = { changePassword };
