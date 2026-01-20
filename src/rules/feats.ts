/**
 * Hazañas de D&D 5e (2014/2024)
 * Incluye hazañas de aumento de puntuación de habilidad y hazañas de combate/utilidad
 */

export interface Feat {
  id: string;
  name: string;
  description: string;
  // Tipo: bonificación de habilidad (ej., +2 STR) o hazaña especial
  type: "ability_bonus" | "feat";
  // Para hazañas de bonificación de habilidad: qué habilidad (si corresponde)
  abilityBonus?: {
    ability: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
    bonus: number; // usualmente 2, a veces con +1 para otro
  };
  // Bonificación alternativa (ej., Resiliente da +1 CON más tiradas de salvación)
  alternativeBonus?: {
    ability: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
    bonus: number;
  };
  // Requisitos previos (nivel, puntuaciones de habilidad, etc.)
  prerequisites?: {
    minLevel?: number;
    abilities?: Partial<
      Record<"STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA", number>
    >;
    otherFeats?: string[]; // IDs de hazañas que deben tomarse primero
  };
  // Beneficios de combate
  benefits?: string[];
  // Disponibilidad de edición de D&D: ambas 2014 y 2024 a menos que se especifique
  edition?: "2014" | "2024" | "both";
}

export const FEATS: Record<string, Feat> = {
  // === Hazañas de Aumento de Puntuación de Habilidad ===
  asi_strength: {
    id: "asi_strength",
    name: "Ability Score Increase (+2 STR)",
    description: "Increase your Strength score by 2, to a maximum of 20.",
    type: "ability_bonus",
    abilityBonus: { ability: "STR", bonus: 2 },
    edition: "both",
  },
  asi_dexterity: {
    id: "asi_dexterity",
    name: "Ability Score Increase (+2 DEX)",
    description: "Increase your Dexterity score by 2, to a maximum of 20.",
    type: "ability_bonus",
    abilityBonus: { ability: "DEX", bonus: 2 },
    edition: "both",
  },
  asi_constitution: {
    id: "asi_constitution",
    name: "Ability Score Increase (+2 CON)",
    description: "Increase your Constitution score by 2, to a maximum of 20.",
    type: "ability_bonus",
    abilityBonus: { ability: "CON", bonus: 2 },
    edition: "both",
  },
  asi_intelligence: {
    id: "asi_intelligence",
    name: "Ability Score Increase (+2 INT)",
    description: "Increase your Intelligence score by 2, to a maximum of 20.",
    type: "ability_bonus",
    abilityBonus: { ability: "INT", bonus: 2 },
    edition: "both",
  },
  asi_wisdom: {
    id: "asi_wisdom",
    name: "Ability Score Increase (+2 WIS)",
    description: "Increase your Wisdom score by 2, to a maximum of 20.",
    type: "ability_bonus",
    abilityBonus: { ability: "WIS", bonus: 2 },
    edition: "both",
  },
  asi_charisma: {
    id: "asi_charisma",
    name: "Ability Score Increase (+2 CHA)",
    description: "Increase your Charisma score by 2, to a maximum of 20.",
    type: "ability_bonus",
    abilityBonus: { ability: "CHA", bonus: 2 },
    edition: "both",
  },

  // === Classic Feats ===
  alert: {
    id: "alert",
    name: "Alert",
    description:
      "Always on the lookout for danger, you gain the following benefits: You gain a +5 bonus to initiative. You can't be surprised while you are conscious.",
    type: "feat",
    benefits: ["+5 to initiative", "Cannot be surprised while conscious"],
    edition: "both",
  },
  athlete: {
    id: "athlete",
    name: "Athlete",
    description:
      "You have undergone extensive physical training. You gain the following benefits: You can add half your proficiency bonus to any Strength or Dexterity check you make. You gain proficiency in acrobatics or athletics (your choice).",
    type: "feat",
    benefits: [
      "+1/2 proficiency to STR/DEX checks",
      "Proficiency in Acrobatics or Athletics",
    ],
    edition: "both",
  },
  defensive_duelist: {
    id: "defensive_duelist",
    name: "Defensive Duelist",
    description:
      "When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss.",
    type: "feat",
    prerequisites: { abilities: { DEX: 13 } },
    benefits: [
      "Reaction to add proficiency bonus to AC when hit with melee attack",
    ],
    edition: "both",
  },
  dual_wielder: {
    id: "dual_wielder",
    name: "Dual Wielder",
    description:
      "You master fighting with two weapons. You gain the following benefits: You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren't light. You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.",
    type: "feat",
    benefits: [
      "Two-weapon fighting with any one-handed melee weapons",
      "Draw/stow two one-handed weapons",
    ],
    edition: "both",
  },
  great_weapon_master: {
    id: "great_weapon_master",
    name: "Great Weapon Master",
    description:
      "You've learned to put the weight of a weapon to your advantage. You gain the following benefits: On your turn, when you score a critical hit or reduce a creature to 0 hit points with a melee weapon attack, you can make one melee weapon attack as a bonus action. You can use a bonus action to make a melee attack with a heavy weapon that has the two-handed property.",
    type: "feat",
    prerequisites: { abilities: { STR: 13 } },
    benefits: [
      "Bonus action attack on critical hit or kill",
      "Bonus action attack with heavy two-handed weapon",
    ],
    edition: "both",
  },
  mobile: {
    id: "mobile",
    name: "Mobile",
    description:
      "You are exceptionally speedy and agile. You gain the following benefits: Your speed increases by 10 feet. When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature until the end of your next turn.",
    type: "feat",
    benefits: [
      "+10 feet movement speed",
      "No opportunity attacks after melee attack",
    ],
    edition: "both",
  },
  polearm_master: {
    id: "polearm_master",
    name: "Polearm Master",
    description:
      "You can keep your enemies at bay with reach weapons. You gain the following benefits: When you take the Attack action and attack with only a glaive, halberd, pike, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. You can attack with a polearm twice, instead of once, when you take the Attack action.",
    type: "feat",
    benefits: [
      "Bonus action attack with opposite end of polearm",
      "Extra polearm attack with Attack action",
    ],
    edition: "2014",
  },
  resilient: {
    id: "resilient",
    name: "Resilient",
    description:
      "Choose one ability score. You gain the following benefits: Increase the chosen ability score by 1, to a maximum of 20. You gain proficiency in saving throws using the chosen ability.",
    type: "feat",
    alternativeBonus: { ability: "STR", bonus: 1 }, // placeholder, will be chosen by player
    benefits: ["Proficiency in saves for chosen ability"],
    edition: "both",
  },
  savage_attacker: {
    id: "savage_attacker",
    name: "Savage Attacker",
    description:
      "Once per turn when you roll damage for a weapon attack, you can reroll the damage dice and use either total.",
    type: "feat",
    benefits: ["Reroll weapon damage dice once per turn"],
    edition: "both",
  },
  sentinel: {
    id: "sentinel",
    name: "Sentinel",
    description:
      "You have mastered melee attacks and can quickly intercept unwary foes. You gain the following benefits: When a hostile creature's turn ends, you can use your reaction to make a melee weapon attack against it. You can use your reaction to make a melee weapon attack when a creature within 5 feet of you uses the Dodge action.",
    type: "feat",
    benefits: [
      "Reaction melee attack when enemy turn ends",
      "Reaction melee attack when enemy uses Dodge",
    ],
    edition: "both",
  },
  sharpshooter: {
    id: "sharpshooter",
    name: "Sharpshooter",
    description:
      "You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits: Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half and three-quarters cover.",
    type: "feat",
    prerequisites: { abilities: { DEX: 13 } },
    benefits: [
      "No disadvantage on long range attacks",
      "Ignore half and three-quarters cover",
    ],
    edition: "both",
  },
  war_caster: {
    id: "war_caster",
    name: "War Caster",
    description:
      "You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits: You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands.",
    type: "feat",
    prerequisites: { abilities: { INT: 13 } }, // or WIS 13 or CHA 13, simplified
    benefits: [
      "Advantage on concentration saves",
      "Somatic components with weapons/shield",
    ],
    edition: "both",
  },

  // === Utility Feats ===
  acrobatics_expert: {
    id: "acrobatics_expert",
    name: "Acrobatics Expert",
    description:
      "You are an expert at moving acrobatically. You gain proficiency in Acrobatics, and your proficiency bonus is doubled for Acrobatics checks.",
    type: "feat",
    benefits: ["Proficiency in Acrobatics with double bonus"],
    edition: "both",
  },
  actor: {
    id: "actor",
    name: "Actor",
    description:
      "Skilled at mimicry and dramatics, you gain the following benefits: Increase your Charisma score by 1, to a maximum of 20. You gain proficiency in the Deception and Performance skills. You can mimic the speech of a person you have heard speak for at least 1 minute, but must make a Charisma (Deception) check against a listener's Wisdom (Insight) check.",
    type: "feat",
    alternativeBonus: { ability: "CHA", bonus: 1 },
    benefits: [
      "Proficiency in Deception and Performance",
      "Mimic speech of others",
    ],
    edition: "both",
  },
  magic_initiate: {
    id: "magic_initiate",
    name: "Magic Initiate",
    description:
      "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class's spell list, and you learn one 1st-level spell from that list.",
    type: "feat",
    benefits: ["Two cantrips and one 1st-level spell from chosen class"],
    edition: "both",
  },
  observant: {
    id: "observant",
    name: "Observant",
    description:
      "Quick to notice details of your environment, you gain the following benefits: Increase your Wisdom or Intelligence score by 1, to a maximum of 20. If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips.",
    type: "feat",
    alternativeBonus: { ability: "WIS", bonus: 1 }, // or INT
    benefits: ["Lip reading ability"],
    edition: "both",
  },
  lucky: {
    id: "lucky",
    name: "Lucky",
    description:
      "You are blessed with inexplicable luck. You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you can spend one luck point to roll an additional d20 and choose which of the d20s to use.",
    type: "feat",
    benefits: ["3 luck points per day", "Reroll attacks/checks/saves"],
    edition: "both",
  },
  linguist: {
    id: "linguist",
    name: "Linguist",
    description:
      "You have studied languages and symbols, gaining the following benefits: Increase your Intelligence score by 1, to a maximum of 20. You learn three languages of your choice. You can identify written languages with a 10-minute examination.",
    type: "feat",
    alternativeBonus: { ability: "INT", bonus: 1 },
    benefits: [
      "Three bonus languages",
      "Identify written languages with examination",
    ],
    edition: "both",
  },
  skilled: {
    id: "skilled",
    name: "Skilled",
    description:
      "You gain proficiency in any combination of three skills or tools of your choice.",
    type: "feat",
    benefits: ["Proficiency in three skills or tools"],
    edition: "both",
  },
};

