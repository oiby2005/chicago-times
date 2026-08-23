"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import BookmarkButton from "@/components/article/BookmarkButton";

interface ArticleTopBarProps {
  onFontSizeChange?: (size: "sm" | "md" | "lg") => void;
  article?: any;
}

export default function ArticleTopBar({ onFontSizeChange, article }: ArticleTopBarProps) {
  const [activeSize, setActiveSize] = useState<"sm" | "md" | "lg">("md");
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
