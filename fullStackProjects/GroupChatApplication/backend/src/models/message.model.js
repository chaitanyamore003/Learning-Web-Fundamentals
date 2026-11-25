import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Message = db.define(
  "Message",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    message_type: {
      // Changed "FILE" to "DOCUMENT" to match frontend logic
      type: DataTypes.ENUM(
        "TEXT",
        "IMAGE",
        "VIDEO",
        "AUDIO",
        "DOCUMENT",
        "SYSTEM",
      ),
      allowNull: false,
      defaultValue: "TEXT",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["conversation_id", "created_at"],
      },
      {
        fields: ["sender_id"],
      },
    ],
  },
);

export default Message;
