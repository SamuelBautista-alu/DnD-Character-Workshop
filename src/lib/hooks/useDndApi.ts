import { useState, useEffect } from "react";
import {
  fetchClassSpells,
  fetchSpellDetails,
  fetchClasses,
  type DndSpell,
} from "../dnd5eApi";

export interface Spell {
  name: string;
  level: number;
  prepared: boolean;
  index?: string;
  school?: string;
  castingTime?: string;
  range?: string;
  components?: string[];
  duration?: string;
  concentration?: boolean;
  ritual?: boolean;
  description?: string[];
}

/**
 * Hook to fetch available spells for a character's class from D&D 5e API
 */
export function useClassSpells(className: string, characterLevel: number) {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSpells = async () => {
      if (!className) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Normalize class name to API format
        const classIndex = className.toLowerCase().replace(/\s+/g, "-");

        // Fetch spell list for the class
        const response = await fetchClassSpells(classIndex);

        if (!isMounted) return;

        // Filter spells by character level (only show spells they can cast)
        // Calculate max spell level based on character level
        const maxSpellLevel = Math.min(9, Math.ceil(characterLevel / 2));
        const availableSpells = response.results.filter(
          (spell: { level: number }) => spell.level <= maxSpellLevel
        );

        // Convert to our Spell format
        const formattedSpells: Spell[] = availableSpells.map(
          (spell: { name: string; level: number; index: string }) => ({
            name: spell.name,
            level: spell.level,
            prepared: false,
            index: spell.index,
          })
        );

        setSpells(formattedSpells);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching class spells:", err);
        setError("Failed to fetch spells from D&D 5e API");
        // Set empty array as fallback
        setSpells([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSpells();

    return () => {
      isMounted = false;
    };
  }, [className, characterLevel]);

  return { spells, isLoading, error };
}

/**
 * Hook to fetch detailed spell information
 */
export function useSpellDetails(spellIndex: string | undefined) {
  const [spellDetails, setSpellDetails] = useState<DndSpell | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spellIndex) {
      setSpellDetails(null);
      return;
    }

    let isMounted = true;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const details = await fetchSpellDetails(spellIndex);
        if (isMounted) {
          setSpellDetails(details);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching spell details:", err);
        setError("Failed to fetch spell details");
        setSpellDetails(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [spellIndex]);

  return { spellDetails, isLoading, error };
}

/**
 * Hook to fetch all available classes from D&D 5e API
 */
export function useDndClasses() {
  const [classes, setClasses] = useState<
    Array<{ index: string; name: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDndClasses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchClasses();

        if (isMounted) {
          setClasses(response.results);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching D&D classes:", err);
        setError("Failed to fetch classes from D&D 5e API");
        // Fallback to basic class list
        setClasses([
          { index: "barbarian", name: "Barbarian" },
          { index: "bard", name: "Bard" },
          { index: "cleric", name: "Cleric" },
          { index: "druid", name: "Druid" },
          { index: "fighter", name: "Fighter" },
          { index: "monk", name: "Monk" },
          { index: "paladin", name: "Paladin" },
          { index: "ranger", name: "Ranger" },
          { index: "rogue", name: "Rogue" },
          { index: "sorcerer", name: "Sorcerer" },
          { index: "warlock", name: "Warlock" },
          { index: "wizard", name: "Wizard" },
        ]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDndClasses();

    return () => {
      isMounted = false;
    };
  }, []);

  return { classes, isLoading, error };
}
