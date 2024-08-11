const { z } = require("zod");
const { webhookValidator } = require("../utils/zodValidation");

const WebhookSchema = z.object(webhookValidator());

class Webhook {
  constructor(possibleData) {
    const parsed = WebhookSchema.parse(possibleData);
    this.id = parsed.id || parsed._id;
    this.type = parsed.type;
    this.data = parsed.data;
    this.createdAt = parsed.createdAt;
    this.updatedBy = parsed.updatedBy;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Webhook };
