"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserProfile } from "@/components/ui/ProfileSettingsModal";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";
import { getUserDashboardUrl } from "@/data/authors";

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onOpenSearch?: () => void;
}

const ALL_CATEGORIES = [
  "News",
  "Law",
  "Politics",
  "Business",
  "Markets & Finance",
  "Economy",
  "Tech",
  "Entertainment",
  "Arts",
  "Industries",
  "Fashion",
  "Investing",
  "Health",
  "Sports",
  "Lifestyle",
  "Science",
  "Interviews",
];

const CATEGORY_SUB_ITEMS: Record<string, string[]> = {
  News: ["U.S. News", "International News"],
  Law: ["Criminal Cases", "Legal Affairs"],
  Politics: ["World Politics", "Congress", "Elections"],
  Business: ["Corporate News", "Small Business", "Entrepreneurship", "CEOs & Executives"],
  "Markets & Finance": ["Stocks", "Currencies", "Banking"],
  Economy: ["Jobs & Employment", "Interest Rates"],
  Tech: ["Artificial Intelligence", "Cybersecurity", "Innovation"],
  Entertainment: ["Movies", "Television", "Music", "Celebrity"],
  Arts: ["Upcoming Brands", "Architecture", "Books", "Culture"],
  Industries: ["Energy", "Automotive", "Manufacturing", "Agriculture", "Construction"],
  Fashion: ["Designers", "Jewelry"],
  Investing: ["Stocks", "Real Estate", "Wealth Management", "Crypto"],
  Health: ["Medical Research", "Mental Health"],
  Sports: ["Soccer", "Golf", "Tennis", "Cricket"],
  Lifestyle: ["Travel", "Food & Dining", "Cars"],
  Science: ["Space", "Climate", "Environment", "Research"],
  Interviews: [],
};

export default function SidebarDrawer({
  isOpen,
  onClose,
  currentUser = null,
  onOpenSearch,
}: SidebarDrawerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex select-none text-[#111111] font-sans">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Vertical Slide-over Side Drawer (100% Matching Image 1) */}
      <div className="relative w-full max-w-[320px] sm:max-w-[360px] bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-[101] animate-in slide-in-from-left duration-200">
        
        {/* 1. Header Row: Times Chicago Logo + Close Button (✕) */}
        <div className="px-5 py-4 border-b border-[#EAE6DA] flex items-center justify-between bg-[#FAF9F6]">
          <Link href="/" onClick={onClose} className="inline-block py-1">
            <img
              src="/images/design-reference/Times Chicago.svg"
              alt="Times Chicago"
              className="h-7 w-auto object-contain block max-h-8"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-700 hover:text-black transition-colors rounded-sm cursor-pointer"
            aria-label="Close Drawer"
            title="Close Drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Search Bar Trigger (Matching Image 1) */}
        <div className="p-4 border-b border-[#EAE6DA]">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-[#F3EFE6] text-[#555555] text-xs font-sans rounded-none hover:bg-[#EAE4D6] transition-colors cursor-pointer border border-[#E0DCD3]"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Times Chicago...
            </span>
            <span className="text-[10px] text-gray-400 font-mono">⌘K</span>
          </button>
        </div>

        {/* 3. Action Buttons Row: Newsletters & Special Offer (Matching Image 1) */}
        <div className="px-4 py-3 border-b border-[#EAE6DA] grid grid-cols-2 gap-2">
          <Link href="/newsletters" onClick={onClose}>
            <button className="w-full bg-black text-white font-sans text-xs font-bold py-2.5 rounded-none hover:bg-gray-800 transition-colors cursor-pointer">
              Newsletters
            </button>
          </Link>
          <SpecialOfferPopover>
            <button className="w-full bg-[#007cb9] text-white font-sans text-xs font-bold py-2.5 rounded-none hover:bg-[#006996] transition-colors cursor-pointer shadow-xs">
              Special Offer
            </button>
          </SpecialOfferPopover>
        </div>

        {/* 4. SECTIONS & CATEGORIES Accordion List (Matching Image 1) */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-3 font-sans">
            SECTIONS & CATEGORIES
          </div>
          <ul className="space-y-1">
            {ALL_CATEGORIES.map((cat) => {
              const subs = CATEGORY_SUB_ITEMS[cat] || [];
              const isExpanded = Boolean(expandedCategories[cat]);
              const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");

              return (
                <li key={cat} className="border-b border-[#EAE6DA] last:border-b-0">
                  <div className="flex items-center justify-between py-2.5 hover:bg-[#F3EFE6] px-2 rounded-xs">
                    <Link
                      href={`/${catSlug}`}
                      onClick={onClose}
                      className="text-[14.5px] font-sans font-bold text-[#111111] hover:text-[#990000] transition-colors flex-1"
                    >
                      {cat}
                    </Link>

                    {subs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="p-1 text-gray-500 hover:text-black cursor-pointer shrink-0"
                        aria-label={`Toggle ${cat}`}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-[#990000]" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {subs.length > 0 && isExpanded && (
                    <div className="pl-4 py-2 space-y-1.5 border-l-2 border-[#990000] ml-2 mb-2 bg-[#F3EFE6]">
                      {subs.map((sub) => (
                        <Link
                          key={sub}
                          href={`/${catSlug}?sub=${encodeURIComponent(sub)}`}
                          onClick={onClose}
                          className="block text-xs font-sans text-[#444444] hover:text-[#990000] hover:underline py-0.5 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}
