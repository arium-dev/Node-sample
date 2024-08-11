const express = require("express");
const { handle } = require("../../../utils/asyncHandler");
const {
  CurrencyRepository,
} = require("../../../repositories/CurrencyRepository");
const {
  CurrencyExchangeService,
} = require("../../../services/CurrencyExchangeService");
const {
  executeCurrencyQueue,
} = require("../../../useCases/queue/currency/executeCurrencyQueue");

const app = express.Router();

app.post(
  "/currencyQueue",
  handle(async (req, res) => {
    const resp = await executeCurrencyQueue({
      currencyRepository: new CurrencyRepository(),
      currencyService: new CurrencyExchangeService(),
    });

    res.json(resp);
  })
);

module.exports = app;
