"use client";

import React from "react";
import TopNewsSection from "@/components/home/TopNewsSection";
import APlusMainNewsSection from "@/components/home/APlusMainNewsSection";
import OpinionSection from "@/components/home/OpinionSection";
import RightMainPanelSection from "@/components/home/RightMainPanelSection";
import InDepthPanelSection from "@/components/home/InDepthPanelSection";
import MainBottomPanelSection from "@/components/home/MainBottomPanelSection";
import BusinessCategorySection from "@/components/home/BusinessCategorySection";
import WorldPoliticsCategorySection from "@/components/home/WorldPoliticsCategorySection";
import Ad2Section from "@/components/ui/Ad2Section";
import EditorsPicksSection from "@/components/home/EditorsPicksSection";
import EditorialsSection from "@/components/home/EditorialsSection";
import WSJPromotionSection from "@/components/home/WSJPromotionSection";
import YourWeekendSection from "@/components/home/YourWeekendSection";
import Ad3Section from "@/components/ui/Ad3Section";
import { PeopleToKnowTop, PeopleToKnowBottom } from "@/components/home/PeopleToKnowSection";
import PoliticsCategorySection from "@/components/home/PoliticsCategorySection";
import TechCategorySection from "@/components/home/TechCategorySection";
import MostPopularNewsSection from "@/components/home/MostPopularNewsSection";
import RecommendedVideosSection from "@/components/home/RecommendedVideosSection";
import Ad5Section from "@/components/ui/Ad5Section";
import SportCategorySection from "@/components/home/SportCategorySection";
import Ad6Section from "@/components/ui/Ad6Section";
import EntertainmentCategorySection from "@/components/home/EntertainmentCategorySection";
import MainVideoSection from "@/components/home/MainVideoSection";
import Ad7Section from "@/components/ui/Ad7Section";
import PodcastSection from "@/components/home/PodcastSection";
import FashionScienceArtsSection from "@/components/home/FashionScienceArtsSection";
import LifestyleCategorySection from "@/components/home/LifestyleCategorySection";
import APlusSection2 from "@/components/home/APlusSection2";
import CeoExecsCategorySection from "@/components/home/CeoExecsCategorySection";
import MarketsFinanceCategorySection from "@/components/home/MarketsFinanceCategorySection";
import EightCategoryGridSection from "@/components/home/EightCategoryGridSection";

