const { TransactionStatus } = require("../../../../../constants");

const getBatchStatusUponWithdrawals = async (withdraws, status) => {
  let st = status;
  if (
    withdraws.filter((b) => b?.status !== TransactionStatus.APPROVED).length > 0
  ) {
    if (
      withdraws.filter((b) => b?.status !== TransactionStatus.CANCELLED)
        .length > 0
    ) {
      st =
        withdraws.filter((b) => b?.status === TransactionStatus.UN_APPROVED)
          .length >= 1
          ? TransactionStatus.UN_APPROVED
          : TransactionStatus.CANCELLED;
    } else {
      st = TransactionStatus.CANCELLED;
    }
  } else {
    st = TransactionStatus.APPROVED;
  }

  return st;
};

module.exports = { getBatchStatusUponWithdrawals };
