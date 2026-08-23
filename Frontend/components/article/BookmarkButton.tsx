"use client";

import React, { useState, useEffect } from "react";

interface BookmarkButtonProps {
  article: {
    id?: string;
    slug?: string;
    title?: string;
    deck?: string;
    category?: string;
    date?: string;
    author?: string;
    image?: string;
  };
  variant?: "inline" | "topbar";
}

export default function BookmarkButton({ article, variant = "inline" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const slugOrId = article.slug || article.id || "";

  useEffect(() => {
    if (typeof window !== "undefined" && slugOrId) {
      const checkBookmarkState = () => {
        try {
          const raw = localStorage.getItem("wsj_saved_articles");
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              const exists = list.some((item: any) => item.slug === slugOrId || item.id === slugOrId);
              setIsBookmarked(exists);
            }
          } else {
            setIsBookmarked(false);
          }
        } catch (e) {
          setIsBookmarked(false);
        }
      };

      checkBookmarkState();
      window.addEventListener("wsj_saved_articles_updated", checkBookmarkState);
      return () => window.removeEventListener("wsj_saved_articles_updated", checkBookmarkState);
    }
  }, [slugOrId]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === "undefined" || !slugOrId) return;

    try {
      const raw = localStorage.getItem("wsj_saved_articles");
      let list: any[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];

      const index = list.findIndex((item: any) => item.slug === slugOrId || item.id === slugOrId);

      if (index >= 0) {
        list.splice(index, 1);
        setIsBookmarked(false);
      } else {
        const articleToSave = {
          id: article.id || slugOrId,
          slug: article.slug || slugOrId,
          title: article.title || "Untitled Article",
          deck: article.deck || "",
          category: (article.category || "WORLD").toUpperCase(),
          date: article.date || "Aug 16, 2026",
          author: article.author ? (article.author.toUpperCase().startsWith("BY ") ? article.author.toUpperCase() : `BY ${article.author.toUpperCase()}`) : "BY DYLAN CANDICE ODULIO",
          image: article.image || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
        };
        list.unshift(articleToSave);
        setIsBookmarked(true);
      }

      localStorage.setItem("wsj_saved_articles", JSON.stringify(list));
      window.dispatchEvent(new Event("wsj_saved_articles_updated"));
    } catch (e) {}
  };

  if (variant === "topbar") {
    return (
      <button
        onClick={handleToggleBookmark}
        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
          isBookmarked
            ? "text-white border-[#0f172a] bg-[#0f172a]"
            : "text-[#64748b] hover:text-[#0f172a] hover:border-[#cbd5e1] bg-white border-[#e2e8f0]"
        }`}
        title={isBookmarked ? "Remove bookmark" : "Save article"}
        type="button"
        aria-label="Bookmark article"
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
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition-all cursor-pointer shadow-2xs ${
        isBookmarked
          ? "bg-[#0f172a] text-white border-[#0f172a]"
          : "bg-white hover:bg-slate-100 text-[#334155] border-[#cbd5e1]"
      }`}
      title={isBookmarked ? "Remove Bookmark" : "Save Article Bookmark"}
      aria-label="Save Article Bookmark"
      suppressHydrationWarning
    >
      <svg
        className="w-3.5 h-3.5"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
