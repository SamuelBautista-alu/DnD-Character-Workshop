import Sequelize from "sequelize";
import sequelize from "../db/database.js";

const { DataTypes } = Sequelize;

const Character = sequelize.define(
  "Character",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // Información básica del personaje
    race: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Human",
    },
    background: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Selección de trasfondo: { index: string, name: string, traits: [...] }",
    },
    alignment: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Neutral",
    },

    // Progresión y Experiencia
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // Puntuaciones de Habilidades
    strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    dexterity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    constitution: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    intelligence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    wisdom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    charisma: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    // Estadísticas de Combate
    hitPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    maxHitPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    armorClass: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    // Soporte Multiclase
    classes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Datos multiclase: [{ index: string, name: string, levels: number, subclass: {...} }, ...]",
    },

    // Características específicas de la clase
    hitDice: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Dados de golpe por clase y nivel: { d6: 2, d8: 0, d10: 0, d12: 0 }",
    },
    proficiency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 2,
      comment: "Bonificación de pericia basada en nivel",
    },

    // Habilidades y Tiradas de Salvación
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Habilidades con modificadores: { acrobatics: { modifier: 3, proficient: true, expertise: false }, ... }",
    },
    savingThrows: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Tiradas de salvación con pericia: { strength: { modifier: 5, proficient: true }, ... }",
    },

    // Lanzamiento de Hechizos
    spells: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Hechizos por nivel: { 0: [spell1, spell2], 1: [spell3, spell4], ... }",
    },
    spellSlots: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Espacios de hechizo disponibles por nivel: { 1: { max: 4, used: 1 }, 2: { max: 3, used: 0 }, ... }",
    },
    spellSaveDC: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment:
        "CD de Tirada de Salvación de Hechizo calculada desde habilidad de lanzamiento",
    },
    spellAttackBonus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment:
        "Bonificación de Ataque de Hechizo calculada desde pericia + modificador de habilidad",
    },

    // Hazañas y Características
    feats: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Hazañas: [{ index: string, name: string, level: number, description: string }, ...]",
    },
    classFeatures: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Características de clase y especializaciones para cada nivel de clase",
    },

    // Tiradas de Muerte (Modo Juego)
    deathSaveSuccesses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deathSaveFailures: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // Información Adicional
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL de la imagen del retrato del personaje",
    },

    // Edición (2014 o 2024)
    edition: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "2014",
      comment: "Edición de D&D 5e: 2014 o 2024",
    },

    // Sistema de Inventario
    inventory: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Objetos del inventario del personaje: [{ id, name, quantity, weight, equipped, notes }, ...]",
    },
    current_weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: "Peso actual que se lleva en libras",
    },

    // Pericia (listas simplificadas)
    proficientSkills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment: "Array de nombres de habilidades en las que hay pericia",
    },
    expertiseSkills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Array de nombres de habilidades con pericia de experto (doble pericia)",
    },
    proficientSavingThrows: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Array de abreviaturas de tiradas de salvación con pericia: ['STR', 'DEX', ...]",
    },
  },
  {
    tableName: "Characters",
    timestamps: true,
  },
);

export default Character;
