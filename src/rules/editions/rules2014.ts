import { SpellcastingType } from "../spellSlots";

type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export type Skill =
  | "Acrobatics"
  | "Animal Handling"
  | "Arcana"
  | "Athletics"
  | "Deception"
  | "History"
  | "Insight"
  | "Intimidation"
  | "Investigation"
  | "Medicine"
  | "Nature"
  | "Perception"
  | "Performance"
  | "Persuasion"
  | "Religion"
  | "Sleight of Hand"
  | "Stealth"
  | "Survival";

interface ClassRule {
  hitDie: number;
  spellcasting: SpellcastingType;
  subclassLevel: number;
  asiLevels: number[];
  spellcastingAbility?: Ability;
  preparedFormula?: "ability+level" | "ability+halfLevel" | "ability+pb";
  cantripProgression?: Record<number, number>; // Level -> cantrip count
  savingThrows: Ability[]; // Proficient saving throws
  skillChoices: { count: number; options: Skill[] }; // Number of skills and available options
}

const PROFICIENCY_BONUS: Record<number, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

const CLASS_RULES_2014: Record<string, ClassRule> = {
  Barbarian: {
    hitDie: 12,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    savingThrows: ["STR", "CON"],
    skillChoices: {
      count: 2,
      options: [
        "Animal Handling",
        "Athletics",
        "Intimidation",
        "Nature",
        "Perception",
        "Survival",
      ],
    },
  },
  Bard: {
    hitDie: 8,
    spellcasting: "full",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    preparedFormula: "ability+level",
    cantripProgression: { 1: 2, 4: 3, 10: 4 },
    savingThrows: ["DEX", "CHA"],
    skillChoices: {
      count: 3,
      options: [
        "Acrobatics",
        "Animal Handling",
        "Arcana",
        "Athletics",
        "Deception",
        "History",
        "Insight",
        "Intimidation",
        "Investigation",
        "Medicine",
        "Nature",
        "Perception",
        "Performance",
        "Persuasion",
        "Religion",
        "Sleight of Hand",
        "Stealth",
        "Survival",
      ],
    },
  },
  Cleric: {
    hitDie: 8,
    spellcasting: "full",
    subclassLevel: 1,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "WIS",
    preparedFormula: "ability+level",
    cantripProgression: { 1: 3, 10: 4 },
    savingThrows: ["WIS", "CHA"],
    skillChoices: {
      count: 2,
      options: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
    },
  },
  Druid: {
    hitDie: 8,
    spellcasting: "full",
    subclassLevel: 2,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "WIS",
    preparedFormula: "ability+level",
    cantripProgression: { 1: 2, 4: 3, 10: 4 },
    savingThrows: ["INT", "WIS"],
    skillChoices: {
      count: 2,
      options: [
        "Arcana",
        "Animal Handling",
        "Insight",
        "Medicine",
        "Nature",
        "Perception",
        "Religion",
        "Survival",
      ],
    },
  },
  Fighter: {
    hitDie: 10,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
    savingThrows: ["STR", "CON"],
    skillChoices: {
      count: 2,
      options: [
        "Acrobatics",
        "Animal Handling",
        "Athletics",
        "History",
        "Insight",
        "Intimidation",
        "Perception",
        "Survival",
      ],
    },
  },
  "Eldritch Knight": {
    hitDie: 10,
    spellcasting: "third",
    subclassLevel: 3,
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
    spellcastingAbility: "INT",
    cantripProgression: { 3: 2, 10: 3 },
    savingThrows: ["STR", "CON"],
    skillChoices: {
      count: 2,
      options: [
        "Acrobatics",
        "Animal Handling",
        "Athletics",
        "History",
        "Insight",
        "Intimidation",
        "Perception",
        "Survival",
      ],
    },
  },
  Monk: {
    hitDie: 8,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    savingThrows: ["STR", "DEX"],
    skillChoices: {
      count: 2,
      options: [
        "Acrobatics",
        "Athletics",
        "History",
        "Insight",
        "Religion",
        "Stealth",
      ],
    },
  },
  Paladin: {
    hitDie: 10,
    spellcasting: "half",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    preparedFormula: "ability+halfLevel",
    savingThrows: ["WIS", "CHA"],
    skillChoices: {
      count: 2,
      options: [
        "Athletics",
        "Insight",
        "Intimidation",
        "Medicine",
        "Persuasion",
        "Religion",
      ],
    },
  },
  Ranger: {
    hitDie: 10,
    spellcasting: "half",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "WIS",
    preparedFormula: "ability+halfLevel",
    savingThrows: ["STR", "DEX"],
    skillChoices: {
      count: 3,
      options: [
        "Animal Handling",
        "Athletics",
        "Insight",
        "Investigation",
        "Nature",
        "Perception",
        "Stealth",
        "Survival",
      ],
    },
  },
  Rogue: {
    hitDie: 8,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 8, 10, 12, 16, 19],
    savingThrows: ["DEX", "INT"],
    skillChoices: {
      count: 4,
      options: [
        "Acrobatics",
        "Athletics",
        "Deception",
        "Insight",
        "Intimidation",
        "Investigation",
        "Perception",
        "Performance",
        "Persuasion",
        "Sleight of Hand",
        "Stealth",
      ],
    },
  },
  "Arcane Trickster": {
    hitDie: 8,
    spellcasting: "third",
    subclassLevel: 3,
    asiLevels: [4, 8, 10, 12, 16, 19],
    spellcastingAbility: "INT",
    cantripProgression: { 3: 2, 9: 3 },
    savingThrows: ["DEX", "INT"],
    skillChoices: {
      count: 4,
      options: [
        "Acrobatics",
        "Athletics",
        "Deception",
        "Insight",
        "Intimidation",
        "Investigation",
        "Perception",
        "Performance",
        "Persuasion",
        "Sleight of Hand",
        "Stealth",
      ],
    },
  },
  Sorcerer: {
    hitDie: 6,
    spellcasting: "full",
    subclassLevel: 1,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    preparedFormula: "ability+level",
    cantripProgression: { 1: 4, 10: 5 },
    savingThrows: ["CON", "CHA"],
    skillChoices: {
      count: 2,
      options: [
        "Arcana",
        "Deception",
        "Insight",
        "Intimidation",
        "Persuasion",
        "Religion",
      ],
    },
  },
  Warlock: {
    hitDie: 8,
    spellcasting: "pact",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    cantripProgression: { 1: 2, 6: 3, 10: 4, 14: 5, 18: 6 },
    savingThrows: ["WIS", "CHA"],
    skillChoices: {
      count: 2,
      options: [
        "Arcana",
        "Deception",
        "History",
        "Intimidation",
        "Investigation",
        "Nature",
        "Religion",
      ],
    },
  },
  Wizard: {
    hitDie: 6,
    spellcasting: "full",
    subclassLevel: 2,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "INT",
    preparedFormula: "ability+level",
    cantripProgression: { 1: 3, 4: 4, 10: 5 },
    savingThrows: ["INT", "WIS"],
    skillChoices: {
      count: 2,
      options: [
        "Arcana",
        "History",
        "Insight",
        "Investigation",
        "Medicine",
        "Religion",
      ],
    },
  },
  Artificer: {
    hitDie: 8,
    spellcasting: "half",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "INT",
    preparedFormula: "ability+halfLevel",
    cantripProgression: { 1: 2, 10: 3 },
    savingThrows: ["CON", "INT"],
    skillChoices: {
      count: 2,
      options: [
        "Arcana",
        "History",
        "Investigation",
        "Medicine",
        "Nature",
        "Perception",
        "Sleight of Hand",
      ],
    },
  },
};

