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
import { PeopleToKnowSection } from "@/components/home/PeopleToKnowSection";
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
  const [activePodcastCount, setActivePodcastCount] = React.useState<number>(1);
  const isPodcastSticky = activePodcastCount < 3;

  return (
    <section className="w-full bg-white text-[#111111] pt-0 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-0 lg:mb-6 items-stretch border-b-0 lg:border-b border-dashed border-[#888070] pb-0 lg:pb-4">
        
        {/* Column 2 (Center 6 of 12 cols ~ 50%): A+ MAIN NEWS -> MAIN BOTTOM PANEL (ORDER-1 ON MOBILE, SHOWS FIRST) */}
        <div className="col-span-12 lg:col-span-6 px-0 lg:px-[0.3cm] py-2 lg:py-0 flex flex-col justify-start lg:justify-between border-b lg:border-b-0 lg:border-r border-dashed border-[#888070] order-1 lg:order-2 pb-6 lg:pb-0 mb-6 lg:mb-0">
          <APlusMainNewsSection />
          <div className="pt-[35px] mb-[35px] lg:pt-2 lg:mb-4 lg:pb-0 border-b border-dashed border-[#888070] mx-1" />
          <MainBottomPanelSection />
        </div>

        {/* Column 1 (Left 3 of 12 cols ~ 25%): TOP NEWS -> IN DEPTH PANEL (ORDER-2 ON MOBILE) */}
        <div className="col-span-12 lg:col-span-3 pr-0 lg:pr-[0.3cm] flex flex-col justify-start lg:justify-between border-b lg:border-b-0 lg:border-r border-dashed border-[#888070] order-2 lg:order-1 pb-6 lg:pb-0 mb-6 lg:mb-0">
          <TopNewsSection />
          <div className="pt-[24px] mb-[24px] lg:pt-2 lg:mb-4 lg:pb-0 border-b border-dashed border-[#888070] mx-1" />
          <InDepthPanelSection />
        </div>

        {/* Column 3 (Right 3 of 12 cols ~ 25%): OPINION -> RIGHT MAIN PANEL (ORDER-3 ON MOBILE) */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.3cm] pt-2 lg:pt-0 flex flex-col justify-start lg:justify-between h-full order-3 lg:order-3">
          <OpinionSection />
          <div className="pt-[24px] mb-[24px] lg:mb-4 lg:py-0 border-b border-dashed border-[#888070] mx-1" />
          <RightMainPanelSection />
        </div>

      </div>

      {/* Mobile-only single centered dashed divider below Right Main Panel before Business section */}
      <div className="hidden md:block lg:hidden pt-[24px] mb-[24px] border-b border-dashed border-[#CCCCCC]" />

      {/* ==================== ROW 3: BUSINESS CATEGORY SECTION ==================== */}
      <div className="pt-2 pb-4">
        <BusinessCategorySection />
      </div>

      {/* ==================== ROW 4: WORLD POLITICS CATEGORY SECTION (NO UPPER BORDER ON MOBILE) ==================== */}
      <div className="pt-2 border-t-0">
        <WorldPoliticsCategorySection />
      </div>

      {/* ==================== ROW 5: AD 02 BANNER SECTION ==================== */}
      <div className="pt-2 hidden lg:block">
        <Ad2Section />
      </div>
      <div className="hidden md:block lg:hidden pt-[20px] pb-[20px] border-b border-dashed border-[#CCCCCC]" />

      {/* ==================== ROW 6: EDITORS PICKS SECTION ==================== */}
      <div className="pt-2">
        <EditorsPicksSection />
      </div>

      {/* ==================== ROW 7 (UPPER STICKY REGION): PROMOTION, YOUR WEEKEND, AD 03 & PEOPLE TO KNOW TOP (LEFT 9 COLS) | STICKY EDITORIALS (RIGHT 3 COLS ~ 25%) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-2 items-stretch relative">
        {/* Main Content Area (9 of 12 cols): Ends right at dashed line under Trump's Executive Assistant */}
        <div className="col-span-12 lg:col-span-9 pr-0 lg:pr-[0.4cm] mb-0">
          <WSJPromotionSection />
          
          <div className="border-t-0 md:border-t border-dashed border-[#CCCCCC] mt-0 md:mt-[24px] lg:mt-4 pt-0 md:pt-[20px] lg:pt-4">
            <YourWeekendSection />
          </div>

          {/* Ad 03 inside main 9-col content area without top/bottom borders (Hidden on mobile) */}
          <div className="py-2 hidden lg:block">
            <Ad3Section />
          </div>
          <div className="hidden md:block lg:hidden pt-[20px] pb-[20px] border-b border-dashed border-[#CCCCCC]" />

          {/* People to Know Section (entire section in Row 7) */}
          <div className="pt-8 sm:pt-10 md:pt-2">
            <PeopleToKnowSection />
          </div>
        </div>

        {/* Right Sidebar Area (3 of 12 cols ~ 25%): Sticky Editorials STOPS right at top edge of Most Popular news section */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.4cm] relative h-full min-h-[100%] pt-[40px] lg:pt-0">
          <div className="sticky top-[90px] z-10 self-start w-full">
            <EditorialsSection />
          </div>
        </div>
      </div>

      {/* ==================== ROW 8 & 9 (MIDDLE & TECH REGION): POLITICS & TECH (LEFT 9 COLS) | MOST POPULAR, RECOMMENDED VIDEOS & AD 05 (RIGHT 3 COLS ~ 25%) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-[40px] lg:pt-4 items-stretch relative">
        {/* Left 9 Cols: Politics Category Section -> Sticky Tech Category Section */}
        <div className="col-span-12 lg:col-span-9 pr-0 lg:pr-[0.4cm] relative">
          {/* Vertical divider starting horizontally level with top edge of 'Politics' text */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] border-r border-dashed border-[#CCCCCC]" />

          <PoliticsCategorySection />

          <div className="sticky top-[90px] z-10 self-start w-full pt-4">
            <TechCategorySection />
          </div>
        </div>

        {/* Right 3 Cols: Most Popular News Section -> Recommended Videos Section -> Ad 05 Section */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.4cm] pt-8 sm:pt-10 lg:pt-0 flex flex-col justify-between">
          <div>
            <MostPopularNewsSection />
            <div className="mt-8 sm:mt-10 md:mt-[24px] pt-0 md:pt-[24px] border-t-0 md:border-t border-dashed border-[#CCCCCC]">
              <RecommendedVideosSection />
            </div>
          </div>

          {/* Ad 05 Section placed in right sidebar below Recommended Videos Section */}
          <div className="mt-auto pt-6">
            <Ad5Section />
          </div>
        </div>
      </div>

      {/* ==================== ROW 10: SPORT CATEGORY SECTION (EXTENDS ACROSS ALL 12 COLS - LEFT, CENTER, RIGHT SIDEBAR) ==================== */}
      <div className="pt-0 mt-0 lg:pt-4 lg:mt-4">
        <SportCategorySection />
      </div>

      {/* ==================== ROW 11: AD 06 BANNER SECTION ==================== */}
      <div className="pt-2 my-2 hidden lg:block">
        <Ad6Section />
      </div>

      {/* ==================== ROW 12: ENTERTAINMENT CATEGORY SECTION (NO UPPER BORDER) ==================== */}
      <div className="pt-[35px] lg:pt-2">
        <EntertainmentCategorySection />
      </div>

      {/* ==================== ROW 13: MAIN VIDEO & FASHION/SCIENCE/ARTS (LEFT 9 COLS) + AD 07 & PODCAST (RIGHT 3 COLS) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-2 items-stretch relative">
        {/* Left 9 Cols: Main Video Section -> Fashion, Science, Arts 3-col Section */}
        <div className="col-span-12 lg:col-span-9 pr-0 lg:pr-[0.4cm] relative">
          {/* Vertical divider starting at top edge of Homepage Ad 7 (~46px from top) */}
          <div className="hidden lg:block absolute right-0 top-[46px] bottom-0 w-[1px] border-r border-dashed border-[#CCCCCC]" />
          <MainVideoSection />

          <div className="pt-2">
            <FashionScienceArtsSection />
          </div>
        </div>

        {/* Right 3 Cols: Ad 07 -> Podcast Section (Sticky when active podcasts < 3, static when >= 3) */}
        <div className="col-span-12 lg:col-span-3 pl-0 lg:pl-[0.4cm] pt-[46px] relative h-full">
          <div className={isPodcastSticky ? "sticky top-[90px] z-10 self-start w-full" : "relative z-10 self-start w-full"}>
            <div className="flex justify-center lg:block"><Ad7Section /></div>
            <div className="mt-[48px] lg:mt-4">
              <PodcastSection onActiveCountChange={(count) => setActivePodcastCount(count)} />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ROW 14: LIFESTYLE CATEGORY SECTION (EXTENDS ACROSS ALL 12 COLS - NO UPPER BORDER) ==================== */}
      <div className="pt-[40px] lg:pt-2">
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
      <div className="pt-6 mt-8 mb-6 border-t-2 border-black">
        <MarketsFinanceCategorySection />
      </div>

      {/* ==================== ROW 18: 8-CATEGORY GRID SECTION (ECONOMY, HEALTH, INVESTING, CRYPTO / REAL ESTATE, INDUSTRIES, LAW, SMALL BIZ) ==================== */}
      <div className="pt-2">
        <EightCategoryGridSection />
      </div>
    </section>
  );
}
