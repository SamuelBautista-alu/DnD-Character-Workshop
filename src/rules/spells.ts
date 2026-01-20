/**
 * D&D 5e Spells Database
 * Includes level, school, casting time, range, components, duration, and class availability
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

export const SPELLS: Record<string, Spell> = {
  // === Cantrips (Level 0) ===
  acid_splash: {
    id: "acid_splash",
    name: "Acid Splash",
    level: 0,
    school: "Conjuration",
    castingTime: "1 action",
    range: "60 feet",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.",
    classes: ["Sorcerer", "Wizard"],
  },
  fire_bolt: {
    id: "fire_bolt",
    name: "Fire Bolt",
    level: 0,
    school: "Evocation",
    castingTime: "1 action",
    range: "120 feet",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage.",
    classes: ["Sorcerer", "Wizard"],
  },
  mage_hand: {
    id: "mage_hand",
    name: "Mage Hand",
    level: 0,
    school: "Conjuration",
    castingTime: "1 action",
    range: "30 feet",
    components: { verbal: true, somatic: true },
    duration: "1 minute",
    description:
      "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. You can use your action to control the hand.",
    classes: ["Bard", "Sorcerer", "Warlock", "Wizard"],
  },
  prestidigitation: {
    id: "prestidigitation",
    name: "Prestidigitation",
    level: 0,
    school: "Transmutation",
    castingTime: "1 action",
    range: "10 feet",
    components: { verbal: true, somatic: true },
    duration: "Up to 1 hour",
    description:
      "This spell is a minor magical trick that novice spellcasters use for practice. You create one of several minor effects.",
    classes: ["Bard", "Sorcerer", "Warlock", "Wizard"],
  },
  sacred_flame: {
    id: "sacred_flame",
    name: "Sacred Flame",
    level: 0,
    school: "Evocation",
    castingTime: "1 action",
    range: "60 feet",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage.",
    classes: ["Cleric"],
  },
  eldritch_blast: {
    id: "eldritch_blast",
    name: "Eldritch Blast",
    level: 0,
    school: "Evocation",
    castingTime: "1 action",
    range: "120 feet",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
    classes: ["Warlock"],
  },

  // === 1st Level Spells ===
  magic_missile: {
    id: "magic_missile",
    name: "Magic Missile",
    level: 1,
    school: "Evocation",
    castingTime: "1 action",
    range: "120 feet",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target.",
    classes: ["Sorcerer", "Wizard"],
  },
  shield: {
    id: "shield",
    name: "Shield",
    level: 1,
    school: "Abjuration",
    castingTime: "1 reaction",
    range: "Self",
    components: { verbal: true, somatic: true },
    duration: "1 round",
    description:
      "An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack.",
    classes: ["Sorcerer", "Wizard"],
  },
  cure_wounds: {
    id: "cure_wounds",
    name: "Cure Wounds",
    level: 1,
    school: "Evocation",
    castingTime: "1 action",
    range: "Touch",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.",
    classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger"],
  },
  healing_word: {
    id: "healing_word",
    name: "Healing Word",
    level: 1,
    school: "Evocation",
    castingTime: "1 bonus action",
    range: "60 feet",
    components: { verbal: true, somatic: false },
    duration: "Instantaneous",
    description:
      "A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier.",
    classes: ["Bard", "Cleric", "Druid"],
  },
  detect_magic: {
    id: "detect_magic",
    name: "Detect Magic",
    level: 1,
    school: "Divination",
    castingTime: "1 action",
    range: "Self",
    components: { verbal: true, somatic: true },
    duration: "Concentration, up to 10 minutes",
    ritual: true,
    concentration: true,
    description:
      "For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic.",
    classes: [
      "Bard",
      "Cleric",
      "Druid",
      "Paladin",
      "Ranger",
      "Sorcerer",
      "Wizard",
    ],
  },
  burning_hands: {
    id: "burning_hands",
    name: "Burning Hands",
    level: 1,
    school: "Evocation",
    castingTime: "1 action",
    range: "Self (15-foot cone)",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.",
    classes: ["Sorcerer", "Wizard"],
  },

  // === 2nd Level Spells ===
  scorching_ray: {
    id: "scorching_ray",
    name: "Scorching Ray",
    level: 2,
    school: "Evocation",
    castingTime: "1 action",
    range: "120 feet",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.",
    classes: ["Sorcerer", "Wizard"],
  },
  misty_step: {
    id: "misty_step",
    name: "Misty Step",
    level: 2,
    school: "Conjuration",
    castingTime: "1 bonus action",
    range: "Self",
    components: { verbal: true, somatic: false },
    duration: "Instantaneous",
    description:
      "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.",
    classes: ["Sorcerer", "Warlock", "Wizard"],
  },
  hold_person: {
    id: "hold_person",
    name: "Hold Person",
    level: 2,
    school: "Enchantment",
    castingTime: "1 action",
    range: "60 feet",
    components: {
      verbal: true,
      somatic: true,
      material: "a small, straight piece of iron",
    },
    duration: "Concentration, up to 1 minute",
    concentration: true,
    description:
      "Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration.",
    classes: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],
  },
  spiritual_weapon: {
    id: "spiritual_weapon",
    name: "Spiritual Weapon",
    level: 2,
    school: "Evocation",
    castingTime: "1 bonus action",
    range: "60 feet",
    components: { verbal: true, somatic: true },
    duration: "1 minute",
    description:
      "You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon.",
    classes: ["Cleric"],
  },

  // === 3rd Level Spells ===
  fireball: {
    id: "fireball",
    name: "Fireball",
    level: 3,
    school: "Evocation",
    castingTime: "1 action",
    range: "150 feet",
    components: {
      verbal: true,
      somatic: true,
      material: "a tiny ball of bat guano and sulfur",
    },
    duration: "Instantaneous",
    description:
      "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
    classes: ["Sorcerer", "Wizard"],
  },
  counterspell: {
    id: "counterspell",
    name: "Counterspell",
    level: 3,
    school: "Abjuration",
    castingTime: "1 reaction",
    range: "60 feet",
    components: { verbal: false, somatic: true },
    duration: "Instantaneous",
    description:
      "You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect.",
    classes: ["Sorcerer", "Warlock", "Wizard"],
  },
  lightning_bolt: {
    id: "lightning_bolt",
    name: "Lightning Bolt",
    level: 3,
    school: "Evocation",
    castingTime: "1 action",
    range: "Self (100-foot line)",
    components: {
      verbal: true,
      somatic: true,
      material: "a bit of fur and a rod of amber, crystal, or glass",
    },
    duration: "Instantaneous",
    description:
      "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.",
    classes: ["Sorcerer", "Wizard"],
  },
  revivify: {
    id: "revivify",
    name: "Revivify",
    level: 3,
    school: "Necromancy",
    castingTime: "1 action",
    range: "Touch",
    components: {
      verbal: true,
      somatic: true,
      material: "diamonds worth 300 gp, which the spell consumes",
    },
    duration: "Instantaneous",
    description:
      "You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts.",
    classes: ["Cleric", "Paladin"],
  },

  // === 4th Level Spells ===
  polymorph: {
    id: "polymorph",
    name: "Polymorph",
    level: 4,
    school: "Transmutation",
    castingTime: "1 action",
    range: "60 feet",
    components: {
      verbal: true,
      somatic: true,
      material: "a caterpillar cocoon",
    },
    duration: "Concentration, up to 1 hour",
    concentration: true,
    description:
      "This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The transformation lasts for the duration, or until the target drops to 0 hit points or dies.",
    classes: ["Bard", "Druid", "Sorcerer", "Wizard"],
  },
  dimension_door: {
    id: "dimension_door",
    name: "Dimension Door",
    level: 4,
    school: "Conjuration",
    castingTime: "1 action",
    range: "500 feet",
    components: { verbal: true, somatic: false },
    duration: "Instantaneous",
    description:
      "You teleport yourself from your current location to any other spot within range. You arrive at exactly the spot desired.",
    classes: ["Bard", "Sorcerer", "Warlock", "Wizard"],
  },

  // === 5th Level Spells ===
  cone_of_cold: {
    id: "cone_of_cold",
    name: "Cone of Cold",
    level: 5,
    school: "Evocation",
    castingTime: "1 action",
    range: "Self (60-foot cone)",
    components: {
      verbal: true,
      somatic: true,
      material: "a small crystal or glass cone",
    },
    duration: "Instantaneous",
    description:
      "A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.",
    classes: ["Sorcerer", "Wizard"],
  },
  mass_cure_wounds: {
    id: "mass_cure_wounds",
    name: "Mass Cure Wounds",
    level: 5,
    school: "Evocation",
    castingTime: "1 action",
    range: "60 feet",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "A wave of healing energy washes out from a point of your choice within range. Choose up to six creatures in a 30-foot-radius sphere centered on that point. Each target regains hit points equal to 3d8 + your spellcasting ability modifier.",
    classes: ["Bard", "Cleric", "Druid"],
  },

  // === 6th Level Spells ===
  chain_lightning: {
    id: "chain_lightning",
    name: "Chain Lightning",
    level: 6,
    school: "Evocation",
    castingTime: "1 action",
    range: "150 feet",
    components: {
      verbal: true,
      somatic: true,
      material:
        "a bit of fur; a piece of amber, glass, or a crystal rod; and three silver pins",
    },
    duration: "Instantaneous",
    description:
      "You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets.",
    classes: ["Sorcerer", "Wizard"],
  },

  // === 7th Level Spells ===
  teleport: {
    id: "teleport",
    name: "Teleport",
    level: 7,
    school: "Conjuration",
    castingTime: "1 action",
    range: "10 feet",
    components: { verbal: true, somatic: false },
    duration: "Instantaneous",
    description:
      "This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object that you can see within range, to a destination you select.",
    classes: ["Bard", "Sorcerer", "Wizard"],
  },

  // === 8th Level Spells ===
  sunburst: {
    id: "sunburst",
    name: "Sunburst",
    level: 8,
    school: "Evocation",
    castingTime: "1 action",
    range: "150 feet",
    components: {
      verbal: true,
      somatic: true,
      material: "fire and a piece of sunstone",
    },
    duration: "Instantaneous",
    description:
      "Brilliant sunlight flashes in a 60-foot radius centered on a point you choose within range. Each creature in that light must make a Constitution saving throw.",
    classes: ["Druid", "Sorcerer", "Wizard"],
  },

  // === 9th Level Spells ===
  wish: {
    id: "wish",
    name: "Wish",
    level: 9,
    school: "Conjuration",
    castingTime: "1 action",
    range: "Self",
    components: { verbal: true, somatic: false },
    duration: "Instantaneous",
    description:
      "Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires.",
    classes: ["Sorcerer", "Wizard"],
  },
  meteor_swarm: {
    id: "meteor_swarm",
    name: "Meteor Swarm",
    level: 9,
    school: "Evocation",
    castingTime: "1 action",
    range: "1 mile",
    components: { verbal: true, somatic: true },
    duration: "Instantaneous",
    description:
      "Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw.",
    classes: ["Sorcerer", "Wizard"],
  },
};

/**
 * Get a spell by ID
 */
