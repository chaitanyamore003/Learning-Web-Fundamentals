// src/models/archivedMessage.model.js
import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ArchivedMessage = db.define(
  "ArchivedMessage",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      // We do NOT use autoIncrement here because we are copying
      // the exact ID from the original messages table.
      autoIncrement: false,
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
      // Keep this identical to your Message model
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
    tableName: "archived_messages",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["conversation_id", "created_at"],
      },
    ],
  },
);

export default ArchivedMessage;
