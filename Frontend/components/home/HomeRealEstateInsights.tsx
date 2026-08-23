"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export const HomeRealEstateInsights: React.FC = () => {
  return (
    <div className="w-full bg-white text-[#111111] font-sans pb-16 select-none">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* =============================================================== */}
          {/* LEFT COLUMN: DIANOMI ADS & REAL ESTATE INSIGHTS (Span 8)       */}
          {/* =============================================================== */}
          <div className="md:col-span-8 space-y-6">
            {/* 1. ADVERTISEMENT SECTION */}
            <div className="border-t-2 border-black pt-3">
              <AdPlaceholder width="w-full" height="h-[120px]" resolution="728 × 90" />
            </div>

            {/* 2. REAL ESTATE INSIGHTS SECTION (Confined to Span 8, NOT 100% full width) */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-black">
                  Real Estate Insights
                </h3>
              </div>

              {/* 3-Column Real Estate Grid matching Screenshot 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                {/* Article 1 */}
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] bg-gray-100 rounded-xs overflow-hidden border border-gray-200">
                    <img
                      src="/images/real-estate-house-1.jpg"
                      alt="House 1"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-[10px] font-bold font-sans text-gray-500 uppercase tracking-wider">
                    BUYING
                  </div>
                  <a href="#" className="font-serif font-bold text-sm text-black hover:underline leading-snug">
                    Inside the Most Expensive Penthouse Deal of the Quarter
                  </a>
                </div>

                {/* Article 2 */}
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] bg-gray-100 rounded-xs overflow-hidden border border-gray-200">
                    <img
                      src="/images/real-estate-house-2.jpg"
                      alt="House 2"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-[10px] font-bold font-sans text-gray-500 uppercase tracking-wider">
                    COMMERCIAL
                  </div>
                  <a href="#" className="font-serif font-bold text-sm text-black hover:underline leading-snug">
                    Office Tower Conversions Surge in Downtown Metro Areas
                  </a>
                </div>

                {/* Article 3 */}
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] bg-gray-100 rounded-xs overflow-hidden border border-gray-200">
                    <img
                      src="/images/real-estate-house-3.jpg"
                      alt="House 3"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-[10px] font-bold font-sans text-gray-500 uppercase tracking-wider">
                    GLOBAL REAL ESTATE
                  </div>
                  <a href="#" className="font-serif font-bold text-sm text-black hover:underline leading-snug">
                    Why U.K. Homebuyers Are Flocking to This Affordable Heartland State
                  </a>
                </div>
              </div>

              {/* Grey Advertisement Box Below Real Estate Insights */}
              <div className="mt-6">
                <AdPlaceholder width="w-full" height="h-[160px]" resolution="300 × 250" />
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
