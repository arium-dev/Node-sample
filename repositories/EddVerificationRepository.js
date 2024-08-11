const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;
const Errors = require("../errors");
const { FunctionNames, EddMessages } = require("../constants");
const { EddVerification } = require("../models/EddVerification");

const EddVerificationSchema = new Schema(
  {
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    status: { type: String, default: "" },
    note: { type: String, default: "" },
    emailStatus: { type: Number, default: 0 },
    videoLink: { type: String, default: "" },
    threshold: {
      type: {
        previous: { type: String, default: "" },
        new: { type: String, default: "" },
      },
    },
    edd: {
      type: {
        previous: { type: Boolean, default: false },
        new: { type: Boolean, default: false },
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    data: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const EddVerificationRecord = mongoose.model(
  "EddVerification",
  EddVerificationSchema
);

class EddVerificationRepository {
  async findById(condition, update, session) {
    try {
      const record = await EddVerificationRecord.findById(condition, update, {
        session,
      });
      if (record) return new EddVerification(record);
      return null;
    } catch (error) {
      throw new Errors.InternalServerError(EddMessages.UNABLE_TO_FIND, {
        error: err,
        functionName: FunctionNames.findById,
      });
    }
  }
  async findOne(obj) {
    try {
      const record = await EddVerificationRecord.findOne(obj);
      if (record) return new EddVerification(record);
      return null;
    } catch (err) {
      throw new Errors.InternalServerError(EddMessages.UNABLE_TO_FIND, {
        error: err,
        functionName: FunctionNames.findOne,
      });
    }
  }
  async find(obj) {
    try {
      const records = await EddVerificationRecord.find(obj);
      if (records?.length > 0) {
        return records.map((record) => new EddVerification(record));
      }
      return [];
    } catch (err) {
      throw new Errors.InternalServerError(EddMessages.UNABLE_TO_FIND, {
        error: err,
        functionName: FunctionNames.find,
      });
    }
  }
  async findByAggregation(aggregrator) {
    try {
      return await EddVerificationRecord.aggregate(aggregrator).exec();
    } catch (err) {
      throw new Errors.InternalServerError(EddMessages.UNABLE_TO_FIND, {
        error: err,
        functionName: FunctionNames.findByAggregation,
      });
    }
  }

  async save(value, session) {
    try {
      const { id, ...deposit } = value;
      if (id) {
        const record = await EddVerificationRecord.findByIdAndUpdate(
          id,
          deposit,
          {
            new: true,
            upsert: true,
            session,
          }
        ).exec();
        if (record) {
          return new EddVerification(record);
        }
        return null;
      } else {
        let record = new EddVerificationRecord(deposit);
        record = await record.save({ session });
        return new EddVerification(record);
      }
    } catch (err) {
      throw new Errors.InternalServerError(EddMessages.FAILED_SAVE, {
        error: err,
        functionName: FunctionNames.save,
      });
    }
  }
}

module.exports = { EddVerificationRepository };
