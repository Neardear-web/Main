"use client";

import { useLanguage } from "@/lib/language";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white text-sm font-medium select-none overflow-hidden">
      <button
        onClick={() => setLang("EN")}
        aria-pressed={lang === "EN"}
        className={`px-3 py-1 transition-colors ${
          lang === "EN"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("GU")}
        aria-pressed={lang === "GU"}
        className={`px-3 py-1 transition-colors ${
          lang === "GU"
            ? "bg-[#FF9933] text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        ગુ
      </button>
      <button
        onClick={() => setLang("HI")}
        aria-pressed={lang === "HI"}
        className={`px-3 py-1 transition-colors ${
          lang === "HI"
            ? "bg-[#E07B2F] text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        हि
      </button>
    </div>
  );
}
