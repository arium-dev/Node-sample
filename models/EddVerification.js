const { z } = require("zod");
const { eddVerificationValidator } = require("../utils/zodValidation");

const EddVerificationSchema = z.object(eddVerificationValidator());

class EddVerification {
  constructor(possibleActivity) {
    const parsed = EddVerificationSchema.parse(possibleActivity);
    this.id = parsed.id || parsed._id;
    this.startDate = parsed.startDate;
    this.endDate = parsed.endDate;
    this.status = parsed.status;
    this.note = parsed.note;
    this.videoLink = parsed.videoLink;
    this.data = parsed.data;
    this.threshold = parsed.threshold;
    this.edd = parsed.edd;
    this.userId = parsed.userId;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { EddVerification };
