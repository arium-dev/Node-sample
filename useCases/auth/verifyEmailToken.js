const base64 = require("base-64");
const Errors = require("../../errors");
const { HttpStatusCode, UserMessages } = require("../../constants");

async function verifyEmailToken(token, { userRepository }) {
  try {
    if (!token) {
      throw new Errors.BadRequest(UserMessages.TOKEN_INVALID);
    }
    const decoded = await JSON.parse(base64.decode(token));

    if (!decoded.id || !decoded.type) {
      throw new Errors.BadRequest(UserMessages.TOKEN_INVALID);
    }

    const user = await userRepository.findOne({
      _id: decoded.id,
      emailToken: token,
    });

    if (!user) {
      throw new Errors.BadRequest(UserMessages.TOKEN_EXPIRED);
    }

    return {
      code: HttpStatusCode.OK,
      message: UserMessages.TOKEN_VERIFIED,
    };
  } catch (error) {
    throw new Errors.BadRequest(UserMessages.TOKEN_INVALID);
  }
}
module.exports = { verifyEmailToken };
