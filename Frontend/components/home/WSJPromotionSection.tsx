"use client";

import React from "react";
import Link from "next/link";

export const WSJPromotionSection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none my-2 flex flex-col md:flex-row items-stretch border border-[#E5E0D5]">
      {/* Left Block: Promotion Card (70% width) - Warm Peach/Cream Tint */}
      <div className="flex-1 bg-[#FDF4E7] p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#3B71AC] block mb-1">
            WSJ PROMOTION
          </span>
          <h3 className="font-serif font-bold text-[26px] sm:text-[32px] leading-tight text-[#111111] mb-3">
            Special Offer
          </h3>
          <p className="font-sans text-[13.5px] sm:text-[14px] leading-relaxed text-[#444444] max-w-[620px] mb-6">
            Trust your source. Trust your decisions. Let WSJ’s fact-based journalism help you make sense of what’s already happened and navigate what’s ahead.
          </p>
        </div>

        <div>
          <Link
            href="/subscription"
            className="inline-block bg-[#3B71AC] text-white font-sans font-bold text-[11.5px] sm:text-[12px] uppercase tracking-wider px-5 py-3 hover:bg-[#2F5C8F] transition-colors"
          >
            VIEW MEMBERSHIP OPTIONS
          </Link>
        </div>
      </div>

      {/* Right Block: Times Chicago Logo & Tagline (30% width) - Pure White Background */}
      <div className="w-full md:w-[240px] lg:w-[280px] bg-white p-6 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-[#E5E0D5]">
        <img
          src="/images/design-reference/Times Chicago.svg"
          alt="Times Chicago"
          className="w-full max-w-[180px] sm:max-w-[210px] h-auto mx-auto block mb-3 object-contain"
        />
        <div className="font-sans font-bold text-[9.5px] tracking-[0.25em] text-[#555555] uppercase">
          IT’S YOUR BUSINESS
        </div>
      </div>
    </div>
  );
};

export default WSJPromotionSection;
