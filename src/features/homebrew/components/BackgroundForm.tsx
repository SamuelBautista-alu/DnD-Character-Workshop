import { useState } from "react";
import { HomebrewBackground } from "../types";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

interface BackgroundFormProps {
  onSubmit: (
    data: Omit<
      HomebrewBackground,
      "id" | "createdBy" | "createdAt" | "updatedAt"
    >,
  ) => Promise<void>;
  initialData?: HomebrewBackground;
  isLoading?: boolean;
  isEditing?: boolean;
}

const AVAILABLE_SKILLS = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
];

const AVAILABLE_TOOLS = [
  "Artisan's Tools",
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
  "Dice Set",
  "Dragonchess Set",
  "Playing Cards",
  "Bagpipes",
  "Drum",
  "Dulcimer",
  "Flute",
  "Lute",
  "Lyre",
  "Horn",
  "Pan Flute",
  "Shawm",
  "Viol",
  "Thieves' Tools",
];

export default function BackgroundForm({
  onSubmit,
  initialData,
  isLoading = false,
  isEditing = false,
}: BackgroundFormProps) {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    skillProficiencies: initialData?.skillProficiencies || [],
    toolProficiencies: initialData?.toolProficiencies || [],
  });

  const [toolInput, setToolInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("homebrew.form.backgroundForm.nameRequired");
    }
    if (!formData.description.trim()) {
      newErrors.description = t(
        "homebrew.form.backgroundForm.descriptionRequired",
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({
          name: "",
          description: "",
          skillProficiencies: [],
          toolProficiencies: [],
        });
        setToolInput("");
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleSkillProficiency = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillProficiencies: prev.skillProficiencies.includes(skill)
        ? prev.skillProficiencies.filter((s) => s !== skill)
        : [...prev.skillProficiencies, skill],
    }));
  };

  const addToolProficiency = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      toolProficiencies: prev.toolProficiencies.includes(tool)
        ? prev.toolProficiencies
        : [...prev.toolProficiencies, tool],
    }));
    setToolInput("");
  };

  const removeToolProficiency = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      toolProficiencies: prev.toolProficiencies.filter((t) => t !== tool),
    }));
  };

  const filteredTools = AVAILABLE_TOOLS.filter(
    (tool) =>
      tool.toLowerCase().includes(toolInput.toLowerCase()) &&
      !formData.toolProficiencies.includes(tool),
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-96 overflow-y-auto"
    >
      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.backgroundForm.name")}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("homebrew.form.backgroundForm.namePlaceholder")}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            border: errors.name
              ? "2px solid #d9534f"
              : "1px solid var(--border)",
            borderRadius: "0.375rem",
            backgroundColor: "var(--input-background)",
            color: "var(--foreground)",
          }}
        />
        {errors.name && (
          <p
            style={{
              color: "#d9534f",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.backgroundForm.description")}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("homebrew.form.backgroundForm.descriptionPlaceholder")}
          rows={3}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            border: errors.description
              ? "2px solid #d9534f"
              : "1px solid var(--border)",
            borderRadius: "0.375rem",
            backgroundColor: "var(--input-background)",
            color: "var(--foreground)",
            fontFamily: "inherit",
          }}
        />
        {errors.description && (
          <p
            style={{
              color: "#d9534f",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.backgroundForm.skillProficiencies")}
        </label>
        <div
          className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--input-background)",
          }}
        >
          {AVAILABLE_SKILLS.map((skill) => (
            <label key={skill} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.skillProficiencies.includes(skill)}
                onChange={() => toggleSkillProficiency(skill)}
                style={{ cursor: "pointer" }}
              />
              <span
                style={{ color: "var(--foreground)", fontSize: "0.875rem" }}
              >
                {skill}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.backgroundForm.toolProficiencies")}
        </label>
        <div className="mb-2">
          <input
            type="text"
            value={toolInput}
            onChange={(e) => setToolInput(e.target.value)}
            placeholder={t("homebrew.form.backgroundForm.toolSearch")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          />
          {toolInput && filteredTools.length > 0 && (
            <div
              className="max-h-32 overflow-y-auto border rounded p-2 space-y-1"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--muted)",
              }}
            >
              {filteredTools.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => addToolProficiency(tool)}
                  className="w-full text-left px-2 py-1 rounded hover:opacity-75"
                  style={{
                    color: "var(--foreground)",
                    backgroundColor: "var(--input-background)",
                  }}
                >
                  + {tool}
                </button>
              ))}
            </div>
          )}
        </div>

        {formData.toolProficiencies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.toolProficiencies.map((tool) => (
              <div
                key={tool}
                className="inline-flex items-center gap-2 px-3 py-1 rounded"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <span className="text-sm">{tool}</span>
                <button
                  type="button"
                  onClick={() => removeToolProficiency(tool)}
                  className="hover:opacity-75 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded font-semibold transition-all"
          style={{
            backgroundColor: isLoading ? "var(--muted)" : "var(--primary)",
            color: "var(--primary-foreground)",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading
            ? t("homebrew.form.backgroundForm.saving")
            : isEditing
              ? t("homebrew.form.backgroundForm.update")
              : t("homebrew.form.backgroundForm.create")}
        </button>
      </div>
    </form>
  );
}
