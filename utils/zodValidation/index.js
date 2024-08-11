const { z } = require("zod");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { dbId } = require("../zodUtils");
const { theresholdLimit } = require("../../config");
const { GenericConstants, TransactionStatus } = require("../../constants");

exports.activityValidator = {
  id: dbId.optional(),
  type: z.string(),
  activityType: z.string().optional(),
  message: z.string(),
  transactionId: z.instanceof(ObjectId).nullable().optional(),
  userId: z.instanceof(ObjectId).nullable().default(null),
  createdBy: z.instanceof(ObjectId).nullable().default(null),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
};
exports.roleValidator = {
  id: dbId.optional(),
  name: z.string().default(""),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
};

exports.userValidator = {
  id: dbId.optional(),
  firstName: z.string(),
  lastName: z.string(),
  dob: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email(),
  password: z.string().optional(),
  salt: z.string().optional(),
  status: z.string().optional(),
  twoFa: z
    .object({
      enabled: z.boolean().optional(),
      secret: z.string().optional(),
      tempSecret: z.string().optional(),
    })
    .optional()
    .default({
      enabled: false,
      secret: "",
      tempSecret: "",
    }),
  emailToken: z.string().optional(),
  roleId: z.instanceof(ObjectId).nullable().optional().default(null),
  uniqueId: z.string().optional(),
  ipAddress: z.string().optional(),
  level: z.number().optional(),
  refreshToken: z.string().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
};

exports.userPreferenceValidator = {
  id: dbId.optional(),
  deposit: z.object({
    eddVerified: z.boolean().default(false),
    threshold: z.string().default(theresholdLimit),
    isKycAlertEmail: z.boolean().default(false),
  }),
  userId: z.instanceof(ObjectId).nullable().optional().default(null),
};

exports.systemPreferenceValidator = {
  id: dbId.optional(),
  transactionFee: z.object({
    mode: z.string().default(GenericConstants.PERCENTAGE),
    value: z.string().default("1"),
  }),
  createdBy: z.instanceof(ObjectId).nullable().optional().default(null),
  updatedBy: z.instanceof(ObjectId).nullable().optional().default(null),
};

exports.walletValidator = {
  id: dbId.optional(),
  type: z.string().default(""),
  data: z
    .object({
      accountTitle: z.string().optional(),
      accountNumber: z.string().optional(),
      bsb: z.string().optional(),
    })
    .optional(),
  userId: z.instanceof(ObjectId).nullable().optional().default(null),
  createdBy: z.instanceof(ObjectId).nullable().optional(),
  updatedBy: z.instanceof(ObjectId).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deleted: z.boolean().default(false),
};

exports.balanceValidator = {
  id: dbId.optional(),
  balance: z.string().optional(),
  lock: z.string().optional(),
  userId: z.instanceof(ObjectId).nullable().optional().default(null),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
};

exports.currencyValidator = {
  id: dbId.optional(),
  name: z.string().default(""),
  symbol: z.string().default(""),
  code: z.string().default(""),
  logo: z.string().default(""),
  conversionRate: z.string().default(""),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
};

exports.userLogValidator = () => {
  return {
    id: dbId.optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    ip: z.string().optional(),
    os: z.string().optional(),
    device: z.string().optional(),
    browser: z.string().optional(),
    language: z.string().optional(),
    region: z.string().optional(),
    location: z.string().optional(),
    userId: z.instanceof(ObjectId).nullable(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  };
};

exports.batchValidator = () => {
  return {
    id: dbId.optional(),
    type: z.string().default(GenericConstants._WITHDRAW),
    status: z.string().default(TransactionStatus.UN_APPROVED),
    amount: z.string().default("0"),
    createdBy: z.instanceof(ObjectId).nullable().optional(),
    updatedBy: z.instanceof(ObjectId).nullable().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  };
};

exports.transactionValidator = () => {
  return {
    id: dbId.optional(),
    type: z.string().default(""),
    transactionId: z.string().default(""),
    status: z.string().default(TransactionStatus.PENDING),
    queueStatus: z.string().default(""),
    amount: z.string().default("0.0"),
    note: z.string().default(""),
    userId: z.instanceof(ObjectId).nullable().optional(),
    transactionDetails: z.record(z.any()),
    date: z.string().default(""),
    createdBy: z.instanceof(ObjectId).nullable().optional().default(null),
    updatedBy: z.instanceof(ObjectId).nullable().optional().default(null),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  };
};

exports.webhookValidator = () => {
  return {
    id: dbId.optional(),
    type: z.string().default(""),
    data: z.string().default(""),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  };
};

exports.eddVerificationValidator = () => {
  return {
    id: dbId.optional(),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    status: z.string().default(""),
    data: z.string().optional().default(""),
    note: z.string().optional().default(""),
    videoLink: z.string().optional().default(""),
    userId: z.instanceof(ObjectId).nullable(),
    threshold: z
      .object({
        previous: z.string(),
        new: z.string(),
      })
      .optional()
      .default({
        previous: "",
        new: "",
      }),
    edd: z
      .object({
        previous: z.boolean(),
        new: z.boolean(),
      })
      .optional()
      .default({
        previous: false,
        new: false,
      }),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  };
};

exports.permissionValidator = () => {
  return {
    id: dbId.optional(),
    module: z.string().default(""),
    action: z.string().default(""),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  };
};

exports.rolePermissionValidator = () => {
  return {
    id: dbId.optional(),
    roleId: z.instanceof(ObjectId),
    permissionId: z.instanceof(ObjectId),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  };
};
