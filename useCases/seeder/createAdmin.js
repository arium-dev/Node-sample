const Errors = require("../../errors");
const { adminCredentials } = require("../../config");
const { User } = require("../../models/User");
const { ObjectId } = require("mongodb");
const { UserMessages, Roles, RoleMessages } = require("../../constants");

async function createAdmin({ userRepository, roleRepository }) {
  let user = await userRepository.findOne({
    email: adminCredentials.EMAIL,
  });
  if (user) {
    throw new Errors.BadRequest(UserMessages.EMAIL_ALREADY_EXIST);
  }

  const role = await roleRepository.findOne({ name: Roles.SUPER_ADMIN });

  if (!role) {
    throw new Errors.NotFound(RoleMessages.NOT_FOUND);
  }

  let creatingUser = new User({
    firstName: adminCredentials?.FIRST_NAME || "",
    lastName: adminCredentials?.LAST_NAME || "",
    email: adminCredentials.EMAIL,
    password: adminCredentials?.PASSWORD || "",
    roleId: new ObjectId(role.id),
    createdBy: null,
  });

  creatingUser.setPassword(adminCredentials?.PASSWORD);
  let userCreation = await userRepository.save(creatingUser);
  if (!userCreation) {
    throw new Errors.BadRequest(UserMessages.FAILED_TO_SAVE_USER);
  }
}
module.exports = { createAdmin };
