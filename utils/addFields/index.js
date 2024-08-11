const userNameAddField = {
  $addFields: {
    userName: {
      $concat: ["$user.firstName", " ", "$user.lastName"],
    },
  },
};

const nameAddField = {
  $addFields: {
    name: {
      $concat: ["$firstName", " ", "$lastName"],
    },
  },
};

const userNameFromDetailAddField = {
  $addFields: {
    userName: {
      $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"],
    },
  },
};

const addUserFromUserArr = {
  $addFields: {
    user: { $arrayElemAt: ["$user", 0] },
  },
};
const senderUserAddField = {
  $addFields: {
    senderUser: { $arrayElemAt: ["$senderUser", 0] },
  },
};

const userAddField = {
  $addFields: {
    user: { $arrayElemAt: ["$user", 0] },
  },
};

const eddStatusAddField = {
  $addFields: {
    eddStatus: {
      $cond: {
        if: {
          $regexMatch: { input: { $toString: "$status" }, regex: /pending/i },
        },
        then: "waiting to booked",
        else: "$status",
      },
    },
  },
};

const addFieldsForDeposits = {
  $addFields: {
    userId: { $ifNull: ["$user._id", ""] },
    lodgementRef: { $ifNull: ["$transactionDetails.LodgementRef", ""] },
  },
};

const submittedByField = {
  $addFields: {
    submittedBy: { $arrayElemAt: ["$submittedBy", 0] },
  },
};

const addRoleInSubmittedByField = {
  $addFields: {
    "submittedBy.role": "$submittedBy.role.name",
  },
};

const userIdAddField = {
  $addFields: {
    userId: { $arrayElemAt: ["$userId", 0] },
  },
};

const walletIdAddField = {
  $addFields: {
    walletId: { $arrayElemAt: ["$walletId", 0] },
  },
};
const userFullnameAddField = {
  $addFields: {
    "user.name": {
      $concat: ["$user.firstName", " ", "$user.lastName"],
    },
  },
};

const senderUserNameAddField = {
  $addFields: {
    "senderUser.name": {
      $concat: ["$senderUser.firstName", " ", "$senderUser.lastName"],
    },
  },
};

const recipientUserNameAddField = {
  $addFields: {
    "recipientUser.name": {
      $concat: ["$recipientUser.firstName", " ", "$recipientUser.lastName"],
    },
  },
};

module.exports = {
  nameAddField,
  userNameAddField,
  userNameFromDetailAddField,
  addUserFromUserArr,
  addFieldsForDeposits,
  submittedByField,
  addRoleInSubmittedByField,
  userIdAddField,
  walletIdAddField,
  userAddField,
  userNameAddField,
  userNameFromDetailAddField,
  senderUserAddField,
  senderUserNameAddField,
  recipientUserNameAddField,
  userFullnameAddField,
  eddStatusAddField,
};
