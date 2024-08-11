const express = require("express");
const mongoose = require("mongoose");
const { handle } = require("../../../utils/asyncHandler");
const { authorizePermission } = require("../../../authorization");
const { Permissions, MongoConstants } = require("../../../constants");
const { UserRepository } = require("../../../repositories/UserRepository");
const { RoleRepository } = require("../../../repositories/RoleRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const {
  SystemPreferenceRepository,
} = require("../../../repositories/SystemPreferenceRepository");
const { getProfile } = require("../../../useCases/admins/settings/getProfile");
const {
  updateProfile,
} = require("../../../useCases/admins/settings/updateProfile");
const {
  changePassword,
} = require("../../../useCases/admins/settings/changePassword");
const {
  enableTwoFa,
} = require("../../../useCases/admins/settings/enableTwoFa");
const { resetTwoFa } = require("../../../useCases/admins/settings/resetTwoFa");
const {
  verifyCurrentPassword,
} = require("../../../useCases/admins/settings/verifyCurrentPassword");
const {
  updateTransactionFee,
} = require("../../../useCases/admins/settings/updateTransactionFee");
const {
  verifyTwoFa,
} = require("../../../useCases/admins/settings/verifyTwoFactor");
const {
  checkValidation,
  changePasswordValidator,
  verifyTwoFaValidator,
  verifyCurrentPasswordValidator,
  transactionFeeValidator,
  updateAdminProfileValidator,
  verificationCodeValidator,
} = require("../../../validators");

const app = express.Router();

app.get(
  "/",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_PROFILE_SETTING],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const profile = await getProfile(req.jwt.id, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
    });
    res.json(profile);
  })
);

app.put(
  "/",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.UPDATE_PROFILE_SETTING],
      req.jwt.permissions
    ),
  [updateAdminProfileValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const updatedProfile = await updateProfile(
        req?.jwt?.id,
        req?.body,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
        },
        session
      );
      res.json(updatedProfile);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.post(
  "/verifyCurrentPassword",
  [verifyCurrentPasswordValidator, checkValidation],
  handle(async (req, res) => {
    const resp = await verifyCurrentPassword(req.jwt.id, req.body, {
      userRepository: new UserRepository(),
    });
    res.json(resp);
  })
);

app.put(
  "/changePassword",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.CHANGE_PASSWORD_PROFILE_SETTING],
      req.jwt.permissions
    ),
  [changePasswordValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await changePassword(
        req?.jwt?.id,
        req?.body?.password,
        req?.body?.currentPassword,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
        },
        session
      );

      res.json(resp);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.get(
  "/resetTwoFa",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.RESET_TWO_FA_PROFILE_SETTING],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const resp = await resetTwoFa(req.jwt.id, {
      userRepository: new UserRepository(),
    });

    res.json(resp);
  })
);

app.post(
  "/verifyResetTwoFa",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.RESET_TWO_FA_PROFILE_SETTING],
      req.jwt.permissions
    ),
  [verifyTwoFaValidator, checkValidation],
  handle(async (req, res) => {
    const resp = await enableTwoFa(req.jwt.id, req.body, {
      userRepository: new UserRepository(),
    });
    res.json(resp);
  })
);

app.put(
  "/updateTransactionFee",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.UPDATE_TRANSACTION_FEE],
      req.jwt.permissions
    ),
  [transactionFeeValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const updatedProfile = await updateTransactionFee(
        req?.jwt?.id,
        req?.body,
        {
          systemPreference: new SystemPreferenceRepository(),
        },
        session
      );
      res.json(updatedProfile);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.post(
  "/verifyTwoFA",
  [verificationCodeValidator, checkValidation],
  handle(async (req, res) => {
    const admin = await verifyTwoFa(req?.jwt?.id, req.body, {
      userRepository: new UserRepository(),
    });
    res.json(admin);
  })
);

module.exports = app;
