const express = require("express");
const { ensureValidToken } = require("../../guards/ensureValidToken");
const { ensureAnyAdmin } = require("../../guards/ensureAnyAdmin");
const auth = require("./auth");
const admins = require("./admins");
const users = require("./users");
const webhooks = require("./webhooks");
const queues = require("./queues");
const seeder = require("./seeder");
const calendly = require("./calendly");

const app = express.Router();

app.use("/auth", auth);
app.use("/admins", [ensureValidToken, ensureAnyAdmin], admins);
app.use("/users", ensureValidToken, users);
app.use("/webhooks", webhooks);
app.use("/queues", queues);
app.use("/seeder", seeder);
app.use("/calendly", calendly);

app.get("/*", function (_, res) {
  res.status(404).json({
    errors: {
      message: "Route Not Found",
    },
  });
});
module.exports = app;
