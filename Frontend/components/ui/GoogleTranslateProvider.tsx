"use client";

import React, { useEffect } from "react";

export const LANGUAGE_EDITIONS = [
  { label: "English", code: "en" },
  { label: "Spanish", code: "es" },
  { label: "German", code: "de" },
  { label: "Korean", code: "ko" },
  { label: "Chinese", code: "zh-CN" },
];

export const setSiteLanguageEdition = (languageLabel: string) => {
  if (typeof window === "undefined") return;

  const found = LANGUAGE_EDITIONS.find(
    (l) => l.label.toLowerCase() === languageLabel.toLowerCase()
  );
  const targetCode = found ? found.code : "en";
  const targetLabel = found ? found.label : "English";

  // 1. Save to LocalStorage
  localStorage.setItem("wsj_selected_edition", targetLabel);
  localStorage.setItem("wsj_edition_lang_code", targetCode);

  // 2. Set googtrans cookies
  const cookiePath = targetCode === "en" ? "" : `/en/${targetCode}`;
  const domain = window.location.hostname;

  if (targetCode === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
  } else {
    document.cookie = `googtrans=${cookiePath}; path=/;`;
    document.cookie = `googtrans=${cookiePath}; path=/; domain=${domain}`;
    document.cookie = `googtrans=${cookiePath}; path=/; domain=.${domain}`;
  }

  // 3. Try DOM select element trigger
  const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (selectEl) {
    selectEl.value = targetCode === "en" ? "en" : targetCode;
    selectEl.dispatchEvent(new Event("change"));
  }

  // 4. Broadcast UI update
  window.dispatchEvent(
    new CustomEvent("wsj_edition_changed", {
      detail: { label: targetLabel, code: targetCode },
    })
  );

  // 5. If select element was not found or if switching back to English, refresh page to enforce cookie
  if (!selectEl || targetCode === "en") {
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }
};

export const getSavedEdition = (): string => {
  if (typeof window === "undefined") return "English";
  return localStorage.getItem("wsj_selected_edition") || "English";
};

export default function GoogleTranslateProvider() {
  useEffect(() => {
    // Global callback for Google Translate
    (window as any).googleTranslateElementInit = () => {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,de,ko,zh-CN",
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      } catch (e) {}
    };

    // Load Google Translate script if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      className="absolute -top-[9999px] -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
