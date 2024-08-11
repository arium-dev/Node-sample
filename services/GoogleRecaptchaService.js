const axios = require("axios");
const { executeAxiosConfig } = require("../utils/executeAxiosConfig");
const Errors = require("../errors");
const { UserMessages, HttpStatusCode, FunctionNames } = require("../constants");

class GoogleRecaptchaService {
  async verifyGoogleRecaptcha(token, email = "") {
    try {
      const config = executeAxiosConfig(FunctionNames.verifyGoogleRecaptcha, {
        token: token,
      });
      const recaptchaResp = await axios(config);
      if (recaptchaResp?.data?.success) {
        return { code: HttpStatusCode.OK, data: recaptchaResp.data };
      }
      return { code: HttpStatusCode.NOT_FOUND, data: recaptchaResp.data };
    } catch (err) {
      throw new Errors.InternalServerError(UserMessages.INVALID_RECAPTCHA, {
        errorr: err?.response?.data,
        email: email,
        functionName: FunctionNames.verifyGoogleRecaptcha,
      });
    }
  }
}
module.exports = { GoogleRecaptchaService };
