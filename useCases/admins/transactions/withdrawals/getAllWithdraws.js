const {
  HttpStatusCode,
  FiatManagment,
  TransactionType,
} = require("../../../../constants");
const { OffsetLimit } = require("../../../../config");
const {
  getDatesSearchCondition,
  getTransactionWithdrawSearchCondition,
  getPaginationWithTotalCountFacet,
} = require("../../../../utils/searches");
const {
  getAllWithdrawTransactionsProject,
} = require("../../../../utils/projects");
const { usersLookUp, walletLookUp } = require("../../../../utils/lookUps");
const {
  userIdAddField,
  walletIdAddField,
} = require("../../../../utils/addFields");

const getAllWithdraws = async (query, { transactionRepository }) => {
  const { page, offset, search } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  const queried = {
    type: TransactionType.WITHDRAW,
  };
  if (search && search.trim() !== "") {
    const dateSearch = getDatesSearchCondition(search);

    const transactionWithdrawalSearch =
      getTransactionWithdrawSearchCondition(search);
    queried.$or = [...dateSearch, ...transactionWithdrawalSearch];
  }

  const facet = getPaginationWithTotalCountFacet({
    pageLimit,
    limit,
  });
  let pipeline = [
    usersLookUp,
    userIdAddField,
    walletLookUp,
    walletIdAddField,
    { $match: queried },
    getAllWithdrawTransactionsProject,
    facet,
  ];
  const transactions = await transactionRepository.findByAggregation(pipeline);

  return {
    code: HttpStatusCode.OK,
    message: FiatManagment.SUCCESSFULLY_FETCHED_BATCH_WITHDRAWAL,
    data: {
      list: transactions?.[0]?.paginatedData,
      count: transactions[0]?.totalCount?.[0]?.count || 0,
    },
  };
};

module.exports = { getAllWithdraws };
