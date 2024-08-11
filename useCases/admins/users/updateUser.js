const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  UserMessages,
  HttpStatusCode,
  UserConstants,
  ActivityMessages,
} = require("../../../constants");
const { theresholdLimit } = require("../../../config");
const { UserPreference } = require("../../../models/UserPreference");

exports.updateUser = async (
  updatedBy,
  id,
  body,
  { userRepository, userPreferenceRepository, activityRepository },
  session
) => {
  let updatedObj = {
    firstName: body.firstName,
    lastName: body.lastName,
    dob: body.dob || "",
    contactNumber: body.contactNumber || "",
    updatedBy: new ObjectId(updatedBy),
  };

  const user = await userRepository.update(
    { _id: new ObjectId(id) },
    {
      $set: updatedObj,
    },
    session
  );

  const userPreference = await userPreferenceRepository.findOne({
    userId: new ObjectId(user.id),
  });

  if (!userPreference) {
    throw new Errors.NotFound(UserMessages.PREFERENCE_NOT_FOUND);
  }

  const { deposit } = userPreference;

  deposit.threshold = body.threshold || theresholdLimit;

  const updatedPreference = await userPreferenceRepository.save(
    new UserPreference({
      ...userPreference,
      deposit,
    })
  );

  await activityRepository.addActivityLog(
    updatedBy,
    user.id,
    UserConstants.ADMIN,
    null,
    UserConstants.USER_UPDATED,
    {
      type: UserConstants.PROFILE,
      message: ActivityMessages.PROFILE_UPDATED(user.email),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: UserMessages.USER_UPDATED,
    data: {
      ...user.toProfile(),
      threshold: updatedPreference?.deposit?.threshold,
    },
  };
};
