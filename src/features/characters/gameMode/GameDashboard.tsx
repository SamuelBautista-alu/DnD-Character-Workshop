/**
 * Tablero de Juego (Game Dashboard)
 * Interfaz principal para jugar un personaje en modo de juego.
 * Gestiona combate, hechizos, salvas de muerte, iniciativa y seguimiento de HP.
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HPTracker from "./HPTracker";
import ACManager from "./ACManager";
import RestControls from "./RestControls";
import DeathSaves from "./DeathSaves";
import SpellSlotTracker from "./SpellSlotTracker";
import StatsDonut from "./StatsDonut";
import SpellsList from "./SpellsList";
import InventoryBox from "./InventoryBox";
import { useCharacterStore } from "../store";
import { useAuthStore } from "../../auth/store";
import { canCastSpells, calculateSpellSlots } from "../../../rules/spellSlots";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

/**
 * Componente principal del tablero de juego
 * @returns {JSX.Element} Interfaz de juego del personaje
 */
export default function GameDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const { currentCharacter, fetchCharacter } = useCharacterStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [gameState, setGameState] = useState({
    currentHP: 0,
    tempHP: 0,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    initiative: null as number | null,
    showDeathModal: false,
    spellResetKey: 0,
  });

  // Cargar personaje al montar el componente
  useEffect(() => {
    if (id && token) {
      fetchCharacter(parseInt(id), token);
    }
  }, [id, token, fetchCharacter]);

  // Actualizar HP cuando cambia el personaje actual
  useEffect(() => {
    if (currentCharacter) {
      setGameState((prev) => ({
        ...prev,
        currentHP: currentCharacter.hitPoints || 0,
        tempHP: 0,
      }));
    }
  }, [currentCharacter]);

  // Salir del modo de juego y regresar a la lista
  const handleExitGameMode = () => {
    navigate(`/characters/${id}`);
  };

  if (!currentCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="text-center"
          style={{ color: "var(--muted-foreground)" }}
        >
          <p className="mb-4">{t("gameMode.loading")}</p>
        </div>
      </div>
    );
  }

  const dexterityModifier = Math.floor((currentCharacter.dexterity - 10) / 2);
  const wisdomModifier = Math.floor((currentCharacter.wisdom - 10) / 2);
  const constitutionModifier = Math.floor(
    (currentCharacter.constitution - 10) / 2,
  );

  // Death saves effects
  useEffect(() => {
    if (gameState.currentHP > 0) return;
    if (gameState.deathSaveSuccesses >= 3) {
      // Recover 1 HP and reset counters, hide box
      setGameState((prev) => ({
        ...prev,
        currentHP: 1,
        deathSaveSuccesses: 0,
        deathSaveFailures: 0,
      }));
    } else if (gameState.deathSaveFailures >= 3) {
      // Show death modal
      setGameState((prev) => ({ ...prev, showDeathModal: true }));
    }
  }, [
    gameState.currentHP,
    gameState.deathSaveSuccesses,
    gameState.deathSaveFailures,
  ]);

  const reviveCharacter = () => {
    setGameState((prev) => ({
      ...prev,
      currentHP: 1,
      showDeathModal: false,
      deathSaveSuccesses: 0,
      deathSaveFailures: 0,
    }));
  };

  return (
    <div className="min-h-screen bg-background px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex-1">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary"
            style={{ fontFamily: "Cinzel" }}
          >
            {t("gameMode.title")}
          </h1>
          <p className="text-xs sm:text-sm mt-1 text-muted-foreground">
            {currentCharacter.name} - {t("gameMode.level")}{" "}
            {currentCharacter.level}
          </p>
        </div>
        <button
          onClick={handleExitGameMode}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base rounded font-semibold transition-all hover:scale-105 active:scale-95 bg-destructive text-destructive-foreground whitespace-nowrap"
        >
          {t("gameMode.exit")}
        </button>
      </div>

      {/* Top: HP + AC Manager + Rest Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full max-w-2xl lg:max-w-7xl mx-auto">
        <div className="relative h-full">
          <HPTracker
            currentHP={gameState.currentHP}
            tempHP={gameState.tempHP}
            maxHP={currentCharacter.hitPoints}
            onHPChange={(hp) =>
              setGameState((prev) => ({ ...prev, currentHP: hp }))
            }
            onTempHPChange={(hp) =>
              setGameState((prev) => ({ ...prev, tempHP: hp }))
            }
          />
          {/* Death Saves - fully covers HP box when HP is 0 */}
          {gameState.currentHP <= 0 && (
            <div className="absolute inset-0 slide-in z-10">
              <DeathSaves
                successes={gameState.deathSaveSuccesses}
                failures={gameState.deathSaveFailures}
                onSuccessChange={(count) =>
                  setGameState((prev) => ({
                    ...prev,
                    deathSaveSuccesses: count,
                  }))
                }
                onFailureChange={(count) =>
                  setGameState((prev) => ({
                    ...prev,
                    deathSaveFailures: count,
                  }))
                }
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <ACManager baseAC={currentCharacter.armorClass} />
          <RestControls
            maxHP={currentCharacter.hitPoints}
            currentHP={gameState.currentHP}
            constitutionModifier={constitutionModifier}
            onHPChange={(hp) =>
              setGameState((prev) => ({ ...prev, currentHP: hp }))
            }
            onLongRest={() =>
              setGameState((prev) => ({
                ...prev,
                spellResetKey: prev.spellResetKey + 1,
              }))
            }
            onShortRest={() => {
              /* hook reserved for future class-specific */
            }}
          />
        </div>
      </div>

      {/* Middle: Stats Donut + Inventory */}
      <div className="w-full max-w-2xl lg:max-w-7xl mx-auto mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="flex items-center justify-center">
          <StatsDonut
            abilities={{
              strength: currentCharacter.strength,
              dexterity: currentCharacter.dexterity,
              constitution: currentCharacter.constitution,
              intelligence: currentCharacter.intelligence,
              wisdom: currentCharacter.wisdom,
              charisma: currentCharacter.charisma,
            }}
            size={260}
            initiative={gameState.initiative ?? undefined}
            proficiencyBonus={Math.ceil((currentCharacter.level - 1) / 4) + 2}
            savingThrowProficiencies={(() => {
              const abbrevToKey: Record<string, string> = {
                STR: "strength",
                DEX: "dexterity",
                CON: "constitution",
                INT: "intelligence",
                WIS: "wisdom",
                CHA: "charisma",
              };
              return (currentCharacter.proficientSavingThrows || []).map(
                (abbrev) => abbrevToKey[abbrev] || abbrev.toLowerCase(),
              );
            })()}
            skillProficiencies={currentCharacter.proficientSkills || []}
            dexterityModifier={dexterityModifier}
            onInitiativeRoll={(total) =>
              setGameState((prev) => ({ ...prev, initiative: total }))
            }
          />
        </div>
        <div className="min-h-[300px]">
          <InventoryBox
            items={currentCharacter.inventory || []}
            carrying_capacity={Math.floor(currentCharacter.strength * 15)}
            current_weight={
              currentCharacter.current_weight ||
              Math.floor(currentCharacter.strength * 5)
            }
          />
        </div>
      </div>

      {/* Bottom: Spells Box (Spell Slots + Spells List) - only if character can cast spells */}
      {(() => {
        const primaryClassName =
          currentCharacter.classes?.[0]?.name || currentCharacter.class || "";
        const canCast = canCastSpells(primaryClassName);
        if (!canCast) return null;

        // Calculate spell slots to determine if we should show full width spells list
        const spellSlots = calculateSpellSlots(
          currentCharacter.level,
          primaryClassName,
        );
        const hasSpellSlots = spellSlots.length > 0;

        return (
          <div
            className={`mt-6 sm:mt-8 w-full max-w-2xl lg:max-w-7xl mx-auto ${hasSpellSlots ? "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6" : "w-full"}`}
          >
            {hasSpellSlots && (
              <SpellSlotTracker
                characterLevel={currentCharacter.level}
                className={primaryClassName}
                resetKey={gameState.spellResetKey}
              />
            )}
            <SpellsList spells={(currentCharacter as any).spells || []} />
          </div>
        );
      })()}
      {/* Death Modal */}
      {gameState.showDeathModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg shadow-lg p-4 sm:p-6 w-full sm:w-80 text-center bg-card border-2 border-border">
            <div className="text-lg font-bold mb-4 text-foreground">
              {t("gameMode.characterDead")}
            </div>
            <div className="flex gap-2">
              <button
                onClick={reviveCharacter}
                className="flex-1 py-2 px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-secondary text-primary"
              >
                {t("gameMode.revive")}
              </button>
              <button
                onClick={handleExitGameMode}
                className="flex-1 py-2 px-4 rounded font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-destructive text-destructive-foreground"
              >
                {t("gameMode.exit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
