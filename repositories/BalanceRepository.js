const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Balance } = require("../models/Balance");
const Errors = require("../errors");
const { FunctionNames, BalanceMessages } = require("../constants");

const BalanceSchema = new Schema(
  {
    balance: {
      type: String,
      default: "0",
    },
    lock: {
      type: String,
      default: "0",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const BalanceRecord = mongoose.model("Balance", BalanceSchema);

class BalanceRepository {
  async findOne(condition) {
    try {
      const record = await BalanceRecord.findOne(condition).exec();
      if (record) {
        return new Balance(record);
      }

      return null;
    } catch (err) {
      throw new Errors.InternalServerError(BalanceMessages.FIND_FAILED, {
        error: err,
        functionName: FunctionNames.findOne,
      });
    }
  }

  async create(value, session) {
    try {
      let record = new BalanceRecord(value);
      record = await record.save({ session });
      record = new Balance(record);
      return record;
    } catch (err) {
      throw new Errors.InternalServerError(BalanceMessages.SAVE_FAILED, {
        error: err,
        functionName: FunctionNames.create,
      });
    }
  }

  async save(value, session) {
    try {
      const { id, ...balance } = value.toSerialized();
      if (id) {
        const record = await BalanceRecord.findByIdAndUpdate(id, balance, {
          new: true,
          upsert: true,
          session,
        }).exec();
        if (record) {
          return new Balance(record);
        }
        return null;
      } else {
        let record = new BalanceRecord(balance);
        record = await record.save({ session });
        record = new Balance(record);
        return record;
      }
    } catch (err) {
      throw new Errors.InternalServerError(BalanceMessages.SAVE_FAILED, {
        error: err,
        functionName: FunctionNames.save,
      });
    }
  }
}

module.exports = { BalanceRepository };
