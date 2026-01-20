import { useEffect, useMemo, useState } from "react";
import { fetchSpellsFromAPI, SpellListItem } from "@/lib/api";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";
import { Spell } from "../store";

export default function SpellPickerModal({
  open,
  onClose,
  onSelect,
  className,
  subclass,
  maxSpellLevel,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (spell: Spell) => void;
  className?: string;
  subclass?: string;
  maxSpellLevel?: number;
}) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [spells, setSpells] = useState<SpellListItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language as "en" | "es", key);

  const filters = useMemo(
    () => ({ className, subclass }),
    [className, subclass],
  );

  useEffect(() => {
    if (!open) return;
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchSpellsFromAPI({
          className: filters.className,
          subclass: filters.subclass,
          search,
        });
        if (!ignore) {
          const capped =
            typeof maxSpellLevel === "number"
              ? list.filter((s) => s.level <= maxSpellLevel)
              : list;
          setSpells(capped);
        }
      } catch {
        if (!ignore) setSpells([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [open, filters.className, filters.subclass, search, maxSpellLevel]);

  const filteredByLevel = useMemo(() => {
    if (selectedLevel === "all") return spells;
    return spells.filter((s) => s.level === selectedLevel);
  }, [spells, selectedLevel]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 95vw)",
          maxHeight: "80vh",
          overflow: "hidden",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("characterCreation.searchSpells")}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              style={{
                padding: "8px 12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            >
              <option value="all">{t("characterCreation.allLevels")}</option>
              {Array.from({ length: (maxSpellLevel || 9) + 1 }, (_, i) => (
                <option key={i} value={i}>
                  {t("characterCreation.spellLevel")} {i}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              style={{
                padding: "8px 12px",
                background: "var(--secondary)",
                color: "var(--secondary-foreground)",
                border: 0,
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {t("characterCreation.close")}
            </button>
          </div>
          <div style={{ marginTop: 8, color: "var(--muted-foreground)" }}>
            {className ? `Class: ${className}` : "All classes"}
            {subclass ? ` • Subclass: ${subclass}` : ""}
            {typeof maxSpellLevel === "number"
              ? ` • Showing levels 0-${maxSpellLevel}`
              : ""}
          </div>
        </div>

        <div style={{ padding: 16, overflow: "auto" }}>
          {loading ? (
            <div style={{ color: "var(--muted-foreground)" }}>Loading…</div>
          ) : spells.length === 0 ? (
            <div style={{ color: "var(--muted-foreground)" }}>
              {t("characterCreation.noSpellsFound")}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {filteredByLevel.map((s) => (
                <div
                  key={s.index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 8,
                    border: "1px solid var(--border)",
                    background: "var(--input-background)",
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  <div>
                    <div
                      style={{ color: "var(--foreground)", fontWeight: 600 }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{ color: "var(--muted-foreground)", fontSize: 12 }}
                    >
                      {t("characterCreation.spellLevel")} {s.level}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button
                      onClick={() =>
                        onSelect({
                          name: s.name,
                          level: s.level,
                          prepared: false,
                        })
                      }
                      style={{
                        padding: "6px 10px",
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        border: 0,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
