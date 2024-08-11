const axios = require("axios");
const { calendly } = require("../config");
const { GenericMessages, EddMessages, FunctionNames } = require("../constants");
const Errors = require("../errors");
const { executeAxiosConfig } = require("../utils/executeAxiosConfig");

class CalendlyService {
  async getCalendlyToken(code) {
    try {
      let config = executeAxiosConfig(FunctionNames.getCalendlyToken, {
        grant_type: calendly.grantType,
        code: code,
        redirect_uri: calendly.redirectUrl,
      });

      const response = await axios(config);
      if (response && response.data && response.data.access_token) {
        return response.data.access_token;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        err?.response?.data
      );
    }
  }

  async getCalendlyEventSlot(url) {
    try {
      let config = executeAxiosConfig(FunctionNames.getCalendlyEventSlot, {
        url: url,
      });

      const response = await axios(config);
      if (response.data && response.data.resource) {
        return response.data.resource;
      }
      return null;
    } catch (error) {
      console.log("error>>", error);
      throw new Errors.InternalServerError(EddMessages.EVENT_SLOT_NOT_GET, {
        error: error?.response?.data,
        functionName: FunctionNames.getCalendlyEventSlot,
      });
    }
  }
}

module.exports = { CalendlyService };
