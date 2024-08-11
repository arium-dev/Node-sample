const {
  HttpStatusCode,
  TransactionMessages,
  TransactionType,
  TransactionStatus,
} = require("../../../constants");
const { feeGroup } = require("../../../utils/group");

async function getAllTransactionFee({ transactionRepository }) {
  const fee = await transactionRepository.findByAggregation([
    {
      $match: {
        type: TransactionType.TRANSFER,
        status: TransactionStatus.APPROVED,
        queueStatus: "",
      },
    },
    feeGroup,
  ]);

  return {
    code: HttpStatusCode.OK,
    message: TransactionMessages.FEE_FETCHED_SUCCESS,
    data: fee,
  };
}

module.exports = { getAllTransactionFee };
