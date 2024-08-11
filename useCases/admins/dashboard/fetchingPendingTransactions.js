const {
  HttpStatusCode,
  TransactionStatus,
  TransactionType,
  WalletMessages,
} = require("../../../constants");
const {
  FormatTwoDecimals,
  calculateTotalAmount,
} = require("../../../utils/parser");

async function fetchingPendingTransactions({ transactionRepository }) {
  const pendingDeposits = await transactionRepository.find({
    type: TransactionType.DEPOSIT,
    status: {
      $in: [TransactionStatus.PENDING, TransactionStatus.PENDING_INVITATION],
    },
  });

  let totalPendingDepositAmount =
    pendingDeposits && pendingDeposits.length > 0
      ? FormatTwoDecimals(parseFloat(calculateTotalAmount(pendingDeposits)))
      : 0;

  const pendingWithdraws = await transactionRepository.find({
    type: TransactionType.WITHDRAW,
    status: {
      $in: [TransactionStatus.PENDING, TransactionStatus.PENDING_INVITATION],
    },
  });

  let totalPendingWithdrawAmount =
    pendingWithdraws && pendingWithdraws.length > 0
      ? FormatTwoDecimals(parseFloat(calculateTotalAmount(pendingWithdraws)))
      : 0;

  return {
    code: HttpStatusCode.OK,
    message: WalletMessages.BALANCE_FETCHED_SUCCESS,
    data: {
      totalPendingDepositAmount,
      totalPendingWithdrawAmount,
    },
  };
}

module.exports = { fetchingPendingTransactions };
