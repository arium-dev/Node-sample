const { FormatTwoDecimals } = require("../../../utils/parser");

async function debitUserBalance(data, { balanceRepository }, session) {
  try {
    let balance = await balanceRepository.findOne({ userId: data?.userId });

    if (!balance) {
      return null;
    }

    const amount = FormatTwoDecimals(data?.amount);
    let updatedAmount = FormatTwoDecimals(
      parseFloat(balance?.balance) - parseFloat(amount)
    );
    updatedAmount = updatedAmount.toString();

    balance.lock = parseFloat(balance?.lock) + parseFloat(amount);
    balance.balance = updatedAmount;
    balance.updatedBy = data.userId;

    balance = await balanceRepository.save(balance, session);

    if (!balance) {
      return null;
    }

    return balance;
  } catch (error) {
    return null;
  }
}
module.exports = { debitUserBalance };
