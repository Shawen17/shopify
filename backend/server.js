const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const { expressjwt } = require("express-jwt");
const bodyParser = require("body-parser");
const logger = require("./logger");
const { connect } = require("./src/config/db");
require("./src/jobs/syncShopify");

dotenv.config();

const port = process.env.PORT || 9000;
const app = express();

connect();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions), bodyParser.json(), express.json());

app.use(
  expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

require("./src/routes/auth.routes")(app);

app.listen(port, () => {
  logger.info(`Listening on port ${port}....`);
});
