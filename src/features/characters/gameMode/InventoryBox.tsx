/**
 * Caja de Inventario
 * Muestra el inventario del personaje con capacidad de carga y equipamiento
 */

import { InventoryItem } from "../store";

interface InventoryBoxProps {
  items?: InventoryItem[];
  carrying_capacity?: number;
  current_weight?: number;
}

export default function InventoryBox({
  items = [],
  carrying_capacity = 0,
  current_weight = 0,
}: InventoryBoxProps) {
  // Calculate total weight from items
  const calculatedWeight = items.reduce((total, item) => {
    return total + (item.weight || 0) * item.quantity;
  }, 0);

  // Always use calculated weight from inventory items
  const totalWeight = calculatedWeight;
  const weightPercentage =
    carrying_capacity > 0 ? (totalWeight / carrying_capacity) * 100 : 0;
  const isOverencumbered = totalWeight > carrying_capacity;

  return (
    <div
      className="rounded-lg shadow-md p-4 h-full flex flex-col"
      style={{
        backgroundColor: "var(--card)",
        color: "var(--card-foreground)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Título */}
      <h3
        className="text-lg font-bold mb-3"
        style={{ color: "var(--foreground)" }}
      >
        🎒 Inventario
      </h3>

      {/* Contenedor de Items */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {items.length === 0 ? (
          <p
            className="text-sm italic text-center py-4"
            style={{ color: "var(--muted-foreground)" }}
          >
            Sin objetos
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm p-2 rounded"
              style={{
                backgroundColor: "var(--input-background)",
                borderLeft: item.equipped
                  ? "3px solid var(--primary)"
                  : "3px solid transparent",
              }}
            >
              <div className="flex-1">
                <span className="font-semibold">{item.name}</span>
                {item.quantity > 1 && (
                  <span
                    className="ml-2"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    x{item.quantity}
                  </span>
                )}
              </div>
              {item.weight && (
                <span
                  className="text-xs ml-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {item.weight}lb
                </span>
              )}
              {item.equipped && (
                <span
                  className="ml-2 text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  Equipado
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Capacidad de Carga */}
      <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "var(--muted-foreground)" }}>Load:</span>
          <span
            className="font-semibold"
            style={{
              color: isOverencumbered ? "#d9534f" : "var(--foreground)",
            }}
          >
            {totalWeight}/{carrying_capacity} lb
          </span>
        </div>

        {/* Barra de Carga */}
        <div
          className="w-full h-2 rounded overflow-hidden"
          style={{ backgroundColor: "var(--input-background)" }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${Math.min(weightPercentage, 100)}%`,
              backgroundColor:
                weightPercentage <= 75
                  ? "#5cb85c"
                  : weightPercentage <= 100
                    ? "#f0ad4e"
                    : "#d9534f",
            }}
          />
        </div>

        {isOverencumbered && (
          <p
            className="text-xs mt-2 font-semibold"
            style={{ color: "#d9534f" }}
          >
            ⚠️ Sobrecargado
          </p>
        )}
      </div>
    </div>
  );
}
