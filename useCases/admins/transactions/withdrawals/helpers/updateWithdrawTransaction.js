const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  UserMessages,
  GenericMessages,
  TransactionStatus,
  GenericConstants,
  WithdrawalMessages,
  ActivityMessages,
} = require("../../../../../constants");
const { FormatTwoDecimals } = require("../../../../../utils/parser");
const {
  MAX_WITHDRAWAL_AMOUNT,
  MIN_WITHDRAWAL_AMOUNT,
} = require("../../../../../utils");
const {
  createOrUpdateWithdrawWallet,
} = require("./createOrUpdateWithdrawWallet");

const updateWithdrawTransaction = async (
  w,
  batchId,
  updatedBy,
  transactionRepository,
  walletRepository,
  activityRepository,
  userRepository,
  session
) => {
  let withdraw = await transactionRepository.findById(w.id);

  // if withdraw transaction not found or already approved then return as it
  if (!(withdraw && withdraw?.status !== TransactionStatus.APPROVED)) {
    return withdraw;
  }

  // find the user
  let user = await userRepository.findById(w?.userId);
  // if user not found then update wihdrawal message
  if (!user) {
    withdraw.transactionDetails.message = UserMessages.USER_NOT_FOUND;
    return await transactionRepository.save(withdraw, session);
  }

  // if amount not lies in range then update wihdrawal message
  if (
    !(w?.amount >= MIN_WITHDRAWAL_AMOUNT && w?.amount <= MAX_WITHDRAWAL_AMOUNT)
  ) {
    withdraw.transactionDetails.message =
      w?.amount < MIN_WITHDRAWAL_AMOUNT
        ? GenericMessages.MIN_WITHDRAW_AMOUNT_LIMIT
        : GenericMessages.MAX_WITHDRAW_AMOUNT_LIMIT;
    return await transactionRepository.save(withdraw, session);
  }

  // first create or update the user wihdraw wallet(bank)
  let wallet = await createOrUpdateWithdrawWallet(
    updatedBy,
    w,
    { walletRepository, activityRepository },
    session
  );

  // update the withdrawal transaction with wallet/batch Ids and message
  let amount = FormatTwoDecimals(w?.amount || 0);
  amount = amount.toString();
  withdraw.amount = amount;
  withdraw.transactionDetails.walletId = new ObjectId(wallet.id);
  withdraw.transactionDetails.batchId = batchId;
  withdraw.transactionDetails.refId = w?.refId;
  withdraw.transactionDetails.message = WithdrawalMessages.WITHDRAWAL_SAVED;
  withdraw = await transactionRepository.save(withdraw, session);

  // add activity of withdrawal transaction
  await activityRepository.addActivityLog(
    w?.userId,
    updatedBy,
    GenericConstants._ADMIN,
    withdraw.id,
    GenericConstants.WITHDRAW_UPDATED,
    {
      type: GenericConstants._WITHDRAW,
      message: ActivityMessages.WITHDRAWAL_UPDATED(withdraw, wallet),
    },
    session
  );

  return withdraw;
};

module.exports = { updateWithdrawTransaction };
