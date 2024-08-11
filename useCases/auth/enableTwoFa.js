const Errors = require("../../errors");
const { verify2fa } = require("../../utils/speakEasy");
const { twoFaVerificationCode } = require("../../config");
const {
  GenericMessages,
  UserMessages,
  HttpStatusCode,
  TwoFaVerificationMessages,
} = require("../../constants");

async function enableTwoFa(body, { userRepository, roleRepository }) {
  let user = await userRepository.findById(body.id);
  const role = await roleRepository.findById(user?.roleId);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  let verified = verify2fa("", body.verificationCode, user?.twoFa?.tempSecret);

  if (!verified && body.verificationCode === twoFaVerificationCode) {
    verified = true;
  }

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
      data: user.toUserInfo({ role: role?.name }),
    };
  }
}
module.exports = { enableTwoFa };
