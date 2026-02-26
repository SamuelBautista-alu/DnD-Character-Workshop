/**
 * Sistema de Internacionalización (i18n)
 * Sistema modular de traducciones organizadas por características
 * Las traducciones están ubicadas en: src/i18n/en/ y src/i18n/es/
 */

import { en } from "../i18n/en";
import { es } from "../i18n/es";

export const translations = {
  en,
  es,
};

export type Language = "en" | "es";

/**
 * Gets a translation value from the translations object using dot notation
 * @param lang - Language code ('en' or 'es')
 * @param key - Translation key using dot notation (e.g., 'nav.home', 'auth.login.title')
 * @returns The translated string, or the key if translation not found
 */
export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Return the key if translation not found
    }
  }

  return typeof value === "string" ? value : key;
};
