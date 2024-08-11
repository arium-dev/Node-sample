const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  UserMessages,
  GenericMessages,
  GenericConstants,
  WithdrawalMessages,
  ActivityMessages,
  TransactionStatus,
} = require("../../../../../constants");
const { FormatTwoDecimals } = require("../../../../../utils/parser");
const {
  MAX_WITHDRAWAL_AMOUNT,
  MIN_WITHDRAWAL_AMOUNT,
} = require("../../../../../utils");
const { Transaction } = require("../../../../../models/Transaction");
const {
  createOrUpdateWithdrawWallet,
} = require("./createOrUpdateWithdrawWallet");

const createWithdrawTransaction = async (
  w,
  batchId,
  id,
  transactionRepository,
  walletRepository,
  activityRepository,
  userRepository,
  session
) => {
  let user = await userRepository.findById(w?.userId);
  let amount = FormatTwoDecimals(w?.amount || 0);
  amount = amount.toString();

  // create wihdrawal transaction with basic info and will update below
  let withdraw = new Transaction({
    type: GenericConstants._WITHDRAW,
    amount,
    userId: new ObjectId(w?.userId?.toString()),
    createdBy: id,
    createdBy: id,
    status: TransactionStatus.UN_APPROVED,
    transactionDetails: { batchId },
  });

  if (!user) {
    withdraw.transactionDetails.message = UserMessages.USER_NOT_FOUND;
    return await transactionRepository.save(withdraw, session);
  }
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
    id,
    w,
    { walletRepository, activityRepository },
    session
  );

  // update the withdrawal transaction with wallet/batch Ids and message
  withdraw.transactionDetails.walletId = new ObjectId(wallet.id);
  withdraw.transactionDetails.batchId = batchId;
  withdraw.transactionDetails.refId = w?.refId;
  withdraw.transactionDetails.message = WithdrawalMessages.WITHDRAWAL_SAVED;
  withdraw = await transactionRepository.save(withdraw, session);

  // add activity of withdrawal transaction
  const activity = await activityRepository.addActivityLog(
    w.userId,
    id,
    GenericConstants._ADMIN,
    withdraw.id,
    GenericConstants.WITHDRAW_CREATED,
    {
      type: GenericConstants._WITHDRAW,
      message: ActivityMessages.WITHDRAWAL_REQUEST_SUBMITTED(withdraw, wallet),
    },
    session
  );

  return withdraw;
};

module.exports = { createWithdrawTransaction };
