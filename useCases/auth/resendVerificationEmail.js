const Errors = require("../../errors");
const {
  UserMessages,
  HttpStatusCode,
  QueueType,
  QueueSubType,
  QueueOptions,
  UserStatus,
  UserConstants,
  GenericConstants,
  ResendEmailLimit,
} = require("../../constants");
const { isEmpty } = require("lodash");
const {
  decoder,
  isWithinTime,
  getRemainingResendTime,
} = require("../../utils");

async function resendVerificationEmail(
  body,
  { userRepository, queueService, activityRepository },
  session
) {
  const { email } = body;

  console.log("e1", email);

  const user = await userRepository.findOne({ email });

  console.log("e2.5", user);

  if (isEmpty(user)) {
    throw new Errors.NotFound(UserMessages.ACCOUNT_NOT_FOUND);
  }

  console.log("e2", email);

  if (user?.status === UserStatus.VERIFIED) {
    throw new Errors.BadRequest(UserMessages.ALREADY_VERIFIED);
  }

  if (user?.emailToken) {
    const { dateTime: tokenIssuedTime } = await decoder(user?.emailToken);

    const isWithinResendTime = isWithinTime(tokenIssuedTime, ResendEmailLimit);

    if (isWithinResendTime) {
      const remainingTime = getRemainingResendTime(tokenIssuedTime);

      throw new Errors.BadRequest(
        UserMessages.EMAIL_RESEND_LIMIT(remainingTime)
      );
    }
  }

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.CREATE_ACCOUNT,
      data: { userId: user?.id },
    },
    QueueOptions
  );

  await activityRepository.addActivityLog(
    user?.id,
    user?.id,
    UserConstants.USER,
    null,
    GenericConstants.RESEND_EMAIL,
    null
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: UserMessages.RESEND_EMAIL_SENT,
  };
}
module.exports = { resendVerificationEmail };
