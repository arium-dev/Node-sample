const {
  HttpStatusCode,
  RecipientMessages,
  OffsetLimit,
  TransactionType,
  TransactionStatus,
} = require("../../../constants");
const {
  senderUserAddField,
  senderUserNameAddField,
  recipientUserNameAddField,
} = require("../../../utils/addFields");
const { adminTransactionProject } = require("../../../utils/projects");
const {
  getPaginationWithTotalCountFacet,
  recipientSourceCurrencyIdLookup,
  sourceCurrencyAddField,
  recipientExchangeCurrencyIdLookup,
  exchangeCurrencyAddField,
  conversionRateAddField,
  adminTransactionSearch,
  getDatesSearchCondition,
  senderUserLookupAdmin,
  recipientIdLookup,
} = require("../../../utils/searches");

async function getTransactions(query, { transactionRepository }) {
  let { page = 1, offset = 10, searched = "" } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  let condition = {
    $match: {
      type: TransactionType.TRANSFER,
    },
  };

  const dateSearch = getDatesSearchCondition(searched);

  if (
    searched.replace(/\s+/g, "").toLowerCase() ===
    TransactionStatus._PENDING_INVITATION
  ) {
    searched = searched.replace(/\s+/g, "");
  }

  let searchedQuery = {
    $match: {
      $or: [...dateSearch, ...adminTransactionSearch(searched)],
    },
  };

  const facet = getPaginationWithTotalCountFacet({ pageLimit, limit });

  const pipeline = [
    condition,
    recipientSourceCurrencyIdLookup,
    sourceCurrencyAddField,
    recipientExchangeCurrencyIdLookup,
    exchangeCurrencyAddField,
    conversionRateAddField,
    ...recipientIdLookup,
    recipientUserNameAddField,
    senderUserLookupAdmin,
    senderUserAddField,
    senderUserNameAddField,
    searchedQuery,
    adminTransactionProject,
    facet,
  ];

  const transactions = await transactionRepository.findByAggregation(pipeline);
  return {
    code: HttpStatusCode.OK,
    message: RecipientMessages.FETCHED_SUCCESS,
    data: {
      list: transactions?.[0]?.paginatedData,
      count: transactions[0]?.totalCount?.[0]?.count || 0,
    },
  };
}

module.exports = { getTransactions };
