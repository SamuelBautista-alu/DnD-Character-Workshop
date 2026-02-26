/**
 * Spell utility functions for filtering, searching, and retrieving spells
 */

import { Spell, SpellSchool, SpellClass } from "./types";
import { SPELLS } from "./database";

/**
 * Get a spell by ID
 */
export function getSpell(id?: string | null): Spell | undefined {
  if (!id) return undefined;
  return SPELLS[id];
}

/**
 * Get all spells as array
 */
export function getAllSpells(): Spell[] {
  return Object.values(SPELLS);
}

/**
 * Filter spells by level
 */
export function getSpellsByLevel(level: number): Spell[] {
  return getAllSpells().filter((spell) => spell.level === level);
}

/**
 * Filter spells by school
 */
export function getSpellsBySchool(school: SpellSchool): Spell[] {
  return getAllSpells().filter((spell) => spell.school === school);
}

/**
 * Filter spells by class
 */
export function getSpellsByClass(className: SpellClass): Spell[] {
  return getAllSpells().filter((spell) => spell.classes.includes(className));
}

/**
 * Search spells by name (case-insensitive)
 */
export function searchSpells(query: string): Spell[] {
  const lowerQuery = query.toLowerCase();
  return getAllSpells().filter((spell) =>
    spell.name.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Filter spells with multiple criteria
 */
export function filterSpells(filters: {
  level?: number;
  school?: SpellSchool;
  class?: SpellClass;
  searchQuery?: string;
}): Spell[] {
  let results = getAllSpells();

  if (filters.level !== undefined) {
    results = results.filter((spell) => spell.level === filters.level);
  }

  if (filters.school) {
    results = results.filter((spell) => spell.school === filters.school);
  }

  if (filters.class) {
    results = results.filter((spell) => spell.classes.includes(filters.class!));
  }

  if (filters.searchQuery) {
    const lowerQuery = filters.searchQuery.toLowerCase();
    results = results.filter((spell) =>
      spell.name.toLowerCase().includes(lowerQuery),
    );
  }

  return results;
}

/**
 * Get spells available to multiple classes
 */
export function getCommonSpells(...classes: SpellClass[]): Spell[] {
  if (classes.length === 0) return [];
  return getAllSpells().filter((spell) =>
    classes.every((cls) => spell.classes.includes(cls)),
  );
}

/**
 * Get spells by level range
 */
export function getSpellsByLevelRange(
  minLevel: number,
  maxLevel: number,
): Spell[] {
  return getAllSpells().filter(
    (spell) => spell.level >= minLevel && spell.level <= maxLevel,
  );
}

/**
 * Check if a spell requires concentration
 */
export function requiresConcentration(spellId: string): boolean {
  const spell = getSpell(spellId);
  return spell?.concentration ?? false;
}

/**
 * Check if a spell can be cast as a ritual
 */
export function canCastAsRitual(spellId: string): boolean {
  const spell = getSpell(spellId);
  return spell?.ritual ?? false;
}

/**
 * Get spell schools unique values
 */
export function getSpellSchools(): SpellSchool[] {
  const schools = new Set(getAllSpells().map((spell) => spell.school));
  return Array.from(schools) as SpellSchool[];
}

/**
 * Get spell classes unique values
 */
export function getSpellClasses(): SpellClass[] {
  const classes = new Set<SpellClass>();
  getAllSpells().forEach((spell) => {
    spell.classes.forEach((cls) => classes.add(cls));
  });
  return Array.from(classes);
}
