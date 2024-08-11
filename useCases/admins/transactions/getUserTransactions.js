const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  HttpStatusCode,
  RecipientMessages,
  OffsetLimit,
  TransactionType,
} = require("../../../constants");
const {
  getPaginationWithTotalCountFacet,
  recipientSourceCurrencyIdLookup,
  sourceCurrencyAddField,
  recipientExchangeCurrencyIdLookup,
  exchangeCurrencyAddField,
  conversionRateAddField,
  recipientTransactionProject,
  recipientIdLookup,
} = require("../../../utils/searches");

async function getUserTransactions(userId, query, { transactionRepository }) {
  const { page = 1, offset = 10 } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  let queryObj = [{ userId: new ObjectId(userId) }];

  queryObj.push({
    "transactionDetails.receiverDetails.recipientId": new ObjectId(userId),
  });

  let condition = {
    $match: {
      type: TransactionType.TRANSFER,
      $or: queryObj,
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
    recipientTransactionProject,
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

module.exports = { getUserTransactions };
