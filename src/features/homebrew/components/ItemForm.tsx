import { useState } from "react";
import { HomebrewItem } from "../types";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

interface ItemFormProps {
  onSubmit: (
    data: Omit<HomebrewItem, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  initialData?: HomebrewItem;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ITEM_TYPES = [
  "weapon",
  "armor",
  "shield",
  "wondrousItem",
  "potion",
  "scroll",
  "tool",
  "wand",
  "ring",
  "cloak",
  "other",
];
const RARITIES = [
  "common",
  "uncommon",
  "rare",
  "veryRare",
  "legendary",
  "artifact",
];

export default function ItemForm({
  onSubmit,
  initialData,
  isLoading = false,
  isEditing = false,
}: ItemFormProps) {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "wondrousItem",
    rarity: initialData?.rarity || "common",
    description: initialData?.description || "",
    properties: initialData?.properties || {},
  });

  const [propertiesJson, setPropertiesJson] = useState(
    JSON.stringify(initialData?.properties || {}, null, 2),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("homebrew.form.itemForm.nameRequired");
    }
    if (!formData.description.trim()) {
      newErrors.description = t("homebrew.form.itemForm.descriptionRequired");
    }

    try {
      JSON.parse(propertiesJson);
    } catch {
      newErrors.properties = t("homebrew.form.itemForm.propertiesInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const properties = JSON.parse(propertiesJson);
      await onSubmit({
        ...formData,
        properties,
      });
      if (!isEditing) {
        setFormData({
          name: "",
          type: "wondrousItem",
          rarity: "common",
          description: "",
          properties: {},
        });
        setPropertiesJson(JSON.stringify({}, null, 2));
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
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: "var(--foreground)" }}
          >
            {t("homebrew.form.itemForm.name")}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("homebrew.form.itemForm.namePlaceholder")}
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
            {t("homebrew.form.itemForm.type")}
          </label>
          <select
            name="type"
            value={formData.type}
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
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`homebrew.form.itemForm.types.${type}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.itemForm.rarity")}
        </label>
        <select
          name="rarity"
          value={formData.rarity}
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
          {RARITIES.map((rarity) => (
            <option key={rarity} value={rarity}>
              {t(`homebrew.form.itemForm.rarities.${rarity}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {t("homebrew.form.itemForm.description")}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t("homebrew.form.itemForm.descriptionPlaceholder")}
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
          {t("homebrew.form.itemForm.properties")}
        </label>
        <textarea
          value={propertiesJson}
          onChange={(e) => setPropertiesJson(e.target.value)}
          placeholder={t("homebrew.form.itemForm.propertiesPlaceholder")}
          rows={3}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            border: errors.properties
              ? "2px solid #d9534f"
              : "1px solid var(--border)",
            borderRadius: "0.375rem",
            backgroundColor: "var(--input-background)",
            color: "var(--foreground)",
            fontFamily: "monospace",
            fontSize: "0.875rem",
          }}
        />
        {errors.properties && (
          <p
            style={{
              color: "#d9534f",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {errors.properties}
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
            ? t("homebrew.form.itemForm.saving")
            : isEditing
              ? t("homebrew.form.itemForm.update")
              : t("homebrew.form.itemForm.create")}
        </button>
      </div>
    </form>
  );
}
