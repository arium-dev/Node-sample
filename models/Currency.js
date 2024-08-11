const { z } = require("zod");
const { currencyValidator } = require("../utils/zodValidation");

const CurrencySchema = z.object(currencyValidator);

class Currency {
  constructor(possibleCurrency) {
    const parsed = CurrencySchema.parse(possibleCurrency);
    this.id = parsed.id || parsed._id;
    this.name = parsed.name;
    this.symbol = parsed.symbol;
    this.code = parsed.code;
    this.conversionRate = parsed.conversionRate;
    this.logo = parsed.logo;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Currency };
