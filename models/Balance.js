const { z } = require("zod");
const { balanceValidator } = require("../utils/zodValidation");

const BalanceSchema = z.object(balanceValidator);

class Balance {
  constructor(possibleBalance) {
    const parsed = BalanceSchema.parse(possibleBalance);
    this.id = parsed.id || parsed._id;
    this.balance = parsed.balance;
    this.lock = parsed.lock;
    this.userId = parsed.userId;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Balance };
