import { AbilityScores } from "@/features/characters/types";

/**
 * Calculates the modifier for a given ability score
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Returns all ability modifiers
 */
export function getAbilityModifiers(
  scores: AbilityScores
): Record<keyof AbilityScores, number> {
  return Object.fromEntries(
    Object.entries(scores).map(([key, value]) => [
      key,
      getAbilityModifier(value),
    ])
  ) as Record<keyof AbilityScores, number>;
}

export type { AbilityScores };
