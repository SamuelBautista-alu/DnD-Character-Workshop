import { useState } from "react";
import { HomebrewRace } from "../types";

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
      newErrors.name = "Race name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.speed < 20 || formData.speed > 60) {
      newErrors.speed = "Speed must be between 20 and 60 feet";
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
          Race Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Dragonborn"
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
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your race..."
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
          Speed (feet)
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
          className="block text-sm font-semibold mb-3"
          style={{ color: "var(--foreground)" }}
        >
          Ability Score Bonuses (optional)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ABILITIES.map((ability) => (
            <div key={ability}>
              <label
                className="text-xs font-semibold capitalize mb-1 block"
                style={{ color: "var(--muted-foreground)" }}
              >
                {ability}
              </label>
              <input
                type="number"
                value={
                  formData.abilityScores[
                    ability as keyof typeof formData.abilityScores
                  ] || ""
                }
                onChange={(e) => handleAbilityChange(ability, e.target.value)}
                placeholder="+0"
                style={{
                  width: "100%",
                  padding: "0.5rem 0.5rem",
                  border: "1px solid var(--border)",
                  borderRadius: "0.375rem",
                  backgroundColor: "var(--input-background)",
                  color: "var(--foreground)",
                  fontSize: "0.875rem",
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
          {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
