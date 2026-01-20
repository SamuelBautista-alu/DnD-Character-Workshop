import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/features/auth/store";
import useCharacterStore from "../store";
import { Character } from "../store";
import { getBackgroundOptions } from "@/rules/backgrounds";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";
import {
  SKILL_ABILITY_MAP,
  getAbilityModifier,
  formatModifier,
} from "@/rules/skillAbilityMap";
import { getProficiencyBonus } from "@/rules/proficiency";
import type { Skill } from "@/rules/editions/rules2014";

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
const D20_ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const {
    currentCharacter,
    isLoading,
    error,
    fetchCharacter,
    updateCharacter,
    deleteCharacter,
  } = useCharacterStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Character>>(
    currentCharacter ? { ...currentCharacter } : { edition: "2014" },
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id && token) {
      fetchCharacter(parseInt(id), token);
    }
  }, [id, token, fetchCharacter]);

  useEffect(() => {
    if (currentCharacter) {
      setFormData(currentCharacter);
    }
  }, [currentCharacter]);

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

  const handleSave = async () => {
    if (!token || !currentCharacter?.id) return;
    try {
      await updateCharacter(currentCharacter.id, formData, token);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update character:", err);
    }
  };

  const handleDelete = async () => {
    if (!token || !currentCharacter?.id) return;
    try {
      await deleteCharacter(currentCharacter.id, token);
      navigate("/characters");
    } catch (err) {
      console.error("Failed to delete character:", err);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        <p style={{ color: "var(--foreground)" }}>
          {t("characterDetail.loading")}
        </p>
      </div>
    );
  }

  if (!currentCharacter) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--foreground)" }}>
            {t("characterDetail.notFound")}
          </p>
          <Link
            to="/characters"
            className="inline-block px-6 py-2 rounded font-semibold"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {t("characterDetail.backToCharacters")}
          </Link>
        </div>
      </div>
    );
  }

  const primaryClass =
    currentCharacter.classes && currentCharacter.classes.length > 0
      ? currentCharacter.classes[0]
      : undefined;

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {currentCharacter.name}
          </h1>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--chart-2)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {t("characterDetail.save")}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(currentCharacter);
                  }}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                >
                  {t("characterDetail.cancel")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/characters/${id}/gamemode`)}
                  className="px-4 py-2 rounded font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                >
                  {t("characterDetail.play")}
                </button>
                <button
                  onClick={() => navigate(`/characters/${id}/build`)}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                >
                  {t("characterDetail.edit")}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--destructive)",
                    color: "var(--destructive-foreground)",
                  }}
                >
                  {t("characterDetail.delete")}
                </button>
              </>
            )}
            <Link
              to="/characters"
              className="inline-block px-4 py-2 rounded font-semibold"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-foreground)",
              }}
            >
              {t("characterDetail.back")}
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

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="rounded-lg shadow-lg p-8 max-w-md"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                {t("characterDetail.confirmDelete")}
              </h2>
              <p className="mb-6" style={{ color: "var(--muted-foreground)" }}>
                {t("characterDetail.deleteConfirm")}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded font-semibold"
                  style={{
                    backgroundColor: "var(--destructive)",
                    color: "var(--destructive-foreground)",
                  }}
                >
                  {t("characterDetail.yes")}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded font-semibold"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                >
                  {t("characterDetail.no")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Info */}
          <div
            className="lg:col-span-2 rounded-lg shadow p-6"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Basic Info */}
            <div className="mb-6">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                {t("characterDetail.basicInfo")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("characterCreation.characterName")}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px var(--ring)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  ) : (
                    <p style={{ color: "var(--foreground)" }}>
                      {currentCharacter.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("characterCreation.class")}
                  </label>
                  {isEditing ? (
                    <select
                      name="class"
                      value={formData.class || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px var(--ring)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {D20_CLASSES.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p style={{ color: "var(--foreground)" }}>
                      {primaryClass
                        ? `${primaryClass.name} ${primaryClass.levels}`
                        : currentCharacter.class}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("characterCreation.race")}
                  </label>
                  {isEditing ? (
                    <select
                      name="race"
                      value={formData.race || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px var(--ring)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {D20_RACES.map((race) => (
                        <option key={race} value={race}>
                          {race}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p style={{ color: "var(--foreground)" }}>
                      {currentCharacter.race}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("characterCreation.level")}
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="level"
                      value={formData.level || ""}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px var(--ring)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  ) : (
                    <p style={{ color: "var(--foreground)" }}>
                      {currentCharacter.level}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("characterCreation.edition")}
                  </label>
                  {isEditing ? (
                    <select
                      name="edition"
                      value={(formData as any).edition || "2014"}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px var(--ring)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <option value="2014">2014</option>
                      <option value="2024">2024</option>
                    </select>
                  ) : (
                    <p style={{ color: "var(--foreground)" }}>
                      {(currentCharacter as any).edition || "2014"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("characterCreation.background")}
                  </label>
                  {isEditing ? (
                    <select
                      name="backgroundId"
                      value={(formData as any).backgroundId || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px var(--ring)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "none";
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
                  ) : (
                    <p style={{ color: "var(--foreground)" }}>
                      {(() => {
                        const bgId = (formData as any).backgroundId;
                        const bgMatch = getBackgroundOptions().find(
                          (bg) => String(bg.id) === String(bgId),
                        );
                        return (
                          bgMatch?.name || t("characterDetail.backgroundNone")
                        );
                      })()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ability Scores */}
            <div className="mb-6">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                {t("characterDetail.abilityScores")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <div key={ability}>
                    <label
                      className="block text-sm font-semibold mb-1 capitalize"
                      style={{ color: "var(--foreground)" }}
                    >
                      {ability}
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name={ability}
                        value={formData[ability] || ""}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid var(--border)",
                          borderRadius: "0.375rem",
                          backgroundColor: "var(--input-background)",
                          color: "var(--foreground)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 0 0 2px var(--ring)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    ) : (
                      <p
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {currentCharacter[ability]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                Skills
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(SKILL_ABILITY_MAP) as Skill[]).map((skill) => {
                  const ability = SKILL_ABILITY_MAP[skill];
                  const abilityKey =
                    ability.toLowerCase() as keyof typeof currentCharacter;
                  const abilityScore =
                    (currentCharacter[abilityKey] as number) || 10;
                  const profBonus = getProficiencyBonus(
                    currentCharacter.level,
                    currentCharacter.edition || "2014",
                  );
                  const isProficient =
                    currentCharacter.proficientSkills?.includes(skill) || false;
                  const hasExpertise =
                    currentCharacter.expertiseSkills?.includes(skill) || false;

                  const abilityMod = getAbilityModifier(abilityScore);
                  const skillMod =
                    abilityMod +
                    (isProficient
                      ? hasExpertise
                        ? profBonus * 2
                        : profBonus
                      : 0);

                  return (
                    <div
                      key={skill}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem",
                        backgroundColor: isProficient
                          ? "var(--accent)"
                          : "var(--muted)",
                        borderRadius: "0.25rem",
                        opacity: isProficient ? 1 : 0.6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--foreground)",
                          fontWeight: isProficient ? 600 : 400,
                        }}
                      >
                        {skill} {hasExpertise && "★"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        {formatModifier(skillMod)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Character Summary Card */}
          <div
            className="rounded-lg shadow p-6"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--foreground)" }}
            >
              {t("characterDetail.summary")}
            </h2>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("characterDetail.hp")}
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--primary)" }}
              >
                {currentCharacter.hitPoints}
              </p>
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("characterDetail.ac")}
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--primary)" }}
              >
                {currentCharacter.armorClass}
              </p>
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t("characterCreation.alignment")}
              </p>
              <p className="text-sm" style={{ color: "var(--primary)" }}>
                {currentCharacter.alignment}
              </p>
            </div>
            <hr className="my-4" style={{ borderColor: "var(--border)" }} />
            <div className="space-y-3">
              {/* Saving Throws */}
              <div className="space-y-2">
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Saving Throws
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { abbrev: "STR", ability: "strength", label: "STR" },
                    { abbrev: "DEX", ability: "dexterity", label: "DEX" },
                    { abbrev: "CON", ability: "constitution", label: "CON" },
                    { abbrev: "INT", ability: "intelligence", label: "INT" },
                    { abbrev: "WIS", ability: "wisdom", label: "WIS" },
                    { abbrev: "CHA", ability: "charisma", label: "CHA" },
                  ].map(({ abbrev, ability, label }) => {
                    const abilityScore = currentCharacter[
                      ability as keyof typeof currentCharacter
                    ] as number;
                    const abilityMod = getAbilityModifier(abilityScore);
                    const profBonus = getProficiencyBonus(
                      currentCharacter.level,
                      currentCharacter.edition || "2014",
                    );
                    const isProficient =
                      currentCharacter.proficientSavingThrows?.includes(
                        abbrev,
                      ) || false;
                    const saveMod = abilityMod + (isProficient ? profBonus : 0);

                    return (
                      <div
                        key={abbrev}
                        className="flex items-center justify-between px-2 py-1 rounded"
                        style={{
                          backgroundColor: isProficient
                            ? "var(--accent)"
                            : "var(--muted)",
                          opacity: isProficient ? 1 : 0.7,
                        }}
                      >
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {isProficient && "● "}
                          {formatModifier(saveMod)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <hr className="my-4" style={{ borderColor: "var(--border)" }} />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    STR
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatModifier(
                      getAbilityModifier(currentCharacter.strength),
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    DEX
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatModifier(
                      getAbilityModifier(currentCharacter.dexterity),
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    CON
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatModifier(
                      getAbilityModifier(currentCharacter.constitution),
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    INT
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatModifier(
                      getAbilityModifier(currentCharacter.intelligence),
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    WIS
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatModifier(
                      getAbilityModifier(currentCharacter.wisdom),
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    CHA
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatModifier(
                      getAbilityModifier(currentCharacter.charisma),
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
