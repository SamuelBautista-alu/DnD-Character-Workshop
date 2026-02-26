import { DataTypes } from "sequelize";
import db from "../db/database.js";

const Note = db.define(
  "Note",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "Untitled Note",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
    tableName: "Notes",
  },
);

export default Note;
