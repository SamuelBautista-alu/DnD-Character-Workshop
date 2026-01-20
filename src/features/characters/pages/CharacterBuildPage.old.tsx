import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useEffect as useEffectHook,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/features/auth/store";
import useCharacterStore from "../store";
import { Character } from "../store";
import { getBackgroundOptions, getBackground } from "@/rules/backgrounds";
import { getFeatOptions, getFeat } from "@/rules/feats";
import { getSpell } from "@/rules/spells";
import { RULES_2014, RULES_2024 } from "@/rules";
import SpellPicker from "../components/SpellPicker";
import { SkillSelector } from "../components/SkillSelector";
import {
  SKILL_ABILITY_MAP,
  getAbilityModifier,
  getSkillModifier,
  getSaveModifier,
  formatModifier,
} from "@/rules/skillAbilityMap";
import type { Skill } from "@/rules/editions/rules2014";
import type { Ability } from "../types";

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

export default function CharacterBuildPage() {
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

  const [isEditing, setIsEditing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSpellPicker, setShowSpellPicker] = useState(false);
  const [showSkillSelector, setShowSkillSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<"build" | "sheet">("build");
  const [formData, setFormData] = useState<Partial<Character>>(
    currentCharacter ? { ...currentCharacter } : { edition: "2014" }
  );

  const fetchCharacterData = useCallback(() => {
    if (id && token) {
      fetchCharacter(parseInt(id), token);
    }
  }, [id, token, fetchCharacter]);

  useEffectHook(() => {
    fetchCharacterData();
  }, [fetchCharacterData]);

  useEffectHook(() => {
    if (currentCharacter) {
      setFormData(currentCharacter);
    }
  }, [currentCharacter]);

  const rules = useMemo(
    () => ((formData as any)?.edition === "2024" ? RULES_2024 : RULES_2014),
    [(formData as any)?.edition]
  );

  const currentBackground = useMemo(
    () => getBackground((formData as any)?.backgroundId),
    [(formData as any)?.backgroundId]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  const handleLevelChoiceChange = (field: string, value: any) => {
    const classProgression = (formData as any)?.classProgression || [];
    const levelIndex = classProgression.findIndex(
      (lp: any) => lp.level === selectedLevel
    );

    if (levelIndex >= 0) {
      // Update existing level progression
      const updated = [...classProgression];
      updated[levelIndex] = {
        ...updated[levelIndex],
        [field]: value,
      };
      setFormData({
        ...formData,
        classProgression: updated,
      } as any);
    } else {
      // Create new level progression entry
      const newEntry: any = {
        level: selectedLevel,
        [field]: value,
      };
      setFormData({
        ...formData,
        classProgression: [...classProgression, newEntry],
      } as any);
    }
  };

  const getCurrentLevelProgression = () => {
    const classProgression = (formData as any)?.classProgression || [];
    return classProgression.find((lp: any) => lp.level === selectedLevel) || {};
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        <p style={{ color: "var(--foreground)" }}>Loading character...</p>
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

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        color: "var(--foreground)",
      }}
      className="p-4"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{currentCharacter.name}</h1>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--destructive)",
                    color: "var(--destructive-foreground)",
                  }}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded font-semibold transition-all"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                >
                  Cancel
                </button>
              </>
            )}
            <Link
              to="/characters"
              className="px-4 py-2 rounded font-semibold"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--secondary-foreground)",
              }}
            >
              Back
            </Link>
          </div>
        </div>

        {error && (
          <div
            className="p-3 rounded mb-4"
            style={{ backgroundColor: "#fde2e2", color: "#8b2635" }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Mobile Tabs (shown on small screens) */}
      <div className="md:hidden max-w-7xl mx-auto mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("build")}
            className={`flex-1 px-4 py-2 rounded font-semibold transition-all ${
              activeTab === "build" ? "opacity-100" : "opacity-60"
            }`}
            style={{
              backgroundColor:
                activeTab === "build" ? "var(--primary)" : "var(--secondary)",
              color:
                activeTab === "build"
                  ? "var(--primary-foreground)"
                  : "var(--secondary-foreground)",
            }}
          >
            Build
          </button>
          <button
            onClick={() => setActiveTab("sheet")}
            className={`flex-1 px-4 py-2 rounded font-semibold transition-all ${
              activeTab === "sheet" ? "opacity-100" : "opacity-60"
            }`}
            style={{
              backgroundColor:
                activeTab === "sheet" ? "var(--primary)" : "var(--secondary)",
              color:
                activeTab === "sheet"
                  ? "var(--primary-foreground)"
                  : "var(--secondary-foreground)",
            }}
          >
            Sheet
          </button>
        </div>
      </div>

      {/* Main Content: Two-Pane Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Pane: Level Track (hidden on mobile unless Build tab) */}
          {(activeTab === "build" || window.innerWidth >= 768) && (
            <div
              className="md:col-span-1 rounded-lg shadow p-6"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "var(--foreground)" }}
              >
                Level Track
              </h2>

              {/* Level List */}
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`w-full px-4 py-2 rounded transition-all text-sm font-semibold ${
                      selectedLevel === level ? "ring-2" : "hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor:
                        selectedLevel === level
                          ? "var(--primary)"
                          : "var(--secondary)",
                      color:
                        selectedLevel === level
                          ? "var(--primary-foreground)"
                          : "var(--secondary-foreground)",
                      boxShadow:
                        selectedLevel === level
                          ? `0 0 0 2px var(--ring)`
                          : undefined,
                    }}
                  >
                    Level {level}
                  </button>
                ))}
              </div>

              {/* Per-Level Choices Card */}
              <div
                className="rounded p-4"
                style={{
                  backgroundColor: "var(--secondary)",
                  borderLeft: "4px solid var(--primary)",
                }}
              >
                <h3 className="font-semibold mb-3">
                  Level {selectedLevel} Choices
                </h3>

                <div className="space-y-3">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Class
                    </label>
                    {isEditing ? (
                      <select
                        value={getCurrentLevelProgression().classId || ""}
                        onChange={(e) =>
                          handleLevelChoiceChange("classId", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          backgroundColor: "var(--input-background)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                          borderRadius: "0.375rem",
                        }}
                      >
                        <option value="">Select a class</option>
                        {D20_CLASSES.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p style={{ fontSize: "0.875rem" }}>
                        {getCurrentLevelProgression().classId || "None"}
                      </p>
                    )}
                  </div>

                  {selectedLevel >= 3 && (
                    <div>
                      <label
                        className="block text-sm font-semibold mb-1"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Subclass
                      </label>
                      {isEditing ? (
                        <select
                          value={getCurrentLevelProgression().subclassId || ""}
                          onChange={(e) =>
                            handleLevelChoiceChange(
                              "subclassId",
                              e.target.value
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            backgroundColor: "var(--input-background)",
                            color: "var(--foreground)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.375rem",
                          }}
                        >
                          <option value="">None</option>
                          {/* Subclass options would be populated based on selected class */}
                        </select>
                      ) : (
                        <p style={{ fontSize: "0.875rem" }}>
                          {getCurrentLevelProgression().subclassId || "None"}
                        </p>
                      )}
                    </div>
                  )}

                  {[4, 8, 12, 16, 19].includes(selectedLevel) && (
                    <div
                      className="space-y-3 p-3 rounded"
                      style={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        ASI / Feat Choice
                      </label>

                      {/* Step 1: Choose ASI or Feat */}
                      {isEditing && (
                        <div className="space-y-2 mb-3">
                          <div
                            className="text-xs"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            Choose type:
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleLevelChoiceChange("asiChoice", "ability")
                              }
                              className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
                                (getCurrentLevelProgression() as any)
                                  ?.asiChoice === "ability"
                                  ? "ring-2"
                                  : "opacity-70 hover:opacity-100"
                              }`}
                              style={{
                                backgroundColor:
                                  (getCurrentLevelProgression() as any)
                                    ?.asiChoice === "ability"
                                    ? "var(--primary)"
                                    : "var(--secondary)",
                                color:
                                  (getCurrentLevelProgression() as any)
                                    ?.asiChoice === "ability"
                                    ? "var(--primary-foreground)"
                                    : "var(--secondary-foreground)",
                                boxShadow:
                                  (getCurrentLevelProgression() as any)
                                    ?.asiChoice === "ability"
                                    ? `0 0 0 2px var(--ring)`
                                    : undefined,
                              }}
                            >
                              Ability +2
                            </button>
                            <button
                              onClick={() =>
                                handleLevelChoiceChange("asiChoice", "feat")
                              }
                              className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
                                (getCurrentLevelProgression() as any)
                                  ?.asiChoice === "feat"
                                  ? "ring-2"
                                  : "opacity-70 hover:opacity-100"
                              }`}
                              style={{
                                backgroundColor:
                                  (getCurrentLevelProgression() as any)
                                    ?.asiChoice === "feat"
                                    ? "var(--primary)"
                                    : "var(--secondary)",
                                color:
                                  (getCurrentLevelProgression() as any)
                                    ?.asiChoice === "feat"
                                    ? "var(--primary-foreground)"
                                    : "var(--secondary-foreground)",
                                boxShadow:
                                  (getCurrentLevelProgression() as any)
                                    ?.asiChoice === "feat"
                                    ? `0 0 0 2px var(--ring)`
                                    : undefined,
                              }}
                            >
                              Feat
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 2a: Ability Score Selector */}
                      {((getCurrentLevelProgression() as any)?.asiChoice ===
                        "ability" ||
                        (!isEditing &&
                          (getCurrentLevelProgression() as any)
                            ?.abilityScoreIncrement)) && (
                        <div>
                          <label
                            className="block text-xs font-semibold mb-1"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            Choose Ability:
                          </label>
                          {isEditing ? (
                            <select
                              value={
                                (getCurrentLevelProgression() as any)
                                  ?.abilityScoreIncrement || ""
                              }
                              onChange={(e) =>
                                handleLevelChoiceChange(
                                  "abilityScoreIncrement",
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                backgroundColor: "var(--input-background)",
                                color: "var(--foreground)",
                                border: "1px solid var(--border)",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <option value="">Select ability</option>
                              <option value="STR">Strength +2</option>
                              <option value="DEX">Dexterity +2</option>
                              <option value="CON">Constitution +2</option>
                              <option value="INT">Intelligence +2</option>
                              <option value="WIS">Wisdom +2</option>
                              <option value="CHA">Charisma +2</option>
                            </select>
                          ) : (
                            <p style={{ fontSize: "0.875rem" }}>
                              {(getCurrentLevelProgression() as any)
                                ?.abilityScoreIncrement
                                ? `${
                                    (getCurrentLevelProgression() as any)
                                      ?.abilityScoreIncrement
                                  } +2`
                                : "None selected"}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Step 2b: Feat Selector */}
                      {((getCurrentLevelProgression() as any)?.asiChoice ===
                        "feat" ||
                        (!isEditing &&
                          (getCurrentLevelProgression() as any)?.featIds
                            ?.length)) && (
                        <div>
                          <label
                            className="block text-xs font-semibold mb-1"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            Choose Feat:
                          </label>
                          {isEditing ? (
                            <select
                              value={
                                ((getCurrentLevelProgression() as any)
                                  ?.featIds || [])[0] || ""
                              }
                              onChange={(e) =>
                                handleLevelChoiceChange(
                                  "featIds",
                                  e.target.value ? [e.target.value] : []
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                backgroundColor: "var(--input-background)",
                                color: "var(--foreground)",
                                border: "1px solid var(--border)",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                              }}
                            >
                              <option value="">Select feat</option>
                              {getFeatOptions("all").map((feat) => (
                                <option key={feat.id} value={feat.id}>
                                  {feat.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p style={{ fontSize: "0.875rem" }}>
                              {(() => {
                                const featId = ((
                                  getCurrentLevelProgression() as any
                                )?.featIds || [])[0];
                                const feat = featId ? getFeat(featId) : null;
                                return feat?.name || "None selected";
                              })()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Show feat details in view mode */}
                      {!isEditing &&
                        (getCurrentLevelProgression() as any)?.featIds
                          ?.length && (
                          <div
                            style={{
                              backgroundColor: "var(--card)",
                              padding: "0.75rem",
                              borderRadius: "0.375rem",
                              borderLeft: "3px solid var(--primary)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {(() => {
                              const featId = ((
                                getCurrentLevelProgression() as any
                              )?.featIds || [])[0];
                              const feat = featId ? getFeat(featId) : null;
                              return feat ? (
                                <div>
                                  <div className="font-semibold mb-1">
                                    {feat.name}
                                  </div>
                                  <div
                                    style={{
                                      color: "var(--muted-foreground)",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    {feat.description}
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                    </div>
                  )}

                  {/* Spellcasting: show spell picker at certain levels */}
                  {selectedLevel >= 1 && (
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Spells
                      </label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => setShowSpellPicker(true)}
                            className="w-full px-4 py-2 rounded font-semibold transition-all"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "var(--primary-foreground)",
                            }}
                          >
                            Choose Spells (
                            {
                              (getCurrentLevelProgression().spellIds || [])
                                .length
                            }
                            )
                          </button>
                          {(getCurrentLevelProgression().spellIds || [])
                            .length > 0 && (
                            <div
                              className="text-xs p-2 rounded max-h-20 overflow-y-auto"
                              style={{
                                backgroundColor: "var(--secondary)",
                                color: "var(--secondary-foreground)",
                              }}
                            >
                              {(
                                getCurrentLevelProgression().spellIds || []
                              ).map((spellId: string) => {
                                const spell = getSpell(spellId);
                                return spell ? (
                                  <div key={spellId} className="mb-1">
                                    • {spell.name}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {(getCurrentLevelProgression().spellIds || [])
                            .length === 0 ? (
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              No spells selected
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {(
                                getCurrentLevelProgression().spellIds || []
                              ).map((spellId: string) => {
                                const spell = getSpell(spellId);
                                return spell ? (
                                  <div
                                    key={spellId}
                                    className="text-xs p-2 rounded"
                                    style={{
                                      backgroundColor: "var(--secondary)",
                                      color: "var(--secondary-foreground)",
                                    }}
                                  >
                                    <span className="font-semibold">
                                      {spell.name}
                                    </span>
                                    <span style={{ opacity: 0.7 }}>
                                      {" "}
                                      • Lv{" "}
                                      {spell.level === 0
                                        ? "Cantrip"
                                        : spell.level}
                                    </span>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Pane: Live Sheet (hidden on mobile unless Sheet tab) */}
          {(activeTab === "sheet" || window.innerWidth >= 768) && (
            <div className="md:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div
                className="rounded-lg shadow p-6"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Name
                    </p>
                    <p>{currentCharacter.name}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Class
                    </p>
                    <p>{currentCharacter.class}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Race
                    </p>
                    <p>{currentCharacter.race}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Level
                    </p>
                    <p>{currentCharacter.level}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Edition
                    </p>
                    <p>{(currentCharacter as any)?.edition || "2014"}</p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Alignment
                    </p>
                    <p>{currentCharacter.alignment}</p>
                  </div>
                </div>
              </div>

              {/* Abilities Card */}
              <div
                className="rounded-lg shadow p-6"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2 className="text-xl font-semibold mb-4">Ability Scores</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "strength", label: "STR" },
                    { key: "dexterity", label: "DEX" },
                    { key: "constitution", label: "CON" },
                    { key: "intelligence", label: "INT" },
                    { key: "wisdom", label: "WIS" },
                    { key: "charisma", label: "CHA" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <p
                        className="text-xs font-semibold mb-1 text-center"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {label}
                      </p>
                      <p className="text-center text-lg font-bold">
                        {(currentCharacter as any)[key] || 10}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills and Saves Card */}
              <div
                className="rounded-lg shadow p-6"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Skills & Saves</h2>
                  {/* Button to select skills from class */}
                  {(currentCharacter as any).classes?.[0] && (
                    <button
                      onClick={() => setShowSkillSelector(true)}
                      className="px-3 py-1 rounded text-sm font-medium"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      Select Skills
                    </button>
                  )}
                </div>

                {/* Saving Throws */}
                <div className="mb-4">
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Proficient Saving Throws
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(currentCharacter as any).derived?.savingThrows?.length >
                    0 ? (
                      (currentCharacter as any).derived.savingThrows.map(
                        (save: Ability) => {
                          const abilityKey =
                            save.toLowerCase() as Lowercase<Ability>;
                          const abilityScore =
                            (currentCharacter as any)[abilityKey] || 10;
                          const profBonus =
                            (currentCharacter as any).derived
                              ?.proficiencyBonus || 2;
                          const modifier = getSaveModifier(
                            save,
                            abilityScore,
                            profBonus,
                            true
                          );

                          return (
                            <span
                              key={save}
                              className="px-3 py-1 rounded text-sm font-semibold"
                              style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--primary-foreground)",
                              }}
                            >
                              {save} {formatModifier(modifier)}
                            </span>
                          );
                        }
                      )
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        No saving throw proficiencies
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Proficient Skills
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(currentCharacter as any).derived?.skills?.length > 0 ? (
                      (currentCharacter as any).derived.skills.map(
                        (skill: Skill) => {
                          const ability = SKILL_ABILITY_MAP[skill];
                          const abilityKey =
                            ability.toLowerCase() as Lowercase<Ability>;
                          const abilityScores = {
                            str: (currentCharacter as any).strength || 10,
                            dex: (currentCharacter as any).dexterity || 10,
                            con: (currentCharacter as any).constitution || 10,
                            int: (currentCharacter as any).intelligence || 10,
                            wis: (currentCharacter as any).wisdom || 10,
                            cha: (currentCharacter as any).charisma || 10,
                          };
                          const profBonus =
                            (currentCharacter as any).derived
                              ?.proficiencyBonus || 2;
                          const expertiseSkills =
                            (currentCharacter as any).derived
                              ?.expertiseSkills || [];
                          const hasExpertise = expertiseSkills.includes(skill);
                          const modifier = getSkillModifier(
                            skill,
                            abilityScores,
                            profBonus,
                            true,
                            hasExpertise
                          );

                          return (
                            <div
                              key={skill}
                              className="px-3 py-2 rounded text-sm flex justify-between items-center"
                              style={{
                                backgroundColor: hasExpertise
                                  ? "var(--primary)"
                                  : "var(--secondary)",
                                color: hasExpertise
                                  ? "var(--primary-foreground)"
                                  : "var(--secondary-foreground)",
                              }}
                            >
                              <span className="font-medium">{skill}</span>
                              <span className="font-bold">
                                {formatModifier(modifier)} {hasExpertise && "★"}
                              </span>
                            </div>
                          );
                        }
                      )
                    ) : (
                      <p
                        className="text-sm col-span-2"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        No skill proficiencies
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Spellcasting Card */}
              {(currentCharacter as any).derived?.spellcasting
                ?.spellcastingAbility && (
                <div
                  className="rounded-lg shadow p-6"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--primary)",
                    borderLeft: "4px solid var(--primary)",
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4">Spellcasting</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Spellcasting Ability
                      </p>
                      <p className="font-bold">
                        {
                          (currentCharacter as any).derived.spellcasting
                            .spellcastingAbility
                        }
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Spell Save DC
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {
                          (currentCharacter as any).derived.spellcasting
                            .spellSaveDC
                        }
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Spell Attack
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        +
                        {
                          (currentCharacter as any).derived.spellcasting
                            .spellAttackModifier
                        }
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Cantrips Known
                      </p>
                      <p className="text-lg font-bold">
                        {
                          (currentCharacter as any).derived.spellcasting
                            .cantripsKnown
                        }
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Prepared Spells
                      </p>
                      <p className="text-lg font-bold">
                        {
                          (currentCharacter as any).derived.spellcasting
                            .preparedSpellCount
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* HP Card */}
              <div
                className="rounded-lg shadow p-6"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2 className="text-xl font-semibold mb-4">Hit Points</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Max HP
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: "var(--destructive)" }}
                    >
                      {currentCharacter.maxHitPoints}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Current HP
                    </p>
                    <p className="text-3xl font-bold">
                      {currentCharacter.hitPoints}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      AC
                    </p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {currentCharacter.armorClass}
                    </p>
                  </div>
                </div>
              </div>

              {/* Background Card */}
              {currentBackground && (
                <div
                  className="rounded-lg shadow p-6"
                  style={{
                    backgroundColor: "var(--secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Background: {currentBackground.name}
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        Feature
                      </p>
                      <p className="font-semibold">
                        {currentBackground.feature.name}
                      </p>
                      <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                        {currentBackground.feature.description}
                      </p>
                    </div>

                    {currentBackground.skillChoices && (
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Skill Choices ({currentBackground.skillChoices.count}
                          ):
                        </p>
                        <p>
                          {currentBackground.skillChoices.options.join(", ")}
                        </p>
                      </div>
                    )}

                    {currentBackground.languages && (
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Languages ({currentBackground.languages.count}):
                        </p>
                        <p>
                          {currentBackground.languages.options
                            .slice(0, 5)
                            .join(", ")}
                          ...
                        </p>
                      </div>
                    )}

                    {currentBackground.tools && (
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          Tools ({currentBackground.tools.count}):
                        </p>
                        <p>
                          {currentBackground.tools.options
                            .slice(0, 5)
                            .join(", ")}
                          ...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feats Card */}
              {(formData as any)?.classProgression?.some(
                (lp: any) => lp.featIds && lp.featIds.length > 0
              ) && (
                <div
                  className="rounded-lg shadow p-6"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4">Feats</h2>
                  <div className="space-y-3">
                    {(formData as any)?.classProgression?.map(
                      (lp: any, idx: number) =>
                        lp.featIds &&
                        lp.featIds.length > 0 && (
                          <div
                            key={idx}
                            className="p-3 rounded"
                            style={{
                              backgroundColor: "var(--secondary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <p
                              className="text-xs font-semibold mb-1"
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              Level {lp.level}
                            </p>
                            {lp.featIds.map((featId: string) => {
                              const feat = getFeat(featId);
                              return feat ? (
                                <div key={featId} className="mb-2">
                                  <p className="font-semibold">{feat.name}</p>
                                  <p
                                    style={{
                                      fontSize: "0.875rem",
                                      color: "var(--muted-foreground)",
                                      marginTop: "0.25rem",
                                    }}
                                  >
                                    {feat.description.substring(0, 120)}...
                                  </p>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Spells Card */}
              {(formData as any)?.classProgression?.some(
                (lp: any) => lp.spellIds && lp.spellIds.length > 0
              ) && (
                <div
                  className="rounded-lg shadow p-6"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <h2 className="text-xl font-semibold mb-4">Known Spells</h2>
                  <div className="space-y-3">
                    {/* Group spells by level */}
                    {(() => {
                      const spellsByLevel: Record<number, any[]> = {};
                      (formData as any)?.classProgression?.forEach(
                        (lp: any) => {
                          if (lp.spellIds && lp.spellIds.length > 0) {
                            lp.spellIds.forEach((spellId: string) => {
                              const spell = getSpell(spellId);
                              if (spell) {
                                if (!spellsByLevel[spell.level]) {
                                  spellsByLevel[spell.level] = [];
                                }
                                // Avoid duplicates
                                if (
                                  !spellsByLevel[spell.level].find(
                                    (s) => s.id === spell.id
                                  )
                                ) {
                                  spellsByLevel[spell.level].push(spell);
                                }
                              }
                            });
                          }
                        }
                      );

                      return Object.entries(spellsByLevel)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([level, spells]) => (
                          <div
                            key={level}
                            className="p-3 rounded"
                            style={{
                              backgroundColor: "var(--secondary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <p
                              className="text-xs font-semibold mb-2"
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              {level === "0" ? "Cantrips" : `Level ${level}`}
                            </p>
                            <div className="space-y-1">
                              {spells.map((spell: any) => (
                                <div key={spell.id} className="text-sm">
                                  <span className="font-semibold">
                                    {spell.name}
                                  </span>
                                  <span
                                    style={{
                                      opacity: 0.7,
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    {" "}
                                    • {spell.school}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spell Picker Modal */}
      {showSpellPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Choose Spells for Level {selectedLevel}
              </h2>
              <button
                onClick={() => setShowSpellPicker(false)}
                className="px-4 py-2 rounded font-semibold"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--secondary-foreground)",
                }}
              >
                Done
              </button>
            </div>
            <SpellPicker
              selectedSpells={getCurrentLevelProgression().spellIds || []}
              onSpellsChange={(spellIds) =>
                handleLevelChoiceChange("spellIds", spellIds)
              }
              availableClass={getCurrentLevelProgression().classId as any}
              maxLevel={selectedLevel}
            />
          </div>
        </div>
      )}

      {/* Skill Selector Modal */}
      {showSkillSelector &&
        (() => {
          const primaryClassId = (currentCharacter as any).classes?.[0]?.class;
          const classRule = primaryClassId
            ? rules.classes[primaryClassId]
            : null;
          const availableSkills =
            (classRule as any)?.skillChoices?.options || [];
          const maxSelections = (classRule as any)?.skillChoices?.count || 0;
          const currentSelectedSkills =
            (currentCharacter as any).selectedSkills || [];

          return (
            <SkillSelector
              availableSkills={availableSkills}
              selectedSkills={currentSelectedSkills}
              maxSelections={maxSelections}
              onConfirm={async (selectedSkills) => {
                if (!token || !currentCharacter?.id) return;
                try {
                  await updateCharacter(
                    currentCharacter.id,
                    { selectedSkills } as any,
                    token
                  );
                  setShowSkillSelector(false);
                  fetchCharacterData();
                } catch (err) {
                  console.error("Failed to update skills:", err);
                }
              }}
              onCancel={() => setShowSkillSelector(false)}
            />
          );
        })()}

      {/* Delete Confirmation Modal */}
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
              Delete Character
            </h2>
            <p className="mb-6" style={{ color: "var(--muted-foreground)" }}>
              Are you sure you want to delete {currentCharacter.name}? This
              action cannot be undone.
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
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded font-semibold"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--secondary-foreground)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
