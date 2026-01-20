import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/features/auth/store";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";
import useCharacterStore from "../store";
import { Character, InventoryItem, Spell } from "../store";
import { getBackgroundOptions, getBackground } from "@/rules/backgrounds";
import { RULES_2014, RULES_2024 } from "@/rules";
import { getAbilityModifier, SKILL_ABILITY_MAP } from "@/rules/skillAbilityMap";
import { getProficiencyBonus } from "@/rules/proficiency";
import { getCasterTypeSync, getSpellSlots } from "@/rules/spellSlots";
import ItemsTab from "./ItemsTab";
import SpellPickerModal from "./SpellPickerModal";

const D20_CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

const D20_RACES = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Dragonborn",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Tiefling",
];

const D20_SUBCLASSES: Record<string, string[]> = {
  Barbarian: [
    "Berserker",
    "Totem Warrior",
    "Ancestral Guardian",
    "Storm Herald",
    "Zealot",
    "Rune Knight",
    "Wild Magic",
  ],
  Bard: [
    "Lore",
    "Life",
    "Glamour",
    "Swords",
    "Whispers",
    "Eloquence",
    "Creation",
    "Spirits",
    "Aberrant Mind",
  ],
  Cleric: [
    "Life",
    "Light",
    "Tempest",
    "Trickery",
    "War",
    "Death",
    "Knowledge",
    "Nature",
    "Forge",
    "Grave",
    "Order",
    "Peace",
    "Twilight",
  ],
  Druid: ["Land", "Moon", "Shepherd", "Spores", "Stars", "Wildfire", "Dreams"],
  Fighter: [
    "Champion",
    "Battle Master",
    "Eldritch Knight",
    "Rune Knight",
    "Psi Warrior",
    "Echo Knight",
    "Hexblade",
  ],
  Monk: [
    "Open Hand",
    "Shadow",
    "Four Elements",
    "Long Death",
    "Mercy",
    "Drunken Master",
    "Kensei",
    "Sun Soul",
    "Cobalt Soul",
  ],
  Paladin: [
    "Devotion",
    "Ancient Oath",
    "Vengeance",
    "Conquest",
    "Redemption",
    "Watchers",
    "Crown",
    "Oath of Glory",
    "Oath of the Watchers",
  ],
  Ranger: [
    "Hunter",
    "Beast Master",
    "Gloom Stalker",
    "Monk",
    "Swarmkeeper",
    "Fey Wanderer",
    "Monster Slayer",
  ],
  Rogue: [
    "Thief",
    "Assassin",
    "Arcane Trickster",
    "Phantom",
    "Soulknife",
    "Mastermind",
    "Swashbuckler",
    "Inquisitive",
  ],
  Sorcerer: [
    "Draconic Bloodline",
    "Wild Magic",
    "Shadow Magic",
    "Storm Sorcery",
    "Divine Soul",
    "Aberrant Mind",
    "Clockwork Soul",
    "Lunar Sorcery",
  ],
  Warlock: [
    "Archfey",
    "Fiend",
    "Great Old One",
    "Celestial",
    "Hexblade",
    "Genie",
    "Undead",
    "Undying",
  ],
  Wizard: [
    "Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Evocation",
    "Illusion",
    "Necromancy",
    "Transmutation",
    "War Magic",
    "Lore Master",
    "Chronurgy Magic",
    "Graviturgy Magic",
  ],
};

// Define at which level each class chooses its subclass
const SUBCLASS_LEVEL: Record<string, number> = {
  Barbarian: 3,
  Bard: 3,
  Cleric: 1,
  Druid: 2,
  Fighter: 3,
  Monk: 3,
  Paladin: 3,
  Ranger: 3,
  Rogue: 3,
  Sorcerer: 1,
  Warlock: 1,
  Wizard: 2,
};

type TabType = "background" | "abilities" | "classes" | "spells" | "items";

