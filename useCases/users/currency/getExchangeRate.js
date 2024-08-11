const Errors = require("../../../errors");
const {
  HttpStatusCode,
  CurrencyMessages,
  CurrencyTypes,
} = require("../../../constants");

async function getExchangeRate(query, { currencyService }) {
  let { sourceCurrency, destinationCurrency } = query;

  let rates = await currencyService.getCurrencyRates({
    type: CurrencyTypes.FIAT,
    base_currency: sourceCurrency,
    currencies: destinationCurrency,
  });
  if (rates?.data?.data) {
    rates = rates?.data?.data;

    return {
      code: HttpStatusCode.OK,
      message: CurrencyMessages.SUCCESS_FETCH_EXCHANGE_RATE,
      data: { conversionRate: rates?.[destinationCurrency]?.value },
    };
  } else {
    throw new Errors.InternalServerError(
      CurrencyMessages.FAILED_FETCH_EXCHANGE_RATE
    );
  }
}

module.exports = { getExchangeRate };
