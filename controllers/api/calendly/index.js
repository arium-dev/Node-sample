const express = require("express");
const mongoose = require("mongoose");
const { handle } = require("../../../utils/asyncHandler");
const {
  checkEventSlot,
} = require("../../../useCases/calendely/checkEventSlot");
const {
  scheduleMeeting,
} = require("../../../useCases/calendely/scheduleMeeting");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const {
  EddVerificationRepository,
} = require("../../../repositories/EddVerificationRepository");
const { CalendlyService } = require("../../../services/CalendlyService");
const { QueueService } = require("../../../services/QueueService");
const {
  checkCalendlyBookValidator,
  scheduleMeetingValidator,
  checkValidation,
} = require("../../../validators");

const app = express.Router();

app.post(
  "/check",
  [checkCalendlyBookValidator, checkValidation],
  handle(async (req, res) => {
    const resp = await checkEventSlot(req.body, {
      eddVerificationRepository: new EddVerificationRepository(),
    });
    res.json(resp);
  })
);

app.post(
  "/schedule",
  [scheduleMeetingValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: "primary" },
    });
    session.startTransaction({
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });
    try {
      const resp = await scheduleMeeting(
        req.body,
        {
          transactionRepository: new TransactionRepository(),
          eddVerificationRepository: new EddVerificationRepository(),
          calendlyService: new CalendlyService(),
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