export default function NewHomeSection1() {
  return (
    <section className="w-full bg-white text-[#111111] pt-0 pb-6 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0 mb-6">
        
        {/* ==================== LEFT & CENTER COMBINED (9 of 12 cols ~ 75%) ==================== */}
        <div className="col-span-12 lg:col-span-9">
          {/* Row 1 (Left & Center): TOP NEWS | A+ MAIN NEWS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-0 pb-4 mb-4 border-b border-dashed border-[#888070]">
            {/* Column 1 (Left): TOP NEWS SECTION (3 of 9 cols ~ 33%) */}
            <div className="md:col-span-1 lg:col-span-3 pr-0 md:pr-[0.3cm] flex flex-col justify-between border-r border-dashed border-[#888070]">
              <TopNewsSection />
            </div>

            {/* Column 2 (Center): A+ MAIN NEWS SECTION (6 of 9 cols ~ 67%) */}
            <div className="md:col-span-1 lg:col-span-6 px-0 md:px-[0.3cm] py-6 lg:py-0 flex flex-col justify-between border-r border-dashed border-[#888070]">
              <APlusMainNewsSection />
            </div>
          </div>

          {/* Row 2 (Left & Center): IN DEPTH PANEL | MAIN BOTTOM PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-0 pb-4 border-b border-dashed border-[#888070]">
            {/* Column 1 (Left): IN DEPTH PANEL SECTION (3 of 9 cols ~ 33%) */}
            <div className="md:col-span-1 lg:col-span-3 pr-0 md:pr-[0.3cm] flex flex-col justify-between border-r border-dashed border-[#888070]">
              <InDepthPanelSection />
            </div>

            {/* Column 2 (Center): MAIN BOTTOM PANEL SECTION (6 of 9 cols ~ 67%) */}
            <div className="md:col-span-1 lg:col-span-6 px-0 md:px-[0.3cm] py-6 lg:py-0 flex flex-col justify-between border-r border-dashed border-[#888070]">
              <MainBottomPanelSection />
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN (3 of 12 cols ~ 25%): OPINION -> DIVIDER -> RIGHT MAIN PANEL ==================== */}
        <div className="col-span-12 lg:col-span-3 pl-0 md:pl-[0.3cm] pt-6 lg:pt-0 flex flex-col justify-between">
          {/* Opinion Section */}
          <div className="pb-3 border-b border-dashed border-[#888070]">
            <OpinionSection />
          </div>

          {/* Right Main Panel Section */}
          <div className="pt-3 pb-4 border-b border-dashed border-[#888070]">
            <RightMainPanelSection />
          </div>
        </div>

      </div>

      {/* ==================== ROW 3: BUSINESS CATEGORY SECTION ==================== */}
      <div className="pt-2 pb-4">
        <BusinessCategorySection />
      </div>

      {/* ==================== ROW 4: WORLD POLITICS CATEGORY SECTION ==================== */}
      <div className="pt-2">
        <WorldPoliticsCategorySection />
      </div>

      {/* ==================== ROW 5: AD 02 BANNER SECTION ==================== */}
      <div className="pt-2">
        <Ad2Section />
      </div>

      {/* ==================== ROW 6: EDITORS PICKS SECTION ==================== */}
      <div className="pt-2">
        <EditorsPicksSection />
      </div>

      {/* ==================== ROW 7 (UPPER STICKY REGION): PROMOTION, YOUR WEEKEND, AD 03 & PEOPLE TO KNOW TOP (LEFT 9 COLS) | STICKY EDITORIALS (RIGHT 3 COLS ~ 25%) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-2 items-start relative">
        {/* Main Content Area (9 of 12 cols): Ends right at dashed line under Trump's Executive Assistant */}
        <div className="col-span-12 lg:col-span-9 pr-0 lg:pr-[0.4cm] mb-0">
          <WSJPromotionSection />
          
          <div className="pt-4 border-t border-dashed border-[#CCCCCC] mt-4">
            <YourWeekendSection />
          </div>

          {/* Ad 03 inside main 9-col content area without top/bottom borders */}
          <div className="py-2">
            <Ad3Section />
          </div>

          {/* People to Know Top Part (ends at dashed line under How Trump's...) */}
          <div className="pt-2">
            <PeopleToKnowTop />
          </div>
        </div>

        {/* Right Sidebar Area (3 of 12 cols ~ 25%): Sticky Editorials STOPS right at that dashed line */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.4cm] relative h-full min-h-[100%]">
          <div className="sticky top-6 z-10 self-start w-full">
            <EditorialsSection />
          </div>
        </div>
      </div>

      {/* ==================== ROW 8 (MIDDLE REGION): PEOPLE TO KNOW BOTTOM & POLITICS (LEFT 9 COLS) | MOST POPULAR NEWS (RIGHT 3 COLS ~ 25%) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-0 items-start">
        {/* Left 9 Cols: People to Know Bottom -> Politics Category Section */}
        <div className="col-span-12 lg:col-span-9 pr-0 lg:pr-[0.4cm]">
          <PeopleToKnowBottom />

          <div className="pt-2">
            <PoliticsCategorySection />
          </div>
        </div>

        {/* Right 3 Cols: Most Popular News Section */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.4cm]">
          <MostPopularNewsSection />
        </div>
      </div>

      {/* ==================== ROW 9 (TECH & RECOMMENDED VIDEOS REGION): TECH (LEFT 9 COLS) | RECOMMENDED VIDEOS & AD 05 (RIGHT 3 COLS ~ 25%) WITH SOLID VERTICAL DIVIDER ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-2 items-stretch relative">
        {/* Left 9 Cols: Tech Category Section (with solid non-dashed right border line, sticky until bottom of Ad 05) */}
        <div className="col-span-12 lg:col-span-9 pr-0 lg:pr-[0.4cm] border-r border-solid border-[#CCCCCC] relative">
          <div className="sticky top-6 z-10 self-start w-full">
            <TechCategorySection />
          </div>
        </div>

        {/* Right 3 Cols: Recommended Videos Section -> Ad 05 Section */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.4cm] flex flex-col justify-between">
          <RecommendedVideosSection />

          {/* Ad 05 Section placed in right sidebar below Recommended Videos Section */}
          <div className="mt-auto pt-6 lg:pt-[3cm]">
            <Ad5Section />
          </div>
        </div>
      </div>

      {/* ==================== ROW 10: SPORT CATEGORY SECTION (EXTENDS ACROSS ALL 12 COLS - LEFT, CENTER, RIGHT SIDEBAR) ==================== */}
      <div className="pt-4 mt-4">
        <SportCategorySection />
      </div>

      {/* ==================== ROW 11: AD 06 BANNER SECTION ==================== */}
      <div className="pt-2 my-2">
        <Ad6Section />
      </div>

      {/* ==================== ROW 12: ENTERTAINMENT CATEGORY SECTION (NO UPPER BORDER) ==================== */}
      <div className="pt-2">
        <EntertainmentCategorySection />
      </div>

      {/* ==================== ROW 13: MAIN VIDEO & FASHION/SCIENCE/ARTS (LEFT 9 COLS) + AD 07 & PODCAST (RIGHT 3 COLS) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-2 items-start">
        {/* Left 9 Cols: Main Video Section -> Fashion, Science, Arts 3-col Section */}
        <div className="col-span-12 lg:col-span-9 pr-0 lg:pr-[0.4cm] border-r border-solid border-[#CCCCCC]">
          <MainVideoSection />

          <div className="pt-2">
            <FashionScienceArtsSection />
          </div>
        </div>

        {/* Right 3 Cols: Ad 07 -> Podcast Section */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.4cm] flex flex-col justify-start">
          <Ad7Section />
          <div className="mt-4">
            <PodcastSection />
          </div>
        </div>
      </div>

      {/* ==================== ROW 14: LIFESTYLE CATEGORY SECTION (EXTENDS ACROSS ALL 12 COLS - NO UPPER BORDER) ==================== */}
      <div className="pt-2">
        <LifestyleCategorySection />
      </div>

      {/* ==================== ROW 15: A+ SECTION 2 ==================== */}
      <div className="pt-2">
        <APlusSection2 />
      </div>

      {/* ==================== ROW 16: CEOS & EXECUTIVES CATEGORY SECTION (NO UPPER BORDER) ==================== */}
      <div className="pt-2">
        <CeoExecsCategorySection />
      </div>

      {/* ==================== ROW 17: MARKETS & FINANCE CATEGORY SECTION (BLACK UPPER DIVIDER) ==================== */}
      <div className="pt-4 mt-4 border-t-2 border-black">
        <MarketsFinanceCategorySection />
      </div>

      {/* ==================== ROW 18: 8-CATEGORY GRID SECTION (ECONOMY, HEALTH, INVESTING, CRYPTO / REAL ESTATE, INDUSTRIES, LAW, SMALL BIZ) ==================== */}
      <div className="pt-2">
        <EightCategoryGridSection />
      </div>
    </section>
  );
}
