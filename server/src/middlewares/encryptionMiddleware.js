// server/middleware/encryptionMiddleware.js

const { decryptData, encryptData } = require("../utils/crypto");

const decryptRequestBody = (req, res, next) => {
  if (req.headers["x-encrypt"] === "true") {
    try {
      if (req.body && req.body.data) {
        req.body = decryptData(req.body.data);
      }
    } catch (error) {
      return res.status(400).send("Invalid encrypted data");
    }
  }
  next();
};

const encryptResponseBody = (req, res, next) => {
  if (req.headers["x-encrypt"] === "true") {
    const originalSend = res.send;
    res.send = (body) => {
      try {
        const encryptedBody = encryptData(JSON.parse(body));
        originalSend.call(res, JSON.stringify({ data: encryptedBody }));
      } catch (error) {
        return res.status(500).send("Error encrypting response");
      }
    };
  }
  next();
};

module.exports = { decryptRequestBody, encryptResponseBody };
