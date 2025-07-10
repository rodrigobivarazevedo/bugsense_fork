import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import de from "./de.json";

const LANGUAGE_KEY = "@language";

const getStoredLanguage = (): string => {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
    return storedLanguage || "en";
  } catch (error) {
    console.error("Error getting stored language:", error);
    return "en";
  }
};

const storeLanguage = (language: string): void => {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error("Error storing language:", error);
  }
};

const initializeI18n = () => {
  const storedLanguage = getStoredLanguage();

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng: storedLanguage,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  const originalChangeLanguage = i18n.changeLanguage;
  i18n.changeLanguage = (language: string) => {
    storeLanguage(language);
    return originalChangeLanguage.call(i18n, language);
  };
};

initializeI18n();

export default i18n;
