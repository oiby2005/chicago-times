"use client";

import React from "react";

interface MarketViewsAdCardProps {
  title?: string;
  tag?: string;
  image?: string;
}

export default function MarketViewsAdCard({
  title = "What is the latest on ETFs?",
  tag = "MarketViews",
  image = "/images/hero-ai-software.jpg",
}: MarketViewsAdCardProps) {
  return (
    <div className="w-full mt-8 select-none">
      {/* Label */}
      <div className="text-center text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-400 mb-2">
        ADVERTISEMENT
      </div>

      {/* Ad Box */}
      <div className="w-full rounded-xs overflow-hidden bg-[#0c2340] shadow-sm group cursor-pointer">
        {/* Top Stock Chart Photo */}
        <div className="w-full aspect-[16/9] overflow-hidden bg-black relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Bottom Navy Info Box */}
        <div className="bg-[#0c2340] p-4 relative text-white">
          <h4 className="font-sans font-bold text-base sm:text-lg text-white leading-snug mb-1 group-hover:underline">
            {title}
          </h4>
          <p className="font-serif italic text-xs text-[#a0aec0] mb-6">
            {tag}
          </p>

          {/* Bottom Row Icons */}
          <div className="flex items-center justify-between pt-1">
            {/* Grid Layout Icon */}
            <svg
              className="w-4 h-4 text-[#a0aec0]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="13" y="3" width="8" height="8" rx="1" />
              <rect x="3" y="13" width="8" height="8" rx="1" />
              <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>

            {/* Blue Arrow Button */}
            <div className="w-8 h-8 bg-[#0077c8] group-hover:bg-[#0060a0] flex items-center justify-center text-white text-sm font-bold rounded-xs transition-colors">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
