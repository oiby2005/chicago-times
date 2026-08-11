"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { homepageArticles } from "@/data/articles";

// Reusable Grey Skeleton Column Component for Screenshots 2, 3, 4, 5
const SkeletonColumn: React.FC<{ title: string }> = ({ title }) => (
  <div className="space-y-4">
    <div className="border-t-2 border-black pt-2 flex items-center justify-between">
      <h3 className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
        <span>{title}</span>
        <span className="text-sm font-sans font-bold ml-1">&gt;</span>
      </h3>
    </div>
    {/* Grey Skeleton Image Box */}
    <div className="w-full aspect-[4/3] bg-[#e6e6e6] rounded-xs mb-3" />

    {/* Grey Skeleton Text Line 1 */}
    <div className="space-y-1.5 pb-2 border-b border-[#f0f0f0]">
      <div className="w-full h-3.5 bg-[#e6e6e6] rounded-xs" />
      <div className="w-3/4 h-3.5 bg-[#e6e6e6] rounded-xs" />
    </div>

    {/* Grey Skeleton Text Line 2 */}
    <div className="space-y-1.5 pb-2 border-b border-[#f0f0f0]">
      <div className="w-full h-3.5 bg-[#e6e6e6] rounded-xs" />
      <div className="w-2/3 h-3.5 bg-[#e6e6e6] rounded-xs" />
    </div>

    {/* Grey Skeleton Text Line 3 */}
    <div className="space-y-1.5">
      <div className="w-full h-3.5 bg-[#e6e6e6] rounded-xs" />
      <div className="w-4/5 h-3.5 bg-[#e6e6e6] rounded-xs" />
    </div>
  </div>
);

