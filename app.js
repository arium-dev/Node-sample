// /* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use("/", require("./controllers"));

module.exports = app;
