const express = require("express");
const app = express.Router();
const { handle } = require("../../../utils/asyncHandler");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  fetchingActivities,
} = require("../../../useCases/users/activity/fetchingActivities");

app.get(
  "/",
  handle(async (req, res) => {
    const resp = await fetchingActivities(req.jwt.id, req.query, {
      activityRepository: new ActivityRepository(),
      userRepository: new UserRepository(),
    });

    res.json(resp);
  })
);

module.exports = app;
