const moment = require("moment");

const recipientInfoLookup = {
  $lookup: {
    from: "users",
    localField: "recipientId",
    foreignField: "_id",
    as: "recipientInfo",
  },
};

const userIdLookup = {
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user",
  },
};

const recipientSourceCurrencyIdLookup = {
  $lookup: {
    from: "currencies",
    localField: "transactionDetails.senderDetails.sourceCurrencyId",
    foreignField: "_id",
    as: "sourceCurrency",
  },
};

const recipientExchangeCurrencyIdLookup = {
  $lookup: {
    from: "currencies",
    localField: "transactionDetails.senderDetails.exchangedCurrencyId",
    foreignField: "_id",
    as: "exchangeCurrency",
  },
};

const recipientIdLookup = [
  {
    $lookup: {
      from: "users",
      localField: "transactionDetails.receiverDetails.recipientId",
      foreignField: "_id",
      as: "recipientUser",
    },
  },
  {
    $addFields: {
      recipientUser: { $arrayElemAt: ["$recipientUser", 0] },
    },
  },
  {
    $addFields: {
      "recipientUser.name": {
        $concat: ["$recipientUser.firstName", " ", "$recipientUser.lastName"],
      },
    },
  },
];

const senderUserLookupAdmin = {
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "senderUser",
  },
};

const senderUserLookup = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "senderUser",
    },
  },
  {
    $addFields: {
      senderUser: { $arrayElemAt: ["$senderUser", 0] },
    },
  },
  {
    $addFields: {
      "senderUser.name": {
        $concat: ["$senderUser.firstName", " ", "$senderUser.lastName"],
      },
    },
  },
];

const sourceCurrencyAddField = {
  $addFields: {
    sourceCurrency: { $arrayElemAt: ["$sourceCurrency", 0] },
  },
};

const exchangeCurrencyAddField = {
  $addFields: {
    exchangeCurrency: { $arrayElemAt: ["$exchangeCurrency", 0] },
  },
};

const conversionRateAddField = {
  $addFields: {
    conversionRate: "$transactionDetails.senderDetails.exchangedConversionRate",
  },
};

const recipientWalletLookup = {
  $lookup: {
    from: "users",
    localField: "recipientId",
    foreignField: "_id",
    as: "recipientInfo",
  },
};

const recipientInfoAddField = {
  $addFields: {
    recipientInfo: { $arrayElemAt: ["$recipientInfo", 0] },
  },
};

const recipientNameAddField = {
  $addFields: {
    "recipientInfo.name": {
      $concat: ["$recipientInfo.firstName", " ", "$recipientInfo.lastName"],
    },
  },
};

const recipientDepositWallet = [
  {
    $lookup: {
      from: "wallets",
      let: { userId: "$recipientId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$userId"] },
                { $eq: ["$type", "deposit"] },
                { $eq: ["$deleted", false] },
              ],
            },
          },
        },
      ],
      as: "wallets",
    },
  },
  {
    $addFields: {
      wallet: { $arrayElemAt: ["$wallets", 0] },
    },
  },
];

const userDepositWallet = [
  {
    $lookup: {
      from: "wallets",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$userId"] },
                { $eq: ["$type", "deposit"] },
                { $eq: ["$deleted", false] },
              ],
            },
          },
        },
      ],
      as: "wallets",
    },
  },
  {
    $addFields: {
      wallet: { $arrayElemAt: ["$wallets", 0] },
    },
  },
];

const userWithdrawWallet = [
  {
    $lookup: {
      from: "wallets",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$userId"] },
                { $eq: ["$type", "withdraw"] },
                { $eq: ["$deleted", false] },
              ],
            },
          },
        },
      ],
      as: "withdrawWallet",
    },
  },
  {
    $addFields: {
      withdrawWallet: { $arrayElemAt: ["$withdrawWallet", 0] },
    },
  },
];

const userPreferenceLookup = [
  {
    $lookup: {
      from: "userpreferences",
      localField: "_id",
      foreignField: "userId",
      as: "preferences",
    },
  },
  {
    $addFields: {
      preference: { $arrayElemAt: ["$preferences", 0] },
    },
  },
  {
    $addFields: {
      eddVerified: "$preference.deposit.eddVerified",
      threshold: "$preference.deposit.threshold",
      isKycAlertEmail: "$preference.deposit.isKycAlertEmail",
    },
  },
];

const recipientProject = {
  $project: {
    _id: 1,
    recipientId: 1,
    userId: 1,
    createdAt: 1,
    updatedAt: 1,
    recipientInfo: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      name: 1,
      email: 1,
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
  },
};

