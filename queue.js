/* eslint-disable no-undef */
require("dotenv").config();
require("./queue/index");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Queue = require("bull");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const { queuePort, allowedUrls, redis } = require("./config");
const { QueueList } = require("./constants");

const app = express();
const Port = queuePort || 4000;

const corsOptions = {
  origin: allowedUrls,
  credentials: true,
};
app.use(cors(corsOptions));

// testing route to check server
app.use("/api/server", (_, res) => {
  res.send("sever running");
});

app.listen(Port, function () {
  console.log(`Listening on port ${Port}!`);
});

const queueUI = (i) => {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath(`/api/queue-server/admin/queues`);
  const queueArr = QueueList.map((queue) => {
    return new BullAdapter(new Queue(queue, redis.url));
  });

  const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: queueArr,
    serverAdapter: serverAdapter,
  });

  app.use(`/api/queue-server/admin/queues`, serverAdapter.getRouter());
};

queueUI();
