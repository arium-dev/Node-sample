const express = require("express");
const mongoose = require("mongoose");
const { MongoConstants } = require("../../../constants");
const { handle } = require("../../../utils/asyncHandler");
const { UserRepository } = require("../../../repositories/UserRepository");
const { BatchRepository } = require("../../../repositories/BatchRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const {
  BalanceRepository,
} = require("../../../repositories/BalanceRepository");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const { WalletRepository } = require("../../../repositories/WalletRepository");
const {
  CurrencyRepository,
} = require("../../../repositories/CurrencyRepository");
const {
  CurrencyExchangeService,
} = require("../../../services/CurrencyExchangeService");
const {
  SystemPreferenceRepository,
} = require("../../../repositories/SystemPreferenceRepository");
const { QueueService } = require("../../../services/QueueService");
const {
  createFiatWithdraw,
} = require("../../../useCases/users/transaction/createFiatWithdraw");
const {
  getTransactions,
} = require("../../../useCases/users/transaction/getTransactions");
const {
  createTransfer,
} = require("../../../useCases/users/transaction/createTransfer");
const {
  generateWithdrawTransactions,
} = require("../../../useCases/users/transaction/generateWithdrawTransactions");
const {
  fetchDepositTransactions,
} = require("../../../useCases/users/transaction/fetchDepositTransactions");
const {
  fetchWithdrawTransactions,
} = require("../../../useCases/users/transaction/fetchWithdrawTransactions");
const {
  fetchIncomeOutcome,
} = require("../../../useCases/users/transaction/fetchIncomeOutcome");
const {
  checkValidation,
  withdrawValidator,
  transferValidator,
} = require("../../../validators");

const app = express.Router();

app.get(
  "/",
  handle(async (req, res) => {
    const resp = await getTransactions(req.jwt.id, req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/deposits",
  handle(async (req, res) => {
    const resp = await fetchDepositTransactions(req.jwt.id, req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/withdrawals",
  handle(async (req, res) => {
    const resp = await fetchWithdrawTransactions(req.jwt.id, req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/withdrawals/generate",
  handle(async (req, res) => {
    const resp = await generateWithdrawTransactions(req.jwt.id, {
      transactionRepository: new TransactionRepository(),
    });
    res.download(resp);
  })
);

app.post(
  "/withdraws",
  [withdrawValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });
    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await createFiatWithdraw(
        req.jwt.id,
        req.body,
        {
          userRepository: new UserRepository(),
          transactionRepository: new TransactionRepository(),
          currencyRepository: new CurrencyRepository(),
          batchRepository: new BatchRepository(),
          balanceRepository: new BalanceRepository(),
          walletRepository: new WalletRepository(),
          queueService: new QueueService(),
        },
        session
      );

      res.json(resp);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  })
);

app.post(
  "/transfer",
  [transferValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });
    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await createTransfer(
        req.jwt.id,
        req.body,
        {
          userRepository: new UserRepository(),
          currencyRepository: new CurrencyRepository(),
          currencyService: new CurrencyExchangeService(),
          balanceRepository: new BalanceRepository(),
          transactionRepository: new TransactionRepository(),
          systemPreferenceRepository: new SystemPreferenceRepository(),
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
  "/income-outcome",
  handle(async (req, res) => {
    const resp = await fetchIncomeOutcome(req.jwt.id, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

module.exports = app;
