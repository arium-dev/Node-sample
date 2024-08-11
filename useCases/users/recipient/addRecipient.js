const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { UserPreference } = require("../../../models/UserPreference");
const { User } = require("../../../models/User");
const { theresholdLimit } = require("../../../config");
const {
  singleRecordFacet,
  userDepositWallet,
} = require("../../../utils/searches");
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  RecipientMessages,
  UserConstants,
  Roles,
  RoleMessages,
  UserMessages,
  UserStatus,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../../constants");

const ObjectId = mongoose.Types.ObjectId;

const DefaultCurrency = "AUD";

async function createNewRecipient(
  userId,
  body,
  role,
  {
    userRepository,
    userPreferenceRepository,
    roleRepository,
    activityRepository,
    mailerService,
    balanceRepository,
    queueService,
  },
  session
) {
  let creatingUser = new User({
    firstName: body?.firstName,
    lastName: body?.lastName,
    dob: body?.dob || "",
    email: body?.normalEmail || body?.email,
    password: body?.password || "",
    uniqueId: uuidv4(),
    roleId: new ObjectId(role.id),
    createdBy: new ObjectId(userId),
  });

  if (body.password) creatingUser.setPassword(body.password);
  let userCreation = await userRepository.save(creatingUser, session);
  if (!userCreation) {
    throw new Errors.BadRequest(UserMessages.FAILED_TO_SAVE_USER);
  }

  await userPreferenceRepository.save(
    new UserPreference({
      deposit: {
        eddVerified: false,
        thereshold: theresholdLimit,
      },
      userId: new ObjectId(userCreation.id),
    }),
    session
  );

  await balanceRepository.create(
    {
      userId: new ObjectId(userCreation.id),
    },
    session
  );

  await activityRepository.addActivityLog(
    userCreation.id,
    userId,
    UserConstants.USER,
    null,
    UserConstants.USER_INVITED,
    {
      type: UserConstants.PROFILE,
      message: UserMessages.INVITED_USER(userCreation.email),
    },
    session
  );

  await queueService.addQueue(
    QueueType.MAIL,
    {
      type: QueueType.MAIL,
      subType: QueueSubType.INVITE_RECIPIENT,
      data: { userId: userCreation.id },
    },
    QueueOptions
  );

  return userCreation;
}

async function addRecipient(
  userId,
  data,
  {
    userRepository,
    userPreferenceRepository,
    roleRepository,
    activityRepository,
    balanceRepository,
    currencyRepository,
    mailerService,
    queueService,
  },
  session
) {
  let recipient = null;
  const user = await userRepository.findOne({
    email: data.normalEmail || data.email,
  });

  const role = await roleRepository.findOne({ name: Roles.USER });

  if (user?.id) {
    if (!role) {
      throw new Errors.NotFound(RoleMessages.NOT_FOUND);
    }

    if (user?.roleId?.toString() !== role?.id?.toString()) {
      throw new Errors.BadRequest(RecipientMessages.EMAIL_RECIPIENT_NOT_ADD);
    }

    throw new Errors.BadRequest(RecipientMessages.ALREADY_EXISTS);
  }

  if (user?.status === UserStatus.SUSPENDED) {
    throw new Errors.Forbidden(RecipientMessages.SUSPENDED);
  }
  if (user?.id?.toString() === userId?.toString()) {
    throw new Errors.Forbidden(RecipientMessages.CANNOT_ADD_YOURSELF);
  }

  recipient = await createNewRecipient(
    userId,
    data,
    role,
    {
      userRepository,
      userPreferenceRepository,
      roleRepository,
      activityRepository,
      mailerService,
      balanceRepository,
      queueService,
    },
    session
  );

  let currency = await currencyRepository.findOne({
    code: DefaultCurrency,
  });

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: RecipientMessages.ADDED_SUCCESS,
    data: { ...recipient, currency },
  };
}
module.exports = { addRecipient };