const userRecipientInfoSearch = (searched) => [
  {
    "recipientInfo.email": {
      $regex: searched ? searched.replace(/\+/g, "\\+") : searched,
      $options: "i",
    },
  },
  { "recipientInfo.firstName": { $regex: searched, $options: "i" } },
  { "recipientInfo.lastName": { $regex: searched, $options: "i" } },
  { "recipientInfo.name": { $regex: searched, $options: "i" } },
];

const userWalletSearch = (searched) => [
  { "wallet.data.accountNumber": { $regex: searched, $options: "i" } },
  { "wallet.data.accountTitle": { $regex: searched, $options: "i" } },
  { "wallet.data.bsb": { $regex: searched, $options: "i" } },
];

const rootUserSearch = (searched) => [
  { name: { $regex: searched, $options: "i" } },
  {
    email: {
      $regex: searched ? searched.replace(/\+/g, "\\+") : searched,
      $options: "i",
    },
  },
];

const currencySearch = (searched) => [
  { "currency.name": { $regex: searched, $options: "i" } },
  { "currency.code": { $regex: searched, $options: "i" } },
];

const kycSearch = (searched) => {
  const levels = {
    rejected: "0",
    "not verified": "1",
    pending: "2",
    verified: "3",
  };
  const level = levels[searched?.toLowerCase()] || "";
  if (level) {
    return [
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$level" },
            regex: level,
            options: "i",
          },
        },
      },
    ];
  }
  return [];
};

const adminTransactionSearch = (searched) => [
  { status: { $regex: searched, $options: "i" } },
  { date: { $regex: searched, $options: "i" } },
  { amount: { $regex: searched, $options: "i" } },
  {
    "senderUser.email": {
      $regex: searched ? searched.replace(/\+/g, "\\+") : searched,

      $options: "i",
    },
  },
  { "senderUser.name": { $regex: searched, $options: "i" } },
  {
    "recipientUser.email": {
      $regex: searched ? searched.replace(/\+/g, "\\+") : searched,

      $options: "i",
    },
  },
  { "recipientUser.name": { $regex: searched, $options: "i" } },
];

const eddVerificationSearch = (searchTerm) => {
  const searchTermString = searchTerm.toString();
  return [
    { "user.name": { $regex: searchTerm, $options: "i" } },
    { status: { $regex: searchTerm, $options: "i" } },
    { eddStatus: { $regex: searchTerm, $options: "i" } },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$amount" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
  ];
};

const getPaginationWithTotalCountFacet = (obj = {}) => {
  return {
    $facet: {
      paginatedData: [
        { $sort: { _id: -1 } },
        { $skip: obj.pageLimit },
        { $limit: obj.limit },
        { $project: { __v: 0 } },
      ],
      totalCount: [{ $count: "count" }],
    },
  };
};

const singleRecordFacet = {
  $facet: {
    paginatedData: [
      { $sort: { _id: -1 } },
      { $limit: 1 },
      { $project: { __v: 0 } },
    ],
  },
};

const getDatesSearchCondition = (searchQuery) => {
  let dateCondition = [];
  const possibleDateFormats = [
    "HH:mm:ss",
    "HH:mm",
    "HH",
    "YYYY-MM-DD HH:mm:ss",
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DD HH",
    "YYYY-MM-DD",
    "YYYY-MM",
    "YYYY",
    "D MMMM, YYYY",
  ];

  const endDateConditions = [
    "second",
    "minute",
    "hour",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
    "days",
  ];

  for (let i = 0; i < possibleDateFormats.length; i++) {
    let format = possibleDateFormats[i];

    if (moment(searchQuery, format, true).isValid()) {
      const startDateTime = moment(searchQuery, format)
        .subtract(process.env.DIFF_TIME_ZONE, "hour")
        .format(format);

      const enddDateTime = moment(startDateTime)
        .add(1, endDateConditions[i])
        .toDate();

      dateCondition = [
        {
          createdAt: {
            $gte: new Date(startDateTime),
            $lt: enddDateTime,
          },
        },
        {
          updatedAt: {
            $gte: new Date(startDateTime),
            $lt: enddDateTime,
          },
        },
      ];
      break;
    }
  }
  return dateCondition;
};

