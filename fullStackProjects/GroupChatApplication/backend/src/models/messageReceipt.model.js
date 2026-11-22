import { DataTypes } from "sequelize";
import db from "../config/database.js";

const MessageReceipt = db.define(
  "MessageReceipt",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    message_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "message_receipts",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["message_id", "user_id"],
      },
      {
        fields: ["user_id", "read_at"],
      },
    ],
  },
);

export default MessageReceipt;
