const userLookup = {
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user",
  },
};

const userLogsWithUserLookup = {
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user",
  },
};

const userDetailLookup = {
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "userDetails",
  },
};

const withdrawSubmitByLookup = {
  $lookup: {
    from: "users",
    localField: "createdBy",
    foreignField: "_id",
    as: "submittedBy",
  },
};

const withdrawsOfBatchLookup = {
  $lookup: {
    from: "transactions",
    localField: "_id",
    foreignField: "transactionDetails.batchId",
    as: "withdraws",
  },
};

const roleWithSubmittedByLookup = {
  $lookup: {
    from: "roles",
    localField: "submittedBy.roleId",
    foreignField: "_id",
    as: "submittedBy.role",
  },
};

const usersLookUp = {
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "userId",
  },
};

const walletLookUp = {
  $lookup: {
    from: "wallets",
    localField: "transactionDetails.walletId",
    foreignField: "_id",
    as: "walletId",
  },
};

module.exports = {
  userLookup,
  userLogsWithUserLookup,
  userDetailLookup,
  withdrawSubmitByLookup,
  withdrawsOfBatchLookup,
  roleWithSubmittedByLookup,
  usersLookUp,
  walletLookUp,
};
