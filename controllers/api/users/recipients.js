const express = require("express");
const { default: mongoose } = require("mongoose");
const { MongoConstants } = require("../../../constants");
const { handle } = require("../../../utils/asyncHandler");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  CurrencyRepository,
} = require("../../../repositories/CurrencyRepository");
const {
  BalanceRepository,
} = require("../../../repositories/BalanceRepository");
const { MailerService } = require("../../../services/MailerService");
const { QueueService } = require("../../../services/QueueService");
const {
  getRecipientByEmail,
} = require("../../../useCases/users/recipient/getRecipientByEmail");
const { RoleRepository } = require("../../../repositories/RoleRepository");
const {
  addRecipient,
} = require("../../../useCases/users/recipient/addRecipient");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { GENERIC_CONSTANTS } = require("../../../constants");
const {
  UserPreferenceRepository,
} = require("../../../repositories/UserPreferenceRepository");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const { emailValidation, checkValidation } = require("../../../validators");

const app = express.Router();

app.post(
  "/getRecipientByEmail",
  [emailValidation, checkValidation],
  handle(async (req, res, next) => {
    try {
      const resp = await getRecipientByEmail(req.jwt.id, req.body, {
        userRepository: new UserRepository(),
        roleRepository: new RoleRepository(),
      });
      res.json(resp);
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/",
  [emailValidation, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await addRecipient(
        req.jwt.id,
        req.body,
        {
          userRepository: new UserRepository(),
          userPreferenceRepository: new UserPreferenceRepository(),
          roleRepository: new RoleRepository(),
          activityRepository: new ActivityRepository(),
          balanceRepository: new BalanceRepository(),
          currencyRepository: new CurrencyRepository(),
          mailerService: new MailerService(),
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

module.exports = app;
