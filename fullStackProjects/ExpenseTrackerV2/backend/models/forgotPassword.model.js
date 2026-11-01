const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const forgotPassword = db.define("ForgotPassword", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = forgotPassword;
