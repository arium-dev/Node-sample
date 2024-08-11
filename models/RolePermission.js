const { z } = require("zod");
const { rolePermissionValidator } = require("../utils/zodValidation");

const RolePermissionSchema = z.object(rolePermissionValidator());

class RolePermission {
  constructor(possibleData) {
    const parsed = RolePermissionSchema.parse(possibleData);
    this.id = parsed.id || parsed._id;
    this.roleId = parsed.roleId;
    this.permissionId = parsed.permissionId;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }
  toSerialized() {
    return { ...this };
  }
}

module.exports = { RolePermission };
