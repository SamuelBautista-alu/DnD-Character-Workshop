import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";
import User from "./User.js";

const Homebrew = sequelize.define(
  "Homebrew",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contentType: {
      type: DataTypes.ENUM("class", "race", "spell", "item", "background"),
      allowNull: false,
      field: "contentType",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // For Classes
    hitDie: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // For Races
    speed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    abilityScores: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    // For Spells
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    school: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    castingTime: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    range: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    concentration: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    components: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    // For Items
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    rarity: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    properties: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    // For Backgrounds
    skillProficiencies: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    toolProficiencies: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    // Common
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Homebrew",
    timestamps: true,
  },
);

// Associations
Homebrew.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Homebrew, { foreignKey: "userId" });

export default Homebrew;
