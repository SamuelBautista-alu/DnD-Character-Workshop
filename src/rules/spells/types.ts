/**
 * Type definitions for D&D 5e spells
 */

export type SpellSchool =
  | "Abjuration"
  | "Conjuration"
  | "Divination"
  | "Enchantment"
  | "Evocation"
  | "Illusion"
  | "Necromancy"
  | "Transmutation";

export type SpellClass =
  | "Bard"
  | "Cleric"
  | "Druid"
  | "Paladin"
  | "Ranger"
  | "Sorcerer"
  | "Warlock"
  | "Wizard";

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 = cantrip, 1-9 = spell level
  school: SpellSchool;
  castingTime: string; // "1 action", "1 bonus action", "1 minute", etc.
  range: string; // "Self", "Touch", "30 feet", etc.
  components: {
    verbal: boolean;
    somatic: boolean;
    material?: string; // material component description
  };
  duration: string; // "Instantaneous", "Concentration, up to 1 minute", etc.
  description: string;
  classes: SpellClass[]; // Which classes can learn this spell
  ritual?: boolean; // Can be cast as a ritual
  concentration?: boolean; // Requires concentration
}
