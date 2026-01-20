import type { SpellcastingDetails } from "@/rules/spellcasting";
import type { Skill } from "@/rules/editions/rules2014";

// Tipo de puntuaciones de habilidades - nombres de habilidades como claves
export type AbilityScores = {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
};

export type Ability = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export type CharacterClassLevel = {
  classId: string;
  level: number;
  spellcasting?: "full" | "half" | "third" | "pact" | "none";
  hitDie?: number;
};

// Seguimiento de progresión por nivel para construcciones multiclase
export type LevelProgression = {
  level: number; // 1-20
  classId: string; // Qué clase agregar
  subclassId?: string; // Subclase elegida (si el nivel es nivel de subclase)
  featIds?: string[]; // Hazañas elegidas en este nivel (si es nivel ASI)
  abilityScoreIncrement?: {
    // Aumento de habilidad elegido (si es nivel ASI y no se toma una hazaña)
    ability: keyof AbilityScores;
    increment: number; // Usualmente 2 o 1
  };
  spellIds?: string[]; // Hechizos elegidos (si es nivel de adquisición de hechizos)
};

export type CharacterSheet = {
  name: string;
  race: any | null;
  // Array de clase plano para compatibilidad hacia atrás, se fusionará desde classProgression
  classes: CharacterClassLevel[];
  // Array de progresión por nivel (reemplaza el campo de clase plano)
  classProgression?: LevelProgression[];
  level: number;
  edition?: "2014" | "2024";
  backgroundId?: string | null;

  abilities: AbilityScores;

  // Habilidades seleccionadas por el usuario desde opciones de habilidades de clase
  selectedSkills?: Skill[];
  // Habilidades con pericia de experto (bonificación de pericia doble)
  expertiseSkills?: Skill[];

  derived: {
    proficiencyBonus: number;
    maxHP: number;
    spellSlots: number[];
    pactMagicSlots?: { slots: number; slotLevel: number } | null;
    spellcasting?: SpellcastingDetails;
    savingThrows: Ability[]; // Tiradas de salvación con pericia de clase
    skills: Skill[]; // Habilidades con pericia de clase + trasfondo
    expertiseSkills: Skill[]; // Habilidades con pericia de experto (doble pericia)
  };
};
