"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { homepageArticles } from "@/data/articles";

export const HomeMainGrid: React.FC = () => {
  const art = homepageArticles;

  return (
    <div className="w-full bg-white text-[#111111] font-sans py-4">
      <Container>
        {/* Top Leaderboard Advertisement Banner */}
        <div className="w-full flex justify-center mb-6">
          <AdPlaceholder width="w-[728px] max-w-full" height="h-[90px]" resolution="728 × 90" />
        </div>

        {/* Main 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ============================================================== */}
          {/* COLUMN 1: LEFT NEWS FEED (Span 3 on desktop)                   */}
          {/* ============================================================== */}
          <div className="md:col-span-3 space-y-4 border-b md:border-b-0 md:border-r border-[#e2e2e2] md:pr-6">
            {/* Article 1: US Intel Putin NATO */}
            <div className="space-y-1.5">
              <span className="inline-block border border-black px-1.5 py-0.5 text-[10px] font-bold font-sans uppercase tracking-wider text-black">
                EXCLUSIVE
              </span>
              <Link href={`/article/${art["us-intel-putin-nato"].slug}`}>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-black leading-tight hover:underline cursor-pointer">
                  {art["us-intel-putin-nato"].title}
                </h3>
              </Link>
              <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                {art["us-intel-putin-nato"].summary}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-[#666666] pt-1">
                <span>💬</span>
                <span>{art["us-intel-putin-nato"].commentCount}</span>
              </div>
            </div>

            <hr className="border-t border-[#e2e2e2]" />

            {/* Article 2: Republican Oppose Blanche */}
            <div className="space-y-1.5">
              <Link href={`/article/${art["republican-oppose-blanche"].slug}`}>
                <h3 className="font-serif font-bold text-lg text-black leading-tight hover:underline cursor-pointer">
                  {art["republican-oppose-blanche"].title}
                </h3>
              </Link>
              <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                {art["republican-oppose-blanche"].summary}
              </p>
              <div className="flex items-center space-x-3 text-[11px] pt-1">
                <span className="text-[#666666]">
                  💬 {art["republican-oppose-blanche"].commentCount}
                </span>
                <span className="text-[#cc0000] font-bold">
                  {art["republican-oppose-blanche"].timestamp}
                </span>
              </div>
            </div>

            <hr className="border-t border-[#e2e2e2]" />

            {/* Article 3: Jobs Report Fed Clues (LIVE) */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1 text-[11px] font-bold text-[#cc0000] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#cc0000] inline-block animate-pulse" />
                <span>LIVE</span>
              </div>
              <Link href={`/article/${art["jobs-report-fed-clues"].slug}`}>
                <h3 className="font-serif font-bold text-lg text-black leading-tight hover:underline cursor-pointer">
                  {art["jobs-report-fed-clues"].title}
                </h3>
              </Link>
              <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                {art["jobs-report-fed-clues"].summary}
              </p>
              {art["jobs-report-fed-clues"].subLinks?.map((sub) => (
                <div key={sub.title} className="pl-2 border-l-2 border-[#cc0000] my-2">
                  <Link href={sub.href}>
                    <span className="text-[12px] font-bold text-black hover:underline block leading-snug cursor-pointer">
                      • {sub.title}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <hr className="border-t border-[#e2e2e2]" />

            {/* Article 4: Meta Ordered to Pay */}
            <div className="space-y-1.5">
              <Link href={`/article/${art["meta-ordered-pay-942-million"].slug}`}>
                <h3 className="font-serif font-bold text-lg text-black leading-tight hover:underline cursor-pointer">
                  {art["meta-ordered-pay-942-million"].title}
                </h3>
              </Link>
              <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                {art["meta-ordered-pay-942-million"].summary}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-[#666666] pt-1">
                <span>💬</span>
                <span>{art["meta-ordered-pay-942-million"].commentCount}</span>
              </div>
            </div>

            <hr className="border-t border-[#e2e2e2]" />

            {/* Article 5: FAA Orders Boeing Inspections */}
            <div className="space-y-1.5">
              <Link href={`/article/${art["faa-orders-boeing-inspections"].slug}`}>
                <h3 className="font-serif font-bold text-lg text-black leading-tight hover:underline cursor-pointer">
                  {art["faa-orders-boeing-inspections"].title}
                </h3>
              </Link>
              <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                {art["faa-orders-boeing-inspections"].summary}
              </p>
              <div className="text-[11px] text-[#cc0000] font-bold pt-1">
                {art["faa-orders-boeing-inspections"].timestamp}
              </div>
            </div>

            <hr className="border-t border-[#e2e2e2]" />

            {/* Article 6: Trump Birthright Citizenship */}
            <div className="space-y-1.5 pb-4">
              <Link href={`/article/${art["trump-signs-birthright-citizenship"].slug}`}>
                <h3 className="font-serif font-bold text-lg text-black leading-tight hover:underline cursor-pointer">
                  {art["trump-signs-birthright-citizenship"].title}
                </h3>
              </Link>
              <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                {art["trump-signs-birthright-citizenship"].summary}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-[#666666] pt-1">
                <span>💬</span>
                <span>{art["trump-signs-birthright-citizenship"].commentCount}</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* COLUMN 2: CENTER LEAD HERO (Span 6 on desktop)                 */}
          {/* ============================================================== */}
          <div className="md:col-span-6 space-y-6 border-b md:border-b-0 md:border-r border-[#e2e2e2] md:pr-6">
            {/* Top Main Hero Article */}
            <div className="space-y-3">
              <Link href={`/article/${art["facing-ai-apocalypse-software-race"].slug}`}>
                <div className="w-full aspect-[16/9] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                  <img
                    src={art["facing-ai-apocalypse-software-race"].imageUrl}
                    alt={art["facing-ai-apocalypse-software-race"].title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="font-serif font-black text-3xl sm:text-4xl text-black leading-tight text-center my-3 hover:underline cursor-pointer">
                  {art["facing-ai-apocalypse-software-race"].title}
                </h2>
              </Link>
              <p className="text-[13.5px] font-sans text-[#333333] leading-relaxed text-center max-w-xl mx-auto">
                {art["facing-ai-apocalypse-software-race"].summary}
              </p>
              <div className="flex justify-center items-center space-x-1 text-[11px] text-[#666666]">
                <span>💬</span>
                <span>{art["facing-ai-apocalypse-software-race"].commentCount}</span>
              </div>
            </div>

            <hr className="border-t border-[#e2e2e2]" />

            {/* Secondary 2-Grid Articles Below Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* NYC Pied-a-terre */}
              <div className="space-y-2">
                <Link href={`/article/${art["nyc-pied-a-terre-dodge-tax"].slug}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src={art["nyc-pied-a-terre-dodge-tax"].imageUrl}
                      alt={art["nyc-pied-a-terre-dodge-tax"].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-black leading-tight mt-2 hover:underline cursor-pointer">
                    {art["nyc-pied-a-terre-dodge-tax"].title}
                  </h3>
                </Link>
                <p className="text-[12px] font-sans text-[#444444] leading-relaxed">
                  {art["nyc-pied-a-terre-dodge-tax"].summary}
                </p>
                <div className="flex items-center space-x-1 text-[11px] text-[#666666]">
                  <span>💬</span>
                  <span>{art["nyc-pied-a-terre-dodge-tax"].commentCount}</span>
                </div>
              </div>

              {/* Energy Refinery */}
              <div className="space-y-2">
                <Link href={`/article/${art["refine-baby-refine-energy-mantra"].slug}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src={art["refine-baby-refine-energy-mantra"].imageUrl}
                      alt={art["refine-baby-refine-energy-mantra"].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-black leading-tight mt-2 hover:underline cursor-pointer">
                    {art["refine-baby-refine-energy-mantra"].title}
                  </h3>
                </Link>
                <p className="text-[12px] font-sans text-[#444444] leading-relaxed">
                  {art["refine-baby-refine-energy-mantra"].summary}
                </p>
                <div className="flex items-center space-x-1 text-[11px] text-[#666666]">
                  <span>💬</span>
                  <span>{art["refine-baby-refine-energy-mantra"].commentCount}</span>
                </div>
              </div>
            </div>

            <hr className="border-t border-[#e2e2e2]" />

            {/* Lower 2-Grid Feature Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-4">
              {/* Iran Diplomats */}
              <div className="space-y-1.5">
                <Link href={`/article/${art["iran-diminished-diplomats-hormuz"].slug}`}>
                  <h3 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    {art["iran-diminished-diplomats-hormuz"].title}
                  </h3>
                </Link>
                <p className="text-[12px] font-sans text-[#444444] leading-relaxed">
                  {art["iran-diminished-diplomats-hormuz"].summary}
                </p>
                <div className="flex items-center space-x-1 text-[11px] text-[#666666]">
                  <span>💬</span>
                  <span>{art["iran-diminished-diplomats-hormuz"].commentCount}</span>
                </div>
              </div>

              {/* Ratings Firm Insurer Debt */}
              <div className="space-y-1.5">
                <span className="inline-block border border-black px-1.5 py-0.5 text-[10px] font-bold font-sans uppercase tracking-wider text-black">
                  EXCLUSIVE
                </span>
                <Link href={`/article/${art["ratings-firm-grade-inflation-insurer-debt"].slug}`}>
                  <h3 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    {art["ratings-firm-grade-inflation-insurer-debt"].title}
                  </h3>
                </Link>
                <p className="text-[12px] font-sans text-[#444444] leading-relaxed">
                  {art["ratings-firm-grade-inflation-insurer-debt"].summary}
                </p>
                <div className="flex items-center space-x-1 text-[11px] text-[#666666]">
                  <span>💬</span>
                  <span>{art["ratings-firm-grade-inflation-insurer-debt"].commentCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* COLUMN 3: RIGHT SIDEBAR & OPINION (Span 3 on desktop)          */}
          {/* ============================================================== */}
          <div className="md:col-span-3 space-y-4">
            {/* Opinion Section Header (No top border, matching Screenshot 1) */}
            <div className="mb-3">
              <h3 className="font-serif font-bold text-xl text-[#882200]">
                Opinion
              </h3>
            </div>

            {/* Opinion Articles Stack with Thumbnails on the LEFT (Matching Screenshot 1) */}
            <div className="space-y-3.5">
              {/* Opinion 1 */}
              <div className="flex items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                <img
                  src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=140&q=80"
                  alt="Opinion thumbnail"
                  className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xs shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <span className="text-[10.5px] font-sans font-bold text-[#885500] uppercase tracking-wider block">
                    {art["trump-fixes-medicare-trick"]?.author || "THE EDITORIAL BOARD"}
                  </span>
                  <Link href={`/article/${art["trump-fixes-medicare-trick"]?.slug || "trump-fixes-medicare-trick"}`}>
                    <h4 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer">
                      {art["trump-fixes-medicare-trick"]?.title}
                    </h4>
                  </Link>
                </div>
              </div>

              {/* Opinion 2 */}
              <div className="flex items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                <img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=140&q=80"
                  alt="Opinion thumbnail"
                  className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xs shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <span className="text-[10.5px] font-sans font-bold text-[#885500] uppercase tracking-wider block">
                    {art["socialism-is-here-and-its-serious"]?.author || "PEGGY NOONAN"}
                  </span>
                  <Link href={`/article/${art["socialism-is-here-and-its-serious"]?.slug || "socialism-is-here-and-its-serious"}`}>
                    <h4 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer">
                      {art["socialism-is-here-and-its-serious"]?.title}
                    </h4>
                  </Link>
                </div>
              </div>

              {/* Opinion 3 */}
              <div className="flex items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                <img
                  src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=140&q=80"
                  alt="Opinion thumbnail"
                  className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xs shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <span className="text-[10.5px] font-sans font-bold text-[#885500] uppercase tracking-wider block">
                    {art["due-process-ends-labor-board"]?.author || "NATHAN MCGRATH"}
                  </span>
                  <Link href={`/article/${art["due-process-ends-labor-board"]?.slug || "due-process-ends-labor-board"}`}>
                    <h4 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer">
                      {art["due-process-ends-labor-board"]?.title}
                    </h4>
                  </Link>
                </div>
              </div>

              {/* Opinion 4 */}
              <div className="flex items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                <img
                  src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=140&q=80"
                  alt="Opinion thumbnail"
                  className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xs shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <span className="text-[10.5px] font-sans font-bold text-[#885500] uppercase tracking-wider block">
                    {art["russia-drones-test-europe-defenses"]?.author || "THE EDITORIAL BOARD"}
                  </span>
                  <Link href={`/article/${art["russia-drones-test-europe-defenses"]?.slug || "russia-drones-test-europe-defenses"}`}>
                    <h4 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer">
                      {art["russia-drones-test-europe-defenses"]?.title}
                    </h4>
                  </Link>
                </div>
              </div>

              {/* Opinion 5 */}
              <div className="flex items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=140&q=80"
                  alt="Opinion thumbnail"
                  className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xs shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <span className="text-[10.5px] font-sans font-bold text-[#885500] uppercase tracking-wider block">
                    {art["fda-replimune-new-flu-shot"]?.author || "NISHANT SAHDEV"}
                  </span>
                  <Link href={`/article/${art["fda-replimune-new-flu-shot"]?.slug || "fda-replimune-new-flu-shot"}`}>
                    <h4 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer">
                      {art["fda-replimune-new-flu-shot"]?.title}
                    </h4>
                  </Link>
                </div>
              </div>

              {/* Opinion 6 */}
              <div className="flex items-start space-x-3 pb-1">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=140&q=80"
                  alt="Opinion thumbnail"
                  className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xs shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <span className="text-[10.5px] font-sans font-bold text-[#885500] uppercase tracking-wider block">
                    {art["israel-really-obligated-lay-off-hamas"]?.author || "ELLIOT KAUFMAN"}
                  </span>
                  <Link href={`/article/${art["israel-really-obligated-lay-off-hamas"]?.slug || "israel-really-obligated-lay-off-hamas"}`}>
                    <h4 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer">
                      {art["israel-really-obligated-lay-off-hamas"]?.title}
                    </h4>
                  </Link>
                </div>
              </div>
            </div>

            <hr className="border-t border-[#e2e2e2] my-4" />

            {/* Sidebar Feature: Harvard Appalachia Woman */}
            <div className="space-y-3">
              <Link href={`/article/${art["escaped-teen-marriage-appalachia-harvard"]?.slug || "escaped-teen-marriage-appalachia-harvard"}`}>
                <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                  <img
                    src={art["escaped-teen-marriage-appalachia-harvard"]?.imageUrl}
                    alt={art["escaped-teen-marriage-appalachia-harvard"]?.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-300"
                  />
                </div>
                <h4 className="font-serif font-bold text-lg text-black leading-tight mt-2 hover:underline cursor-pointer">
                  {art["escaped-teen-marriage-appalachia-harvard"]?.title}
                </h4>
              </Link>
            </div>

            <hr className="border-t border-[#e2e2e2] my-4" />

            {/* Right Sidebar AdPlaceholder */}
            <div className="w-full flex justify-center pt-2">
              <AdPlaceholder width="w-full max-w-[300px]" height="h-[250px]" resolution="300 × 250" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeMainGrid;
