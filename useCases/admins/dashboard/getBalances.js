const {
  HttpStatusCode,
  TransactionType,
  WalletMessages,
} = require("../../../constants");
const {
  FormatTwoDecimals,
  calculateTotalAmount,
} = require("../../../utils/parser");

async function getBalances({ monoovaService, transactionRepository }) {
  const deposits = await transactionRepository.find({
    type: TransactionType.DEPOSIT,
  });

  let totalDepositAmount =
    deposits && deposits.length > 0
      ? FormatTwoDecimals(parseFloat(calculateTotalAmount(deposits)))
      : 0;

  const withdraws = await transactionRepository.find({
    type: TransactionType.WITHDRAW,
  });

  let totalWithdrawAmount =
    withdraws && withdraws.length > 0
      ? FormatTwoDecimals(parseFloat(calculateTotalAmount(withdraws)))
      : 0;

  let data = {
    totalDepositAmount,
    totalWithdrawAmount,
  };
  const depositBalance = await monoovaService.getDepositBankAccountBalance();
  data = {
    ...data,
    depositBalance: depositBalance?.financials?.actualBalance || 0,
  };

  const withdrawBalance = await monoovaService.getWithdrawBankAccountBalance();

  data = {
    ...data,
    withdrawBalance: withdrawBalance?.financials?.actualBalance || 0,
  };

  return {
    code: HttpStatusCode.OK,
    message: WalletMessages.BALANCE_FETCHED_SUCCESS,
    data: data,
  };
}

module.exports = { getBalances };
