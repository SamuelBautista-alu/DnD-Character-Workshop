import { RULES_2014, RULES_2024 } from "./index";

type Edition = "2014" | "2024";

/**
 * Proficiency bonus by level, using edition tables (defaults to 2014).
 */
export function getProficiencyBonus(
  level: number,
  edition: Edition = "2014"
): number {
  const table =
    edition === "2024"
      ? RULES_2024.proficiencyBonus
      : RULES_2014.proficiencyBonus;
  return table[Math.min(Math.max(level, 1), 20)] ?? Math.ceil(1 + level / 4);
}
