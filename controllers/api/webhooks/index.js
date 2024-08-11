const express = require("express");
const sumsubWebhook = require("./sumsubWebook");
const monoovaWebhook = require("./monoovaWebhook");
const {
  validateSumsubWebhook,
} = require("../../../guards/ensureSumsubWebhook");
const {
  validateMonoovaWebhook,
} = require("../../../guards/ensureMonoovaWebhook");

const app = express.Router();
app.use("/sumsubWebhook", validateSumsubWebhook, sumsubWebhook);
app.use("/monoova", validateMonoovaWebhook, monoovaWebhook);

module.exports = app;
