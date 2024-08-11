const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../errors");
const { UserMessages, UserConstants } = require("../../constants");
const { getPermissionsPipline } = require("../../utils");

async function generateRefreshToken(
  { id, expiredAt },
  { userRepository, roleRepository }
) {
  let user = await userRepository.findById(id);
  if (!user) {
    throw new Errors.NotFound(UserMessages.ACCOUNT_NOT_FOUND);
  }

  const role = await roleRepository.findById(user?.roleId);

  let permissions = [];
  if (role?.name !== UserConstants.USER) {
    permissions = await userRepository.findByAggregration(
      getPermissionsPipline(new ObjectId(id))
    );
    permissions = permissions[0].permissions;
  }

  const tokens = user.generateTokens({ permissions, expiredAt }, role?.name);

  user.refreshToken = tokens.refreshToken;

  user = await userRepository.save(user);

  return tokens;
}
module.exports = { generateRefreshToken };
