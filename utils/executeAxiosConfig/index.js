const { configMap } = require("./configMap");
const Errors = require("../../errors");
const { SERVICE_ERROR, GenericConstants } = require("../../constants");

exports.executeAxiosConfig = (functionName, data = null) => {
  let config;
  if (typeof configMap[functionName] !== GenericConstants.FUNCTION) {
    throw new Errors.InternalServerError(SERVICE_ERROR);
  }
  if (data) {
    config = configMap[functionName](data);
  } else {
    config = configMap[functionName]();
  }
  return config;
};
