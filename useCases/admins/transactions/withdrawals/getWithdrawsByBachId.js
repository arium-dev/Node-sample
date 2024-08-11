const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { HttpStatusCode, FiatManagment } = require("../../../../constants");
const {
  getAllWithdrawTransactionsProject,
} = require("../../../../utils/projects");
const { usersLookUp, walletLookUp } = require("../../../../utils/lookUps");
const {
  userIdAddField,
  walletIdAddField,
} = require("../../../../utils/addFields");

const getWithdrawsByBachId = async (
  batchId = "",
  { transactionRepository }
) => {
  const queried = { "transactionDetails.batchId": new ObjectId(batchId) };

  let pipeline = [
    usersLookUp,
    userIdAddField,
    walletLookUp,
    walletIdAddField,
    { $match: queried },
    getAllWithdrawTransactionsProject,
  ];
  const transactions = await transactionRepository.findByAggregation(pipeline);
  return {
    code: HttpStatusCode.OK,
    message: FiatManagment.SUCCESSFULLY_FETCHED_WITHDRAWAL,
    data: transactions,
  };
};

module.exports = { getWithdrawsByBachId };
