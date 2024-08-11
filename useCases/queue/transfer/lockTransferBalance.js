const mongoose = require("mongoose");
const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  TransactionMessages,
  TransactionStatus,
  BalanceMessages,
  RecipientMessages,
  MongoConstants,
} = require("../../../constants");
const { Transaction } = require("../../../models/Transaction");
const { Balance } = require("../../../models/Balance");
const ObjectId = mongoose.Types.ObjectId;

async function lockTransferBalance(
  data,
  { transactionRepository, balanceRepository, userRepository }
) {
  const session = await mongoose.startSession({
    readPreference: { mode: MongoConstants.PRIMARY },
  });

  session.startTransaction({
    readConcern: { level: MongoConstants.LOCAL },
    writeConcern: { w: MongoConstants.MAJORITY },
  });

  try {
    if (!data?.transactionId) {
      throw new Errors.BadRequest(TransactionMessages.NOT_FOUND_ID);
    }

    const { transaction, balance, receiver } =
      await fetchTransactionInformation(data?.transactionId, {
        transactionRepository,
        balanceRepository,
        userRepository,
      });

    await balanceRepository.save(
      new Balance({
        ...balance,
        balance: (
          Number(balance?.balance) - Number(transaction.amount)
        ).toString(),
        lock: (Number(balance.lock) + Number(transaction.amount)).toString(),
      }),
      session
    );

    let status =
      receiver?.level === 3 ? TransactionStatus.PENDING : transaction.status;
    await transactionRepository.save(
      new Transaction({
        ...transaction,
        queueStatus: "",
        status,
      }),
      session
    );

    await session.commitTransaction();
    await session.endSession();

    return {
      code: HttpStatusCode.OK,
    };
  } catch (err) {
    let message = err?.message || GenericMessages.INTERNAL_SERVER_ERROR;

    await session.abortTransaction();
    await session.endSession();

    await rejectTransaction(data?.transactionId, message, {
      transactionRepository,
    });

    throw new Errors.BadRequest(message);
  }
}

async function rejectTransaction(id, note, { transactionRepository }) {
  const transaction = await transactionRepository.findOne({
    _id: new ObjectId(id),
  });
  if (
    ![TransactionStatus.APPROVED, TransactionStatus.REJECTED].includes(
      transaction?.status
    )
  ) {
    await transactionRepository.save(
      new Transaction({
        ...transaction,
        status: TransactionStatus.REJECTED,
        queueStatus: "",
        note,
      })
    );
  }
}

async function fetchTransactionInformation(
  id,
  { transactionRepository, balanceRepository, userRepository }
) {
  const transaction = await transactionRepository.findOne({
    _id: new ObjectId(id),
    status: {
      $in: [TransactionStatus.PENDING, TransactionStatus.PENDING_INVITATION],
    },
  });

  if (!transaction) {
    throw new Errors.BadRequest(TransactionMessages.NOT_FOUND);
  }

  const balance = await balanceRepository.findOne({
    userId: new ObjectId(transaction?.userId),
  });
  if (!balance) {
    throw new Errors.BadRequest(BalanceMessages.NOT_FOUND);
  }

  if (Number(balance?.balance) >= Number(transaction.amount)) {
    const receiver = await userRepository.findOne({
      _id: new ObjectId(
        transaction?.transactionDetails?.receiverDetails?.recipientId
      ),
    });
    if (!receiver) {
      throw new Errors.NotFound(TransactionMessages.RECEIVER_NOT_FOUND);
    }
    return {
      transaction,
      balance,
      receiver,
    };
  } else {
    throw new Errors.BadRequest(BalanceMessages.INSUFFICIENT_BALANCE);
  }
}

module.exports = { lockTransferBalance };
