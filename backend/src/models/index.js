const { client } = require("../config/db");
const { DataTypes } = require("sequelize");

const Company = client.define(
  "Company",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
  },
  {
    tableName: "Companies",
  }
);

const Customer = client.define(
  "Customer",
  {
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    companyId: {
      type: DataTypes.INTEGER,
      references: { model: "Company", key: "id" },
      allowNull: true,
    },
    shopifyId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true,
    },
    addresses: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "Customers",
  }
);

Company.hasMany(Customer);
Customer.belongsTo(Company);

module.exports = { Customer, Company };
