const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  getPaginationWithTotalCountFacet,
  recipientSourceCurrencyIdLookup,
  sourceCurrencyAddField,
  recipientExchangeCurrencyIdLookup,
  exchangeCurrencyAddField,
  conversionRateAddField,
  recipientTransactionProject,
  senderUserLookup,
  senderUserSearch,
  recipientUserSearch,
  transactionAllSearch,
  recipientIdLookup,
} = require("../../../utils/searches");
const {
  HttpStatusCode,
  RecipientMessages,
  OffsetLimit,
  TransactionType,
  GenericConstants,
  TransactionStatus,
} = require("../../../constants");

async function getTransactions(userId, query, { transactionRepository }) {
  const { page = 1, offset = 10, searched = "" } = query;
  const limit = offset ? parseInt(offset) : OffsetLimit;
  const pageLimit = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;

  const statusQuery =
    searched?.toLowerCase() === GenericConstants.SENT
      ? [{ userId: new ObjectId(userId), status: TransactionStatus.APPROVED }]
      : searched?.toLowerCase() === GenericConstants.RECEIVED
      ? [
          {
            "transactionDetails.receiverDetails.recipientId": new ObjectId(
              userId
            ),
            status: TransactionStatus.APPROVED,
          },
        ]
      : searched?.trim()?.toLowerCase() === GenericConstants.PENDING_INVITATION
      ? [
          {
            status: TransactionStatus.PENDING_INVITATION,
            $or: [
              { userId: new ObjectId(userId) },
              {
                "transactionDetails.receiverDetails.recipientId": new ObjectId(
                  userId
                ),
              },
            ],
          },
        ]
      : [];

  let condition = {
    $match: {
      type: TransactionType.TRANSFER,
      $and:
        statusQuery?.length > 0
          ? statusQuery
          : [
              {
                $or: [
                  ...senderUserSearch(searched),
                  ...recipientUserSearch(searched),
                  ...transactionAllSearch(searched),
                ],
              },
            ],
    },
  };

  const facet = getPaginationWithTotalCountFacet({ pageLimit, limit });

  const pipeline = [
    {
      $match: {
        $or: [
          { userId: new ObjectId(userId) },
          {
            "transactionDetails.receiverDetails.recipientId": new ObjectId(
              userId
            ),
          },
        ],
      },
    },
    recipientSourceCurrencyIdLookup,
    sourceCurrencyAddField,
    recipientExchangeCurrencyIdLookup,
    exchangeCurrencyAddField,
    conversionRateAddField,
    ...recipientIdLookup,
    ...senderUserLookup,
    condition,
    recipientTransactionProject,
    facet,
  ];

  const recipientTransactions = await transactionRepository.findByAggregation(
    pipeline
  );

  return {
    code: HttpStatusCode.OK,
    message: RecipientMessages.FETCHED_SUCCESS,
    data: {
      list: recipientTransactions?.[0]?.paginatedData,
      count: recipientTransactions[0]?.totalCount?.[0]?.count || 0,
    },
  };
}

module.exports = { getTransactions };
