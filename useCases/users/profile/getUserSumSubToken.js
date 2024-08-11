const Errors = require("../../../errors");
const { GenericMessages, HttpStatusCode } = require("../../../constants");

async function getUserSumSubToken(id, { subSumService }) {
  try {
    const response = await subSumService.getUserSumSubToken(id);
    if (response?.code === HttpStatusCode.OK) {
      // TODO: Generate Logs
    }
    return response;
  } catch (err) {
    throw new Errors.InternalServerError(GenericMessages.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { getUserSumSubToken };
