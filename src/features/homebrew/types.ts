/**
 * Homebrew Types
 * Definitions for custom user-created D&D content
 */

export interface HomebrewClass {
  id: string;
  name: string;
  description: string;
  hitDie: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomebrewRace {
  id: string;
  name: string;
  description: string;
  abilityScores: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  speed: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomebrewSpell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  concentration: boolean;
  components: string[];
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomebrewItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string;
  properties: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomebrewBackground {
  id: string;
  name: string;
  description: string;
  skillProficiencies: string[];
  toolProficiencies: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type HomebrewContent =
  | HomebrewClass
  | HomebrewRace
  | HomebrewSpell
  | HomebrewItem
  | HomebrewBackground;

export type HomebrewContentType =
  | "classes"
  | "races"
  | "spells"
  | "items"
  | "backgrounds";
