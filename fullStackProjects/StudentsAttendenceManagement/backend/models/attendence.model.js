const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Attendance = db.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("present", "absent"),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["studentId", "date"],
      },
      {
        fields: ["date"],
      },
    ],
  },
);

module.exports = Attendance;
