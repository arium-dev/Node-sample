var base64 = require("base-64");

exports.validateUserToken = (token) => {
  try {
    const decoded = JSON.parse(base64.decode(token));
    if (!decoded.id || !decoded.email || !decoded.eddVerificationId) {
      return null;
    } else {
      return decoded;
    }
  } catch (error) {
    return null;
  }
};
