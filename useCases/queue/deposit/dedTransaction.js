const {
  HttpStatusCode,
  GenericMessages,
  TransactionStatus,
  GenericConstants,
  UserConstants,
  ActivityMessages,
} = require("../../../constants");
const Errors = require("../../../errors");

async function dedTransaction(
  { type = GenericConstants.DED, body },
  {
    userRepository,
    transactionRepository,
    batchRepository,
    balanceRepository,
    activityRepository,
  },
  session
) {
  const withdraw = await transactionRepository.findOne({
    transactionId: body.OriginalTransactionId?.toString(),
  });
  const userId = withdraw?.userId;

  const user = await userRepository.findById(userId);
  if (!(withdraw && user)) {
    throw new Errors.NotFound(GenericMessages.RECORD_NOT_FOUND);
  }

  withdraw.transactionDetails.message = body.ReturnReason;
  withdraw.status = TransactionStatus.CANCELLED;
  withdraw.transactionDetails.dishonourObject = { ...body, type };
  await transactionRepository.save(withdraw, session);

  const withdraws = await transactionRepository.find({
    "transactionDetails.batchId": withdraw?.transactionDetails?.batchId,
  });

  let st = withdraw.status;

  if (
    withdraws.filter((b) => b.status !== TransactionStatus.APPROVED).length > 0
  ) {
    if (
      withdraws.filter((b) => b.status !== TransactionStatus.CANCELLED).length >
      0
    ) {
      st =
        withdraws.filter((b) => b.status === TransactionStatus.UN_APPROVED)
          .length >= 1
          ? TransactionStatus.UN_APPROVED
          : TransactionStatus.CANCELLED;
    } else {
      st = TransactionStatus.CANCELLED;
    }
  }

  const batch = await batchRepository.findById(
    withdraw?.transactionDetails?.batchId
  );
  batch.status = st;
  await batchRepository.save(batch, session);

  // check if user created withdraw then revert balance
  const createdBy = await userRepository.findOne(
    { _id: withdraw.createdBy },
    "roleId"
  );

  if (createdBy && createdBy.roleId && createdBy.roleId.name === "user") {
    // credit user balance
    let userBalance = await balanceRepository.findOne({
      userId,
    });
    userBalance.balance =
      parseFloat(userBalance.balance) + parseFloat(withdraw.amount);

    userBalance = await balanceRepository.save(userBalance, session);
    if (!userBalance) {
      throw new Errors.NotFound(GenericMessages.WEBHOOK_NOT_EXECUTABLE);
    }
  }

  await activityRepository.addActivityLog(
    userId,
    withdraw.createdBy,
    UserConstants.USER,
    withdraw?.id,
    GenericConstants.WITHDRAW_REJECTED,
    {
      type: GenericConstants.WITHDRAW_REJECTED,
      message: ActivityMessages.WITHDRAW_REJECTED(withdraw.amount),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();
  return {
    code: HttpStatusCode.OK,
  };
}
module.exports = { dedTransaction };
