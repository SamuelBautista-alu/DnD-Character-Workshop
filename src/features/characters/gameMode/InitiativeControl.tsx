import { useState } from "react";

interface InitiativeControlProps {
  dexterityModifier?: number;
  onInitiativeRoll?: (total: number) => void;
}

export default function InitiativeControl({
  dexterityModifier = 2,
  onInitiativeRoll,
}: InitiativeControlProps) {
  const [currentInitiative, setCurrentInitiative] = useState<number | null>(
    null
  );
  const [rollHistory, setRollHistory] = useState<number[]>([]);

  const handleRoll = () => {
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const total = d20Roll + dexterityModifier;

    setCurrentInitiative(total);
    setRollHistory([total, ...rollHistory.slice(0, 4)]); // Keep last 5 rolls
    onInitiativeRoll?.(total);
  };

  const handleClear = () => {
    setCurrentInitiative(null);
    setRollHistory([]);
  };

  return (
    <div
      className="rounded-lg shadow-lg p-6"
      style={{
        backgroundColor: "var(--card)",
        border: "2px solid var(--border)",
      }}
    >
      <h3
        className="text-sm font-bold mb-4"
        style={{ color: "var(--foreground)" }}
      >
        Iniciativa
      </h3>

      <div className="space-y-4">
        {/* Current Initiative Display */}
        <div className="text-center">
          {currentInitiative !== null ? (
            <>
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: "var(--primary)" }}
              >
                {currentInitiative}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Modificador: {dexterityModifier > 0 ? "+" : ""}
                {dexterityModifier}
              </div>
            </>
          ) : (
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--muted-foreground)" }}
            >
              --
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleRoll}
            className="flex-1 py-2 px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
            }}
          >
            Tirar
          </button>
          <button
            onClick={handleClear}
            className="flex-1 py-2 px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
            }}
          >
            Limpiar
          </button>
        </div>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <div>
            <div
              className="text-xs font-semibold mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              Histórico
            </div>
            <div className="flex gap-2 flex-wrap">
              {rollHistory.map((roll, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded text-xs font-bold"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--primary)",
                  }}
                >
                  {roll}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
