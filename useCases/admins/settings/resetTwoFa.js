const Errors = require("../../../errors");
const {
  GenericMessages,
  QrCodeMessages,
  HttpStatusCode,
} = require("../../../constants");
const { getFullName } = require("../../../utils/mailer");
const {
  generateSceretKey,
  getOtpauthUrl,
  base32Secret,
  getDataUrl,
} = require("../../../utils/speakEasy");

async function resetTwoFa(id, { userRepository }) {
  if (!id) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }
  let user = await userRepository.findById(id);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  let secretKey = generateSceretKey({
    name: getFullName(user),
    email: user?.email,
  });
  let url = getOtpauthUrl(user, secretKey);

  user.twoFa = {
    ...user.twoFa,
    tempSecret: base32Secret(secretKey),
  };

  const response = await getDataUrl(url);
  if (response) {
    let updatedUser = await userRepository.save(user);
    if (!updatedUser) {
      throw new Errors.InternalServerError(
        GenericMessages.COULD_NOT_UPDATE_INFO
      );
    }
    return {
      code: HttpStatusCode.OK,
      message: QrCodeMessages.QR_GENERATED_SUCCESS,
      data: {
        qrCodeUrl: response,
        twoFaSecret: user?.twoFa?.tempSecret || "",
      },
    };
  }

  throw new Errors.InternalServerError(QrCodeMessages.QR_GENERATION_FAILURE);
}
module.exports = { resetTwoFa };
