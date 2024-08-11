const express = require("express");
const { default: mongoose } = require("mongoose");
const { handle } = require("../../../utils/asyncHandler");
const { MongoConstants } = require("../../../constants");
const {
  EddVerificationRepository,
} = require("../../../repositories/EddVerificationRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { UserRepository } = require("../../../repositories/UserRepository");
const { QueueService } = require("../../../services/QueueService");
const {
  getAllVerifications,
} = require("../../../useCases/admins/eddVerifications/getAllVerifications");
const {
  updateLink,
} = require("../../../useCases/admins/eddVerifications/updateLink");
const { checkValidation, eddEmailValidator } = require("../../../validators");
const {
  sendEmail,
} = require("../../../useCases/admins/eddVerifications/sendEmail");
const {
  updateNote,
} = require("../../../useCases/admins/eddVerifications/updateNote");

const app = express.Router();

app.get(
  "/",
  handle(async (req, res) => {
    const resp = await getAllVerifications(req.query, {
      eddVerificationRepository: new EddVerificationRepository(),
    });
    res.json(resp);
  })
);

app.put(
  "/update-note/:id",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await updateNote(
        req.jwt.id,
        req.params.id,
        req.body,
        {
          userRepository: new UserRepository(),
          eddVerificationRepository: new EddVerificationRepository(),
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
  "/update-link/:id",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await updateLink(
        req.jwt.id,
        req.params.id,
        req.body,
        {
          userRepository: new UserRepository(),
          eddVerificationRepository: new EddVerificationRepository(),
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
  "/send-email/:id",
  [eddEmailValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const mail = await sendEmail(
        req.jwt.id,
        req.params.id,
        req.body,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
          eddVerificationRepository: new EddVerificationRepository(),
          queueService: new QueueService(),
        },
        session
      );
      res.json(mail);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

module.exports = app;
