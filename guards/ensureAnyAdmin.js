const Errors = require("../errors");
const { GenericMessages } = require("../constants");
const { allAdminRoles } = require("../utils");
const { RoleRepository } = require("../repositories/RoleRepository");

async function ensureAnyAdmin(req, _, next) {
  try {
    const roleRepository = new RoleRepository();
    const role = await roleRepository.findOne({ _id: req?.jwt?.roleId });
    if (!allAdminRoles.includes(role?.name)) {
      throw new Errors.ExpectationFailed(GenericMessages.NOT_AUTHORIZED);
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { ensureAnyAdmin };
