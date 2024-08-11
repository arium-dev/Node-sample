const axios = require("axios");
const { executeAxiosConfig } = require("../utils/executeAxiosConfig");
const Errors = require("../errors");
const {
  HttpStatusCode,
  GenericMessages,
  FunctionNames,
} = require("../constants");

class SubSumService {
  async getUserSumSubToken(id) {
    try {
      let config = executeAxiosConfig(FunctionNames.getUserSumSubToken, {
        id: id,
      });
      const response = await axios.request(config);
      return {
        code: HttpStatusCode.OK,
        user: response.data,
      };
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err?.response?.data,
          id: id,
          functionName: FunctionNames.getUserSumSubToken,
        }
      );
    }
  }

  async resetUserData(id) {
    try {
      const config = executeAxiosConfig(FunctionNames.resetUserData, {
        id: id,
      });

      const response = await axios.request(config);
      return {
        code: HttpStatusCode.OK,
        data: response.data,
      };
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err?.response?.data,
          id: id,
          functionName: FunctionNames.resetUserData,
        }
      );
    }
  }

  async fetchUserData(id) {
    try {
      const config = executeAxiosConfig(FunctionNames.fetchUserData, {
        id: id,
      });

      const response = await axios.request(config);
      return {
        code: HttpStatusCode.OK,
        data: response.data,
      };
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err?.response?.data,
          id: id,
          functionName: FunctionNames.fetchUserData,
        }
      );
    }
  }
}
module.exports = { SubSumService };
