const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Wallet } = require("../../../models/Wallet");
const Errors = require("../../../errors");
const {
  UserMessages,
  HttpStatusCode,
  GenericMessages,
  WalletTypes,
  WalletMessages,
  UserConstants,
  GenericConstants,
} = require("../../../constants");

async function createWithdrawWallet(
  id,
  body,
  { userRepository, walletRepository, activityRepository },
  session
) {
  if (!id) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }
  let user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(UserMessages.USER_NOT_FOUND);
  }

  const wallet = await walletRepository.findOne({
    userId: new ObjectId(id),
    type: WalletTypes.WITHDRAW,
    deleted: false,
  });

  if (wallet) {
    throw new Errors.Conflict(WalletMessages.WITHDRAW_ALREADY_EXISTS);
  }

  const newWallet = await walletRepository.save(
    new Wallet({
      type: WalletTypes.WITHDRAW,
      data: {
        accountNumber: body.accountNumber,
        accountTitle: body.accountTitle,
        bsb: body.bsb,
      },
      userId: new ObjectId(id),
      createdBy: new ObjectId(id),
      updatedBy: new ObjectId(id),
    }),
    session
  );

  await activityRepository.addActivityLog(
    id,
    id,
    UserConstants.USER,
    null,
    GenericConstants.WITHDRAW_BANK_CREATED,
    {
      type: UserConstants.BANK,
      message: WalletMessages.CREATE_WITHDRAW_BANK(newWallet),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.CREATED,
    message: WalletMessages.WITHDRAW_WALLET_CREATED,
    data: newWallet,
  };
}
module.exports = { createWithdrawWallet };
