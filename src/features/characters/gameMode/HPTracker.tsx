import { useState } from "react";

interface HPTrackerProps {
  currentHP: number;
  tempHP: number;
  maxHP: number;
  onHPChange: (hp: number) => void;
  onTempHPChange: (hp: number) => void;
}

export default function HPTracker({
  currentHP,
  tempHP,
  maxHP,
  onHPChange,
  onTempHPChange,
}: HPTrackerProps) {
  const [damageInput, setDamageInput] = useState(0);

  const hpPercentage = (currentHP / maxHP) * 100;
  const getHPColor = () => {
    if (hpPercentage > 50) return "var(--primary)";
    if (hpPercentage > 25) return "var(--accent)";
    return "var(--destructive)";
  };

  const handleDamage = (amount: number) => {
    // Consume Temp HP first
    const consumeFromTemp = Math.min(amount, tempHP);
    const remainingDamage = amount - consumeFromTemp;
    const newTempHP = tempHP - consumeFromTemp;
    const newHP = Math.max(0, currentHP - remainingDamage);
    onTempHPChange(newTempHP);
    onHPChange(newHP);
    setDamageInput(0); // Reset input
  };

  const handleHeal = (amount: number) => {
    const newHP = Math.min(maxHP, currentHP + amount);
    onHPChange(newHP);
    setDamageInput(0); // Reset input
  };

  return (
    <div className="h-full rounded-2xl shadow-lg p-4 sm:p-5 bg-card border-2 border-border flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-foreground">
          <svg
            className="w-5 h-5 text-destructive"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Puntos de Vida
        </h3>
        <div className="text-xl font-semibold text-primary">
          {currentHP}/{maxHP}
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="w-full rounded-full h-2 overflow-hidden bg-input-background">
          <div
            className="h-full transition-all"
            style={{
              width: `${hpPercentage}%`,
              backgroundColor: getHPColor(),
            }}
          />
        </div>
      </div>

      {/* Damage/Heal & Temp HP row */}
      <div className="flex flex-col sm:flex-row items-end gap-2 sm:gap-3 mt-auto">
        <div className="flex-1 w-full">
          <div className="text-xs font-semibold mb-1 text-muted-foreground">
            Recibir Daño / Curación
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDamage(damageInput)}
              className="w-9 sm:w-10 h-9 sm:h-10 rounded font-bold text-lg flex items-center justify-center transition-all hover:scale-105 bg-destructive text-destructive-foreground"
            >
              -
            </button>
            <input
              type="number"
              value={damageInput}
              onChange={(e) =>
                setDamageInput(Math.max(parseInt(e.target.value) || 0, 0))
              }
              className="flex-1 px-3 py-2 rounded text-center text-sm bg-input-background border border-border text-foreground"
            />
            <button
              onClick={() => handleHeal(damageInput)}
              className="w-9 sm:w-10 h-9 sm:h-10 rounded font-bold text-lg flex items-center justify-center transition-all hover:scale-105 text-primary-foreground"
              style={{ backgroundColor: "var(--muted-foreground)" }}
            >
              +
            </button>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <div className="text-xs font-semibold text-muted-foreground">
            HP Temporal
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTempHPChange(Math.max(tempHP - 1, 0))}
              className="w-9 h-9 rounded font-bold text-lg flex items-center justify-center transition-all hover:scale-105 bg-destructive text-destructive-foreground"
            >
              -
            </button>
            <div className="min-w-9 text-center text-sm sm:text-base text-foreground">
              {tempHP}
            </div>
            <button
              onClick={() => onTempHPChange(tempHP + 1)}
              className="w-9 h-9 rounded font-bold text-lg flex items-center justify-center transition-all hover:scale-105 text-primary-foreground"
              style={{ backgroundColor: "var(--muted-foreground)" }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
