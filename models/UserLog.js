const { z } = require("zod");
const { userLogValidator } = require("../utils/zodValidation");

const UserLogSchema = z.object(userLogValidator());

class UserLog {
  constructor(possibleUserLog) {
    const parsed = UserLogSchema.parse(possibleUserLog);
    this.id = parsed.id || parsed._id;
    this.ip = parsed.ip;
    this.os = parsed.os;
    this.device = parsed.device;
    this.browser = parsed.browser;
    this.language = parsed.language;
    this.region = parsed.region;
    this.location = parsed.location;
    this.userId = parsed.userId;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }

  toSerialized() {
    return { ...this };
  }
}

module.exports = { UserLog };
