const express = require("express");
const { handle } = require("../../../utils/asyncHandler");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const { UserRepository } = require("../../../repositories/UserRepository");
const { MonovaService } = require("../../../services/MonovaService");
const {
  getBalances,
} = require("../../../useCases/admins/dashboard/getBalances");
const {
  fetchDashboardCharts,
} = require("../../../useCases/admins/dashboard/fetchDashboardCharts");
const {
  fetchDashboardDetails,
} = require("../../../useCases/admins/dashboard/fetchDashboardDetails");
const {
  fetchingPendingTransactions,
} = require("../../../useCases/admins/dashboard/fetchingPendingTransactions");
const {
  fetchingTransactionSummary,
} = require("../../../useCases/admins/dashboard/fetchingTransactionSummary");

const app = express.Router();

app.get(
  "/getBalances",
  handle(async (req, res) => {
    const resp = await getBalances({
      monoovaService: new MonovaService(),
      transactionRepository: new TransactionRepository(),
    });

    res.json(resp);
  })
);

app.get(
  "/dashBoardCharts",
  handle(async (req, res) => {
    const resp = await fetchDashboardCharts(req.query, {
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);
app.get(
  "/dashBoardDetails",
  handle(async (req, res) => {
    const resp = await fetchDashboardDetails({
      monoovaService: new MonovaService(),
      transactionRepository: new TransactionRepository(),
      userRepository: new UserRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/pendingTransactions",
  handle(async (req, res) => {
    const resp = await fetchingPendingTransactions({
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

app.get(
  "/transactionSummary",
  handle(async (req, res) => {
    const resp = await fetchingTransactionSummary({
      transactionRepository: new TransactionRepository(),
    });
    res.json(resp);
  })
);

module.exports = app;
