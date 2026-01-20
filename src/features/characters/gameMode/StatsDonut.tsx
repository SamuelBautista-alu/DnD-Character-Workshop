import { useMemo, useState } from "react";

interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface StatsDonutProps {
  abilities?: AbilityScores;
  size?: number;
  initiative?: number;
  proficiencyBonus?: number;
  savingThrowProficiencies?: string[];
  skillProficiencies?: string[];
  dexterityModifier?: number;
  onInitiativeRoll?: (total: number | null) => void;
}

const ABILITY_COLORS = {
  strength: "var(--chart-1)",
  dexterity: "var(--chart-2)",
  constitution: "var(--chart-3)",
  intelligence: "var(--chart-4)",
  wisdom: "var(--chart-5)",
  charisma: "var(--primary)",
};

const ABILITY_SKILLS: Record<string, string[]> = {
  strength: ["Atletismo"],
  dexterity: ["Acrobacias", "Juego de Manos", "Sigilo"],
  constitution: [],
  intelligence: [
    "Arcano",
    "Historia",
    "Investigación",
    "Naturaleza",
    "Religión",
  ],
  wisdom: [
    "Medicina",
    "Percepción",
    "Perspicacia",
    "Supervivencia",
    "Trato con Animales",
  ],
  charisma: ["Actuación", "Engaño", "Intimidación", "Persuasión"],
};

// Map English skill names to Spanish for proficiency matching
const SKILL_NAME_MAP: Record<string, string> = {
  Athletics: "Atletismo",
  Acrobatics: "Acrobacias",
  "Sleight of Hand": "Juego de Manos",
  Stealth: "Sigilo",
  Arcana: "Arcano",
  History: "Historia",
  Investigation: "Investigación",
  Nature: "Naturaleza",
  Religion: "Religión",
  Medicine: "Medicina",
  Perception: "Percepción",
  Insight: "Perspicacia",
  Survival: "Supervivencia",
  "Animal Handling": "Trato con Animales",
  Performance: "Actuación",
  Deception: "Engaño",
  Intimidation: "Intimidación",
  Persuasion: "Persuasión",
};

const ABILITY_NAMES_FULL: Record<string, string> = {
  strength: "Fuerza",
  dexterity: "Destreza",
  constitution: "Constitución",
  intelligence: "Inteligencia",
  wisdom: "Sabiduría",
  charisma: "Carisma",
};

