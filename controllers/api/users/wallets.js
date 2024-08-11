const express = require("express");
const mongoose = require("mongoose");
const { MongoConstants } = require("../../../constants");
const { handle } = require("../../../utils/asyncHandler");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { WalletRepository } = require("../../../repositories/WalletRepository");
const {
  SystemPreferenceRepository,
} = require("../../../repositories/SystemPreferenceRepository");
const {
  CurrencyRepository,
} = require("../../../repositories/CurrencyRepository");
const {
  CurrencyExchangeService,
} = require("../../../services/CurrencyExchangeService");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const { QueueService } = require("../../../services/QueueService");
const {
  BalanceRepository,
} = require("../../../repositories/BalanceRepository");
const { MonovaService } = require("../../../services/MonovaService");
const { getFee } = require("../../../useCases/users/wallet/getFee");
const {
  createDepositWallet,
} = require("../../../useCases/users/wallet/createDepositWallet");
const {
  getAllWallets,
} = require("../../../useCases/users/wallet/getAllWallets");
const { getBalance } = require("../../../useCases/users/wallet/getBalance");
const {
  createWithdrawWallet,
} = require("../../../useCases/users/wallet/createWithdrawWallet");
const {
  checkValidation,
  withdrawlBankAccountValidator,
  transferValidator,
} = require("../../../validators");

const app = express.Router();

app.get(
  "/",
  handle(async (req, res, next) => {
    try {
      const resp = await getAllWallets(req.jwt.id, {
        walletRepository: new WalletRepository(),
      });
      res.json(resp);
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/createDepositWallet",
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
        {
          userRepository: new UserRepository(),
          walletRepository: new WalletRepository(),
          activityRepository: new ActivityRepository(),
          monovaService: new MonovaService(),
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
  "/createWithdrawalWallet",
  [withdrawlBankAccountValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });
    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await createWithdrawWallet(
        req.jwt.id,
        req.body,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
          walletRepository: new WalletRepository(),
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

app.get(
  "/getBalance",
  handle(async (req, res, next) => {
    try {
      const resp = await getBalance(req.jwt.id, {
        balanceRepository: new BalanceRepository(),
      });
      res.json(resp);
    } catch (error) {
      next(error);
    }
  })
);

app.get(
  "/getTransactionFee",
  handle(async (req, res, next) => {
    try {
      const resp = await getFee({
        systemRepository: new SystemPreferenceRepository(),
      });
      res.json(resp);
    } catch (error) {
      next(error);
    }
  })
);

module.exports = app;
