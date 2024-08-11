const { z } = require("zod");
const { transactionValidator } = require("../utils/zodValidation");

const TransactionSchema = z.object(transactionValidator());

class Transaction {
  constructor(possibleData) {
    const parsed = TransactionSchema.parse(possibleData);
    this.id = parsed.id || parsed._id || "";
    this.type = parsed.type;
    this.transactionId = parsed.transactionId;
    this.status = parsed.status;
    this.queueStatus = parsed.queueStatus;
    this.amount = parsed.amount;
    this.note = parsed.note;
    this.userId = parsed.userId;
    this.date = parsed.date;
    this.createdBy = parsed.createdBy;
    this.updatedBy = parsed.updatedBy;
    this.transactionDetails = parsed.transactionDetails;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Transaction };
