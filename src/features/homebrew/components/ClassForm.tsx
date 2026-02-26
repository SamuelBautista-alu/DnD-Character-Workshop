import { useState } from "react";
import { HomebrewClass } from "../types";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

interface ClassFormProps {
  onSubmit: (
    data: Omit<HomebrewClass, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  initialData?: HomebrewClass;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function ClassForm({
  onSubmit,
  initialData,
  isLoading = false,
  isEditing = false,
}: ClassFormProps) {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    hitDie: initialData?.hitDie || 10,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("homebrew.form.classForm.nameRequired");
    }
    if (!formData.description.trim()) {
      newErrors.description = t("homebrew.form.classForm.descriptionRequired");
    }
    if (formData.hitDie < 6 || formData.hitDie > 12) {
      newErrors.hitDie = t("homebrew.form.classForm.hitDieInvalid");
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
        setFormData({ name: "", description: "", hitDie: 10 });
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
      [name]: name === "hitDie" ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.classForm.name")}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("homebrew.form.classForm.namePlaceholder")}
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
          {t("homebrew.form.classForm.description")}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("homebrew.form.classForm.descriptionPlaceholder")}
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

      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.classForm.hitDie")}
        </label>
        <select
          name="hitDie"
          value={formData.hitDie}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            border: errors.hitDie
              ? "2px solid #d9534f"
              : "1px solid var(--border)",
            borderRadius: "0.375rem",
            backgroundColor: "var(--input-background)",
            color: "var(--foreground)",
          }}
        >
          <option value={6}>d6</option>
          <option value={8}>d8</option>
          <option value={10}>d10</option>
          <option value={12}>d12</option>
        </select>
        {errors.hitDie && (
          <p
            style={{
              color: "#d9534f",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {errors.hitDie}
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
            ? t("homebrew.form.classForm.saving")
            : isEditing
              ? t("homebrew.form.classForm.update")
              : t("homebrew.form.classForm.create")}
        </button>
      </div>
    </form>
  );
}
