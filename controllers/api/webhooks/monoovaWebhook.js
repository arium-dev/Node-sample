const express = require("express");
const { handle } = require("../../../utils/asyncHandler");
const { UserRepository } = require("../../../repositories/UserRepository");
const { WalletRepository } = require("../../../repositories/WalletRepository");
const {
  WebhookRepository,
} = require("../../../repositories/WebhookRepository");
const {
  TransactionRepository,
} = require("../../../repositories/TransactionRepository");
const { QueueService } = require("../../../services/QueueService");

const { nppWebhook } = require("../../../useCases/webhook/monoova/nppWebhook");
const {
  idcTransaction,
} = require("../../../useCases/webhook/monoova/idcTransaction");
const {
  dedTransaction,
} = require("../../../useCases/webhook/monoova/dedTransaction");

const app = express.Router();

// NPP payment Webhook
app.post(
  "/npp",
  handle(async (req, res) => {
    const resp = await nppWebhook(req.body, {
      userRepository: new UserRepository(),
      walletRepository: new WalletRepository(),
      webhookRepository: new WebhookRepository(),
      queueService: new QueueService(),
    });
    res.json(resp);
  })
);

// Inbound Direct Credits Webhook
app.post(
  "/idc",
  handle(async (req, res) => {
    const resp = await idcTransaction(req.body, {
      userRepository: new UserRepository(),
      walletRepository: new WalletRepository(),
      webhookRepository: new WebhookRepository(),
      queueService: new QueueService(),
    });
    res.json(resp);
  })
);

// Direct Entry Dishonours Webhook
app.post(
  "/ded",
  handle(async (req, res) => {
    const resp = await dedTransaction(req.body, {
      transactionRepository: new TransactionRepository(),
      userRepository: new UserRepository(),
      webhookRepository: new WebhookRepository(),
      queueService: new QueueService(),
    });
    res.json(resp);
  })
);

module.exports = app;
