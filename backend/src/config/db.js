const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const logger = require("../../logger");

dotenv.config();

MYSQL_USER = process.env.MYSQL_USER;
MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
MYSQL_HOST = process.env.MYSQL_HOST;
MYSQL_PORT = process.env.MYSQL_PORT || 3306;

const client = new Sequelize("marz", MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mariadb",
});

async function connect(retries = 5, delay = 3000) {
  let delayFactor = 1;

  while (retries > 0) {
    try {
      await client.authenticate();
      logger.info("Database connected successfully.");
      return;
    } catch (error) {
      const delayTime = delay * delayFactor;
      logger.warn(
        `Connection failed: ${error.message}, retrying in ${
          delayTime / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayTime));
      delayFactor += 1;
      retries -= 1;
    }
  }

  logger.error("Could not connect to the database after several attempts");
}

module.exports = { connect, client };
