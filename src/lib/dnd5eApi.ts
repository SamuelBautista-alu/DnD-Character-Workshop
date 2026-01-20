const DND_API_BASE = "https://www.dnd5eapi.co/api";

export interface DndClass {
  index: string;
  name: string;
  hit_die: number;
  spellcasting?: {
    level: number;
    spellcasting_ability: {
      index: string;
      name: string;
    };
    info: Array<{
      name: string;
      desc: string[];
    }>;
  };
}

export interface DndSpell {
  index: string;
  name: string;
  level: number;
  desc: string[];
  higher_level?: string[];
  range: string;
  components: string[];
  material?: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  school: {
    index: string;
    name: string;
  };
  classes: Array<{
    index: string;
    name: string;
  }>;
  subclasses: Array<{
    index: string;
    name: string;
  }>;
}

export interface DndSubclass {
  index: string;
  name: string;
  class: {
    index: string;
    name: string;
  };
  spells?: Array<{
    prerequisites: Array<{
      index: string;
      type: string;
      name: string;
    }>;
    spell: {
      index: string;
      name: string;
    };
  }>;
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function fetchWithCache<T>(endpoint: string): Promise<T> {
  const cacheKey = endpoint;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const response = await fetch(`${DND_API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`D&D API error: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

/**
 * Fetch all available classes
 */
export async function fetchClasses(): Promise<{
  count: number;
  results: Array<{ index: string; name: string; url: string }>;
}> {
  return fetchWithCache("/classes");
}

/**
 * Fetch detailed information about a specific class
 */
export async function fetchClassDetails(classIndex: string): Promise<DndClass> {
  return fetchWithCache(`/classes/${classIndex.toLowerCase()}`);
}

/**
 * Fetch spells for a specific class
 */
export async function fetchClassSpells(
  classIndex: string
): Promise<{
  count: number;
  results: Array<{ index: string; name: string; level: number; url: string }>;
}> {
  return fetchWithCache(`/classes/${classIndex.toLowerCase()}/spells`);
}

/**
 * Fetch detailed information about a specific spell
 */
export async function fetchSpellDetails(spellIndex: string): Promise<DndSpell> {
  return fetchWithCache(`/spells/${spellIndex.toLowerCase()}`);
}

/**
 * Fetch all spells (with optional filtering)
 */
export async function fetchSpells(
  level?: number
): Promise<{
  count: number;
  results: Array<{ index: string; name: string; url: string }>;
}> {
  const endpoint = level !== undefined ? `/spells?level=${level}` : "/spells";
  return fetchWithCache(endpoint);
}

/**
 * Fetch subclass details
 */
export async function fetchSubclassDetails(
  subclassIndex: string
): Promise<DndSubclass> {
  return fetchWithCache(`/subclasses/${subclassIndex.toLowerCase()}`);
}

/**
 * Determine if a class is a spellcaster and what type
 */
export async function getClassCasterType(
  className: string
): Promise<"full" | "half" | "quarter" | "none"> {
  try {
    // Normalize class name to index format (lowercase, hyphenated)
    const classIndex = className.toLowerCase().replace(/\s+/g, "-");
    const classData = await fetchClassDetails(classIndex);

    if (!classData.spellcasting) {
      return "none";
    }

    // Check spellcasting progression
    // Full casters start at level 1, half casters at level 2
    const spellcastingLevel = classData.spellcasting.level;

    // Full casters (Bard, Cleric, Druid, Sorcerer, Wizard)
    if (spellcastingLevel === 1) {
      return "full";
    }

    // Half casters (Paladin, Ranger, Artificer)
    if (spellcastingLevel === 2) {
      return "half";
    }

    // For subclasses like Eldritch Knight and Arcane Trickster
    // These typically start at level 3
    if (spellcastingLevel === 3) {
      return "quarter";
    }

    return "none";
  } catch (error) {
    console.error(`Failed to fetch class data for ${className}:`, error);
    // Fallback to hardcoded values
    const fallbackMap: Record<string, "full" | "half" | "quarter" | "none"> = {
      bard: "full",
      cleric: "full",
      druid: "full",
      sorcerer: "full",
      wizard: "full",
      paladin: "half",
      ranger: "half",
      artificer: "half",
      "eldritch-knight": "quarter",
      "arcane-trickster": "quarter",
      barbarian: "none",
      fighter: "none",
      monk: "none",
      rogue: "none",
    };
    return fallbackMap[className.toLowerCase().replace(/\s+/g, "-")] || "none";
  }
}

/**
 * Clear the API cache (useful for testing or when data needs to be refreshed)
 */
export function clearCache(): void {
  cache.clear();
}
