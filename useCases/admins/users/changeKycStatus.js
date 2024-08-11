const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  ActivityMessages,
  UserMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
  GenericConstants,
  SingleAttempQueue,
  ValidKycLevels,
  KycStatusLabel,
} = require("../../../constants");

async function changeKycStatus(
  id,
  adminId,
  { level },
  { userRepository, queueService, activityRepository, subSumService },
  session
) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(UserMessages.USER_NOT_FOUND);
  }

  if (!ValidKycLevels.includes(level)) {
    throw new Errors.NotFound(UserMessages.INVALID_KYC_LEVEL);
  }

  if (user.level === 3) {
    try {
      const resp = await subSumService.fetchUserData(id);
      if (resp?.data?.id) {
        await subSumService.resetUserData(resp.data.id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  user.level = level;

  await userRepository.save(user, session);

  await activityRepository.addActivityLog(
    adminId,
    adminId,
    GenericConstants.ADMIN,
    null,
    GenericConstants.KYC_STATUS_CHANGE,
    {
      type: GenericConstants.KYC_STATUS_CHANGE,
      message: ActivityMessages.ADMIN_LEVEL_CHANGE_KYC(
        user.email,
        KycStatusLabel[level]
      ),
    },
    session
  );

  if (level === 3 || level === 0) {
    await queueService.addQueue(
      QueueType.MAIL,
      {
        type: QueueType.MAIL,
        subType:
          level === 3
            ? QueueSubType.KYC_APPROVED_MAIL
            : level === 0
            ? QueueSubType.KYC_REJECTED_MAIL
            : null,
        data: { userId: user.id },
      },
      QueueOptions
    );
  }

  if (level === 3) {
    await queueService.addQueue(
      QueueType.TRANSACTION,
      {
        type: QueueType.TRANSACTION,
        subType: QueueSubType.INVITATION_PENDING,
        data: { userId: user.id },
      },
      SingleAttempQueue
    );
  }

  await session.commitTransaction();
  await session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: ActivityMessages.ADMIN_LEVEL_CHANGE_KYC(
      user.email,
      KycStatusLabel[level]
    ),
    data: { level },
  };
}

module.exports = { changeKycStatus };
