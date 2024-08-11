const { isEmpty } = require("lodash");
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  GenericMessages,
  GenericConstants,
} = require("../../../constants");

async function updateProfile(
  id,
  body,
  { userRepository, activityRepository },
  session
) {
  const fieldsToUpdate = ["firstName", "lastName"];

  const user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  fieldsToUpdate.forEach((field) => {
    if (body[field] !== undefined && body[field] !== null) {
      user[field] = body[field];
    }
  });

  const updatedUser = await userRepository.save(user, session);

  if (isEmpty(updatedUser)) {
    throw new Errors.InternalServerError(GenericMessages.COULD_NOT_UPDATE_INFO);
  }

  await activityRepository.addActivityLog(
    user.id,
    user.id,
    GenericConstants.ADMIN,
    null,
    GenericConstants.UPDATE_PROFILE,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: GenericMessages.RECORD_UPDATED_SUCCESS,
    data: user,
  };
}

module.exports = { updateProfile };
