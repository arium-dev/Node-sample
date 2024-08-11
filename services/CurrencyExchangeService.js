const axios = require("axios");
const { executeAxiosConfig } = require("../utils/executeAxiosConfig");
const Errors = require("../errors");
const { FunctionNames, GenericMessages } = require("../constants");

class CurrencyExchangeService {
  async getCurrencyList() {
    try {
      const config = executeAxiosConfig(FunctionNames.getCurrencyList);
      const currencies = await axios(config);
      return currencies;
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err?.response?.data,
          functionName: FunctionNames.getCurrencyList,
        }
      );
    }
  }
  async getCurrencyRates(data) {
    try {
      const config = executeAxiosConfig(FunctionNames.getCurrencyRates, data);
      const rates = await axios(config);
      return rates;
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err?.response?.data,
          functionName: FunctionNames.getCurrencyRates,
        }
      );
    }
  }
}
module.exports = { CurrencyExchangeService };