/**
 * Get a feat by ID
 */
export function getFeat(id?: string | null): Feat | undefined {
  if (!id) return undefined;
  return FEATS[id];
}

/**
 * Get all feat IDs
 */
export function getAllFeatIds(): string[] {
  return Object.keys(FEATS);
}

/**
 * Get feats as options for UI dropdowns
 * Can filter by type (ASI feats vs combat feats)
 */
export function getFeatOptions(
  filterType?: "ability_bonus" | "feat" | "all",
): Array<{ id: string; name: string }> {
  const type = filterType || "all";
  return Object.entries(FEATS)
    .filter(([_, feat]) => type === "all" || feat.type === type)
    .map(([id, feat]) => ({
      id,
      name: feat.name,
    }));
}

/**
 * Get feats filtered by category
 */
export function getAsIFeats(): Feat[] {
  return Object.values(FEATS).filter((f) => f.type === "ability_bonus");
}

export function getCombatFeats(): Feat[] {
  return Object.values(FEATS).filter(
    (f) =>
      f.type === "feat" &&
      f.benefits?.some((b) => b.includes("attack") || b.includes("damage")),
  );
}

export function getUtilityFeats(): Feat[] {
  return Object.values(FEATS).filter(
    (f) =>
      f.type === "feat" &&
      !f.benefits?.some((b) => b.includes("attack") || b.includes("damage")),
  );
}