const getDepositsSearchCondition = (searchTerm) => {
  const searchTermString = searchTerm.toString();
  return [
    { userName: { $regex: searchTerm, $options: "i" } },
    { status: { $regex: searchTerm, $options: "i" } },
    {
      "getDepositsSearchCondition.LodgementRef": {
        $regex: searchTerm,
        $options: "i",
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$amount" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
  ];
};

const getUserLogSearchCondition = (searchQuery) => {
  return [
    { firstName: { $regex: searchQuery, $options: "i" } },
    { lastName: { $regex: searchQuery, $options: "i" } },
    { userName: { $regex: searchQuery, $options: "i" } },
    {
      "user.email": {
        $regex: searchQuery ? searchQuery.replace(/\+/g, "\\+") : searchQuery,

        $options: "i",
      },
    },
    { ip: { $regex: searchQuery, $options: "i" } },
    { os: { $regex: searchQuery, $options: "i" } },
    { device: { $regex: searchQuery, $options: "i" } },
    { browser: { $regex: searchQuery, $options: "i" } },
    { language: { $regex: searchQuery, $options: "i" } },
    { region: { $regex: searchQuery, $options: "i" } },
    { location: { $regex: searchQuery, $options: "i" } },
  ];
};

const getUserActivitySearchCondition = (searchQuery) => {
  return [
    { type: { $regex: searchQuery, $options: "i" } },
    { activityType: { $regex: searchQuery, $options: "i" } },
    { message: { $regex: searchQuery, $options: "i" } },
  ];
};

const getUserTransactionSearchCondition = (searchTerm) => {
  const searchTermString = searchTerm.toString();
  return [
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$bsb" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$accountNumber" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$createdAt" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$amount" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$receipt" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$status" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
  ];
};

const batchesLookup = {
  $lookup: {
    from: "batches",
    localField: "transactionDetails.batchId",
    foreignField: "_id",
    as: "batchDetails",
  },
};

const walletLookup = {
  $lookup: {
    from: "wallets",
    localField: "transactionDetails.walletId",
    foreignField: "_id",
    as: "walletDetails",
  },
};

const depositTransactionsAddFields = {
  $addFields: {
    reference: "$transactionDetails.LodgementRef",
  },
};
const fetchWithdrawTransactionsAddFields = {
  $addFields: {
    bsb: "$walletDetails.data.bsb",
    accountNumber: "$walletDetails.data.accountNumber",
    createdAt: "$batchDetails.createdAt",
    amount: "$batchDetails.amount",
    receipt: "$transactionDetails.receipt",
    status: "$batchDetails.status",
  },
};

const fetchWithdrawTransactionsProject = {
  $project: {
    bsb: 1,
    accountNumber: 1,
    createdAt: 1,
    amount: 1,
    receipt: 1,
    status: 1,
  },
};

const recipientTransactionProject = {
  $project: {
    _id: 1,
    type: 1,
    transactionId: 1,
    status: 1,
    queueStatus: 1,
    amount: 1,
    note: 1,
    userId: 1,
    date: 1,
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
      name: 1,
      email: 1,
    },
    recipientUser: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      name: 1,
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

const userDepositTransactionSearchCondition = (searchTerm) => {
  const searchTermString = searchTerm.toString();
  return [
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$createdAt" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$reference" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$amount" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$status" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
  ];
};

const getWithdrawsSearchCondition = (searchTerm) => {
  const searchTermString = searchTerm.toString();

  return [
    {
      $expr: {
        $regexMatch: {
          input: {
            $concat: ["$submittedBy.firstName", " ", "$submittedBy.lastName"],
          },
          regex: searchTermString,
          options: "i",
        },
      },
    },

    { amount: { $regex: searchTerm, $options: "i" } },
    { actionType: { $regex: searchTerm, $options: "i" } },
    { "submittedBy.role": { $regex: searchTerm, $options: "i" } },
    { "withdraws.accountNumber": { $regex: searchTerm, $options: "i" } },
    { "withdraws.actionType": { $regex: searchTerm, $options: "i" } },
    { "withdraws.batchId": { $regex: searchTerm, $options: "i" } },
    { "withdraws.bsb": { $regex: searchTerm, $options: "i" } },
    { "withdraws.id": { $regex: searchTerm, $options: "i" } },
    { "withdraws.message": { $regex: searchTerm, $options: "i" } },
    { "withdraws.quantity": { $regex: searchTerm, $options: "i" } },
    { "withdraws.refId": { $regex: searchTerm, $options: "i" } },
    { "withdraws.status": { $regex: searchTerm, $options: "i" } },
    { "withdraws.txId": { $regex: searchTerm, $options: "i" } },
    { "withdrawUsers.contactNumber": { $regex: searchTerm, $options: "i" } },
    {
      "withdrawUsers.email": {
        $regex: searchTerm ? searchTerm.replace(/\+/g, "\\+") : searchTerm,

        $options: "i",
      },
    },
    { "withdrawUsers.level": { $regex: searchTerm, $options: "i" } },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$_id" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$status" },
          regex: searchTermString?.replace(/\s/g, "") || searchTermString,
          options: "i",
        },
      },
    },
  ];
};

