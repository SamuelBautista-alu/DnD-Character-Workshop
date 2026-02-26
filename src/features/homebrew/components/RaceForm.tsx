import { useState } from "react";
import { HomebrewRace } from "../types";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

interface RaceFormProps {
  onSubmit: (
    data: Omit<HomebrewRace, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  initialData?: HomebrewRace;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ABILITIES = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export default function RaceForm({
  onSubmit,
  initialData,
  isLoading = false,
  isEditing = false,
}: RaceFormProps) {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    speed: initialData?.speed || 30,
    abilityScores: initialData?.abilityScores || {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("homebrew.form.raceForm.nameRequired");
    }
    if (!formData.description.trim()) {
      newErrors.description = t("homebrew.form.raceForm.descriptionRequired");
    }
    if (formData.speed < 20 || formData.speed > 60) {
      newErrors.speed = t("homebrew.form.raceForm.speedInvalid");
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
          speed: 30,
          abilityScores: {},
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "speed" ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAbilityChange = (ability: string, value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    setFormData((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [ability]: numValue,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.raceForm.name")}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("homebrew.form.raceForm.namePlaceholder")}
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
          {t("homebrew.form.raceForm.description")}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("homebrew.form.raceForm.descriptionPlaceholder")}
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
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.raceForm.speed")}
        </label>
        <input
          type="number"
          name="speed"
          value={formData.speed}
          onChange={handleChange}
          min={20}
          max={60}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            border: errors.speed
              ? "2px solid #d9534f"
              : "1px solid var(--border)",
            borderRadius: "0.375rem",
            backgroundColor: "var(--input-background)",
            color: "var(--foreground)",
          }}
        />
        {errors.speed && (
          <p
            style={{
              color: "#d9534f",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {errors.speed}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.raceForm.abilityScores")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ABILITIES.map((ability) => (
            <div key={ability}>
              <label
                className="text-xs mb-1 block"
                style={{ color: "var(--muted-foreground)" }}
              >
                {t(`homebrew.form.raceForm.${ability}`)}
              </label>
              <input
                type="number"
                value={
                  formData.abilityScores[
                    ability as keyof typeof formData.abilityScores
                  ] || ""
                }
                onChange={(e) => handleAbilityChange(ability, e.target.value)}
                placeholder={t("homebrew.form.raceForm.speedPlaceholder")}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "0.375rem",
                  backgroundColor: "var(--input-background)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          ))}
        </div>
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
            ? t("homebrew.form.raceForm.saving")
            : isEditing
              ? t("homebrew.form.raceForm.update")
              : t("homebrew.form.raceForm.create")}
        </button>
      </div>
    </form>
  );
}
