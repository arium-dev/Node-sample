const {
  HttpStatusCode,
  CurrencyTypes,
  CurrencyMessages,
} = require("../../../constants");
const Errors = require("../../../errors");
const { Currency } = require("../../../models/Currency");

const SourceCurrency = "AUD";

async function executeCurrencyQueue({ currencyRepository, currencyService }) {
  let currencies = await currencyRepository.find();
  if (currencies.length === 0) {
    throw new Errors.NotFound(CurrencyMessages.NOT_FOUND);
  }

  let rates = await currencyService.getCurrencyRates({
    type: CurrencyTypes.FIAT,
    base_currency: SourceCurrency,
    currencies: currencies.map((currency) => currency.code),
  });
  if (!rates?.data?.data) {
    throw new Errors.NotFound(CurrencyMessages.FAILED_FETCH_EXCHANGE_RATE);
  }

  if (rates?.data?.data) {
    rates = rates?.data?.data;
    currencies = currencies.map((currency) => ({
      ...currency,
      conversionRate:
        currency?.code === SourceCurrency
          ? "1"
          : rates[currency.code]?.value?.toString() || "0",
    }));

    for (let i = 0; i < currencies?.length; i++) {
      await currencyRepository.save(new Currency(currencies[i]));
    }
  }

  return { code: HttpStatusCode.OK };
}
module.exports = { executeCurrencyQueue };