// Tabla de espacios de hechizo multiclase (PHB 2014) indexada por nivel de lanzador efectivo
const MULTICLASS_SPELL_SLOTS: Record<number, number[]> = {
  1: [2],
  2: [3],
  3: [4, 2],
  4: [4, 3],
  5: [4, 3, 2],
  6: [4, 3, 3],
  7: [4, 3, 3, 1],
  8: [4, 3, 3, 2],
  9: [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2],
  11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1],
  14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1],
  16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// Magia de pacto (Brujo 2014)
const PACT_MAGIC_SLOTS: Record<
  number,
  {
    slots: number;
    slotLevel: number;
  }
> = {
  1: { slots: 1, slotLevel: 1 },
  2: { slots: 2, slotLevel: 1 },
  3: { slots: 2, slotLevel: 2 },
  4: { slots: 2, slotLevel: 2 },
  5: { slots: 2, slotLevel: 3 },
  6: { slots: 2, slotLevel: 3 },
  7: { slots: 2, slotLevel: 4 },
  8: { slots: 2, slotLevel: 4 },
  9: { slots: 2, slotLevel: 5 },
  10: { slots: 2, slotLevel: 5 },
  11: { slots: 3, slotLevel: 5 },
  12: { slots: 3, slotLevel: 5 },
  13: { slots: 3, slotLevel: 5 },
  14: { slots: 3, slotLevel: 5 },
  15: { slots: 3, slotLevel: 5 },
  16: { slots: 3, slotLevel: 5 },
  17: { slots: 4, slotLevel: 5 },
  18: { slots: 4, slotLevel: 5 },
  19: { slots: 4, slotLevel: 5 },
  20: { slots: 4, slotLevel: 5 },
};

export const RULES_2014 = {
  proficiencyBonus: PROFICIENCY_BONUS,
  classes: CLASS_RULES_2014,
  multiclassSpellSlots: MULTICLASS_SPELL_SLOTS,
  pactMagicSlots: PACT_MAGIC_SLOTS,
};
