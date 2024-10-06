const cron = require("node-cron");
const logger = require("../../logger");
const { updateERPFromShopify } = require("../controllers/auth.controller");

cron.schedule("0 0 * * *", async () => {
  logger.info("Running scheduled Shopify sync to ERP...");
  try {
    await updateERPFromShopify();
    logger.info("Shopify sync to ERP successful");
  } catch (error) {
    logger.error("Error during Shopify sync to ERP:", error.message);
  }
});
