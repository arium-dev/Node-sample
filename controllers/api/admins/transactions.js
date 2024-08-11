const express = require("express");
const { default: mongoose } = require("mongoose");
const { handle } = require("../../../utils/asyncHandler");
const {
  Permissions,
  TransactionStatus,
  MongoConstants,
} = require("../../../constants");
const {
  checkValidation,
  validateId,
  transactionStatusValidator,
  updateDepositValidator,
} = require("../../../validators");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { QueueService } = require("../../../services/QueueService");
const {
  approveTransaction,
} = require("../../../useCases/admins/transactions/approveTransaction");
const {
  getTransactions,
} = require("../../../useCases/admins/transactions/getTransactions");
const {
  getAllTransactionFee,
} = require("../../../useCases/admins/transactions/getAllTransactionFee");
const {
  getUserTransactions,
} = require("../../../useCases/admins/transactions/getUserTransactions");
const {
  fetchAllDeposits,
} = require("../../../useCases/admins/transactions/fetchAllDeposits");
const {
  fetchPendingDeposits,
} = require("../../../useCases/admins/transactions/fetchPendingDeposits");
const {
  generateDepositCsv,
} = require("../../../useCases/admins/transactions/generateDepositCsv");
const { authorizePermission } = require("../../../authorization");
const {
  updateDepositStatus,
} = require("../../../useCases/admins/transactions/updateDepositStatus");

const app = express.Router();

app.get(
  "/",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_TRANSACTION],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const resp = await getTransactions(req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.put(
  "/approveTransaction/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.APPROVE_TRANSACTION, Permissions.REJECT_TRANSACTION],
      req.jwt.permissions
    ),
  [transactionStatusValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });

    try {
      const resp = await approveTransaction(
        req.jwt.id,
        req.params.id,
        req.body,
        {
          transactionRepository: new TransactionRepository(),
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
  "/getUserTransactions/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_TRANSACTION],
      req.jwt.permissions
    ),
  [validateId, checkValidation],
  handle(async (req, res) => {
    const resp = await getUserTransactions(req.params.id, req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/getAllTransactionFee",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_TRANSACTION],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const resp = await getAllTransactionFee({
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/deposits",
  // add permissions later
  handle(async (req, res) => {
    const resp = await fetchAllDeposits(req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/generateDepositCsv",
  // add permissions later
  handle(async (_, res) => {
    const file = await generateDepositCsv({
      transactionRepository: new TransactionRepository(),
    });
    res.download(file);
  })
);

app.get(
  "/pendingDeposits",
  // add permissions later
  handle(async (req, res) => {
    const resp = await fetchPendingDeposits(req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/generatePendingDepositCsv",
  // add permissions later
  handle(async (_, res) => {
    const file = await generateDepositCsv({
      status: TransactionStatus.PENDING,
      transactionRepository: new TransactionRepository(),
    });
    res.download(file);
  })
);

app.put(
  "/updateDeposit/:id",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.APPROVE_PENDING_DEPOSIT, Permissions.REJECT_PENDING_DEPOSIT],
      req.jwt.permissions
    ),
  [updateDepositValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: "primary" },
    });

    session.startTransaction({
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    });

    try {
      const updateDeposit = await updateDepositStatus(
        req.params,
        req.body,
        req.jwt,
        {
          transactionRepository: new TransactionRepository(),
          queueService: new QueueService(),
        },
        session
      );
      res.json(updateDeposit);
    } catch (error) {
      console.log("error", error);
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

module.exports = app;
