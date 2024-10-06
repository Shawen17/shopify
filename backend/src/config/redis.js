const redis = require("redis");
const logger = require("../../logger");

const client = redis.createClient({
  host: "redis",
  port: 6379,
});

client.on("error", (err) => {
  logger.error("Redis error:", err);
});

client.on("connect", () => {
  logger.info("Redis connected");
});

module.exports = client;
