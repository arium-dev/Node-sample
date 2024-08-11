const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  EddMessages,
  UserMessages,
  UserConstants,
  ActivityMessages,
} = require("../../../constants");

async function updateNote(
  adminId,
  id,
  body,
  { userRepository, eddVerificationRepository, activityRepository },
  session
) {
  const { note = "" } = body;

  const eddVerification = await eddVerificationRepository.findById(id);
  if (!eddVerification) {
    throw new Errors.BadRequest(EddMessages.NOT_FOUND);
  }

  const user = await userRepository.findById(eddVerification.userId);
  if (!user) {
    throw new Errors.BadRequest(UserMessages.USER_NOT_FOUND);
  }

  eddVerification.note = note;

  const updatedVerification = await eddVerificationRepository.save(
    eddVerification,
    session
  );

  await activityRepository.addActivityLog(
    user.id,
    adminId,
    UserConstants.ADMIN,
    null,
    UserConstants.EDD_VERIFICATION,
    {
      type: UserConstants.UPDATED_EDD_NOTE,
      message: ActivityMessages.ADMIN_UPDATED_NOTE(updatedVerification),
    },
    session
  );

  await session.commitTransaction();
  await session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: EddMessages.NOTES_UPDATED_SUCCESS,
  };
}

module.exports = { updateNote };
