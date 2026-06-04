/**
 * Homebrew Store
 * Zustand store for managing homebrew content
 */

import { create } from "zustand";
import {
  HomebrewClass,
  HomebrewRace,
  HomebrewSpell,
  HomebrewItem,
  HomebrewBackground,
  HomebrewContentType,
} from "./types";

interface HomebrewState {
  // Content collections
  classes: HomebrewClass[];
  races: HomebrewRace[];
  spells: HomebrewSpell[];
  items: HomebrewItem[];
  backgrounds: HomebrewBackground[];

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Fetch methods
  fetchClasses: (token: string) => Promise<void>;
  fetchRaces: (token: string) => Promise<void>;
  fetchSpells: (token: string) => Promise<void>;
  fetchItems: (token: string) => Promise<void>;
  fetchBackgrounds: (token: string) => Promise<void>;
  fetchAll: (token: string) => Promise<void>;

  // Create methods
  createClass: (
    data: Omit<HomebrewClass, "id" | "createdBy" | "createdAt" | "updatedAt">,
    token: string,
  ) => Promise<HomebrewClass>;
  createRace: (
    data: Omit<HomebrewRace, "id" | "createdBy" | "createdAt" | "updatedAt">,
    token: string,
  ) => Promise<HomebrewRace>;
  createSpell: (
    data: Omit<HomebrewSpell, "id" | "createdBy" | "createdAt" | "updatedAt">,
    token: string,
  ) => Promise<HomebrewSpell>;
  createItem: (
    data: Omit<HomebrewItem, "id" | "createdBy" | "createdAt" | "updatedAt">,
    token: string,
  ) => Promise<HomebrewItem>;
  createBackground: (
    data: Omit<
      HomebrewBackground,
      "id" | "createdBy" | "createdAt" | "updatedAt"
    >,
    token: string,
  ) => Promise<HomebrewBackground>;

  // Update methods
  updateClass: (
    id: string,
    data: Partial<HomebrewClass>,
    token: string,
  ) => Promise<HomebrewClass>;
  updateRace: (
    id: string,
    data: Partial<HomebrewRace>,
    token: string,
  ) => Promise<HomebrewRace>;
  updateSpell: (
    id: string,
    data: Partial<HomebrewSpell>,
    token: string,
  ) => Promise<HomebrewSpell>;
  updateItem: (
    id: string,
    data: Partial<HomebrewItem>,
    token: string,
  ) => Promise<HomebrewItem>;
  updateBackground: (
    id: string,
    data: Partial<HomebrewBackground>,
    token: string,
  ) => Promise<HomebrewBackground>;

  // Delete methods
  deleteClass: (id: string, token: string) => Promise<void>;
  deleteRace: (id: string, token: string) => Promise<void>;
  deleteSpell: (id: string, token: string) => Promise<void>;
  deleteItem: (id: string, token: string) => Promise<void>;
  deleteBackground: (id: string, token: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

const useHomebrewStore = create<HomebrewState>((set) => ({
  classes: [],
  races: [],
  spells: [],
  items: [],
  backgrounds: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // Fetch Classes
  fetchClasses: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/homebrew/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch classes");
      const classes = await res.json();
      set({ classes, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  // Fetch Races
  fetchRaces: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/homebrew/races`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch races");
      const races = await res.json();
      set({ races, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  // Fetch Spells
  fetchSpells: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/homebrew/spells`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch spells");
      const spells = await res.json();
      set({ spells, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  // Fetch Items
  fetchItems: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/homebrew/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch items");
      const items = await res.json();
      set({ items, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  // Fetch Backgrounds
  fetchBackgrounds: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/homebrew/backgrounds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch backgrounds");
      const backgrounds = await res.json();
      set({ backgrounds, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  // Fetch All
  fetchAll: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const [classesRes, racesRes, spellsRes, itemsRes, backgroundsRes] =
        await Promise.all([
          fetch(`${API_URL}/homebrew/classes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/homebrew/races`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/homebrew/spells`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/homebrew/items`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/homebrew/backgrounds`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      if (
        !classesRes.ok ||
        !racesRes.ok ||
        !spellsRes.ok ||
        !itemsRes.ok ||
        !backgroundsRes.ok
      ) {
        throw new Error("Failed to fetch homebrew content");
      }

      const [classes, races, spells, items, backgrounds] = await Promise.all([
        classesRes.json(),
        racesRes.json(),
        spellsRes.json(),
        itemsRes.json(),
        backgroundsRes.json(),
      ]);

      set({ classes, races, spells, items, backgrounds, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  // Create Class
  createClass: async (data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create class");
      const newClass = await res.json();
      set((state) => ({ classes: [...state.classes, newClass] }));
      return newClass;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Create Race
  createRace: async (data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/races`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create race");
      const newRace = await res.json();
      set((state) => ({ races: [...state.races, newRace] }));
      return newRace;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Create Spell
  createSpell: async (data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/spells`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create spell");
      const newSpell = await res.json();
      set((state) => ({ spells: [...state.spells, newSpell] }));
      return newSpell;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Create Item
  createItem: async (data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const newItem = await res.json();
      set((state) => ({ items: [...state.items, newItem] }));
      return newItem;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Create Background
  createBackground: async (data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/backgrounds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create background");
      const newBackground = await res.json();
      set((state) => ({ backgrounds: [...state.backgrounds, newBackground] }));
      return newBackground;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Update Class
  updateClass: async (id, data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/classes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update class");
      const updated = await res.json();
      set((state) => ({
        classes: state.classes.map((c) => (c.id === id ? updated : c)),
      }));
      return updated;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Update Race
  updateRace: async (id, data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/races/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update race");
      const updated = await res.json();
      set((state) => ({
        races: state.races.map((r) => (r.id === id ? updated : r)),
      }));
      return updated;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Update Spell
  updateSpell: async (id, data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/spells/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update spell");
      const updated = await res.json();
      set((state) => ({
        spells: state.spells.map((s) => (s.id === id ? updated : s)),
      }));
      return updated;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Update Item
  updateItem: async (id, data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const updated = await res.json();
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
      }));
      return updated;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Update Background
  updateBackground: async (id, data, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/backgrounds/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update background");
      const updated = await res.json();
      set((state) => ({
        backgrounds: state.backgrounds.map((b) => (b.id === id ? updated : b)),
      }));
      return updated;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Delete Class
  deleteClass: async (id, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/classes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete class");
      set((state) => ({ classes: state.classes.filter((c) => c.id !== id) }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Delete Race
  deleteRace: async (id, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/races/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete race");
      set((state) => ({ races: state.races.filter((r) => r.id !== id) }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Delete Spell
  deleteSpell: async (id, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/spells/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete spell");
      set((state) => ({ spells: state.spells.filter((s) => s.id !== id) }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Delete Item
  deleteItem: async (id, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  // Delete Background
  deleteBackground: async (id, token) => {
    try {
      const res = await fetch(`${API_URL}/homebrew/backgrounds/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete background");
      set((state) => ({
        backgrounds: state.backgrounds.filter((b) => b.id !== id),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },
}));

export default useHomebrewStore;