export const HomeCategoryGrid: React.FC = () => {
  const art = homepageArticles;

  return (
    <div className="w-full bg-white text-[#111111] font-sans pb-16 select-none">
      <Container>
        {/* ================================================================= */}
        {/* ROW 1: ECONOMY / REAL ESTATE / SPORTS (Screenshot 1)              */}
        {/* ================================================================= */}
        <div className="pt-6 pb-10 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Economy Column (Span 2.7) */}
            <div className="md:col-span-3 space-y-4">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
                  <span>Economy</span>
                  <span className="text-sm font-sans font-bold ml-1">&gt;</span>
                </h3>
              </div>
              <div className="space-y-3">
                <Link href={`/article/${art["chinas-new-export-engine-supplying-factories"]?.slug || "chinas-new-export-engine-supplying-factories"}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src="/images/refinery-energy.jpg"
                      alt="China Export Boom"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-black leading-tight mt-2 hover:underline cursor-pointer">
                    Three Things to Know About China’s Export Boom
                  </h4>
                </Link>
                <div className="border-t border-[#e2e2e2] pt-3">
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    Trump to Impose 15% Tariff, Set Minimum Prices on Solar Panels and Components
                  </h5>
                </div>
                <div className="border-t border-[#e2e2e2] pt-3">
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    Bank of Mexico Leaves Benchmark Interest Rate Unchanged
                  </h5>
                </div>
              </div>
            </div>

            {/* Real Estate Column (Span 2.7) */}
            <div className="md:col-span-3 space-y-4">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
                  <span>Real Estate</span>
                  <span className="text-sm font-sans font-bold ml-1">&gt;</span>
                </h3>
              </div>
              <div className="space-y-3">
                <Link href={`/article/${art["washington-dc-billionaire-boomtown"]?.slug || "washington-dc-billionaire-boomtown"}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src="/images/dc-townhouse.jpg"
                      alt="Real Estate"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-black leading-tight mt-2 hover:underline cursor-pointer">
                    San Francisco’s AI Boom Fuels Record-Breaking Home Sale Just Beyond the City
                  </h4>
                </Link>
                <div className="border-t border-[#e2e2e2] pt-3">
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    Where REIT Investors Have Earned the Best Returns
                  </h5>
                </div>
                <div className="border-t border-[#e2e2e2] pt-3">
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    A Branding Mogul’s Miami Beach Home Lists for $68.5 Million
                  </h5>
                </div>
              </div>
            </div>

            {/* Sports Column (Span 2.7) */}
            <div className="md:col-span-3 space-y-4">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
                  <span>Sports</span>
                  <span className="text-sm font-sans font-bold ml-1">&gt;</span>
                </h3>
              </div>
              <div className="space-y-3">
                <Link href={`/article/${art["investors-whose-spacex-shares-vanished"]?.slug || "investors-whose-spacex-shares-vanished"}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src="/images/ariana-grande.jpg"
                      alt="Sports FIFA"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-black leading-tight mt-2 hover:underline cursor-pointer">
                    How FIFA’s $20 Billion Private-Equity Plan Nearly Broke Soccer
                  </h4>
                </Link>
                <div className="border-t border-[#e2e2e2] pt-3">
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    How the ‘King of Soccer’ Went Rogue, Nearly Lost His FIFA Empire—and Survived
                  </h5>
                </div>
                <div className="border-t border-[#e2e2e2] pt-3">
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    Tennis Is Having a Long, Hot, Brutal Summer. Carlos Alcaraz, Where Are You?
                  </h5>
                </div>
              </div>
            </div>

            {/* Right Sidebar MarketViews Stack (Span 3.6) */}
            <div className="md:col-span-3 space-y-4">
              <div className="text-[10px] text-gray-500 font-sans text-right">
                Advertisement
              </div>
              <div className="bg-[#122b40] text-white p-4 space-y-4 rounded-xs">
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  What is the latest on ETFs? <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  Get the latest commodity trends from industry experts. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  Stay updated with the newest gold market developments. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight">
                  Uncover the latest trends in retirement planning strategies. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 2: CMO / CIO / CFO SKELETONS (Screenshot 2)                    */}
        {/* ================================================================= */}
        <div className="py-10 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="md:col-span-3">
              <SkeletonColumn title="CMO" />
            </div>
            <div className="md:col-span-3">
              <SkeletonColumn title="CIO" />
            </div>
            <div className="md:col-span-3">
              <SkeletonColumn title="CFO" />
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="text-[10px] text-gray-500 font-sans text-right">
                Advertisement
              </div>
              <div className="bg-[#122b40] text-white p-4 space-y-4 rounded-xs">
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  What is the latest on ETFs? <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  Get the latest commodity trends from industry experts. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  Stay updated with the newest gold market developments. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight">
                  Uncover the latest trends in retirement planning strategies. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 3: RISK & COMPLIANCE / LOGISTICS REPORT SKELETONS (Screenshot 3) */}
        {/* ================================================================= */}
        <div className="py-10 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="md:col-span-3">
              <SkeletonColumn title="Risk & Compliance" />
            </div>
            <div className="md:col-span-3" />
            <div className="md:col-span-3">
              <SkeletonColumn title="Logistics Report" />
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="text-[10px] text-gray-500 font-sans text-right">
                Advertisement
              </div>
              <div className="bg-[#122b40] text-white p-4 space-y-4 rounded-xs">
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  What is the latest on ETFs? <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  Get the latest commodity trends from industry experts. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  Stay updated with the newest gold market developments. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight">
                  Uncover the latest trends in retirement planning strategies. <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 4: ELECTIONS / HEARD ON STREET / BARRON'S SKELETONS (Screenshot 4) */}
        {/* ================================================================= */}
        <div className="py-10 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="md:col-span-3">
              <SkeletonColumn title="Elections" />
            </div>
            <div className="md:col-span-3">
              <SkeletonColumn title="Heard on the Street" />
            </div>
            <div className="md:col-span-3">
              <SkeletonColumn title="Barron's" />
            </div>
            <div className="md:col-span-3 space-y-2">
              <div className="text-[10px] text-gray-500 font-sans text-right">
                Advertisement
              </div>
              <div className="bg-[#6384ff] text-white p-6 rounded-xs space-y-6 flex flex-col justify-between min-h-[500px]">
                <div className="space-y-4">
                  <div className="text-xs font-serif font-black tracking-wider uppercase border-b border-blue-400 pb-2">
                    WSJ — CPO Council
                  </div>
                  <h4 className="font-serif font-bold text-2xl sm:text-3xl leading-tight">
                    Elevate Your People Leadership. Navigate Workforce Transformation with Confidence.
                  </h4>
                </div>
                <div className="space-y-3">
                  <button className="bg-white/20 hover:bg-white/30 border border-white text-white text-xs font-bold px-4 py-2 rounded-full">
                    Learn More
                  </button>
                  <div className="text-[10px] font-serif font-bold uppercase tracking-wider text-blue-200">
                    WSJ Leadership Institute
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 5: MARKETWATCH / MANSION GLOBAL / INVESTOR'S BD SKELETONS (Screenshot 5) */}
        {/* ================================================================= */}
        <div className="py-10 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="md:col-span-3">
              <SkeletonColumn title="MarketWatch" />
            </div>
            <div className="md:col-span-3">
              <SkeletonColumn title="Mansion Global" />
            </div>
            <div className="md:col-span-3">
              <SkeletonColumn title="Investor's Business Daily" />
            </div>
            <div className="md:col-span-3 space-y-2">
              <div className="text-[10px] text-gray-500 font-sans text-right">
                Advertisement
              </div>
              <div className="bg-[#6384ff] text-white p-6 rounded-xs space-y-6 flex flex-col justify-between min-h-[500px]">
                <div className="space-y-4">
                  <div className="text-xs font-serif font-black tracking-wider uppercase border-b border-blue-400 pb-2">
                    WSJ — CPO Council
                  </div>
                  <h4 className="font-serif font-bold text-2xl sm:text-3xl leading-tight">
                    Elevate Your People Leadership. Navigate Workforce Transformation with Confidence.
                  </h4>
                </div>
                <div className="space-y-3">
                  <button className="bg-white/20 hover:bg-white/30 border border-white text-white text-xs font-bold px-4 py-2 rounded-full">
                    Learn More
                  </button>
                  <div className="text-[10px] font-serif font-bold uppercase tracking-wider text-blue-200">
                    WSJ Leadership Institute
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeCategoryGrid;
