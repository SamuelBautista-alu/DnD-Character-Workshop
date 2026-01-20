import { create } from "zustand";
import axios from "axios";
import { getProficiencyBonus } from "@/rules/proficiency";
import { calculateMaxHPForClasses } from "@/rules/hitPoints";
import {
  getSpellSlots,
  getPactMagicSlots,
  getCasterTypeSync,
} from "@/rules/spellSlots";
import { calculateSpellcastingDetails } from "@/rules/spellcasting";
import { getAbilityModifier } from "@/rules/abilities";
import { RULES_2014, RULES_2024 } from "@/rules";
import { getBackground } from "@/rules/backgrounds";
import { CharacterSheet, LevelProgression, Ability } from "./types";
import type { Skill } from "@/rules/editions/rules2014";

/**
 * Store de Personajes
 * Gestiona el estado global de los personajes, cálculos de reglas y comunicación con API
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

/**
 * Ayudante: Construye el array de clases desde classProgression
 * Agrupa niveles por classId y rastrea el nivel más alto en cada clase
 */
function buildClassesFromProgression(
  classProgression?: LevelProgression[],
): { classId: string; level: number }[] {
  if (!classProgression || classProgression.length === 0) {
    return [];
  }

  const classMap = new Map<string, number>();
  classProgression.forEach((prog) => {
    const current = classMap.get(prog.classId) || 0;
    classMap.set(prog.classId, Math.max(current, prog.level));
  });

  return Array.from(classMap.entries()).map(([classId, level]) => ({
    classId,
    level,
  }));
}

export interface InventoryItem {
  id?: string;
  name: string;
  quantity: number;
  weight?: number;
  equipped?: boolean;
  notes?: string;
}

export interface Spell {
  name: string;
  level: number;
  prepared?: boolean;
}

export interface Character {
  id?: number;
  name: string;
  class?: string;
  classes?: {
    name: string;
    levels: number;
    index?: string;
    subclass?: string;
    subclassIndex?: string;
  }[];
  race: string;
  level: number;
  experience: number;
  hitPoints: number;
  maxHitPoints: number;
  armorClass: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  alignment: string;
  notes?: string;
  edition?: "2014" | "2024";
  backgroundId?: string | null;
  background?: string | null;
  proficientSkills?: string[]; // ej., ["Acrobatics", "Animal Handling"]
  expertiseSkills?: string[]; // ej., ["Deception", "Insight"] - pericia doble
  proficientSavingThrows?: string[]; // ej., ["STR", "DEX"]
  inventory?: InventoryItem[]; // Objetos del inventario del personaje
  current_weight?: number; // Peso actual que se lleva en libras
  spells?: Spell[]; // Hechizos conocidos/preparados
  spellSlots?: Record<string, unknown> | null; // Estructura de espacios desde el backend
  spellSaveDC?: number;
  spellAttackBonus?: number;
}

