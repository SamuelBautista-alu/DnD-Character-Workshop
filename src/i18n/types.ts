/**
 * Types and interfaces for the i18n (internationalization) system
 */

export type Language = "en" | "es";

export interface Translations {
  [key: string]: any;
}

export interface LanguageTranslations {
  [key: string]: Translations;
}
