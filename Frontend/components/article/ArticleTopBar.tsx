"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";

interface ArticleTopBarProps {
  onFontSizeChange?: (size: "sm" | "md" | "lg") => void;
}

export default function ArticleTopBar({ onFontSizeChange }: ArticleTopBarProps) {
  const [activeSize, setActiveSize] = useState<"sm" | "md" | "lg">("md");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleSizeClick = (size: "sm" | "md" | "lg") => {
    setActiveSize(size);
    if (onFontSizeChange) {
      onFontSizeChange(size);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white relative">
      <Container className="pt-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
        {/* Left: Back to Newsfeed */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[#505e70] hover:text-[#0f172a] tracking-wider uppercase transition-colors group select-none"
        >
          <svg
            className="w-3.5 h-3.5 text-[#505e70] group-hover:text-[#0f172a] transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>BACK TO NEWSFEED</span>
        </Link>

        {/* Right: Controls (Font size, Bookmark, Share) */}
        <div className="flex items-center gap-2.5">
          {/* Font Size Segmented Control */}
          <div className="inline-flex items-center rounded-lg bg-[#f8fafc] border border-[#e2e8f0] p-1 gap-1 select-none">
            <button
              onClick={() => handleSizeClick("sm")}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                activeSize === "sm"
                  ? "bg-white text-[#0f172a] shadow-xs border border-[#e2e8f0]"
                  : "text-[#8c9aa8] hover:text-[#0f172a]"
              }`}
              title="Small text"
              type="button"
            >
              A
            </button>
            <button
              onClick={() => handleSizeClick("md")}
              className={`px-2.5 py-0.5 rounded text-sm font-bold transition-all ${
                activeSize === "md"
                  ? "bg-white text-[#0f172a] shadow-xs border border-[#e2e8f0]"
                  : "text-[#8c9aa8] hover:text-[#0f172a]"
              }`}
              title="Medium text"
              type="button"
            >
              A
            </button>
            <button
              onClick={() => handleSizeClick("lg")}
              className={`px-2 py-0.5 rounded text-base font-bold transition-all ${
                activeSize === "lg"
                  ? "bg-white text-[#0f172a] shadow-xs border border-[#e2e8f0]"
                  : "text-[#8c9aa8] hover:text-[#0f172a]"
              }`}
              title="Large text"
              type="button"
            >
              A
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`w-9 h-9 rounded-full border border-[#e2e8f0] bg-white flex items-center justify-center transition-all ${
              isBookmarked
                ? "text-[#0f172a] border-[#0f172a] bg-[#f8fafc]"
                : "text-[#64748b] hover:text-[#0f172a] hover:border-[#cbd5e1]"
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save article"}
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:text-[#0f172a] hover:border-[#cbd5e1] transition-all relative"
            title="Share article"
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.367 3 3 0 000 5.367zm0 11.367a3 3 0 100-5.367 3 3 0 000 5.367z"
              />
            </svg>
          </button>
        </div>
        </div>
      </Container>

      {/* Copy link feedback toast */}
      {showShareToast && (
        <div className="absolute right-6 top-16 bg-[#0f172a] text-white text-xs px-3 py-1.5 rounded shadow-lg z-50 animate-fade-in">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
