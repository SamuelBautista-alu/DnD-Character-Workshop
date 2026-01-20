import { useState } from "react";

interface RestControlsProps {
  maxHP: number;
  currentHP: number;
  constitutionModifier: number;
  onHPChange: (hp: number) => void;
  onLongRest?: () => void; // parent will reset spell slots
  onShortRest?: () => void; // optional hook
}

export default function RestControls({
  maxHP,
  currentHP,
  constitutionModifier,
  onHPChange,
  onLongRest,
  onShortRest,
}: RestControlsProps) {
  const [diceRoll, setDiceRoll] = useState(0);
  const handleShortRest = () => {
    if (diceRoll <= 0) return; // Require a dice roll
    const healAmount = Math.max(1, diceRoll + constitutionModifier);
    const newHP = Math.min(maxHP, currentHP + healAmount);
    onHPChange(newHP);
    setDiceRoll(0); // Reset after use
    onShortRest?.();
  };

  const handleLongRest = () => {
    onHPChange(maxHP);
    onLongRest?.();
  };

  return (
    <div className="h-full rounded-lg shadow-lg p-4 sm:p-5 bg-card border-2 border-border flex flex-col justify-between gap-3 sm:gap-4">
      {/* Short Rest Section */}
      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">
          Descanso corto
        </h4>
        <div className="text-xs text-muted-foreground mb-2">
          Introduce el resultado de los dados de golpe
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <input
            type="number"
            min="0"
            value={diceRoll}
            onChange={(e) =>
              setDiceRoll(Math.max(0, parseInt(e.target.value) || 0))
            }
            placeholder="Resultado"
            className="flex-1 w-full px-3 py-2 rounded text-center bg-input-background border border-border text-foreground text-sm"
          />
        </div>
        <button
          onClick={handleShortRest}
          disabled={diceRoll <= 0}
          className="w-full py-2 px-3 sm:px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-secondary text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Descanso Corto
        </button>
      </div>

      {/* Long Rest Button */}
      <button
        onClick={handleLongRest}
        className="w-full py-2 px-3 sm:px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
      >
        Descanso Largo
      </button>
    </div>
  );
}
