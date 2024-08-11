const express = require("express");
const mongoose = require("mongoose");
const { MongoConstants } = require("../../../constants");
const { UserRepository } = require("../../../repositories/UserRepository");
const { RoleRepository } = require("../../../repositories/RoleRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const {
  UserPreferenceRepository,
} = require("../../../repositories/UserPreferenceRepository");
const { SubSumService } = require("../../../services/SubSumService");
const { MailerService } = require("../../../services/MailerService");
const { QueueService } = require("../../../services/QueueService");
const {
  getUserProfile,
} = require("../../../useCases/users/profile/getUserProfile");
const {
  updateUserProfile,
} = require("../../../useCases/users/profile/updateUserProfile");
const {
  changePassword,
} = require("../../../useCases/users/profile/changePassword");
const { enableTwoFa } = require("../../../useCases/users/profile/enableTwoFa");
const { resetTwoFa } = require("../../../useCases/users/profile/resetTwoFa");
const {
  verifyCurrentPassword,
} = require("../../../useCases/users/profile/verifyCurrentPassword");
const { changeEmail } = require("../../../useCases/users/profile/changeEmail");
const {
  verifyChangeEmail,
} = require("../../../useCases/users/profile/verifyChangeEmail");
const { handle } = require("../../../utils/asyncHandler");
const {
  getUserSumSubToken,
} = require("../../../useCases/users/profile/getUserSumSubToken");
const {
  changeKycLevel,
} = require("../../../useCases/users/profile/changeKycLevel");
const {
  checkValidation,
  updateUserValidator,
  changePasswordValidator,
  verifyTwoFaValidator,
  verifyCurrentPasswordValidator,
  changeEmailValidator,
} = require("../../../validators");

const app = express.Router();

app.get(
  "/",
  handle(async (req, res) => {
    const userData = await getUserProfile(req.jwt.id, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
      userPreference: new UserPreferenceRepository(),
    });
    res.json(userData);
  })
);

app.put(
  "/",
  [updateUserValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const userData = await updateUserProfile(
        req?.jwt?.id,
        req?.body,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
          userPreferenceRepository: new UserPreferenceRepository(),
          subSumService: new SubSumService(),
        },
        session
      );
      res.json(userData);
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
  handle(async (req, res) => {
    const resp = await resetTwoFa(req.jwt.id, {
      userRepository: new UserRepository(),
    });

    res.json(resp);
  })
);

app.post(
  "/verifyResetTwoFa",
  [verifyTwoFaValidator, checkValidation],
  handle(async (req, res) => {
    const resp = await enableTwoFa(req.jwt.id, req.body, {
      userRepository: new UserRepository(),
    });
    res.json(resp);
  })
);

app.put(
  "/changeEmail",
  [changeEmailValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await changeEmail(
        req?.jwt?.id,
        req?.body?.normalEmail,
        req?.body?.emailToken,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
          queueService: new QueueService(),
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
  "/verifyChangeEmail/:token",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await verifyChangeEmail(
        req?.params?.token,
        req?.query?.verificationCode,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
          mailerService: new MailerService(),
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
  "/sumsubtoken",
  handle(async (req, res) => {
    const resp = await getUserSumSubToken(req.query.id, {
      subSumService: new SubSumService(),
    });

    res.json(resp);
  })
);
app.put(
  "/changeKYCLevel",
  handle(async (req, res) => {
    const resp = await changeKycLevel(req.body, {
      userRepository: new UserRepository(),
    });
    res.json(resp);
  })
);

module.exports = app;
