// src/models/archivedAttachment.model.js
import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ArchivedAttachment = db.define(
  "ArchivedAttachment",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: false, // Copying the original ID
    },
    message_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    storage_provider: {
      type: DataTypes.STRING(50),
      defaultValue: "S3",
    },
  },
  {
    tableName: "archived_attachments",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["message_id"],
      },
    ],
  },
);

export default ArchivedAttachment;
