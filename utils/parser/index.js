var formatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

exports.FormatTwoDecimals = (val = 0) => {
  return Math.trunc(parseFloat(val) * 1e2) / 1e2;
};

exports.CurrencyFormattor = (value) => {
  return formatter.format(value);
};

exports.calculateTotalAmount = (data) => {
  return data.reduce((total, d) => {
    return d.amount ? total + parseFloat(d.amount) : total;
  }, 0);
};

exports.calculateTotalTransactionAmount = (data, field = "amount") => {
  return data.reduce((total, d) => {
    return d.transactionDetails && d.transactionDetails[field]
      ? total + parseFloat(d.transactionDetails[field])
      : total;
  }, 0);
};
