"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type AppLanguage = "EN" | "GU" | "HI";

const STORAGE_KEY = "nd_lang";

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "EN",
  setLang: () => {},
});

function detectDeviceLanguage(): AppLanguage {
  if (typeof navigator === "undefined") return "EN";
  const locale = navigator.language || "";
  if (locale.toLowerCase().startsWith("gu")) return "GU";
  if (locale.toLowerCase().startsWith("hi")) return "HI";
  return "EN";
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<AppLanguage>("EN");

  // Initialise from localStorage or device language
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AppLanguage | null;
    setLangState(stored ?? detectDeviceLanguage());
  }, []);

  const setLang = useCallback((next: AppLanguage) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    // TODO: if user is logged in, PATCH /api/user/language
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
