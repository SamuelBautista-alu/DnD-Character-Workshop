/**
 * D&D 5e Backgrounds (2014/2024)
 * Includes skills, tools, languages, and features for each background
 */

export interface Background {
  id: string;
  name: string;
  description: string;
  skillChoices: {
    count: number;
    options: string[];
  };
  tools?: {
    count: number;
    options: string[];
  };
  languages?: {
    count: number;
    options: string[];
  };
  feature: {
    name: string;
    description: string;
  };
  equipment?: string[];
}

export const BACKGROUNDS: Record<string, Background> = {
  acolyte: {
    id: "acolyte",
    name: "Acolyte",
    description:
      "You have spent your life in the service of a temple to a specific god or gods.",
    skillChoices: {
      count: 2,
      options: ["Insight", "Religion"],
    },
    languages: {
      count: 2,
      options: [
        "Abyssal",
        "Celestial",
        "Deep Speech",
        "Draconic",
        "Dwarvish",
        "Elvish",
        "Giant",
        "Gnomish",
        "Goblin",
        "Halfling",
        "Infernal",
        "Orc",
        "Primordial",
        "Sylvan",
        "Undercommon",
      ],
    },
    feature: {
      name: "Shelter of the Faithful",
      description:
        "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) in a modest lifestyle. You might also have ties to a specific temple dedicated to your chosen god or pantheon, and you have a residence there. This could be the source of support and assistance from the clergy there.",
    },
  },
  artisan: {
    id: "artisan",
    name: "Guild Artisan",
    description:
      "You are a skilled practitioner of your craft and a member of a trade guild.",
    skillChoices: {
      count: 2,
      options: ["Insight", "Persuasion"],
    },
    tools: {
      count: 1,
      options: [
        "Alchemist's Supplies",
        "Brewer's Supplies",
        "Calligrapher's Supplies",
        "Carpenter's Tools",
        "Cartographer's Tools",
        "Cobbler's Tools",
        "Cook's Utensils",
        "Glassblower's Tools",
        "Jeweler's Tools",
        "Leatherworker's Tools",
        "Mason's Tools",
        "Painter's Supplies",
        "Potter's Tools",
        "Smith's Tools",
        "Tinker's Tools",
        "Weaver's Tools",
        "Woodcarver's Tools",
      ],
    },
    languages: {
      count: 1,
      options: [
        "Abyssal",
        "Celestial",
        "Deep Speech",
        "Draconic",
        "Dwarvish",
        "Elvish",
        "Giant",
        "Gnomish",
        "Goblin",
        "Halfling",
        "Infernal",
        "Orc",
        "Primordial",
        "Sylvan",
        "Undercommon",
      ],
    },
    feature: {
      name: "Guild Membership",
      description:
        "As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your guild is likely to provide you with lodging in exchange for 5 gp a week, as long as you remain in good standing. If you come to an inn in a city where your guild has a presence, you can expect to meet with guild merchants and potential patrons there. Guilds often wield tremendous political power. If you are accused of a crime, your guild will support you if a good case can be made for your innocence or the crime is overlooked. Because you are a member in good standing of your guild, merchants will extend the carpentry, metalworking, or weaving services you normally offer to them at a 20 percent discount.",
    },
  },
  charlatan: {
    id: "charlatan",
    name: "Charlatan",
    description: "You are an expert at deception and at reading people.",
    skillChoices: {
      count: 2,
      options: ["Deception", "Sleight of Hand"],
    },
    tools: {
      count: 2,
      options: ["Disguise Kit", "Forgery Kit"],
    },
    feature: {
      name: "False Identity",
      description:
        "You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that identity. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.",
    },
  },
  criminal: {
    id: "criminal",
    name: "Criminal",
    description:
      "You are an experienced criminal with a history of breaking the law.",
    skillChoices: {
      count: 2,
      options: ["Deception", "Stealth"],
    },
    tools: {
      count: 2,
      options: ["Thieves' Tools", "Gaming Set"],
    },
    feature: {
      name: "Criminal Contact",
      description:
        "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, and how to arrange a meeting with them when you need it. Your contact is willing to shelter you and hide you if the law or anyone else is looking for you, though they won't risk their life for you.",
    },
  },
  entertainer: {
    id: "entertainer",
    name: "Entertainer",
    description:
      "You thrive in front of an audience. You know how to distract them, entertain them, and engage them.",
    skillChoices: {
      count: 2,
      options: ["Acrobatics", "Performance"],
    },
    tools: {
      count: 1,
      options: ["Musical Instrument"],
    },
    feature: {
      name: "By Popular Demand",
      description:
        "You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble's court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each evening. In addition, your performance makes you a local figure. When strangers recognize you in a town where you have performed, they typically take a liking to you.",
    },
  },
  folk_hero: {
    id: "folk_hero",
    name: "Folk Hero",
    description:
      "You are the champion of the common people, respected and beloved for your deeds.",
    skillChoices: {
      count: 2,
      options: ["Animal Handling", "Survival"],
    },
    tools: {
      count: 1,
      options: ["Artisan's Tools"],
    },
    feature: {
      name: "Rustic Hospitality",
      description:
        "Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.",
    },
  },
  gladiator: {
    id: "gladiator",
    name: "Gladiator",
    description:
      "You have fought in pits, arenas, and on battlefields, always the entertainer, sometimes the killer.",
    skillChoices: {
      count: 2,
      options: ["Acrobatics", "Performance"],
    },
    tools: {
      count: 1,
      options: ["Musical Instrument"],
    },
    feature: {
      name: "By Popular Demand",
      description:
        "(Same as Entertainer) You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble's court.",
    },
  },
  guard: {
    id: "guard",
    name: "Guard",
    description:
      "You have served as a guard for a merchant, noble, or other wealthy individual.",
    skillChoices: {
      count: 2,
      options: ["Insight", "Perception"],
    },
    tools: {
      count: 1,
      options: ["Gaming Set"],
    },
    feature: {
      name: "Wary Eye",
      description:
        "You have keen senses and excellent judgment of character. You have advantage on Wisdom (Insight) checks to determine if someone is lying.",
    },
  },
  hermit: {
    id: "hermit",
    name: "Hermit",
    description:
      "You have withdrawn from society into solitude, either out of choice or circumstance.",
    skillChoices: {
      count: 2,
      options: ["Medicine", "Religion"],
    },
    tools: {
      count: 1,
      options: ["Herbalism Kit"],
    },
    languages: {
      count: 1,
      options: [
        "Abyssal",
        "Celestial",
        "Deep Speech",
        "Draconic",
        "Dwarvish",
        "Elvish",
        "Giant",
        "Gnomish",
        "Goblin",
        "Halfling",
        "Infernal",
        "Orc",
        "Primordial",
        "Sylvan",
        "Undercommon",
      ],
    },
    feature: {
      name: "Discovery",
      description:
        "The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion and could involve a great truth about the cosmos, the gods, powerful magic, or other mystical subject.",
    },
  },
  noble: {
    id: "noble",
    name: "Noble",
    description:
      "You understand wealth, power, and privilege. You were born into high society.",
    skillChoices: {
      count: 2,
      options: ["Insight", "Persuasion"],
    },
    languages: {
      count: 1,
      options: [
        "Abyssal",
        "Celestial",
        "Deep Speech",
        "Draconic",
        "Dwarvish",
        "Elvish",
        "Giant",
        "Gnomish",
        "Goblin",
        "Halfling",
        "Infernal",
        "Orc",
        "Primordial",
        "Sylvan",
        "Undercommon",
      ],
    },
    feature: {
      name: "Position of Privilege",
      description:
        "Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk defers to your authority, and other people of high birth treat you as a member of the same social sphere. You can secure an audience with a local noble if you need to.",
    },
  },
  outlander: {
    id: "outlander",
    name: "Outlander",
    description:
      "You grew up in the wilds, far from civilization and its comforts.",
    skillChoices: {
      count: 2,
      options: ["Athletics", "Survival"],
    },
    tools: {
      count: 1,
      options: ["Musical Instrument"],
    },
    languages: {
      count: 1,
      options: [
        "Abyssal",
        "Celestial",
        "Deep Speech",
        "Draconic",
        "Dwarvish",
        "Elvish",
        "Giant",
        "Gnomish",
        "Goblin",
        "Halfling",
        "Infernal",
        "Orc",
        "Primordial",
        "Sylvan",
        "Undercommon",
      ],
    },
    feature: {
      name: "Wanderer",
      description:
        "You have an excellent memory for maps and geography. You can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.",
    },
  },
  sage: {
    id: "sage",
    name: "Sage",
    description:
      "You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts telling what they had learned.",
    skillChoices: {
      count: 2,
      options: ["Arcana", "History"],
    },
    languages: {
      count: 2,
      options: [
        "Abyssal",
        "Celestial",
        "Deep Speech",
        "Draconic",
        "Dwarvish",
        "Elvish",
        "Giant",
        "Gnomish",
        "Goblin",
        "Halfling",
        "Infernal",
        "Orc",
        "Primordial",
        "Sylvan",
        "Undercommon",
      ],
    },
    feature: {
      name: "Researcher",
      description:
        "When you attempt to learn or recall lore about something, often magic, you often know where and from whom you can get the most reliable information. You know when an official document is forged. Your extensive studies and contacts have given you access to any nonmagical information you might need. You have advantage on Intelligence checks to recall information about magic, history, or other scholarly subjects.",
    },
  },
  sailor: {
    id: "sailor",
    name: "Sailor",
    description:
      "You sailed on a seagoing vessel for years. You feel more comfortable on a ship's deck than on solid ground.",
    skillChoices: {
      count: 2,
      options: ["Athletics", "Perception"],
    },
    tools: {
      count: 1,
      options: ["Navigator's Tools", "Vehicles (water)"],
    },
    feature: {
      name: "Ship's Passage",
      description:
        "When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, if it is still afloat and in port, or another ship you have good relations with. Because you're known to sailors, you can find ships heading where you need to go.",
    },
  },
  soldier: {
    id: "soldier",
    name: "Soldier",
    description:
      "You fought in a large war as a member of an organized army. You have seen much of warfare and of its horrors.",
    skillChoices: {
      count: 2,
      options: ["Athletics", "Intimidation"],
    },
    tools: {
      count: 1,
      options: ["Gaming Set", "Vehicles (land)"],
    },
    feature: {
      name: "Military Rank",
      description:
        "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment for temporary use. You can usually gain access to friendly military encampments and fortifications where your rank is recognized.",
    },
  },
  urchin: {
    id: "urchin",
    name: "Urchin",
    description:
      "You grew up on the streets alone, orphaned, and poor. You had to learn to provide for yourself quickly.",
    skillChoices: {
      count: 2,
      options: ["Sleight of Hand", "Stealth"],
    },
    tools: {
      count: 2,
      options: ["Disguise Kit", "Thieves' Tools"],
    },
    feature: {
      name: "City Secrets",
      description:
        "You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in a city twice as fast as your speed would normally allow.",
    },
  },
};

// Auxiliar para obtener un trasfondo por ID
export function getBackground(id: string): Background | undefined {
  return BACKGROUNDS[id];
}

// Auxiliar para listar todos los IDs de trasfondos
export function getAllBackgroundIds(): string[] {
  return Object.keys(BACKGROUNDS);
}

// Auxiliar para obtener nombres de trasfondos para selección en UI
export function getBackgroundOptions(): { id: string; name: string }[] {
  return Object.entries(BACKGROUNDS).map(([id, bg]) => ({
    id,
    name: bg.name,
  }));
}
