import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

export default function HomebrewPage() {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-burgundy-dark mb-4">
        {t("homebrew.title")}
      </h1>
      <p className="text-text-dark mb-12">{t("homebrew.subtitle")}</p>

      <div className="flex flex-col items-center justify-center gap-8">
        {/* Potion Flask SVG */}
        <svg
          viewBox="0 0 24 24"
          className="w-48 h-48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "var(--primary)" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flask / potion icon */}
          <path d="M10 2v4l-4 7a6 6 0 0 0 5 9h2a6 6 0 0 0 5-9l-4-7V2" />
          <line x1="9" y1="2" x2="15" y2="2" />
          <path d="M6 13h12" />
        </svg>

        {/* Under Construction Text */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-burgundy-dark mb-2">
            {t("homebrew.underConstruction")}
          </h2>
          <p className="text-lg" style={{ color: "var(--muted-foreground)" }}>
            {t("homebrew.constructionMsg")}
          </p>
        </div>
      </div>
    </div>
  );
}
