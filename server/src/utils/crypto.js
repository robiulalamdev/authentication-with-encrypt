// src/utils/crypto.js
const CryptoJS = require("crypto-js");

const secretKey = "your-very-strong-secret-key";

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

module.exports = { encryptData, decryptData };
