"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCategoryRoute, allCategories, megaMenuData } from "@/components/navigation/Navbar";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";
import { UserProfile } from "@/components/ui/ProfileSettingsModal";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenSearch: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenSearch,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Lock body scroll when drawer is open
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

  const isLoggedIn = currentUser !== null;
  const displayName = currentUser?.full_name || "";
  const displayEmail = currentUser?.email || "";

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Slide-out Drawer Menu */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto select-none z-50 text-[#111111] animate-in slide-in-from-left duration-200">
        
        {/* Top Header Row of Drawer */}
        <div className="p-4 border-b border-[#e2e2e2] flex items-center justify-between bg-[#fcfcfc]">
          <div className="flex items-center space-x-2">
            <img
              src="/images/design-reference/Times Chicago.svg"
              alt="Times Chicago"
              className="h-5 w-auto object-contain"
            />
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-gray-600 hover:text-black transition-colors rounded-xs focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar Trigger inside Drawer */}
        <div className="p-4 border-b border-[#f0f0f0]">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#f4f4f5] text-[#555555] text-xs font-sans rounded-none hover:bg-[#e4e4e7] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Times Chicago...
            </span>
            <span className="text-[10px] text-gray-400 font-mono">⌘K</span>
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="px-4 py-3 border-b border-[#f0f0f0] grid grid-cols-2 gap-2">
          <Link href="/newsletters" onClick={onClose}>
            <button className="w-full bg-black text-white font-sans text-xs font-bold py-2 rounded-none hover:bg-gray-800 transition-colors cursor-pointer">
              Newsletters
            </button>
          </Link>
          <SpecialOfferPopover>
            <button className="w-full bg-[#007cb9] text-white font-sans text-xs font-bold py-2 rounded-none hover:bg-[#006996] transition-colors cursor-pointer">
              Special Offer
            </button>
          </SpecialOfferPopover>
        </div>

        {/* Main Categories Navigation List with Sub-Category Accordions */}
        <div className="flex-1 px-4 py-3 overflow-y-auto">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-sans">
            Sections & Categories
          </div>
          <ul className="space-y-1">
            {allCategories.map((cat) => {
              const subMenu = megaMenuData[cat];
              const subLinks = subMenu?.columns?.[0]?.links || [];
              const hasSubLinks = subLinks.length > 0;
              const isExpanded = Boolean(expandedCategories[cat]);

              return (
                <li key={cat} className="border-b border-[#f4f4f5] last:border-b-0">
                  <div className="flex items-center justify-between py-1.5 hover:bg-gray-50 px-1 rounded-sm">
                    {/* Category Title Link */}
                    <Link
                      href={getCategoryRoute(cat)}
                      onClick={onClose}
                      className="text-sm font-sans font-semibold text-[#111111] hover:text-[#990000] transition-colors flex-1"
                    >
                      {cat}
                    </Link>

                    {/* Accordion Expand / Collapse Toggle Caret */}
                    {hasSubLinks && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="p-1 text-gray-500 hover:text-black cursor-pointer focus:outline-none shrink-0"
                        aria-label={`Toggle ${cat} sub-categories`}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#990000]" : ""}`}
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

                  {/* Collapsible Sub-Categories List */}
                  {hasSubLinks && isExpanded && (
                    <div className="pl-3 py-1.5 space-y-1 border-l-2 border-[#b8860b] ml-2 mb-1.5 bg-[#fafafa] rounded-r-sm animate-in fade-in duration-150">
                      {subLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={onClose}
                          className="block text-xs font-sans text-[#444444] hover:text-[#990000] hover:underline py-1 px-1 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Account / Sign In Bottom Bar */}
        <div className="p-4 border-t border-[#e2e2e2] bg-[#f8f9fa]">
          {isLoggedIn ? (
            <div className="flex items-center justify-between">
              <div className="truncate pr-2">
                <div className="text-xs font-bold font-sans text-[#111111] truncate">{displayName}</div>
                <div className="text-[11px] text-gray-500 font-mono truncate">{displayEmail}</div>
              </div>
              <Link
                href={
                  currentUser?.role?.toLowerCase() === "writer"
                    ? "/writer-dashboard"
                    : currentUser?.role?.toLowerCase() === "admin"
                    ? "/admin-dashboard"
                    : "/reader-dashboard"
                }
                onClick={onClose}
              >
                <span className="text-xs font-semibold text-[#007cb9] hover:underline whitespace-nowrap">
                  {currentUser?.role?.toLowerCase() === "writer"
                    ? "Writer Dashboard →"
                    : currentUser?.role?.toLowerCase() === "admin"
                    ? "Admin Dashboard →"
                    : "Dashboard →"}
                </span>
              </Link>
            </div>
          ) : (
            <Link href="/signin" onClick={onClose} className="block w-full">
              <button className="w-full bg-white border border-[#333333] hover:border-black text-black font-sans text-xs font-bold py-2 transition-colors cursor-pointer">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavDrawer;
