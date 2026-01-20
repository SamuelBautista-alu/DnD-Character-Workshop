import { useState } from "react";

interface Spell {
  name: string;
  level: number;
  prepared: boolean;
}

interface SpellsListProps {
  spells?: Spell[];
  onPreparedChange?: (index: number, prepared: boolean) => void;
}

export default function SpellsList({
  spells = [],
  onPreparedChange,
}: SpellsListProps) {
  const [localSpells, setLocalSpells] = useState<Spell[]>(spells);

  const togglePrepared = (index: number) => {
    const newPrepared = !localSpells[index].prepared;
    setLocalSpells((prev) =>
      prev.map((s, i) => (i === index ? { ...s, prepared: newPrepared } : s)),
    );
    onPreparedChange?.(index, newPrepared);
  };

  return (
    <div className="rounded-lg shadow-lg p-4 sm:p-6 bg-card border-2 border-border h-full flex flex-col">
      <h3 className="text-sm sm:text-base font-bold mb-4 text-foreground">
        Lista de Hechizos
      </h3>

      {localSpells.length === 0 ? (
        <div className="text-xs text-muted-foreground italic">
          No hay hechizos.
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1 max-h-[calc(100vh-400px)] min-h-[300px]">
          {localSpells.map((spell, i) => (
            <div
              key={`${spell.name}-${i}`}
              className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 sm:p-3 rounded bg-secondary"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-primary truncate">
                  {spell.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Nivel {spell.level}
                </div>
              </div>
              <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer whitespace-nowrap">
                Preparado
                <input
                  type="checkbox"
                  checked={spell.prepared}
                  onChange={() => togglePrepared(i)}
                  className="cursor-pointer"
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
