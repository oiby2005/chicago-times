"use client";

import React, { useState } from "react";
import Link from "next/link";

export const StickySubscribeBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("wsj_sticky_banner_visibility", { detail: { visible: false } }));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#d4d4d4] shadow-md py-2.5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-5 md:px-6 flex items-center justify-between">
        {/* Left Offer Text */}
        <div className="flex items-center space-x-2">
          <span className="font-serif font-bold text-base sm:text-lg text-black tracking-tight">
            Special Offer $3 USD / Month
          </span>
        </div>

        {/* Right Action Button & Close */}
        <div className="flex items-center space-x-3">
          <Link
            href="/special-offer"
            className="bg-[#007cb9] hover:bg-[#006996] text-white font-sans text-xs font-bold px-4 py-2 rounded-none tracking-tight transition-colors whitespace-nowrap inline-flex items-center shadow-xs cursor-pointer"
            suppressHydrationWarning
          >
            <span>Subscribe Now</span>
          </Link>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-500 hover:text-black text-sm font-bold p-1 focus:outline-none cursor-pointer"
            suppressHydrationWarning
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickySubscribeBar;
