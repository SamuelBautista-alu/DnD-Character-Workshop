import Joi from "joi";
import inMemoryCharacterService from "../services/inMemoryCharacterService.js";
import Character from "../models/Character.js";
import { responses } from "../utils/responses.js";

// Validation schemas for complex nested structures
const skillSchema = Joi.object({
  modifier: Joi.number().required(),
  proficient: Joi.boolean().default(false),
  expertise: Joi.boolean().default(false),
});

const savingThrowSchema = Joi.object({
  modifier: Joi.number().required(),
  proficient: Joi.boolean().default(false),
});

const spellSlotSchema = Joi.object({
  max: Joi.number().integer().min(0),
  used: Joi.number().integer().min(0),
});

const classSchema = Joi.object({
  index: Joi.string(),
  name: Joi.string(),
  levels: Joi.number().integer().min(1).max(20),
  subclass: Joi.alternatives()
    .try(
      Joi.string().allow(null, ""),
      Joi.object({
        index: Joi.string(),
        name: Joi.string(),
      })
    )
    .allow(null),
  subclassIndex: Joi.string().allow(null, ""),
});

const spellSchema = Joi.object({
  index: Joi.string(),
  name: Joi.string(),
  level: Joi.number().integer().min(0).max(9),
  school: Joi.object({
    index: Joi.string(),
    name: Joi.string(),
  }),
  castingTime: Joi.string(),
});

const featSchema = Joi.object({
  index: Joi.string(),
  name: Joi.string(),
  level: Joi.number().integer().min(1),
  description: Joi.string(),
});

const backgroundSchema = Joi.object({
  index: Joi.string(),
  name: Joi.string(),
  traits: Joi.array().items(Joi.string()),
});

const inventoryItemSchema = Joi.object({
  id: Joi.string().allow(null),
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(0).default(1),
  weight: Joi.number().min(0).allow(null),
  equipped: Joi.boolean().default(false),
  notes: Joi.string().allow("", null),
});

// Main character validation schema
const characterSchema = Joi.object({
  // Basic Info
  name: Joi.string().min(1).max(100).required(),
  race: Joi.string().max(50).default("Human"),
  background: backgroundSchema.allow(null),
  alignment: Joi.string().max(50).default("Neutral"),
  imageUrl: Joi.string().max(500).allow(null),

  // Progression
  level: Joi.number().integer().min(1).max(20).default(1),
  experience: Joi.number().integer().min(0).default(0),

  // Ability Scores
  strength: Joi.number().integer().min(1).max(20).default(10),
  dexterity: Joi.number().integer().min(1).max(20).default(10),
  constitution: Joi.number().integer().min(1).max(20).default(10),
  intelligence: Joi.number().integer().min(1).max(20).default(10),
  wisdom: Joi.number().integer().min(1).max(20).default(10),
  charisma: Joi.number().integer().min(1).max(20).default(10),

  // Combat Stats
  hitPoints: Joi.number().integer().min(0).default(10),
  maxHitPoints: Joi.number().integer().min(1).default(10),
  armorClass: Joi.number().integer().min(0).default(10),

  // Multiclass
  classes: Joi.array().items(classSchema).allow(null),

  // Hit Dice
  hitDice: Joi.object({
    d6: Joi.number().integer().min(0),
    d8: Joi.number().integer().min(0),
    d10: Joi.number().integer().min(0),
    d12: Joi.number().integer().min(0),
  }).allow(null),

  // Proficiency
  proficiency: Joi.number().integer().min(0).default(2),

  // Skills & Saves
  skills: Joi.object().pattern(Joi.string(), skillSchema).allow(null),
  savingThrows: Joi.object()
    .pattern(Joi.string(), savingThrowSchema)
    .allow(null),

  // Spellcasting
  spells: Joi.object()
    .pattern(
      Joi.number().integer().min(0).max(9),
      Joi.array().items(spellSchema)
    )
    .allow(null),
  spellSlots: Joi.object()
    .pattern(Joi.number().integer().min(1).max(9), spellSlotSchema)
    .allow(null),
  spellSaveDC: Joi.number().integer().allow(null),
  spellAttackBonus: Joi.number().integer().allow(null),

  // Feats & Features
  feats: Joi.array().items(featSchema).allow(null),
  classFeatures: Joi.object().allow(null),

  // Death Saves (Game Mode)
  deathSaveSuccesses: Joi.number().integer().min(0).max(3).default(0),
  deathSaveFailures: Joi.number().integer().min(0).max(3).default(0),

  // Edition
  edition: Joi.string().valid("2014", "2024").allow(null),

  // Inventory
  inventory: Joi.array().items(inventoryItemSchema).allow(null),
  current_weight: Joi.number().min(0).allow(null),

  // Proficiencies (simplified arrays)
  proficientSkills: Joi.array().items(Joi.string()).allow(null),
  expertiseSkills: Joi.array().items(Joi.string()).allow(null),
  proficientSavingThrows: Joi.array().items(Joi.string()).allow(null),

  // Additional
  notes: Joi.string().allow(""),
}).custom((value, helpers) => {
  // Validate that total character level (sum of all class levels) doesn't exceed 20
  if (value.classes && Array.isArray(value.classes)) {
    const totalLevel = value.classes.reduce(
      (sum, cls) => sum + (cls.levels || 0),
      0
    );
    if (totalLevel > 20) {
      return helpers.error("any.invalid", {
        message: "Total character level across all classes cannot exceed 20",
      });
    }
  }
  return value;
});

