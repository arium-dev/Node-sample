/* eslint-disable no-undef */
require("dotenv").config();
const app = require("./controllers");
const mongoose = require("mongoose");
const { port } = require("./config");

const Port = port || 4000;
mongoose.promise = global.Promise;
mongoose.set("debug", false);
const db = require("./config/database");

(async () => {
  try {
    mongoose.connect(db.url);
    mongoose.connection.on("connected", () => {
      console.log("connected to database,...");
    });
    mongoose.connection.on("error", (err) => {
      console.log("can't connect to database", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongodb disconnected,...");
    });
  } catch (err) {
    console.log("can't connect to database", err);
    process.exit;
  }
})();

// testing route to check server
app.use("/api/server", (_, res) => {
  res.send("sever running");
});

app.listen(Port, function () {
  console.log(`Listening on port ${Port}!`);
});
