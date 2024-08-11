const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const requestIp = require("request-ip");
const cookieParser = require("cookie-parser");
const api = require("./api");
const { allowedUrls } = require("../config");
const { handleErrors } = require("../errors/handleErrors");
const { GenericMessages } = require("../constants");
const { handle } = require("../utils/asyncHandler");

const app = express();

const corsOptions = {
  origin: allowedUrls,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(requestIp.mw());

app.use(morgan("combined"));

let accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../", "access.log"),
  {
    flags: "a",
  }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  "/api/images",
  express.static(path.join(__dirname, "../public/images"))
);
app.use(
  "/api/withdrawals/receipt",
  express.static(path.join(__dirname, "../public/receipts"))
);

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  skip: function (req) {
    return req.ip === "::1";
  },
  handler: function (req, res /*next*/) {
    return res.status(429).json({
      error: GenericMessages.SENT_REQUESTS,
    });
  },
});
app.use(apiRequestLimiter);

app.use("/api", api);

app.use(handleErrors);

module.exports = app;
