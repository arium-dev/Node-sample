const cryptoJS = require("crypto-js");
const Securitykey = process.env.ENCRYPTER_KEY;

const encryptData = (data) => {
  try {
    if (!data) return "";
    data = JSON.stringify(data);
    const encrypted = cryptoJS.AES.encrypt(data, Securitykey).toString();
    return encrypted;
  } catch (err) {
    return "";
  }
};
const decryptData = (data) => {
  try {
    if (!data) return "";
    const decrypted = cryptoJS.AES.decrypt(data, Securitykey).toString(
      cryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  } catch (err) {
    return "";
  }
};

module.exports = { encryptData, decryptData };
