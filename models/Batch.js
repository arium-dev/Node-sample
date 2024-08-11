const { z } = require("zod");
const { batchValidator } = require("../utils/zodValidation");

const BatchSchema = z.object(batchValidator());

class Batch {
  constructor(possibleData) {
    const parsed = BatchSchema.parse(possibleData);
    this.id = parsed.id || parsed._id;
    this.type = parsed.type;
    this.status = parsed.status;
    this.amount = parsed.amount;
    this.createdBy = parsed.createdBy;
    this.updatedBy = parsed.updatedBy;
    this.createdAt = parsed.createdAt;
    this.updatedBy = parsed.updatedBy;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Batch };
