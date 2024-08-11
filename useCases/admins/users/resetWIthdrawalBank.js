const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  GenericConstants,
  GenericMessages,
  ActivityMessages,
  WalletTypes,
  WalletMessages,
} = require("../../../constants");
const { Wallet } = require("../../../models/Wallet");

async function resetWithdrawalBank(
  adminId,
  userId,
  { userRepository, walletRepository, activityRepository, mailerService },
  session
) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  const wallet = await walletRepository.findOne({
    type: WalletTypes.WITHDRAW,
    userId: new ObjectId(userId),
    deleted: false,
  });
  if (!wallet) {
    throw new Errors.NotFound(WalletMessages.WITHDRAW_NOT_FOUND);
  }

  await walletRepository.save(
    new Wallet({ ...wallet, deleted: true }),
    session
  );

  const emailResp = await mailerService.sendResetBankEmailToUser(user);
  if (!emailResp) {
    throw new Errors.BadGateway(GenericMessages.EMAIL_SENDING_FAILED);
  }

  await activityRepository.addActivityLog(
    user.id,
    adminId,
    GenericConstants.ADMIN,
    null,
    GenericConstants.WALLET_RESET,
    {
      type: GenericConstants.WALLET_RESET,
      message: ActivityMessages.ADMIN_RESET_WITHDRAWAL_WALLET(user.email),
    },
    session
  );

  await session.commitTransaction();
  await session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: ActivityMessages.ADMIN_RESET_WITHDRAWAL_WALLET(),
  };
}

module.exports = { resetWithdrawalBank };
