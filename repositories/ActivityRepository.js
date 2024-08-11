const mongoose = require("mongoose");
const { Schema } = mongoose;
const { getMessage } = require("../utils/messages");
const { Activity } = require("../models/Activity");
const Errors = require("../errors");
const {
  ActivityMessages,
  FunctionNames,
  UserConstants,
} = require("../constants");

const ActivitySchema = new Schema(
  {
    type: { type: String, default: "admin" },
    activityType: { type: String, default: "profile" },
    transactionId: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "User",
    },
    message: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const UserActivity = mongoose.model("Activity", ActivitySchema);

class ActivityRepository {
  async addActivityLog(
    userId,
    createdBy,
    type = UserConstants.USER,
    transactionId = null,
    messageType,
    custom = null,
    session
  ) {
    try {
      const message = custom ? custom : getMessage(messageType);
      let record = new UserActivity({
        type: type,
        activityType: message.type,
        transactionId: transactionId,
        createdBy: createdBy || null,
        userId: userId,
        message: message.message,
      });

      record = await record.save({ session });
      return new Activity(record);
    } catch (err) {
      throw new Errors.InternalServerError(
        ActivityMessages.FAIL_TO_SAVE_ACTIVITY,
        {
          error: err,
          functionName: FunctionNames.addActivityLog,
        }
      );
    }
  }

  async findByAggregation(aggregrator) {
    try {
      return await UserActivity.aggregate(aggregrator).exec();
    } catch (err) {
      throw new Errors.InternalServerError(
        ActivityMessages.FAIL_TO_FETCH_ACTIVITIES,
        {
          error: err,
          functionName: FunctionNames.findByAggregation,
        }
      );
    }
  }
}

module.exports = { ActivityRepository };
