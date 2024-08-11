const Errors = require("../../../errors");
const { verify2fa } = require("../../../utils/speakEasy");
const {
  GenericMessages,
  UserMessages,
  HttpStatusCode,
  TwoFaVerificationMessages,
} = require("../../../constants");

async function enableTwoFa(id, body, { userRepository }) {
  let user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  const verified = verify2fa("", body.verificationCode, user?.twoFa.tempSecret);

  if (!verified) {
    throw new Errors.BadRequest(
      TwoFaVerificationMessages.INVALID_2FA_VERIFICATION_CODE
    );
  } else {
    user.twoFa = {
      ...user.twoFa,
      enabled: true,
      secret: user?.twoFa?.tempSecret,
    };
    user = await userRepository.save(user);

    return {
      code: HttpStatusCode.OK,
      message: UserMessages.TWO_FA_ENABLED,
    };
  }
}
module.exports = { enableTwoFa };
