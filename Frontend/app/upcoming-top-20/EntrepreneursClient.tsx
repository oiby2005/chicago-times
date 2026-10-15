"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { EntrepreneurItem, INITIAL_ENTREPRENEURS, getEntrepreneursList } from "@/data/entrepreneurs";

// Industry Options list
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
  "Zambia", "Zimbabwe",
];

export default function EntrepreneursClient() {
  const basePath = "/upcoming-entrepreneurs";

  const slugify = (str: string) =>
    (str || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const [entrepreneurs, setEntrepreneurs] = useState<EntrepreneurItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_entrepreneurs_list");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return getEntrepreneursList();
    }
    return INITIAL_ENTREPRENEURS;
  });
  const [expandedId, setExpandedId] = useState<string | null>("1");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Load Entrepreneurs
  const loadData = useCallback(() => {
    let localItems: EntrepreneurItem[] = [];
    try {
      localItems = getEntrepreneursList();
    } catch (e) {}

    fetch("http://localhost:5000/api/entrepreneurs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.entrepreneurs) && data.entrepreneurs.length > 0) {
          setEntrepreneurs(data.entrepreneurs);
          try {
            localStorage.setItem("wsj_entrepreneurs_list", JSON.stringify(data.entrepreneurs));
          } catch (e) {}
        } else if (localItems.length > 0) {
          setEntrepreneurs(localItems);
        }
      })
      .catch(() => {
        if (localItems.length > 0) {
          setEntrepreneurs(localItems);
        }
      });
  }, []);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("wsj_entrepreneurs_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("wsj_entrepreneurs_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [loadData]);

  // Ensure first profile is opened by default
  useEffect(() => {
    if (entrepreneurs.length > 0 && !expandedId) {
      setExpandedId(entrepreneurs[0].id);
    }
  }, [entrepreneurs, expandedId]);

  // Filtered List
  const filteredEntrepreneurs = useMemo(() => {
    return entrepreneurs.filter((item) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCountry = item.country.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        const matchesIndustry = item.industry.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesSource && !matchesIndustry) {
          return false;
        }
      }

      // 2. Industry Filter
      if (selectedIndustry && item.industry !== selectedIndustry) {
        return false;
      }

      // 3. Country Filter
      if (selectedCountry && item.country !== selectedCountry) {
        return false;
      }

      // 4. Gender Filter
      if (selectedGender) {
        const itemGender = item.gender || "";
        if (itemGender.toLowerCase() !== selectedGender.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [entrepreneurs, searchQuery, selectedIndustry, selectedCountry, selectedGender]);

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#111111] ">
      <Header />
      <StickyHeaderBar />

      <Container className="flex-1 py-6 sm:py-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Initial Header Section */}
        <div className="w-full bg-white text-center pt-4 pb-1 sm:pt-8 sm:pb-2">
          <h1 className="font-serif font-black text-[36px] sm:text-[48px] md:text-[56px] leading-tight text-[#111111] tracking-tight">
            Upcoming Top 20 Entrepreneurs
          </h1>
          <p className="font-sans font-bold text-[13px] sm:text-[14px] uppercase tracking-widest text-[#888888] mt-2 sm:mt-3 mb-1">
            The Richest In 2026
          </p>
        </div>

        {/* Secondary Headline Below Initial Header */}
        <div className="w-full bg-white text-center pt-8 sm:pt-12 pb-1">
          <div className="inline-block border-b border-[#111111] pb-2 max-w-full">
            <h2 className="font-sans font-bold text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] uppercase tracking-wider text-[#111111] whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
              Pioneering Founders, Disruptors, and Visionaries Reshaping Modern Industries.
            </h2>
          </div>
        </div>

        {/* Times Chicago Intro Paragraph */}
        <div className="max-w-3xl mx-auto pt-2 sm:pt-3 pb-6 sm:pb-8 px-4">
          <p
            style={{ fontFamily: "Exchange, Georgia, 'Source Serif 4', serif" }}
            className="font-normal text-[13.5px] sm:text-[14.5px] md:text-[15.5px] lg:text-[16.5px] leading-[1.75] text-[#1a1a1a] text-justify"
          >
            A new wave of entrepreneurs is redefining global enterprise, advanced computing, aerospace engineering, and sustainable biotechnology. Times Chicago spotlights the definitive top 20 emerging leaders, chronicling their corporate holdings, venture equity valuations in millions of dollars, and executive trajectory across worldwide markets. For in-depth founder profiles and corporate venture breakdowns, explore our featured entrepreneur profiles.
          </p>

          {/* See List Button */}
          <div className="flex justify-center mt-6 mb-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("richest-entrepreneurs-table");
                if (el) {
                  const yOffset = -90;
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

        {/* 900x370 Ad Slot */}
        <div className="flex flex-col items-center justify-center my-6 sm:my-8 w-full max-w-[900px] mx-auto px-4">
          <AdPlaceholder
            slotId="entrepreneurs_slot_1"
            width="w-full max-w-[900px]"
            height="h-[370px]"
            resolution="900 × 370"
          />
        </div>

        {/* ==================== THE RICHEST ENTREPRENEURS TABLE SECTION ==================== */}
        <section id="richest-entrepreneurs-table" className="pt-6 pb-10 border-t border-[#E2DDD0]">
          {/* Section Heading */}
          <div className="text-center mb-6">
            <h2 className="font-serif font-bold text-[30px] sm:text-[38px] md:text-[42px] leading-tight text-[#111111]">
              Upcoming Top 20 Entrepreneurs
            </h2>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-[#FCFBF8] border border-[#E5E0D5] p-4 sm:p-5 mb-6 rounded-none">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Search Box */}
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

              {/* Industry Filter */}
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

              {/* Country Filter & Gender Filters */}
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

                    {/* Popover Dropdown Menu for Gender Filter */}
                    {isFilterPanelOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#FCFBF9] border border-[#E5E0D5] rounded-xl p-4 shadow-xl z-30 animate-in fade-in duration-150">
                        <div className="absolute -top-2 right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#E5E0D5]" />
                        <div className="absolute -top-[7px] right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#FCFBF9]" />

                        <div className="mb-3">
                          <h4 className="font-sans font-extrabold text-[11px] uppercase tracking-wider text-[#333333]">
                            SELECT GENDER
                          </h4>
                        </div>

                        <div className="space-y-3 font-sans text-[14px] text-[#222222]">
                          <label className="flex items-center space-x-3 cursor-pointer ">
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

                          <label className="flex items-center space-x-3 cursor-pointer ">
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

                  {/* Clear Button */}
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

          {/* Table Area - Net Worth Column REMOVED per user requirement */}
          <div className="overflow-x-auto border border-[#E2DDD0]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#E2DDD0] text-[11px] font-sans font-bold text-[#444444] uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4 min-w-[200px]">Name</th>
                  <th className="py-3 px-4 w-20 text-center">Age</th>
                  <th className="py-3 px-4 min-w-[160px]">Country/Territory</th>
                  <th className="py-3 px-4 min-w-[200px]">Source</th>
                  <th className="py-3 px-4 min-w-[160px]">Industry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] bg-white text-[13px] font-sans text-[#111111]">
                {filteredEntrepreneurs.length > 0 ? (
                  filteredEntrepreneurs.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                      <React.Fragment key={item.id}>
                        {/* Main Entrepreneur Row */}
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

                        {/* Expanded Detail Drawer Row - Wealth History REMOVED per user requirement */}
                        {isExpanded && (
                          <tr className="bg-white">
                            <td colSpan={6} className="p-4 sm:p-6 border-t border-b border-[#E5E0D5]">
                              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 px-2 sm:px-4">
                                {/* Photo */}
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

                                {/* Bio Text & View Profile Button Only */}
                                <div className="flex flex-col justify-between space-y-4 text-center sm:text-left flex-1 min-w-0">
                                  <div>
                                    <p className="font-sans font-medium text-[14px] sm:text-[15px] leading-relaxed text-[#333333]">
                                      {item.bio || item.highlightText || `${item.name} is one of the world's leading emerging innovators in ${item.industry}.`}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-center sm:justify-start pt-1">
                                    <Link
                                      href={`${basePath}/${slugify(item.name)}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="bg-[#111111] hover:bg-[#333333] text-white font-sans font-bold text-[12px] px-6 py-2.5 rounded-lg shadow-2xs transition-colors whitespace-nowrap inline-block"
                                    >
                                      View Profile
                                    </Link>
                                  </div>
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
                    <td colSpan={6} className="py-8 text-center text-[#777777] font-sans text-sm">
                      No entrepreneurs match your filter criteria.
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
