import { useState } from "react";
import { HomebrewSpell } from "../types";

interface SpellFormProps {
  onSubmit: (
    data: Omit<HomebrewSpell, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  initialData?: HomebrewSpell;
  isLoading?: boolean;
  isEditing?: boolean;
}

const SCHOOLS = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
];
const COMPONENTS = ["Verbal", "Somatic", "Material"];

export default function SpellForm({
  onSubmit,
  initialData,
  isLoading = false,
  isEditing = false,
}: SpellFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    level: initialData?.level || 1,
    school: initialData?.school || "Evocation",
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
      newErrors.name = "Spell name is required";
    }
    if (formData.level < 0 || formData.level > 9) {
      newErrors.level = "Spell level must be between 0 and 9";
    }
    if (!formData.castingTime.trim()) {
      newErrors.castingTime = "Casting time is required";
    }
    if (!formData.range.trim()) {
      newErrors.range = "Range is required";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
          school: "Evocation",
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
            Spell Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Fireball"
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
            Level (0-9)
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
            School
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
                {school}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: "var(--foreground)" }}
          >
            Casting Time
          </label>
          <input
            type="text"
            name="castingTime"
            value={formData.castingTime}
            onChange={handleChange}
            placeholder="e.g., 1 action"
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
            Range
          </label>
          <input
            type="text"
            name="range"
            value={formData.range}
            onChange={handleChange}
            placeholder="e.g., 150 feet"
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
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., Instantaneous"
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
          Components
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
              <span style={{ color: "var(--foreground)" }}>{component}</span>
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
            Requires Concentration
          </span>
        </label>
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
          placeholder="Describe the spell effects..."
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
          {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
