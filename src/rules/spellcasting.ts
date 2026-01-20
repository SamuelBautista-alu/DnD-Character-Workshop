/**
 * Cálculos de Detalles de Lanzamiento de Hechizos de D&D 5e
 * CD, bonificación de ataque, conteos de hechizos preparados, trucos
 */

import { RULES_2014 } from "./editions/rules2014";
import { RULES_2024 } from "./editions/rules2024";
import { AbilityScores } from "@/features/characters/types";

export interface SpellcastingDetails {
  spellcastingAbility: keyof AbilityScores | null; // STR, DEX, CON, INT, WIS, CHA, o null si no es lanzador
  spellSaveDC: number | null; // 8 + bonificación de pericia + modificador de habilidad
  spellAttackModifier: number | null; // bonificación de pericia + modificador de habilidad
  preparedSpellCount: number; // Cantidad de hechizos que el lanzador puede preparar
  cantripsKnown: number; // Cantidad de trucos conocidos
}

/**
 * Calcular detalles de lanzamiento de hechizos para las clases de un personaje
 * @param classes Array de { classId, level }
 * @param abilities Puntuaciones de habilidades del personaje
 * @param proficiencyBonus Bonificación de pericia del nivel
 * @param edition Edición de D&D (2014 o 2024)
 */
export function calculateSpellcastingDetails(
  classes: Array<{ classId: string; level: number }>,
  abilities: AbilityScores,
  proficiencyBonus: number,
  edition: "2014" | "2024" = "2014",
): SpellcastingDetails {
  const rules = edition === "2024" ? RULES_2024 : RULES_2014;

  // Encontrar habilidad de lanzamiento de la clase lanzadora principal
  let spellcastingAbility: keyof AbilityScores | null = null;
  let preparedSpellCount = 0;
  let cantripsKnown = 0;

  for (const cls of classes) {
    const classRule = rules.classes[cls.classId];
    if (!classRule) continue;

    // Solo obtener detalles de lanzamiento de una clase (usualmente la clase principal)
    if (spellcastingAbility === null && classRule.spellcastingAbility) {
      spellcastingAbility = classRule.spellcastingAbility;

      // Calcular conteo de hechizos preparados basado en edición
      if (classRule.preparedFormula && spellcastingAbility) {
        const abilityMod = getAbilityModifier(abilities[spellcastingAbility]);
        if (classRule.preparedFormula === "ability+level") {
          // Fórmula 2014: modificador de habilidad + nivel de hechizo (nivel de clase actúa como nivel de hechizo)
          preparedSpellCount = Math.max(1, abilityMod + cls.level);
        } else if (classRule.preparedFormula === "ability+pb") {
          // Fórmula 2024: modificador de habilidad + bonificación de pericia
          preparedSpellCount = Math.max(1, abilityMod + proficiencyBonus);
        }
      }

      // Trucos: típicamente 2-4 dependiendo de la clase y nivel
      if (classRule.cantripProgression) {
        cantripsKnown = classRule.cantripProgression[cls.level] || 0;
      } else {
        // Por defecto: la mayoría de clases comienzan con 2-3 trucos
        cantripsKnown = cls.level >= 4 ? 3 : 2;
      }

      break; // Usar primera clase lanzadora encontrada
    }
  }

  // Computar CD y bonificación de ataque si hay una habilidad de lanzamiento
  const abilityModifier = spellcastingAbility
    ? getAbilityModifier(abilities[spellcastingAbility])
    : 0;
  const spellSaveDC = spellcastingAbility
    ? 8 + proficiencyBonus + abilityModifier
    : null;
  const spellAttackModifier = spellcastingAbility
    ? proficiencyBonus + abilityModifier
    : null;

  return {
    spellcastingAbility,
    spellSaveDC,
    spellAttackModifier,
    preparedSpellCount,
    cantripsKnown,
  };
}

/**
 * Get ability modifier from ability score
 */
function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export { getAbilityModifier };
