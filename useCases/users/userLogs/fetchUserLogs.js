const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const { OffsetLimit } = require("../../../config");
const {
  getDatesSearchCondition,
  getUserLogSearchCondition,
} = require("../../../utils/searches");
const {
  userLookup,
  userLogsWithUserLookup,
} = require("../../../utils/lookUps");
const { userNameAddField } = require("../../../utils/addFields");
const {
  userLogsProject,
  totalCountDataProject,
} = require("../../../utils/projects");
const {
  GenericMessages,
  HttpStatusCode,
  UserLogMessages,
} = require("../../../constants");

async function fetchUserLogs(id, query, { userRepository, userLogRepository }) {
  if (!id) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }

  let user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  let obj = { userId: new ObjectId(id) };

  const { page, offset, searchQuery } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  if (searchQuery && searchQuery.trim() !== "") {
    const dateSearch = getDatesSearchCondition(searchQuery);
    const userSearch = getUserLogSearchCondition(searchQuery);
    obj.$or = [...dateSearch, ...userSearch];
  }

  const pipeline = [
    userLookup,
    { $unwind: "$user" },
    userNameAddField,
    { $match: obj },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        data: [
          { $sort: { _id: -1 } },
          { $skip: pageLimit },
          { $limit: limit },
          userLogsWithUserLookup,
          { $unwind: "$user" },
          { $addFields: { userId: "$user" } },
          { $project: { user: 0 } },
          userLogsProject,
        ],
      },
    },
    { $unwind: "$totalCount" },
    totalCountDataProject,
  ];

  const logs = await userLogRepository.findByAggregation(pipeline);

  return {
    code: HttpStatusCode.OK,
    data: logs && logs.length > 0 ? logs[0].data : [],
    total: logs && logs.length > 0 ? logs[0].totalCount : 0,
    message: UserLogMessages.USER_LOGS_FETCHED,
  };
}
module.exports = { fetchUserLogs };
