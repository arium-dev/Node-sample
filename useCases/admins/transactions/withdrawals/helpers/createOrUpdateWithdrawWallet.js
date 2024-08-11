const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Wallet } = require("../../../../../models/Wallet");
const {
  UserConstants,
  WalletMessages,
  TransactionType,
  GenericConstants,
} = require("../../../../../constants");

const createOrUpdateWithdrawWallet = async (
  updatedBy,
  { userId, bsb, userName, accountNumber },
  { walletRepository, activityRepository },
  session
) => {
  let isCreate = false,
    wallet = await walletRepository.findOne({
      type: TransactionType.WITHDRAW,
      userId: userId,
      deleted: false,
    });

  // if not found due to block bank by admin or not created yet by the user then will create here
  if (!(wallet && wallet.id)) {
    isCreate = true;
    wallet = new Wallet({
      type: GenericConstants._WITHDRAW,
      createdBy: updatedBy,
      updatedBy: updatedBy,
      userId: new ObjectId(userId.toString()),
      data: { bsb },
    });
  }

  wallet.data.bsb = bsb || "";
  wallet.data.accountTitle = userName || "";
  wallet.data.accountNumber = accountNumber || "";
  wallet.updatedBy = updatedBy;
  wallet = await walletRepository.save(wallet, session);

  await activityRepository.addActivityLog(
    wallet?.userId,
    updatedBy,
    GenericConstants._ADMIN,
    null,
    isCreate
      ? GenericConstants.WITHDRAW_BANK_CREATED
      : GenericConstants.WITHDRAW_BANK_UPDATED,
    {
      type: UserConstants.BANK,
      message: isCreate
        ? WalletMessages.CREATE_WITHDRAW_BANK(wallet)
        : WalletMessages.UPDATE_WITHDRAW_BANK(wallet),
    },
    session
  );
  return wallet;
};
module.exports = { createOrUpdateWithdrawWallet };
