const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { OffsetLimit } = require("../../../config");
const {
  getDatesSearchCondition,
  getUserTransactionSearchCondition,
  batchesLookup,
  walletLookup,
  fetchWithdrawTransactionsAddFields,
  fetchWithdrawTransactionsProject,
} = require("../../../utils/searches");
const { getPaginationWithTotalCountFacet } = require("../../../utils/facet");
const { HttpStatusCode, GenericConstants } = require("../../../constants");

async function fetchWithdrawTransactions(id, query, { transactionRepository }) {
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
    const userSearch = getUserTransactionSearchCondition(searched);
    queried.$or = [...dateSearch, ...userSearch];
  }

  const facet = getPaginationWithTotalCountFacet({
    pageLimit: pageLimit,
    limit: limit,
  });

  const pipeline = [
    { $match: { type: GenericConstants._WITHDRAW } },
    batchesLookup,
    walletLookup,
    { $unwind: "$batchDetails" },
    { $unwind: "$walletDetails" },
    fetchWithdrawTransactionsAddFields,
    { $match: queried },
    fetchWithdrawTransactionsProject,
    facet,
  ];

  const transactions = await transactionRepository.findByAggregation(pipeline);

  return {
    data: transactions?.[0]?.paginatedData || [],
    count: transactions?.[0]?.totalCount[0]?.count || 0,
    code: HttpStatusCode.OK,
  };
}
module.exports = { fetchWithdrawTransactions };
