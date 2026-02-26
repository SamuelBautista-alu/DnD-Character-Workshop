/**
 * D&D 5e Spells Module - Barrel export
 * Provides centralized access to spell types, database, and utilities
 */

export { type Spell, type SpellSchool, type SpellClass } from "./types";
export { SPELLS } from "./database";
export {
  getSpell,
  getAllSpells,
  getSpellsByLevel,
  getSpellsBySchool,
  getSpellsByClass,
  searchSpells,
  filterSpells,
  getCommonSpells,
  getSpellsByLevelRange,
  requiresConcentration,
  canCastAsRitual,
  getSpellSchools,
  getSpellClasses,
} from "./utils";
