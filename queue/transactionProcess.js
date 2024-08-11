const { default: axios } = require("axios");
const { HttpStatusCode, GenericMessages } = require("../constants");
const { webhookApiKey, urls } = require("../config");

const mailProcess = async (job, done) => {
  try {
    const response = await execute(job.data);
    if (response.code === HttpStatusCode.OK) {
      done();
    } else {
      done(new Error(response?.message || "Failed"));
    }
  } catch (err) {
    done(new Error("failed"));
  }
};
const execute = async (data) => {
  try {
    const apiUrl = `${urls.serverUrl}/api/queues/${data.type}/${data.subType}`;
    const headers = { "x-api-key": webhookApiKey };

    try {
      const resp = await axios.post(apiUrl, data, { headers });

      return resp?.data;
    } catch (err) {
      return {
        code: err?.response?.data?.code || HttpStatusCode.INTERNAL_SERVER_ERROR,
        message:
          typeof err?.response?.data?.message === "string"
            ? err?.response?.data?.message
            : err?.response?.data?.message?.[0]?.message ||
              GenericMessages.INTERNAL_SERVER_ERROR,
      };
    }
  } catch (err) {
    return {
      code: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: GenericMessages.INTERNAL_SERVER_ERROR,
    };
  }
};
module.exports = mailProcess;
