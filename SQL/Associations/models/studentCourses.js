const { DataTypes } = require("sequelize");
const database = require("../utils/db-connection");

const studentCourses = database.define("studentCourses", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = studentCourses;
