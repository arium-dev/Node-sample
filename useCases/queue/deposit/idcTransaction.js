const {
  HttpStatusCode,
  GenericMessages,
  UserMessages,
  QueueType,
  QueueSubType,
  QueueOptions,
} = require("../../../constants");
const Errors = require("../../../errors");

async function idcTransaction(body, { walletRepository, queueService }) {
  const { TotalCount, DirectCreditDetails } = body;

  if (TotalCount > 0 && DirectCreditDetails && DirectCreditDetails.length > 0) {
    const err = [];
    await Promise.all(
      DirectCreditDetails.map(async (d, i) => {
        const wallet = await walletRepository.findOne(
          {
            "data.accountNumber": d.AccountNumber,
          },
          "userId"
        );
        if (!(wallet && wallet.userId && wallet.userId.id)) {
          err.push(UserMessages.USER_ACCOUNT_NOT_FOUND(d.AccountNumber));
        }

        // save to webhook queue
        await queueService.addQueue(
          QueueType.TRANSACTION,
          {
            type: QueueType.TRANSACTION,
            subType: QueueSubType.DEPOSIT_WEBHOOK,
            data: { type: "idc", body },
          },
          { ...QueueOptions, attempts: 1 }
        );
        //then response status to monoova
        return {
          status: HttpStatusCode.OK,
        };
      })
    );
    console.log("err>>>", err);
    if (err.length > 0) {
      throw new Errors.NotFound(err);
    } else
      return {
        code: HttpStatusCode.OK,
        message: GenericMessages.TRANSACTION_RECEIVED,
      };
  } else {
    throw new Errors.BadRequest(GenericMessages.INVALID_DATA);
  }
}
module.exports = { idcTransaction };
