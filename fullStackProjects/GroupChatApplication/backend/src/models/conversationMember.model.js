import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ConversationMember = db.define(
  "ConversationMember",
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

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("ADMIN", "MEMBER"),
      defaultValue: "MEMBER",
      allowNull: false,
    },

    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "conversation_members",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["conversation_id", "user_id"],
      },
      {
        fields: ["user_id"],
      },
    ],
  },
);

export default ConversationMember;
