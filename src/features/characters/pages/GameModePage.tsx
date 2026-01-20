export default function GameModePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-burgundy-dark mb-4">Game Mode</h1>
      <p className="text-text-dark mb-6">
        Real-time character management during gameplay
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-burgundy-dark mb-4">
            Hit Points
          </h3>
          <p className="text-gray-500">HP tracker - coming soon</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-burgundy-dark mb-4">
            Spell Slots
          </h3>
          <p className="text-gray-500">Spell slot tracker - coming soon</p>
        </div>
      </div>
    </div>
  );
}
