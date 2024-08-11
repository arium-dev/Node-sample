const {
  HttpStatusCode,
  FiatManagment,
  OffsetLimit,
  TransactionType,
} = require("../../../constants");
const {
  getPaginationWithTotalCountFacet,
  getDatesSearchCondition,
  getDepositsSearchCondition,
} = require("../../../utils/searches");
const { userLookup } = require("../../../utils/lookUps");
const {
  addUserFromUserArr,
  userNameAddField,
  addFieldsForDeposits,
} = require("../../../utils/addFields");
const { depositsProject } = require("../../../utils/projects");

async function fetchAllDeposits(query, { transactionRepository }) {
  const { page, offset, search } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  // first match the deposit type
  const condition = {
    $match: {
      type: TransactionType.DEPOSIT,
    },
  };
  // match the search query
  const queried = {};
  if (search && search.trim() !== "") {
    const dateSearch = getDatesSearchCondition(search);
    const userSearch = getDepositsSearchCondition(search);
    queried.$or = [...dateSearch, ...userSearch];
  }

  const facet = getPaginationWithTotalCountFacet({
    pageLimit,
    limit,
  });

  let pipeline = [
    condition,
    userLookup,
    addUserFromUserArr,
    userNameAddField,
    addFieldsForDeposits,
    { $match: queried },
    depositsProject,
    facet,
  ];

  const transactions = await transactionRepository.findByAggregation(pipeline);

  return {
    code: HttpStatusCode.OK,
    message: FiatManagment.SUCCESSFULLY_FETCHED_DEPOSITS,
    data: {
      list: transactions?.[0]?.paginatedData,
      count: transactions[0]?.totalCount?.[0]?.count || 0,
    },
  };
}

module.exports = { fetchAllDeposits };
