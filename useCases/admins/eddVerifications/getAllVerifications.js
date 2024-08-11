const { HttpStatusCode, EddMessages } = require("../../../constants");
const {
  userFullnameAddField,
  userAddField,
  eddStatusAddField,
} = require("../../../utils/addFields");
const { eddVerificationProject } = require("../../../utils/projects");
const {
  getPaginationWithTotalCountFacet,
  userIdLookup,
  eddVerificationSearch,
  getDatesSearchCondition,
} = require("../../../utils/searches");

async function getAllVerifications(query, { eddVerificationRepository }) {
  const { page = 1, offset = 10, search } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  // match the search query
  const queried = {};
  if (search && search.trim() !== "") {
    const dateSearch = getDatesSearchCondition(search);
    const eddSearch = eddVerificationSearch(search);
    queried.$or = [...dateSearch, ...eddSearch];
  }

  const facet = getPaginationWithTotalCountFacet({
    pageLimit,
    limit,
  });

  const pipeline = [
    userIdLookup,
    userAddField,
    userFullnameAddField,
    eddStatusAddField,
    { $match: queried },
    eddVerificationProject,
    facet,
  ];

  const eddVerifications = await eddVerificationRepository.findByAggregation(
    pipeline
  );

  return {
    code: HttpStatusCode.OK,
    message: EddMessages.FETCHED_SUCCESS,
    data: {
      list: eddVerifications?.[0]?.paginatedData,
      count: eddVerifications[0]?.totalCount?.[0]?.count || 0,
    },
  };
}

module.exports = { getAllVerifications };
