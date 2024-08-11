const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Role } = require("../models/Role");
const Errors = require("../errors");
const { GenericMessages } = require("../constants");

const RoleSchema = new Schema(
  {
    name: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const RoleRecord = mongoose.model("Role", RoleSchema);

class RoleRepository {
  async findById(id) {
    try {
      const record = await RoleRecord.findById(id).exec();
      if (record) {
        return new Role(record);
      }
      return null;
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err,
          functionName: FunctionNames.findById,
        }
      );
    }
  }
  async findOne(condition = {}) {
    try {
      const record = await RoleRecord.findOne(condition).exec();
      if (record) {
        return new Role(record);
      }
      return null;
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err,
          functionName: FunctionNames.findOne,
        }
      );
    }
  }
  async save(value, session) {
    try {
      const { id, ...data } = value.toSerialized();
      if (id) {
        const record = await RoleRecord.findByIdAndUpdate(id, data, {
          new: true,
          upsert: true,
          session,
        }).exec();
        if (record) {
          return new Role(record);
        }
        return null;
      } else {
        let record = new RoleRecord(data);
        record = await record.save({ session });
        record = new Role(record);
        return record;
      }
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.FAILED_TO_SAVE_RECORD,
        {
          error: err,
          functionName: FunctionNames.save,
        }
      );
    }
  }
}

module.exports = { RoleRepository };
