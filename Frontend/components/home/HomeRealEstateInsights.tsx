"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";

export const HomeRealEstateInsights: React.FC = () => {
  return (
    <div className="w-full bg-white text-[#111111] font-sans pb-16 select-none">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* =============================================================== */}
          {/* LEFT COLUMN: DIANOMI ADS & REAL ESTATE INSIGHTS (Span 8)       */}
          {/* =============================================================== */}
          <div className="md:col-span-8 space-y-6">
            {/* 1. ADVERTISEMENT (DIANOMI) SECTION */}
            <div className="border-t-2 border-black pt-3">
              <div className="flex items-center justify-between pb-2 mb-4">
                <span className="text-xs font-sans font-bold text-[#111111] uppercase tracking-wider">
                  ADVERTISEMENT
                </span>
                <span className="text-xs font-sans font-bold text-[#111111]">
                  dianomi
                </span>
              </div>

              {/* 3-Column x 2-Row Dianomi Ad Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-6 border-b-2 border-black text-xs">
                {/* Item 1 */}
                <div className="flex items-start space-x-2">
                  <div className="space-y-1 flex-1">
                    <a href="#" className="font-sans text-[#007cba] hover:underline font-bold block leading-snug">
                      Get the latest commodity trends from industry experts.
                    </a>
                    <span className="text-[10px] text-gray-500 font-serif italic block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/refinery-energy.jpg"
                    alt="Commodities"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Item 2 */}
                <div className="flex items-start space-x-2">
                  <div className="space-y-1 flex-1">
                    <a href="#" className="font-sans text-[#007cba] hover:underline font-bold block leading-snug">
                      Discover the latest finance insights from global experts.
                    </a>
                    <span className="text-[10px] text-gray-500 font-serif italic block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/investigator-magnifying-glass.jpg"
                    alt="Finance"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Item 3 */}
                <div className="flex items-start space-x-2">
                  <div className="space-y-1 flex-1">
                    <a href="#" className="font-sans text-[#007cba] hover:underline font-bold block leading-snug">
                      Uncover the latest trends in retirement planning strategies.
                    </a>
                    <span className="text-[10px] text-gray-500 font-serif italic block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/wine-plane.jpg"
                    alt="Retirement"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Item 4 */}
                <div className="flex items-start space-x-2">
                  <div className="space-y-1 flex-1">
                    <a href="#" className="font-sans text-[#007cba] hover:underline font-bold block leading-snug">
                      Robotics and Artificial Intelligence. Discover the trends.
                    </a>
                    <span className="text-[10px] text-gray-500 font-serif italic block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/hero-ai-software.jpg"
                    alt="Robotics"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Item 5 */}
                <div className="flex items-start space-x-2">
                  <div className="space-y-1 flex-1">
                    <a href="#" className="font-sans text-[#007cba] hover:underline font-bold block leading-snug">
                      What is the latest on ETFs?
                    </a>
                    <span className="text-[10px] text-gray-500 font-serif italic block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/amazon-data-center.jpg"
                    alt="ETFs"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Item 6 */}
                <div className="flex items-start space-x-2">
                  <div className="space-y-1 flex-1">
                    <a href="#" className="font-sans text-[#007cba] hover:underline font-bold block leading-snug">
                      Stay updated with the newest gold market developments.
                    </a>
                    <span className="text-[10px] text-gray-500 font-serif italic block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/handcuffs-money.jpg"
                    alt="Gold"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* 2. REAL ESTATE INSIGHTS SECTION (Confined to Span 8, NOT 100% full width) */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3">
                <h3 className="font-serif font-bold text-xl text-[#111111]">
                  Real Estate Insights
                </h3>
                <div className="text-xs font-sans text-gray-600 flex items-center space-x-1">
                  <span>Content provided by</span>
                  <span className="font-bold text-[#d00000] flex items-center gap-0.5">
                    🏠 realtor.com
                  </span>
                </div>
              </div>

              {/* 3-Column Real Estate Insights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                {/* Insight 1 */}
                <div className="flex items-start space-x-3">
                  <img
                    src="/images/ariana-grande.jpg"
                    alt="Sen Warren"
                    className="w-16 h-12 object-cover rounded-xs shrink-0"
                  />
                  <a href="#" className="font-serif font-bold text-sm text-black hover:underline leading-snug">
                    EXCL: Sen. Warren Slams Compass Private Listings Network in Letter to CEO
                  </a>
                </div>

                {/* Insight 2 */}
                <div className="flex items-start space-x-3">
                  <img
                    src="/images/harvard-woman.jpg"
                    alt="Ali Larter"
                    className="w-16 h-12 object-cover rounded-xs shrink-0"
                  />
                  <a href="#" className="font-serif font-bold text-sm text-black hover:underline leading-snug">
                    Ali Larter Shares Glimpse Inside 'Simple' Idaho Lifestyle After Quitting L.A.
                  </a>
                </div>

                {/* Insight 3 */}
                <div className="flex items-start space-x-3">
                  <img
                    src="/images/nyc-skyscrapers.jpg"
                    alt="UK Homebuyers"
                    className="w-16 h-12 object-cover rounded-xs shrink-0"
                  />
                  <a href="#" className="font-serif font-bold text-sm text-black hover:underline leading-snug">
                    Why U.K. Homebuyers Are Flocking to This Affordable Heartland State
                  </a>
                </div>
              </div>

              {/* Grey Advertisement Box Below Real Estate Insights (Screenshot 5) */}
              <div className="w-full bg-[#f4f4f4] border border-[#d4d4d4] rounded-xs p-6 text-center text-gray-500 font-sans font-bold text-xs uppercase tracking-wider h-[160px] flex items-center justify-center mt-6">
                ADVERTISEMENT
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: MARKETVIEWS SIDEBAR (Span 4)                     */}
          {/* =============================================================== */}
          <div className="md:col-span-4 space-y-4 pt-2">
            <div className="bg-[#1c3550] text-white overflow-hidden rounded-xs shadow-xs">
              {/* Card 1 */}
              <div className="relative group p-4 border-b border-[#2b4866]">
                <div className="aspect-[16/9] w-full mb-3 overflow-hidden rounded-xs bg-black/20">
                  <img
                    src="/images/refinery-energy.jpg"
                    alt="Market"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs leading-snug">
                    What is the latest on ETFs?
                  </h4>
                  <span className="text-gray-400 font-serif italic text-[11px] block">
                    MarketViews
                  </span>
                </div>
                <button className="absolute right-3 bottom-3 bg-[#007cba] hover:bg-[#006996] text-white p-1 rounded text-xs font-bold">
                  ›
                </button>
              </div>

              {/* Card 2 */}
              <div className="relative group p-4 border-b border-[#2b4866]">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-xs leading-snug">
                      Discover top insights on commodity trends and developments.
                    </h4>
                    <span className="text-gray-400 font-serif italic text-[11px] block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/bangkok-factory.jpg"
                    alt="Commodities"
                    className="w-16 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>
                <button className="absolute right-3 bottom-2 bg-[#007cba] hover:bg-[#006996] text-white p-1 rounded text-xs font-bold">
                  ›
                </button>
              </div>

              {/* Card 3 */}
              <div className="relative group p-4 border-b border-[#2b4866]">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-xs leading-snug">
                      Stay updated with the newest gold market developments.
                    </h4>
                    <span className="text-gray-400 font-serif italic text-[11px] block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/investigator-magnifying-glass.jpg"
                    alt="Gold"
                    className="w-16 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>
                <button className="absolute right-3 bottom-2 bg-[#007cba] hover:bg-[#006996] text-white p-1 rounded text-xs font-bold">
                  ›
                </button>
              </div>

              {/* Card 4 */}
              <div className="relative group p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-xs leading-snug">
                      Uncover the latest trends in retirement planning strategies.
                    </h4>
                    <span className="text-gray-400 font-serif italic text-[11px] block">
                      MarketViews
                    </span>
                  </div>
                  <img
                    src="/images/wine-plane.jpg"
                    alt="Retirement"
                    className="w-16 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeRealEstateInsights;
