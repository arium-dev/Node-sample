const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  GenericConstants,
  GenericMessages,
  ActivityMessages,
  TransactionStatus,
} = require("../../../constants");
const { UserPreference } = require("../../../models/UserPreference");

async function eddVerificationToggle(
  adminId,
  userId,
  {
    userRepository,
    userPreferenceRepository,
    eddVerificationRepository,
    activityRepository,
  },
  session
) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  // confirmed the edd verification
  const eddVerification = await eddVerificationRepository.findOne({
    userId: new ObjectId(userId),
  });

  if (eddVerification && eddVerification.id) {
    eddVerification.status = TransactionStatus.CONFIRMED;
    await eddVerificationRepository.save(eddVerification, session);
  }

  const userPreference = await userPreferenceRepository.findOne({
    userId: new ObjectId(userId),
  });
  if (!userPreference) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  const { deposit } = userPreference;
  deposit.eddVerified = !deposit?.eddVerified;

  await userPreferenceRepository.save(
    new UserPreference({
      ...userPreference,
      deposit,
    }),
    session
  );

  await activityRepository.addActivityLog(
    user.id,
    adminId,
    GenericConstants.ADMIN,
    null,
    GenericConstants.EDD_VERIFICATION,
    {
      type: GenericConstants.EDD_VERIFICATION,
      message: ActivityMessages.ADMIN_EDD_VERIFICATION(
        deposit.eddVerified,
        user.email
      ),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();
  return {
    code: HttpStatusCode.OK,
    message: ActivityMessages.ADMIN_EDD_VERIFICATION(deposit.eddVerified),
  };
}

module.exports = { eddVerificationToggle };
