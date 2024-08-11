const mongoose = require("mongoose");
const { Schema } = mongoose;
const { RolePermission } = require("../models/RolePermission");
const Errors = require("../errors");
const { GenericMessages } = require("../constants");

const RolePermissionSchema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

RolePermissionSchema.virtual("role", {
  ref: "Role",
  localField: "roleId",
  foreignField: "_id",
});
RolePermissionSchema.virtual("permission", {
  ref: "Permission",
  localField: "permissionId",
  foreignField: "_id",
});

const RolePermissionRecord = mongoose.model(
  "RolePermission",
  RolePermissionSchema
);

class RolePermissionRepository {
  async findById(id) {
    try {
      const record = await RolePermissionRecord.findById(id).exec();
      if (record) {
        return new RolePermission(record);
      }
      return null;
    } catch (err) {
      console.log(err);
      throw new Errors.BadRequest(GenericMessages.RECORD_NOT_FOUND);
    }
  }
  async findOne(condition = {}) {
    try {
      const record = await RolePermissionRecord.findOne(condition).exec();
      if (record) {
        return new RolePermission(record);
      }
      return null;
    } catch (err) {
      console.log(err);
      throw new Errors.BadRequest(GenericMessages.RECORD_NOT_FOUND);
    }
  }
  async findRolePermissions(condition = {}) {
    try {
      const records = await RolePermissionRecord.find(condition).exec();
      return records;
    } catch (err) {
      console.log(err);
      throw new Errors.BadRequest(GenericMessages.RECORD_NOT_FOUND);
    }
  }
  async save(value, session) {
    try {
      const { id, ...data } = value.toSerialized();
      if (id) {
        const record = await RolePermissionRecord.findByIdAndUpdate(id, data, {
          new: true,
          upsert: true,
          session,
        }).exec();
        if (record) {
          return new RolePermission(record);
        }
        return null;
      } else {
        let record = new RolePermissionRecord(data);
        record = await record.save({ session });
        record = new RolePermission(record);
        return record;
      }
    } catch (err) {
      throw new Errors.BadRequest(GenericMessages.FAILED_TO_SAVE_RECORD);
    }
  }
}

module.exports = { RolePermissionRepository };
