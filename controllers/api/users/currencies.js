const express = require("express");
const { handle } = require("../../../utils/asyncHandler");
const {
  checkValidation,
  exchangeRateValidator,
} = require("../../../validators");
const {
  CurrencyRepository,
} = require("../../../repositories/CurrencyRepository");
const {
  CurrencyExchangeService,
} = require("../../../services/CurrencyExchangeService");
const {
  getExchangeRate,
} = require("../../../useCases/users/currency/getExchangeRate");
const {
  getCurrencies,
} = require("../../../useCases/users/currency/getCurrencies");

const app = express.Router();

app.get(
  "/",
  handle(async (req, res) => {
    const userData = await getCurrencies({
      currencyRepository: new CurrencyRepository(),
    });
    res.json(userData);
  })
);

app.get(
  "/exchangeRate",
  [exchangeRateValidator, checkValidation],
  handle(async (req, res) => {
    const userData = await getExchangeRate(req.query, {
      currencyService: new CurrencyExchangeService(),
    });
    res.json(userData);
  })
);

module.exports = app;
