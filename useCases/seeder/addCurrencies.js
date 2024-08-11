const {
  HttpStatusCode,
  Currencies,
  CurrencyTypes,
  QueueType,
  QueueSubType,
} = require("../../constants");

const SourceCurrency = "AUD";
const DestinationCurrencies = "EUR,GBP,USD";

async function addCurrencies({
  currencyService,
  currencyRepository,
  queueService,
}) {
  const currency = await currencyRepository.findOne();
  if (!currency) {
    let rates = await currencyService.getCurrencyRates({
      type: CurrencyTypes.FIAT,
      base_currency: SourceCurrency,
      currencies: DestinationCurrencies,
    });
    if (rates?.data?.data) {
      rates = rates?.data?.data;
      let currencies = Currencies.map((currency) => ({
        ...currency,
        conversionRate:
          currency?.code === SourceCurrency
            ? "1"
            : rates[currency.code]?.value || "0",
      }));
      await currencyRepository.insertMany(currencies);

      await queueService.addQueue(
        QueueType.CURRENCY,
        {
          type: QueueType.CURRENCY,
          subType: QueueSubType.CURRENCY_QUEUE,
          // data: { userId: userId },
        },
        { repeat: { cron: "*/10 * * * *" } }
      );

      return { code: HttpStatusCode.OK };
    }
  }
}
module.exports = { addCurrencies };
