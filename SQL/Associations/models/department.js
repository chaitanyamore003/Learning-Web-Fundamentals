const { DataTypes, Model } = require("sequelize");
const database = require("../utils/db-connection");

const department = database.define("Department", {});

module.exports = department;
