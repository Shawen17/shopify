const dotenv = require("dotenv");
const logger = require("../../logger");
dotenv.config();

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const SHOPIFY_SCOPES = "read_customers";
const REDIRECT_URI =
  " https://1846-2607-f2c0-e574-1ad0-1dac-5d86-e224-1ab9.ngrok-free.app/auth/callback"; // or your actual URI

const tokenStore = { shopify: "" };

exports.authenticate = async (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    logger.error("Missing shop parameter");
    return res.status(400).send({ message: "Missing shop parameter" });
  }
  // res.setHeader("Access-Control-Allow-Origin", "*");

  const authUrl = encodeURI(
    `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_SCOPES}&redirect_uri=${REDIRECT_URI}&grant_options[]=per-user`
  );
  res.redirect(authUrl);
};

exports.auth_callback = async (req, res) => {
  const { code, shop } = req.query;

  if (!code || !shop) {
    return res.status(400).send({ message: "Missing code or shop parameter" });
  }

  // Exchange code for access token
  const accessTokenUrl = `https://${shop}/admin/oauth/access_token`;
  const params = {
    client_id: SHOPIFY_API_KEY,
    client_secret: SHOPIFY_CLIENT_SECRET,
    code,
  };
  const header = {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  };

  try {
    const response = await axios.post(accessTokenUrl, params, header);
    const accessToken = response.data.access_token;
    tokenStore.shopify = accessToken;
    logger.info(accessToken);

    res.redirect(`http://localhost:3000/customers`);
  } catch (error) {
    logger.error(
      `Error exchanging code for access token: ${
        error.response ? error.response.data : error.message
      }`
    );
    return res.status(500).send("Error during authentication.");
  }
};

module.exports.tokenStore = tokenStore;
