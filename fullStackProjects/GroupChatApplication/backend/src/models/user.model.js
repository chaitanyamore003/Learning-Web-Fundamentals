import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    // Login identifier #2. Nullable so existing rows are fine.
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password_reset_token: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },

    profile_picture: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // Cloudinary public_id — needed later to delete the old avatar.
    profile_picture_public_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    last_seen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  },
);

export default User;
