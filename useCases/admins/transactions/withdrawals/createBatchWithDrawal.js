const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  HttpStatusCode,
  FiatManagment,
  GenericConstants,
  ActivityMessages,
} = require("../../../../constants");
const { FormatTwoDecimals } = require("../../../../utils/parser");
const {
  createWithdrawTransaction,
} = require("./helpers/createWithdrawTransaction");

const createBatchWithDrawal = async (
  { id },
  body,
  {
    batchRepository,
    transactionRepository,
    walletRepository,
    activityRepository,
    userRepository,
  },
  session
) => {
  let totalAmount = 0;
  if (body.withdraws && body.withdraws.length > 0) {
    totalAmount = body.withdraws.reduce((accumulator, currentValue) => {
      return parseFloat(accumulator) + parseFloat(currentValue.amount);
    }, 0);
  }

  totalAmount = FormatTwoDecimals(totalAmount || 0);
  totalAmount = totalAmount.toString();
  let batch = {
    type: GenericConstants._WITHDRAW,
    createdBy: new ObjectId(id),
    updatedBy: new ObjectId(id),
    amount: totalAmount,
  };

  const createBatch = await batchRepository.save(batch, session);

  let data = [];
  data = await Promise.all(
    body?.withdraws?.length > 0 &&
      body.withdraws.map(
        async (w) =>
          await createWithdrawTransaction(
            w,
            new ObjectId(createBatch?.id?.toString()),
            new ObjectId(id),
            transactionRepository,
            walletRepository,
            activityRepository,
            userRepository,
            session
          )
      )
  );
  await activityRepository.addActivityLog(
    new ObjectId(id),
    new ObjectId(id),
    GenericConstants._WITHDRAW,
    createBatch?.id,
    GenericConstants.WITHDRAW_CREATED,
    {
      type: GenericConstants._WITHDRAW,
      message: ActivityMessages.WITHDRAWAL_BATCH_CREATED(createBatch?.id),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();
  return {
    code: HttpStatusCode.CREATED,
    message: FiatManagment.WITHDRAWAL_CREATED_SUCCESSFULLY,
    data: data,
  };
};

module.exports = { createBatchWithDrawal };
