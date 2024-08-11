const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../errors");
const { addUserLog } = require("../users/userLogs/saveUserLogs");
const {
  GenericMessages,
  UserConstants,
  UserMessages,
  UserStatus,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../constants");
const { getPermissionsPipline } = require("../../utils");

async function authLogin(
  ip,
  body,
  {
    userRepository,
    userLogRepository,
    geolocationService,
    roleRepository,
    queueService,
  }
) {
  const { password, browser, device, os } = body;
  let user = await userRepository.findById(body.id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }
  if (user.status === UserStatus.SUSPENDED) {
    throw new Errors.BadRequest(GenericMessages.ACCOUNT_SUSPENDED);
  }
  if (user.status === UserStatus.DELETED) {
    throw new Errors.BadRequest(GenericMessages.ACCOUNT_DELETED);
  }
  if (!user.validatePassword(password)) {
    throw new Errors.BadRequest(UserMessages.INVALID_EMAIL_OR_PASSWORD);
  }

  const role = await roleRepository.findById(user?.roleId);

  if (role?.name === UserConstants.USER) {
    let geolocationInfo;
    let existingGeolocationInfo = {};

    if (ip) {
      const isIpChanged = Boolean(user?.ipAddress !== ip?.toString());

      if (isIpChanged || !user?.ipAddress) {
        geolocationInfo = await geolocationService.getGeolocationOfIp(ip);

        await queueService.addQueue(
          QueueType.MAIL,
          {
            type: QueueType.MAIL,
            subType: QueueSubType.CHANGE_IP_ADDRESS,
            data: { userId: user.id },
          },
          QueueOptions
        );
      } else {
        const existingLog = await userLogRepository.findOne({
          userId: user?.id,
          ip,
        });

        if (existingLog) {
          existingGeolocationInfo.language = existingLog?.language || "";
          existingGeolocationInfo.region = existingLog?.region || "";
          existingGeolocationInfo.location = existingLog?.location || "";
        }
      }
    }

    await addUserLog(
      user,
      userLogRepository,
      { browser, device, os },
      geolocationInfo,
      existingGeolocationInfo,
      ip
    );
  }

  user.ipAddress = ip;
  user = await userRepository.updateUser(user);

  let permissions = [];
  if (!user) {
    throw new Errors.InternalServerError(
      UserMessages.COULD_NOT_UPDATE_USER_INFO
    );
  } else {
    if (role?.name !== UserConstants.USER) {
      permissions = await userRepository.findByAggregation(
        getPermissionsPipline(new ObjectId(user.id))
      );

      permissions = permissions[0].permissions;
    }
  }

  if (user) {
    const tokens = user.generateTokens({ permissions }, role?.name);
    user.refreshToken = tokens.refreshToken;

    await userRepository.save(user);

    return tokens;
  } else {
    throw new Errors.InternalServerError(
      UserMessages.COULD_NOT_UPDATE_USER_INFO
    );
  }
}
module.exports = { authLogin };
