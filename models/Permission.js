const { z } = require("zod");
const { permissionValidator } = require("../utils/zodValidation");

const PermissionSchema = z.object(permissionValidator());

class Permission {
  constructor(possibleData) {
    const parsed = PermissionSchema.parse(possibleData);
    this.id = parsed.id || parsed._id;
    this.module = parsed.module;
    this.action = parsed.action;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { Permission };
