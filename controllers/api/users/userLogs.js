const express = require("express");
const { handle } = require("../../../utils/asyncHandler");
const {
  UserLogRepository,
} = require("../../../repositories/UserLogRepository");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  fetchUserLogs,
} = require("../../../useCases/users/userLogs/fetchUserLogs");

const app = express.Router();

app.get(
  "/",
  handle(async (req, res) => {
    const resp = await fetchUserLogs(req.jwt.id, req.query, {
      userRepository: new UserRepository(),
      userLogRepository: new UserLogRepository(),
    });

    res.json(resp);
  })
);

module.exports = app;
