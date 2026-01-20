import { useState, useEffect } from "react";
import useAuthStore from "@/features/auth/store";
import useNoteStore, { Note } from "../store";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

export default function NotesPage() {
  const { token } = useAuthStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);
  const {
    notes,
    currentNote,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    clearError,
  } = useNoteStore();

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [showNotesList, setShowNotesList] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (token) {
      fetchNotes(token);
    }
  }, [token, fetchNotes]);

  useEffect(() => {
    if (currentNote) {
      setTitleInput(currentNote.title);
      setContentInput(currentNote.content);
      setEditingNote(currentNote);
    }
  }, [currentNote]);

  const handleCreateNote = async () => {
    if (!token) return;
    try {
      clearError();
      const newNote = await createNote(
        { title: t("notes.newNote").replace("+ ", ""), content: "" },
        token
      );
      setCurrentNote(newNote);
      if (isMobile) {
        setShowNotesList(false);
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!token || !editingNote?.id) return;
    try {
      clearError();
      await updateNote(
        editingNote.id,
        {
          title: titleInput || t("notes.untitledNote"),
          content: contentInput,
        },
        token
      );
      setEditingNote(null);
      // Refresh the current note
      const updated = {
        ...editingNote,
        title: titleInput || t("notes.untitledNote"),
        content: contentInput,
      };
      setCurrentNote(updated);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!token) return;
    if (!window.confirm(t("notes.deleteConfirm"))) return;
    try {
      clearError();
      await deleteNote(id, token);
      if (currentNote?.id === id) {
        setCurrentNote(null);
        setTitleInput("");
        setContentInput("");
        if (isMobile) {
          setShowNotesList(true);
        }
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleSelectNote = (note: Note) => {
    if (editingNote) {
      setEditingNote(null);
    }
    setCurrentNote(note);
    if (isMobile) {
      setShowNotesList(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: isMobile ? "auto" : "calc(100vh - 100px)",
        gap: "1rem",
        minHeight: isMobile ? "100vh" : "auto",
      }}
    >
      {/* Notes List Sidebar */}
      <div
        style={{
          width: isMobile ? "100%" : "300px",
          height: isMobile
            ? showNotesList
              ? "auto"
              : 0
            : "calc(100vh - 100px)",
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.3s ease",
          maxHeight: isMobile && showNotesList ? "50vh" : undefined,
        }}
      >
        <div
          style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2
              style={{
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              {t("notes.title")}
            </h2>
            {isMobile && currentNote && (
              <button
                onClick={() => setShowNotesList(!showNotesList)}
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleCreateNote}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: isMobile ? "0.875rem" : "0.75rem",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              borderRadius: "0.375rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: 600,
              opacity: isLoading ? 0.6 : 1,
              fontSize: isMobile ? "1rem" : "0.875rem",
            }}
          >
            {t("notes.newNote")}
          </button>
        </div>

        {/* Notes List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.5rem",
          }}
        >
          {notes.length === 0 ? (
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                color: "var(--muted-foreground)",
              }}
            >
              {t("notes.noNotes")}
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleSelectNote(note)}
                style={{
                  padding: isMobile ? "1rem" : "0.75rem",
                  marginBottom: "0.5rem",
                  backgroundColor:
                    currentNote?.id === note.id
                      ? "var(--primary)"
                      : "var(--input-background)",
                  color:
                    currentNote?.id === note.id
                      ? "var(--primary-foreground)"
                      : "var(--foreground)",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border:
                    currentNote?.id === note.id
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  if (currentNote?.id !== note.id && !isMobile) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--card)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentNote?.id !== note.id && !isMobile) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--input-background)";
                  }
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {note.title}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    opacity: 0.7,
                  }}
                >
                  {new Date(
                    note.updatedAt || note.createdAt || ""
                  ).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          overflow: "hidden",
          height: isMobile ? "auto" : "calc(100vh - 100px)",
          minHeight: isMobile && showNotesList ? 0 : "60vh",
        }}
      >
        {currentNote ? (
          <>
            {/* Note Header */}
            <div
              style={{
                padding: isMobile ? "1rem" : "1rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {editingNote ? (
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder={t("notes.noteTitlePlaceholder")}
                  style={{
                    flex: 1,
                    minWidth: isMobile ? "100%" : "auto",
                    padding: isMobile ? "0.75rem" : "0.5rem",
                    fontSize: isMobile ? "1.125rem" : "1.25rem",
                    fontWeight: 600,
                    backgroundColor: "var(--input-background)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.375rem",
                    color: "var(--foreground)",
                  }}
                />
              ) : (
                <h1
                  style={{
                    color: "var(--foreground)",
                    margin: 0,
                    flex: 1,
                    minWidth: 0,
                    wordBreak: "break-word",
                  }}
                >
                  {currentNote.title}
                </h1>
              )}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {editingNote ? (
                  <>
                    <button
                      onClick={handleSaveNote}
                      style={{
                        flex: isMobile ? 1 : "initial",
                        padding: isMobile ? "0.75rem" : "0.5rem 1rem",
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: isMobile ? "1rem" : "0.875rem",
                      }}
                    >
                      {t("notes.save")}
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      style={{
                        flex: isMobile ? 1 : "initial",
                        padding: isMobile ? "0.75rem" : "0.5rem 1rem",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontSize: isMobile ? "1rem" : "0.875rem",
                      }}
                    >
                      {t("notes.cancel")}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingNote(currentNote)}
                      style={{
                        flex: isMobile ? 1 : "initial",
                        padding: isMobile ? "0.75rem" : "0.5rem 1rem",
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: isMobile ? "1rem" : "0.875rem",
                      }}
                    >
                      {t("notes.edit")}
                    </button>
                    <button
                      onClick={() => handleDeleteNote(currentNote.id!)}
                      style={{
                        flex: isMobile ? 1 : "initial",
                        padding: isMobile ? "0.75rem" : "0.5rem 1rem",
                        backgroundColor: "var(--destructive)",
                        color: "var(--destructive-foreground)",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: isMobile ? "1rem" : "0.875rem",
                      }}
                    >
                      {t("notes.delete")}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Note Content */}
            <div
              style={{
                flex: 1,
                padding: isMobile ? "1rem" : "1rem",
                overflow: "hidden",
                minHeight: isMobile ? "40vh" : "auto",
              }}
            >
              {editingNote ? (
                <textarea
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder={t("notes.noteContentPlaceholder")}
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: isMobile ? "0.75rem" : "0.75rem",
                    backgroundColor: "var(--input-background)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.375rem",
                    color: "var(--foreground)",
                    fontFamily: "monospace",
                    fontSize: isMobile ? "1rem" : "0.875rem",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <div
                  style={{
                    color: "var(--foreground)",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowY: "auto",
                    height: "100%",
                    fontSize: isMobile ? "1rem" : "0.95rem",
                  }}
                >
                  {currentNote.content || (
                    <span style={{ color: "var(--muted-foreground)" }}>
                      {t("notes.noContent")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Metadata Footer */}
            <div
              style={{
                padding: isMobile ? "1rem" : "0.75rem 1rem",
                borderTop: "1px solid var(--border)",
                fontSize: isMobile ? "0.875rem" : "0.875rem",
                color: "var(--muted-foreground)",
                overflowX: "auto",
              }}
            >
              {t("notes.created")}{" "}
              {new Date(currentNote.createdAt || "").toLocaleDateString()} •
              {t("notes.updated")}{" "}
              {new Date(currentNote.updatedAt || "").toLocaleDateString()}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: isMobile ? "40vh" : "auto",
              color: "var(--muted-foreground)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            {isMobile && notes.length > 0 ? (
              <button
                onClick={() => setShowNotesList(true)}
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {t("notes.backToNotes")}
              </button>
            ) : (
              t("notes.selectNote")
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "var(--destructive)",
              color: "var(--destructive-foreground)",
              borderTop: "1px solid var(--border)",
            }}
          >
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}
