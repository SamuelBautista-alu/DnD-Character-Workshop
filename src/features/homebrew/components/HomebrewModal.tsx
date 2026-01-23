import { useEffect } from "react";
import ClassForm from "./ClassForm";
import RaceForm from "./RaceForm";
import SpellForm from "./SpellForm";
import ItemForm from "./ItemForm";
import BackgroundForm from "./BackgroundForm";
import {
  HomebrewClass,
  HomebrewRace,
  HomebrewSpell,
  HomebrewItem,
  HomebrewBackground,
} from "../types";

type ContentType = "class" | "race" | "spell" | "item" | "background";

interface HomebrewModalProps {
  isOpen: boolean;
  contentType: ContentType;
  isEditing?: boolean;
  editingData?:
    | HomebrewClass
    | HomebrewRace
    | HomebrewSpell
    | HomebrewItem
    | HomebrewBackground;
  isLoading?: boolean;
  onClose: () => void;
  onClassSubmit: (
    data: Omit<HomebrewClass, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  onRaceSubmit: (
    data: Omit<HomebrewRace, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  onSpellSubmit: (
    data: Omit<HomebrewSpell, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  onItemSubmit: (
    data: Omit<HomebrewItem, "id" | "createdBy" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  onBackgroundSubmit: (
    data: Omit<
      HomebrewBackground,
      "id" | "createdBy" | "createdAt" | "updatedAt"
    >,
  ) => Promise<void>;
}

const CONTENT_TITLES = {
  class: "Create Custom Class",
  race: "Create Custom Race",
  spell: "Create Custom Spell",
  item: "Create Custom Item",
  background: "Create Custom Background",
};

const EDIT_TITLES = {
  class: "Edit Class",
  race: "Edit Race",
  spell: "Edit Spell",
  item: "Edit Item",
  background: "Edit Background",
};

export default function HomebrewModal({
  isOpen,
  contentType,
  isEditing = false,
  editingData,
  isLoading = false,
  onClose,
  onClassSubmit,
  onRaceSubmit,
  onSpellSubmit,
  onItemSubmit,
  onBackgroundSubmit,
}: HomebrewModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = isEditing
    ? EDIT_TITLES[contentType]
    : CONTENT_TITLES[contentType];

  const handleFormSubmit = async (data: any) => {
    switch (contentType) {
      case "class":
        await onClassSubmit(data);
        break;
      case "race":
        await onRaceSubmit(data);
        break;
      case "spell":
        await onSpellSubmit(data);
        break;
      case "item":
        await onItemSubmit(data);
        break;
      case "background":
        await onBackgroundSubmit(data);
        break;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-70 transition-all"
            style={{ color: "var(--foreground)" }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {contentType === "class" && (
            <ClassForm
              onSubmit={handleFormSubmit}
              initialData={
                isEditing ? (editingData as HomebrewClass) : undefined
              }
              isLoading={isLoading}
              isEditing={isEditing}
            />
          )}

          {contentType === "race" && (
            <RaceForm
              onSubmit={handleFormSubmit}
              initialData={
                isEditing ? (editingData as HomebrewRace) : undefined
              }
              isLoading={isLoading}
              isEditing={isEditing}
            />
          )}

          {contentType === "spell" && (
            <SpellForm
              onSubmit={handleFormSubmit}
              initialData={
                isEditing ? (editingData as HomebrewSpell) : undefined
              }
              isLoading={isLoading}
              isEditing={isEditing}
            />
          )}

          {contentType === "item" && (
            <ItemForm
              onSubmit={handleFormSubmit}
              initialData={
                isEditing ? (editingData as HomebrewItem) : undefined
              }
              isLoading={isLoading}
              isEditing={isEditing}
            />
          )}

          {contentType === "background" && (
            <BackgroundForm
              onSubmit={handleFormSubmit}
              initialData={
                isEditing ? (editingData as HomebrewBackground) : undefined
              }
              isLoading={isLoading}
              isEditing={isEditing}
            />
          )}
        </div>
      </div>
    </div>
  );
}
