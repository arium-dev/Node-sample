const Errors = require("../errors");
const { GenericMessages } = require("../constants");
const { isAuthorizedAction } = require("../utils");

function authorizePermission(role, next, actions, permissions) {
  if (isAuthorizedAction(actions, permissions, role)) return next();
  else throw new Errors.ExpectationFailed(GenericMessages.NOT_AUTHORIZED);
}

module.exports = { authorizePermission };
