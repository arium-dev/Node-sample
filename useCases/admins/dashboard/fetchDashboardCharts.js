const moment = require("moment");
const {
  HttpStatusCode,
  GenericConstants,
  TransactionType,
  WalletMessages,
} = require("../../../constants");

const TransformToChartData = (data, startDate, endDate) => {
  const values = [];
  const labels = [];
  let t = 0;
  const diff = moment(endDate).diff(startDate, GenericConstants.DAY);
  if (diff > 0) {
    for (let i = 0; i <= diff; i = i + 3) {
      const sDate = moment(startDate)
        .add(i, GenericConstants.DAY)
        .format(GenericConstants.DATE_FORMAT);
      const eDate = moment(startDate)
        .add(i + 3, GenericConstants.DAY)
        .format(GenericConstants.DATE_FORMAT);
      let amount = 0;
      if (data && data.length > 0) {
        data
          .filter(
            (d) =>
              moment(d.createdAt).isSameOrAfter(sDate) &&
              moment(d.createdAt).isSameOrBefore(eDate)
          )
          .map((d) => (amount += parseFloat(d.amount ? d.amount : 0)));
      }
      t += parseFloat(amount);
      values.push(parseFloat(amount).toFixed(2));
      labels.push(
        moment(startDate)
          .add(i, GenericConstants.DAY)
          .format(GenericConstants._DATE_FORMAT)
      );
    }
  }
  return { data: values, label: labels };
};

async function fetchDashboardCharts(query, { transactionRepository }) {
  const startDate = query.startDate
    ? moment(query.startDate).startOf(GenericConstants.DAY)
    : moment()
        .subtract(1, GenericConstants.MONTH)
        .startOf(GenericConstants.DAY);
  const endDate = query.endDate
    ? moment(query.endDate).endOf(GenericConstants.DAY)
    : moment().endOf(GenericConstants.DAY);

  const deposits = await getTotalDepositByDates(
    transactionRepository,
    startDate,
    endDate
  );
  const withdraws = await getTotalWithdrawByDates(
    transactionRepository,
    startDate,
    endDate
  );
  return {
    code: HttpStatusCode.OK,
    message: WalletMessages.BALANCE_FETCHED_SUCCESS,
    data: {
      deposits,
      withdraws,
    },
  };
}

async function getTotalDepositByDates(
  transactionRepository,
  startDate,
  endDate
) {
  try {
    let obj = {
      createdAt: {
        $gte: startDate.toString(),
        $lte: endDate.toString(),
      },
      type: TransactionType.DEPOSIT,
    };
    const deposits = await transactionRepository.find(obj);
    return TransformToChartData(deposits, startDate, endDate);
  } catch (error) {
    return { data: [], labels: [] };
  }
}
async function getTotalWithdrawByDates(
  transactionRepository,
  startDate,
  endDate
) {
  try {
    let obj = {
      createdAt: {
        $gte: startDate.toString(),
        $lte: endDate.toString(),
      },
      type: TransactionType.WITHDRAW,
    };
    const withdraw = await transactionRepository.find(obj);
    return TransformToChartData(withdraw, startDate, endDate);
  } catch (error) {
    return { data: [], labels: [] };
  }
}

module.exports = { fetchDashboardCharts };
