const Errors = require("../../../errors");
const { HttpStatusCode, CurrencyMessages } = require("../../../constants");

async function getCurrencies({ currencyRepository }) {
  const currency = await currencyRepository.find();
  if (currency?.length > 0) {
    return {
      code: HttpStatusCode.OK,
      message: CurrencyMessages.FETCHED_SUCCESS,
      data: currency,
    };
  } else {
    throw new Errors.InternalServerError(CurrencyMessages.NOT_FOUND);
  }
}

module.exports = { getCurrencies };
