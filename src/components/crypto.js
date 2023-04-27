// create a utility to encrypt and decrypt the user data

const CryptoJS = require("crypto-js");

const secretKey = process.env.CRYPTO_SECRET_KEY;

function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

function decryptData(encryptedData) {
  console.log("hi: " + encryptedData)
  console.log(secretKey)
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  console.log("bytes: " + bytes)
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encryptData, decryptData };