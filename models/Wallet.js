const { z } = require("zod");
const { walletValidator } = require("../utils/zodValidation");

const WalletSchema = z.object(walletValidator);

class Wallet {
  constructor(possibleWallet) {
    const parsed = WalletSchema.parse(possibleWallet);
    this.id = parsed.id || parsed._id;
    this.type = parsed.type;
    this.data = parsed.data;
    this.userId = parsed.userId;
    this.createdBy = parsed.createdBy;
    this.updatedBy = parsed.updatedBy;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
    this.deleted = parsed.deleted;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Wallet };
