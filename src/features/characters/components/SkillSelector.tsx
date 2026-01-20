import { useState, useMemo } from "react";
import type { Skill } from "@/rules/editions/rules2014";

interface SkillSelectorProps {
  availableSkills: Skill[];
  selectedSkills: Skill[];
  maxSelections: number;
  onConfirm: (selectedSkills: Skill[]) => void;
  onCancel: () => void;
}

export function SkillSelector({
  availableSkills,
  selectedSkills: initialSelected,
  maxSelections,
  onConfirm,
  onCancel,
}: SkillSelectorProps) {
  const [selected, setSelected] = useState<Skill[]>(initialSelected);

  const toggleSkill = (skill: Skill) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter((s) => s !== skill));
    } else if (selected.length < maxSelections) {
      setSelected([...selected, skill]);
    }
  };

  const canConfirm = selected.length === maxSelections;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div
        className="rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="p-6 border-b sticky top-0 z-10"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="text-2xl font-bold">Choose Skills</h2>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Select {maxSelections} skill{maxSelections !== 1 ? "s" : ""} from
            your class options ({selected.length}/{maxSelections} selected)
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {availableSkills.map((skill) => {
              const isSelected = selected.includes(skill);
              const isDisabled =
                !isSelected && selected.length >= maxSelections;

              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  disabled={isDisabled}
                  className="px-4 py-3 rounded-lg font-medium transition-all text-left"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--primary)"
                      : "var(--secondary)",
                    color: isSelected
                      ? "var(--primary-foreground)"
                      : "var(--secondary-foreground)",
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    border: isSelected
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                  }}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="p-6 border-t flex gap-3 justify-end sticky bottom-0"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={!canConfirm}
            className="px-4 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: canConfirm ? "var(--primary)" : "var(--muted)",
              color: canConfirm
                ? "var(--primary-foreground)"
                : "var(--muted-foreground)",
              cursor: canConfirm ? "pointer" : "not-allowed",
              opacity: canConfirm ? 1 : 0.6,
            }}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}
