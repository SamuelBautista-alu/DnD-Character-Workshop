import { useState } from "react";
import { HomebrewSpell } from "../types";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

interface SpellFormProps {
  onSubmit: (
    data: Omit<HomebrewSpell, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  initialData?: HomebrewSpell;
  isLoading?: boolean;
  isEditing?: boolean;
}

const SCHOOLS = [
  "abjuration",
  "conjuration",
  "divination",
  "enchantment",
  "evocation",
  "illusion",
  "necromancy",
  "transmutation",
];
const COMPONENTS = ["Verbal", "Somatic", "Material"];

export default function SpellForm({
  onSubmit,
  initialData,
  isLoading = false,
  isEditing = false,
}: SpellFormProps) {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    level: initialData?.level || 1,
    school: initialData?.school || "evocation",
    castingTime: initialData?.castingTime || "1 action",
    range: initialData?.range || "Self",
    duration: initialData?.duration || "Instantaneous",
    concentration: initialData?.concentration || false,
    components: initialData?.components || [],
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("homebrew.form.spellForm.nameRequired");
    }
    if (formData.level < 0 || formData.level > 9) {
      newErrors.level = t("homebrew.form.spellForm.levelInvalid");
    }
    if (!formData.castingTime.trim()) {
      newErrors.castingTime = t("homebrew.form.spellForm.castingTimeRequired");
    }
    if (!formData.range.trim()) {
      newErrors.range = t("homebrew.form.spellForm.rangeRequired");
    }
    if (!formData.duration.trim()) {
      newErrors.duration = t("homebrew.form.spellForm.durationRequired");
    }
    if (!formData.description.trim()) {
      newErrors.description = t("homebrew.form.spellForm.descriptionRequired");
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
          level: 1,
          school: "evocation",
          castingTime: "1 action",
          range: "Self",
          duration: "Instantaneous",
          concentration: false,
          components: [],
          description: "",
        });
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "level"
            ? parseInt(value)
            : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleComponentToggle = (component: string) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.includes(component)
        ? prev.components.filter((c) => c !== component)
        : [...prev.components, component],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {t("homebrew.form.spellForm.name")}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("homebrew.form.spellForm.namePlaceholder")}
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
            {t("homebrew.form.spellForm.level")}
          </label>
          <input
            type="number"
            name="level"
            value={formData.level}
            onChange={handleChange}
            min={0}
            max={9}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: errors.level
                ? "2px solid #d9534f"
                : "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          />
          {errors.level && (
            <p
              style={{
                color: "#d9534f",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.level}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {t("homebrew.form.spellForm.school")}
          </label>
          <select
            name="school"
            value={formData.school}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          >
            {SCHOOLS.map((school) => (
              <option key={school} value={school}>
                {t(`homebrew.form.spellForm.schools.${school}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {t("homebrew.form.spellForm.castingTime")}
          </label>
          <input
            type="text"
            name="castingTime"
            value={formData.castingTime}
            onChange={handleChange}
            placeholder={t("homebrew.form.spellForm.castingTimePlaceholder")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: errors.castingTime
                ? "2px solid #d9534f"
                : "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          />
          {errors.castingTime && (
            <p
              style={{
                color: "#d9534f",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.castingTime}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {t("homebrew.form.spellForm.range")}
          </label>
          <input
            type="text"
            name="range"
            value={formData.range}
            onChange={handleChange}
            placeholder={t("homebrew.form.spellForm.rangePlaceholder")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: errors.range
                ? "2px solid #d9534f"
                : "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          />
          {errors.range && (
            <p
              style={{
                color: "#d9534f",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.range}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {t("homebrew.form.spellForm.duration")}
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder={t("homebrew.form.spellForm.durationPlaceholder")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: errors.duration
                ? "2px solid #d9534f"
                : "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          />
          {errors.duration && (
            <p
              style={{
                color: "#d9534f",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {errors.duration}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.spellForm.components")}
        </label>
        <div className="flex gap-3">
          {COMPONENTS.map((component) => (
            <label key={component} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.components.includes(component)}
                onChange={() => handleComponentToggle(component)}
                style={{ cursor: "pointer" }}
              />
              <span style={{ color: "var(--foreground)" }}>
                {t(`homebrew.form.spellForm.${component.toLowerCase()}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="concentration"
            checked={formData.concentration}
            onChange={handleChange}
            style={{ cursor: "pointer" }}
          />
          <span style={{ color: "var(--foreground)" }}>
            {t("homebrew.form.spellForm.concentration")}
          </span>
        </label>
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.spellForm.description")}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("homebrew.form.spellForm.descriptionPlaceholder")}
          rows={4}
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
            ? t("homebrew.form.spellForm.saving")
            : isEditing
              ? t("homebrew.form.spellForm.update")
              : t("homebrew.form.spellForm.create")}
        </button>
      </div>
    </form>
  );
}
