"use client";

import React, { useState } from "react";

interface ImageSeoKeywordsInputProps {
  keywords: string[];
  onChange: (newKeywords: string[]) => void;
  maxKeywords?: number;
  readOnly?: boolean;
}

export const ImageSeoKeywordsInput: React.FC<ImageSeoKeywordsInputProps> = ({
  keywords = [],
  onChange,
  maxKeywords = 4,
  readOnly = false,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addKeyword = (raw: string) => {
    const trimmed = raw.replace(/,/g, "").trim();
    if (!trimmed) return;

    if (keywords.length >= maxKeywords) {
      setErrorMsg(`Maximum ${maxKeywords} keywords allowed.`);
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    if (keywords.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg("Keyword already added.");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    onChange([...keywords, trimmed]);
    setInputVal("");
    setErrorMsg(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(inputVal);
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    if (readOnly) return;
    onChange(keywords.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="w-full bg-[#fffcf7] border border-[#fed7aa] rounded-2xl p-3.5 text-left font-sans shadow-2xs space-y-2.5">
      {/* Header - One Line */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <svg className="w-4 h-4 text-[#ea580c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h4 className="font-sans font-bold text-xs text-[#0f172a] truncate">
            Image SEO Keywords (Max {maxKeywords} Keywords)
          </h4>
        </div>
        <div className="bg-[#ffedd5] text-[#9a3412] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          {keywords.length} / {maxKeywords} KEYWORDS
        </div>
      </div>

      {/* Input box with tags */}
      <div className="bg-white border-2 border-[#fdba74]/80 focus-within:border-[#ea580c] rounded-xl p-2.5 shadow-2xs transition-all space-y-1.5">
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-[#ea580c] text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-2xs"
              >
                <span>{kw}</span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(idx)}
                    className="text-orange-200 hover:text-white transition-colors cursor-pointer text-[10px] ml-0.5"
                    title="Remove keyword"
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {!readOnly && (
          <input
            type="text"
            value={inputVal}
            disabled={keywords.length >= maxKeywords}
            onChange={(e) => {
              const val = e.target.value;
              if (val.includes(",")) {
                addKeyword(val);
              } else {
                setInputVal(val);
              }
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputVal.trim()) addKeyword(inputVal);
            }}
            placeholder={
              keywords.length >= maxKeywords
                ? `Maximum ${maxKeywords} keywords reached`
                : "e.g. Donald Trump, White House, Election 2026"
            }
            className="w-full bg-transparent border-none outline-none text-xs font-sans font-medium text-[#1e293b] placeholder-[#94a3b8] disabled:opacity-60"
          />
        )}
      </div>

      {/* Warning message */}
      {errorMsg && (
        <div className="text-[11px] font-sans font-semibold text-red-500">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Footer hint - One Line non-scrollable */}
      <div className="flex items-center space-x-1 text-[9px] sm:text-[9.5px] text-[#475569] font-sans font-medium whitespace-nowrap tracking-tight leading-none overflow-hidden">
        <span className="shrink-0 text-[10px]">💡</span>
        <span className="truncate">
          Type keyword and press <strong className="font-bold text-[#1e293b]">Enter</strong> or <strong className="font-bold text-[#1e293b]">comma (,)</strong> to add. Maximum {maxKeywords} keywords per image.
        </span>
      </div>
    </div>
  );
};

export default ImageSeoKeywordsInput;
