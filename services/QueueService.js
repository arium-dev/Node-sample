const Queue = require("bull");
const { redis } = require("../config");

class QueueService {
  async addQueue(queue, data, option) {
    try {
      let queueConn = new Queue(queue, redis.url);

      const resp = await queueConn.add(data, option);
      await queueConn?.close();
      return resp;
    } catch (err) {
      console.log("err", err);
    }
  }
}

module.exports = { QueueService };
