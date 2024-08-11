const Errors = require("../../errors");
const {
  HttpStatusCode,
  EddMessages,
  TransactionStatus,
  QueueType,
  QueueSubType,
} = require("../../constants");

async function scheduleMeeting(
  body,
  { eddVerificationRepository, calendlyService, queueService },
  session
) {
  const { eventUrl, userId, eddVerificationId } = body;
  // find the edd verification record of the user
  const eddVerification = await eddVerificationRepository.findById(
    eddVerificationId
  );

  if (!(eddVerification && eddVerification.id)) {
    throw new Errors.NotFound(EddMessages.NOT_FOUND);
  }
  const eventSlot = await calendlyService.getCalendlyEventSlot(eventUrl);

  if (eventSlot) {
    eddVerification.startDate = eventSlot.start_time;
    eddVerification.endDate = eventSlot.end_time;
    eddVerification.status = TransactionStatus.BOOKED;
    eddVerification.data = JSON.stringify(eventSlot);
    await eddVerificationRepository.save(eddVerification, session);

    await session.commitTransaction();
    session.endSession();

    // add queue for mail
    await queueService.addQueue(QueueType.MAIL, {
      type: QueueType.MAIL,
      subType: QueueSubType.CALENDLY_BOOKED_MAIL,
      data: { userId, transactionId: eddVerificationId },
    });

    return {
      code: HttpStatusCode.CREATED,
      message: EddMessages.EVENT_SLOT_CREATED,
      data: eddVerification,
    };
  } else {
    throw new Errors.BadRequest(EddMessages.EVENT_SLOT_NOT_GET);
  }
}
module.exports = { scheduleMeeting };
