"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ProfileSettingsModal from "@/components/ui/ProfileSettingsModal";

const SAMPLE_SAVED_ARTICLES = [
  {
    id: "art_1",
    slug: "inde-navarrette-went-from-a-struggling-streamer",
    title: "Inde Navarrette Went From A Struggling Streamer to...",
    deck: "The actress discusses her breakout role and journey...",
    category: "WORLD",
    date: "Aug 16, 2026",
    author: "BY DYLAN CANDICE ODULIO",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "art_2",
    slug: "he-packed-his-suitcase-with-200-lizards",
    title: "He Packed His Suitcase With 200 Lizards — Hidden Inside...",
    deck: "Customs officials discover rare reptiles in luggage...",
    category: "ECONOMY & MARKETS",
    date: "Aug 17, 2026",
    author: "BY DYLAN CANDICE ODULIO",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=600&q=80",
  },
];

const formatDateClean = (dateStr?: string) => {
  if (!dateStr) return "Aug 16, 2026";
  let clean = dateStr.replace(/(\s+\d{1,2}:\d{2}.*)|(\s+AT\s+.*)/i, "").trim();
  clean = clean.replace(/([A-Za-z]{3})\./, "$1");
  return clean || "Aug 16, 2026";
};

export default function ReaderDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadSavedArticles = () => {
    if (typeof window !== "undefined") {
      const savedStr = localStorage.getItem("wsj_saved_articles");
      if (savedStr) {
        try {
          const parsedSaved = JSON.parse(savedStr);
          if (Array.isArray(parsedSaved)) {
            setSavedArticles(parsedSaved);
            return;
          }
        } catch (e) {}
      }
      setSavedArticles([]);
    }
  };

  const loadUser = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("wsj_user");
      if (!storedUser) {
        router.push("/signin");
        return;
      }
      try {
        const parsed = JSON.parse(storedUser);
        if (!parsed) {
          router.push("/signin");
          return;
        }
        setCurrentUser(parsed);
      } catch (e) {
        router.push("/signin");
        return;
      }
    }
  };

  useEffect(() => {
    loadUser();
    loadSavedArticles();

    if (typeof window !== "undefined") {
      window.addEventListener("wsj_user_updated", loadUser);
      window.addEventListener("wsj_saved_articles_updated", loadSavedArticles);
      return () => {
        window.removeEventListener("wsj_user_updated", loadUser);
        window.removeEventListener("wsj_saved_articles_updated", loadSavedArticles);
      };
    }
  }, [router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("wsj_user");
      localStorage.removeItem("wsj_token");
      localStorage.setItem("wsj_logged_out", "true");
      sessionStorage.removeItem("wsj_session_active");
      window.dispatchEvent(new Event("wsj_user_updated"));
    }
    router.push("/signin");
  };

  const handleRemoveArticle = (slugOrId: string) => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("wsj_saved_articles");
      let list = raw ? JSON.parse(raw) : [];
      list = list.filter((item: any) => item.slug !== slugOrId && item.id !== slugOrId);
      localStorage.setItem("wsj_saved_articles", JSON.stringify(list));
      setSavedArticles(list);
      window.dispatchEvent(new Event("wsj_saved_articles_updated"));
    } catch (e) {}
  };

  const getInitials = (name: string) => {
    if (!name) return "RU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const readerName = currentUser?.full_name || currentUser?.name || "Reader User";
  const userInitials = getInitials(readerName);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-xs font-bold text-slate-500">
        Loading Reader Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        {/* ==================== HEADER BAR ==================== */}
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40">
          <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-[1.5cm] h-14 sm:h-16 flex items-center justify-between gap-2">
            {/* Left: Back to News Link matching Image 1 */}
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-[13px] font-sans font-bold text-[#506175] hover:text-[#0f172a] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#506175] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to News</span>
            </Link>

            {/* Center: READERS DASHBOARD Title matching Image 1 font & style */}
            <h1 className="font-serif font-extrabold text-sm xs:text-base sm:text-[19px] md:text-xl tracking-[0.04em] text-[#0b132b] uppercase text-center truncate">
              READERS DASHBOARD
            </h1>

            {/* Right: User Profile Pill Button matching Image 1 */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="border border-[#e2e8f0] bg-white hover:bg-slate-50 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 flex items-center space-x-1.5 sm:space-x-2.5 shadow-2xs transition-colors cursor-pointer select-none"
                aria-label="User Profile Dropdown"
                suppressHydrationWarning
              >
                {/* Squircle Avatar Badge matching Image 1 (Photo or Initials) */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-[8px] bg-[#ea580c] text-white font-extrabold text-[10px] sm:text-[11px] flex items-center justify-center shrink-0 overflow-hidden">
                  {currentUser?.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={readerName}
                      className="w-full h-full object-cover rounded-[8px]"
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>

                {/* Reader Name */}
                <span className="font-sans font-bold text-xs sm:text-[13.5px] text-[#0f172a] lowercase truncate max-w-[65px] xs:max-w-[100px] sm:max-w-none">
                  {readerName}
                </span>

                {/* Dropdown Chevron */}
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#64748b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown Menu Options matching user uploaded screenshot */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#e2e8f0] shadow-2xl rounded-2xl p-4 z-50 animate-in zoom-in-95 duration-100 font-sans text-left">
                  {/* Top User Info Section */}
                  <div className="pb-3 border-b border-[#f1f5f9]">
                    <div className="font-bold text-sm text-[#0f172a] lowercase">{readerName}</div>
                    <div className="font-mono text-[11px] text-[#64748b] truncate mt-0.5">{currentUser.email || "reader@gmail.com"}</div>
                    
                    {/* READER Role Badge */}
                    <div className="mt-2.5">
                      <span className="bg-[#eff4f8] text-[#506175] font-sans text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                        {(currentUser.role || "READER").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="pt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-[#1e293b] transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-[#64748b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span>Profile Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-red-50 text-[#dc2626] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-[#dc2626] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ==================== MAIN READER DASHBOARD BODY ==================== */}
        <section className="w-full max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-[1.5cm] pt-4 sm:pt-6 pb-16 font-sans">
          {/* Section Header Row matching Image 1 styling */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2 shrink-0">
              {/* Red Book Icon */}
              <svg className="w-4 h-4 text-[#b91c1c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="font-sans font-extrabold text-xs xs:text-sm sm:text-[15px] tracking-wider text-[#0f172a] uppercase whitespace-nowrap">
                SAVED ARTICLES
              </h2>
            </div>

            {/* Right Pill Badge: N ARTICLES matching Image 1 */}
            <div className="bg-[#eff4f8] text-[#556980] font-mono text-[9.5px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {savedArticles.length} ARTICLES
            </div>
          </div>

          {/* Saved Articles Card Grid matching provided screenshot image */}
          {savedArticles.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0]/80 rounded-2xl py-12 sm:py-14 px-4 sm:px-8 min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center text-center shadow-2xs">
              {/* Center Circular Icon Container */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              {/* No Saved Articles Title */}
              <h3 className="font-sans font-bold text-base text-[#0f172a] mb-1.5">
                No Saved Articles
              </h3>

              {/* Description Subtitle */}
              <p className="font-sans text-xs sm:text-[13px] text-[#94a3b8] max-w-sm leading-relaxed text-center">
                Explore our publications and bookmark your favorite articles to read them here later.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-start gap-3.5 sm:gap-5">
              {savedArticles.map((article: any, index: number) => {
                const articleSlug = article.slug || article.id || `article-${index}`;
                return (
                  <div
                    key={articleSlug}
                    className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group w-full xs:w-[240px] sm:w-[255px] shrink-0"
                  >
                    {/* Top Image Container with Delete Trash Icon matching Image 1 */}
                    <div className="relative w-full h-34 sm:h-36 overflow-hidden bg-slate-100">
                      <img
                        src={article.image || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top-Right Trash Delete Button matching Image 1 */}
                      <button
                        type="button"
                        onClick={() => handleRemoveArticle(article.slug || article.id)}
                        className="absolute top-2 right-2 bg-[#1e293b]/75 hover:bg-[#0f172a] text-white p-1.5 rounded-md transition-colors cursor-pointer shadow-md backdrop-blur-xs"
                        title="Remove from Saved Articles"
                        aria-label="Remove from Saved Articles"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>

                    {/* Bottom Content Portion matching Image 1 */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                      <div>
                        {/* Category & Date matching Image 1 */}
                        <div className="flex items-center space-x-1.5 font-mono text-[10.5px] tracking-tight mb-1">
                          <span className="font-bold text-[#0284c7] uppercase tracking-wider">{article.category || "WORLD"}</span>
                          <span className="text-[#8c9aa8]">•</span>
                          <span className="text-[#8c9aa8]">
                            {formatDateClean(article.date)}
                          </span>
                        </div>

                        {/* Article Title matching Image 1 */}
                        <Link href={`/article/${articleSlug}`}>
                          <h3 className="font-serif font-bold text-[14.5px] text-[#111111] leading-[1.3] line-clamp-2 hover:text-[#0284c7] transition-colors cursor-pointer">
                            {article.title}
                          </h3>
                        </Link>
                      </div>

                      {/* Author Byline font-mono matching Image 1 */}
                      <div className="font-mono text-[10px] font-medium text-[#8c9aa8] uppercase tracking-wider pt-2 border-t border-[#f1f5f9] truncate">
                        {article.author || "BY DYLAN CANDICE ODULIO"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Profile Settings Modal matching Writer Dashboard */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSave={(updatedUser) => {
          setCurrentUser(updatedUser);
          setShowProfileModal(false);
        }}
      />
    </main>
  );
}
