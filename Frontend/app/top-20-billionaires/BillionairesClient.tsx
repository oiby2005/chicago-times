"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { BillionaireItem, WealthPoint, getBillionairesList } from "@/data/billionaires";

// Explicit Industry Options list as requested
const INDUSTRY_OPTIONS = [
  "Automotive",
  "Construction and Engineering",
  "Diversified",
  "Energy",
  "Fashion and Retail",
  "Finance and Investments",
  "Food and Beverage",
  "Gambling and Casinos",
  "Health Care",
  "Logistics",
  "Manufacturing",
  "Media and Entertainment",
  "Metals and Mining",
  "Real Estate",
  "Service",
  "Suport",
  "Technology",
  "Telecom",
];

// Comprehensive Alphabetical List of World Countries
const WORLD_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

// Sub-component for Wealth History Chart with smooth hover tooltips
function WealthHistoryChart({ history, endYear }: { history?: WealthPoint[]; endYear?: number }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = useMemo(() => {
    if (history && history.length > 0) return history;
    const targetEndYear = endYear || 2026;
    return [
      { year: targetEndYear - 5, value: 190 },
      { year: targetEndYear - 4, value: 219 },
      { year: targetEndYear - 3, value: 180 },
      { year: targetEndYear - 2, value: 210 },
      { year: targetEndYear - 1, value: 340 },
      { year: targetEndYear, value: 839 },
    ];
  }, [history, endYear]);

  const svgWidth = 360;
  const svgHeight = 110;
  const paddingX = 25;
  const paddingTop = 32;
  const paddingBottom = 25;

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
    <div className="flex flex-col items-center md:items-end w-full max-w-[360px] select-none">
      <h4 className="font-serif font-bold text-[14px] text-[#111111] mb-1 tracking-tight">
        Billionaires Wealth History
      </h4>
      <div className="relative w-full">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          {/* Horizontal Base Axis */}
          <line
            x1={paddingX - 10}
            y1={svgHeight - paddingBottom + 4}
            x2={svgWidth - paddingX + 10}
            y2={svgHeight - paddingBottom + 4}
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

          {/* Nodes, Year Labels & Hover Tooltips */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g key={i} className="cursor-pointer">
                {/* Visible Open Circle Marker */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 5.5}
                  fill="white"
                  stroke="#111111"
                  strokeWidth={isHovered ? 4 : 3.5}
                  className="transition-all duration-150"
                />

                {/* Larger Transparent Hit Target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="16"
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Year Label Underneath Point */}
                <text
                  x={pt.x}
                  y={svgHeight - 4}
                  textAnchor="middle"
                  className="fill-[#444444] font-sans font-extrabold text-[12px] pointer-events-none"
                >
                  {pt.year}
                </text>

                {/* Hover Tooltip */}
                {isHovered && (
                  <g className="pointer-events-none">
                    <rect
                      x={pt.x - 32}
                      y={pt.y - 32}
                      width="64"
                      height="22"
                      rx="6"
                      fill="#111111"
                    />
                    <polygon
                      points={`${pt.x - 4},${pt.y - 10} ${pt.x + 4},${pt.y - 10} ${pt.x},${pt.y - 5}`}
                      fill="#111111"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 17}
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

export default function BillionairesClient() {
  const [billionaires, setBillionaires] = useState<BillionaireItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  // Default to null so NO billionaire profile opens automatically upon page visit
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setBillionaires(getBillionairesList());
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("wsj_billionaires_updated", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("wsj_billionaires_updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, [loadData]);

  // Filtered list based on search, industry, country, and gender
  const filteredBillionaires = useMemo(() => {
    return billionaires.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry =
        !selectedIndustry ||
        item.industry.toLowerCase().replace("&", "and") === selectedIndustry.toLowerCase().replace("&", "and") ||
        item.industry.toLowerCase().includes(selectedIndustry.toLowerCase().split(" ")[0]);

      const matchesCountry =
        !selectedCountry ||
        item.country.toLowerCase() === selectedCountry.toLowerCase() ||
        item.country.toLowerCase().includes(selectedCountry.toLowerCase());

      const itemGender = item.gender
        ? item.gender.toLowerCase()
        : (item.name.toLowerCase().includes("alice") ||
           item.name.toLowerCase().includes("francoise") ||
           item.name.toLowerCase().includes("bettencourt") ||
           item.name.toLowerCase().includes("mackenzie") ||
           item.name.toLowerCase().includes("julia"))
        ? "female"
        : "male";

      const matchesGender =
        !selectedGender || selectedGender === "All" || itemGender === selectedGender.toLowerCase();

      return matchesSearch && matchesIndustry && matchesCountry && matchesGender;
    });
  }, [billionaires, searchQuery, selectedIndustry, selectedCountry, selectedGender]);

  // Helper to render Change Status icon/indicator
  const renderChangeIndicator = (status: BillionaireItem["changeStatus"]) => {
    switch (status) {
      case "UP":
        return <span className="text-[#10b981] font-bold ml-1.5 inline-flex items-center text-xs">▲</span>;
      case "DOWN":
        return <span className="text-[#ef4444] font-bold ml-1.5 inline-flex items-center text-xs">▼</span>;
      case "UNCHANGED":
        return <span className="text-[#94a3b8] font-bold ml-1.5 inline-flex items-center text-xs">-</span>;
      case "NEW":
        return <span className="text-[#111111] font-extrabold ml-1.5 inline-flex items-center text-xs">+</span>;
      case "RETURNEE":
        return <span className="text-[#111111] font-extrabold ml-1.5 inline-flex items-center text-xs">↺</span>;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#111111] select-none">
      <Header />
      <StickyHeaderBar />

      <Container className="flex-1 py-6 sm:py-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Initial Header Section */}
        <div className="w-full bg-white text-center pt-4 pb-1 sm:pt-8 sm:pb-2">
          <h1 className="font-serif font-black text-[36px] sm:text-[48px] md:text-[56px] leading-tight text-[#111111] tracking-tight">
            World’s Billionaires List
          </h1>
          <p className="font-sans font-bold text-[13px] sm:text-[14px] uppercase tracking-widest text-[#888888] mt-2 sm:mt-3 mb-1">
            The Richest In 2026
          </p>
        </div>

        {/* Secondary Headline Below Initial Header: Underline aligns strictly to text width, black color (#111111) */}
        <div className="w-full bg-white text-center pt-8 sm:pt-12 pb-1">
          <div className="inline-block border-b border-[#111111] pb-2 max-w-full">
            <h2 className="font-sans font-bold text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] uppercase tracking-wider text-[#111111] whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
              Another year, another set of records for the world's billionaire class.
            </h2>
          </div>
        </div>

        {/* Times Chicago Intro Paragraph: Uses exact article body font (Exchange, Georgia, serif), justified alignment & regular weight */}
        <div className="max-w-3xl mx-auto pt-2 sm:pt-3 pb-6 sm:pb-8 px-4">
          <p
            style={{ fontFamily: "Exchange, Georgia, 'Source Serif 4', serif" }}
            className="font-normal text-[13.5px] sm:text-[14.5px] md:text-[15.5px] lg:text-[16.5px] leading-[1.75] text-[#1a1a1a] text-justify"
          >
            There has never been a more transformative era for wealth creation. Driven by artificial intelligence innovations, resilient capital markets, and expanding global enterprises, a record 3,428 business leaders, founders, and investors earned a place on this year's <span className="font-normal text-[#1a1a1a]">Times Chicago World's Billionaires List</span> — an increase of 400 over last year. They are richer than ever, worth a record <span className="font-normal text-[#1a1a1a]">$20.1 trillion</span>, up $4 trillion from last year. The U.S. has the most billionaires, with a record 989, including 15 of the top 20 rankings. China (including Hong Kong) follows next with 610, and India (229) ranks a distant third. We used stock prices and exchange rates from March 1, 2026. For daily updated net worths of all billionaires, check out our <Link href="/billionaires/1" className="text-[#2563eb] font-normal hover:underline">real-time billionaires ranking</Link>.
          </p>

          {/* See List Button */}
          <div className="flex justify-center mt-6 mb-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("richest-people-table");
                if (el) {
                  const yOffset = -90; // Adjust offset so top edge of "The Richest People In The World" is clearly visible below sticky header
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
              className="bg-[#262626] hover:bg-[#111111] text-white font-sans font-bold text-[13px] sm:text-[14px] px-8 py-3 rounded-lg cursor-pointer shadow-xs transition-colors"
            >
              See List
            </button>
          </div>
        </div>

        {/* 970x300 Billionaire Page Ad 01 Slot */}
        <div className="flex flex-col items-center justify-center my-6 sm:my-8 w-full max-w-[970px] mx-auto px-4">
          <AdPlaceholder
            slotId="billionaire_slot_1"
            width="w-full max-w-[970px]"
            height="h-[300px]"
            resolution="970 × 300"
          />
        </div>

        {/* ==================== THE RICHEST PEOPLE IN THE WORLD TABLE SECTION ==================== */}
        <section id="richest-people-table" className="pt-6 pb-10 border-t border-[#E2DDD0]">
          {/* Section Heading */}
          <div className="text-center mb-6">
            <h2 className="font-serif font-bold text-[30px] sm:text-[38px] md:text-[42px] leading-tight text-[#111111]">
              The Richest People In The World
            </h2>

            {/* Changes in Wealth Key Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-3 text-[10.5px] sm:text-[11.5px] font-sans font-bold text-[#555555] uppercase tracking-wider">
              <span className="text-[#666666]">CHANGES IN WEALTH KEY:</span>
              <span className="inline-flex items-center space-x-1"><span className="text-[#10b981]">▲</span> <span>UP</span></span>
              <span className="inline-flex items-center space-x-1"><span className="text-[#ef4444]">▼</span> <span>DOWN</span></span>
              <span className="inline-flex items-center space-x-1"><span className="text-[#94a3b8] font-black">-</span> <span>UNCHANGED</span></span>
              <span className="inline-flex items-center space-x-1"><span className="text-[#111111] font-black">+</span> <span>NEW TO LIST</span></span>
              <span className="inline-flex items-center space-x-1"><span className="text-[#111111] font-black">↺</span> <span>RETURNEE</span></span>
            </div>
          </div>

          {/* Search & Filter Bar: Perfect Horizontal Alignment (Image 1 & Image 2 Specs) */}
          <div className="bg-[#FCFBF8] border border-[#E5E0D5] p-4 sm:p-5 mb-6 rounded-none">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Search Box (Column 1 ~ 3.5 cols) */}
              <div className="md:col-span-4 flex flex-col justify-end">
                <label className="block text-[10px] font-sans font-extrabold uppercase tracking-wider text-[#666666] mb-1">
                  SEARCH LIST
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search this list"
                    className="w-full h-[40px] bg-white border border-[#CCCCCC] px-3.5 pr-9 text-[13px] font-sans text-[#111111] focus:outline-none focus:border-black rounded-none shadow-2xs"
                  />
                  <svg
                    className="w-4 h-4 text-[#777777] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>

              {/* Industry Filter (Column 2 ~ 3 cols) */}
              <div className="md:col-span-3 flex flex-col justify-end">
                <label className="block text-[10px] font-sans font-extrabold uppercase tracking-wider text-[#666666] mb-1">
                  FILTER BY INDUSTRY
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full h-[40px] bg-white border border-[#CCCCCC] px-3 text-[13px] font-sans text-[#111111] focus:outline-none focus:border-black rounded-none cursor-pointer shadow-2xs"
                >
                  <option value="">All Industries</option>
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter & Filters Button alongside each other (Column 3 ~ 5 cols) */}
              <div className="md:col-span-5 flex flex-col justify-end">
                <label className="block text-[10px] font-sans font-extrabold uppercase tracking-wider text-[#666666] mb-1">
                  FILTER BY COUNTRY/TERRITORY
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="flex-1 min-w-0 h-[40px] bg-white border border-[#CCCCCC] px-3 text-[13px] font-sans text-[#111111] focus:outline-none focus:border-black rounded-none cursor-pointer shadow-2xs"
                  >
                    <option value="">All Countries / Territories</option>
                    {WORLD_COUNTRIES.map((cnt) => (
                      <option key={cnt} value={cnt}>
                        {cnt}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    {/* White Filters Button */}
                    <button
                      type="button"
                      onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                      className="h-[40px] bg-white hover:bg-[#F3F4F6] border border-[#CCCCCC] text-[#111111] px-4 font-sans font-bold text-[13px] rounded-xl shadow-2xs flex items-center space-x-1.5 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <span>Filters{selectedGender ? " (1)" : ""}</span>
                      <svg
                        className={`w-3.5 h-3.5 text-[#555555] transition-transform ${isFilterPanelOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Popover Dropdown Menu for Gender Filter (Image 2 Specs) */}
                    {isFilterPanelOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#FCFBF9] border border-[#E5E0D5] rounded-xl p-4 shadow-xl z-30 animate-in fade-in duration-150">
                        {/* Top pointing triangle */}
                        <div className="absolute -top-2 right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#E5E0D5]" />
                        <div className="absolute -top-[7px] right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#FCFBF9]" />

                        <div className="mb-3">
                          <h4 className="font-sans font-extrabold text-[11px] uppercase tracking-wider text-[#333333]">
                            SELECT GENDER
                          </h4>
                        </div>

                        <div className="space-y-3 font-sans text-[14px] text-[#222222]">
                          {/* Male Checkbox */}
                          <label className="flex items-center space-x-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selectedGender === "Male"}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedGender("Male");
                                else setSelectedGender("");
                              }}
                              className="w-5 h-5 rounded border-[#CCCCCC] text-[#2563eb] focus:ring-0 cursor-pointer"
                            />
                            <span className="font-medium text-[#222222]">Male</span>
                          </label>

                          {/* Female Checkbox */}
                          <label className="flex items-center space-x-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selectedGender === "Female"}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedGender("Female");
                                else setSelectedGender("");
                              }}
                              className="w-5 h-5 rounded border-[#CCCCCC] text-[#2563eb] focus:ring-0 cursor-pointer"
                            />
                            <span className="font-medium text-[#222222]">Female</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dark Clear Button (Renders ONLY if a filter is active - Image 2) */}
                  {(selectedGender || selectedIndustry || selectedCountry || searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGender("");
                        setSelectedIndustry("");
                        setSelectedCountry("");
                        setSearchQuery("");
                        setIsFilterPanelOpen(false);
                      }}
                      className="h-[40px] bg-[#2C2B29] hover:bg-[#111111] text-white px-4 font-sans font-bold text-[13px] rounded-xl shadow-2xs cursor-pointer whitespace-nowrap transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto border border-[#E2DDD0]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#E2DDD0] text-[11px] font-sans font-bold text-[#444444] uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4 min-w-[180px]">Name</th>
                  <th className="py-3 px-4 min-w-[130px]">Net Worth</th>
                  <th className="py-3 px-4 w-20 text-center">Age</th>
                  <th className="py-3 px-4 min-w-[140px]">Country/Territory</th>
                  <th className="py-3 px-4 min-w-[160px]">Source</th>
                  <th className="py-3 px-4 min-w-[150px]">Industry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] bg-white text-[13px] font-sans text-[#111111]">
                {filteredBillionaires.length > 0 ? (
                  filteredBillionaires.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        {/* Main Billionaire Row: White background when open */}
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className={`cursor-pointer transition-colors ${
                            isExpanded ? "bg-white" : "hover:bg-[#FAF9F5]"
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-center text-[#555555]">
                            {item.rank}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#111111]">
                            {item.name}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#111111] whitespace-nowrap">
                            {item.netWorth}
                            {renderChangeIndicator(item.changeStatus)}
                          </td>
                          <td className="py-3.5 px-4 text-center text-[#555555]">
                            {item.age}
                          </td>
                          <td className="py-3.5 px-4 text-[#333333]">
                            {item.country}
                          </td>
                          <td className="py-3.5 px-4 text-[#333333]">
                            {item.source}
                          </td>
                          <td className="py-3.5 px-4 text-[#333333] font-medium">
                            {item.industry}
                          </td>
                        </tr>

                        {/* Expanded Detail Drawer Row: White background when open */}
                        {isExpanded && (
                          <tr className="bg-white">
                            <td colSpan={7} className="p-4 sm:p-6 border-t border-b border-[#E5E0D5]">
                              <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2 sm:px-4">
                                {/* Left Side: Photo + Bio Text + View Profile Button */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1 min-w-0">
                                  {/* Billionaire Headshot Photo */}
                                  <div className="w-28 h-32 sm:w-36 sm:h-40 rounded-xl overflow-hidden shrink-0 border border-[#DDD8CC] shadow-2xs bg-[#EFECE6]">
                                    <img
                                      src={item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"}
                                      alt={item.name}
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80";
                                      }}
                                      className="w-full h-full object-cover object-center"
                                    />
                                  </div>

                                  {/* Bio Text & View Profile Button */}
                                  <div className="flex flex-col justify-between h-full space-y-4 text-center sm:text-left flex-1 min-w-0">
                                    <p className="font-sans font-medium text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#111111]">
                                      {item.highlightText || `${item.name} is one of the world's leading economic icons, representing major leadership in ${item.industry}.`}
                                    </p>

                                    <div className="flex items-center justify-center sm:justify-start pt-1">
                                      <Link
                                        href={`/billionaires/${item.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-[#111111] hover:bg-[#333333] text-white font-sans font-bold text-[12px] px-6 py-2.5 rounded-lg shadow-2xs transition-colors whitespace-nowrap inline-block"
                                      >
                                        View Profile
                                      </Link>
                                    </div>
                                  </div>
                                </div>

                                {/* Vertical Divider Line */}
                                <div className="hidden md:block w-px h-36 bg-[#E5E0D5] mx-2" />

                                {/* Right Side: Wealth History Chart with Hover Tooltips */}
                                <div className="w-full md:w-auto shrink-0 flex justify-center md:justify-end pt-2 md:pt-0">
                                  <WealthHistoryChart history={item.wealthHistory} endYear={item.endYear} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#777777] font-sans text-sm">
                      No billionaires match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </Container>

      <Footer />
      <StickySubscribeBar />
    </main>
  );
}
