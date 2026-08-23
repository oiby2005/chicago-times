"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { getCategoryRoute, allCategories } from "@/components/navigation/Navbar";
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
              Search WSJ...
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

        {/* Main Categories Navigation List */}
        <div className="flex-1 px-4 py-3 overflow-y-auto">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-sans">
            Sections
          </div>
          <ul className="space-y-1">
            {allCategories.map((cat) => (
              <li key={cat}>
                <Link
                  href={getCategoryRoute(cat)}
                  onClick={onClose}
                  className="block py-2 text-sm font-sans font-medium text-[#222222] hover:text-black hover:bg-gray-50 px-2 rounded-none transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
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
