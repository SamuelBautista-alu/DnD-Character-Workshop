import { useState, useMemo, useEffect } from "react";
import {
  filterSpells,
  getSpellSchools,
  type Spell,
  type SpellClass,
} from "@/rules/spells";
import { useGameData } from "@/lib/hooks/useGameData";

interface SpellPickerProps {
  selectedSpells: string[]; // Array de IDs de hechizos
  onSpellsChange: (spellIds: string[]) => void;
  maxSpells?: number; // Límite opcional
  availableClass?: SpellClass; // Filtrar por clase
  maxLevel?: number; // Filtrar por nivel máximo de hechizo
}

export default function SpellPicker({
  selectedSpells,
  onSpellsChange,
  maxSpells,
  availableClass,
  maxLevel = 9,
}: SpellPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<number | "all">("all");
  const [filterSchool, setFilterSchool] = useState<string>("all");

  // Usar datos de API cuando estén disponibles, caer a datos locales
  const { getAllSpells, isLoading } = useGameData();
  const [apiSpells, setApiSpells] = useState<any[]>([]);

  // Cargar hechizos desde API
  useEffect(() => {
    const spells = getAllSpells();
    if (spells.length > 0) {
      setApiSpells(spells);
    }
  }, [getAllSpells]);

  const filteredSpells = useMemo(() => {
    // Si tenemos hechizos de API, usarlos
    if (apiSpells.length > 0) {
      let filtered = apiSpells;

      // Búsqueda por consulta
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((spell) =>
          spell.name.toLowerCase().includes(query),
        );
      }

      // Filtrar por nivel
      if (filterLevel !== "all") {
        filtered = filtered.filter((spell) => spell.level === filterLevel);
      }

      // Filtrar por escuela
      if (filterSchool !== "all") {
        filtered = filtered.filter(
          (spell) =>
            spell.school.name === filterSchool ||
            spell.school.index === filterSchool.toLowerCase(),
        );
      }

      // Filtrar por clase
      if (availableClass) {
        const className = availableClass.toLowerCase();
        filtered = filtered.filter((spell) =>
          spell.classes.some(
            (cls: any) =>
              cls.name.toLowerCase() === className || cls.index === className,
          ),
        );
      }

      // Filtrar por nivel máximo
      return filtered.filter((spell) => spell.level <= maxLevel);
    }

    // Caer a datos locales
    return filterSpells({
      searchQuery: searchQuery || undefined,
      level: filterLevel === "all" ? undefined : filterLevel,
      school: filterSchool === "all" ? undefined : (filterSchool as any),
      class: availableClass,
    }).filter((spell) => spell.level <= maxLevel);
  }, [
    searchQuery,
    filterLevel,
    filterSchool,
    availableClass,
    maxLevel,
    apiSpells,
  ]);

  const handleToggleSpell = (spellId: string) => {
    if (selectedSpells.includes(spellId)) {
      onSpellsChange(selectedSpells.filter((id) => id !== spellId));
    } else {
      if (maxSpells && selectedSpells.length >= maxSpells) {
        // Límite de hechizos alcanzado
        return;
      }
      onSpellsChange([...selectedSpells, spellId]);
    }
  };

  const canSelectMore = !maxSpells || selectedSpells.length < maxSpells;

  // Obtener escuelas disponibles desde datos de API o datos locales
  const availableSchools = useMemo(() => {
    if (apiSpells.length > 0) {
      const schools = new Set<string>();
      apiSpells.forEach((spell) => {
        schools.add(spell.school.name);
      });
      return Array.from(schools).sort();
    }
    return getSpellSchools();
  }, [apiSpells]);

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Selector de Hechizos</h3>
        {isLoading && (
          <span
            className="text-xs px-2 py-1 rounded"
            style={{
              backgroundColor: "var(--warning)",
              color: "var(--warning-foreground)",
            }}
          >
            Sincronizando hechizos...
          </span>
        )}
      </div>

      {/* Búsqueda y Filtros */}
      <div className="space-y-3 mb-4">
        {/* Input de Búsqueda */}
        <input
          type="text"
          placeholder="Search spells by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "var(--input-background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
          }}
        />

        {/* Fila de Filtros */}
        <div className="grid grid-cols-2 gap-2">
          {/* Filtro de Nivel */}
          <select
            value={filterLevel}
            onChange={(e) =>
              setFilterLevel(
                e.target.value === "all" ? "all" : parseInt(e.target.value),
              )
            }
            style={{
              padding: "0.5rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          >
            <option value="all">Todos los Niveles</option>
            <option value="0">Trucos</option>
            {Array.from({ length: maxLevel }, (_, i) => i + 1).map((level) => (
              <option key={level} value={level}>
                Nivel {level}
              </option>
            ))}
          </select>

          {/* Filtro de Escuela */}
          <select
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
            style={{
              padding: "0.5rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          >
            <option value="all">Todas las Escuelas</option>
            {availableSchools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Contador de Selecciones */}
        <div
          className="text-xs font-semibold p-2 rounded"
          style={{
            backgroundColor: "var(--secondary)",
            color: "var(--secondary-foreground)",
          }}
        >
          Seleccionados: {selectedSpells.length}
          {maxSpells && ` / ${maxSpells}`}
          {availableClass && ` • hechizos de ${availableClass}`}
        </div>
      </div>

      {/* Lista de Hechizos */}
      <div
        className="space-y-2 max-h-96 overflow-y-auto"
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "1rem",
        }}
      >
        {filteredSpells.length === 0 ? (
          <p
            className="text-center py-4"
            style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
          >
            No se encontraron hechizos que coincidan con tus filtros
          </p>
        ) : (
          filteredSpells.map((spell) => {
            const spellId = spell.id || spell.index;
            const isSelected = selectedSpells.includes(spellId);
            const spellName = spell.name;
            const spellLevel = spell.level;
            const spellSchool = spell.school?.name || spell.school;
            const castingTime = spell.casting_time || "1 action";
            const description = (
              Array.isArray(spell.desc)
                ? spell.desc.join(" ")
                : spell.desc || ""
            ).substring(0, 100);

            return (
              <button
                key={spellId}
                onClick={() => handleToggleSpell(spellId)}
                disabled={!isSelected && !canSelectMore}
                className={`w-full text-left p-3 rounded transition-all ${
                  isSelected ? "ring-2" : "hover:opacity-80"
                }`}
                style={{
                  backgroundColor: isSelected
                    ? "var(--primary)"
                    : "var(--secondary)",
                  color: isSelected
                    ? "var(--primary-foreground)"
                    : "var(--secondary-foreground)",
                  border: "1px solid var(--border)",
                  opacity: !isSelected && !canSelectMore ? 0.5 : 1,
                  cursor:
                    !isSelected && !canSelectMore ? "not-allowed" : "pointer",
                  boxShadow: isSelected ? `0 0 0 2px var(--ring)` : undefined,
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold text-sm">{spellName}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  >
                    {spellLevel === 0 ? "Cantrip" : `Lv ${spellLevel}`}
                  </span>
                </div>
                <div className="text-xs" style={{ opacity: 0.8 }}>
                  {spellSchool} • {castingTime}
                </div>
                <div className="text-xs mt-1" style={{ opacity: 0.7 }}>
                  {description}...
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
