const Errors = require("../../../errors");
const { HttpStatusCode, WalletMessages } = require("../../../constants");

async function getFee({ systemRepository }) {
  let preference = await systemRepository.findOne({});

  if (!preference?.transactionFee) {
    throw new Errors.Unauthorized(WalletMessages.FEE_FETCHED_FAILED);
  }

  return {
    code: HttpStatusCode.OK,
    message: WalletMessages.FEE_FETCHED_SUCCESS,
    data: preference.transactionFee,
  };
}
module.exports = { getFee };