export default function CharacterBuildPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language as "en" | "es", key);
  const {
    currentCharacter,
    isLoading,
    error,
    fetchCharacter,
    updateCharacter,
  } = useCharacterStore();

  const [activeTab, setActiveTab] = useState<TabType>("background");
  const [formData, setFormData] = useState<Partial<Character>>(
    currentCharacter ? { ...currentCharacter } : { edition: "2014" },
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classLevels, setClassLevels] = useState<number>(1);
  const [selectedSubclass, setSelectedSubclass] = useState<string>("");
  const [expandedClassIndex, setExpandedClassIndex] = useState<number | null>(
    null,
  );
  const [proficientSkills, setProficientSkills] = useState<Set<string>>(
    new Set(formData.proficientSkills || []),
  );
  const [expertiseSkills, setExpertiseSkills] = useState<Set<string>>(
    new Set(formData.expertiseSkills || []),
  );
  const [proficientSavingThrows, setProficientSavingThrows] = useState<
    Set<string>
  >(new Set(formData.proficientSavingThrows || []));

  useEffect(() => {
    if (id && token) {
      fetchCharacter(parseInt(id), token);
    }
  }, [id, token, fetchCharacter]);

  useEffect(() => {
    if (currentCharacter) {
      setFormData(currentCharacter);
      setProficientSkills(new Set(currentCharacter.proficientSkills || []));
      setExpertiseSkills(new Set(currentCharacter.expertiseSkills || []));
      setProficientSavingThrows(
        new Set(currentCharacter.proficientSavingThrows || []),
      );
    }
  }, [currentCharacter]);

  const rules = useMemo(
    () => ((formData as any)?.edition === "2024" ? RULES_2024 : RULES_2014),
    [(formData as any)?.edition],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "level"
          ? parseInt(value) || 1
          : name === "edition"
            ? (value as "2014" | "2024")
            : name === "backgroundId"
              ? value || undefined
              : value,
    });
  };

  const handleAddClass = () => {
    if (!selectedClass) return;
    const currentClasses = formData.classes || [];
    const existingClass = currentClasses.find(
      (c: any) => c.name === selectedClass,
    );

    // Calculate total character level after adding/updating this class
    const otherClassesTotal = currentClasses
      .filter((c: any) => c.name !== selectedClass)
      .reduce((sum: number, c: any) => sum + c.levels, 0);
    const totalLevels = otherClassesTotal + classLevels;

    // Don't allow exceeding character level 20
    if (totalLevels > 20) {
      alert(
        "Total character level cannot exceed 20. You can only add " +
          (20 - otherClassesTotal) +
          " more levels.",
      );
      return;
    }

    if (existingClass) {
      // Update existing class levels
      setFormData({
        ...formData,
        classes: currentClasses.map((c: any) =>
          c.name === selectedClass
            ? {
                ...c,
                levels: classLevels,
              }
            : c,
        ),
      });
    } else {
      // Add new class
      setFormData({
        ...formData,
        classes: [
          ...currentClasses,
          {
            name: selectedClass,
            levels: classLevels,
            index: selectedClass.toLowerCase(),
          },
        ],
      });
    }

    setFormData((prev) => ({
      ...prev,
      level: totalLevels,
    }));

    setSelectedClass("");
    setClassLevels(1);
    setSelectedSubclass("");
  };

  const handleRemoveClass = (className: string) => {
    const newClasses = (formData.classes || []).filter(
      (c: any) => c.name !== className,
    );
    const totalLevels = newClasses.reduce(
      (sum: number, c: any) => sum + c.levels,
      0,
    );

    setFormData({
      ...formData,
      classes: newClasses,
      level: totalLevels || 1,
    });
  };

  const handleClassLevelChange = (className: string, newLevel: number) => {
    // Clamp the level to be between 1 and 20
    const clampedLevel = Math.max(1, Math.min(20, newLevel));

    const currentClasses = formData.classes || [];
    const otherClassesTotal = currentClasses
      .filter((c: any) => c.name !== className)
      .reduce((sum: number, c: any) => sum + c.levels, 0);
    const totalLevels = otherClassesTotal + clampedLevel;

    // Don't allow exceeding character level 20
    if (totalLevels > 20) {
      return; // Silently reject the change
    }

    const newClasses = currentClasses.map((c: any) =>
      c.name === className ? { ...c, levels: clampedLevel } : c,
    );

    setFormData({
      ...formData,
      classes: newClasses,
      level: totalLevels,
    });
  };

  const handleSetSubclass = (classIndex: number, subclass: string) => {
    const newClasses = (formData.classes || []).map((c: any, idx: number) =>
      idx === classIndex
        ? {
            ...c,
            subclass: subclass || undefined,
            subclassIndex: subclass
              ? subclass.toLowerCase().replace(/\s+/g, "-")
              : undefined,
          }
        : c,
    );

    setFormData({
      ...formData,
      classes: newClasses,
    });
  };

  const handleToggleSkillProficiency = (skill: string) => {
    const newProficient = new Set(proficientSkills);
    const newExpertise = new Set(expertiseSkills);

    if (newProficient.has(skill)) {
      // Remove proficiency
      newProficient.delete(skill);
      newExpertise.delete(skill);
    } else {
      // Add proficiency
      newProficient.add(skill);
    }

    setProficientSkills(newProficient);
    setExpertiseSkills(newExpertise);
    setFormData({
      ...formData,
      proficientSkills: Array.from(newProficient),
      expertiseSkills: Array.from(newExpertise),
    });
  };

  const handleToggleExpertise = (skill: string) => {
    const newExpertise = new Set(expertiseSkills);
    const newProficient = new Set(proficientSkills);

    if (newExpertise.has(skill)) {
      // Remove expertise, keep proficiency
      newExpertise.delete(skill);
    } else {
      // Add expertise (automatically adds proficiency)
      newExpertise.add(skill);
      newProficient.add(skill);
    }

    setProficientSkills(newProficient);
    setExpertiseSkills(newExpertise);
    setFormData({
      ...formData,
      proficientSkills: Array.from(newProficient),
      expertiseSkills: Array.from(newExpertise),
    });
  };

  const handleToggleSavingThrowProficiency = (ability: string) => {
    const newProficient = new Set(proficientSavingThrows);

    if (newProficient.has(ability)) {
      newProficient.delete(ability);
    } else {
      newProficient.add(ability);
    }

    setProficientSavingThrows(newProficient);
    setFormData({
      ...formData,
      proficientSavingThrows: Array.from(newProficient),
    });
  };

  const handleInventoryChange = (
    inventory: InventoryItem[],
    currentWeight: number,
  ) => {
    setFormData({
      ...formData,
      inventory,
      current_weight: currentWeight,
    });
  };

  const handleSpellsChange = (spells: Spell[]) => {
    setFormData((prev) => ({
      ...(prev || {}),
      spells,
    }));
  };

  const handleSave = async () => {
    if (!token || !currentCharacter?.id) return;
    setIsSaving(true);
    try {
      // Map form data to backend format if needed
      const saveData = {
        ...formData,
        classes:
          formData.classes && formData.classes.length > 0
            ? formData.classes
            : [
                {
                  name: formData.class || "Barbarian",
                  levels: formData.level || 1,
                  index: formData.class?.toLowerCase() || "barbarian",
                },
              ],
      };
      await updateCharacter(currentCharacter.id, saveData, token);
      navigate(`/characters/${id}`);
    } catch (err) {
      console.error("Failed to save character:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: "var(--background)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--foreground)" }}>Loading character...</p>
      </div>
    );
  }

  if (!currentCharacter) {
    return (
      <div
        style={{
          backgroundColor: "var(--background)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--foreground)" }}>
            Character not found
          </p>
          <Link
            to="/characters"
            className="inline-block px-6 py-2 rounded font-semibold"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  const primaryClass =
    formData.classes && formData.classes.length > 0
      ? formData.classes[0]
      : { name: formData.class || "Barbarian", levels: formData.level || 1 };

  const tabs: { id: TabType; label: string }[] = [
    { id: "background", label: "BACKGROUND" },
    { id: "abilities", label: "ABILITIES" },
    { id: "classes", label: "CLASSES" },
    { id: "spells", label: "SPELLS" },
    { id: "items", label: "ITEMS / MISC" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 style={{ color: "var(--foreground)", fontSize: "1.875rem" }}>
            {currentCharacter.name}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 rounded font-semibold transition-all"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <Link
              to={`/characters/${id}`}
              className="px-6 py-2 rounded font-semibold"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-foreground)",
              }}
            >
              Cancel
            </Link>
          </div>
        </div>

        {error && (
          <div
            className="mb-4 p-3 rounded"
            style={{ backgroundColor: "#fde2e2", color: "#8b2635" }}
          >
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div
          className="flex border-b mb-8 overflow-x-auto"
          style={{ borderColor: "var(--border)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "1rem 2rem",
                borderBottom:
                  activeTab === tab.id ? "3px solid var(--primary)" : "none",
                backgroundColor:
                  activeTab === tab.id ? "transparent" : "transparent",
                color:
                  activeTab === tab.id
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "2rem",
          }}
        >
          {activeTab === "background" && (
            <BackgroundTab formData={formData} handleChange={handleChange} />
          )}
          {activeTab === "abilities" && (
            <AbilitiesTab
              formData={formData}
              handleChange={handleChange}
              proficientSkills={proficientSkills}
              expertiseSkills={expertiseSkills}
              proficientSavingThrows={proficientSavingThrows}
              onToggleSkillProficiency={handleToggleSkillProficiency}
              onToggleExpertise={handleToggleExpertise}
              onToggleSavingThrowProficiency={
                handleToggleSavingThrowProficiency
              }
            />
          )}
          {activeTab === "classes" && (
            <ClassesTab
              formData={formData}
              handleChange={handleChange}
              primaryClass={primaryClass}
              selectedClass={selectedClass}
              classLevels={classLevels}
              selectedSubclass={selectedSubclass}
              onSelectedClassChange={setSelectedClass}
              onClassLevelsChange={setClassLevels}
              onSelectedSubclassChange={setSelectedSubclass}
              onAddClass={handleAddClass}
              onRemoveClass={handleRemoveClass}
              onClassLevelChange={handleClassLevelChange}
              onSetSubclass={handleSetSubclass}
              expandedClassIndex={expandedClassIndex}
              onExpandClass={setExpandedClassIndex}
            />
          )}
          {activeTab === "spells" && (
            <SpellsTab
              formData={formData}
              rules={rules}
              primaryClass={primaryClass}
              onSpellsChange={handleSpellsChange}
              language={language}
            />
          )}
          {activeTab === "items" && (
            <ItemsTab
              formData={formData}
              handleChange={handleChange}
              onInventoryChange={handleInventoryChange}
            />
          )}
        </div>

        {/* Character Preview */}
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            padding: "2rem",
          }}
        >
          <h2 style={{ color: "var(--foreground)", marginBottom: "1rem" }}>
            Level {formData.level} {primaryClass.name}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "1rem",
            }}
          >
            {(
              [
                "strength",
                "dexterity",
                "constitution",
                "intelligence",
                "wisdom",
                "charisma",
              ] as const
            ).map((ability) => (
              <div key={ability} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  {ability.slice(0, 3).toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--primary)",
                  }}
                >
                  {formData[ability] || 10}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  (
                  {formatAbilityMod(
                    getAbilityModifier(formData[ability] || 10),
                  )}
                  )
                </div>
              </div>
            ))}
          </div>

          {/* Additional Stats */}
          <div
            style={{
              marginTop: "2rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.875rem",
                }}
              >
                Hit Points
              </div>
              <div
                style={{
                  color: "var(--primary)",
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                }}
              >
                {formData.maxHitPoints || formData.hitPoints || 0}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.875rem",
                }}
              >
                Armor Class
              </div>
              <div
                style={{
                  color: "var(--primary)",
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                }}
              >
                {formData.armorClass || 10}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.875rem",
                }}
              >
                Initiative
              </div>
              <div
                style={{
                  color: "var(--primary)",
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                }}
              >
                {formatAbilityMod(getAbilityModifier(formData.dexterity || 10))}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.875rem",
                }}
              >
                Proficiency Bonus
              </div>
              <div
                style={{
                  color: "var(--primary)",
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                }}
              >
                +
                {getProficiencyBonus(
                  formData.level || 1,
                  formData.edition || "2014",
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Background Tab Component
function BackgroundTab({
  formData,
  handleChange,
}: {
  formData: Partial<Character>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}) {
  return (
    <div>
      <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
        Choose your character's Name, Race, Origin and Background.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem",
        }}
      >
        {/* Name */}
        <div>
          <label
            style={{
              color: "var(--foreground)",
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* Race */}
        <div>
          <label
            style={{
              color: "var(--foreground)",
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Race
          </label>
          <select
            name="race"
            value={formData.race || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          >
            {D20_RACES.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </div>

        {/* Background */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label
            style={{
              color: "var(--foreground)",
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Background
          </label>
          <select
            name="backgroundId"
            value={(formData as any)?.backgroundId || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          >
            <option value="">Select a background...</option>
            {getBackgroundOptions().map((bg) => (
              <option key={bg.id} value={bg.id}>
                {bg.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label
            style={{
              color: "var(--foreground)",
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Notes / Description
          </label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
              minHeight: "120px",
              fontFamily: "inherit",
            }}
            placeholder="Add notes about your character..."
          />
          <div
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
              marginTop: "0.5rem",
            }}
          >
            0 / 100000 characters
          </div>
        </div>
      </div>
    </div>
  );
}

// Abilities Tab Component
function AbilitiesTab({
  formData,
  handleChange,
  proficientSkills,
  expertiseSkills,
  proficientSavingThrows,
  onToggleSkillProficiency,
  onToggleExpertise,
  onToggleSavingThrowProficiency,
}: {
  formData: Partial<Character>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  proficientSkills: Set<string>;
  expertiseSkills: Set<string>;
  proficientSavingThrows: Set<string>;
  onToggleSkillProficiency: (skill: string) => void;
  onToggleExpertise: (skill: string) => void;
  onToggleSavingThrowProficiency: (ability: string) => void;
}) {
  const abilities: Array<{ key: keyof Character; label: string }> = [
    { key: "strength", label: "Strength" },
    { key: "dexterity", label: "Dexterity" },
    { key: "constitution", label: "Constitution" },
    { key: "intelligence", label: "Intelligence" },
    { key: "wisdom", label: "Wisdom" },
    { key: "charisma", label: "Charisma" },
  ];

  const totalPoints = abilities.reduce(
    (sum, a) => sum + ((formData[a.key] as number) || 0),
    0,
  );

  return (
    <div>
      <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
        Choose your character's Ability Points.
      </p>

      <div>
        {/* Ability Scores */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          {abilities.map((ability) => (
            <div
              key={ability.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                backgroundColor: "var(--input-background)",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
              }}
            >
              <label style={{ color: "var(--foreground)", fontWeight: 500 }}>
                {ability.label}
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="number"
                  name={ability.key as string}
                  value={(formData[ability.key] as number) || 10}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  style={{
                    width: "50px",
                    padding: "0.5rem",
                    border: "1px solid var(--border)",
                    borderRadius: "0.25rem",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    textAlign: "center",
                  }}
                />
                <div
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "0.875rem",
                  }}
                >
                  (
                  {formatAbilityMod(
                    getAbilityModifier((formData[ability.key] as number) || 10),
                  )}
                  )
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proficiency Bonus Section */}
        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "var(--card)",
              border: "2px solid var(--primary)",
              borderRadius: "0.5rem",
            }}
          >
            <h3
              style={{
                color: "var(--foreground)",
                marginTop: 0,
                marginBottom: "1rem",
              }}
            >
              Proficiency Bonus
            </h3>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <div
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "0.875rem",
                  }}
                >
                  Proficiency Bonus
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--primary)",
                  }}
                >
                  +
                  {getProficiencyBonus(
                    formData.level || 1,
                    formData.edition || "2014",
                  )}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "0.875rem",
                  }}
                >
                  Character Level
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--foreground)",
                  }}
                >
                  {formData.level || 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saving Throws Section */}
        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <h3
            style={{
              color: "var(--foreground)",
              marginTop: 0,
              marginBottom: "1rem",
            }}
          >
            Saving Throws
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {(["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const).map(
              (ability) => {
                const abilityScore = formData[
                  ability.toLowerCase() as keyof Character
                ] as number;
                const modifier = getAbilityModifier(abilityScore || 10);
                const profBonus = getProficiencyBonus(
                  formData.level || 1,
                  formData.edition || "2014",
                );
                const isProficient = proficientSavingThrows.has(ability);
                const total = modifier + (isProficient ? profBonus : 0);

                return (
                  <div
                    key={ability}
                    onClick={() => onToggleSavingThrowProficiency(ability)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem",
                      backgroundColor: "var(--input-background)",
                      borderRadius: "0.375rem",
                      border: `1px solid ${
                        isProficient ? "var(--primary)" : "var(--border)"
                      }`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLDivElement
                      ).style.backgroundColor = "var(--card)";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLDivElement
                      ).style.backgroundColor = "var(--input-background)";
                    }}
                  >
                    <label
                      style={{
                        color: "var(--foreground)",
                        fontWeight: isProficient ? 600 : 400,
                        cursor: "pointer",
                      }}
                    >
                      {ability}
                    </label>
                    <div
                      style={{
                        color: isProficient
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                        fontWeight: isProficient ? 600 : 400,
                      }}
                    >
                      {total > 0 ? "+" : ""}
                      {total}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <h3
            style={{
              color: "var(--foreground)",
              marginTop: 0,
              marginBottom: "1rem",
            }}
          >
            Skills
          </h3>
          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            Left click to toggle proficiency • Right click to toggle expertise
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {Object.entries(SKILL_ABILITY_MAP).map(([skill, ability]) => {
              const abilityScore = formData[
                ability.toLowerCase() as keyof Character
              ] as number;
              const modifier = getAbilityModifier(abilityScore || 10);
              const profBonus = getProficiencyBonus(
                formData.level || 1,
                formData.edition || "2014",
              );
              const isProficient = proficientSkills.has(skill);
              const hasExpertise = expertiseSkills.has(skill);
              const profBonus_ = isProficient
                ? hasExpertise
                  ? profBonus * 2
                  : profBonus
                : 0;
              const total = modifier + profBonus_;

              return (
                <div
                  key={skill}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onToggleExpertise(skill);
                  }}
                  onClick={() => onToggleSkillProficiency(skill)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "var(--input-background)",
                    borderRadius: "0.375rem",
                    border: `1px solid ${
                      hasExpertise
                        ? "var(--primary)"
                        : isProficient
                          ? "var(--primary)"
                          : "var(--border)"
                    }`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--card)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--input-background)";
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "var(--foreground)",
                        fontWeight: isProficient ? 600 : 400,
                        cursor: "pointer",
                      }}
                    >
                      {skill}
                    </label>
                    <div
                      style={{
                        color: "var(--muted-foreground)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {ability} {hasExpertise && "⭐ Expertise"}
                    </div>
                  </div>
                  <div
                    style={{
                      color: isProficient
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                      fontWeight: isProficient ? 600 : 400,
                    }}
                  >
                    {total > 0 ? "+" : ""}
                    {total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Classes Tab Component
function ClassesTab({
  formData,
  handleChange,
  primaryClass,
  selectedClass,
  classLevels,
  selectedSubclass,
  onSelectedClassChange,
  onClassLevelsChange,
  onSelectedSubclassChange,
  onAddClass,
  onRemoveClass,
  onClassLevelChange,
  onSetSubclass,
  expandedClassIndex,
  onExpandClass,
}: {
  formData: Partial<Character>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  primaryClass: any;
  selectedClass: string;
  classLevels: number;
  selectedSubclass: string;
  onSelectedClassChange: (cls: string) => void;
  onClassLevelsChange: (lvl: number) => void;
  onSelectedSubclassChange: (sub: string) => void;
  onAddClass: () => void;
  onRemoveClass: (name: string) => void;
  onClassLevelChange: (name: string, lvl: number) => void;
  onSetSubclass: (classIndex: number, subclass: string) => void;
  expandedClassIndex: number | null;
  onExpandClass: (idx: number | null) => void;
}) {
  const classes = formData.classes || [];
  const totalLevel = formData.level || 1;

  return (
    <div>
      <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
        Choose your character's Classes. You can multiclass by adding additional
        classes.
      </p>

      {/* Add Class Section */}
      <div
        style={{
          backgroundColor: "var(--input-background)",
          border: "1px solid var(--border)",
          borderRadius: "0.375rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            color: "var(--foreground)",
            marginBottom: "1rem",
            fontWeight: 600,
          }}
        >
          ADD CLASS
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "1rem",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label
              style={{
                color: "var(--foreground)",
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                onSelectedClassChange(e.target.value);
                onSelectedSubclassChange(""); // Reset subclass when class changes
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "0.375rem",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            >
              <option value="">Select a class...</option>
              {D20_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                color: "var(--foreground)",
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Subclass
            </label>
            <select
              value={selectedSubclass}
              onChange={(e) => onSelectedSubclassChange(e.target.value)}
              disabled={!selectedClass}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "0.375rem",
                backgroundColor: selectedClass
                  ? "var(--background)"
                  : "var(--muted-background)",
                color: selectedClass
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
                opacity: selectedClass ? 1 : 0.5,
              }}
            >
              <option value="">None</option>
              {selectedClass &&
                D20_SUBCLASSES[selectedClass]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label
              style={{
                color: "var(--foreground)",
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Levels
            </label>
            <input
              type="number"
              value={classLevels}
              onChange={(e) => {
                const newLevel = Math.max(1, parseInt(e.target.value) || 1);
                const currentClasses = formData.classes || [];
                const otherClassesTotal = currentClasses
                  .filter((c: any) => c.name !== selectedClass)
                  .reduce((sum: number, c: any) => sum + c.levels, 0);
                const maxAllowed = 20 - otherClassesTotal;
                onClassLevelsChange(Math.min(newLevel, maxAllowed));
              }}
              min="1"
              max={Math.max(
                1,
                20 -
                  (formData.classes || [])
                    .filter((c: any) => c.name !== selectedClass)
                    .reduce((sum: number, c: any) => sum + c.levels, 0),
              )}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "0.375rem",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                textAlign: "center",
              }}
            />
          </div>
          <button
            onClick={onAddClass}
            disabled={!selectedClass}
            style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid var(--primary)",
              borderRadius: "0.375rem",
              backgroundColor: selectedClass
                ? "var(--primary)"
                : "var(--muted-background)",
              color: selectedClass
                ? "var(--primary-foreground)"
                : "var(--muted-foreground)",
              fontWeight: 600,
              cursor: selectedClass ? "pointer" : "not-allowed",
              opacity: selectedClass ? 1 : 0.5,
            }}
          >
            + ADD
          </button>
        </div>
      </div>

      {/* Current Classes */}
      <div
        style={{
          backgroundColor: "var(--input-background)",
          border: "1px solid var(--border)",
          borderRadius: "0.375rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            color: "var(--foreground)",
            marginBottom: "1rem",
            fontWeight: 600,
          }}
        >
          CLASS LEVELS (Total: Level {totalLevel})
        </h3>

        {classes.length === 0 ? (
          <div
            style={{
              backgroundColor: "var(--background)",
              borderRadius: "0.375rem",
              padding: "1rem",
              textAlign: "center",
              color: "var(--muted-foreground)",
            }}
          >
            No classes added yet. Add your first class above.
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {classes.map((cls: any, idx: number) => {
              const subclassLevel = SUBCLASS_LEVEL[cls.name] || 3;
              const isExpanded = expandedClassIndex === idx;
              const hasSubclassAtThisLevel = Array.from({
                length: cls.levels,
              }).some((_, level) => level + 1 === subclassLevel);

              return (
                <div key={idx}>
                  {/* Class Header */}
                  <div
                    onClick={() => onExpandClass(isExpanded ? null : idx)}
                    style={{
                      backgroundColor: "var(--background)",
                      borderRadius: "0.375rem",
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: "var(--foreground)",
                          fontWeight: 500,
                          marginBottom: "0.5rem",
                        }}
                      >
                        Level 1: {cls.name}
                        {cls.levels > 1 && (
                          <span
                            style={{
                              marginLeft: "0.5rem",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            ({cls.levels})
                          </span>
                        )}
                      </div>
                      {cls.subclass && (
                        <div
                          style={{
                            color: "var(--primary)",
                            fontSize: "0.875rem",
                          }}
                        >
                          ✓ {cls.subclass}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      {/* Level Adjustment Buttons */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.25rem",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClassLevelChange(
                              cls.name,
                              Math.max(1, cls.levels - 1),
                            );
                          }}
                          style={{
                            width: "32px",
                            height: "32px",
                            padding: 0,
                            border: "1px solid var(--border)",
                            borderRadius: "0.25rem",
                            backgroundColor: "var(--input-background)",
                            color: "var(--foreground)",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                          title="Decrease level"
                        >
                          −
                        </button>
                        <span
                          style={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                            minWidth: "28px",
                            textAlign: "center",
                          }}
                        >
                          {cls.levels}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentTotal = (
                              formData.classes || []
                            ).reduce(
                              (sum: number, c: any) => sum + c.levels,
                              0,
                            );
                            const canIncrease = currentTotal < 20;
                            if (canIncrease) {
                              onClassLevelChange(cls.name, cls.levels + 1);
                            }
                          }}
                          disabled={
                            (formData.classes || []).reduce(
                              (sum: number, c: any) => sum + c.levels,
                              0,
                            ) >= 20
                          }
                          style={{
                            width: "32px",
                            height: "32px",
                            padding: 0,
                            border: "1px solid var(--border)",
                            borderRadius: "0.25rem",
                            backgroundColor:
                              (formData.classes || []).reduce(
                                (sum: number, c: any) => sum + c.levels,
                                0,
                              ) >= 20
                                ? "var(--muted-background)"
                                : "var(--input-background)",
                            color: "var(--foreground)",
                            cursor:
                              (formData.classes || []).reduce(
                                (sum: number, c: any) => sum + c.levels,
                                0,
                              ) >= 20
                                ? "not-allowed"
                                : "pointer",
                            fontWeight: 600,
                            fontSize: "1rem",
                            opacity:
                              (formData.classes || []).reduce(
                                (sum: number, c: any) => sum + c.levels,
                                0,
                              ) >= 20
                                ? 0.5
                                : 1,
                          }}
                          title="Increase level"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveClass(cls.name);
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1px solid var(--destructive)",
                          borderRadius: "0.25rem",
                          backgroundColor: "transparent",
                          color: "var(--destructive)",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        ✕
                      </button>
                      {/* Expand Arrow */}
                      <span
                        style={{
                          color: "var(--muted-foreground)",
                          transition: "transform 0.2s",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          display: "inline-block",
                          width: "20px",
                          textAlign: "center",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content - Subclass Selection */}
                  {isExpanded && hasSubclassAtThisLevel && (
                    <div
                      style={{
                        backgroundColor: "var(--input-background)",
                        borderLeft: "2px solid var(--primary)",
                        borderRight: "1px solid var(--border)",
                        borderBottom: "1px solid var(--border)",
                        borderBottomLeftRadius: "0.375rem",
                        borderBottomRightRadius: "0.375rem",
                        padding: "1rem",
                        marginTop: "-1px",
                      }}
                    >
                      <label
                        style={{
                          color: "var(--foreground)",
                          display: "block",
                          marginBottom: "0.75rem",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        Choose {cls.name} Subclass (Level {subclassLevel})
                      </label>
                      <select
                        value={cls.subclass || ""}
                        onChange={(e) => onSetSubclass(idx, e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid var(--border)",
                          borderRadius: "0.375rem",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                      >
                        <option value="">None / To be determined</option>
                        {D20_SUBCLASSES[cls.name]?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Spells Tab Component
function SpellsTab({
  formData,
  rules,
  primaryClass,
  onSpellsChange,
  language,
}: {
  formData: Partial<Character>;
  rules: any;
  primaryClass: any;
  onSpellsChange?: (spells: Spell[]) => void;
  language: string;
}) {
  const t = (key: string) => getTranslation(language as "en" | "es", key);
  const [spells, setSpells] = useState<Spell[]>(formData.spells || []);
  const [isPickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setSpells(formData.spells || []);
  }, [formData.spells]);

  const maxSpellLevel = useMemo(() => {
    // Prefer explicit spell slot data if available
    const slots = (formData as any)?.spellSlots;
    if (slots && typeof slots === "object") {
      const levels = Object.entries(slots)
        .filter(([k, v]) => v && typeof v === "object" && (v as any).max > 0)
        .map(([k]) => Number(k))
        .filter((n) => !Number.isNaN(n));
      if (levels.length) return Math.max(...levels);
    }

    // Fallback: derive from primary class + level using rules tables
    const className = primaryClass?.name || formData.class || "";
    const classLevel = primaryClass?.levels || formData.level || 1;
    const casterType = getCasterTypeSync(className);
    if (!casterType || casterType === "none") return 0;
    const normalizedCaster = casterType === "quarter" ? "half" : casterType;
    const slotsCalc = getSpellSlots([
      {
        level: Math.max(1, Math.min(20, Number(classLevel) || 1)),
        spellcasting: normalizedCaster,
        className: className || "",
      },
    ]);
    const levels = slotsCalc
      .map((max, idx) => (max > 0 ? idx + 1 : 0))
      .filter((n: number) => n > 0);
    return levels.length ? Math.max(...levels) : 0;
  }, [formData, primaryClass]);

  const addSpell = () => {
    const newSpell: Spell = {
      name: "Nuevo hechizo",
      level: 0,
      prepared: false,
    };
    const next = [...spells, newSpell];
    setSpells(next);
    onSpellsChange?.(next);
  };

  const updateSpell = (index: number, field: keyof Spell, value: any) => {
    setSpells((prev) => {
      const next = prev.map((spell, i) =>
        i === index ? { ...spell, [field]: value } : spell,
      );
      onSpellsChange?.(next);
      return next;
    });
  };

  const removeSpell = (index: number) => {
    setSpells((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onSpellsChange?.(next);
      return next;
    });
  };

  return (
    <div>
      <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>
        {t("characterCreation.spellsDesc")}
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setPickerOpen(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--secondary)",
            color: "var(--secondary-foreground)",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {t("characterCreation.importSpells")}
        </button>
        <button
          onClick={addSpell}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {t("characterCreation.addSpell")}
        </button>
      </div>

      {spells.length === 0 ? (
        <div
          style={{
            color: "var(--muted-foreground)",
            textAlign: "center",
            padding: "1rem",
            backgroundColor: "var(--input-background)",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
          }}
        >
          {t("characterCreation.noSpells")}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "0.5rem",
          }}
        >
          {spells.map((spell, idx) => (
            <div
              key={`spell-${idx}`}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr auto auto",
                gap: "0.75rem",
                padding: "0.75rem",
                backgroundColor: "var(--input-background)",
                border: "1px solid var(--border)",
                borderRadius: "0.375rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {t("characterCreation.spellName")}
                </label>
                <input
                  type="text"
                  value={spell.name}
                  onChange={(e) => updateSpell(idx, "name", e.target.value)}
                  style={{
                    padding: "0.5rem",
                    border: "1px solid var(--border)",
                    borderRadius: "0.25rem",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {t("characterCreation.spellLevel")}
                </label>
                <input
                  type="number"
                  min={0}
                  max={9}
                  value={spell.level}
                  onChange={(e) =>
                    updateSpell(
                      idx,
                      "level",
                      Math.max(0, parseInt(e.target.value) || 0),
                    )
                  }
                  style={{
                    padding: "0.5rem",
                    border: "1px solid var(--border)",
                    borderRadius: "0.25rem",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--foreground)",
                  fontSize: "0.875rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={spell.prepared || false}
                  onChange={(e) =>
                    updateSpell(idx, "prepared", e.target.checked)
                  }
                  style={{ cursor: "pointer" }}
                />
                {t("characterCreation.prepared")}
              </label>

              <button
                onClick={() => removeSpell(idx)}
                style={{
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
                aria-label="Eliminar hechizo"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <SpellPickerModal
        open={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(s: Spell) => {
          const next = [...spells, s];
          setSpells(next);
          onSpellsChange?.(next);
        }}
        className={primaryClass?.name?.toLowerCase?.()}
        subclass={(primaryClass?.subclassIndex || primaryClass?.subclass || "")
          ?.toString()
          ?.toLowerCase?.()}
        maxSpellLevel={maxSpellLevel}
      />
    </div>
  );
}

// Helper Functions
function formatAbilityMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
