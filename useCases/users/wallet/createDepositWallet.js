const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const { Wallet } = require("../../../models/Wallet");
const {
  GenericMessages,
  HttpStatusCode,
  GenericConstants,
  UserConstants,
  WalletTypes,
  WalletMessages,
} = require("../../../constants");

const DelayTime = 1000 * 15;

async function UserBankAccountStatus(getBankAccountStatus, bankAccountResp) {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const respStatus = await getBankAccountStatus(
        parseInt(bankAccountResp?.data?.bankAccountNumber)
      );

      resolve(respStatus?.data);
    }, DelayTime);
  });
}

async function createDepositWallet(
  id,
  { userRepository, walletRepository, monovaService, activityRepository },
  session
) {
  if (!id) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }
  let user = await userRepository.findById(id);

  if (!user) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  const wallet = await walletRepository.findOne({
    userId: new ObjectId(id),
    type: WalletTypes.DEPOSIT,
    deleted: false,
  });

  if (wallet) {
    throw new Errors.Conflict(WalletMessages.ALREADY_EXISTS);
  }
  const bankAccountResp = await monovaService.createBankAccount(user);

  if (bankAccountResp?.data?.status !== GenericConstants.OK) {
    throw new Errors.BadGateway(
      WalletMessages.BANK_ACCOUNT_STATUS_COULD_NOT_UPDATED,
      { error: bankAccountResp?.data, userId: user?.id }
    );
  } else {
    //TODO: ADD LOGS
  }

  let response = await UserBankAccountStatus(
    monovaService.getBankAccountStatus,
    bankAccountResp
  );
  if (response) {
    //TODO: ADD LOGS
  }
  const newWallet = await walletRepository.save(
    new Wallet({
      type: WalletTypes.DEPOSIT,
      data: {
        accountNumber: bankAccountResp?.data?.bankAccountNumber,
        accountTitle: bankAccountResp?.data?.bankAccountName,
        bsb: bankAccountResp?.data?.bsb,
      },
      userId: new ObjectId(id),
      createdBy: new ObjectId(id),
      updatedBy: new ObjectId(id),
    }),
    session
  );
  await activityRepository.addActivityLog(
    user.id,
    user.id,
    UserConstants.USER,
    null,
    UserConstants.USER_BANK_CREATED,
    {
      type: UserConstants.BANK,
      message: WalletMessages.GENERATE_DEPOSIT_ACCOUNT(user),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.CREATED,
    message: WalletMessages.WALLET_CREATED_SUCCESS,
    data: newWallet,
  };
}
module.exports = { createDepositWallet };
