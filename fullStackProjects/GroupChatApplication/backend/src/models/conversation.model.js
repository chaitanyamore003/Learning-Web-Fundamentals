import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Conversation = db.define(
  "Conversation",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    type: {
      type: DataTypes.ENUM("DIRECT", "GROUP"),
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    group_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    // Sorted user IDs, e.g. "12_25".
    // Used to prevent duplicate direct conversations.
    direct_key: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["type"],
      },
    ],
  },
);

export default Conversation;
