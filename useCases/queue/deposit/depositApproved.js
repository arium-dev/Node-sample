const {
  HttpStatusCode,
  FiatManagment,
  GenericMessages,
  TransactionStatus,
  QueueType,
  QueueSubType,
} = require("../../../constants");
const Errors = require("../../../errors");
const { FormatTwoDecimals } = require("../../../utils/parser");

const depositApproved = async (
  body,
  { transactionRepository, balanceRepository, queueService },
  session
) => {
  const { transactionId, status } = body;
  // find deposit transaction
  const deposit = await transactionRepository.findById(transactionId);
  if (!deposit) {
    throw new Errors.Conflict(GenericMessages.RECORD_NOT_FOUND);
  }

  if (status === TransactionStatus.APPROVED) {
    // find user balance and update
    let userBalance = await balanceRepository.findOne({
      userId: deposit.userId,
    });
    if (!userBalance) {
      throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
    }
    let balance = userBalance.balance;

    balance = FormatTwoDecimals(
      parseFloat(balance) + parseFloat(deposit.amount || 0)
    );

    balance = balance.toString();
    userBalance.balance = balance;
    await balanceRepository.save(userBalance, session);

    // add queue for mail
    await queueService.addQueue(QueueType.MAIL, {
      type: QueueType.MAIL,
      subType: QueueSubType.DEPOSIT_APPROVED_MAIL,
      data: { userId: deposit.userId, transactionId: deposit.id },
    });
  }

  await session.commitTransaction();
  session.endSession();

  return {
    code: HttpStatusCode.OK,
    message: FiatManagment.DEPOSIT_STATUS_UPDATED,
  };
};

module.exports = { depositApproved };
