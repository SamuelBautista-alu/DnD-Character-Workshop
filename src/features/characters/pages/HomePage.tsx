import { Link } from "react-router-dom";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";
import useAuthStore from "@/features/auth/store";

export default function HomePage() {
  const { language } = useLanguageStore();
  const { token } = useAuthStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative bg-gradient-to-r from-burgundy-dark to-burgundy-light rounded-lg p-12 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
          <div className="relative z-10">
            <h1
              className="text-5xl font-bold mb-4 text-black"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {t("hero.title")}
            </h1>
            <p className="text-xl mb-6 text-black/90">
              {t("hero.description")}
            </p>
            <div className="flex gap-4">
              {token ? (
                <>
                  <Link
                    to="/characters/new"
                    className="inline-block bg-burgundy-dark text-black font-bold py-3 px-8 rounded-lg hover:bg-burgundy-light transition-colors border border-burgundy-dark"
                  >
                    {t("hero.createButton")}
                  </Link>
                  <Link
                    to="/characters"
                    className="inline-block bg-white/20 text-black font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition-colors border border-white"
                  >
                    {t("hero.viewButton")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-block bg-burgundy-dark text-black font-bold py-3 px-8 rounded-lg hover:bg-burgundy-light transition-colors border border-burgundy-dark"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-block bg-white/20 text-black font-bold py-3 px-8 rounded-lg hover:bg-white/30 transition-colors border border-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2
          className="text-3xl font-bold text-burgundy-dark mb-8"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {t("features.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Character Creation */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-2xl">
                  ⚔️
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {t("features.characterCreation.title")}
              </h3>
              <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                {t("features.characterCreation.description")}
              </p>
              <Link
                to="/characters/new"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {t("features.characterCreation.link")}
              </Link>
            </div>
          </div>

          {/* Character Management */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-2xl">
                  👥
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {t("features.characterManagement.title")}
              </h3>
              <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                {t("features.characterManagement.description")}
              </p>
              <Link
                to="/characters"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {t("features.characterManagement.link")}
              </Link>
            </div>
          </div>

          {/* Game Mode */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-2xl">
                  🎲
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {t("features.gameMode.title")}
              </h3>
              <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                {t("features.gameMode.description")}
              </p>
              <Link
                to="/characters"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {t("features.gameMode.link")}
              </Link>
            </div>
          </div>

          {/* Spell Management */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-2xl">
                  ✨
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {t("features.spellTracking.title")}
              </h3>
              <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                {t("features.spellTracking.description")}
              </p>
              <Link
                to="/characters"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {t("features.spellTracking.link")}
              </Link>
            </div>
          </div>

          {/* Notes */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-2xl">
                  📝
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {t("features.notes.title")}
              </h3>
              <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                {t("features.notes.description")}
              </p>
              <Link
                to="/notes"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {t("features.notes.link")}
              </Link>
            </div>
          </div>

          {/* Profile */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-2xl">
                  👤
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {t("features.profile.title")}
              </h3>
              <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                {t("features.profile.description")}
              </p>
              <Link
                to="/profile"
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                {t("features.profile.link")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Updates */}
      <section className="mb-12">
        <h2
          className="text-3xl font-bold text-burgundy-dark mb-8"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {t("comingSoon.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Homebrew System */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow opacity-75 hover:opacity-100"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("comingSoon.homebrewSystem.title")}
                  </h3>
                  <p
                    className="mb-3"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t("comingSoon.homebrewSystem.description")}
                  </p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {t("comingSoon.homebrewSystem.badge")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Character Sharing */}
          <div
            className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow opacity-75 hover:opacity-100"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              border: "2px solid var(--border)",
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("comingSoon.characterSharing.title")}
                  </h3>
                  <p
                    className="mb-3"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t("comingSoon.characterSharing.description")}
                  </p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {t("comingSoon.characterSharing.badge")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-burgundy-light/10 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-burgundy-dark mb-2">
              {t("quickStats.edition")}
            </div>
            <p className="text-text-dark">{t("quickStats.editionDesc")}</p>
          </div>
          <div className="bg-burgundy-light/10 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-burgundy-dark mb-2">
              {t("quickStats.classes")}
            </div>
            <p className="text-text-dark">{t("quickStats.classesDesc")}</p>
          </div>
          <div className="bg-burgundy-light/10 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-burgundy-dark mb-2">
              {t("quickStats.multiclass")}
            </div>
            <p className="text-text-dark">{t("quickStats.multiclassDesc")}</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-12">
        <p className="text-text-dark mb-6">{t("footer.cta")}</p>
        <Link
          to="/characters/new"
          className="inline-block bg-burgundy-dark text-black font-bold py-3 px-10 rounded-lg hover:bg-burgundy-light transition-colors"
        >
          {t("footer.button")}
        </Link>
      </section>
    </div>
  );
}
