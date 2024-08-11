const moment = require("moment");
const { isArray } = require("lodash");
const {
  HttpStatusCode,
  GenericMessages,
  GenericConstants,
  Roles,
  TransactionType,
} = require("../../../constants");

const fetchDashboardDetails = async ({
  monoovaService,
  transactionRepository,
  userRepository,
}) => {
  let usersArr = await userRepository.find({}, [{ path: "roleId" }]);
  usersArr =
    usersArr.length > 0
      ? usersArr.filter((user) => user?.roleId?.name === Roles.USER)
      : [];

  const pendingKyc =
    usersArr.length > 0 ? usersArr.filter((user) => user?.level === 1) : [];

  const totalWithdraws = await transactionRepository.find({
    type: TransactionType.WITHDRAW,
  });

  const previousMonthDate = moment()
    .subtract(1, GenericConstants.MONTHS)
    .format(GenericConstants.DATE_FORMAT);

  const unclearTransaction = await monoovaService.unclearTransactionByDate(
    previousMonthDate,
    moment().format(GenericConstants.DATE_FORMAT)
  );

  let unclearFundCount = 0;
  if (
    unclearTransaction?.response?.data?.status === GenericConstants.OK &&
    isArray(unclearTransaction?.response?.data?.transactions)
  ) {
    let transactions = unclearTransaction?.response?.data?.transactions;
    if (transactions?.length > 0) {
      unclearFundCount = transactions.length;
    }
  }

  return {
    code: HttpStatusCode.OK,
    message: GenericMessages.SUCCESS_FETCHED_DATA,
    data: {
      usersArr: usersArr?.length || 0,
      pendingKyc: pendingKyc?.length || 0,
      totalWithdraws: totalWithdraws?.length || 0,
      unclearFundCount,
    },
  };
};

module.exports = { fetchDashboardDetails };
