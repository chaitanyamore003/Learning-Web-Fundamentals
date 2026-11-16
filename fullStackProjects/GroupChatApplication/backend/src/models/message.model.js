import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Message = sequelize.define(
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
      type: DataTypes.ENUM("TEXT", "IMAGE", "VIDEO", "AUDIO", "FILE", "SYSTEM"),
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
