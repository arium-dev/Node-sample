const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { GenericConstants } = require("../constants");

const verify2fa = (user, code, google2faSecret = null) => {
  let verified = speakeasy.totp.verify({
    secret: google2faSecret ? google2faSecret : user?.twoFa?.secret,
    encoding: GenericConstants.BASE32,
    token: code,
  });
  return verified;
};

const generateSceretKey = (user) => {
  const secretKey = speakeasy.generateSecret({
    name: user?.name,
    email: user?.email,
  });
  return secretKey;
};

const getOtpauthUrl = (user, secretKey) => {
  return speakeasy.otpauthURL({
    secret: secretKey.base32,
    label: "Nebulapayments:" + user.email,
    digits: 6,
    issuer: "Nebulapayments",
    encoding: GenericConstants.BASE32,
  });
};

const base32Secret = (secretKey) => {
  return secretKey.base32;
};

const getDataUrl = async (url) => {
  try {
    const data_url = await QRCode.toDataURL(url);
    return data_url;
  } catch (err) {
    return null;
  }
};

module.exports = {
  verify2fa,
  generateSceretKey,
  getOtpauthUrl,
  base32Secret,
  getDataUrl,
};
