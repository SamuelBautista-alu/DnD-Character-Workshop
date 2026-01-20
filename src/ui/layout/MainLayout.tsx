import { useState } from "react";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

// Componentes de iconos
const IconHome = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconCharacters = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {/* Group / Party icon: two users */}
    <path d="M16 21v-2a4 4 0 0 0-3-3H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="3" />
    <path d="M22 21v-2a4 4 0 0 0-3-3h-1" />
    <circle cx="17" cy="8" r="3" />
  </svg>
);

const IconHomebrew = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {/* Flask / potion icon for homebrew */}
    <path d="M10 2v4l-4 7a6 6 0 0 0 5 9h2a6 6 0 0 0 5-9l-4-7V2" />
    <line x1="9" y1="2" x2="15" y2="2" />
    <path d="M6 13h12" />
  </svg>
);

const IconNotes = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconProfile = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMenu = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const navIcons: Record<string, React.ReactNode> = {
  "/home": <IconHome />,
  "/characters": <IconCharacters />,
  "/homebrew": <IconHomebrew />,
  "/notes": <IconNotes />,
  "/profile": <IconProfile />,
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { language, toggleLanguage } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-parchment">
      {/* Topbar - Full Width */}
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 shadow-md z-50 h-20"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded transition-colors"
          style={{
            color: "var(--primary-foreground)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <IconMenu />
        </button>

        <h2
          className="text-3xl font-bold flex-1 text-center"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          D&D Character Workshop
        </h2>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="p-2 rounded font-semibold transition-colors"
          style={{
            color: "var(--primary-foreground)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          title={`Switch to ${language === "en" ? "Spanish" : "English"}`}
        >
          {language === "en" ? "ES" : "EN"}
        </button>
      </header>

      {/* Overlay Backdrop - Only visible when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed left-0 right-0 bottom-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
          style={{ cursor: "pointer", top: "80px" }}
        />
      )}

      {/* Sidebar Navigation - Below Topbar - Hovers over content */}
      <aside
        className="fixed left-0 w-64 p-4 transition-all duration-300 overflow-y-auto"
        style={{
          top: "80px",
          height: "calc(100vh - 80px)",
          backgroundColor: "var(--sidebar)",
          color: "var(--sidebar-foreground)",
          borderRight: "1px solid var(--sidebar-border)",
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          zIndex: 40,
        }}
      >
        <nav className="space-y-3 text-[15px] font-semibold">
          {[
            { href: "/home", label: t("nav.home") },
            { href: "/characters", label: t("nav.characters") },
            { href: "/homebrew", label: t("nav.homebrew") },
            { href: "/notes", label: t("nav.notes") },
            { href: "/profile", label: t("nav.profile") },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 py-2 px-4 rounded transition-colors"
              style={{
                color: "var(--sidebar-foreground)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--sidebar-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <span className="flex-shrink-0">{navIcons[link.href]}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content - Always full width */}
      <main style={{ paddingTop: "80px" }}>
        <div className="p-4 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
