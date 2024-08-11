const express = require("express");
const profiles = require("./profiles");
const wallets = require("./wallets");
const currencies = require("./currencies");
const recipients = require("./recipients");
const userLogs = require("./userLogs");
const activities = require("./activities");
const transactions = require("./transactions");

// NOTE: no inline "require" in preparation for esm
const app = express.Router();

app.use("/profile", profiles);
app.use("/wallets", wallets);
app.use("/currencies", currencies);
app.use("/recipients", recipients);
app.use("/userLogs", userLogs);
app.use("/activities", activities);
app.use("/transactions", transactions);

module.exports = app;