type CharacterStore = {
  character: CharacterSheet;
  characters: Character[];
  currentCharacter: Character | null;
  isLoading: boolean;
  error: string | null;

  // Acciones locales
  setField: <K extends keyof CharacterSheet>(
    field: K,
    value: CharacterSheet[K],
  ) => void;
  recalculateDerived: () => void;

  // Acciones de API
  fetchCharacters: (token: string) => Promise<void>;
  fetchCharacter: (id: number, token: string) => Promise<void>;
  createCharacter: (data: Character, token: string) => Promise<Character>;
  updateCharacter: (
    id: number,
    data: Partial<Character>,
    token: string,
  ) => Promise<void>;
  deleteCharacter: (id: number, token: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
};

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  character: {
    name: "",
    race: null,
    classes: [],
    classProgression: [],
    level: 1,
    edition: "2014",
    backgroundId: null,
    abilities: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    },
    selectedSkills: [],
    expertiseSkills: [],
    derived: {
      proficiencyBonus: 2,
      maxHP: 0,
      spellSlots: [],
      pactMagicSlots: null,
      savingThrows: [],
      skills: [],
      expertiseSkills: [],
    },
  },

  characters: [],
  currentCharacter: null,
  isLoading: false,
  error: null,

  setField: (field, value) => {
    set((state) => ({
      character: { ...state.character, [field]: value },
    }));
    get().recalculateDerived();
  },

  recalculateDerived: () => {
    const { character } = get();

    const edition = character.edition === "2024" ? "2024" : "2014";
    const rules = edition === "2024" ? RULES_2024 : RULES_2014;

    // Usar classProgression si está disponible, de lo contrario caer a array de clases
    let effectiveClasses = character.classes || [];
    if (character.classProgression && character.classProgression.length > 0) {
      effectiveClasses = buildClassesFromProgression(
        character.classProgression,
      );
    }

    // Normalizar clases con tipo de dado de golpe y lanzamiento de hechizos derivados de las reglas
    const normalizedClasses = effectiveClasses.map((cls) => {
      const rule = rules.classes[cls.classId];
      const hitDie = rule?.hitDie ?? 8;
      const spellcasting = rule?.spellcasting ?? getCasterTypeSync(cls.classId);
      return { ...cls, hitDie, spellcasting };
    });

    const totalLevel = Math.max(
      character.level ||
        normalizedClasses.reduce((sum, c) => sum + c.level, 0) ||
        1,
      1,
    );

    const proficiencyBonus = getProficiencyBonus(totalLevel, edition);

    const conMod = getAbilityModifier(character.abilities.CON);
    const maxHP = calculateMaxHPForClasses(
      normalizedClasses.map((c) => ({ hitDie: c.hitDie ?? 8, level: c.level })),
      conMod,
    );

    const spellSlots = getSpellSlots(
      normalizedClasses.map((c) => ({
        level: c.level,
        spellcasting: c.spellcasting,
        className: c.classId,
      })),
    );

    const pactClass = normalizedClasses.find((c) => c.spellcasting === "pact");
    const pactMagicSlots = pactClass
      ? getPactMagicSlots(Math.min(Math.max(pactClass.level, 1), 20)) || null
      : null;

    // Calcular detalles de lanzamiento de hechizos (CD, bonificación de ataque, hechizos preparados, trucos)
    const spellcasting = calculateSpellcastingDetails(
      normalizedClasses.map((c) => ({ classId: c.classId, level: c.level })),
      character.abilities,
      proficiencyBonus,
      edition,
    );

    // Calcular habilidades y tiradas de salvación desde clases + trasfondo
    const savingThrows: Ability[] = [];
    const skills: Skill[] = [];
    const expertiseSkills: Skill[] = [...(character.expertiseSkills || [])];

    // Obtener tiradas de salvación desde la clase principal (primera clase)
    if (normalizedClasses.length > 0) {
      const primaryClass = rules.classes[normalizedClasses[0].classId];
      if (primaryClass && "savingThrows" in primaryClass) {
        savingThrows.push(...(primaryClass as any).savingThrows);
      }
    }

    // Obtener habilidades desde habilidades de clase seleccionadas por el usuario
    if (character.selectedSkills && character.selectedSkills.length > 0) {
      skills.push(...character.selectedSkills);
    }

    // Obtener habilidades desde trasfondo
    if (character.backgroundId) {
      const background = getBackground(character.backgroundId);
      if (background?.skillChoices?.options) {
        // Agregar habilidades del trasfondo (evitar duplicados)
        const backgroundSkills = background.skillChoices.options.slice(
          0,
          background.skillChoices.count,
        ) as Skill[];
        backgroundSkills.forEach((skill) => {
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        });
      }
    }

    set((state) => ({
      character: {
        ...state.character,
        derived: {
          proficiencyBonus,
          maxHP,
          spellSlots,
          pactMagicSlots,
          spellcasting,
          savingThrows,
          skills,
          expertiseSkills,
        },
      },
    }));
  },

  // API Methods
  fetchCharacters: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/characters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ characters: response.data.data, isLoading: false });
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch characters";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  fetchCharacter: async (id: number, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/characters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data as any;
      const normalizedBackgroundId = (() => {
        const bg = (data as any).background;
        const bgId = (data as any).backgroundId;
        if (bg && typeof bg === "object") {
          return bg.id || bg.index || bg.name || null;
        }
        if (typeof bg === "string") return bg;
        return bgId ?? null;
      })();
      // Normalize spells from backend object form {level: Spell[]} to UI array
      let normalizedSpells: Spell[] | undefined = undefined;
      if (Array.isArray(data?.spells)) {
        normalizedSpells = data.spells as Spell[];
      } else if (data?.spells && typeof data.spells === "object") {
        normalizedSpells = Object.entries<any>(data.spells).flatMap(
          ([lvl, arr]) =>
            Array.isArray(arr)
              ? arr.map((s: any) => ({
                  name: s?.name || s?.index || "Unknown Spell",
                  level: Number(lvl) || s?.level || 0,
                  prepared: !!s?.prepared,
                }))
              : [],
        );
      }

      set({
        currentCharacter: normalizedSpells
          ? {
              ...data,
              spells: normalizedSpells,
              backgroundId: normalizedBackgroundId,
            }
          : { ...data, backgroundId: normalizedBackgroundId },
        isLoading: false,
      });
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch character";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  createCharacter: async (data: Character, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const payload: any = { ...data };
      if (payload.backgroundId) {
        payload.background = { name: payload.backgroundId };
      }
      delete payload.backgroundId;

      const response = await axios.post(`${API_URL}/characters`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const character = response.data.data;
      set((state) => ({
        characters: [...state.characters, character],
        isLoading: false,
      }));
      return character;
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to create character";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  updateCharacter: async (
    id: number,
    data: Partial<Character>,
    token: string,
  ) => {
    set({ isLoading: true, error: null });
    try {
      // Transform UI spells array -> backend expected object { level: Spell[] }
      let payload: any = { ...data };
      if (payload.backgroundId) {
        payload.background = { name: payload.backgroundId };
      }
      delete payload.backgroundId;

      if (Array.isArray(data.spells)) {
        const grouped: Record<number, any[]> = {};
        data.spells.forEach((s) => {
          const lvl = Math.max(0, Math.min(9, Number(s.level) || 0));
          if (!grouped[lvl]) grouped[lvl] = [];
          grouped[lvl].push({
            name: s.name,
            level: lvl,
            prepared: !!s.prepared,
          });
        });
        payload.spells = grouped;
      }

      const response = await axios.put(`${API_URL}/characters/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = response.data.data;
      set((state) => ({
        characters: state.characters.map((c) => (c.id === id ? updated : c)),
        currentCharacter:
          state.currentCharacter?.id === id ? updated : state.currentCharacter,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update character";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  deleteCharacter: async (id: number, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/characters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        characters: state.characters.filter((c) => c.id !== id),
        currentCharacter:
          state.currentCharacter?.id === id ? null : state.currentCharacter,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to delete character";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

export default useCharacterStore;
