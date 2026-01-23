import { useEffect, useState } from "react";
import useAuthStore from "@/features/auth/store";
import useHomebrewStore from "../store";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";
import HomebrewModal from "../components/HomebrewModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  HomebrewClass,
  HomebrewRace,
  HomebrewSpell,
  HomebrewItem,
  HomebrewBackground,
} from "../types";

type TabType = "classes" | "races" | "spells" | "items" | "backgrounds";

export default function HomebrewPage() {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);
  const { token } = useAuthStore();
  const {
    classes,
    races,
    spells,
    items,
    backgrounds,
    isLoading,
    error,
    fetchAll,
    createClass,
    updateClass,
    deleteClass,
    createRace,
    updateRace,
    deleteRace,
    createSpell,
    updateSpell,
    deleteSpell,
    createItem,
    updateItem,
    deleteItem,
    createBackground,
    updateBackground,
    deleteBackground,
  } = useHomebrewStore();

  const [activeTab, setActiveTab] = useState<TabType>("classes");
  const [showModal, setShowModal] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editingData, setEditingData] = useState<
    | HomebrewClass
    | HomebrewRace
    | HomebrewSpell
    | HomebrewItem
    | HomebrewBackground
    | undefined
  >();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: TabType;
    id: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      fetchAll(token);
    }
  }, [token, fetchAll]);

  const getContentForTab = () => {
    switch (activeTab) {
      case "classes":
        return classes;
      case "races":
        return races;
      case "spells":
        return spells;
      case "items":
        return items;
      case "backgrounds":
        return backgrounds;
      default:
        return [];
    }
  };

  const filterBySearch = (items: any[]) => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  };

  const content = filterBySearch(getContentForTab());

  const handleCreateClick = () => {
    setIsEditingModal(false);
    setEditingData(undefined);
    setShowModal(true);
  };

  const handleEditClick = (item: any) => {
    setIsEditingModal(true);
    setEditingData(item);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTarget({ type: activeTab, id });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !token) return;

    try {
      switch (deleteTarget.type) {
        case "classes":
          await deleteClass(deleteTarget.id, token);
          break;
        case "races":
          await deleteRace(deleteTarget.id, token);
          break;
        case "spells":
          await deleteSpell(deleteTarget.id, token);
          break;
        case "items":
          await deleteItem(deleteTarget.id, token);
          break;
        case "backgrounds":
          await deleteBackground(deleteTarget.id, token);
          break;
      }
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getContentTypeFromTab = (
    tab: TabType,
  ): "class" | "race" | "spell" | "item" | "background" => {
    switch (tab) {
      case "classes":
        return "class";
      case "races":
        return "race";
      case "spells":
        return "spell";
      case "items":
        return "item";
      case "backgrounds":
        return "background";
    }
  };

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: "classes", label: "Classes", icon: "⚔️" },
    { id: "races", label: "Races", icon: "🧝" },
    { id: "spells", label: "Spells", icon: "✨" },
    { id: "items", label: "Items", icon: "🎒" },
    { id: "backgrounds", label: "Backgrounds", icon: "📖" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--foreground)" }}
          >
            {t("homebrew.title")}
          </h1>
          <p style={{ color: "var(--muted-foreground)" }}>
            {t("homebrew.subtitle")}
          </p>
        </div>

        {error && (
          <div
            className="mb-4 p-3 rounded"
            style={{ backgroundColor: "#fde2e2", color: "#8b2635" }}
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded font-semibold transition-all"
              style={{
                backgroundColor:
                  activeTab === tab.id ? "var(--primary)" : "var(--secondary)",
                color:
                  activeTab === tab.id
                    ? "var(--primary-foreground)"
                    : "var(--secondary-foreground)",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Create Button */}
        <div className="mb-6 flex gap-3 items-center">
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 rounded font-semibold transition-all"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
            }}
          >
            Create New
          </button>

          {/* Search Input */}
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--border)",
              borderRadius: "0.375rem",
              backgroundColor: "var(--input-background)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div style={{ color: "var(--muted-foreground)" }}>Loading...</div>
        ) : content.length === 0 ? (
          <div
            className="text-center py-12"
            style={{ color: "var(--muted-foreground)" }}
          >
            <p className="text-lg">
              {searchQuery
                ? "No results found"
                : `No ${activeTab} created yet. Create your first one!`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item: any) => (
              <div
                key={item.id}
                className="rounded-lg shadow p-4"
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-sm mb-4 line-clamp-3"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {item.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="flex-1 px-3 py-1 rounded text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="flex-1 px-3 py-1 rounded text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--destructive)",
                      color: "var(--destructive-foreground)",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <HomebrewModal
          isOpen={showModal}
          contentType={getContentTypeFromTab(activeTab)}
          isEditing={isEditingModal}
          editingData={editingData}
          isLoading={isLoading}
          onClose={() => {
            setShowModal(false);
            setIsEditingModal(false);
            setEditingData(undefined);
          }}
          onClassSubmit={async (data) => {
            if (isEditingModal && editingData) {
              await updateClass(
                (editingData as HomebrewClass).id,
                data,
                token!,
              );
            } else {
              await createClass(data, token!);
            }
          }}
          onRaceSubmit={async (data) => {
            if (isEditingModal && editingData) {
              await updateRace((editingData as HomebrewRace).id, data, token!);
            } else {
              await createRace(data, token!);
            }
          }}
          onSpellSubmit={async (data) => {
            if (isEditingModal && editingData) {
              await updateSpell(
                (editingData as HomebrewSpell).id,
                data,
                token!,
              );
            } else {
              await createSpell(data, token!);
            }
          }}
          onItemSubmit={async (data) => {
            if (isEditingModal && editingData) {
              await updateItem((editingData as HomebrewItem).id, data, token!);
            } else {
              await createItem(data, token!);
            }
          }}
          onBackgroundSubmit={async (data) => {
            if (isEditingModal && editingData) {
              await updateBackground(
                (editingData as HomebrewBackground).id,
                data,
                token!,
              );
            } else {
              await createBackground(data, token!);
            }
          }}
        />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Item"
          message={`Are you sure you want to delete "${deleteTarget?.id || ""}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
          isLoading={isLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
          }}
        />
      </div>
    </div>
  );
}
