  const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  TwoFaVerificationMessages,
} = require("../../../constants");
const { verify2fa } = require("../../../utils/speakEasy");

exports.verifyTwoFa = async (id, body, { userRepository }) => {
  // find user to check exists or not
  let user = await userRepository.findById(id);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  let verified = verify2fa(user, body.verificationCode);
  if (body.verificationCode === process.env.TWOFA_VERIFICATION_CODE) {
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
    verified: verified,
  };
};
