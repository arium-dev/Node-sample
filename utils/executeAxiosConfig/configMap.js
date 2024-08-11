var base64 = require("base-64");
const crypto = require("crypto");
const {
  token,
  urls,
  recaptcha,
  sumSubKeys,
  currencyKeys,
  calendly,
} = require("../../config");
const { ApiMethods } = require("../../constants");

const {
  googleRecaptcha,
  sumsubApiUrl,
  monoovaApi,
  currencyApi,
  KEY,
  XAppAccessSig,
  HEX,
  geoLocationIp,
  TOKEN_TYPE,
} = require("./constants");
const {
  calendlyAuthorizationHeader,
  sumsubAuthorizationHeader,
  monoovaAuthorizationHeader,
  currencyAuthorizationHeader,
  monoovaWithdrawData,
} = require("./helper");

const sumSubConfig = (method, url) => {
  const ts = Math.floor(Date.now() / 1000);
  let config = {
    method: method,
    url: `${urls.sumSubApiUrl}${url}`,
    headers: sumsubAuthorizationHeader(ts),
  };
  const signature = crypto.createHmac(KEY, sumSubKeys.sumSubSecretKeys);
  signature.update(ts + method.toUpperCase() + url);
  config.headers[XAppAccessSig] = signature.digest(HEX);

  return config;
};

const configMap = {
  verifyGoogleRecaptcha: (data) => {
    const recaptchaSecret = recaptcha.recaptchaSecretKey;
    return {
      method: ApiMethods.POST,
      url: googleRecaptcha.verifyGoogleRecaptchaUrl(recaptchaSecret, data),
    };
  },
  getUserSumSubToken: (data) => {
    return sumSubConfig(
      ApiMethods.POST,
      sumsubApiUrl.getUserSumSubTokenUrl(data, sumSubKeys)
    );
  },
  resetUserData: (data) => {
    return sumSubConfig(ApiMethods.POST, sumsubApiUrl.resetUserDataUrl(data));
  },
  fetchUserData: (data) => {
    return sumSubConfig(ApiMethods.GET, sumsubApiUrl.fetchUserDataUrl(data));
  },
  getBankAccountStatus: (data) => {
    return {
      method: ApiMethods.GET,
      url: monoovaApi.bankAccountStatusUrl(urls, data),
      headers: monoovaAuthorizationHeader(token.monoova),
    };
  },
  createBankAccount: (data) => {
    return {
      method: ApiMethods.POST,
      url: monoovaApi.createBankAccountUrl(urls),
      headers: monoovaAuthorizationHeader(token.monoova),
      data: data,
    };
  },
  createDirectCredit: (data) => {
    return {
      method: ApiMethods.POST,
      url: monoovaApi.withdrawUrl(urls),
      headers: monoovaAuthorizationHeader(token.monoovaWithdraw),
      data: monoovaWithdrawData(data.withdraw, data.wallet),
    };
  },
  getCurrencyList: () => {
    return {
      method: ApiMethods.GET,
      url: currencyApi.currencyList(urls),
      headers: currencyAuthorizationHeader(currencyKeys.apiKey),
    };
  },
  getCurrencyRates: (data) => {
    return {
      method: ApiMethods.GET,
      url: currencyApi.exchangeRates(urls),
      headers: currencyAuthorizationHeader(currencyKeys.apiKey),
      data,
    };
  },
  getGeolocationOfIp: (data) => {
    return {
      method: ApiMethods.GET,
      url: geoLocationIp.getGeolocationOfIpUrl(urls, data, token),
    };
  },

  withdrawBalance: () => {
    return {
      method: ApiMethods.GET,
      url: monoovaApi.withdrawBalanceUrl(urls),
      headers: monoovaAuthorizationHeader(token.monoovaWithdraw),
    };
  },
  depositBalance: () => {
    return {
      method: ApiMethods.GET,
      url: monoovaApi.depositBalanceUrl(urls),
      headers: monoovaAuthorizationHeader(token.monoova),
    };
  },
  unclearTransactionByDate: (data) => {
    return {
      method: ApiMethods.GET,
      url: monoovaApi.unclearTransactionUrl(urls, data),
      headers: monoovaAuthorizationHeader(token.monoovaWithdraw),
    };
  },
  getCalendlyEventSlot: (data) => {
    return {
      method: ApiMethods.GET,
      url: data?.url,
      headers: calendlyAuthorizationHeader(
        calendly.personalAccessToken,
        TOKEN_TYPE.BEARER
      ),
    };
  },
};

module.exports = { configMap };
