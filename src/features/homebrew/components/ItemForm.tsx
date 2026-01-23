import { useState } from "react";
import { HomebrewItem } from "../types";

interface ItemFormProps {
  onSubmit: (
    data: Omit<HomebrewItem, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  initialData?: HomebrewItem;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ITEM_TYPES = [
  "Weapon",
  "Armor",
  "Shield",
  "Wondrous Item",
  "Potion",
  "Scroll",
  "Tool",
  "Wand",
  "Ring",
  "Cloak",
  "Other",
];
const RARITIES = [
  "Common",
  "Uncommon",
  "Rare",
  "Very Rare",
  "Legendary",
  "Artifact",
];

export default function ItemForm({
  onSubmit,
  initialData,
  isLoading = false,
  isEditing = false,
}: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "Wondrous Item",
    rarity: initialData?.rarity || "Common",
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
      newErrors.name = "Item name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    try {
      JSON.parse(propertiesJson);
    } catch {
      newErrors.properties = "Properties must be valid JSON";
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
          type: "Wondrous Item",
          rarity: "Common",
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
            Item Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Sword of Sharpness"
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
            Type
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
                {type}
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
          Rarity
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
              {rarity}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the item effects and mechanics..."
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
          Properties (JSON)
        </label>
        <textarea
          value={propertiesJson}
          onChange={(e) => setPropertiesJson(e.target.value)}
          placeholder='{"requiresAttunement": true, "weight": "1 lb"}'
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
          {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
