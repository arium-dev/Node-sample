const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  GenericConstants,
} = require("../../../constants");
const moment = require("moment");
const { encoder } = require("../../../utils");

async function verifyCurrentPassword(id, body, { userRepository }) {
  if (!id) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }

  const user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  if (!user.validatePassword(body.currentPassword)) {
    throw new Errors.BadRequest(GenericMessages.INVALID_PASSWORD);
  }

  const data = {
    email: user.email,
    type: GenericConstants.ADMIN,
    id: user.id,
    dateTime: moment().valueOf(),
  };

  const emailToken = await encoder(data);
  user.emailToken = emailToken;
  const isUpdated = await userRepository.save(user);

  if (!isUpdated) {
    throw new Errors.InternalServerError(
      GenericMessages.FAILED_PASSWORD_VERIFY
    );
  }

  return {
    code: HttpStatusCode.OK,
    data: {
      emailToken,
    },
  };
}
module.exports = { verifyCurrentPassword };
