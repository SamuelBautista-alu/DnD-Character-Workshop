import { getClassCasterType } from "../lib/dnd5eApi";

export type SpellcastingType = "full" | "half" | "third" | "pact" | "none";

export type CasterType = SpellcastingType | "quarter";

// Mapa de fallback para clases (usado cuando la API no está disponible)
const CLASS_CASTER_TYPE_FALLBACK: Record<string, CasterType> = {
  // Lanzadores completos (hechizos de nivel 9)
  Bard: "full",
  Cleric: "full",
  Druid: "full",
  Sorcerer: "full",
  Wizard: "full",

  // Lanzadores medios (hechizos de nivel 5)
  Paladin: "half",
  Ranger: "half",
  Artificer: "half",

  // Lanzadores de un tercio (EK/AT)
  "Eldritch Knight": "third",
  "Arcane Trickster": "third",

  // Magia de pacto
  Warlock: "pact",

  // Sin lanzamiento de hechizos
  Barbarian: "none",
  Fighter: "none",
  Monk: "none",
  Rogue: "none",
};

// Cache para resultados de tipo de lanzador de la API
const casterTypeCache = new Map<
  string,
  { type: CasterType; timestamp: number }
>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

// Tabla de espacios de hechizo multiclase (nivel de lanzador efectivo -> espacios)
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

// Magia de pacto (Brujo)
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

export interface SpellSlotInfo {
  level: number;
  maximum: number;
  locked: boolean;
  slotLevel?: number; // para representación de magia de pacto
}

/**
 * Obtener tipo de lanzador para una clase dada (con integración de API)
 */
export async function getCasterType(className: string): Promise<CasterType> {
  // Verificar caché primero
  const cacheKey = className.toLowerCase();
  const cached = casterTypeCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.type;
  }

  try {
    // Intentar obtener desde API
    const raw = await getClassCasterType(className);
    const type = raw === "quarter" ? "third" : raw;
    casterTypeCache.set(cacheKey, { type, timestamp: Date.now() });
    return type;
  } catch (error) {
    console.warn(
      `Failed to fetch caster type from API for ${className}, using fallback`,
      error,
    );
    // Caer a mapa hardcodeado
    return CLASS_CASTER_TYPE_FALLBACK[className] || "none";
  }
}

/**
 * Obtener tipo de lanzador de forma síncrona (solo usa fallback)
 * Usar esto cuando necesites acceso inmediato sin async
 */
export function getCasterTypeSync(className: string): CasterType {
  const raw = CLASS_CASTER_TYPE_FALLBACK[className] || "none";
  return raw === "quarter" ? "third" : raw;
}

/**
 * Calculate spell slots for a character (synchronous version using fallback)
 */
export function calculateSpellSlots(
  characterLevel: number,
  className: string,
): SpellSlotInfo[] {
  const casterType = getCasterTypeSync(className);

  if (casterType === "none") {
    return [];
  }

  if (casterType === "pact") {
    const pact = PACT_MAGIC_SLOTS[Math.min(characterLevel, 20)];
    if (!pact) return [];
    return [
      {
        level: 1,
        maximum: pact.slots,
        locked: false,
        slotLevel: pact.slotLevel,
      },
    ];
  }

  const effectiveLevel = getCasterLevel([
    { level: characterLevel, spellcasting: casterType as SpellcastingType },
  ]);
  const availableSlots =
    MULTICLASS_SPELL_SLOTS[Math.min(effectiveLevel, 20)] || [];

  const slots: SpellSlotInfo[] = [];
  for (let spellLevel = 1; spellLevel <= availableSlots.length; spellLevel++) {
    const maximum = availableSlots[spellLevel - 1] || 0;
    slots.push({
      level: spellLevel,
      maximum,
      locked: maximum === 0,
    });
  }

  return slots;
}

/**
 * Calculate spell slots for a character (async version using API)
 */
export async function calculateSpellSlotsAsync(
  characterLevel: number,
  className: string,
): Promise<SpellSlotInfo[]> {
  const casterType = await getCasterType(className);

  if (casterType === "none") {
    return [];
  }

  if (casterType === "pact") {
    const pact = PACT_MAGIC_SLOTS[Math.min(characterLevel, 20)];
    if (!pact) return [];
    return [
      {
        level: 1,
        maximum: pact.slots,
        locked: false,
        slotLevel: pact.slotLevel,
      },
    ];
  }

  const effectiveLevel = getCasterLevel([
    { level: characterLevel, spellcasting: casterType as SpellcastingType },
  ]);
  const availableSlots =
    MULTICLASS_SPELL_SLOTS[Math.min(effectiveLevel, 20)] || [];

  const slots: SpellSlotInfo[] = [];
  for (let spellLevel = 1; spellLevel <= availableSlots.length; spellLevel++) {
    const maximum = availableSlots[spellLevel - 1] || 0;
    slots.push({
      level: spellLevel,
      maximum,
      locked: maximum === 0,
    });
  }

  return slots;
}

/**
 * Check if a character can cast spells (synchronous)
 */
export function canCastSpells(className: string): boolean {
  return getCasterTypeSync(className) !== "none";
}

/**
 * Check if a character can cast spells (async with API)
 */
export async function canCastSpellsAsync(className: string): Promise<boolean> {
  const type = await getCasterType(className);
  return type !== "none";
}

/**
 * Calculates effective caster level
 */
function getCasterLevel(
  classes: { level: number; spellcasting?: SpellcastingType }[],
): number {
  return classes.reduce((total, cls) => {
    if (cls.spellcasting === "full") return total + cls.level;
    if (cls.spellcasting === "half") return total + Math.floor(cls.level / 2);
    if (cls.spellcasting === "third") return total + Math.floor(cls.level / 3);
    return total;
  }, 0);
}

/**
 * Returns spell slots by level
 */
export function getSpellSlots(
  classes: {
    level: number;
    spellcasting?: SpellcastingType;
    className?: string;
  }[],
): number[] {
  const normalized = classes.map((cls) => {
    const spellcasting =
      cls.spellcasting ?? getCasterTypeSync(cls.className || "");
    const normalizedType = spellcasting === "quarter" ? "third" : spellcasting;
    return { ...cls, spellcasting: normalizedType };
  });

  const casterLevel = getCasterLevel(normalized);
  return MULTICLASS_SPELL_SLOTS[Math.min(casterLevel, 20)] || [];
}

export function getPactMagicSlots(level: number) {
  return PACT_MAGIC_SLOTS[Math.min(level, 20)];
}
