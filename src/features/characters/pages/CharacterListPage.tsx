/**
 * Página de Lista de Personajes
 * Muestra todos los personajes del usuario actual con información básica
 * como nivel, puntos de vida, clase de armadura e iniciativa.
 */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "@/features/auth/store";
import useCharacterStore from "../store";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

/**
 * Componente principal de la lista de personajes
 * @returns {JSX.Element} Lista de personajes del usuario
 */
export default function CharacterListPage() {
  const { token } = useAuthStore();
  const { characters, isLoading, error, fetchCharacters } = useCharacterStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  // Cargar personajes al montar el componente
  useEffect(() => {
    if (token) {
      fetchCharacters(token);
    }
  }, [token, fetchCharacters]);

  /**
   * Calcula el modificador de habilidad basado en la puntuación
   * @param {number} score - Puntuación de habilidad
   * @returns {string} Modificador formateado (ej: "+2" o "-1")
   */
  const getAbilityModifier = (score: number) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-dark">{t("characters.loading")}</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      <h1
        className="text-3xl font-bold text-center mb-2"
        style={{ color: "var(--foreground)" }}
      >
        {t("characters.title")}
      </h1>

      {error && (
        <div
          className="mb-4 p-3 rounded"
          style={{ background: "#fde2e2", color: "#8b2635" }}
        >
          {t("characters.error")} - {error}
        </div>
      )}

      {characters.length === 0 ? (
        <div
          className="border-2 rounded-lg shadow-lg p-8 text-center"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="mb-6 text-lg"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t("characters.noCharacters")}
          </p>
          <Link
            to="/characters/new"
            className="inline-block px-8 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {t("characters.createFirst")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => {
            const hpPercentage =
              (char.hitPoints / (char.maxHitPoints || 1)) * 100;
            const conMod = getAbilityModifier(char.constitution);
            const dexMod = getAbilityModifier(char.dexterity);

            return (
              <div
                key={char.id}
                className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow relative"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  border: "2px solid var(--border)",
                }}
              >
                {/* Level Badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {t("characters.level")} {char.level}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Character Name */}
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {char.name}
                  </h2>

                  {/* Race - Primary Class */}
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {char.race} -{" "}
                    {char.classes && char.classes.length > 0
                      ? `${char.classes[0].name} ${char.classes[0].levels}`
                      : char.class}
                  </p>

                  {/* HP Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span style={{ color: "var(--foreground)" }}>
                        ❤️ {t("characters.hp")}
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {char.hitPoints}/{char.maxHitPoints}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full h-3 overflow-hidden"
                      style={{ backgroundColor: "var(--input-background)" }}
                    >
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${hpPercentage}%`,
                          backgroundColor: "var(--primary)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {/* Armor Class */}
                    <div
                      className="rounded-lg p-3 text-center"
                      style={{
                        backgroundColor: "var(--secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="text-3xl font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {char.armorClass}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {t("characters.ac")}
                      </div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: "var(--primary)" }}
                      >
                        {dexMod}
                      </div>
                    </div>

                    {/* Initiative */}
                    <div
                      className="rounded-lg p-3 text-center"
                      style={{
                        backgroundColor: "var(--secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="text-xl">⚡</div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {t("characters.initiative")}
                      </div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: "var(--primary)" }}
                      >
                        {dexMod}
                      </div>
                    </div>

                    {/* Bonus */}
                    <div
                      className="rounded-lg p-3 text-center"
                      style={{
                        backgroundColor: "var(--secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="text-xl">🗡️</div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {t("characters.bonus")}
                      </div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: "var(--primary)" }}
                      >
                        {conMod}
                      </div>
                    </div>
                  </div>

                  {/* Ability Scores Row */}
                  <div className="grid grid-cols-6 gap-1 text-center text-xs mb-4">
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t("characters.abilities.strength")}
                      </div>
                      <div
                        className="font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {getAbilityModifier(char.strength)}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t("characters.abilities.dexterity")}
                      </div>
                      <div
                        className="font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {dexMod}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t("characters.abilities.constitution")}
                      </div>
                      <div
                        className="font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {conMod}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t("characters.abilities.intelligence")}
                      </div>
                      <div
                        className="font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {getAbilityModifier(char.intelligence)}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t("characters.abilities.wisdom")}
                      </div>
                      <div
                        className="font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {getAbilityModifier(char.wisdom)}
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t("characters.abilities.charisma")}
                      </div>
                      <div
                        className="font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {getAbilityModifier(char.charisma)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/characters/${char.id}`}
                      className="flex-1 py-3 text-center rounded-lg font-semibold transition-all shadow-md"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--secondary-foreground)",
                      }}
                    >
                      {t("characters.details")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        to="/characters/new"
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110 active:scale-95 z-30"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
        title={t("characters.createNewCharacter")}
      >
        +
      </Link>
    </div>
  );
}
