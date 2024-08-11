const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../../../../errors");
const {
  TransactionStatus,
  GenericConstants,
} = require("../../../../constants");
const {
  HttpStatusCode,
  FiatManagment,
  GenericMessages,
  WithdrawalMessages,
  ActivityMessages,
  QueueType,
  QueueSubType,
} = require("../../../../constants");
const { Transaction } = require("../../../../models/Transaction");
const {
  getBatchStatusUponWithdrawals,
} = require("./helpers/getBatchStatusUponWithdrawals");

const updateWithdrawStatus = async (
  w,
  updatedBy,
  isCredit = false,
  transactionRepository,
  activityRepository,
  monovaService,
  session
) => {
  let withdraw = await transactionRepository.findOne(
    {
      _id: w.id,
    },
    ["user", "wallet"]
  );

  const user = withdraw?.user?.[0];
  const wallet = withdraw?.wallet?.[0];
  let isToSendMail = false;
  withdraw = new Transaction(withdraw);

  // check if record not found
  if (!(withdraw && user && wallet)) {
    return withdraw;
  }
  withdraw.updatedBy = updatedBy;
  const isAlreadyApproved = withdraw?.status === TransactionStatus.APPROVED;

  // check if status already not approved and user KYC not approved and want to approve now
  if (!isAlreadyApproved && isCredit && user?.level !== 3) {
    withdraw.transactionDetails.message = FiatManagment.KYC_NOT_VERIFIED;
    withdraw.status = TransactionStatus.CANCELLED;
  }

  // if status change to approved but user suspended
  if (!isAlreadyApproved && isCredit && user?.suspended) {
    withdraw.transactionDetails.message = FiatManagment.USER_IS_SUSPENDED;
    withdraw.status = TransactionStatus.CANCELLED;
  }

  // if status is other than approved then update only status
  if (!isAlreadyApproved && !isCredit) {
    withdraw.status = w.status;
    withdraw.transactionDetails.message =
      WithdrawalMessages.WITHDRAWAL_STATUS_UPDATED;
  }

  if (!isAlreadyApproved && isCredit && !user?.suspended && user?.level === 3) {
    // request to monoova for credit (fiat withdrawal)

    const creditResp = await monovaService.createDirectCredit(withdraw, wallet);
    if (creditResp?.code === HttpStatusCode.OK) {
      isToSendMail = true;

      withdraw.status = w.status;
      withdraw.transactionDetails.callerUniqueReference =
        creditResp?.data?.callerUniqueReference;
      withdraw.transactionDetails.transactionId =
        creditResp?.data?.transactionId;
      withdraw.transactionDetails.responseObject = creditResp?.data;
      withdraw.transactionId = creditResp?.data?.transactionId;
      withdraw.transactionDetails.message =
        WithdrawalMessages.WITHDRAWAL_SUBMITTED;
    } else {
      isCredit = false;
      withdraw.transactionDetails.message = creditResp.message;
      withdraw.transactionDetails.responseObject = creditResp.data;
      withdraw.status = TransactionStatus.CANCELLED;
    }
  }

  withdraw = await transactionRepository.save(withdraw, session);

  await activityRepository.addActivityLog(
    updatedBy,
    updatedBy,
    GenericConstants._WITHDRAW,
    withdraw.id,
    GenericConstants.WITHDRAW_UPDATED,
    {
      type: GenericConstants._WITHDRAW,
      message: ActivityMessages.WITHDRAWAL_UPDATED(
        withdraw,
        withdraw.wallet,
        isCredit
      ),
    },
    session
  );
  return { ...withdraw, isToSendMail };
};

const updateBatchWithdrawStatus = async (
  { id },
  body,
  params,
  {
    batchRepository,
    transactionRepository,
    activityRepository,
    monovaService,
    queueService,
  },
  session
) => {
  const batchId = params.id;
  let obj = { _id: batchId };
  let batch = await batchRepository.findOne(obj, "withdraws");

  if (!batch) {
    throw new Errors.Conflict(GenericMessages.DATA_CHANGE_ERROR);
  }

  let withdrawsArr = batch.withdraws;

  if (
    withdrawsArr.length > 0 &&
    withdrawsArr.every((w) => w.status === TransactionStatus.APPROVED)
  ) {
    throw new Errors.BadRequest(FiatManagment.STATUS_ALREADY_APPROVED);
  }

  withdrawsArr = body?.withdraws?.length > 0 ? body?.withdraws : withdrawsArr;
  const data = [];
  for (const w of withdrawsArr) {
    w.status = body.status;
    const result = await updateWithdrawStatus(
      w,
      id,
      w.status === TransactionStatus.APPROVED,
      transactionRepository,
      activityRepository,
      monovaService,
      session
    );
    data.push(result);
  }

  const status = await getBatchStatusUponWithdrawals(data, batch.status);
  batch.status = status;
  batch = await batchRepository.save(batch, session);

  await activityRepository.addActivityLog(
    new ObjectId(id),
    new ObjectId(id),
    GenericConstants._WITHDRAW,
    batchId,
    GenericConstants.WITHDRAW_UPDATED,
    {
      type: GenericConstants._WITHDRAW,
      message: ActivityMessages.WITHDRAWAL_BATCH_UPDATED(batchId),
    },
    session
  );

  await session.commitTransaction();
  session.endSession();

  // send data into queue to send email for approved transactions
  for (const w of data) {
    if (w && w.id && w.userId && w.isToSendMail) {
      // send to mail queue
      await queueService.addQueue(QueueType.MAIL, {
        type: QueueType.MAIL,
        subType: QueueSubType.WITHDRAW_APPROVED_MAIL,
        data: { userId: w.userId, transactionId: w.id },
      });
    }
  }
  return {
    code: HttpStatusCode.OK,
    message: FiatManagment.SUCCESSFULLY_UPDATED_WITHDRAWAL_STATUS,
    data: data,
  };
};

module.exports = { updateBatchWithdrawStatus };
