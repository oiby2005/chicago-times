"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { homepageArticles } from "@/data/articles";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? Object.values(homepageArticles).filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.summary?.toLowerCase().includes(query.toLowerCase()) ||
          article.category?.toLowerCase().includes(query.toLowerCase()) ||
          article.author?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-white/92 backdrop-blur-xs flex flex-col justify-start pt-6 px-4 md:px-12 select-none overflow-y-auto animate-fadeIn">
      {/* Top Close Button (Screenshot) */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-2xl font-light text-gray-500 hover:text-black transition-colors focus:outline-none cursor-pointer"
        aria-label="Close search"
      >
        ✕
      </button>

      <div className="max-w-4xl mx-auto w-full pt-10 pb-16">
        {/* Main Search Input Form Row (Screenshot) */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-10"
        >
          <div className="flex-1 relative border-b-2 border-[#007cba] pb-1">
            <input
              type="text"
              placeholder="Enter News, Quotes, Companies or Videos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-lg sm:text-2xl font-sans text-black placeholder:text-gray-400 outline-none pr-4"
            />
          </div>

          <button
            type="submit"
            className="bg-[#bcbcbc] hover:bg-[#999999] text-white text-xs font-bold font-sans tracking-wider px-5 py-2.5 rounded-xs flex items-center justify-center space-x-1.5 uppercase transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <span>SEARCH</span>
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Centered Helper Box (Screenshot) */}
        <div className="max-w-xl mx-auto bg-[#f2f2f2] p-8 text-center rounded-xs space-y-3 border border-[#e2e2e2] shadow-xs my-6">
          <div className="text-xl text-black flex justify-center mb-1">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h3 className="font-sans font-black text-xl sm:text-2xl text-black leading-tight">
            Find what you’re looking for
          </h3>

          <p className="text-xs font-sans text-[#555555] leading-relaxed max-w-md mx-auto">
            Search for topics like “tariffs”, your favorite authors, companies or even a more specific query like “dollar’s role as a reserve currency”.
          </p>
        </div>

        {/* Search Results Display */}
        {query.trim() !== "" && (
          <div className="mt-8 pt-6 border-t border-[#e2e2e2]">
            <div className="text-xs font-sans font-bold text-gray-500 uppercase tracking-wider mb-4">
              {results.length} Search Result{results.length !== 1 ? "s" : ""} for “{query}”
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    onClick={onClose}
                    className="block group bg-white p-4 border border-[#e2e2e2] rounded-xs hover:border-black transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#cc0000]">
                          {article.category || "News"}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-black leading-tight group-hover:underline">
                          {article.title}
                        </h4>
                        {article.summary && (
                          <p className="text-xs font-sans text-gray-600 line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        <div className="text-[11px] font-sans text-gray-500 pt-1">
                          By <span className="font-bold text-black">{article.author || "WSJ Staff"}</span> • {article.publishedDate || "August 7, 2026"}
                        </div>
                      </div>
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-20 h-16 object-cover rounded-xs shrink-0"
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm font-sans text-gray-500">
                No matching articles found for “{query}”. Try another search term.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
