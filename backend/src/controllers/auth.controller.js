const axios = require("axios");
const { client } = require("../config/db");
const { Customer, Company } = require("../models");
const logger = require("../../logger");
const { tokenStore } = require("./user.controller");

const accessToken = tokenStore.shopify;

const shopifyAPI = axios.create({
  baseURL: "https://ggs-sandbox.myshopify.com/admin/api/2023-07",
  headers: {
    "X-Shopify-Access-Token": process.env.ACCESS_TOKEN,
  },
});

const retry = async (func, retries = 5, delay = 3000) => {
  let delayFactor = 1;

  if (typeof func !== "function") {
    throw new Error("The first argument must be a function");
  }

  while (retries > 0) {
    try {
      const result = await func();
      logger.info(`${func.name} completed successfully.`);
      return result;
    } catch (error) {
      const delayTime = delay * delayFactor;
      logger.warn(
        `operation failed in ${func.name} : ${error.message}, retrying in ${
          delayTime / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayTime));
      delayFactor += 1;
      retries -= 1;
    }
  }

  logger.error(
    `Could not complete ${func.name} operation after several attempts`
  );
};

exports.add_company = async (req, res) => {
  try {
    const { name, address } = req.body;
    const company = await Company.create({ name, address });

    res.status(201).send({
      message: `Company ${company.name} added successfully`,
      data: company,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.add_customer = async (req, res) => {
  const transaction = await client.transaction();
  try {
    const { first_name, last_name, email, addresses, companyId } = req.body;
    let parsedAddresses = {};
    if (addresses) {
      parsedAddresses = JSON.parse(addresses);
    }

    const company = await Company.findOne({
      where: { id: companyId },
      transaction,
    });
    if (!company) {
      await transaction.rollback();
      return res.status(404).json({ message: "Company not found" });
    }

    const data = {
      first_name,
      last_name,
      email,
      addresses: [parsedAddresses],
      companyId,
    };

    const customer = await Customer.create(data, { transaction });

    const createShopifyCustomer = async () => {
      const response = await shopifyAPI.post("/customers.json", {
        customer: {
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
          addresses: customer.addresses,
        },
      });

      logger.info("Shopify API response status:", response?.status);
      logger.info("Shopify API response headers:", response?.headers);
      logger.info("Shopify API response data:", response?.data);

      const shopifyCustomerId = response.data.customer?.id;
      if (!shopifyCustomerId) {
        logger.error("Shopify API did not return a customer ID");
        throw new Error("Failed to retrieve customer ID from Shopify");
      }

      return shopifyCustomerId;
    };

    const shopifyCustomerId = await retry(createShopifyCustomer);

    await customer.update({ shopifyId: shopifyCustomerId }, { transaction });
    const newCustomer = await Customer.findOne({
      where: { shopifyId: shopifyCustomerId },
      transaction,
    });

    await transaction.commit();

    return res.status(201).send({
      message: `Customer ${newCustomer.first_name} added successfully`,
      data: newCustomer,
    });
  } catch (err) {
    await transaction.rollback();
    logger.error(`Error during add_customer operation: ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};

exports.update_company = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await Company.update(req.body, {
      where: { id },
    });

    if (updated) {
      const updatedCompany = await Company.findByPk(id);

      res.status(200).send({
        message: `Company updated`,
        data: updatedCompany,
      });
    } else {
      res.status(404).send({
        message: `Company not found`,
      });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.update_customer = async (req, res) => {
  const transaction = await client.transaction();
  let transactionCommitted = false;
  try {
    const shopifyId = req.params.id;
    let updates = req.body;

    const customer = await Customer.findOne({
      where: { shopifyId },
      transaction,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if ("addresses" in updates) {
      try {
        const info = JSON.parse(updates.addresses);
        const existingAddresses = customer.addresses?.[0] || {};
        updates.addresses = [{ ...existingAddresses, ...info }];
      } catch (err) {
        throw new Error("Failed to parse addresses");
      }
    }

    await customer.update(updates, { transaction });

    const updateShopifyCustomer = async () => {
      await shopifyAPI.put(`/customers/${shopifyId}.json`, {
        customer: updates,
      });
    };

    await retry(updateShopifyCustomer);

    const updatedCustomer = await Customer.findOne({
      where: { shopifyId },
      transaction,
    });

    await transaction.commit();
    transactionCommitted = true;
    res.status(200).send({
      message: `Customer updated successfully`,
      data: updatedCustomer,
    });
  } catch (err) {
    if (!transactionCommitted) {
      await transaction.rollback();
    }

    logger.error(`Error during update_customer operation: ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};

exports.get_companies = async (req, res) => {
  try {
    const companies = await Company.findAll();

    res.status(200).send({
      message: "successful",
      data: companies,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.get_customers = async (req, res) => {
  try {
    const { pageInfo } = req.query;

    let url = `https://ggs-sandbox.myshopify.com/admin/api/2023-07/customers.json?limit=4`;
    if (pageInfo) {
      url += `&page_info=${pageInfo}`;
    }

    const getShopifyCustomers = async () => {
      const response = await axios.get(url, {
        headers: {
          "X-Shopify-Access-Token": process.env.ACCESS_TOKEN,
        },
      });

      const customers = response.data.customers;
      const linkHeader = response.headers.link;

      let nextPageInfo = null;
      let prevPageInfo = null;

      if (linkHeader) {
        const links = linkHeader.split(",");
        links.forEach((link) => {
          if (link.includes('rel="next"')) {
            nextPageInfo = new URLSearchParams(link.match(/<(.+?)>/)[1]).get(
              "page_info"
            );
          } else if (link.includes('rel="previous"')) {
            prevPageInfo = new URLSearchParams(link.match(/<(.+?)>/)[1]).get(
              "page_info"
            );
          }
        });
      }
      return { customers, nextPageInfo, prevPageInfo };
    };

    const { customers, nextPageInfo, prevPageInfo } = await retry(
      getShopifyCustomers
    );

    res.status(200).send({
      data: customers,
      nextPageInfo,
      prevPageInfo,
      message: "Retrieval successful",
    });
  } catch (err) {
    logger.error(`Error during getShopifyCustomers: ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};

exports.delete_customer = async (req, res) => {
  const transaction = await client.transaction();
  try {
    const shopifyId = req.params.id;
    logger.info(`Deleting customer with shopifyId: ${shopifyId}`);

    const customer = await Customer.findOne({
      where: { shopifyId },
      transaction,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const deleteShopifyCustomer = async () => {
      try {
        await shopifyAPI.delete(`/customers/${shopifyId}.json`);
      } catch (apiError) {
        logger.error(
          `Error deleting customer from Shopify: ${apiError.message}`
        );
        throw new Error("Failed to delete customer from Shopify");
      }
    };

    await retry(deleteShopifyCustomer);

    await Customer.destroy({ where: { shopifyId }, transaction });

    await transaction.commit();

    res.status(204).send({
      message: `Customer with shopifyId: ${shopifyId} deleted successfully from both ERP and Shopify`,
    });
  } catch (err) {
    if (transaction.finished !== "commit") {
      await transaction.rollback();
    }
    logger.error(`Error during delete_customer operation: ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};

exports.delete_company = async (req, res) => {
  const transaction = await client.transaction();
  try {
    const id = req.params.id;

    const company = await Company.findOne({ where: { id }, transaction });
    if (!company) {
      await transaction.rollback();
      return res.status(404).send({ message: "Company not found" });
    }
    const companyName = company.name;

    await company.destroy({ transaction });

    const [affectedRows, affectedCustomers] = await Customer.update(
      { companyId: null },
      { where: { companyId: id }, returning: true, transaction }
    );

    if (affectedRows > 0) {
      for (const customer of affectedCustomers) {
        const updatedAddresses = customer.addresses.map((address) => {
          if (address.company === companyName) {
            return { ...address, company: null };
          }
          return address;
        });

        const updateShopifyCustomer = async () => {
          await shopifyAPI.put(`/customers/${customer.shopifyId}.json`, {
            customer: {
              addresses: updatedAddresses,
            },
          });
        };

        await retry(updateShopifyCustomer);
      }
    }

    await transaction.commit();
    res.status(204).send({
      message: "Company deleted and customers unlinked from the company",
    });
  } catch (err) {
    await transaction.rollback();
    logger.error(`Error deleting company: ${err.message}`);
    res.status(500).send({ message: err.message });
  }
};

exports.updateERPFromShopify = async () => {
  try {
    const res = await shopifyAPI.get("/customers.json");
    const shopifyCustomers = res.data.customers;

    for (const customer of shopifyCustomers) {
      const [existingCustomer, created] = await Customer.upsert({
        shopifyId: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        addresses: customer.addresses,
      });
    }

    logger.info("ERP update from Shopify completed successfully.");
  } catch (err) {
    logger.error("Failed to sync Shopify customers with ERP:", err.message);
    throw err.message;
  }
};
