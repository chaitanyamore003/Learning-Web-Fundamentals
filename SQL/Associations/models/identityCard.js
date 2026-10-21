const database = require("../utils/db-connection");
const { DataTypes } = require("sequelize");

const IdentityCard = database.define("identityCard", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  cardNo: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
});

module.exports = IdentityCard;
