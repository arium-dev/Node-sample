const Errors = require("../../errors");
const {
  EddMessages,
  HttpStatusCode,
  TransactionStatus,
  GENERIC_CONSTANTS,
} = require("../../constants");
const moment = require("moment");

async function checkEventSlot(body, { eddVerificationRepository }) {
  const eddVerification = await eddVerificationRepository.findOne({
    _id: body?.eddVerificationId,
    userId: body.userId,
  });

  if (
    !(eddVerification && eddVerification.status === TransactionStatus.PENDING)
  ) {
    throw new Errors.BadRequest(EddMessages.EVENT_SLOT_EMAIL_EXPIRED);
  }

  if (eddVerification && eddVerification.data) {
    const eventSlot = eddVerification.data;
    let now = new Date();
    now = moment(now).add(1, GENERIC_CONSTANTS.MINUTES);
    const endDateTime = moment(eventSlot.endDate);
    const diff = endDateTime.diff(now);
    if (diff >= 0) {
      throw new Errors.Conflict(EddMessages.EVENT_SLOT_ALREADY_EXISTS);
    } else {
      return {
        code: HttpStatusCode.OK,
        message: EddMessages.NO_ACTIVE_SLOT_EXISTS,
      };
    }
  } else {
    return {
      code: HttpStatusCode.OK,
      message: EddMessages.NO_ACTIVE_SLOT_EXISTS,
    };
  }
}
module.exports = { checkEventSlot };
