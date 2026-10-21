//from the sequelize module
const { DataTypes } = require("sequelize");

//from our db-connection
const sequelize = require("../utils/db-connection");

//defining the schema
const Students = sequelize.define("Students", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Students;
