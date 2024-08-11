const moment = require("moment");
const { mAccount, sumSubKeys } = require("../../config");
const { GenericConstants } = require("../../constants");

// exports.authorizationHeader = (token, key = "Bearer") => {
//   if (token) {
//     return {
//       Authorization: `${key} ${token}`,
//       "Content-Type": "application/json",
//     };
//   }
//   return null;
// };

// exports.authorizationHeaderByXAccessToken = (token) => {
//   if (token) {
//     return {
//       "x-access-token": token,
//     };
//   }
//   return null;
// };
exports.calendlyAuthorizationHeader = (token, key = "Bearer") => {
  if (token) {
    return {
      Authorization: `${key} ${token}`,
      "Content-Type": "application/json",
    };
  }
  return null;
};

exports.monoovaAuthorizationHeader = (token) => {
  if (token) {
    return {
      Authorization: token,
      "Content-Type": "application/json",
    };
  }
  return null;
};

exports.sumsubAuthorizationHeader = (ts) => {
  return {
    "Content-Type": "application/json",
    "X-App-Token": sumSubKeys.sumSubAppToken,
    "X-App-Access-Ts": ts,
  };
};

exports.currencyAuthorizationHeader = (apikey) => {
  return {
    "Content-Type": "application/json",
    apikey,
  };
};
exports.monoovaWithdrawData = (withdraw, wallet) => {
  const currentTimeStamp = moment();
  const ref = "FX" + currentTimeStamp;
  const amount = parseFloat(withdraw.amount || 0);
  return {
    uniqueReference: ref,
    totalAmount: amount,
    paymentSource: "mAccount",
    mAccount: {
      token: mAccount.withdrawalAccount,
    },
    description: "NP" + currentTimeStamp,
    disbursements: [
      {
        disbursementMethod: "directCredit",
        toDirectCreditDetails: {
          bsbNumber: wallet?.data?.bsb || "",
          bsb: wallet?.data?.bsb || "",
          accountNumber: wallet?.data?.accountNumber || "",
          accountName: wallet?.data?.accountTitle || withdraw?.userId || "",
          remitterName: GenericConstants.NEBULA_FX_PTY_LTD,
        },
        lodgementReference: withdraw?.transactionDetails?.refId || "",
        amount: amount,
        description: ref,
      },
    ],
  };
};
