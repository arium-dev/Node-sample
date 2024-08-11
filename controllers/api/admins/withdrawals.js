const express = require("express");
const mongoose = require("mongoose");
const { MongoConstants } = require("../../../constants");
const { handle } = require("../../../utils/asyncHandler");
const {
  createBatchWithDrawValidator,
  updateBatchWithDrawValidator,
  updateStatusWithdrawalValidator,
  checkValidation,
} = require("../../../validators");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const { WalletRepository } = require("../../../repositories/WalletRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { UserRepository } = require("../../../repositories/UserRepository");
const { BatchRepository } = require("../../../repositories/BatchRepository");
const { MonovaService } = require("../../../services/MonovaService");
const { QueueService } = require("../../../services/QueueService");
const {
  getAllWithdraws,
} = require("../../../useCases/admins/transactions/withdrawals/getAllWithdraws");
const {
  createBatchWithDrawal,
} = require("../../../useCases/admins/transactions/withdrawals/createBatchWithDrawal");
const {
  getWithdrawsByBachId,
} = require("../../../useCases/admins/transactions/withdrawals/getWithdrawsByBachId");
const {
  updateBatchWithDrawal,
} = require("../../../useCases/admins/transactions/withdrawals/updateBatchWithDrawal");
const {
  updateBatchWithdrawStatus,
} = require("../../../useCases/admins/transactions/withdrawals/updateBatchWithdrawStatus");
const {
  getBatchWithdrawals,
} = require("../../../useCases/admins/transactions/withdrawals/getBatchWithdrawals");

const app = express.Router();

app.get(
  "/batch",
  handle(async (req, res) => {
    const withdrawals = await getBatchWithdrawals(req.query, {
      batchRepository: new BatchRepository(),
    });
    res.json(withdrawals);
  })
);

app.get(
  "/withdraw",
  handle(async (req, res) => {
    const withdrawals = await getAllWithdraws(req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(withdrawals);
  })
);

app.get(
  "/withdraw/:batchId",
  handle(async (req, res) => {
    const withdrawals = await getWithdrawsByBachId(req.params?.batchId, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(withdrawals);
  })
);

app.post(
  "/",
  [createBatchWithDrawValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const batchWithdrawal = await createBatchWithDrawal(
        req.jwt,
        req.body,
        {
          batchRepository: new BatchRepository(),
          transactionRepository: new TransactionRepository(),
          walletRepository: new WalletRepository(),
          activityRepository: new ActivityRepository(),
          userRepository: new UserRepository(),
        },
        session
      );
      res.json(batchWithdrawal);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.put(
  "/:id",
  [updateBatchWithDrawValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const batchWithdrawal = await updateBatchWithDrawal(
        req.jwt,
        req.body,
        req.params,
        {
          batchRepository: new BatchRepository(),
          transactionRepository: new TransactionRepository(),
          walletRepository: new WalletRepository(),
          activityRepository: new ActivityRepository(),
          userRepository: new UserRepository(),
        },
        session
      );
      res.json(batchWithdrawal);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.put(
  "/proceedWithdraw/:id",
  [updateStatusWithdrawalValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const batchWithdrawal = await updateBatchWithdrawStatus(
        req.jwt,
        req.body,
        req.params,
        {
          batchRepository: new BatchRepository(),
          transactionRepository: new TransactionRepository(),
          activityRepository: new ActivityRepository(),
          monovaService: new MonovaService(),
          queueService: new QueueService(),
        },
        session
      );
      res.json(batchWithdrawal);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);
module.exports = app;
