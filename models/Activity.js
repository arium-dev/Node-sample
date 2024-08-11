const { z } = require("zod");
const { activityValidator } = require("../utils/zodValidation");

const ActivitySchema = z.object(activityValidator);

class Activity {
  constructor(possibleActivity) {
    const parsed = ActivitySchema.parse(possibleActivity);
    this.id = parsed.id || parsed._id;
    this.type = parsed.type;
    this.activityType = parsed.activityType;
    this.message = parsed.message;
    this.transactionId = parsed.transactionId;
    this.userId = parsed.userId;
    this.createdBy = parsed.createdBy;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Activity };
