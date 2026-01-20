/**
 * Data Sync Status Component
 * Shows the status of game data synchronization from the official API
 */

import { useState, useEffect } from "react";
import { getGameDataStore } from "@/lib/gameDataService";

export function DataSyncStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState({
    classesCount: 0,
    spellsCount: 0,
    lastUpdated: new Date(),
  });

  useEffect(() => {
    const store = getGameDataStore();
    setStats({
      classesCount: store.classes.size,
      spellsCount: store.spells.size,
      lastUpdated: new Date(
        Math.max(store.lastUpdated.classes, store.lastUpdated.spells)
      ),
    });

    // Watch for updates
    const interval = setInterval(() => {
      const updatedStore = getGameDataStore();
      setIsUpdating(updatedStore.isUpdating);
      setStats({
        classesCount: updatedStore.classes.size,
        spellsCount: updatedStore.spells.size,
        lastUpdated: new Date(
          Math.max(
            updatedStore.lastUpdated.classes,
            updatedStore.lastUpdated.spells
          )
        ),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <div
      className="text-xs px-3 py-2 rounded flex items-center gap-2"
      style={{
        backgroundColor: isUpdating ? "var(--warning)" : "var(--secondary)",
        color: isUpdating
          ? "var(--warning-foreground)"
          : "var(--secondary-foreground)",
      }}
    >
      {isUpdating && (
        <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse" />
      )}
      <span>
        {isUpdating
          ? "Syncing game data..."
          : `Data synced: ${stats.classesCount} classes, ${stats.spellsCount} spells`}
      </span>
      {!isUpdating && (
        <span className="text-opacity-70" style={{ opacity: 0.7 }}>
          • {formatTime(stats.lastUpdated)}
        </span>
      )}
    </div>
  );
}
