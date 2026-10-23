const { DataTypes } = require("sequelize");
const database = require("../utils/db-connection");

const Courses = database.define("Courses", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Courses;
