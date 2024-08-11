const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { OffsetLimit } = require("../../../config");
const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  ActivityMessages,
  GenericConstants,
} = require("../../../constants");
const {
  getDatesSearchCondition,
  getUserActivitySearchCondition,
} = require("../../../utils/searches");
const { userDetailLookup } = require("../../../utils/lookUps");
const { userNameFromDetailAddField } = require("../../../utils/addFields");
const {
  activityUserProject,
  totalCountDataProject,
} = require("../../../utils/projects");

async function fetchingActivities(
  id,
  query,
  { userRepository, activityRepository }
) {
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

  let condition = obj;
  if (searchQuery) {
    const dateSearch = getDatesSearchCondition(searchQuery);
    const activitySearch = getUserActivitySearchCondition(searchQuery);
    condition = {
      $and: [obj, { $or: [...activitySearch, ...dateSearch] }],
    };
  }

  const pipeline = [
    { $match: { type: GenericConstants.ADMIN } },
    userDetailLookup,
    { $unwind: "$userDetails" },
    userNameFromDetailAddField,
    { $match: condition },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        data: [
          { $sort: { _id: -1 } },
          { $skip: pageLimit },
          { $limit: limit },
          activityUserProject,
        ],
      },
    },
    { $unwind: "$totalCount" },
    totalCountDataProject,
  ];

  let activities = await activityRepository.findByAggregation(pipeline);

  return {
    code: HttpStatusCode.OK,
    data: {
      list: activities?.length > 0 ? activities[0].data : [],
      count: activities?.length > 0 ? activities[0].totalCount : 0,
    },
    message: ActivityMessages.ACTIVITIES_FETCHED_SUCCESS,
  };
}
module.exports = { fetchingActivities };
