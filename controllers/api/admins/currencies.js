const express = require("express");
const { Permissions } = require("../../../constants");
const { authorizePermission } = require("../../../authorization");
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
  getCurrencies,
} = require("../../../useCases/admins/currencies/getCurrencies");
const {
  getExchangeRate,
} = require("../../../useCases/admins/currencies/getExchangeRate");

const app = express.Router();

app.get(
  "/",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_CURRENCY],
      req.jwt.permissions
    ),
  handle(async (req, res) => {
    const userData = await getCurrencies({
      currencyRepository: new CurrencyRepository(),
    });
    res.json(userData);
  })
);

app.get(
  "/exchangeRate",
  (req, _, next) =>
    authorizePermission(
      req.jwt.role,
      next,
      [Permissions.VIEW_EXCHANGE_RATE],
      req.jwt.permissions
    ),
  [exchangeRateValidator, checkValidation],
  handle(async (req, res) => {
    const userData = await getExchangeRate(req.query, {
      currencyService: new CurrencyExchangeService(),
    });
    res.json(userData);
  })
);

module.exports = app;
