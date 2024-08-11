const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  TwoFaVerificationMessages,
} = require("../../../constants");
const { verify2fa } = require("../../../utils/speakEasy");

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
      message: GenericMessages.TWO_FA_ENABLED,
    };
  }
}
module.exports = { enableTwoFa };
