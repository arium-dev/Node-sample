const axios = require("axios");
const { executeAxiosConfig } = require("../utils/executeAxiosConfig");
const Errors = require("../errors");
const { UserMessages, FunctionNames } = require("../constants");

class GeolocationService {
  getGeolocationOfIp = async (ip) => {
    try {
      if (!ip) return null;

      const config = executeAxiosConfig(FunctionNames.getGeolocationOfIp, {
        ip: ip,
      });

      const response = await axios(config);

      return (response && response.data) || null;
    } catch (error) {
      throw new Errors.InternalServerError(
        UserMessages.COULD_NOT_GET_USER_IP_LOCATION,
        {
          error: error?.response?.data,
          ip: ip,
          functionName: FunctionNames.getGeolocationOfIp,
        }
      );
    }
  };
}
module.exports = { GeolocationService };
