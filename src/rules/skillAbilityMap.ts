import type { Skill } from "./editions/rules2014";
import type { Ability } from "@/features/characters/types";

/**
 * Maps each D&D 5e skill to its governing ability score
 */
export const SKILL_ABILITY_MAP: Record<Skill, Ability> = {
  Acrobatics: "DEX",
  "Animal Handling": "WIS",
  Arcana: "INT",
  Athletics: "STR",
  Deception: "CHA",
  History: "INT",
  Insight: "WIS",
  Intimidation: "CHA",
  Investigation: "INT",
  Medicine: "WIS",
  Nature: "INT",
  Perception: "WIS",
  Performance: "CHA",
  Persuasion: "CHA",
  Religion: "INT",
  "Sleight of Hand": "DEX",
  Stealth: "DEX",
  Survival: "WIS",
};

/**
 * Calculate ability modifier from ability score
 */
export function getAbilityModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Calculate skill modifier (ability mod + proficiency bonus)
 */
export function getSkillModifier(
  skill: Skill,
  abilityScores: Record<Lowercase<Ability>, number>,
  proficiencyBonus: number,
  isProficient: boolean,
  hasExpertise: boolean = false
): number {
  const ability = SKILL_ABILITY_MAP[skill];
  const abilityKey = ability.toLowerCase() as Lowercase<Ability>;
  const abilityScore = abilityScores[abilityKey];
  const abilityMod = getAbilityModifier(abilityScore);

  if (!isProficient) {
    return abilityMod;
  }

  const profBonus = hasExpertise ? proficiencyBonus * 2 : proficiencyBonus;
  return abilityMod + profBonus;
}

/**
 * Calculate saving throw modifier (ability mod + proficiency bonus if proficient)
 */
export function getSaveModifier(
  ability: Ability,
  abilityScore: number,
  proficiencyBonus: number,
  isProficient: boolean
): number {
  const abilityMod = getAbilityModifier(abilityScore);
  return isProficient ? abilityMod + proficiencyBonus : abilityMod;
}

/**
 * Format modifier as "+X" or "-X" for display
 */
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}
