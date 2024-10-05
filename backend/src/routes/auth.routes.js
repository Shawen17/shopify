const dotenv = require("dotenv");
const multer = require("multer");
const controller = require("../controllers/auth.controller");
const tokenController = require("../controllers/user.controller");

dotenv.config();
const upload = multer();

// Route to initiate the OAuth flow

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/auth", tokenController.authenticate);

  app.get("/auth/callback", tokenController.auth_callback);

  app.get("/api/customers", controller.get_customers);

  app.get("/api/companies", controller.get_companies);

  app.post("/api/customer", upload.none(), controller.add_customer);

  app.post("/api/company", controller.add_company);

  app.put("/api/companies/:id", controller.update_company);

  app.put("/api/customers/:id", upload.none(), controller.update_customer);

  app.delete("/api/company/:id", controller.delete_company);

  app.delete("/api/customer/:id", controller.delete_customer);
};
