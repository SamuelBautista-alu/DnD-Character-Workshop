// English translations - barrel export
import { nav, hero, features, comingSoon, quickStats, footer } from "./common";
import * as auth from "./auth";
import * as characters from "./characters";
import * as homebrew from "./homebrew";
import * as pages from "./pages";

export const en = {
  nav,
  hero,
  features,
  comingSoon,
  quickStats,
  footer,
  ...auth,
  ...characters,
  ...homebrew,
  ...pages,
};
