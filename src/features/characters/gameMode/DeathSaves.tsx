import { useState } from "react";

interface DeathSavesProps {
  successes?: number;
  failures?: number;
  onSuccessChange?: (count: number) => void;
  onFailureChange?: (count: number) => void;
}

export default function DeathSaves({
  successes = 0,
  failures = 0,
  onSuccessChange,
  onFailureChange,
}: DeathSavesProps) {
  const [tempSuccesses, setTempSuccesses] = useState(successes);
  const [tempFailures, setTempFailures] = useState(failures);

  const toggleSuccess = (index: number) => {
    const newSuccesses = tempSuccesses === index + 1 ? index : index + 1;
    setTempSuccesses(newSuccesses);
    onSuccessChange?.(newSuccesses);
  };

  const toggleFailure = (index: number) => {
    const newFailures = tempFailures === index + 1 ? index : index + 1;
    setTempFailures(newFailures);
    onFailureChange?.(newFailures);
  };

  return (
    <div className="h-full w-full rounded-2xl shadow-lg p-6 bg-card border-2 border-border flex flex-col items-center justify-center gap-6">
      {/* Skull Icon */}
      <svg
        className="w-16 h-16 text-destructive"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {/* Skull main */}
        <ellipse cx="12" cy="10" rx="5.5" ry="6" />

        {/* Jaw */}
        <rect x="8.5" y="15.5" width="7" height="2" rx="0.5" />

        {/* Left eye socket */}
        <circle cx="9.5" cy="9" r="1.2" fill="white" opacity="0.9" />

        {/* Right eye socket */}
        <circle cx="14.5" cy="9" r="1.2" fill="white" opacity="0.9" />

        {/* Nose cavity */}
        <path d="M12 11 L11.3 12 L12.7 12 Z" fill="white" opacity="0.9" />
      </svg>

      <div className="text-center">
        <h3 className="text-lg font-bold mb-2 text-destructive">
          Tiradas de Salvación contra la Muerte
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
        {/* Successes */}
        <div className="text-center">
          <label className="block text-xs font-semibold mb-3 text-primary uppercase tracking-wide">
            ✓ Éxitos
          </label>
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={`success-${i}`}
                onClick={() => toggleSuccess(i)}
                className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                  tempSuccesses > i
                    ? "bg-primary border-primary shadow-lg shadow-primary/50"
                    : "bg-input-background border-border hover:border-primary"
                } cursor-pointer font-bold text-sm`}
              >
                {tempSuccesses > i && (
                  <span className="text-primary-foreground">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Failures */}
        <div className="text-center">
          <label className="block text-xs font-semibold mb-3 text-destructive uppercase tracking-wide">
            ✕ Fallos
          </label>
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={`failure-${i}`}
                onClick={() => toggleFailure(i)}
                className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                  tempFailures > i
                    ? "bg-destructive border-destructive shadow-lg shadow-destructive/50"
                    : "bg-input-background border-border hover:border-destructive"
                } cursor-pointer font-bold text-sm`}
              >
                {tempFailures > i && (
                  <span className="text-destructive-foreground">✕</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
