const { z } = require("zod");
const { userPreferenceValidator } = require("../utils/zodValidation");

const UserPreferenceSchema = z.object(userPreferenceValidator);

class UserPreference {
  constructor(possibleUserPreference) {
    const parsed = UserPreferenceSchema.parse(possibleUserPreference);
    this.id = parsed.id || parsed._id;
    this.deposit = parsed.deposit;
    this.userId = parsed.userId;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { UserPreference };
