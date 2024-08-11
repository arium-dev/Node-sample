const mongoose = require("mongoose");
const Errors = require("../../../errors");
const {
  GenericMessages,
  HttpStatusCode,
  TransactionMessages,
  TransactionStatus,
  TransactionType,
  MongoConstants,
} = require("../../../constants");
const { Transaction } = require("../../../models/Transaction");
const ObjectId = mongoose.Types.ObjectId;

async function executeInvitationTransaction(data, { transactionRepository }) {
  const session = await mongoose.startSession({
    readPreference: { mode: MongoConstants.PRIMARY },
  });

  session.startTransaction({
    readConcern: { level: MongoConstants.LOCAL },
    writeConcern: { w: MongoConstants.MAJORITY },
  });

  try {
    if (!data?.userId) {
      throw new Errors.BadRequest(TransactionMessages.NOT_FOUND_ID);
    }

    const transactions = await transactionRepository.findByAggregation([
      {
        $match: {
          type: TransactionType.TRANSFER,
          status: TransactionStatus.PENDING_INVITATION,
          queueStatus: "",
          "transactionDetails.receiverDetails.recipientId": new ObjectId(
            data?.userId
          ),
        },
      },
    ]);

    if (transactions?.length === 0) {
      return {
        code: 200,
      };
    }

    let executedTransactions = [];
    for (let i = 0; i < transactions?.length; i++) {
      const transaction = transactions[0];

      const updatedTransaction = await transactionRepository.save(
        new Transaction({
          ...transaction,
          id: transaction?._id?.toString(),
          status: TransactionStatus.PENDING,
          queueStatus: "",
        }),
        session
      );

      executedTransactions.push(updatedTransaction);
    }
    if (transactions?.length !== executedTransactions?.length) {
      throw new Errors.BadRequest(TransactionMessages.FAILED_INVITATITON);
    }

    await session.commitTransaction();
    await session.endSession();

    return {
      code: HttpStatusCode.OK,
    };
  } catch (err) {
    let message = err?.message || GenericMessages.INTERNAL_SERVER_ERROR;
    await session.abortTransaction();
    await session.endSession();

    throw new Errors.BadRequest(message);
  }
}

module.exports = { executeInvitationTransaction };
