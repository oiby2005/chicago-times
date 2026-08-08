"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ArticleToolbarProps {
  commentCount?: number;
  listenTime?: string;
}

export const ArticleToolbar: React.FC<ArticleToolbarProps> = ({
  commentCount = 181,
  listenTime = "2 min",
}) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
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
    <div className="sticky top-0 z-40 w-full bg-white border-b border-[#e2e2e2] shadow-xs transition-all duration-200 select-none">
      <div className="max-w-6xl mx-auto px-4 h-11 flex items-center justify-between">
        {/* Left Action Toolbar Icons (Screenshot 3) */}
        <div className="flex items-center space-x-6 text-xs text-[#444444] font-sans">
          {/* Share */}
          <button className="flex items-center space-x-1 hover:text-black transition-colors" title="Share">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.367 3 3 0 000 5.367zm0 11.367a3 3 0 100-5.367 3 3 0 000 5.367z" />
            </svg>
          </button>

          {/* Text Size */}
          <button className="flex items-center space-x-1 hover:text-black font-semibold text-sm transition-colors" title="Text size">
            <span>Aa</span>
          </button>

          {/* Comments */}
          <button className="flex items-center space-x-1.5 hover:text-black transition-colors" title="Comments">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-bold text-black">{commentCount}</span>
          </button>

          {/* Listen */}
          <button className="flex items-center space-x-1.5 hover:text-black transition-colors" title="Listen">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span className="font-medium text-black">Listen <span className="text-gray-500 font-normal">({listenTime})</span></span>
          </button>

          {/* Overflow Menu */}
          <button className="hover:text-black transition-colors text-base font-bold" title="More options">
            ⋮
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 text-xs font-sans">
          <Link
            href="/"
            className="hidden sm:inline-block font-serif font-black text-sm text-black tracking-tight hover:underline"
          >
            THE WALL STREET JOURNAL.
          </Link>
          <button className="bg-[#007cba] hover:bg-[#006996] text-white text-[11.5px] font-bold px-3 py-1 rounded-xs transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleToolbar;
