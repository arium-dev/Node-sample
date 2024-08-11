const { z } = require("zod");
const { systemPreferenceValidator } = require("../utils/zodValidation");

const SystemPreferenceSchema = z.object(systemPreferenceValidator);

class SystemPreference {
  constructor(possibleSystemPreference) {
    const parsed = SystemPreferenceSchema.parse(possibleSystemPreference);
    this.id = parsed.id || parsed._id;
    this.transactionFee = parsed.transactionFee;
    this.createdBy = parsed.createdBy;
    this.updatedBy = parsed.updatedBy;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { SystemPreference };
