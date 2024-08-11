const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  GenericConstants,
  ActivityMessages,
} = require("../../../../../constants");

const deleteWithdrawTransaction = async (
  w,
  updatedBy,
  transactionRepository,
  walletRepository,
  activityRepository,
  session
) => {
  const wallet = await walletRepository.findById(
    w?.transactionDetails?.walletId
  );
  const deleteWithdraw = await transactionRepository.deleteById(w.id);
  deleteWithdraw.updatedBy = updatedBy;

  await activityRepository.addActivityLog(
    deleteWithdraw.userId,
    updatedBy,
    GenericConstants._WITHDRAW,
    deleteWithdraw.id,
    GenericConstants.WITHDRAW_DELETED,
    {
      type: GenericConstants._WITHDRAW,
      message: ActivityMessages.WITHDRAWAL_REQUEST_DELETED(
        deleteWithdraw,
        wallet
      ),
    },
    session
  );
};

module.exports = { deleteWithdrawTransaction };
