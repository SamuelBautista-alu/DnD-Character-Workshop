/**
 * React Hook for Game Data Service
 * Provides reactive access to game data with automatic updates
 */

import { useEffect, useState, useCallback } from "react";
import {
  initializeGameData,
  getGameDataStore,
  subscribeToGameData,
  updateClasses,
  updateSpells,
  getClass,
  getSpell,
  getAllClasses,
  getAllSpells,
  searchSpells,
  getSpellsByLevel,
  getSpellsBySchool,
  getSpellsForClass,
  type GameDataStore,
} from "../gameDataService";

// Track if we've already initialized
let isInitialized = false;

/**
 * Hook to use game data store with automatic updates
 */
export function useGameData() {
  const [gameData, setGameData] = useState<GameDataStore>(getGameDataStore());
  const [isLoading, setIsLoading] = useState(!isInitialized);

  useEffect(() => {
    // Initialize game data on first use
    if (!isInitialized) {
      isInitialized = true;
      initializeGameData().finally(() => setIsLoading(false));
    }

    // Subscribe to data updates
    const unsubscribe = subscribeToGameData((store) => {
      setGameData(store);
    });

    return unsubscribe;
  }, []);

  // Utility functions
  const getClassData = useCallback(
    (classIndex: string) => getClass(classIndex),
    []
  );
  const getSpellData = useCallback(
    (spellIndex: string) => getSpell(spellIndex),
    []
  );
  const forceUpdateClasses = useCallback(() => updateClasses(true), []);
  const forceUpdateSpells = useCallback(() => updateSpells(true), []);

  return {
    gameData,
    isLoading,
    // Direct access functions
    getClass: getClassData,
    getSpell: getSpellData,
    getAllClasses,
    getAllSpells,
    searchSpells,
    getSpellsByLevel,
    getSpellsBySchool,
    getSpellsForClass,
    // Force update functions
    forceUpdateClasses,
    forceUpdateSpells,
  };
}

/**
 * Hook to watch a specific class
 */
export function useClassData(classIndex: string | undefined) {
  const { getClass: getClassData, isLoading } = useGameData();
  const [classData, setClassData] = useState(() =>
    classIndex ? getClassData(classIndex) : undefined
  );

  useEffect(() => {
    if (classIndex) {
      setClassData(getClassData(classIndex));
    }
  }, [classIndex, getClassData]);

  return { classData, isLoading };
}

/**
 * Hook to watch a specific spell
 */
export function useSpellData(spellIndex: string | undefined) {
  const { getSpell: getSpellData, isLoading } = useGameData();
  const [spellData, setSpellData] = useState(() =>
    spellIndex ? getSpellData(spellIndex) : undefined
  );

  useEffect(() => {
    if (spellIndex) {
      setSpellData(getSpellData(spellIndex));
    }
  }, [spellIndex, getSpellData]);

  return { spellData, isLoading };
}

/**
 * Hook to search spells
 */
export function useSpellSearch(query: string, className?: string) {
  const { isLoading } = useGameData();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Get matching spells
    let matches = searchSpells(query);

    // Filter by class if specified
    if (className) {
      const classSpells = getSpellsForClass(className);
      const classSpellIndices = new Set(classSpells.map((s) => s.index));
      matches = matches.filter((spell) => classSpellIndices.has(spell.index));
    }

    setResults(matches);
  }, [query, className]);

  return { results, isLoading };
}

/**
 * Hook to get spells by class
 */
export function useClassSpells(className: string | undefined) {
  const { isLoading } = useGameData();
  const [spells, setSpells] = useState<any[]>([]);

  useEffect(() => {
    if (className) {
      setSpells(getSpellsForClass(className));
    } else {
      setSpells([]);
    }
  }, [className]);

  return { spells, isLoading };
}
