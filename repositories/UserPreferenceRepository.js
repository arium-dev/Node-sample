const mongoose = require("mongoose");
const { Schema } = mongoose;
const { UserPreference } = require("../models/UserPreference");
const { theresholdLimit } = require("../config");
const Errors = require("../errors");
const { GenericMessages, FunctionNames } = require("../constants");

const UserPreferenceSchema = new Schema(
  {
    deposit: {
      type: {
        _id: false,
        eddVerified: { type: Boolean, default: false },
        threshold: { type: String, default: theresholdLimit },
        isKycAlertEmail: { type: Boolean, default: false },
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserPreferenceRecord = mongoose.model(
  "UserPreference",
  UserPreferenceSchema
);

class UserPreferenceRepository {
  async findOne(condition) {
    try {
      const record = await UserPreferenceRecord.findOne(condition).exec();
      if (record) {
        return new UserPreference(record);
      }

      return null;
    } catch (err) {
      throw new Errors.InternalServerError(GenericMessages.RECORD_NOT_FOUND, {
        error: err,
        functionName: FunctionNames.findOne,
      });
    }
  }

  async save(value, session) {
    try {
      const { id, ...preference } = value.toSerialized();
      if (id) {
        const record = await UserPreferenceRecord.findByIdAndUpdate(
          id,
          preference,
          {
            new: true,
            upsert: true,
            session,
          }
        ).exec();
        if (record) {
          return new UserPreference(record);
        }
        return null;
      } else {
        let record = new UserPreferenceRecord(preference);
        record = await record.save({ session });
        record = new UserPreference(record);
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

module.exports = { UserPreferenceRepository };
