const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { HttpStatusCode, GenericConstants } = require("../../../constants");
const { OffsetLimit } = require("../../../config");
const {
  getDatesSearchCondition,
  userDepositTransactionSearchCondition,
  depositTransactionsAddFields,
} = require("../../../utils/searches");
const { userDepositTransactionsProject } = require("../../../utils/projects");
const { getPaginationWithTotalCountFacet } = require("../../../utils/facet");

async function fetchDepositTransactions(id, query, { transactionRepository }) {
  const { page, offset, searched } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;
  let queried = { userId: new ObjectId(id) };
  if (searched && searched.trim() !== "") {
    const dateSearch = getDatesSearchCondition(searched);
    const depositSearch = userDepositTransactionSearchCondition(searched);
    queried.$or = [...dateSearch, ...depositSearch];
  }

  const facet = getPaginationWithTotalCountFacet({
    pageLimit: pageLimit,
    limit: limit,
  });

  const pipeline = [
    { $match: { type: GenericConstants._DEPOSIT } },
    depositTransactionsAddFields,
    { $match: queried },
    userDepositTransactionsProject,
    facet,
  ];

  const transactions = await transactionRepository.findByAggregation(pipeline);

  return {
    data: transactions?.[0]?.paginatedData || [],
    count: transactions?.[0]?.totalCount[0]?.count || 0,
    code: HttpStatusCode.OK,
  };
}
module.exports = { fetchDepositTransactions };
