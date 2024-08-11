const Errors = require("../../../errors");
const { HttpStatusCode, GenericMessages } = require("../../../constants");

async function getProfile(id, { userRepository, roleRepository }) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }
  const role = await roleRepository.findOne({ _id: user.roleId });

  return {
    code: HttpStatusCode.OK,
    data: { ...user.toProfile(), role: role.name },
  };
}

module.exports = { getProfile };
