/**
 * D&D 5e Game Data Service
 * Fetches and syncs all game data (classes, backgrounds, feats, spells) from official API
 * with periodic updates and offline fallback to local data
 */

import {
  fetchClasses,
  fetchClassDetails,
  fetchClassSpells,
  fetchSpellDetails,
} from "./dnd5eApi";
import type { DndClass, DndSpell } from "./dnd5eApi";

export interface GameDataStore {
  classes: Map<string, DndClass>;
  spells: Map<string, DndSpell>;
  backgrounds: Map<string, any>;
  feats: Map<string, any>;
  lastUpdated: {
    classes: number;
    spells: number;
    backgrounds: number;
    feats: number;
  };
  isUpdating: boolean;
}

// Global data store
let gameDataStore: GameDataStore = {
  classes: new Map(),
  spells: new Map(),
  backgrounds: new Map(),
  feats: new Map(),
  lastUpdated: {
    classes: 0,
    spells: 0,
    backgrounds: 0,
    feats: 0,
  },
  isUpdating: false,
};

// Update intervals (in milliseconds)
const UPDATE_INTERVALS = {
  classes: 1000 * 60 * 60 * 24, // 24 hours
  spells: 1000 * 60 * 60 * 24, // 24 hours
  backgrounds: 1000 * 60 * 60 * 24, // 24 hours
  feats: 1000 * 60 * 60 * 24, // 24 hours
};

// Listeners for data updates
const listeners = new Set<(store: GameDataStore) => void>();

export function subscribeToGameData(
  callback: (store: GameDataStore) => void
): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach((listener) => listener(gameDataStore));
}

/**
 * Fetch and cache all classes from API
 */
export async function updateClasses(
  forceRefresh: boolean = false
): Promise<void> {
  const now = Date.now();
  if (
    !forceRefresh &&
    now - gameDataStore.lastUpdated.classes < UPDATE_INTERVALS.classes
  ) {
    return; // Skip if recently updated
  }

  try {
    gameDataStore.isUpdating = true;
    const classesResponse = await fetchClasses();

    // Fetch detailed info for each class
    for (const classInfo of classesResponse.results) {
      const details = await fetchClassDetails(classInfo.index);
      gameDataStore.classes.set(classInfo.index, details);
    }

    gameDataStore.lastUpdated.classes = now;
    notifyListeners();
  } catch (error) {
    console.error("Failed to update classes from API:", error);
  } finally {
    gameDataStore.isUpdating = false;
  }
}

/**
 * Fetch and cache all spells from API
 */
export async function updateSpells(
  forceRefresh: boolean = false
): Promise<void> {
  const now = Date.now();
  if (
    !forceRefresh &&
    now - gameDataStore.lastUpdated.spells < UPDATE_INTERVALS.spells
  ) {
    return; // Skip if recently updated
  }

  try {
    gameDataStore.isUpdating = true;

    // Fetch all spells - try to get from a spells endpoint
    const spellsEndpoint = "/spells";
    let allSpells: any[] = [];

    try {
      // Try to fetch all spells at once
      const response = await fetch(
        `https://www.dnd5eapi.co/api${spellsEndpoint}`
      );
      if (response.ok) {
        const data = await response.json();
        allSpells = data.results || [];
      }
    } catch (e) {
      console.warn(
        "Could not fetch all spells list, falling back to per-class fetching"
      );
    }

    // If that didn't work, fetch spells from each class
    if (allSpells.length === 0) {
      const classesResponse = await fetchClasses();
      const spellSet = new Set<string>();

      for (const classInfo of classesResponse.results) {
        try {
          const classSpells = await fetchClassSpells(classInfo.index);
          classSpells.results.forEach((spell) => spellSet.add(spell.index));
        } catch (e) {
          console.warn(`Failed to fetch spells for class ${classInfo.index}`);
        }
      }

      allSpells = Array.from(spellSet).map((index) => ({ index }));
    }

    // Fetch detailed info for each spell
    for (const spell of allSpells) {
      try {
        const details = await fetchSpellDetails(spell.index);
        gameDataStore.spells.set(spell.index, details);
      } catch (e) {
        console.warn(`Failed to fetch spell details for ${spell.index}`);
      }
    }

    gameDataStore.lastUpdated.spells = now;
    notifyListeners();
  } catch (error) {
    console.error("Failed to update spells from API:", error);
  } finally {
    gameDataStore.isUpdating = false;
  }
}

