const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  RecipientMessages,
  Roles,
  RoleMessages,
} = require("../../../constants");

async function getRecipientByEmail(
  userId,
  body,
  { userRepository, roleRepository }
) {
  const { normalEmail } = body;
  const user = await userRepository.findOne({ email: normalEmail });
  if (!user) {
    throw new Errors.NotFound(RecipientMessages.NOT_FOUND);
  }

  const role = await roleRepository.findOne({ name: Roles.USER });

  if (user?.roleId?.toString() !== role?.id?.toString()) {
    throw new Errors.Conflict(RecipientMessages.EMAIL_RECIPIENT_NOT_ADD);
  }

  if (user?.id?.toString() === userId?.toString()) {
    throw new Errors.Conflict(RecipientMessages.CANNOT_ADD_YOURSELF);
  }

  if (!role) {
    throw new Errors.BadRequest(RoleMessages.NOT_FOUND);
  }

  if (user?.roleId?.toString() !== role?.id?.toString()) {
    throw new Errors.BadRequest(RecipientMessages.EMAIL_RECIPIENT_NOT_ADD);
  }

  return {
    code: HttpStatusCode.OK,
    message: RecipientMessages.FETCHED_SUCCESS,
    data: { ...user.toProfile(), recipientId: user?.id },
  };
}
module.exports = { getRecipientByEmail };