const useInMemory = process.env.USE_IN_MEMORY === "true";

export async function listCharacters(req, res, next) {
  try {
    const userId = req.userId;
    if (useInMemory) {
      const characters = await inMemoryCharacterService.findByUserId(userId);
      return res.json(
        responses.success(characters, "Characters retrieved successfully")
      );
    }

    const characters = await Character.findAll({
      where: { userId },
      order: [["id", "ASC"]],
    });

    return res.json(
      responses.success(
        characters.map((c) => c.toJSON()),
        "Characters retrieved successfully"
      )
    );
  } catch (err) {
    next(err);
  }
}

export async function createCharacter(req, res, next) {
  try {
    const { error, value } = characterSchema.validate(req.body);
    if (error) return res.status(400).json(responses.error(error.message, 400));
    if (useInMemory) {
      const character = await inMemoryCharacterService.createCharacter(
        req.userId,
        value
      );

      return res
        .status(201)
        .json(responses.success(character, "Character created"));
    }

    const character = await Character.create({ userId: req.userId, ...value });

    return res
      .status(201)
      .json(responses.success(character.toJSON(), "Character created"));
  } catch (err) {
    next(err);
  }
}

export async function getCharacter(req, res, next) {
  try {
    const { id } = req.params;
    if (useInMemory) {
      const character = await inMemoryCharacterService.findById(id);

      if (!character || character.userId !== req.userId) {
        return res
          .status(404)
          .json(responses.error("Character not found", 404));
      }

      return res.json(
        responses.success(character, "Character retrieved successfully")
      );
    }

    const character = await Character.findOne({
      where: { id, userId: req.userId },
    });

    if (!character) {
      return res.status(404).json(responses.error("Character not found", 404));
    }

    return res.json(
      responses.success(character.toJSON(), "Character retrieved successfully")
    );
  } catch (err) {
    next(err);
  }
}

export async function updateCharacter(req, res, next) {
  try {
    const { id } = req.params;
    if (useInMemory) {
      const existing = await inMemoryCharacterService.findById(id);

      if (!existing || existing.userId !== req.userId) {
        return res
          .status(404)
          .json(responses.error("Character not found", 404));
      }

      const { error, value } = characterSchema.validate(req.body, {
        stripUnknown: true,
      });
      if (error)
        return res.status(400).json(responses.error(error.message, 400));

      const character = await inMemoryCharacterService.updateCharacter(
        id,
        value
      );

      return res.json(
        responses.success(character, "Character updated successfully")
      );
    }

    const existing = await Character.findOne({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json(responses.error("Character not found", 404));
    }

    const { error, value } = characterSchema.validate(req.body, {
      stripUnknown: true,
    });
    if (error) return res.status(400).json(responses.error(error.message, 400));

    await existing.update(value);

    return res.json(
      responses.success(existing.toJSON(), "Character updated successfully")
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteCharacter(req, res, next) {
  try {
    const { id } = req.params;
    if (useInMemory) {
      const existing = await inMemoryCharacterService.findById(id);

      if (!existing || existing.userId !== req.userId) {
        return res
          .status(404)
          .json(responses.error("Character not found", 404));
      }

      await inMemoryCharacterService.deleteCharacter(id);

      return res.json(
        responses.success(null, "Character deleted successfully")
      );
    }

    const deleted = await Character.destroy({
      where: { id, userId: req.userId },
    });

    if (!deleted) {
      return res.status(404).json(responses.error("Character not found", 404));
    }

    return res.json(responses.success(null, "Character deleted successfully"));
  } catch (err) {
    next(err);
  }
}

export default {
  listCharacters,
  createCharacter,
  getCharacter,
  updateCharacter,
  deleteCharacter,
};
