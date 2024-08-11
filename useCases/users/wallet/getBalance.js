const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../errors");
const { HttpStatusCode, WalletMessages } = require("../../../constants");

async function getBalance(id, { balanceRepository }) {
  let balance = await balanceRepository.findOne({
    userId: new ObjectId(id),
  });

  if (!balance) {
    throw new Errors.Unauthorized(WalletMessages.BALANCE_FETCHED_FAILED);
  }

  return {
    code: HttpStatusCode.OK,
    message: WalletMessages.BALANCE_FETCHED_SUCCESS,
    data: balance,
  };
}
module.exports = { getBalance };