/**
 * Load game data from localStorage for offline access
 */
export function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem("dnd-game-data");
    if (stored) {
      const parsed = JSON.parse(stored);
      gameDataStore.classes = new Map(Object.entries(parsed.classes || {}));
      gameDataStore.spells = new Map(Object.entries(parsed.spells || {}));
      gameDataStore.backgrounds = new Map(
        Object.entries(parsed.backgrounds || {})
      );
      gameDataStore.feats = new Map(Object.entries(parsed.feats || {}));
      gameDataStore.lastUpdated =
        parsed.lastUpdated || gameDataStore.lastUpdated;
    }
  } catch (error) {
    console.warn("Failed to load game data from storage:", error);
  }
}

/**
 * Save game data to localStorage for offline access
 */
export function saveToStorage(): void {
  try {
    const data = {
      classes: Object.fromEntries(gameDataStore.classes),
      spells: Object.fromEntries(gameDataStore.spells),
      backgrounds: Object.fromEntries(gameDataStore.backgrounds),
      feats: Object.fromEntries(gameDataStore.feats),
      lastUpdated: gameDataStore.lastUpdated,
    };
    localStorage.setItem("dnd-game-data", JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save game data to storage:", error);
  }
}

/**
 * Initialize and periodically update all game data
 */
export async function initializeGameData(): Promise<void> {
  // Load from storage first (for offline support)
  loadFromStorage();

  // Then try to update from API
  try {
    await Promise.all([updateClasses(true), updateSpells(true)]);

    // Save to storage for offline access
    saveToStorage();
  } catch (error) {
    console.error("Failed to initialize game data:", error);
  }

  // Set up periodic updates
  setInterval(() => {
    updateClasses().catch(console.error);
  }, UPDATE_INTERVALS.classes);

  setInterval(() => {
    updateSpells().catch(console.error);
  }, UPDATE_INTERVALS.spells);
}

/**
 * Get current game data store
 */
export function getGameDataStore(): GameDataStore {
  return gameDataStore;
}

/**
 * Get a specific class data
 */
export function getClass(classIndex: string): DndClass | undefined {
  return gameDataStore.classes.get(classIndex);
}

/**
 * Get a specific spell data
 */
export function getSpell(spellIndex: string): DndSpell | undefined {
  return gameDataStore.spells.get(spellIndex);
}

/**
 * Get all classes
 */
export function getAllClasses(): DndClass[] {
  return Array.from(gameDataStore.classes.values());
}

/**
 * Get all spells
 */
export function getAllSpells(): DndSpell[] {
  return Array.from(gameDataStore.spells.values());
}

/**
 * Search spells by name
 */
export function searchSpells(query: string): DndSpell[] {
  const lowerQuery = query.toLowerCase();
  return Array.from(gameDataStore.spells.values()).filter((spell) =>
    spell.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get spells by level
 */
export function getSpellsByLevel(level: number): DndSpell[] {
  return Array.from(gameDataStore.spells.values()).filter(
    (spell) => spell.level === level
  );
}

/**
 * Get spells by school
 */
export function getSpellsBySchool(school: string): DndSpell[] {
  return Array.from(gameDataStore.spells.values()).filter(
    (spell) =>
      spell.school.name === school ||
      spell.school.index === school.toLowerCase()
  );
}

/**
 * Get spells available for a class
 */
export function getSpellsForClass(className: string): DndSpell[] {
  const lowerName = className.toLowerCase();
  return Array.from(gameDataStore.spells.values()).filter((spell) =>
    spell.classes.some(
      (cls) => cls.name.toLowerCase() === lowerName || cls.index === lowerName
    )
  );
}
