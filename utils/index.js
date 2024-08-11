const base64 = require("base-64");
const moment = require("moment");
const { GenericConstants, ResendEmailLimit } = require("../constants");

exports.MIN_WITHDRAWAL_AMOUNT = 10;
exports.MAX_WITHDRAWAL_AMOUNT = 100000000;

exports.allAdminRoles = [
  GenericConstants._ADMIN,
  GenericConstants._SUPER_ADMIN,
  GenericConstants._SUPERVISOR,
];

exports.decoder = async (value) => {
  try {
    if (!value) return null;
    const decoded = await JSON.parse(base64.decode(value));
    return decoded;
  } catch (error) {
    return null;
  }
};

exports.encoder = async (data) => {
  try {
    if (!data) return null;
    const encoded = await base64.encode(JSON.stringify(data));
    return encoded;
  } catch (error) {
    return null;
  }
};

exports.hideAccountNumber = (number) => {
  const numString = number.toString();

  const length = numString.length;

  const lastFourDigits = numString.substring(length - 4);

  const hiddenPrefix = "*".repeat(length - 4);

  const hiddenNumber = hiddenPrefix + lastFourDigits;

  return hiddenNumber;
};

exports.hideBSB = (number) => {
  const parts = number.split("-");

  const suffix = parts[1];

  const hiddenPrefix = "***";

  const hiddenNumber = hiddenPrefix + "-" + suffix;

  return hiddenNumber;
};

exports.formatDateOnly = (date) => {
  return date ? moment(date).format(GenericConstants.DATE_FORMAT) : "";
};

exports.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.isWithinTime = (value, limit) => {
  const currentTimestamp = moment().valueOf();
  const difference = Math.abs(currentTimestamp - value);

  return difference <= limit;
};

exports.getRemainingResendTime = (value) => {
  const currentTimestamp = moment().valueOf();

  return Math.floor(
    ResendEmailLimit / 1000 -
      moment.duration(currentTimestamp - value).asSeconds()
  );
};

exports.getPermissionsPipline = (id) => [
  {
    $match: {
      _id: id,
    },
  },

  {
    $lookup: {
      from: "rolepermissions",
      localField: "roleId",
      foreignField: "roleId",
      as: "rolepermissions",
    },
  },
  {
    $addFields: {
      permissionId: "$rolepermissions.permissionId",
    },
  },
  {
    $lookup: {
      from: "permissions",
      localField: "permissionId",
      foreignField: "_id",
      as: "permissions",
    },
  },
  {
    $addFields: {
      permissions: "$permissions.action",
    },
  },
];

exports.isAuthorizedAction = (actions = [], permissions = [], role = "") => {
  if (role === GenericConstants._SUPER_ADMIN) return true;
  else return actions.some((action) => permissions.includes(action));
};
