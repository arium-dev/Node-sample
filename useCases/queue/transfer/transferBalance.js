const mongoose = require("mongoose");
const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  TransactionMessages,
  TransactionStatus,
  BalanceMessages,
  RecipientMessages,
  UserConstants,
  GenericConstants,
  ActivityMessages,
  UserMessages,
  MongoConstants,
} = require("../../../constants");
const { Transaction } = require("../../../models/Transaction");
const { Balance } = require("../../../models/Balance");
const ObjectId = mongoose.Types.ObjectId;

async function transferBalance(
  data,
  {
    transactionRepository,
    balanceRepository,
    activityRepository,
    userRepository,
  }
) {
  const session = await mongoose.startSession({
    readPreference: { mode: MongoConstants.PRIMARY },
  });
  session.startTransaction({
    readConcern: { level: MongoConstants.LOCAL },
    writeConcern: { w: MongoConstants.MAJORITY },
  });

  try {
    validateTransferData(data);

    const { transaction, sender, senderBalance, recipientBalance, receiver } =
      await fetchTransactionInformation(data.transactionId, {
        userRepository,
        balanceRepository,
        transactionRepository,
      });

    await updateBalances(
      senderBalance,
      recipientBalance,
      transaction,
      session,
      { balanceRepository }
    );
    await updateTransaction(transaction, data.adminId, session, {
      transactionRepository,
    });

    await logActivities(transaction, sender, receiver, session, {
      activityRepository,
    });

    await session.commitTransaction();
    return { code: HttpStatusCode.OK };
  } catch (err) {
    await handleTransactionError(err, data, session, {
      userRepository,
      transactionRepository,
      balanceRepository,
      activityRepository,
    });
    if (data.status === TransactionStatus.REJECTED) {
      return { code: HttpStatusCode.OK };
    }
    throw new Errors.BadRequest(
      err.message || GenericMessages.INTERNAL_SERVER_ERROR
    );
  } finally {
    await session.endSession();
  }
}

function validateTransferData(data) {
  if (!data?.transactionId) {
    throw new Errors.BadRequest(TransactionMessages.NOT_FOUND_ID);
  }
  if (data?.status === TransactionStatus.REJECTED) {
    throw new Errors.BadRequest(TransactionMessages.REJECTED_BY_ADMIN);
  }
}

async function updateBalances(
  senderBalance,
  recipientBalance,
  transaction,
  session,
  { balanceRepository }
) {
  const updatedSenderBalance = new Balance({
    ...senderBalance,
    lock: (Number(senderBalance.lock) - Number(transaction.amount)).toString(),
  });
  await balanceRepository.save(updatedSenderBalance, session);

  const updatedRecipientBalance = new Balance({
    ...recipientBalance,
    balance: (
      Number(recipientBalance.balance) +
      Number(transaction.transactionDetails.amount)
    ).toString(),
  });
  await balanceRepository.save(updatedRecipientBalance, session);
}

async function updateTransaction(
  transaction,
  adminId,
  session,
  { transactionRepository }
) {
  const updatedTransaction = new Transaction({
    ...transaction,
    status: TransactionStatus.APPROVED,
    updatedBy: new ObjectId(adminId) || null,
    queueStatus: "",
  });
  await transactionRepository.save(updatedTransaction, session);
}

async function logActivities(
  transaction,
  sender,
  receiver,
  session,
  { activityRepository }
) {
  await activityRepository.addActivityLog(
    transaction.userId,
    transaction.userId,
    UserConstants.USER,
    transaction.id,
    GenericConstants.TRANSFERRED,
    {
      type: GenericConstants.TRANSFER,
      message: ActivityMessages.ADMIN_APPROVED_TRANSACTION(
        transaction.amount,
        receiver.email
      ),
    },
    session
  );

  await activityRepository.addActivityLog(
    transaction.transactionDetails.receiverDetails.recipientId,
    transaction.userId,
    UserConstants.USER,
    transaction.id,
    GenericConstants.TRANSFERRED,
    {
      type: GenericConstants.TRANSFER,
      message: ActivityMessages.RECEIVED_TRANSACTION(
        transaction.transactionDetails.amount,
        sender.email
      ),
    },
    session
  );
}

