const Errors = require("../errors");
const { sumSubKeys } = require("../config");
const { GenericMessages } = require("../constants");

function validateSumsubWebhook(req, _, next) {
  if (req.headers["sumsub-key"] !== sumSubKeys.sumSubSecretKeys) {
    throw new Errors.BadGateway(GenericMessages.INVALID_WEBHOOK_HEADERS);
  }
  return next();
}

module.exports = { validateSumsubWebhook };
