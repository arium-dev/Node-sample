const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config");

const accessTokenOptions = {
  issuer: jwtOptions.issuer,
  algorithm: jwtOptions.algorithm,
  expiresIn: jwtOptions.accessTokenExpiresIn,
};

const refreshTokenOptions = {
  issuer: jwtOptions.issuer,
  algorithm: jwtOptions.algorithm,
};

module.exports = {
  signAccessToken: (payload) => {
    return jwt.sign(payload, jwtOptions.privateKey, accessTokenOptions);
  },
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, jwtOptions.publicKey, accessTokenOptions);
    } catch (err) {
      return false;
    }
  },

  signRefreshToken: (payload) => {
    return jwt.sign(payload, jwtOptions.privateKey, refreshTokenOptions);
  },
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, jwtOptions.publicKey, refreshTokenOptions);
    } catch (err) {
      return false;
    }
  },
  decode: (token) => {
    return jwt.decode(token, { complete: true });
    //returns null if token is invalid
  },
};
