const express = require("express");
const cors = require("cors");
const VARIABLES = require("./config");
const { routers } = require("./routes");
const app = express();
const bodyParser = require("body-parser");
const {
  decryptRequestBody,
  encryptResponseBody,
} = require("./middlewares/encryptionMiddleware");

// Apply middleware globally

// middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [VARIABLES.CLIENT_URL, VARIABLES.LOCAL_URL],
    credentials: true,
  })
);
app.use(decryptRequestBody);
app.use(encryptResponseBody);

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 })
);

app.use("/api/v1", routers);

module.exports = app;
