const mongoose = require("mongoose");
const Errors = require("../../../errors");
const {
  HttpStatusCode,
  TransactionMessages,
  FiatManagment,
  GenericConstants,
  GenericMessages,
  TransactionStatus,
  WalletMessages,
  ActivityMessages,
  UserConstants,
} = require("../../../constants");
const { debitUserBalance } = require("../../users/balance/debitUserBalance");
const { Transaction } = require("../../../models/Transaction");
const ObjectId = mongoose.Types.ObjectId;

async function withdraw(
  { transactionId, walletId, userId },
  {
    transactionRepository,
    balanceRepository,
    walletRepository,
    activityRepository,
  },
  session
) {
  try {
    if (!transactionId) {
      throw new Errors.BadRequest(TransactionMessages.NOT_FOUND_ID);
    }

    if (!walletId) {
      throw new Errors.BadRequest(WalletMessages.NOT_FOUND);
    }

    const transaction = await transactionRepository.findById({
      _id: new ObjectId(transactionId),
    });
    await transactionRepository.save(
      new Transaction({
        ...transaction,
        queueStatus: "",
      }),
      session
    );

    const balanceRes = await debitUserBalance(
      {
        ...transaction,
        operation: FiatManagment.BALANCE_DEBITED_WITHDRAWAL,
        side: GenericConstants._WITHDRAW,
      },
      {
        balanceRepository,
      },
      session
    );

    if (!balanceRes) {
      throw new Errors.BadRequest(FiatManagment.FAIL_TO_SAVE_WITHDRAWAL);
    }

    const wallet = await walletRepository.findById(walletId);

    await activityRepository.addActivityLog(
      userId,
      userId,
      UserConstants.USER,
      transaction?.id,
      GenericConstants.WITHDRAW_CREATED,
      {
        type: GenericConstants._WITHDRAW,
        message: ActivityMessages.WITHDRAW_REQUEST_SUBMITTED(
          transaction,
          wallet
        ),
      },
      session
    );
    await session.commitTransaction();
    session.endSession();
    return { code: HttpStatusCode.OK };
  } catch (err) {
    let message = err?.message || GenericMessages.INTERNAL_SERVER_ERROR;
    await rejectTransaction(transactionId, message, {
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

module.exports = { withdraw };
