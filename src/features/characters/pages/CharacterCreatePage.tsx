import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/features/auth/store";
import useCharacterStore, { Character } from "../store";
import { getBackgroundOptions } from "@/rules/backgrounds";
import { getAbilityModifier } from "@/rules/skillAbilityMap";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

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

type TabType = "background" | "abilities" | "classes";

export default function CharacterCreatePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { createCharacter, isLoading, error } = useCharacterStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [activeTab, setActiveTab] = useState<TabType>("background");
  const [formData, setFormData] = useState({
    name: "",
    race: "Human",
    class: "Barbarian",
    level: 1,
    backgroundId: "",
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    hitPoints: 10,
    maxHitPoints: 10,
    armorClass: 10,
    alignment: "Neutral Good",
    notes: "",
    edition: "2014",
  });

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
          : name === "strength" ||
              name === "dexterity" ||
              name === "constitution" ||
              name === "intelligence" ||
              name === "wisdom" ||
              name === "charisma" ||
              name === "hitPoints" ||
              name === "maxHitPoints" ||
              name === "armorClass"
            ? parseInt(value) || 10
            : name === "edition"
              ? (value as "2014" | "2024")
              : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert(t("errors.mustBeLoggedIn"));
      return;
    }

    try {
      const characterData: Character = {
        name: formData.name,
        race: formData.race,
        level: formData.level,
        experience: 0,
        hitPoints: formData.hitPoints,
        maxHitPoints: formData.maxHitPoints,
        armorClass: formData.armorClass,
        strength: formData.strength,
        dexterity: formData.dexterity,
        constitution: formData.constitution,
        intelligence: formData.intelligence,
        wisdom: formData.wisdom,
        charisma: formData.charisma,
        alignment: formData.alignment,
        notes: formData.notes,
        edition: (formData.edition as "2014" | "2024") || "2014",
        backgroundId: formData.backgroundId || undefined,
        classes: [
          {
            name: formData.class,
            levels: formData.level,
            index: formData.class.toLowerCase(),
          },
        ],
      };

      const created = await createCharacter(characterData, token);
      navigate(`/characters/${created.id}`);
    } catch (err) {
      console.error("Failed to create character:", err);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "background", label: t("characterCreation.backgroundTab") },
    { id: "abilities", label: t("characterCreation.abilitiesTab") },
    { id: "classes", label: t("characterCreation.classesTab") },
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
        <h1
          style={{
            color: "var(--foreground)",
            fontSize: "1.875rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {t("characterCreation.title")}
        </h1>

        {error && (
          <div
            className="mb-4 p-3 rounded"
            style={{ backgroundColor: "#fde2e2", color: "#8b2635" }}
          >
            {t("characterCreation.error")}: {error}
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
                backgroundColor: "transparent",
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
            marginBottom: "2rem",
          }}
        >
          {activeTab === "background" && (
            <div>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  marginBottom: "2rem",
                }}
              >
                {t("characterCreation.backgroundDesc")}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "2rem",
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
                    {t("characterCreation.characterName")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t(
                      "characterCreation.characterNamePlaceholder",
                    )}
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
                    {t("characterCreation.race")}
                  </label>
                  <select
                    name="race"
                    value={formData.race}
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
                    {t("characterCreation.background")}
                  </label>
                  <select
                    name="backgroundId"
                    value={formData.backgroundId}
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
                    <option value="">
                      {t("characterCreation.backgroundPlaceholder")}
                    </option>
                    {getBackgroundOptions().map((bg) => (
                      <option key={bg.id} value={bg.id}>
                        {bg.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                    {t("characterCreation.alignment")}
                  </label>
                  <select
                    name="alignment"
                    value={formData.alignment}
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
                    <option>Lawful Good</option>
                    <option>Neutral Good</option>
                    <option>Chaotic Good</option>
                    <option>Lawful Neutral</option>
                    <option>True Neutral</option>
                    <option>Chaotic Neutral</option>
                    <option>Lawful Evil</option>
                    <option>Neutral Evil</option>
                    <option>Chaotic Evil</option>
                  </select>
                </div>

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
                    {t("characterCreation.edition")}
                  </label>
                  <select
                    name="edition"
                    value={formData.edition}
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
                    <option value="2014">D&D 5e (2014)</option>
                    <option value="2024">D&D 5e (2024)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "abilities" && (
            <div>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  marginBottom: "2rem",
                }}
              >
                {t("characterCreation.abilitiesDesc")}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1.5rem",
                }}
              >
                {(
                  [
                    { key: "strength", label: "Strength" },
                    { key: "dexterity", label: "Dexterity" },
                    { key: "constitution", label: "Constitution" },
                    { key: "intelligence", label: "Intelligence" },
                    { key: "wisdom", label: "Wisdom" },
                    { key: "charisma", label: "Charisma" },
                  ] as const
                ).map((ability) => (
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
                    <label
                      style={{ color: "var(--foreground)", fontWeight: 500 }}
                    >
                      {ability.label}
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="number"
                        name={ability.key}
                        value={formData[ability.key]}
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
                          getAbilityModifier(formData[ability.key]),
                        )}
                        )
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "classes" && (
            <div>
              <p
                style={{
                  color: "var(--muted-foreground)",
                  marginBottom: "2rem",
                }}
              >
                {t("characterCreation.classesDesc")}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "2rem",
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
                    {t("characterCreation.class")}
                  </label>
                  <select
                    name="class"
                    value={formData.class}
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
                    {t("characterCreation.level")}
                  </label>
                  <input
                    type="number"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    min="1"
                    max="20"
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
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/characters")}
            style={{
              padding: "0.75rem 2rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
              fontWeight: 600,
              cursor: "pointer",
            }}
            disabled={isLoading}
          >
            {t("characterCreation.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.name}
            style={{
              padding: "0.75rem 2rem",
              border: "none",
              borderRadius: "0.375rem",
              backgroundColor: formData.name
                ? "var(--primary)"
                : "var(--muted-foreground)",
              color: "var(--primary-foreground)",
              fontWeight: 600,
              cursor: formData.name ? "pointer" : "not-allowed",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading
              ? t("characterCreation.creating")
              : t("characterCreation.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatAbilityMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
