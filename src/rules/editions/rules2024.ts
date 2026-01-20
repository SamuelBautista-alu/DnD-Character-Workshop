import { SpellcastingType } from "../spellSlots";

type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

interface ClassRule {
  hitDie: number;
  spellcasting: SpellcastingType;
  subclassLevel: number;
  asiLevels: number[];
  spellcastingAbility?: Ability;
  preparedFormula?: "ability+level" | "ability+halfLevel" | "ability+pb";
  cantripProgression?: Record<number, number>;
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

// 2024 subclasses generally start at level 3 per the revised progression
const CLASS_RULES_2024: Record<string, ClassRule> = {
  Barbarian: {
    hitDie: 12,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
  },
  Bard: {
    hitDie: 8,
    spellcasting: "full",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    preparedFormula: "ability+pb",
    cantripProgression: { 1: 2, 4: 3, 10: 4 },
  },
  Cleric: {
    hitDie: 8,
    spellcasting: "full",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "WIS",
    preparedFormula: "ability+pb",
    cantripProgression: { 1: 3, 10: 4 },
  },
  Druid: {
    hitDie: 8,
    spellcasting: "full",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "WIS",
    preparedFormula: "ability+pb",
    cantripProgression: { 1: 2, 4: 3, 10: 4 },
  },
  Fighter: {
    hitDie: 10,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
  },
  "Eldritch Knight": {
    hitDie: 10,
    spellcasting: "third",
    subclassLevel: 3,
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
    spellcastingAbility: "INT",
    cantripProgression: { 3: 2, 10: 3 },
  },
  Monk: {
    hitDie: 8,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
  },
  Paladin: {
    hitDie: 10,
    spellcasting: "half",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    preparedFormula: "ability+pb",
  },
  Ranger: {
    hitDie: 10,
    spellcasting: "half",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "WIS",
    preparedFormula: "ability+pb",
  },
  Rogue: {
    hitDie: 8,
    spellcasting: "none",
    subclassLevel: 3,
    asiLevels: [4, 8, 10, 12, 16, 19],
  },
  "Arcane Trickster": {
    hitDie: 8,
    spellcasting: "third",
    subclassLevel: 3,
    asiLevels: [4, 8, 10, 12, 16, 19],
    spellcastingAbility: "INT",
    cantripProgression: { 3: 2, 10: 3 },
  },
  Sorcerer: {
    hitDie: 6,
    spellcasting: "full",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    preparedFormula: "ability+pb",
    cantripProgression: { 1: 4, 10: 5 },
  },
  Warlock: {
    hitDie: 8,
    spellcasting: "pact",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "CHA",
    cantripProgression: { 1: 2, 6: 3, 10: 4, 14: 5, 18: 6 },
  },
  Wizard: {
    hitDie: 6,
    spellcasting: "full",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "INT",
    preparedFormula: "ability+pb",
    cantripProgression: { 1: 3, 4: 4, 10: 5 },
  },
  Artificer: {
    hitDie: 8,
    spellcasting: "half",
    subclassLevel: 3,
    asiLevels: [4, 8, 12, 16, 19],
    spellcastingAbility: "INT",
    preparedFormula: "ability+pb",
    cantripProgression: { 1: 2, 10: 3 },
  },
};

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

const PACT_MAGIC_SLOTS: Record<number, { slots: number; slotLevel: number }> = {
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

export const RULES_2024 = {
  proficiencyBonus: PROFICIENCY_BONUS,
  classes: CLASS_RULES_2024,
  multiclassSpellSlots: MULTICLASS_SPELL_SLOTS,
  pactMagicSlots: PACT_MAGIC_SLOTS,
};
