const Queue = require("bull");
const Path = require("path");
const { redis } = require("../config");
const { QueueType } = require("../constants");

const transactionQueue = new Queue(QueueType.TRANSACTION, redis.url);
transactionQueue.process(Path.join(__dirname, "transactionProcess.js"));

const mailQueue = new Queue(QueueType.MAIL, redis.url);
mailQueue.process(Path.join(__dirname, "mailProcess.js"));

const currencyQueue = new Queue(QueueType.CURRENCY, redis.url);
currencyQueue.process(Path.join(__dirname, "currencyProcess.js"));