async function handleTransactionError(
  err,
  data,
  session,
  {
    userRepository,
    transactionRepository,
    balanceRepository,
    activityRepository,
  }
) {
  await session.abortTransaction();
  await rejectTransaction(data, err.message, {
    userRepository,
    transactionRepository,
    balanceRepository,
    activityRepository,
  });
}

async function rejectTransaction(
  data,
  note,
  {
    userRepository,
    transactionRepository,
    balanceRepository,
    activityRepository,
  }
) {
  const { transactionId, adminId } = data;

  const transaction = await transactionRepository.findOne({
    _id: new ObjectId(transactionId),
  });
  await transactionRepository.save(
    new Transaction({
      ...transaction,
      status: TransactionStatus.REJECTED,
      queueStatus: "",
      updatedBy: new ObjectId(adminId) || null,
      note,
    })
  );

  const balance = await balanceRepository.findOne({
    userId: new ObjectId(transaction.userId),
  });
  if (!balance) {
    throw new Errors.BadRequest(BalanceMessages.NOT_FOUND);
  }

  if (Number(balance.lock) >= Number(transaction.amount)) {
    const updatedBalance = new Balance({
      ...balance,
      balance: (
        Number(balance.balance) + Number(transaction.amount)
      ).toString(),
      lock: (Number(balance.lock) - Number(transaction.amount)).toString(),
    });
    await balanceRepository.save(updatedBalance);
  }

  const receiver = await userRepository.findById(
    transaction.transactionDetails.receiverDetails.recipientId
  );
  if (!receiver) {
    throw new Errors.BadRequest(RecipientMessages.NOT_FOUND);
  }

  if (data?.status !== TransactionStatus.REJECTED) {
    await activityRepository.addActivityLog(
      adminId,
      adminId,
      UserConstants.ADMIN,
      transaction.id,
      GenericConstants.TRANSFER,
      {
        type: GenericConstants.TRANSFER,
        message: ActivityMessages.ADMIN_APPRROVAL_TRANSACTION(
          transaction,
          data.status,
          false
        ),
      }
    );
  }

  await activityRepository.addActivityLog(
    transaction?.userId,
    null,
    UserConstants.USER,
    transaction.id,
    GenericConstants.TRANSFER,
    {
      type: GenericConstants.TRANSFER,
      message: ActivityMessages.RECEIVED_BACK_TRANSACTION(
        data.status,
        transaction.amount,
        receiver.email
      ),
    }
  );
}

async function fetchTransactionInformation(
  id,
  { userRepository, balanceRepository, transactionRepository }
) {
  const transaction = await transactionRepository.findOne({
    _id: new ObjectId(id),
    status: {
      $in: [TransactionStatus.PENDING],
    },
  });

  if (!transaction) {
    throw new Errors.BadRequest(TransactionMessages.NOT_FOUND);
  }

  const senderBalance = await balanceRepository.findOne({
    userId: new ObjectId(transaction.userId),
  });
  if (!senderBalance) {
    throw new Errors.BadRequest(BalanceMessages.NOT_FOUND);
  }

  if (Number(senderBalance.lock) < Number(transaction.amount)) {
    throw new Errors.BadRequest(BalanceMessages.INSUFFICIENT_BALANCE);
  }

  const sender = await userRepository.findById(transaction.userId);
  if (!sender) {
    throw new Errors.BadRequest(UserMessages.SENDER_NOT_FOUND);
  }

  const receiver = await userRepository.findById(
    transaction.transactionDetails.receiverDetails.recipientId
  );
  if (!receiver) {
    throw new Errors.BadRequest(RecipientMessages.NOT_FOUND);
  }

  const recipientBalance = await balanceRepository.findOne({
    userId: new ObjectId(
      transaction.transactionDetails.receiverDetails.recipientId
    ),
  });
  if (!recipientBalance) {
    throw new Errors.BadRequest(BalanceMessages.NOT_FOUND);
  }

  return {
    transaction,
    sender,
    senderBalance,
    recipientBalance,
    receiver,
  };
}

module.exports = { transferBalance };
