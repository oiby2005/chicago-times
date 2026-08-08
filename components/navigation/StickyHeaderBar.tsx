"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { getCategoryRoute } from "@/components/navigation/Navbar";
import SearchOverlay from "@/components/search/SearchOverlay";

const navCategories = [
  "World",
  "Business",
  "U.S.",
  "Politics",
  "Economy",
  "Tech",
  "Markets & Finance",
  "Opinion",
  "Free Expression",
  "Arts",
  "Lifestyle",
  "Real Estate",
  "Personal Finance",
  "Health",
  "Style",
  "Sports",
];

export const StickyHeaderBar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isSticky) return null;

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    <div className="sticky top-0 z-40 w-full bg-white border-b border-[#d4d4d4] shadow-sm transition-all duration-200 select-none">
      <Container>
        {/* Top Header Row of Sticky Bar */}
        <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0] relative">
          <div className="w-24" />

          {/* Centered Masthead Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <img
                src="/images/wsj-masthead.svg"
                alt="The Wall Street Journal"
                className="h-5 sm:h-6 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right Buttons (Newsletter, Subscribe & Sign In) */}
          <div className="flex items-center space-x-2 z-10">
            <Link href="/newsletters">
              <button className="bg-black hover:bg-gray-800 text-white text-[11.5px] font-bold font-sans px-3 py-1 rounded-xs transition-colors whitespace-nowrap">
                Newsletter
              </button>
            </Link>
            <button className="bg-[#007cba] hover:bg-[#006996] text-white text-[11.5px] font-bold font-sans px-3 py-1 rounded-xs transition-colors">
              Subscribe
            </button>
            <Link href="/signin">
              <button className="bg-white hover:bg-gray-50 border border-[#999999] text-black text-[11.5px] font-bold font-sans px-3 py-1 rounded-xs transition-colors cursor-pointer">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Category Row of Sticky Bar */}
        <div className="flex items-center justify-between py-1.5 overflow-x-auto no-scrollbar text-[12px] font-sans font-normal text-[#333333]">
          <div className="flex items-center space-x-4 sm:space-x-5 whitespace-nowrap">
            {navCategories.map((cat) => (
              <Link
                key={cat}
                href={getCategoryRoute(cat)}
                className="hover:text-black hover:underline transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Right Search Icon */}
          <Link
            href="/search"
            aria-label="Search"
            className="pl-3 cursor-pointer text-[#444444] hover:text-black focus:outline-none"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </div>
    </>
  );
};

export default StickyHeaderBar;
