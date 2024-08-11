const moment = require("moment");
const Errors = require("../errors");
const { decryptData } = require("../utils/EncryptDecrypt");
const JWT = require("../utils/jwt");
const { handle } = require("../utils/asyncHandler");
const { UserRepository } = require("../repositories/UserRepository");
const {
  GenericMessages,
  GenericConstants,
  UserMessages,
} = require("../constants");

const ensureRefreshToken = handle(async (req, _, next) => {
  const refreshToken = req.cookies[GenericConstants.REFRESH_TOKEN];
  if (!refreshToken) {
    throw new Errors.ExpectationFailed(GenericMessages.ACCESS_DENIED);
  }

  // check refresh token expired or not
  const userRepository = new UserRepository();
  let record = await userRepository.findOne({ refreshToken });

  if (!record) {
    throw new Errors.ExpectationFailed(UserMessages.TOKEN_EXPIRED);
  }

  req.token = JWT.verifyRefreshToken(decryptData(refreshToken));

  if (req.token.expiredAt) {
    const current = moment();
    const expiredAt = moment(req.token.expiredAt);
    if (!current.isBefore(expiredAt)) {
      throw new Errors.ExpectationFailed(UserMessages.TOKEN_EXPIRED);
    }
  }

  if (!req.token) {
    throw new Errors.ExpectationFailed(UserMessages.TOKEN_EXPIRED);
  }
  return next();
});

module.exports = { ensureRefreshToken };
