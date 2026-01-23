import { useCharacterStore } from "../../store";

export default function LevelStep() {
  const { character, setField } = useCharacterStore();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Level</h2>

      <input
        type="number"
        min={1}
        max={20}
        value={character.level}
        onChange={(e) => setField("level", Number(e.target.value))}
        className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
      />

      <div className="mt-4 text-sm opacity-80 space-y-1">
        <p>Proficiency Bonus: +{character.derived.proficiencyBonus}</p>
        <p>Max HP: {character.derived.maxHP}</p>
        {character.derived.spellSlots.length > 0 && (
          <p>Spell Slots: {character.derived.spellSlots.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