export function getSpell(id?: string | null): Spell | undefined {
  if (!id) return undefined;
  return SPELLS[id];
}

/**
 * Get all spells as array
 */
export function getAllSpells(): Spell[] {
  return Object.values(SPELLS);
}

/**
 * Filter spells by level
 */
export function getSpellsByLevel(level: number): Spell[] {
  return getAllSpells().filter((spell) => spell.level === level);
}

/**
 * Filter spells by school
 */
export function getSpellsBySchool(school: SpellSchool): Spell[] {
  return getAllSpells().filter((spell) => spell.school === school);
}

/**
 * Filter spells by class
 */
export function getSpellsByClass(className: SpellClass): Spell[] {
  return getAllSpells().filter((spell) => spell.classes.includes(className));
}

/**
 * Search spells by name (case-insensitive)
 */
export function searchSpells(query: string): Spell[] {
  const lowerQuery = query.toLowerCase();
  return getAllSpells().filter((spell) =>
    spell.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter spells with multiple criteria
 */
export function filterSpells(filters: {
  level?: number;
  school?: SpellSchool;
  class?: SpellClass;
  searchQuery?: string;
}): Spell[] {
  let results = getAllSpells();

  if (filters.level !== undefined) {
    results = results.filter((spell) => spell.level === filters.level);
  }

  if (filters.school) {
    results = results.filter((spell) => spell.school === filters.school);
  }

  if (filters.class) {
    results = results.filter((spell) => spell.classes.includes(filters.class!));
  }

  if (filters.searchQuery) {
    const lowerQuery = filters.searchQuery.toLowerCase();
    results = results.filter((spell) =>
      spell.name.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
}

/**
 * Get spell schools for dropdown
 */
export function getSpellSchools(): SpellSchool[] {
  return [
    "Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Evocation",
    "Illusion",
    "Necromancy",
    "Transmutation",
  ];
}
