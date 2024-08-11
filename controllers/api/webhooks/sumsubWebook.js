const express = require("express");
const { handle } = require("../../../utils/asyncHandler");
const { sumSubWebhook } = require("../../../useCases/webhook/sumSubWebhook");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  WebhookRepository,
} = require("../../../repositories/WebhookRepository");
const { SubSumService } = require("../../../services/SubSumService");
const { QueueService } = require("../../../services/QueueService");

const app = express.Router();
app.post(
  "/",
  handle(async (req, res) => {
    const resp = await sumSubWebhook(req.body, {
      userRepository: new UserRepository(),
      webhookRepository: new WebhookRepository(),
      subSumService: new SubSumService(),
      queueService: new QueueService(),
    });
    res.json(resp);
  })
);

module.exports = app;
