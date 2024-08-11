const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const { HttpStatusCode, GenericMessages } = require("../../../constants");

async function getUserProfile(
  id,
  { userRepository, roleRepository, userPreference }
) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }
  const role = await roleRepository.findOne({ _id: new ObjectId(user.roleId) });
  const preference = await userPreference.findOne({
    userId: new ObjectId(user?.id),
  });

  return {
    code: HttpStatusCode.OK,
    data: {
      ...user.toProfile(),
      role: role?.name || "",
      threshold: preference?.deposit?.threshold || "",
    },
  };
}

module.exports = { getUserProfile };
