import { useEffect, useState } from "react";
import {
  calculateSpellSlots,
  calculateSpellSlotsAsync,
} from "../../../rules/spellSlots";

interface SpellSlotTrackerProps {
  characterLevel: number;
  className: string;
  onSlotChange?: (level: number, available: number) => void;
  resetKey?: number; // change value to trigger reset to maximums
}

export default function SpellSlotTracker({
  characterLevel,
  className,
  onSlotChange,
  resetKey,
}: SpellSlotTrackerProps) {
  // Calculate slots based on character level and class (sync fallback initially)
  const [slots, setSlots] = useState(() =>
    calculateSpellSlots(characterLevel, className)
  );

  // Fetch from API on mount and when class/level changes
  useEffect(() => {
    let isMounted = true;

    const fetchSlots = async () => {
      try {
        const apiSlots = await calculateSpellSlotsAsync(
          characterLevel,
          className
        );
        if (isMounted) {
          setSlots(apiSlots);
        }
      } catch (error) {
        console.warn(
          "Failed to fetch spell slots from API, using fallback",
          error
        );
        // Fallback already set in initial state
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [characterLevel, className]);

  const [slotStates, setSlotStates] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    slots.forEach((slot) => {
      initial[slot.level] = slot.maximum;
    });
    return initial;
  });

  // Reset available slots to maximums when resetKey changes or slots change
  useEffect(() => {
    const newStates: Record<number, number> = {};
    slots.forEach((slot) => {
      newStates[slot.level] = slot.maximum;
    });
    setSlotStates(newStates);
  }, [resetKey, slots]);

  const handleSlotToggle = (level: number, index: number) => {
    const current = slotStates[level] || 0;
    const slot = slots.find((s) => s.level === level);
    if (!slot || slot.locked) return;

    // Toggle: if clicking on position beyond current, fill up; otherwise reduce
    const newAvailable = current > index ? current - 1 : index + 1;
    const bounded = Math.max(0, Math.min(newAvailable, slot.maximum));

    setSlotStates((prev) => ({ ...prev, [level]: bounded }));
    onSlotChange?.(level, bounded);
  };

  if (slots.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg shadow-lg p-4 sm:p-6 bg-card border-2 border-border h-full flex flex-col">
      <h3 className="text-sm sm:text-base font-bold mb-4 text-foreground">
        Espacios de Hechizo
      </h3>

      <div className="space-y-3">
        {slots.map((slot) => {
          const current = slotStates[slot.level] ?? slot.maximum;

          // Show locked message if character level is too low
          if (slot.locked) {
            return (
              <div
                key={slot.level}
                className="flex items-center gap-2 sm:gap-3"
              >
                <div className="w-8">
                  <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                    Nv{slot.level}
                  </span>
                </div>
                <div className="text-xs italic text-muted-foreground">
                  Sigue subiendo de nivel
                </div>
              </div>
            );
          }

          return (
            <div key={slot.level} className="flex items-center gap-2 sm:gap-3">
              <div className="w-8">
                <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                  Nv{slot.level}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: slot.maximum }).map((_, i) => (
                  <button
                    key={`slot-${slot.level}-${i}`}
                    onClick={() => handleSlotToggle(slot.level, i)}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all hover:scale-110 ${
                      current > i ? "bg-primary" : "bg-transparent"
                    } border-primary cursor-pointer`}
                    title={`Slot ${i + 1}/${slot.maximum}`}
                  />
                ))}
              </div>
              <span className="text-xs ml-2 text-muted-foreground">
                {current}/{slot.maximum}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
