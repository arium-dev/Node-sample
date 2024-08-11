const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  HttpStatusCode,
  FiatManagment,
  GenericMessages,
  ActivityMessages,
  GenericConstants,
} = require("../../../../constants");
const { differenceBy } = require("lodash");
const { FormatTwoDecimals } = require("../../../../utils/parser");
const Errors = require("../../../../errors");
const {
  createWithdrawTransaction,
} = require("./helpers/createWithdrawTransaction");
const {
  updateWithdrawTransaction,
} = require("./helpers/updateWithdrawTransaction");
const {
  deleteWithdrawTransaction,
} = require("./helpers/deleteWithdrawTransaction");
const {
  getBatchStatusUponWithdrawals,
} = require("./helpers/getBatchStatusUponWithdrawals");

const updateBatchWithDrawal = async (
  { id },
  body,
  parmas,
  {
    batchRepository,
    transactionRepository,
    walletRepository,
    activityRepository,
    userRepository,
  },
  session
) => {
  let batchId = parmas.id;
  let obj = { _id: batchId };

  let totalAmount = 0;
  if (body.withdraws && body.withdraws.length > 0) {
    totalAmount = body.withdraws.reduce((accumulator, currentValue) => {
      return parseFloat(accumulator) + parseFloat(currentValue.amount);
    }, 0);
  }
  let batch = await batchRepository.findOne(obj, "withdraws");

  if (!batch) {
    throw new Errors.Conflict(GenericMessages.DATA_CHANGE_ERROR);
  }

  const deletedWithdraws = differenceBy(
    batch.withdraws,
    body.withdraws,
    GenericConstants.ID
  );

  const data = [];
  if (body?.withdraws?.length > 0) {
    for (const w of body.withdraws) {
      if (w.id) {
        data.push(
          await updateWithdrawTransaction(
            w,
            new ObjectId(batchId?.toString()),
            new ObjectId(id),
            transactionRepository,
            walletRepository,
            activityRepository,
            userRepository,
            session
          )
        );
      } else {
        data.push(
          await createWithdrawTransaction(
            w,
            new ObjectId(batchId?.toString()),
            new ObjectId(id),
            transactionRepository,
            walletRepository,
            activityRepository,
            userRepository,
            session
          )
        );
      }
    }
  }

  if (deletedWithdraws.length > 0) {
    const deleteData = [];
    for (const w of deletedWithdraws) {
      deleteData.push(
        await deleteWithdrawTransaction(
          w,
          new ObjectId(id),
          transactionRepository,
          walletRepository,
          activityRepository,
          session
        )
      );
    }
  }

  const status = await getBatchStatusUponWithdrawals(data, batch.status);

  totalAmount = totalAmount ? FormatTwoDecimals(parseFloat(totalAmount)) : 0;
  totalAmount = totalAmount.toString();
  batch.status = status;
  batch.amount = totalAmount;
  batch = await batchRepository.save(batch);

  await activityRepository.addActivityLog(
    new ObjectId(id),
    new ObjectId(id),
    GenericConstants._WITHDRAW,
    batchId,
    GenericConstants.WITHDRAW_UPDATED,
    {
      type: GenericConstants._WITHDRAW,
      message: ActivityMessages.WITHDRAWAL_BATCH_UPDATED(batchId),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();
  return {
    code: HttpStatusCode.OK,
    data: data,
    message: FiatManagment.WITHDRAWAL_UPDATED_SUCCESSFULLY,
  };
};

module.exports = { updateBatchWithDrawal };
