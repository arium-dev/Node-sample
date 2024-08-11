const {
  HttpStatusCode,
  TransactionStatus,
  TransactionType,
  WalletMessages,
  GenericConstants,
} = require("../../../constants");
const {
  FormatTwoDecimals,
  calculateTotalAmount,
  calculateTotalTransactionAmount,
} = require("../../../utils/parser");

async function fetchingTransactionSummary({ transactionRepository }) {
  const transfers = await transactionRepository.find({
    type: TransactionType.TRANSFER,
    status: TransactionStatus.APPROVED,
  });

  let totalAmountSent =
    transfers && transfers.length > 0
      ? FormatTwoDecimals(parseFloat(calculateTotalAmount(transfers)))
      : 0;

  let totalAmountReceived =
    transfers && transfers.length > 0
      ? FormatTwoDecimals(
          parseFloat(
            calculateTotalTransactionAmount(transfers, GenericConstants.AMOUNT)
          )
        )
      : 0;

  let totalFees =
    transfers && transfers.length > 0
      ? FormatTwoDecimals(
          parseFloat(
            calculateTotalTransactionAmount(transfers, GenericConstants.FEE)
          )
        )
      : 0;

  return {
    code: HttpStatusCode.OK,
    message: WalletMessages.BALANCE_FETCHED_SUCCESS,
    data: {
      totalAmountSent,
      totalAmountReceived,
      totalFees,
    },
  };
}

module.exports = { fetchingTransactionSummary };
