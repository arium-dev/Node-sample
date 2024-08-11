const moment = require("moment");
const Errors = require("../../../errors");
const { encoder } = require("../../../utils");
const {
  GenericMessages,
  UserMessages,
  HttpStatusCode,
} = require("../../../constants");

async function verifyCurrentPassword(id, body, { userRepository }) {
  if (!id) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  if (!user.validatePassword(body.currentPassword)) {
    throw new Errors.BadRequest(UserMessages.INVALID_PASSWORD);
  }

  const data = {
    email: user.email,
    type: "user",
    id: user.id,
    dateTime: moment().valueOf(),
  };

  const emailToken = await encoder(data);
  user.emailToken = emailToken;
  const isUpdated = await userRepository.save(user);

  if (!isUpdated) {
    throw new Errors.InternalServerError(UserMessages.FAILED_PASSWORD_VERIFY);
  }

  return {
    code: HttpStatusCode.OK,
    data: {
      emailToken,
    },
  };
}
module.exports = { verifyCurrentPassword };
