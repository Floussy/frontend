import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// FR
import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frHome from "./locales/fr/home.json";
import frDashboard from "./locales/fr/dashboard.json";
import frRecurring from "./locales/fr/recurring.json";

// EN
import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enHome from "./locales/en/home.json";
import enDashboard from "./locales/en/dashboard.json";
import enRecurring from "./locales/en/recurring.json";

// AR
import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arHome from "./locales/ar/home.json";
import arDashboard from "./locales/ar/dashboard.json";
import arRecurring from "./locales/ar/recurring.json";

const resources = {
  fr: {
    common: frCommon,
    auth: frAuth,
    home: frHome,
    dashboard: frDashboard,
    recurring: frRecurring,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    dashboard: enDashboard,
    recurring: enRecurring,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    home: arHome,
    dashboard: arDashboard,
    recurring: arRecurring,
  },
};

export const RTL_LANGUAGES = ["ar"];

export function isRTL(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    defaultNS: "common",
    ns: ["common", "auth", "home", "dashboard", "recurring"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
