const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  WalletMessages,
} = require("../../../constants");

async function getAllWallets(id, { walletRepository }) {
  if (!id) {
    throw new Errors.Unauthorized(GenericMessages.TOKEN_IS_INVALID);
  }
  const wallets = await walletRepository.find({
    userId: new ObjectId(id),
    deleted: false,
  });

  return {
    code: HttpStatusCode.OK,
    message: WalletMessages.WALLETS_FETCHED_SUCCESS,
    data: wallets,
  };
}
module.exports = { getAllWallets };
