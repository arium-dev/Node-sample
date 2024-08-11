const moment = require("moment");
const { z } = require("zod");
const crypto = require("crypto");
const JWT = require("../utils/jwt");
const { encryptData } = require("../utils/EncryptDecrypt");
const { userValidator } = require("../utils/zodValidation");
const Errors = require("../errors");
const { GenericMessages, GenericConstants, Roles } = require("../constants");

const UserSchema = z.object(userValidator);

class User {
  #password;
  #salt;
  constructor(possibleUser) {
    const parsed = UserSchema.parse(possibleUser);
    this.id = parsed.id || parsed._id;
    this.firstName = parsed.firstName;
    this.lastName = parsed.lastName;
    this.dob = parsed.dob;
    this.contactNumber = parsed.contactNumber;
    this.email = parsed.email;
    this.#password = parsed.password;
    this.#salt = parsed.salt;
    this.status = parsed.status;
    this.twoFa = parsed.twoFa;
    this.roleId = parsed.roleId;
    this.uniqueId = parsed.uniqueId;
    this.emailToken = parsed.emailToken;
    this.ipAddress = parsed.ipAddress;
    this.level = parsed.level;
    this.refreshToken = parsed.refreshToken;
    this.createdAt = parsed.createdAt;
    this.updatedAt = parsed.updatedAt;
  }

  generateTokens({ permissions = [], expiredAt = "" }, role = Roles.USER) {
    if (!expiredAt) {
      expiredAt = moment();
      expiredAt = expiredAt.add(48, "hours");
      expiredAt = expiredAt.valueOf();
    }

    return {
      token: encryptData({
        token: JWT.signAccessToken({
          id: this.id,
          roleId: this.roleId,
          role: role,
        }),
        permissions,
      }),

      refreshToken: encryptData(
        JWT.signRefreshToken({
          id: this.id,
          roleId: this.roleId,
          expiredAt,
        })
      ),
    };
  }

  toUserInfo({ role }) {
    return encryptData({
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      status: this.status,
      verified: this.status === "verified",
      suspended: this.status === "suspended",
      isPassword: Boolean(this.#password),
      twoFaEnabled: this?.twoFa?.enabled,
      role,
    });
  }

  toLoginKey(password) {
    return encryptData({
      id: this.id,
      email: this.email,
      password: password,
      roleId: this.roleId,
    });
  }

  toProfile() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      dob: this.dob,
      twoFaEnabled: this?.twoFa?.enabled,
      level: this.level,
      contactNumber: this.contactNumber,
    };
  }

  setPassword(password) {
    if (!password) throw new Errors.BadRequest(GenericMessages.NO_PASSWORD);
    this.#salt = crypto.randomBytes(16).toString(GenericConstants.HEX);
    this.#password = crypto
      .pbkdf2Sync(
        password,
        this.#salt,
        10000,
        512,
        GenericConstants.HASH_DIGEST
      )
      .toString(GenericConstants.HEX);
  }

  validatePassword(password) {
    try {
      if (!password) throw new Errors.BadRequest(GenericMessages.NO_PASSWORD);
      const hash = crypto
        .pbkdf2Sync(
          password,
          this.#salt,
          10000,
          512,
          GenericConstants.HASH_DIGEST
        )
        .toString(GenericConstants.HEX);
      return this.#password === hash;
    } catch (err) {
      throw new Errors.Unauthorized(GenericMessages.INVALID_PASSWORD);
    }
  }

  toSerialized() {
    return { salt: this.#salt, password: this.#password, ...this };
  }
}

module.exports = { User };
