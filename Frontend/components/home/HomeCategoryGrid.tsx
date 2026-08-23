"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { homepageArticles } from "@/data/articles";
import { getCategoryRoute } from "@/components/navigation/Navbar";

// Reusable Grey Skeleton Column Component for Screenshots 2, 3, 4, 5
const SkeletonColumn: React.FC<{ title: string }> = ({ title }) => (
  <div className="space-y-4">
    <div className="border-t-2 border-black pt-2 flex items-center justify-between">
      <Link href={getCategoryRoute(title)} className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
        <span>{title}</span>
        <span className="text-sm font-sans font-bold ml-1">&gt;</span>
      </Link>
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
                <Link href="/economy" className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
                  <span>Economy</span>
                  <span className="text-sm font-sans font-bold ml-1">&gt;</span>
                </Link>
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
                <Link href="/real-estate" className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
                  <span>Real Estate</span>
                  <span className="text-sm font-sans font-bold ml-1">&gt;</span>
                </Link>
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
                <Link href="/sports" className="font-serif font-bold text-xl text-black flex items-center space-x-1 cursor-pointer hover:underline">
                  <span>Sports</span>
                  <span className="text-sm font-sans font-bold ml-1">&gt;</span>
                </Link>
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

            {/* Right Sidebar MarketViews AdPlaceholder */}
            <div className="md:col-span-3">
              <AdPlaceholder width="w-full" height="h-[250px]" resolution="300 × 250" />
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
            <div className="md:col-span-3">
              <AdPlaceholder width="w-full" height="h-[250px]" resolution="300 × 250" />
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
            <div className="md:col-span-3">
              <AdPlaceholder width="w-full" height="h-[250px]" resolution="300 × 250" />
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
            <div className="md:col-span-3">
              <AdPlaceholder width="w-full" height="h-[500px]" resolution="300 × 500" />
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
            <div className="md:col-span-3">
              <AdPlaceholder width="w-full" height="h-[500px]" resolution="300 × 500" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeCategoryGrid;
