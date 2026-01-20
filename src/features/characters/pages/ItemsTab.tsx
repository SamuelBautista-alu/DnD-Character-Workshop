/**
 * Pestaña de Inventario para Edición de Personaje
 * Permite gestionar los objetos y equipamiento del personaje
 */

import { useState, useEffect } from "react";
import { Character, InventoryItem } from "../store";

interface ItemsTabProps {
  formData: Partial<Character>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onInventoryChange?: (
    inventory: InventoryItem[],
    currentWeight: number
  ) => void;
}

export default function ItemsTab({
  formData,
  handleChange,
  onInventoryChange,
}: ItemsTabProps) {
  // Estado local para inventario
  const [items, setItems] = useState<InventoryItem[]>(
    (formData as any)?.inventory || []
  );

  // Sincronizar con formData cuando cambia el inventario
  useEffect(() => {
    // Calcular y sincronizar el peso actual
    const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight || 0) * item.quantity,
      0
    );

    // Notificar al padre del cambio
    if (onInventoryChange) {
      onInventoryChange(items, totalWeight);
    }
  }, [items, onInventoryChange]);

  // Calcular modificador de fuerza
  const strength = (formData as any)?.strength || 10;
  const strModifier = strength;
  // Capacidad de carga basada en fuerza
  const carryingCapacity = strModifier * 15;
  const totalWeight = items.reduce(
    (sum, item) => sum + (item.weight || 0) * item.quantity,
    0
  );
  const isOverencumbered = totalWeight > carryingCapacity;

  const addItem = () => {
    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      name: "Nuevo objeto",
      quantity: 1,
      weight: 1,
      equipped: false,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string | undefined) => {
    if (!id) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string | undefined,
    field: keyof InventoryItem,
    value: any
  ) => {
    if (!id) return;
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div>
      <p
        style={{
          color: "var(--muted-foreground)",
          marginBottom: "2rem",
        }}
      >
        Gestiona el inventario y equipamiento de tu personaje
      </p>

      {/* Capacidad de Carga */}
      <div
        style={{
          backgroundColor: "var(--input-background)",
          border: "1px solid var(--border)",
          borderRadius: "0.375rem",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
            Capacidad de Carga
          </span>
          <span
            style={{
              color: isOverencumbered ? "#d9534f" : "var(--foreground)",
              fontWeight: 600,
            }}
          >
            {totalWeight}/{carryingCapacity} lb
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "var(--border)",
            borderRadius: "0.25rem",
            overflow: "hidden",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: `${Math.min(
                (totalWeight / carryingCapacity) * 100,
                100
              )}%`,
              height: "100%",
              backgroundColor:
                totalWeight <= carryingCapacity * 0.75
                  ? "#5cb85c"
                  : totalWeight <= carryingCapacity
                  ? "#f0ad4e"
                  : "#d9534f",
              transition: "width 0.2s ease",
            }}
          />
        </div>

        {isOverencumbered && (
          <p style={{ color: "#d9534f", fontSize: "0.875rem", margin: 0 }}>
            ⚠️ Sobrecargado: Velocidad reducida a la mitad
          </p>
        )}
      </div>

      {/* Items List */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ color: "var(--foreground)", marginBottom: "1rem" }}>
          Objetos ({items.length})
        </h4>

        {items.length === 0 ? (
          <p
            style={{
              color: "var(--muted-foreground)",
              textAlign: "center",
              padding: "2rem",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
            }}
          >
            Sin objetos. Añade algunos para comenzar.
          </p>
        ) : (
          <div style={{ marginBottom: "1rem" }}>
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto",
                  gap: "0.75rem",
                  alignItems: "flex-end",
                  padding: "1rem",
                  backgroundColor: "var(--input-background)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.375rem",
                  marginBottom: "0.75rem",
                  borderLeft: item.equipped
                    ? "3px solid var(--primary)"
                    : "3px solid transparent",
                }}
              >
                {/* Nombre */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                    placeholder="Nombre del objeto"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid var(--border)",
                      borderRadius: "0.25rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                {/* Cantidad */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    min="1"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid var(--border)",
                      borderRadius: "0.25rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                {/* Peso */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Peso (lb)
                  </label>
                  <input
                    type="number"
                    value={item.weight || 0}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "weight",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    min="0"
                    step="0.5"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid var(--border)",
                      borderRadius: "0.25rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                {/* Equipado */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Estado
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "2.375rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        color: "var(--foreground)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.equipped || false}
                        onChange={(e) =>
                          updateItem(item.id, "equipped", e.target.checked)
                        }
                        style={{ cursor: "pointer" }}
                      />
                      Equipado
                    </label>
                  </div>
                </div>

                {/* Notas */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Notas
                  </label>
                  <input
                    type="text"
                    value={item.notes || ""}
                    onChange={(e) =>
                      updateItem(item.id, "notes", e.target.value)
                    }
                    placeholder="Notas opcionales"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid var(--border)",
                      borderRadius: "0.25rem",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                {/* Eliminar */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#d9534f",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as any).style.backgroundColor = "#c9302c";
                    (e.target as any).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as any).style.backgroundColor = "#d9534f";
                    (e.target as any).style.transform = "scale(1)";
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Button */}
      <button
        onClick={addItem}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as any).style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          (e.target as any).style.transform = "scale(1)";
        }}
      >
        + Añadir Objeto
      </button>
    </div>
  );
}
