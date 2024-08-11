const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { incomeGroup, outcomeGroup } = require("../../../utils/group");
const { incomeProject, outcomeProject } = require("../../../utils/projects");
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  TransactionType,
  TransactionStatus,
  GenericMessages,
} = require("../../../constants");

async function fetchIncomeOutcome(id, { transactionRepository }) {
  const income = await transactionRepository.findByAggregation([
    { $match: { type: TransactionType.TRANSFER } },
    { $match: { status: TransactionStatus.APPROVED } },
    {
      $match: {
        "transactionDetails.receiverDetails.recipientId": new ObjectId(id),
      },
    },
    incomeGroup,
    incomeProject,
  ]);

  const outcome = await transactionRepository.findByAggregation([
    { $match: { type: TransactionType.TRANSFER } },
    { $match: { status: TransactionStatus.APPROVED } },
    { $match: { userId: new ObjectId(id) } },
    outcomeGroup,
    outcomeProject,
  ]);

  return {
    code: HttpStatusCode.OK,
    data: { income: income[0]?.income || 0, outcome: outcome[0]?.outcome || 0 },
  };
}
module.exports = { fetchIncomeOutcome };
