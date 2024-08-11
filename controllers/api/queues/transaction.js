const express = require("express");
const mongoose = require("mongoose");
const { MongoConstants } = require("../../../constants");
const { handle } = require("../../../utils/asyncHandler");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const {
  BalanceRepository,
} = require("../../../repositories/BalanceRepository");
const { WalletRepository } = require("../../../repositories/WalletRepository");
const { BatchRepository } = require("../../../repositories/BatchRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const {
  UserPreferenceRepository,
} = require("../../../repositories/UserPreferenceRepository");
const { QueueService } = require("../../../services/QueueService");
const {
  manageDeposit,
} = require("../../../useCases/queue/deposit/manageDeposit");
const {
  dedTransaction,
} = require("../../../useCases/queue/deposit/dedTransaction");
const { withdraw } = require("../../../useCases/queue/withdraw/withdraw");
const {
  executeInvitationTransaction,
} = require("../../../useCases/queue/transfer/executeInvitationTransaction");
const {
  lockTransferBalance,
} = require("../../../useCases/queue/transfer/lockTransferBalance");
const {
  transferBalance,
} = require("../../../useCases/queue/transfer/transferBalance");
const {
  EddVerificationRepository,
} = require("../../../repositories/EddVerificationRepository");
const {
  depositApproved,
} = require("../../../useCases/queue/deposit/depositApproved");

const app = express.Router();

app.post(
  "/deposit",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });
    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await manageDeposit(
        req.body.data,
        {
          userRepository: new UserRepository(),
          walletRepository: new WalletRepository(),
          userPreferenceRepository: new UserPreferenceRepository(),
          transactionRepository: new TransactionRepository(),
          balanceRepository: new BalanceRepository(),
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

app.post(
  "/depositApproved",
  handle(async (req, res, next) => {
    // start transaction session
    // initialize a session
    const session = await mongoose.startSession({
      readPreference: { mode: "primary" },
    });
    //start transaction
    session.startTransaction({
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });

    try {
      const resp = await depositApproved(
        req.body.data,
        {
          transactionRepository: new TransactionRepository(),
          balanceRepository: new BalanceRepository(),
          queueService: new QueueService(),
        },
        session
      );

      res.json(resp);
    } catch (error) {
      console.log("error in manageDeposit catch>>>", error);
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.post(
  "/dishonours",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });
    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await dedTransaction(
        req.body.data,
        {
          userRepository: new UserRepository(),
          transactionRepository: new TransactionRepository(),
          batchRepository: new BatchRepository(),
          balanceRepository: new BalanceRepository(),
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

app.post(
  "/lockTransfer",
  handle(async (req, res, next) => {
    try {
      const resp = await lockTransferBalance(req?.body?.data, {
        transactionRepository: new TransactionRepository(),
        balanceRepository: new BalanceRepository(),
        userRepository: new UserRepository(),
        queueService: new QueueService(),
      });

      res.json(resp);
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/transfer",
  handle(async (req, res, next) => {
    try {
      const resp = await transferBalance(req?.body?.data, {
        transactionRepository: new TransactionRepository(),
        balanceRepository: new BalanceRepository(),
        activityRepository: new ActivityRepository(),
        userRepository: new UserRepository(),
        queueService: new QueueService(),
      });
      res.json(resp);
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/invitationPending",
  handle(async (req, res, next) => {
    try {
      const resp = await executeInvitationTransaction(req?.body?.data, {
        transactionRepository: new TransactionRepository(),
        activityRepository: new ActivityRepository(),
        queueService: new QueueService(),
      });

      res.json(resp);
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/withdraw",

  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });
    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await withdraw(
        req?.body?.data,
        {
          transactionRepository: new TransactionRepository(),
          balanceRepository: new BalanceRepository(),
          walletRepository: new WalletRepository(),
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
