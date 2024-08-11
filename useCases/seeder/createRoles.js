const { Role } = require("../../models/Role");
const Errors = require("../../errors");
const { HttpStatusCode, GenericMessages } = require("../../constants");
const Roles = ["superAdmin", "user"];

async function createRoles({ roleRepository }) {
  const exists = await roleRepository.findOne({});
  if (exists) {
    throw new Errors.BadRequest(GenericMessages.RECORD_ALREADY_EXISTS);
  }
  let roles = [];
  for (let i = 0; i < Roles.length; i++) {
    const role = await roleRepository.save(new Role({ name: Roles[i] }));
    if (role) {
      roles.push(role);
    }
  }
  if (roles?.length === Roles?.length) {
    return {
      code: HttpStatusCode.OK,
    };
  } else {
    throw new Errors.BadRequest(GenericMessages.INTERNAL_SERVER_ERROR);
  }
}
module.exports = { createRoles };
