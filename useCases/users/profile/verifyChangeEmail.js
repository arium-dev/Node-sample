const Errors = require("../../../errors");
const { decoder } = require("../../../utils");
const { verify2fa } = require("../../../utils/speakEasy");
const { twoFaVerificationCode } = require("../../../config");
const {
  UserMessages,
  HttpStatusCode,
  UserConstants,
  TwoFaVerificationMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../../constants");

async function verifyChangeEmail(
  token,
  verificationCode,
  { userRepository, activityRepository, queueService },
  session
) {
  const { id, email } = await decoder(token);

  const user = await userRepository.findById(id);
  const oldEmail = user.email;

  if (user?.emailToken === token) {
    let isValid2FA = verify2fa(user, verificationCode);

    if (verificationCode === twoFaVerificationCode) {
      isValid2FA = true;
    }

    if (!isValid2FA) {
      throw new Errors.BadRequest(
        TwoFaVerificationMessages.INVALID_2FA_VERIFICATION_CODE
      );
    }

    user.email = email;
    user.emailToken = "";

    const updatedUser = await userRepository.updateUser(user, session);

    if (updatedUser) {
      await activityRepository.addActivityLog(
        user.id,
        user.id,
        UserConstants.USER,
        null,
        UserConstants.CHANGE_EMAIL,
        null,
        session
      );

      const { email: newUpdatedEmail } = updatedUser;

      await queueService.addQueue(
        QueueType.MAIL,
        {
          type: QueueType.MAIL,
          subType: QueueSubType.CHANGE_EMAIL_NOTIFICATION,
          data: { userId: user.id, email: oldEmail, newUpdatedEmail },
        },
        QueueOptions
      );

      await session.commitTransaction();
      session.endSession();

      return {
        code: HttpStatusCode.OK,
        message: UserMessages.USER_CHANGE_EMAIL,
      };
    } else {
      throw new Errors.InternalServerError(
        UserMessages.USER_CHANGE_EMAIL_FAILED
      );
    }
  } else {
    throw new Errors.BadRequest(UserMessages.USER_CHANGE_EMAIL_INVALID_TOKEN);
  }
}

module.exports = { verifyChangeEmail };
