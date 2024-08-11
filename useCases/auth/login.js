const Errors = require("../../errors");
const {
  GenericMessages,
  UserMessages,
  RoleMessages,
  UserStatus,
} = require("../../constants");

async function login(body, { userRepository, roleRepository }) {
  const { email, normalEmail, password } = body;
  let { allowedRoles } = body;

  allowedRoles = allowedRoles && JSON.parse(allowedRoles);

  const obj = {
    $or: [
      {
        email: email,
      },
      {
        email: normalEmail,
      },
    ],
  };

  let user;
  user = await userRepository.findOne(obj);
  if (!user) {
    throw new Errors.BadRequest(UserMessages.INVALID_EMAIL_OR_PASSWORD);
  }
  if (!user.validatePassword(password)) {
    throw new Errors.BadRequest(UserMessages.INVALID_EMAIL_OR_PASSWORD);
  }
  if (user.status === UserStatus.SUSPENDED) {
    throw new Errors.BadRequest(GenericMessages.ACCOUNT_SUSPENDED);
  }
  if (user.status === UserStatus.DELETED) {
    throw new Errors.BadRequest(GenericMessages.ACCOUNT_DELETED);
  }

  const role = await roleRepository.findOne({ _id: user.roleId });

  if (!allowedRoles?.includes(role?.name)) {
    throw new Errors.BadRequest(RoleMessages.UNAUTHORIZED);
  }

  if (!role) {
    throw new Errors.BadRequest(RoleMessages.NOT_FOUND);
  }

  if (user.email !== normalEmail) {
    user.email = normalEmail;
    await userRepository.save(user);
  }
  return {
    data: {
      userInfo: user.toUserInfo({}),
      loginKey: user.toLoginKey(password),
    },
  };
}
module.exports = { login };
