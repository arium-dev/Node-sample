const { z } = require("zod");
const { roleValidator } = require("../utils/zodValidation");

const RoleSchema = z.object(roleValidator);

class Role {
  constructor(possibleData) {
    const parsed = RoleSchema.parse(possibleData);
    this.id = parsed.id || parsed._id;
    this.name = parsed.name;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Role };
