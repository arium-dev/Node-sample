const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  UserMessages,
  GenericConstants,
  UserStatus,
  GenericMessages,
  ActivityMessages,
} = require("../../../constants");

const Suspension = {
  suspend: GenericConstants.SUSPEND_USER,
  recover: GenericConstants.RECOVER_USER,
};

const SuspensionMessage = {
  suspend: UserMessages.SUSPENDED,
  recover: UserMessages.RECOVERED,
};

async function manageUserSuspension(
  adminId,
  userId,
  body,
  { userRepository, activityRepository },
  session
) {
  const { status } = body;
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }
  if (status === GenericConstants.SUSPEND) {
    if (user.status === UserStatus.SUSPENDED) {
      throw new Errors.BadRequest(UserMessages.ALREADY_SUSPENDED);
    } else if (user.status !== UserStatus.VERIFIED) {
      throw new Errors.BadRequest(UserMessages.NOT_VERIFIED);
    }

    user.status = UserStatus.SUSPENDED;
  } else if (status === GenericConstants.RECOVER) {
    if (user.status !== UserStatus.SUSPENDED) {
      throw new Errors.BadRequest(UserMessages.RECOVER_FAILED);
    } else {
      user.status = UserStatus.VERIFIED;
    }
  }

  await userRepository.save(user, session);

  // await activityRepository.addActivityLog(
  //   user.id,
  //   adminId,
  //   GenericConstants.USER,
  //   null,
  //   GenericConstants.USER_SUSPENSION,
  //   {
  //     type: Suspension[status],

  //     message: ActivityMessages.SUSPENDED_BY_ADMIN(
  //       status === GenericConstants.SUSPEND
  //     ),
  //   },
  //   session
  // );
  await activityRepository.addActivityLog(
    user.id,
    adminId,
    GenericConstants.ADMIN,
    null,
    GenericConstants.USER_SUSPENSION,
    {
      type: Suspension[status],
      message: ActivityMessages.ADMIN_SUSPENDED_USER(
        user.email,
        status === GenericConstants.SUSPEND
      ),
    },
    session
  );

  await session.commitTransaction();
  await session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: SuspensionMessage[status],
  };
}

module.exports = { manageUserSuspension };
