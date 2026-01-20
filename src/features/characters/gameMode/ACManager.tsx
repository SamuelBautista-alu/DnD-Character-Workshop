import { useState, useEffect } from "react";

interface ACManagerProps {
  baseAC: number;
}

export default function ACManager({ baseAC }: ACManagerProps) {
  const [tempACMod, setTempACMod] = useState(0);
  const [displayAC, setDisplayAC] = useState(baseAC);

  useEffect(() => {
    setDisplayAC(baseAC + tempACMod);
  }, [baseAC, tempACMod]);

  const decrementTemp = () => setTempACMod((v) => v - 1);
  const incrementTemp = () => setTempACMod((v) => v + 1);

  return (
    <div className="h-full rounded-lg shadow-lg p-4 sm:p-6 bg-card border-2 border-border flex flex-col justify-between">
      {/* Header icon and title */}
      <div className="flex flex-col items-center text-center">
        <svg
          className="w-8 h-8 mb-2 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <h3 className="text-sm font-semibold mt-1 text-foreground">
          Clase de Armadura
        </h3>
        <div className="text-5xl font-bold mt-2 text-primary">{displayAC}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-3 sm:my-4" />

      {/* Temp AC controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
        <div className="text-xs font-semibold text-muted-foreground">
          CA Temporal
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            aria-label="Disminuir CA Temporal"
            onClick={decrementTemp}
            className="w-8 h-8 rounded flex items-center justify-center border border-border bg-input-background text-foreground hover:bg-secondary transition-colors text-lg"
          >
            −
          </button>
          <div className="w-6 text-center text-sm font-semibold text-foreground">
            {tempACMod}
          </div>
          <button
            aria-label="Aumentar CA Temporal"
            onClick={incrementTemp}
            className="w-8 h-8 rounded flex items-center justify-center border border-border bg-input-background text-foreground hover:bg-secondary transition-colors text-lg"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
