const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Wallet } = require("../models/Wallet");
const Errors = require("../errors");
const {
  FunctionNames,
  GenericMessages,
  WalletMessages,
  WalletTypeList,
} = require("../constants");

const WalletSchema = new Schema(
  {
    type: {
      type: String,
      enum: WalletTypeList,
    },
    data: {},
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const WalletRecord = mongoose.model("Wallet", WalletSchema);

class WalletRepository {
  async findById(id) {
    try {
      const record = await WalletRecord.findById(id).exec();
      if (record) {
        return new Wallet(record);
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
  async findOne(condition, populates = []) {
    try {
      if (populates.length > 0) {
        const record = await WalletRecord.findOne(condition)
          .populate(populates)
          .exec();

        if (record) {
          return new Wallet(record);
        }
        return null;
      } else {
        const record = await WalletRecord.findOne(condition).exec();
        if (record) {
          return new Wallet(record);
        }

        return null;
      }
    } catch (err) {
      throw new Errors.InternalServerError(WalletMessages.FIND_FAILED, {
        error: err,
        functionName: FunctionNames.findOne,
      });
    }
  }
  async find(condition, populates = []) {
    try {
      if (populates.length > 0) {
        const records = await WalletRecord.find(condition)
          .populate(populates)
          .exec();

        if (records?.length > 0) {
          return records.map((wallet) => new Wallet(wallet));
        }
      } else {
        const records = await WalletRecord.find(condition).exec();
        if (records?.length > 0) {
          return records.map((wallet) => new Wallet(wallet));
        }
      }
      return [];
    } catch (err) {
      throw new Errors.InternalServerError(WalletMessages.FIND_FAILED, {
        error: err,
        functionName: FunctionNames.find,
      });
    }
  }
  async save(value, session) {
    try {
      const { id, ...wallet } = value.toSerialized();
      if (id) {
        const record = await WalletRecord.findByIdAndUpdate(id, wallet, {
          new: true,
          upsert: true,
          session,
        }).exec();
        if (record) {
          return new Wallet(record);
        }
        return null;
      } else {
        let record = new WalletRecord(wallet);
        record = await record.save({ session });
        record = new Wallet(record);
        return record;
      }
    } catch (err) {
      throw new Errors.InternalServerError(WalletMessages.SAVE_FAILED, {
        error: err,
        functionName: FunctionNames.save,
      });
    }
  }
}

module.exports = { WalletRepository };
