const Errors = require("../errors");
const { token } = require("../config");
const { GenericMessages } = require("../constants");

function validateMonoovaWebhook(req, _, next) {
  if (token?.monoova !== req?.headers?.authorization) {
    throw new Errors.BadGateway(GenericMessages.TOKEN_IS_INVALID);
  }

  return next();
}

module.exports = { validateMonoovaWebhook };
