const Errors = require("../../../errors");
const {
  HttpStatusCode,
  UserMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../../constants");

async function nppWebhook(body, { walletRepository, queueService }) {
  const wallet = await walletRepository.findOne(
    {
      "data.accountNumber": body.AccountNumber,
    },
    "userId"
  );

  if (!(wallet && wallet.userId && wallet.userId.id)) {
    throw new Errors.NotFound(
      UserMessages.USER_ACCOUNT_NOT_FOUND(body.AccountNumber)
    );
  }

  // save to webhook queue
  await queueService.addQueue(
    QueueType.TRANSACTION,
    {
      type: QueueType.TRANSACTION,
      subType: QueueSubType.DEPOSIT_WEBHOOK,
      data: { type: "npp", body },
    },
    { ...QueueOptions, attempts: 1 }
  );
  //then response status to monoova
  return {
    status: HttpStatusCode.OK,
  };
}
module.exports = { nppWebhook };
