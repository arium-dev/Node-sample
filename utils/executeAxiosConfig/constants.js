const { mAccount } = require("../../config");
exports.TOKEN_TYPE = {
  BEARER: "Bearer",
  BASIC: "Basic",
};
exports.KEY = "sha256";
exports.XAppAccessSig = "X-App-Access-Sig";
exports.HEX = "hex";

exports.geoLocationIp = {
  getGeolocationOfIpUrl: (urls, data, token) => {
    return `${urls.ipStackUrl}/${data?.ip}?access_key=${token.ipStackKey}`;
  },
};

exports.googleRecaptcha = {
  verifyGoogleRecaptchaUrl: (recaptchaSecret, data) => {
    return `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${data?.token}`;
  },
};

exports.sumsubApiUrl = {
  getUserSumSubTokenUrl: (data, sumSubKeys) => {
    return `/resources/accessTokens?userId=${data?.id}&levelName=${sumSubKeys.sumSubLevelName}`;
  },
  resetUserDataUrl: (data) => {
    return `/resources/applicants/${data?.id}/reset`;
  },
  fetchUserDataUrl: (data) => {
    return `/resources/applicants/-;externalUserId=${data?.id}/one`;
  },
};

exports.monoovaApi = {
  createBankAccountUrl: (urls) => {
    return urls.monovaUrl + "/receivables/v1/create";
  },
  bankAccountStatusUrl: (urls, data) => {
    return (
      urls.monovaUrl +
      "/receivables/v1/statusByBankAccount/" +
      parseInt(data?.bankAccountNumber)
    );
  },
  withdrawBalanceUrl: (urls) => {
    return (
      urls.monovaUrl + "/mAccount/v1/financials/" + mAccount.withdrawalAccount
    );
  },
  depositBalanceUrl: (urls) => {
    return (
      urls.monovaUrl + "/mAccount/v1/financials/" + mAccount.depositAccount
    );
  },
  unclearTransactionUrl: (urls, data) => {
    return `${urls.monovaUrl}/reports/v1/unclearedFunds/${
      data?.startDate
    }?endDate=${data?.endDate}&pageNumber=${1}&pageSize=${200}`;
  },
  withdrawUrl: (urls) => {
    return urls.monovaUrl + "/financial/v2/transaction/execute";
  },
};

exports.currencyApi = {
  currencyList: (urls) => {
    return `${urls.currencyUrl}/currencies`;
  },
  exchangeRates: (urls) => {
    return `${urls.currencyUrl}/latest`;
  },
};
