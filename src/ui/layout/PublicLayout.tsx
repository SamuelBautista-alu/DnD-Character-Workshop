import { useState } from "react";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";
import { Link } from "react-router-dom";

// Componentes de iconos
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

export default function PublicLayout({
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
          <Link
            to="/login"
            className="flex items-center gap-3 py-2 px-4 rounded transition-colors"
            style={{
              color: "var(--sidebar-foreground)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <IconProfile />
            <span>{t("nav.profile")}</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content - Adjust margin for sidebar */}
      <main
        className="pt-20 px-4 sm:px-6 pb-6"
        style={{
          marginLeft: isSidebarOpen ? "256px" : "0",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {children}
      </main>
    </div>
  );
}
