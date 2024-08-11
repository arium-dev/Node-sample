const { HttpStatusCode, FiatManagment } = require("../../../../constants");
const { OffsetLimit } = require("../../../../config");
const {
  getWithdrawsSearchCondition,
  getDatesSearchCondition,
  getPaginationWithTotalCountFacet,
} = require("../../../../utils/searches");
const {
  withdrawSubmitByLookup,
  withdrawsOfBatchLookup,
  roleWithSubmittedByLookup,
} = require("../../../../utils/lookUps");
const { batchWithdrawsProject } = require("../../../../utils/projects");
const { addRoleInSubmittedByField } = require("../../../../utils/addFields");
const {
  flattenSubmittedBy,
  flattenRole,
} = require("../../../../utils/flattenFields");

const getBatchWithdrawals = async (query, { batchRepository }) => {
  const { page, offset, search } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  const queried = {};
  if (search && search.trim() !== "") {
    const dateSearch = getDatesSearchCondition(search);

    const batchWithdrawalSearch = getWithdrawsSearchCondition(search);
    queried.$or = [...dateSearch, ...batchWithdrawalSearch];
  }

  const facet = getPaginationWithTotalCountFacet({
    pageLimit,
    limit,
  });

  let pipeline = [
    withdrawSubmitByLookup,
    withdrawsOfBatchLookup,
    flattenSubmittedBy,
    roleWithSubmittedByLookup,
    flattenRole,
    addRoleInSubmittedByField,
    { $match: queried },
    batchWithdrawsProject,
    facet,
  ];

  const transactions = await batchRepository.gettingBatchWithdrawByAggregration(
    pipeline
  );

  return {
    code: HttpStatusCode.OK,
    message: FiatManagment.SUCCESSFULLY_FETCHED_BATCH_WITHDRAWAL,
    data: {
      list: transactions?.[0]?.paginatedData,
      count: transactions[0]?.totalCount?.[0]?.count || 0,
    },
  };
};

module.exports = { getBatchWithdrawals };
