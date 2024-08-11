const Errors = require("../errors");
const { handle } = require("../utils/asyncHandler");
const { GenericMessages, X_API_KEY } = require("../constants");
const { webhookApiKey } = require("../config");

const ensureApiKey = handle(async (req, _, next) => {
  if (!req.headers[X_API_KEY]) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_NOT_EXISTS);
  }

  if (
    typeof req.headers[X_API_KEY] !== "string" ||
    req.headers[X_API_KEY] !== webhookApiKey
  ) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }

  return next();
});

module.exports = { ensureApiKey };