export default function StatsDonut({
  abilities = {
    strength: 15,
    dexterity: 14,
    constitution: 13,
    intelligence: 10,
    wisdom: 12,
    charisma: 8,
  },
  size = 200,
  initiative,
  proficiencyBonus = 2,
  savingThrowProficiencies = [],
  skillProficiencies = [],
  dexterityModifier = 0,
  onInitiativeRoll,
}: StatsDonutProps) {
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [currentInitiative, setCurrentInitiative] = useState<number | null>(
    null,
  );

  const handleInitiativeRoll = () => {
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const total = d20Roll + dexterityModifier;
    setCurrentInitiative(total);
    onInitiativeRoll?.(total);
  };

  const handleClearInitiative = () => {
    setCurrentInitiative(null);
    onInitiativeRoll?.(null);
  };
  const abilityArray = useMemo(() => {
    return [
      { name: "FUE", key: "strength", value: abilities.strength },
      { name: "DES", key: "dexterity", value: abilities.dexterity },
      { name: "CON", key: "constitution", value: abilities.constitution },
      { name: "INT", key: "intelligence", value: abilities.intelligence },
      { name: "SAB", key: "wisdom", value: abilities.wisdom },
      { name: "CAR", key: "charisma", value: abilities.charisma },
    ];
  }, [abilities]);

  // Equal 60° slices for a consistent donut
  const slices = useMemo(() => {
    const radius = size / 2;
    const innerRadius = radius * 0.5;
    return abilityArray.map((ab, idx) => {
      const startAngle = -90 + idx * 60; // start from top, equal sections
      const endAngle = startAngle + 60;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = radius + radius * Math.cos(startRad);
      const y1 = radius + radius * Math.sin(startRad);
      const x2 = radius + radius * Math.cos(endRad);
      const y2 = radius + radius * Math.sin(endRad);

      const x3 = radius + innerRadius * Math.cos(endRad);
      const y3 = radius + innerRadius * Math.sin(endRad);
      const x4 = radius + innerRadius * Math.cos(startRad);
      const y4 = radius + innerRadius * Math.sin(startRad);

      const largeArc = 0; // 60° < 180°

      const pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;

      const labelAngle = startAngle + 30;
      const labelRad = (labelAngle * Math.PI) / 180;
      const labelRadius = radius * 0.75;
      const labelX = radius + labelRadius * Math.cos(labelRad);
      const labelY = radius + labelRadius * Math.sin(labelRad);

      return {
        name: ab.name,
        key: ab.key,
        value: ab.value,
        pathData,
        labelX,
        labelY,
      };
    });
  }, [abilityArray, size]);

  return (
    <div className="rounded-lg shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center bg-card border-2 border-border w-full">
      <h3 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-foreground text-center">
        Puntuaciones de Habilidad
      </h3>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full"
      >
        {slices.map((slice) => (
          <g key={slice.key}>
            <path
              d={slice.pathData}
              fill={ABILITY_COLORS[slice.key as keyof typeof ABILITY_COLORS]}
              opacity={selectedAbility === slice.key ? "1" : "0.85"}
              stroke="var(--secondary)"
              strokeWidth={selectedAbility === slice.key ? "3" : "1"}
              style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
              onClick={() =>
                setSelectedAbility(
                  selectedAbility === slice.key ? null : slice.key,
                )
              }
            />
            <text
              x={slice.labelX}
              y={slice.labelY - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold"
              fill="white"
              style={{ pointerEvents: "none" }}
            >
              {slice.name}
            </text>
            <text
              x={slice.labelX}
              y={slice.labelY + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold"
              fill="white"
              style={{ pointerEvents: "none" }}
            >
              {Math.floor(
                (abilities[slice.key as keyof AbilityScores] - 10) / 2,
              ) >= 0
                ? "+"
                : ""}
              {Math.floor(
                (abilities[slice.key as keyof AbilityScores] - 10) / 2,
              )}
            </text>
          </g>
        ))}
        {/* Center - Initiative display with clear functionality */}
        <g>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.18}
            fill="var(--card)"
            stroke="var(--border)"
            strokeWidth="2"
            style={{
              cursor: typeof initiative === "number" ? "pointer" : "default",
            }}
            onClick={() => {
              if (typeof initiative === "number") {
                handleClearInitiative();
              }
            }}
          />
          <text
            x={size / 2}
            y={size / 2 - 12}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs"
            fill="var(--muted-foreground)"
            style={{ pointerEvents: "none" }}
          >
            Iniciativa
          </text>
          <text
            x={size / 2}
            y={size / 2 + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold"
            fill="var(--primary)"
            style={{ pointerEvents: "none" }}
          >
            {typeof initiative === "number" ? initiative : "--"}
          </text>
        </g>
      </svg>

      {/* Initiative Control Buttons */}
      <div className="mt-3 sm:mt-4 w-full flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-0">
        <button
          onClick={handleInitiativeRoll}
          className="py-2 px-3 sm:px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground whitespace-nowrap"
        >
          Tirar Iniciativa
        </button>
        <button
          onClick={handleClearInitiative}
          className="py-2 px-3 sm:px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-secondary text-primary whitespace-nowrap"
        >
          Limpiar
        </button>
      </div>

      {/* Selected Ability Details */}
      {selectedAbility && (
        <div className="w-full mt-3 sm:mt-4 slide-in px-0">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor:
                  ABILITY_COLORS[
                    selectedAbility as keyof typeof ABILITY_COLORS
                  ],
              }}
            />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              {abilityArray.find((a) => a.key === selectedAbility)?.name} -{" "}
              Tiradas y Habilidades
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Saving Throw */}
            <div className="rounded-lg p-3 bg-secondary border border-border">
              <div
                className="text-xs font-semibold mb-2 flex items-center gap-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span>🛡️</span> Tirada de Salvación
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-foreground">
                  {ABILITY_NAMES_FULL[selectedAbility]}
                </div>
                <div className="px-3 py-1 rounded font-bold text-sm bg-destructive text-destructive-foreground">
                  {savingThrowProficiencies.includes(selectedAbility) && "● "}
                  {(() => {
                    const total =
                      Math.floor(
                        (abilities[selectedAbility as keyof AbilityScores] -
                          10) /
                          2,
                      ) +
                      (savingThrowProficiencies.includes(selectedAbility)
                        ? proficiencyBonus
                        : 0);
                    return total >= 0 ? `+${total}` : total;
                  })()}
                </div>
              </div>
              {savingThrowProficiencies.includes(selectedAbility) && (
                <div className="text-xs mt-1 text-muted-foreground">
                  ● Competente (+{proficiencyBonus})
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="rounded-lg p-3 bg-secondary border border-border">
              <div
                className="text-xs font-semibold mb-2 flex items-center gap-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span>⚙️</span> Habilidades
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {ABILITY_SKILLS[selectedAbility].length === 0 ? (
                  <div className="text-xs text-muted-foreground">
                    Sin habilidades
                  </div>
                ) : (
                  ABILITY_SKILLS[selectedAbility].map((skill) => {
                    // Check proficiency by matching both Spanish and English names
                    const isProficient = skillProficiencies.some(
                      (profSkill) => {
                        const normalizedProfSkill =
                          SKILL_NAME_MAP[profSkill] || profSkill;
                        return (
                          normalizedProfSkill.toLowerCase() ===
                            skill.toLowerCase() ||
                          profSkill.toLowerCase() === skill.toLowerCase()
                        );
                      },
                    );
                    const modifier = Math.floor(
                      (abilities[selectedAbility as keyof AbilityScores] - 10) /
                        2,
                    );
                    const total =
                      modifier + (isProficient ? proficiencyBonus : 0);
                    return (
                      <div
                        key={skill}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-foreground">{skill}</span>
                        <span className="px-2 py-0.5 rounded font-bold bg-accent text-accent-foreground">
                          {isProficient && "● "}
                          {total >= 0 ? `+${total}` : total}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {selectedAbility === "dexterity" &&
            typeof initiative === "number" && (
              <div className="mt-3 p-3 rounded-lg bg-card border-2 border-border">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-muted-foreground">
                    ⚡ Modificador de Iniciativa
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {(() => {
                      const mod = Math.floor((abilities.dexterity - 10) / 2);
                      return mod >= 0 ? `+${mod}` : mod;
                    })()}
                  </div>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
