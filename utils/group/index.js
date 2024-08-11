const incomeGroup = {
  $group: {
    _id: null,
    income: { $sum: { $toDouble: "$transactionDetails.amount" } },
  },
};

const outcomeGroup = {
  $group: {
    _id: null,
    outcome: { $sum: { $toDouble: "$amount" } },
  },
};

const feeGroup = {
  $group: {
    _id: null,
    totalFee: { $sum: { $toDouble: "$transactionDetails.fee" } },
  },
};

module.exports = {
  incomeGroup,
  outcomeGroup,
  feeGroup,
};
