const { DataTypes } = require("sequelize");
const database = require("../database");

const Bookings = database.define("Bookings", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Bookings;
