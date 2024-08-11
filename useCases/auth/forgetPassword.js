const Errors = require("../../errors");
const {
  GenericMessages,
  UserConstants,
  HttpStatusCode,
  UserMessages,
  RoleMessages,
  UserStatus,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../constants");

async function forgetPassword(
  body,
  { userRepository, roleRepository, activityRepository, queueService },
  session
) {
  const obj = {
    $or: [
      {
        email: body.email,
      },
      {
        email: body.normalEmail,
      },
    ],
  };

  let user = await userRepository.findOne(obj);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.EMAIL_NOT_FOUND);
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new Errors.BadRequest(GenericMessages.ACCOUNT_SUSPENDED);
  }

  const role = await roleRepository.findOne({ _id: user.roleId });
  if (!role) {
    throw new Errors.BadRequest(RoleMessages.NOT_FOUND);
  }

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.FORGOT_PASSWORD,
      data: { userId: user.id },
    },
    QueueOptions
  );

  await activityRepository.addActivityLog(
    user?.id,
    user?.id,
    role?.name,
    null,
    UserConstants.FORGET_PASSWORD,
    null,
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: UserMessages.FORGET_PASSWORD_SUCCESS,
  };
}
module.exports = { forgetPassword };
