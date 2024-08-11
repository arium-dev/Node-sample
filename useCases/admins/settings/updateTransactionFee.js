const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { HttpStatusCode, GenericMessages } = require("../../../constants");
const { SystemPreference } = require("../../../models/SystemPreference");

async function updateTransactionFee(id, body, { systemPreference }, session) {
  const { fee } = body;

  const preference = await systemPreference.findOne();

  let updatedPreference = await systemPreference.save(
    new SystemPreference({
      ...preference,
      transactionFee: {
        ...preference.transactionFee,
        value: fee,
      },
      updatedBy: new ObjectId(id),
    })
  );

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: GenericMessages.FEE_UPDATED_SUCCESS,
    data: updatedPreference,
  };
}

module.exports = { updateTransactionFee };
