const { SystemPreference } = require("../../models/SystemPreference");
const {
  HttpStatusCode,
  GenericMessages,
  GenericConstants,
} = require("../../constants");
const Errors = require("../../errors");

async function addSystemPreferences({ systemRepository }) {
  const exists = await systemRepository.findOne();
  if (exists) {
    throw new Errors.BadRequest(GenericMessages.RECORD_ALREADY_EXISTS);
  }

  const preference = await systemRepository.save(
    new SystemPreference({
      transactionFee: {
        mode: GenericConstants.PERCENTAGE,
        value: "1",
      },
    })
  );
  return {
    code: HttpStatusCode.OK,
    data: preference,
  };
}
module.exports = { addSystemPreferences };
