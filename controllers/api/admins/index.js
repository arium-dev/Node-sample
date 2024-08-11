const express = require("express");
const settings = require("./settings");
const currencies = require("./currencies");
const activities = require("./activities");
const transactions = require("./transactions");
const dashboard = require("./dashboard");
const withdrawals = require("./withdrawals");
const eddVerifications = require("./eddVerifications");
const users = require("./users");
const { ensureValidToken } = require("../../../guards/ensureValidToken");
const app = express.Router();

app.use("/users", users);
app.use("/settings", settings);
app.use("/currencies", currencies);
app.use("/activities", activities);
app.use("/transactions", transactions);
app.use("/dashboard", dashboard);
app.use("/transactions/withdrawals", ensureValidToken, withdrawals);
app.use("/edd-verifications", eddVerifications);

module.exports = app;
