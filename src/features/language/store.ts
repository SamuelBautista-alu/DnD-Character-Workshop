import { create } from "zustand";

export type Language = "en" | "es";

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: (localStorage.getItem("language") as Language) || "en",
  setLanguage: (lang: Language) => {
    localStorage.setItem("language", lang);
    set({ language: lang });
  },
  toggleLanguage: () => {
    set((state) => {
      const newLang = state.language === "en" ? "es" : "en";
      localStorage.setItem("language", newLang);
      return { language: newLang };
    });
  },
}));
