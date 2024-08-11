const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { isEmpty } = require("lodash");
const Errors = require("../../../errors");
const {
  UserMessages,
  HttpStatusCode,
  UserConstants,
  GenericConstants,
} = require("../../../constants");

async function updateUserProfile(
  id,
  body,
  {
    userRepository,
    activityRepository,
    userPreferenceRepository,
    subSumService,
  },
  session
) {
  const fieldsToUpdate = [
    "firstName",
    "lastName",
    "contactNumber",
    "addressLine1",
    "addressLine2",
    "walletAddress",
    "city",
    "countryCode",
    "state",
    "postCode",
    "dob",
    "reference",
  ];

  const user = await userRepository.findById(id);

  const { firstName, lastName } = user;

  if (!user) {
    throw new Errors.NotFound(UserMessages.USER_NOT_FOUND);
  }

  if (
    (firstName.toLowerCase() !== body.firstName.toLowerCase() ||
      lastName.toLowerCase() !== body?.lastName.toLowerCase()) &&
    user.level !== 1
  ) {
    try {
      user[GenericConstants.LEVEL] = 1;
      const resp = await subSumService.fetchUserData(id);
      if (resp?.code == HttpStatusCode.OK) {
        // TODO: Generate Logs
      }

      if (resp?.data?.id) {
        const data = await subSumService.resetUserData(resp.data.id);
        if (data?.code == HttpStatusCode.OK) {
          // TODO: Generate Logs
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  fieldsToUpdate.forEach((field) => {
    if (body[field] !== undefined && body[field] !== null) {
      user[field] = body[field];
    }
  });

  const updatedUser = await userRepository.save(user, session);

  if (isEmpty(updatedUser)) {
    throw new Errors.InternalServerError(
      UserMessages.USER_PROFILE_UPDATED_FAILURE
    );
  }

  const preference = await userPreferenceRepository.findOne({
    userId: new ObjectId(user?.id),
  });

  await activityRepository.addActivityLog(
    user.id,
    user.id,
    UserConstants.USER,
    null,
    UserConstants.UPDATE_PROFILE,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: UserMessages.USER_INFORMATION_UPDATED,
    data: { ...user, threshold: preference?.deposit?.threshold || "" },
  };
}

module.exports = { updateUserProfile };
