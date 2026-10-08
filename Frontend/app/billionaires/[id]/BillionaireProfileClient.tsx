"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { BillionaireItem, WealthPoint, getBillionairesList } from "@/data/billionaires";

// Main Content Interactive Wealth History Line Graph
function MainContentWealthChart({ history, endYear }: { history?: WealthPoint[]; endYear?: number }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = useMemo(() => {
    if (history && history.length > 0) return history;
    const targetEndYear = endYear || 2026;
    return [
      { year: targetEndYear - 9, value: 21 },
      { year: targetEndYear - 8, value: 20 },
      { year: targetEndYear - 7, value: 22 },
      { year: targetEndYear - 6, value: 25 },
      { year: targetEndYear - 5, value: 190 },
      { year: targetEndYear - 4, value: 219 },
      { year: targetEndYear - 3, value: 180 },
      { year: targetEndYear - 2, value: 210 },
      { year: targetEndYear - 1, value: 340 },
      { year: targetEndYear, value: 839 },
    ];
  }, [history, endYear]);

  const svgWidth = 680;
  const svgHeight = 200;
  const paddingX = 30;
  const paddingTop = 40;
  const paddingBottom = 35;

  const minVal = Math.min(...data.map((d) => d.value));
  const maxVal = Math.max(...data.map((d) => d.value));
  const valRange = maxVal - minVal || 1;

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (svgWidth - 2 * paddingX);
    const normalizedY = (d.value - minVal) / valRange;
    const y = svgHeight - paddingBottom - normalizedY * (svgHeight - paddingTop - paddingBottom);
    return { x, y, year: d.year, value: d.value };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  return (
    <div className="w-full bg-white border border-[#E5E0D5] p-5 sm:p-8 select-none">
      <div className="text-center mb-5">
        <h3
          className="font-bold text-[18px] text-[#111111]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          World Wealth History
        </h3>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px] overflow-visible">
          {/* Base Axis Line */}
          <line
            x1={paddingX - 10}
            y1={svgHeight - paddingBottom + 6}
            x2={svgWidth - paddingX + 10}
            y2={svgHeight - paddingBottom + 6}
            stroke="#E0DBD0"
            strokeWidth="1.5"
          />

          {/* Connected Polyline */}
          <path
            d={pathD}
            fill="none"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Year Labels */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g key={i} className="cursor-pointer">
                {/* Visible Open Circle Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7.5 : 5.5}
                  fill="white"
                  stroke="#111111"
                  strokeWidth={isHovered ? 4 : 3.5}
                  className="transition-all duration-150"
                />

                {/* Wide Hit Target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="18"
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Year Label */}
                <text
                  x={pt.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className="fill-[#444444] font-sans font-extrabold text-[12px] pointer-events-none"
                >
                  {pt.year}
                </text>

                {/* Hover Tooltip Box */}
                {isHovered && (
                  <g className="pointer-events-none">
                    <rect
                      x={pt.x - 34}
                      y={pt.y - 34}
                      width="68"
                      height="22"
                      rx="5"
                      fill="#111111"
                    />
                    <polygon
                      points={`${pt.x - 4},${pt.y - 12} ${pt.x + 4},${pt.y - 12} ${pt.x},${pt.y - 6}`}
                      fill="#111111"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 19}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="font-sans font-extrabold text-[11px] tracking-tight"
                    >
                      ${pt.value}B
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// Did You Know Facts Slider Sub-component
function DidYouKnowSlider({ facts }: { facts?: string[] }) {
  const [currIdx, setCurrIdx] = useState(0);

  const factList = useMemo(() => {
    if (facts && facts.length > 0) return facts;
    return [
      "Musk, who says he's worried about population collapse, has fathered at least 14 children with four women, including triplets and two sets of twins.",
      "Musk slept on the factory floor at Tesla during Model 3 production ramping in 2018, working up to 120 hours a week."
    ];
  }, [facts]);

  const handlePrev = () => {
    setCurrIdx((prev) => (prev - 1 + factList.length) % factList.length);
  };

  const handleNext = () => {
    setCurrIdx((prev) => (prev + 1) % factList.length);
  };

  return (
    <div className="w-full pt-6 pb-2 border-t border-[#111111]">
      <h3
        className="font-bold text-[19px] text-[#111111] mb-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Did you know
      </h3>

      <div className="relative bg-white border border-[#E5E0D5] p-6 sm:p-10 min-h-[150px] flex items-center justify-between gap-4">
        {/* Previous Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-9 h-9 rounded-full bg-[#EFECE6] hover:bg-[#DDD8CC] text-[#111111] font-bold text-base flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          title="Previous Fact"
        >
          ←
        </button>

        {/* Fact Quote Text */}
        <div className="flex-1 text-center max-w-xl px-2">
          <p
            className="text-[16px] sm:text-[18px] leading-relaxed text-[#111111]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {factList[currIdx]}
          </p>
        </div>

        {/* Next Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-9 h-9 rounded-full bg-[#EFECE6] hover:bg-[#DDD8CC] text-[#111111] font-bold text-base flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          title="Next Fact"
        >
          →
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center space-x-2 mt-3">
        {factList.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrIdx(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currIdx === i ? "bg-[#555555] scale-110" : "bg-[#CCCCCC]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function BillionaireProfileClient({ id }: { id: string }) {
  const [billionaires, setBillionaires] = useState<BillionaireItem[]>([]);
  const [showAllBillionaires, setShowAllBillionaires] = useState(false);
  const [visibleArticleCount, setVisibleArticleCount] = useState(5);

  useEffect(() => {
    setBillionaires(getBillionairesList());
    const handleUpdate = () => setBillionaires(getBillionairesList());
    window.addEventListener("wsj_billionaires_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("wsj_billionaires_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Find target billionaire
  const item = useMemo(() => {
    if (!billionaires || billionaires.length === 0) return null;
    return (
      billionaires.find((b) => b.id === id || b.rank.toString() === id) ||
      billionaires[0]
    );
  }, [billionaires, id]);

  // Find next billionaire in rank order
  const nextBillionaire = useMemo(() => {
    if (!item || billionaires.length <= 1) return null;
    const currIndex = billionaires.findIndex((b) => b.id === item.id);
    const nextIndex = (currIndex + 1) % billionaires.length;
    return billionaires[nextIndex];
  }, [billionaires, item]);

  // Find previous billionaire in rank order
  const prevBillionaire = useMemo(() => {
    if (!item || billionaires.length <= 1) return null;
    const currIndex = billionaires.findIndex((b) => b.id === item.id);
    const prevIndex = (currIndex - 1 + billionaires.length) % billionaires.length;
    return billionaires[prevIndex];
  }, [billionaires, item]);

  // Other Billionaires list (excluding current open billionaire)
  const otherBillionaires = useMemo(() => {
    if (!item) return [];
    return billionaires.filter((b) => b.id !== item.id);
  }, [billionaires, item]);

  // 3 Latest articles from Times Chicago related to the active profile
  const sidebarRelatedArticles = useMemo(() => {
    if (!item) return [];

    const bFirstName = item.name.split(" ")[0];
    const bLastName = item.name.split(" ").pop() || item.name;
    const bCompany = item.source.split(",")[0].trim();

    const pool = [
      {
        id: "rel_1",
        title: `${item.name} Loses $21 Billion In A Morning As ${bCompany} Shares Slip`,
        slug: "the-new-faces-of-the-grand-tour",
      },
      {
        id: "rel_2",
        title: `Times Chicago Daily: ${bLastName} Faces A Familiar Foe In Global Market Shift`,
        slug: "why-have-men-gone-off-the-rails",
      },
      {
        id: "rel_3",
        title: `${bLastName} Says ${bCompany} Tech Will Rebrand To Future Platforms After Market Shift`,
        slug: "christopher-nolans-next-cinematic-epic-2026",
      },
    ];

    return pool.slice(0, 3);
  }, [item]);

  // Main content articles for "More from Times Chicago"
  const articlesList = useMemo(() => {
    if (!item) return [];
    return [
      {
        id: "art_1",
        date: "Sep 8, 2026",
        title: `${item.name} Leads Economic Expansion In Global Valuation Rankings`,
        slug: "why-slow-job-growth-doesnt-mean-labor-market-trouble",
        description: `Financial analysis desk reveals how ${item.name}'s key holdings in ${item.source} and ${item.industry} continue to reshape global market trends.`,
        author: "By Antonio Pequeño IV",
        image: item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "art_2",
        date: "Mar 11, 2026",
        title: `${item.source} Valuation Reaches New Record Milestone Amid Innovation Boom`,
        slug: "nycs-pied-a-terre-owners-hunt-creative-ways-tax",
        description: `Corporate filings indicate significant investment acceleration under the executive leadership of ${item.name}.`,
        author: "By Mary Whitfill Roeloffs",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "art_3",
        date: "Feb 14, 2026",
        title: `How ${item.name} Built a $${item.netWorth} Empire in ${item.industry}`,
        slug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing",
        description: `An in-depth breakdown of valuation metrics, corporate acquisitions, and strategic market investments.`,
        author: "By Derek Saul",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "art_4",
        date: "Jan 22, 2026",
        title: `The Top 20 Billionaires Wealth Report: Economic Forces Shaping 2026`,
        slug: "the-new-faces-of-the-grand-tour",
        description: `Comparing the net worth trajectories of ${item.name}, Bernard Arnault, Jeff Bezos, and Mark Zuckerberg.`,
        author: "By Times Chicago Markets Desk",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "art_5",
        date: "Jan 10, 2026",
        title: `Global Infrastructure Investments Surge as Tech Founders Expand Energy Assets`,
        slug: "abigails-party-tamzin-outhwaite",
        description: `A detailed report on renewable power investments and data center expansion strategies led by top global executives.`,
        author: "By Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "art_6",
        date: "Dec 18, 2025",
        title: `Artificial Intelligence Frontiers: How Enterprise Automation Driving Capital Growth`,
        slug: "the-1m-secret-hiding-in-a-french-garden-shed",
        description: `Insiders examine venture portfolios and private investments funding next-generation artificial intelligence startups.`,
        author: "By Marcus Vance",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "art_7",
        date: "Nov 29, 2025",
        title: `Commercial Real Estate and Private Equity Trends Shaping 2026 Markets`,
        slug: "pop-musics-new-icon-takes-center-stage-o2-arena",
        description: `Analytic insights into institutional asset management, residential portfolios, and urban commercial expansions.`,
        author: "By Rachel Sterling",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "art_8",
        date: "Nov 05, 2025",
        title: `Executive Leadership Insights: Navigating Supply Chains and Global Trade Shifts`,
        slug: "the-10-must-read-books-of-autumn",
        description: `Key lessons from industry captains managing international operations during fluctuating currency values.`,
        author: "By David Miller",
        image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=500&q=80",
      },
    ];
  }, [item]);

  if (!item) {
    return (
      <main className="min-h-screen flex flex-col bg-white text-[#111111]">
        <Header />
        <StickyHeaderBar />
        <Container className="flex-1 py-16 text-center">
          <p className="text-gray-500 font-sans text-base">Loading billionaire profile...</p>
        </Container>
        <Footer />
      </main>
    );
  }

  const bulletPoints = item.editorBulletPoints && item.editorBulletPoints.length > 0
    ? item.editorBulletPoints
    : [
        `${item.name} is a leading global figure shaping modern industry and technology.`,
        `Controls major market equity holdings in ${item.source}.`,
        `Maintains executive leadership in ${item.industry} and international ventures.`
      ];

  const displayedOthers = showAllBillionaires ? otherBillionaires : otherBillionaires.slice(0, 5);
  const currentVisibleArticles = articlesList.slice(0, visibleArticleCount);

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#111111] select-none">
      <Header />
      <StickyHeaderBar />

      {/* ==================== BREADCRUMB SUB-HEADER BAR ==================== */}
      <Container className="pt-6 pb-2 bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2 font-sans text-sm sm:text-base">
          <span className="font-extrabold text-[#111111]">#{item.rank}</span>
          <span className="text-[#CCCCCC]">|</span>
          <Link
            href="/top-20-billionaires"
            className="font-bold text-[#111111] hover:underline transition-all"
          >
            Billionaires
          </Link>
        </div>

        {/* Top Right Navigation: Render Image 2 PREV/NEXT controls for Billionaires #2-#20 */}
        {item.rank > 1 && prevBillionaire ? (
          <div className="flex items-center space-x-3 font-sans text-xs sm:text-sm">
            <Link
              href={`/billionaires/${prevBillionaire.id}`}
              className="w-8 h-8 rounded-full border border-[#DDD8CC] bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#111111] flex items-center justify-center transition-colors shadow-2xs shrink-0"
              title={`Previous: ${prevBillionaire.name}`}
            >
              <svg className="w-4 h-4 text-[#444444]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>

            <span className="font-sans font-bold text-[12px] sm:text-[13px] text-[#111111] tracking-wider uppercase">
              PREV / NEXT
            </span>

            {nextBillionaire && (
              <Link
                href={`/billionaires/${nextBillionaire.id}`}
                className="w-8 h-8 rounded-full border border-[#DDD8CC] bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#111111] flex items-center justify-center transition-colors shadow-2xs shrink-0"
                title={`Next: ${nextBillionaire.name}`}
              >
                <svg className="w-4 h-4 text-[#444444]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            )}
          </div>
        ) : (
          nextBillionaire && (
            <Link
              href={`/billionaires/${nextBillionaire.id}`}
              className="group font-sans font-extrabold text-[11px] sm:text-[12px] uppercase tracking-wider text-[#111111] hover:text-[#333333] flex items-center space-x-2 cursor-pointer"
            >
              <span>NEXT</span>
              <span className="w-7 h-7 rounded-full border border-[#DDD8CC] group-hover:border-black flex items-center justify-center text-xs transition-colors bg-white">
                →
              </span>
            </Link>
          )
        )}
      </Container>

      <Container className="flex-1 py-4 sm:py-6 bg-white">
        {/* ==================== MAIN PROFILE HEADER CARD (Compact Vertical Height - Image 2 Specs) ==================== */}
        <div className="w-full bg-[#FAF8F5] border border-[#E5E0D5] overflow-hidden my-2 sm:my-4 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-[#111111]">
                    PROFILE
                  </span>
                </div>

                <h1 className="font-serif font-extrabold text-[32px] sm:text-[40px] lg:text-[44px] leading-tight text-[#111111] mt-1.5">
                  {item.name}
                </h1>

                <p className="font-sans font-medium text-[14px] sm:text-[15px] text-[#444444] mt-0.5">
                  {item.titleRole || `CEO, ${item.source}`}
                </p>

                {/* Two Net Worth Columns Below Title & Role (Horizontally Aligned Number & Text) */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  {/* Left Section: Real Time Net Worth */}
                  <div className="space-y-1">
                    <div className="flex items-start space-x-3.5">
                      <span className="font-serif font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-none text-[#111111]">
                        {item.realTimeNetWorth || item.netWorth}
                      </span>
                      <div className="flex flex-col text-left leading-snug pt-0.5">
                        <span className="font-sans font-semibold text-[11px] sm:text-[12px] text-[#111111]">
                          Real Time Net Worth
                        </span>
                        <span className="font-sans text-[10.5px] sm:text-[11px] text-[#666666]">
                          as of {item.realTimeAsOf || "10/7/26"}
                        </span>
                        <span className="font-sans font-bold text-[10.5px] sm:text-[11px] text-[#2563eb]">
                          #{item.rank} in the world today
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="font-serif font-bold text-[14px] sm:text-[15px] text-[#ef4444]">
                        {item.realTimeChange || "▼ $23.2B (2.21%)"}
                      </span>
                    </div>
                  </div>

                  {/* Right Section: 2026 Billionaires Net Worth (Exact Same Font & Horizontal Alignment) */}
                  <div className="space-y-1">
                    <div className="flex items-start space-x-3.5">
                      <span className="font-serif font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-none text-[#111111]">
                        {item.netWorth}
                      </span>
                      <div className="flex flex-col text-left leading-snug pt-0.5">
                        <span className="font-sans font-semibold text-[11px] sm:text-[12px] text-[#111111]">
                          2026 Billionaires Net Worth
                        </span>
                        <span className="font-sans text-[10.5px] sm:text-[11px] text-[#666666]">
                          as of 3/10/26
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Photo Column (Compact height matching Image 2) */}
            <div className="lg:col-span-5 h-[260px] sm:h-[300px] lg:h-[320px] relative overflow-hidden bg-[#EFECE6] border-t lg:border-t-0 lg:border-l border-[#E5E0D5]">
              <img
                src={item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"}
                alt={item.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80";
                }}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* ==================== CONTAINER BLOCK 1 (SECTIONS 1 THROUGH 6 & RIGHT SIDEBAR ADS) ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          {/* Main Content Column (Left & Middle - 8 Cols) with dashed right divider */}
          <div className="lg:col-span-8 space-y-10 border-b lg:border-b-0 lg:border-r border-dashed border-[#CCCCCC] pr-0 lg:pr-8 pb-8 lg:pb-0">
            {/* 1st Section: "From the Editor" Bullet Points */}
            <div className="w-full bg-white border border-[#E5E0D5] p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5] mb-5 text-left">
                <h3
                  className="font-bold text-[15px] sm:text-[16px] text-[#111111] text-left"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  From the Editor
                </h3>
                <span className="font-sans text-[11px] sm:text-[12px] text-[#777777]">
                  {item.editorLastUpdated || "Last Updated Sep 15, 2026, 6:30am EDT"}
                </span>
              </div>

              <ul
                className="space-y-4 text-[15px] sm:text-[16px] leading-relaxed text-[#222222] list-disc pl-5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {bulletPoints.map((pt, idx) => (
                  <li key={idx} className="pl-1">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2nd Section: "Wealth History" Graph */}
            <MainContentWealthChart history={item.wealthHistory} endYear={item.endYear} />

            {/* 3rd Section: "Personal Stats" Table */}
            <div className="w-full pt-6 pb-2 border-t border-[#111111]">
              <h3
                className="font-bold text-[15px] text-[#333333] mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Personal Stats
              </h3>

              <div className="divide-y divide-[#E5E0D5] border-t border-b border-[#E5E0D5] text-[13.5px] sm:text-[14px] font-sans">
                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Age</span>
                  <span className="text-[#111111] font-semibold">{item.age || 55}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Source of Wealth</span>
                  <span className="text-[#111111] font-semibold">{item.source || "Tesla, SpaceX, Self Made"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Self-Made Score</span>
                  <span className="text-[#111111] font-semibold">{item.selfMadeScore || 8}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Philanthropy Score</span>
                  <span className="text-[#111111] font-semibold">{item.philanthropyScore || 1}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Residence</span>
                  <span className="text-[#111111] font-semibold">{item.residence || "Austin, Texas"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Citizenship</span>
                  <span className="text-[#111111] font-semibold">{item.citizenship || "United States"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Marital Status</span>
                  <span className="text-[#111111] font-semibold">{item.maritalStatus || "Divorced"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Children</span>
                  <span className="text-[#111111] font-semibold">{item.children || 14}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Education</span>
                  <span className="text-[#111111] font-semibold">{item.education || "Bachelor of Arts/Science, University of Pennsylvania"}</span>
                </div>
              </div>
            </div>

            {/* 4th Section: "Did you know" Fact Carousel */}
            <DidYouKnowSlider facts={item.didYouKnowFacts} />

            {/* 5th Section: "In Their Own Words" Quote Block */}
            <div className="w-full pt-8 pb-4 border-t border-[#111111]">
              <h3
                className="font-bold text-[20px] text-[#111111] mb-5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                In Their Own Words
              </h3>

              <div className="bg-white border border-[#E5E0D5] p-8 sm:p-12 text-center shadow-2xs">
                <blockquote
                  className="text-[18px] sm:text-[22px] leading-relaxed text-[#111111] max-w-2xl mx-auto"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {item.inTheirOwnWordsQuote || `“I operate on the physics approach to analysis. You boil things down to the first principles or fundamental truths in a particular area and then you reason up from there.”`}
                </blockquote>

                <div className="mt-5 inline-block border-b-2 border-[#41516c] pb-1">
                  <p
                    className="font-bold text-[15px] text-[#111111]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {item.name}
                  </p>
                </div>
              </div>
            </div>

            {/* 6th Section: "Other Billionaires" Section */}
            <div className="w-full pt-8 pb-4 border-t border-[#111111]">
              <h3
                className="font-bold text-[20px] text-[#111111] mb-5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Other Billionaires
              </h3>

              <div className="bg-white border border-[#E5E0D5] p-4 sm:p-6 divide-y divide-[#E5E0D5]">
                {displayedOthers.map((other) => (
                  <div key={other.id} className="py-4 flex items-center justify-between gap-4 first:pt-2 last:pb-2">
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                      <img
                        src={other.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"}
                        alt={other.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#DDD8CC]"
                      />
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-bold text-[15px] text-[#111111] truncate"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {other.name}
                        </h4>
                        <p
                          className="text-[12px] text-[#666666] truncate"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Rank #{other.rank} • {other.source} ({other.industry})
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/billionaires/${other.id}`}
                      className="bg-white hover:bg-[#F0EDE6] border border-[#CCCCCC] text-[#111111] font-bold text-[12px] px-4 py-2 rounded-full transition-colors flex items-center space-x-1.5 shrink-0"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <span>View Profile</span>
                      <span>→</span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* See All (20) Action Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAllBillionaires(!showAllBillionaires)}
                  className="bg-[#262626] hover:bg-[#111111] text-white font-sans font-bold text-[12.5px] px-6 py-2.5 rounded-xl cursor-pointer shadow-2xs transition-colors"
                >
                  {showAllBillionaires ? "Show Less" : "See All (20)"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column 1: Top Sidebar Ad & ALSO ON TIMES CHICAGO Widget */}
          <div className="lg:col-span-4 hidden lg:block space-y-6">
            {/* 1. Top Right Sidebar Advertisement */}
            <div className="w-full">
              <AdPlaceholder
                slotId="billionaire_slot_2"
                width="w-full"
                height="h-[250px]"
                resolution="300 × 250"
              />
            </div>

            {/* 2. ALSO ON TIMES CHICAGO 3-Article Widget */}
            <div className="w-full bg-white border border-[#E5E0D5] p-5 shadow-2xs">
              <h3 className="font-sans font-extrabold text-[12px] uppercase tracking-wider text-[#777777] pb-3 border-b border-[#E5E0D5]">
                ALSO ON TIMES CHICAGO
              </h3>
              <div className="divide-y divide-[#E5E0D5]">
                {sidebarRelatedArticles.map((art) => (
                  <div key={art.id} className="py-3.5 first:pt-3 last:pb-1">
                    <h4
                      className="font-bold text-[15px] sm:text-[16px] leading-snug text-[#111111] hover:underline cursor-pointer"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      <Link href={`/article/${art.slug}`}>
                        {art.title}
                      </Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Sticky Ad 1 */}
            <div className="sticky top-24 w-full">
              <AdPlaceholder
                slotId="billionaire_slot_3"
                width="w-full"
                height="h-[250px]"
                resolution="300 × 250"
              />
            </div>
          </div>
        </div>

        {/* ==================== CONTAINER BLOCK 2 ("MORE FROM TIMES CHICAGO" & STICKY AD) ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          {/* Main Content Column (More from Times Chicago with Inline Ad & Pagination) */}
          <div className="lg:col-span-8 space-y-8 border-b lg:border-b-0 lg:border-r border-dashed border-[#CCCCCC] pr-0 lg:pr-8 pb-8 lg:pb-0">
            <div className="w-full pt-8 pb-4 border-t border-[#111111]">
              <h3
                className="font-bold text-[20px] text-[#111111] mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                More from Times Chicago
              </h3>

              <div className="space-y-8">
                {currentVisibleArticles.map((art, index) => (
                  <React.Fragment key={art.id}>
                    <article className="bg-white border border-[#E5E0D5] p-5 sm:p-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <span className="font-sans text-[11px] text-[#777777] uppercase tracking-wider block">
                          {art.date}
                        </span>
                        <h4
                          className="font-bold text-[18px] sm:text-[21px] leading-snug text-[#111111] hover:underline cursor-pointer"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          <Link href={`/article/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h4>
                        <p className="font-sans text-[13.5px] leading-relaxed text-[#444444] line-clamp-2">
                          {art.description}
                        </p>
                        <p className="font-sans text-[11.5px] font-bold text-[#666666] pt-1">
                          {art.author}
                        </p>
                      </div>

                      <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-[#EFECE6] border border-[#DDD8CC]">
                        <Link href={`/article/${art.slug}`}>
                          <img
                            src={art.image}
                            alt=""
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                    </article>

                    {/* Inline Advertisement inserted directly after 3rd article (index 2) cleanly without border box */}
                    {index === 2 && (
                      <div className="w-full flex flex-col items-center justify-center my-6 py-2">
                        <AdPlaceholder
                          slotId="billionaire_profile_inline_ad"
                          width="w-full"
                          height="h-[90px]"
                          resolution="728 × 90"
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* "More articles" Action Button */}
              {visibleArticleCount < articlesList.length && (
                <div className="flex justify-center mt-8 pt-4 border-t border-[#E5E0D5]">
                  <button
                    type="button"
                    onClick={() => setVisibleArticleCount((prev) => Math.min(prev + 3, articlesList.length))}
                    className="bg-[#111111] hover:bg-[#333333] text-white font-sans font-bold text-[13px] px-8 py-3 rounded-full cursor-pointer shadow-sm transition-colors uppercase tracking-wider"
                  >
                    More articles
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column 2: Sticky Ad 2 */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 w-full">
              <AdPlaceholder
                slotId="billionaire_slot_4"
                width="w-full"
                height="h-[250px]"
                resolution="300 × 250"
              />
            </div>
          </div>
        </div>
      </Container>

      <Footer />
      <StickySubscribeBar />
    </main>
  );
}
