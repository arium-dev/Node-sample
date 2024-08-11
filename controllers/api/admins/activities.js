const express = require("express");
const { Permissions } = require("../../../constants");
const { authorizePermission } = require("../../../authorization");
const { handle } = require("../../../utils/asyncHandler");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  fetchingActivities,
} = require("../../../useCases/admins/activities/fetchingActivities");

const app = express.Router();

app.get(
  "/",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_ACTIVITY],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const resp = await fetchingActivities(req.jwt.id, req.query, {
      activityRepository: new ActivityRepository(),
      userRepository: new UserRepository(),
    });

    res.json(resp);
  })
);

module.exports = app;
