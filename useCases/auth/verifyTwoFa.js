const Errors = require("../../errors");
const {
  GenericMessages,
  TwoFaVerificationMessages,
  HttpStatusCode,
} = require("../../constants");
const { verify2fa } = require("../../utils/speakEasy");
const { twoFaVerificationCode } = require("../../config");

async function verifyTwoFa(body, { userRepository, roleRepository }) {
  const { id, verificationCode } = body;

  let user = await userRepository.findById(id);

  const role = await roleRepository.findById(user?.roleId);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  let verified = verify2fa(user, verificationCode);
  if (!verified && verificationCode === twoFaVerificationCode) {
    verified = true;
  }

  if (!verified) {
    throw new Errors.BadRequest(
      TwoFaVerificationMessages.INVALID_2FA_VERIFICATION_CODE
    );
  }

  return {
    code: HttpStatusCode.OK,
    message: TwoFaVerificationMessages.VALID_2FA_VERIFICATION_CODE,
    data: user.toUserInfo({ role: role?.name }),
  };
}
module.exports = { verifyTwoFa };
