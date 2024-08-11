const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Currency } = require("../models/Currency");
const Errors = require("../errors");
const { FunctionNames, GenericMessages } = require("../constants");

const CurrencySchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    symbol: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    conversionRate: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const CurrencyRecord = mongoose.model("Currency", CurrencySchema);

class CurrencyRepository {
  async findById(id) {
    try {
      const record = await CurrencyRecord.findById(id).exec();
      if (record) {
        return new Currency(record);
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
        const record = await CurrencyRecord.findOne(condition)
          .populate(populates)
          .exec();

        if (record) {
          return record;
        }
        return null;
      } else {
        const record = await CurrencyRecord.findOne(condition).exec();
        if (record) {
          return new Currency(record);
        }
        return null;
      }
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
  async find(condition) {
    try {
      const records = await CurrencyRecord.find(condition).exec();
      if (records) {
        return records.map((currency) => new Currency(currency));
      }
      return [];
    } catch (err) {
      throw new Errors.InternalServerError(GenericMessages.RECORD_NOT_FOUND, {
        error: err,
        functionName: FunctionNames.find,
      });
    }
  }
  async save(value, session) {
    try {
      const { id, ...wallet } = value.toSerialized();
      if (id) {
        const record = await CurrencyRecord.findByIdAndUpdate(id, wallet, {
          new: true,
          upsert: true,
          session,
        }).exec();
        if (record) {
          return new Currency(record);
        }
        return null;
      } else {
        let record = new CurrencyRecord(wallet);
        record = await record.save({ session });
        record = new Currency(record);
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
  async insertMany(list, session) {
    try {
      const currencies = list.map((currency) => new CurrencyRecord(currency));
      const records = await CurrencyRecord.insertMany(currencies, { session });
      return records;
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
  async updateMany(list, session) {
    try {
      const currencies = list.map((currency) => new CurrencyRecord(currency));
      const records = await CurrencyRecord.updateMany(currencies, { session });
      return records;
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.FAILED_TO_SAVE_RECORD,
        {
          error: err,
          functionName: FunctionNames.updateMany,
        }
      );
    }
  }
}

module.exports = { CurrencyRepository };
