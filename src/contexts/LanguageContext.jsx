import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "app_language";

import en from "./locales/en";
import vi from "./locales/vi";

const translations = { en, vi };

const LanguageContext = createContext({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(
    () => localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en"
  );

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key) => translations[locale]?.[key] || key,
    }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
