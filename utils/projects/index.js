const userLogsProject = {
  $project: {
    id: { $toString: "$_id" },
    _id: 1,
    firstName: 1,
    lastName: 1,
    ip: 1,
    os: 1,
    device: 1,
    browser: 1,
    language: 1,
    region: 1,
    location: 1,
    userId: {
      id: { $toString: "$userId._id" },
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
    },
    createdAt: 1,
    updatedAt: 1,
  },
};

const totalCountDataProject = {
  $project: {
    totalCount: "$totalCount.count",
    data: 1,
  },
};

const activityUserProject = {
  $project: {
    id: { $toString: "$_id" },
    _id: 1,
    type: 1,
    activityType: 1,
    transactionId: 1,
    profileId: 1,
    userId: 1,
    message: 1,
    createdAt: 1,
    updatedAt: 1,
    userDetails: { firstName: 1, lastName: 1, email: 1, role: 1 },
  },
};

const incomeProject = {
  $project: {
    _id: 0,
    income: 1,
  },
};

const outcomeProject = {
  $project: {
    _id: 0,
    outcome: 1,
  },
};

const userDepositTransactionsProject = {
  $project: {
    id: { $toString: "$_id" },
    _id: 1,
    createdAt: 1,
    reference: 1,
    amount: 1,
    status: 1,
  },
};
const userProject = {
  $project: {
    _id: 1,
    firstName: 1,
    lastName: 1,
    name: 1,
    email: 1,
    dob: 1,
    contactNumber: 1,
    status: 1,
    level: 1,
    twoFa: {
      enabled: 1,
      secret: 1,
      tempSecret: 1,
    },
    wallet: {
      _id: 1,
      type: 1,
      data: {
        accountTitle: 1,
        accountNumber: 1,
        bsb: 1,
      },
    },
    withdrawWallet: {
      _id: 1,
      type: 1,
      data: {
        accountTitle: 1,
        accountNumber: 1,
        bsb: 1,
      },
    },
    eddVerified: 1,
    threshold: 1,
    isKycAlertEmail: 1,
    createdAt: 1,
    updatedAt: 1,
  },
};

const depositsProject = {
  $project: {
    id: { $toString: "$_id" },
    _id: 1,
    userName: 1,
    amount: 1,
    status: 1,
    createdAt: 1,
    lodgementRef: 1,
    userId: 1,
  },
};

const batchWithdrawsProject = {
  $project: {
    id: { $toString: "$_id" },
    _id: 1,
    createdAt: 1,
    createdBy: 1,
    amount: 1,
    status: 1,
    submittedBy: {
      _id: 1,
      id: { $toString: "$submittedBy._id" },
      firstName: 1,
      lastName: 1,
      roleId: 1,
      role: 1,
    },
    updatedAt: 1,
    createdAt: 1,
    withdraws: {
      amount: 1,
      status: 1,
      transactionId: 1,
      userId: 1,
      transactionDetails: 1,
      updatedAt: 1,
      createdAt: 1,
    },
  },
};

const getAllWithdrawTransactionsProject = {
  $project: {
    _id: 1,
    id: { $toString: "$_id" },
    type: 1,
    accountNumber: { $toString: "$walletId.data.accountNumber" },
    accountTitle: { $toString: "$walletId.data.accountTitle" },
    bsb: { $toString: "$walletId.data.bsb" },
    amount: 1,
    status: 1,
    receipt: { $toString: "$transactionDetails.receipt" },
    refId: { $toString: "$transactionDetails.refId" },
    message: { $toString: "$transactionDetails.message" },
    batchId: { $toString: "$transactionDetails.batchId" },
    createdAt: 1,
    updatedAt: 1,
    userId: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      level: 1,
    },
  },
};

const userWalletProject = {
  $project: {
    _id: 1,
    id: { $toString: "$_id" },
    firstName: 1,
    lastName: 1,
    name: 1,
    email: 1,
    status: 1,
    wallet: {
      _id: 1,
      type: 1,
      accountTitle: { $toString: "$wallet.data.accountTitle" },
      accountNumber: { $toString: "$wallet.data.accountNumber" },
      bsb: { $toString: "$wallet.data.bsb" },
    },
    createdAt: 1,
    updatedAt: 1,
  },
};

const adminTransactionProject = {
  $project: {
    _id: 1,
    type: 1,
    transactionId: 1,
    status: 1,
    queueStatus: 1,
    amount: 1,
    note: 1,
    userId: 1,
    createdBy: 1,
    updatedBy: 1,
    createdAt: 1,
    updatedAt: 1,
    recipientId: 1,
    transactionDetails: {
      amount: 1,
      fee: 1,
      refId: 1,
      receipt: 1,
    },
    senderUser: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
    },
    recipientUser: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
    },
    sourceCurrency: {
      _id: 1,
      name: 1,
      code: 1,
      symbol: 1,
      logo: 1,
    },
    exchangeCurrency: {
      _id: 1,
      name: 1,
      code: 1,
      symbol: 1,
      logo: 1,
    },
    conversionRate: 1,
  },
};

const eddVerificationProject = {
  $project: {
    _id: 1,
    startDate: 1,
    endDate: 1,
    status: 1,
    note: 1,
    emailStatus: 1,
    videoLink: 1,
    threshold: {
      previous: 1,
      new: 1,
    },
    edd: {
      previous: 1,
      new: 1,
    },
    userId: 1,
    data: 1,
    createdAt: 1,
    updatedAt: 1,
    user: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      name: 1,
    },
  },
};

module.exports = {
  userLogsProject,
  totalCountDataProject,
  activityUserProject,
  incomeProject,
  outcomeProject,
  userDepositTransactionsProject,
  userProject,
  depositsProject,
  batchWithdrawsProject,
  getAllWithdrawTransactionsProject,
  userWalletProject,
  adminTransactionProject,
  eddVerificationProject,
};
