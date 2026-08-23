"use client";

import React, { useState } from "react";

export const StickySubscribeBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#d4d4d4] shadow-md py-2.5 px-4 select-none">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Left Icon */}
        <div className="flex items-center space-x-2">
          <span className="font-serif font-black text-lg text-black tracking-tighter">
            WSJ
          </span>
        </div>

        {/* Center Offer Text */}
        <div className="text-center">
          <span className="font-serif font-bold text-lg sm:text-xl text-black tracking-tight">
            Special Offer $3 USD/Month
          </span>
        </div>

        {/* Right Action Button & Close */}
        <div className="flex items-center space-x-3">
          <button className="bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold px-4 py-2 rounded-xs tracking-tight transition-colors whitespace-nowrap" suppressHydrationWarning>
            Subscribe Now
          </button>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close"
            className="text-gray-500 hover:text-black text-sm font-bold p-1 focus:outline-none"
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
