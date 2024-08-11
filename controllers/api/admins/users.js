const express = require("express");
const { default: mongoose } = require("mongoose");
const { handle } = require("../../../utils/asyncHandler");
const { authorizePermission } = require("../../../authorization");
const {
  Permissions,
  GenericConstants,
  MongoConstants,
  GENERIC_CONSTANTS,
} = require("../../../constants");
const {
  checkValidation,
  userStatusValidator,
  updateUserValidation,
} = require("../../../validators");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const {
  UserPreferenceRepository,
} = require("../../../repositories/UserPreferenceRepository");
const {
  EddVerificationRepository,
} = require("../../../repositories/EddVerificationRepository");
const {
  CurrencyRepository,
} = require("../../../repositories/CurrencyRepository");
const { UserRepository } = require("../../../repositories/UserRepository");
const { RoleRepository } = require("../../../repositories/RoleRepository");
const { WalletRepository } = require("../../../repositories/WalletRepository");
const { QueueService } = require("../../../services/QueueService");
const { MailerService } = require("../../../services/MailerService");
const { MonovaService } = require("../../../services/MonovaService");
const { SubSumService } = require("../../../services/SubSumService");
const { getAllUsers } = require("../../../useCases/admins/users/getAllUsers");
const {
  getUsersWithWallets,
} = require("../../../useCases/admins/users/getUsersWithWallets");
const {
  manageUserSuspension,
} = require("../../../useCases/admins/users/manageUserSuspension");

const {
  resendUserVerification,
} = require("../../../useCases/admins/users/resendUserVerification");
const {
  resetUserPassword,
} = require("../../../useCases/admins/users/resetUserPassword");
const {
  eddVerificationToggle,
} = require("../../../useCases/admins/users/eddVerificationToggle");

const {
  resetWithdrawalBank,
} = require("../../../useCases/admins/users/resetWIthdrawalBank");
const { approveKyc } = require("../../../useCases/admins/users/approveKyc");
const {
  createDepositWallet,
} = require("../../../useCases/admins/users/createDepositWallet");
const { updateUser } = require("../../../useCases/admins/users/updateUser");
const {
  changeKycStatus,
} = require("../../../useCases/admins/users/changeKycStatus");

const app = express.Router();

app.get(
  "/",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_USER],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const resp = await getAllUsers(req.query, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
      currencyRepository: new CurrencyRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/usersWallets",
  handle(async (_, res) => {
    const resp = await getUsersWithWallets({
      userRepository: new UserRepository(),
    });
    res.json(resp);
  })
);
app.put(
  "/:id",
  [updateUserValidation, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await updateUser(
        req.jwt.id,
        req.params.id,
        req.body,
        {
          userRepository: new UserRepository(),
          userPreferenceRepository: new UserPreferenceRepository(),
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

app.put(
  "/manage-suspension/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      req.body.status === GenericConstants.SUSPEND
        ? [Permissions.SUSPEND_USER]
        : [Permissions.UNSUSPEND_USER],
      req.jwt.permissions
    ),
  [userStatusValidator, checkValidation],

  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await manageUserSuspension(
        req.jwt.id,
        req.params.id,
        req.body,
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
  "/resend-verification/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.RESEND_SET_PASSWORD_EMAIL_USER],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const resp = await resendUserVerification(req.jwt.id, req.params.id, {
      userRepository: new UserRepository(),
      activityRepository: new ActivityRepository(),
      queueService: new QueueService(),
    });
    res.json(resp);
  })
);

app.get(
  "/reset-password/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.RESEND_RESET_PASSWORD_EMAIL_USER],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const resp = await resetUserPassword(req.jwt.id, req.params.id, {
      userRepository: new UserRepository(),
      activityRepository: new ActivityRepository(),
      queueService: new QueueService(),
    });
    res.json(resp);
  })
);

app.put(
  "/edd-status/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.EDD_VERIFIED_USER],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const session = await mongoose.startSession({
      readPreference: { mode: GENERIC_CONSTANTS.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });

    try {
      const resp = await eddVerificationToggle(
        req.jwt.id,
        req.params.id,
        {
          userRepository: new UserRepository(),
          userPreferenceRepository: new UserPreferenceRepository(),
          eddVerificationRepository: new EddVerificationRepository(),
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

app.put(
  "/bank-reset/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.RESET_WITHDRAW_BANK_USER],
      req.jwt.permissions
    ),
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await resetWithdrawalBank(
        req.jwt.id,
        req.params.id,
        {
          userRepository: new UserRepository(),
          walletRepository: new WalletRepository(),
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

app.put(
  "/approve-kyc/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.UPDATE_KYC_STATUS_USER],
      req.jwt.permissions
    ),
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await approveKyc(
        req.jwt.id,
        {
          userRepository: new UserRepository(),
          queueService: new QueueService(),
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

app.put(
  "/change-kyc-status/:id",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await changeKycStatus(
        req.params.id,
        req.jwt.id,
        req.body,
        {
          userRepository: new UserRepository(),
          queueService: new QueueService(),
          activityRepository: new ActivityRepository(),
          subSumService: new SubSumService(),
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
  "/generate-deposit-bank/:id",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await createDepositWallet(
        req.jwt.id,
        req.params.id,
        {
          userRepository: new UserRepository(),
          walletRepository: new WalletRepository(),
          monovaService: new MonovaService(),
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

module.exports = app;