const userBalanceLookup = [
  {
    $lookup: {
      from: "balances",
      localField: "_id",
      foreignField: "userId",
      as: "balance",
    },
  },
  {
    $addFields: {
      balance: { $arrayElemAt: ["$balance", 0] },
    },
  },
  // {
  //   $addFields: {
  //     eddVerified: "$preference.deposit.eddVerified",
  //     threshold: "$preference.deposit.threshold",
  //     isKycAlertEmail: "$preference.deposit.isKycAlertEmail",
  //   },
  // },
];
const senderUserSearch = (searched) => [
  {
    "senderUser.email": {
      $regex: searched ? searched.replace(/\+/g, "\\+") : searched,

      $options: "i",
    },
  },
  { "senderUser.name": { $regex: searched, $options: "i" } },
];

const recipientUserSearch = (searched) => [
  {
    "recipientUser.email": {
      $regex: searched ? searched.replace(/\+/g, "\\+") : searched,

      $options: "i",
    },
  },
  { "recipientUser.name": { $regex: searched, $options: "i" } },
];

const transactionAllSearch = (searched) => [
  { status: { $regex: searched, $options: "i" } },
  { amount: { $regex: searched, $options: "i" } },
  { date: { $regex: searched, $options: "i" } },
  { "transactionDetails.amount": { $regex: searched, $options: "i" } },
];

const dateSearchCondition = (date) => [
  {
    date: {
      $gte: date,
      $lt: date,
    },
  },
  {
    date: {
      $gte: date,
      $lt: date,
    },
  },
];

const getTransactionWithdrawSearchCondition = (searchTerm) => {
  const searchTermString = searchTerm.toString();
  const levels = {
    rejected: "0",
    "not verified": "1",
    pending: "2",
    verified: "3",
  };

  const level = levels[searchTerm?.toLowerCase()] || "";

  let condition = [
    { bsb: { $regex: searchTerm, $options: "i" } },
    { accountNumber: { $regex: searchTerm, $options: "i" } },
    { refId: { $regex: searchTerm, $options: "i" } },
    { status: { $regex: searchTerm, $options: "i" } },
    { "transactionDetails.refId": { $regex: searchTerm, $options: "i" } },
    { "walletId.data.bsb": { $regex: searchTerm, $options: "i" } },
    { "walletId.data.accountTitle": { $regex: searchTerm, $options: "i" } },
    { "walletId.data.accountNumber": { $regex: searchTerm, $options: "i" } },
    {
      $expr: {
        $regexMatch: {
          input: { $concat: ["$userId.firstName", " ", "$userId.lastName"] },
          regex: searchTermString,
          options: "i",
        },
      },
    },
    {
      "userId.email": {
        $regex: searchTerm ? searchTerm.replace(/\+/g, "\\+") : searchTerm,

        $options: "i",
      },
    },
    {
      $expr: {
        $regexMatch: {
          input: { $toString: "$amount" },
          regex: searchTermString,
          options: "i",
        },
      },
    },
  ];

  if (level) {
    condition = [
      ...condition,
      {
        $expr: {
          $regexMatch: {
            input: { $toString: "$userId.level" },
            regex: level,
            options: "i",
          },
        },
      },
    ];
  }

  return condition;
};

module.exports = {
  userIdLookup,
  recipientInfoLookup,
  recipientInfoAddField,
  recipientProject,
  recipientDepositWallet,
  userDepositWallet,
  userRecipientInfoSearch,
  userWalletSearch,
  getPaginationWithTotalCountFacet,
  singleRecordFacet,
  getDatesSearchCondition,
  getUserLogSearchCondition,
  getUserActivitySearchCondition,
  getUserTransactionSearchCondition,
  batchesLookup,
  walletLookup,
  fetchWithdrawTransactionsAddFields,
  fetchWithdrawTransactionsProject,
  recipientSourceCurrencyIdLookup,
  sourceCurrencyAddField,
  recipientExchangeCurrencyIdLookup,
  exchangeCurrencyAddField,
  conversionRateAddField,
  recipientTransactionProject,
  recipientNameAddField,
  depositTransactionsAddFields,
  userDepositTransactionSearchCondition,
  userPreferenceLookup,
  rootUserSearch,
  currencySearch,
  kycSearch,
  getDepositsSearchCondition,
  getWithdrawsSearchCondition,
  userBalanceLookup,
  senderUserLookup,
  senderUserLookupAdmin,
  adminTransactionSearch,
  userWithdrawWallet,
  eddVerificationSearch,
  senderUserSearch,
  recipientUserSearch,
  transactionAllSearch,
  dateSearchCondition,
  recipientIdLookup,
  getTransactionWithdrawSearchCondition,
};
