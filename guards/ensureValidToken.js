const { UserRepository } = require("../repositories/UserRepository");
const Errors = require("../errors");
const JWT = require("../utils/jwt");
const { handle } = require("../utils/asyncHandler");
const { decryptData } = require("../utils/EncryptDecrypt");
const {
  GenericMessages,
  UserMessages,
  UserStatus,
  GenericConstants,
} = require("../constants");

const ensureValidToken = handle(async (req, _, next) => {
  if (!req.headers[GenericConstants.AUTHORIZATION]) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_NOT_EXISTS);
  }

  if (typeof req.headers.authorization !== "string") {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }

  let authorization = req.headers[GenericConstants.AUTHORIZATION].split(" ");

  if (authorization[0] !== GenericConstants.BEARER) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_NOT_EXISTS);
  }

  let token = decryptData(authorization[1]);
  let permissions = [];
  if (token && token.permissions) {
    permissions = token.permissions;
  }
  if (token && token.token) {
    token = token.token;
  }

  req.jwt = JWT.verifyAccessToken(token);

  if (!(req.jwt && req.jwt.id)) {
    throw new Errors.Unauthorized(UserMessages.TOKEN_EXPIRED);
  }
  req.jwt.permissions = permissions;

  // check the user/admin suspended or deleted or not
  const userRepository = new UserRepository();
  let record = await userRepository.findById(req.jwt.id);

  if (!(record && record.id)) {
    throw new Errors.Unauthorized(UserMessages.TOKEN_INVALID);
  }

  if (record.status === UserStatus.SUSPENDED) {
    throw new Errors.ExpectationFailed(GenericMessages.SUSPENDED_ALERT);
  }

  if (record.status === UserStatus.DELETED) {
    throw new Errors.ExpectationFailed(GenericMessages.DELETION_ALERT);
  }

  return next();
});

module.exports = { ensureValidToken };
