const Errors = require("../../../errors");
const { getFullName } = require("../../../utils/mailer");
const {
  generateSceretKey,
  getOtpauthUrl,
  base32Secret,
  getDataUrl,
} = require("../../../utils/speakEasy");
const {
  GenericMessages,
  QrCodeMessages,
  HttpStatusCode,
  UserMessages,
} = require("../../../constants");

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
        UserMessages.COULD_NOT_UPDATE_USER_INFO
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
