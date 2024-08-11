const Errors = require("../../errors");
const { isEmpty } = require("lodash");
const {
  UserMessages,
  HttpStatusCode,
  GenericMessages,
  UserStatus,
} = require("../../constants");

async function emailStatus(body, { userRepository }) {
  const { email, normalEmail } = body;

  if (!email) {
    throw new Errors.BadRequest(GenericMessages.INVALID_EMAIL);
  }
  const obj = {
    $or: [
      {
        email: email,
      },
      {
        email: normalEmail,
      },
    ],
  };
  let user = await userRepository.findOne(obj);
  if (isEmpty(user)) {
    throw new Errors.NotFound(UserMessages.ACCOUNT_NOT_FOUND);
  }

  if (user.status === UserStatus.VERIFIED) {
    return {
      code: HttpStatusCode.OK,
      message: UserMessages.EMAIL_VERIFIED,
    };
  } else throw new Errors.BadRequest(UserMessages.EMAIL_NOT_VERIFIED);
}
module.exports = { emailStatus };
