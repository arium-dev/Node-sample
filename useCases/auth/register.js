const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { isEmpty } = require("lodash");
const Errors = require("../../errors");
const { User } = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const {
  HttpStatusCode,
  UserConstants,
  UserMessages,
  RoleMessages,
  Roles,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../constants");
const { UserPreference } = require("../../models/UserPreference");
const { theresholdLimit } = require("../../config");

async function register(
  body,
  {
    userRepository,
    userPeferenceRepository,
    roleRepository,
    activityRepository,
    balanceRepository,
    googleRecaptchaService,
    queueService,
  },
  session
) {
  let resRecaptcha = await googleRecaptchaService.verifyGoogleRecaptcha(
    body?.captchaToken,
    body?.normalEmail || body?.email
  );
  if (resRecaptcha?.code !== HttpStatusCode.OK) {
    throw new Errors.BadGateway(UserMessages.INVALID_RECAPTCHA, {
      error: resRecaptcha?.data,
      payload: {
        firstName: body?.firstName,
        lastName: body?.lastName,
        email: body?.normalEmail || body?.email,
      },
    });
  }

  const obj = {
    $or: [
      {
        email: body?.email,
      },
      {
        email: body?.normalEmail,
      },
    ],
  };

  let user = null;
  user = await userRepository.findOne(obj);
  if (!isEmpty(user)) {
    throw new Errors.Conflict(UserMessages.EMAIL_ALREADY_EXIST);
  }

  const role = await roleRepository.findOne({ name: Roles.USER });

  if (!role) {
    throw new Errors.NotFound(RoleMessages.NOT_FOUND);
  }

  let creatingUser = new User({
    firstName: body?.firstName,
    lastName: body?.lastName,
    dob: body?.dob || "",
    email: body?.normalEmail || body?.email,
    password: body?.password || "",
    uniqueId: uuidv4(),
    roleId: new ObjectId(role.id),
    createdBy: null,
  });

  if (body.password) creatingUser.setPassword(body.password);
  let userCreation = await userRepository.save(creatingUser, session);
  if (!userCreation) {
    throw new Errors.BadRequest(UserMessages.FAILED_TO_SAVE_USER);
  }

  await userPeferenceRepository.save(
    new UserPreference({
      deposit: {
        eddVerified: false,
        thereshold: theresholdLimit,
      },
      userId: new ObjectId(userCreation.id),
    }),
    session
  );

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.CREATE_ACCOUNT,
      data: { userId: userCreation.id },
    },
    QueueOptions
  );

  await balanceRepository.create(
    {
      userId: new ObjectId(userCreation.id),
    },
    session
  );

  await activityRepository.addActivityLog(
    userCreation.id,
    userCreation.id,
    UserConstants.USER,
    null,
    UserConstants.USER_CREATED,
    {
      type: UserConstants.PROFILE,
      message: UserMessages.ACCOUNT_CREATED_SUCCESS,
    },
    session
  );

  const userInfo = userCreation.toUserInfo({});
  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    data: userInfo,
    message: UserMessages.REGISTER_ACCOUNT_SUCCESS,
  };
}
module.exports = { register };
