const express = require("express");
const mail = require("./mail");
const transaction = require("./transaction");
const currency = require("./currency");

const { ensureApiKey } = require("../../../guards/ensureApiKey");

const app = express.Router();

app.use("/mail", ensureApiKey, mail);
app.use("/transaction", ensureApiKey, transaction);
app.use("/currency", ensureApiKey, currency);

module.exports = app;
