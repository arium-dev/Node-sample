const mongoose = require("mongoose");
const { Schema } = mongoose;
const { User } = require("../models/User");
const Errors = require("../errors");
const {
  UserMessages,
  GenericMessages,
  FunctionNames,
  RepositoriesConstants,
  UserStatuses,
} = require("../constants");

const UserSchema = new Schema(
  {
    uniqueId: { type: String, unique: true, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    salt: { type: String, default: "" },
    password: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    email: { type: String, unique: true, default: "" },
    dob: { type: String, default: "" },
    status: { type: String, default: "", enum: UserStatuses },
    twoFa: {
      type: {
        _id: false,
        enabled: { type: Boolean, default: false },
        secret: { type: String, default: "" },
        tempSecret: { type: String, default: "" },
      },
    },
    emailToken: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    level: { type: Number, default: 1 },
    refreshToken: { type: String, default: "" },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    createdBy: {
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

const UserRecord = mongoose.model("User", UserSchema);

class UserRepository {
  async findById(id) {
    try {
      const record = await UserRecord.findById(id).exec();
      if (record) {
        return new User(record);
      }
      return null;
    } catch (err) {
      throw new Errors.InternalServerError(GenericMessages.RECORD_NOT_FOUND, {
        error: err,
        functionName: FunctionNames.findById,
      });
    }
  }
  async findOne(condition, populates = []) {
    try {
      if (populates.length > 0) {
        const record = await UserRecord.findOne(condition)
          .populate(populates)
          .select(RepositoriesConstants.USER_FILEDS)
          .exec();

        if (record) {
          return record;
        }
        return null;
      } else {
        const record = await UserRecord.findOne(condition).exec();
        if (record) {
          return new User(record);
        }

        return null;
      }
    } catch (err) {
      throw new Errors.InternalServerError(UserMessages.FAILED_TO_FIND_USER, {
        error: err,
        functionName: FunctionNames.findOne,
      });
    }
  }

  async findByAggregation(aggregrator) {
    try {
      return await UserRecord.aggregate(aggregrator).exec();
    } catch (err) {
      throw new Errors.InternalServerError(GenericMessages.RECORD_NOT_FOUND, {
        error: err,
        functionName: FunctionNames.findByAggregation,
      });
    }
  }

  async find(condition, populates = []) {
    try {
      if (populates.length > 0) {
        const records = await UserRecord.find(condition)
          .populate(populates)
          .exec();
        if (records && records.length > 0) {
          return records;
        }
        return [];
      } else {
        const records = await UserRecord.find(condition).exec();
        if (records && records.length > 0) {
          return records.map((user) => new User(user));
        }
        return [];
      }
    } catch (err) {
      console.log("err>>>>>>>", err);
      throw new Errors.InternalServerError(GenericMessages.RECORD_NOT_FOUND, {
        error: err,
        functionName: FunctionNames.find,
      });
    }
  }

  async countUsers(condition) {
    try {
      const records = await UserRecord.countDocuments(condition).exec();
      return records || 0;
    } catch (err) {
      throw new Errors.InternalServerError(GenericMessages.RECORD_NOT_FOUND, {
        error: err,
        functionName: FunctionNames.countUsers,
      });
    }
  }

  async save(value, session) {
    try {
      const { id, ...user } = value.toSerialized();
      if (id) {
        const record = await UserRecord.findByIdAndUpdate(id, user, {
          new: true,
          upsert: true,
          session,
        }).exec();
        if (record) {
          return new User(record);
        }
        return null;
      } else {
        let record = new UserRecord(user);
        record = await record.save({ session });
        record = new User(record);
        return record;
      }
    } catch (err) {
      throw new Errors.InternalServerError(UserMessages.FAILED_TO_SAVE_USER, {
        error: err,
        functionName: FunctionNames.save,
      });
    }
  }

  async update(condition, body) {
    try {
      const record = await UserRecord.findOneAndUpdate(condition, body, {
        new: true,
      });
      if (record) {
        return new User(record);
      } else {
        throw new Errors.InternalServerError(UserMessages.USER_NOT_FOUND);
      }
    } catch (err) {
      throw new Errors.InternalServerError(UserMessages.FAILED_TO_UPDATE_USER, {
        error: err,
        functionName: FunctionNames.update,
      });
    }
  }

  async updateUser(value, session) {
    try {
      const { id, ...user } = value.toSerialized();
      if (id) {
        const record = await UserRecord.findByIdAndUpdate(id, user, {
          new: true,
          upsert: true,
          session,
        }).exec();
        return new User(record);
      } else {
        return null;
      }
    } catch (err) {
      throw new Errors.InternalServerError(UserMessages.FAILED_TO_UPDATE_USER, {
        error: err,
        functionName: FunctionNames.updateUser,
      });
    }
  }

  async findByAggregation(aggregrator) {
    try {
      return await UserRecord.aggregate(aggregrator).exec();
    } catch (err) {
      throw new Errors.InternalServerError(
        GenericMessages.INTERNAL_SERVER_ERROR,
        {
          error: err,
          functionName: FunctionNames.findByAggregation,
        }
      );
    }
  }
}

module.exports = { UserRepository };
