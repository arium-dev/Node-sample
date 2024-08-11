const {
  HttpStatusCode,
  GenericMessages,
  QueueType,
  EmailStatus,
  QueueOptions,
  QueueSubType,
  EmailStatusValue,
  EddMessages,
  UserConstants,
  ActivityMessages,
  UserMessages,
} = require("../../../constants");
const Errors = require("../../../errors");

const mailType = {
  [EmailStatus.INITIAL_EMAIL]: QueueSubType.INITIAL_EMAIL,
  [EmailStatus.FOLLOW_UP_EMAIL]: QueueSubType.FOLLOW_UP_EMAIL,
  [EmailStatus.FINAL_EMAIL]: QueueSubType.FINAL_EMAIL,
};

const sendEmail = async (
  adminId,
  id,
  { type = "" },
  {
    userRepository,
    activityRepository,
    eddVerificationRepository,
    queueService,
  },
  session
) => {
  const eddVerification = await eddVerificationRepository.findById(id);
  if (!eddVerification) {
    throw new Errors.NotFound(GenericMessages.DATA_CHANGE_ERROR);
  }

  const user = await userRepository.findById(eddVerification.userId);
  if (!user) {
    throw new Errors.NotFound(UserMessages.USER_NOT_FOUND);
  }

  eddVerification.emailStatus = EmailStatusValue[type];

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
      type: EmailStatusValue[type],
      message: ActivityMessages.ADMIN_SEND_DEPOSIT_MAIL(
        user?.email,
        EmailStatusValue[type]
      ),
    },
    session
  );

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: mailType[type],
      data: { userId: user.id, eddVerificationId: id },
    },
    QueueOptions
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: EddMessages.EMAIL_SENT,
    data: updatedVerification,
  };
};

module.exports = { sendEmail };
