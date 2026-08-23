"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { homepageArticles } from "@/data/articles";

export const HomeBottomGrid: React.FC = () => {
  const art = homepageArticles;
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <div className="w-full bg-white text-[#111111] font-sans pb-16 select-none">
      <Container>
        {/* ================================================================= */}
        {/* ROW 1: BUSINESS & FINANCE / REAL ESTATE / BUY SIDE (Screenshots 1-2) */}
        {/* ================================================================= */}
        <div className="pt-6 pb-8 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Column 1: Business & Finance (Span 5) */}
            <div className="md:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-[#e2e2e2] md:pr-6">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-black">
                  Business & Finance
                </h3>
                <a href="#" className="text-xs font-sans font-bold text-black hover:underline">
                  View All
                </a>
              </div>

              {/* Lead Article */}
              <div className="space-y-3">
                <Link href={`/article/${art["oil-analysts-stumped-missing-barrels"].slug}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src={art["oil-analysts-stumped-missing-barrels"].imageUrl}
                      alt={art["oil-analysts-stumped-missing-barrels"].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="text-[10px] font-bold font-sans text-gray-500 uppercase tracking-wider">
                  {art["oil-analysts-stumped-missing-barrels"].tag}
                </div>
                <Link href={`/article/${art["oil-analysts-stumped-missing-barrels"].slug}`}>
                  <h4 className="font-serif font-bold text-2xl text-black leading-tight hover:underline cursor-pointer">
                    {art["oil-analysts-stumped-missing-barrels"].title}
                  </h4>
                </Link>
                <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                  {art["oil-analysts-stumped-missing-barrels"].summary}
                </p>
                <div className="text-[11px] text-[#666666]">
                  💬 {art["oil-analysts-stumped-missing-barrels"].commentCount}
                </div>
              </div>

              <hr className="border-t border-[#e2e2e2] my-3" />

              {/* Sub Link */}
              <div className="pl-2 border-l-2 border-black">
                <span className="text-[12px] font-bold text-black hover:underline block leading-snug cursor-pointer">
                  • Heard on the Street | This Fashion IPO's Growth Story Looks Flimsy
                </span>
              </div>
            </div>

            {/* Column 2: Real Estate (Span 3.5) */}
            <div className="md:col-span-3 space-y-4 border-b md:border-b-0 md:border-r border-[#e2e2e2] md:pr-4">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-black">
                  Real Estate
                </h3>
                <a href="#" className="text-xs font-sans font-bold text-black hover:underline">
                  View All
                </a>
              </div>

              {/* Real Estate Lead */}
              <div className="space-y-2">
                <Link href={`/article/${art["washington-dc-billionaire-boomtown"].slug}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src={art["washington-dc-billionaire-boomtown"].imageUrl}
                      alt={art["washington-dc-billionaire-boomtown"].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-black leading-tight mt-2 hover:underline cursor-pointer">
                    {art["washington-dc-billionaire-boomtown"].title}
                  </h4>
                </Link>
                <p className="text-[12px] font-sans text-[#444444] leading-relaxed">
                  {art["washington-dc-billionaire-boomtown"].summary}
                </p>
                <div className="text-[11px] text-[#666666]">
                  💬 {art["washington-dc-billionaire-boomtown"].commentCount}
                </div>
              </div>

              <hr className="border-t border-[#e2e2e2]" />

              {/* Sub Item */}
              <div className="space-y-1">
                <span className="inline-block border border-black px-1.5 py-0.5 text-[9px] font-bold font-sans uppercase tracking-wider text-black">
                  EXCLUSIVE
                </span>
                <Link href={`/article/${art["howard-schultz-starbucks-hawaii-home"].slug}`}>
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    {art["howard-schultz-starbucks-hawaii-home"].title}
                  </h5>
                </Link>
                <p className="text-[11.5px] font-sans text-[#444444] leading-relaxed">
                  {art["howard-schultz-starbucks-hawaii-home"].summary}
                </p>
              </div>
            </div>

            {/* Column 3: Buy Side & Most Popular Opinion (Span 3.5) */}
            <div className="md:col-span-4 space-y-3">
              {/* WSJ Buy Side Header Box */}
              <div className="border border-[#c5d8e2] bg-[#f5f9fb] p-2.5 rounded-xs space-y-2">
                <div className="text-sm font-serif font-black text-[#1e4d58]">
                  WSJ | Buy Side
                </div>
                <p className="text-[10.5px] text-gray-500 font-sans leading-tight">
                  Reviews and recommendations, independent of The Wall Street Journal newsroom.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="border-t border-[#d8e5ec] pt-2">
                    <span className="text-[9.5px] font-bold font-sans uppercase text-[#1e4d58] block">
                      STUDENT LOANS
                    </span>
                    <a href="#" className="font-bold text-black hover:underline block">
                      Best Law School Loans
                    </a>
                  </div>
                  <div className="border-t border-[#d8e5ec] pt-2">
                    <span className="text-[9.5px] font-bold font-sans uppercase text-[#1e4d58] block">
                      COFFEE
                    </span>
                    <a href="#" className="font-bold text-black hover:underline block">
                      We Tested Cold-Brew Coffee Makers—Here Are Our 3 Favorites
                    </a>
                  </div>
                  <div className="border-t border-[#d8e5ec] pt-2">
                    <span className="text-[9.5px] font-bold font-sans uppercase text-[#1e4d58] block">
                      CLOTHING
                    </span>
                    <a href="#" className="font-bold text-black hover:underline block">
                      The Best Golf Shirts, According to Instructors and Pros
                    </a>
                  </div>
                </div>
              </div>

              {/* Most Popular Opinion Stack */}
              <div className="space-y-3">
                <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-black">
                    Most Popular
                  </h4>
                  <span className="bg-[#883300] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                    OPINION
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-2">
                    <span className="font-serif font-bold text-black leading-snug">
                      The March of the El-Sayed Democrats
                    </span>
                    <div className="w-10 h-10 bg-gray-300 rounded shrink-0" />
                  </div>
                  <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-2">
                    <span className="font-serif font-bold text-black leading-snug">
                      El-Sayed's Deflected Bigotry
                    </span>
                    <div className="w-10 h-10 bg-gray-300 rounded shrink-0" />
                  </div>
                  <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-2">
                    <span className="font-serif font-bold text-black leading-snug">
                      Socialism Is Here—and It's Serious
                    </span>
                    <div className="w-10 h-10 bg-gray-300 rounded shrink-0" />
                  </div>
                  <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-2">
                    <span className="font-serif font-bold text-black leading-snug">
                      Colorado Progressives Hike the Tax Slope
                    </span>
                    <div className="w-10 h-10 bg-gray-300 rounded shrink-0" />
                  </div>
                  <div className="flex justify-between items-start space-x-2">
                    <span className="font-serif font-bold text-black leading-snug">
                      Trump Fixes a Biden Medicare Trick
                    </span>
                    <div className="w-10 h-10 bg-gray-300 rounded shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 2: PEOPLE TO KNOW / AT THE MOVIES / RECOMMENDED VIDEOS (Screenshots 2-3) */}
        {/* ================================================================= */}
        <div className="py-3 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Column 1: People to Know (Span 5) */}
            <div className="md:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-[#e2e2e2] md:pr-6">
              <div className="border-t-2 border-black pt-2">
                <h3 className="font-serif font-bold text-xl text-black">
                  People to Know
                </h3>
              </div>

              <div className="space-y-3">
                <Link href={`/article/${art["ariana-grande-step-back-tour"].slug}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src={art["ariana-grande-step-back-tour"].imageUrl}
                      alt={art["ariana-grande-step-back-tour"].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-2xl text-black leading-tight mt-2 hover:underline cursor-pointer">
                    {art["ariana-grande-step-back-tour"].title}
                  </h4>
                </Link>
                <p className="text-[12.5px] font-sans text-[#444444] leading-relaxed">
                  {art["ariana-grande-step-back-tour"].summary}
                </p>
              </div>

              <hr className="border-t border-[#e2e2e2] my-3" />

              <div className="pl-2 border-l-2 border-black">
                <span className="text-[12px] font-bold text-black hover:underline block leading-snug cursor-pointer">
                  • Black Professor's Resignation Over Plagiarism Probe Puts Cambridge in Spotlight
                </span>
              </div>
            </div>

            {/* Column 2: At the Movies (Span 3.5) */}
            <div className="md:col-span-3 space-y-4 border-b md:border-b-0 md:border-r border-[#e2e2e2] md:pr-4">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-black">
                  At the Movies
                </h3>
                <a href="#" className="text-xs font-sans font-bold text-black hover:underline">
                  View All
                </a>
              </div>

              {/* Movie 1 */}
              <div className="space-y-2">
                <Link href={`/article/${art["tony-anthony-bourdain-education-food-life"].slug}`}>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                    <img
                      src={art["tony-anthony-bourdain-education-food-life"].imageUrl}
                      alt={art["tony-anthony-bourdain-education-food-life"].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="text-[10px] font-bold font-sans text-gray-500 uppercase tracking-wider">
                  {art["tony-anthony-bourdain-education-food-life"].tag}
                </div>
                <Link href={`/article/${art["tony-anthony-bourdain-education-food-life"].slug}`}>
                  <h4 className="font-serif font-bold text-lg text-black leading-tight hover:underline cursor-pointer">
                    {art["tony-anthony-bourdain-education-food-life"].title}
                  </h4>
                </Link>
                <p className="text-[12px] font-sans text-[#444444] leading-relaxed">
                  {art["tony-anthony-bourdain-education-food-life"].summary}
                </p>
                <div className="text-[11px] text-[#666666]">
                  💬 {art["tony-anthony-bourdain-education-food-life"].commentCount}
                </div>
              </div>

              <hr className="border-t border-[#e2e2e2]" />

              {/* Movie 2 */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold font-sans text-gray-500 uppercase tracking-wider">
                  {art["teenage-sex-death-camp-miasma"].tag}
                </div>
                <Link href={`/article/${art["teenage-sex-death-camp-miasma"].slug}`}>
                  <h5 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                    {art["teenage-sex-death-camp-miasma"].title}
                  </h5>
                </Link>
                <p className="text-[11.5px] font-sans text-[#444444] leading-relaxed">
                  {art["teenage-sex-death-camp-miasma"].summary}
                </p>
              </div>
            </div>

            {/* Column 3: Recommended Videos (Span 4, Screenshot 3) */}
            <div className="md:col-span-4 space-y-4">
              <div className="border-t-2 border-black pt-1">
                <h3 className="font-serif font-bold text-xl text-black">
                  Recommended Videos
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-3">
                  <h5 className="font-serif font-bold text-black leading-tight hover:underline cursor-pointer">
                    How FIFA's $20 Billion Private-Equity Plan Nearly Broke Soccer
                  </h5>
                  <div className="w-12 h-10 bg-blue-900 rounded shrink-0 flex items-center justify-center text-white text-xs">
                    ▶
                  </div>
                </div>
                <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-3">
                  <h5 className="font-serif font-bold text-black leading-tight hover:underline cursor-pointer">
                    Inside the Pacific Wargames Watched by America's Adversaries
                  </h5>
                  <div className="w-12 h-10 bg-gray-800 rounded shrink-0 flex items-center justify-center text-white text-xs">
                    ▶
                  </div>
                </div>
                <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-3">
                  <h5 className="font-serif font-bold text-black leading-tight hover:underline cursor-pointer">
                    Pizza Hut Lost in the U.S. Now It's Selling for $2.7B.
                  </h5>
                  <div className="w-12 h-10 bg-red-800 rounded shrink-0 flex items-center justify-center text-white text-xs">
                    ▶
                  </div>
                </div>
                <div className="flex justify-between items-start space-x-2 border-b border-[#e2e2e2] pb-3">
                  <h5 className="font-serif font-bold text-black leading-tight hover:underline cursor-pointer">
                    Can Hamas Really Be Disarmed? Inside the Gaza Peace Deal
                  </h5>
                  <div className="w-12 h-10 bg-emerald-800 rounded shrink-0 flex items-center justify-center text-white text-xs">
                    ▶
                  </div>
                </div>
                <div className="flex justify-between items-start space-x-2">
                  <h5 className="font-serif font-bold text-black leading-tight hover:underline cursor-pointer">
                    The Deadly Drone War Terrorizing Colombia
                  </h5>
                  <div className="w-12 h-10 bg-teal-800 rounded shrink-0 flex items-center justify-center text-white text-xs">
                    ▶
                  </div>
                </div>
              </div>

              {/* Grey Advertisement Box Below Recommended Videos */}
              <AdPlaceholder width="w-full" height="h-[160px]" resolution="300 × 160" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 3: BUY SIDE HORIZON & JOURNAL REPORTS (Screenshot 4)          */}
        {/* ================================================================= */}
        <div className="pt-3 pb-2 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* WSJ Buy Side 3 Cards Grid (Span 8 - Enlarged Font Sizes) */}
            <div className="md:col-span-8 space-y-4">
              <div className="border-t-2 border-[#1e4d58] pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-2xl text-[#1e4d58]">
                    WSJ Buy Side
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 font-sans">
                    Reviews and recommendations, independent of WSJ newsroom.
                  </span>
                </div>
                <a href="#" className="text-xs sm:text-sm font-sans font-bold text-[#1e4d58] hover:underline">
                  View All &gt;
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
                {/* Card 1 */}
                <div className="space-y-2 border-r border-[#e2e2e2] pr-4">
                  <span className="text-[10px] font-bold font-sans uppercase text-[#1e4d58]">
                    {art["hate-linen-sheets-tried-quince"]?.tag || "BEDROOM"}
                  </span>
                  <Link href={`/article/${art["hate-linen-sheets-tried-quince"]?.slug || "hate-linen-sheets-tried-quince"}`}>
                    <h4 className="font-serif font-bold text-base text-black leading-snug hover:underline cursor-pointer">
                      {art["hate-linen-sheets-tried-quince"]?.title || "I Used to Hate Linen Sheets, Until I Tried This Set From Quince"}
                    </h4>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {art["hate-linen-sheets-tried-quince"]?.summary || "These sheets are soft, breathable and available in nearly 40 colors."}
                  </p>
                </div>

                {/* Card 2 */}
                <div className="space-y-2 border-r border-[#e2e2e2] pr-4">
                  <span className="text-[10px] font-bold font-sans uppercase text-[#1e4d58]">
                    {art["best-wealth-management-firms-fiduciary"]?.tag || "FINANCIAL ADVISORS"}
                  </span>
                  <Link href={`/article/${art["best-wealth-management-firms-fiduciary"]?.slug || "best-wealth-management-firms-fiduciary"}`}>
                    <h4 className="font-serif font-bold text-base text-black leading-snug hover:underline cursor-pointer">
                      {art["best-wealth-management-firms-fiduciary"]?.title || "10 of the Best Wealth Management Firms: Well-Known Fiduciary Investment Companies"}
                    </h4>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {art["best-wealth-management-firms-fiduciary"]?.summary || "We analyzed everything from advisor credentials to portfolio options and fees."}
                  </p>
                </div>

                {/* Card 3 */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold font-sans uppercase text-[#1e4d58]">
                    {art["whiskey-advent-calendar-sale-early"]?.tag || "GIFT GUIDES"}
                  </span>
                  <Link href={`/article/${art["whiskey-advent-calendar-sale-early"]?.slug || "whiskey-advent-calendar-sale-early"}`}>
                    <h4 className="font-serif font-bold text-base text-black leading-snug hover:underline cursor-pointer">
                      {art["whiskey-advent-calendar-sale-early"]?.title || "Deal of the Day: This Buy Side-Favorite Whiskey Advent Calendar Is on Sale Early"}
                    </h4>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {art["whiskey-advent-calendar-sale-early"]?.summary || "Save $35 on our top-selling advent calendar."}
                  </p>
                </div>
              </div>

              {/* Grey Advertisement Bar Below WSJ Buy Side */}
              <AdPlaceholder width="w-full" height="h-[120px]" resolution="728 × 120" />
            </div>

            {/* Journal Reports Sidebar (Span 4 - Enlarged Font Sizes) */}
            <div className="md:col-span-4 space-y-4">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-2xl text-black">
                  Journal Reports
                </h3>
                <a href="#" className="text-xs sm:text-sm font-sans font-bold text-black hover:underline">
                  View All
                </a>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="w-full aspect-[21/9] bg-sky-200 rounded-xs flex items-center justify-center p-2">
                  <span className="text-4xl">🎪</span>
                </div>
                <Link href={`/article/${art["seven-people-changed-american-entertainment"]?.slug || "seven-people-changed-american-entertainment"}`}>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-black leading-snug hover:underline cursor-pointer">
                    {art["seven-people-changed-american-entertainment"]?.title || "Seven People Who Changed the Course of American Entertainment"}
                  </h4>
                </Link>
                <p className="text-xs sm:text-sm font-sans text-[#444444] leading-relaxed">
                  {art["seven-people-changed-american-entertainment"]?.summary || "From P.T. Barnum to Walt Disney, these pioneers reimagined how the public wanted to be entertained."}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-black pt-2 border-t border-[#e2e2e2]">
                  <a href="#" className="hover:underline block">• How Theme Parks Turned Nostalgia Into Historical Landmarks</a>
                  <a href="#" className="hover:underline block">• These 10 Books Changed the Way Americans Thought About Work</a>
                </div>

                <div className="pt-2 text-xs sm:text-sm space-y-1.5 border-t border-[#e2e2e2]">
                  <a href="#" className="font-bold text-black hover:underline block">20 Songs That Defined America</a>
                  <a href="#" className="font-bold text-black hover:underline block">Where to Find America’s Movie-Magic Places</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ROW 4: VIDEOS MAIN PLAYER SHOWCASE (Screenshots 4-5)              */}
        {/* ================================================================= */}
        <div className="pt-2 pb-6 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Videos Main Showcase Column (Span 8) */}
            <div className="md:col-span-8 space-y-4">
              <div className="border-t-2 border-black pt-2 flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-black">
                  Videos
                </h3>
                <a href="#" className="text-xs font-sans font-bold text-black hover:underline">
                  View All
                </a>
              </div>

              {/* Main Player Display */}
              <div className="w-full aspect-[16/9] bg-slate-900 rounded-xs overflow-hidden relative flex items-center justify-center">
                {/* Background image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                <div className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer flex items-center space-x-1">
                  <span>🔊</span>
                  <span>Click for Sound</span>
                </div>
                <div className="absolute top-4 right-4 z-10 font-serif font-black text-white text-xl">
                  WSJ
                </div>

                {/* Captions Text */}
                <div className="absolute bottom-6 left-6 right-6 text-center z-10">
                  <span className="bg-black/80 text-white font-sans text-xs sm:text-sm px-3 py-1.5 rounded inline-block">
                    have heightened tensions across the Pacific.
                  </span>
                </div>
              </div>

              {/* 3 Video Thumbnails Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5 cursor-pointer">
                  <div className="w-full aspect-[16/9] bg-slate-800 rounded-xs flex items-center justify-center text-white relative">
                    <span className="absolute bottom-1 left-1 bg-black/80 text-[10px] px-1 rounded">▶ 10:22</span>
                  </div>
                  <h5 className="font-serif font-bold text-xs text-[#007cba] leading-tight hover:underline">
                    Inside the Pacific Wargames Watched by America's Adversaries
                  </h5>
                </div>

                <div className="space-y-1.5 cursor-pointer">
                  <div className="w-full aspect-[16/9] bg-emerald-900 rounded-xs flex items-center justify-center text-white relative">
                    <span className="absolute bottom-1 left-1 bg-black/80 text-[10px] px-1 rounded">▶ 4:13</span>
                  </div>
                  <h5 className="font-serif font-bold text-xs text-black leading-tight hover:underline">
                    Can Hamas Really Be Disarmed? Inside the Gaza Peace Deal
                  </h5>
                </div>

                <div className="space-y-1.5 cursor-pointer">
                  <div className="w-full aspect-[16/9] bg-purple-900 rounded-xs flex items-center justify-center text-white relative">
                    <span className="absolute bottom-1 left-1 bg-black/80 text-[10px] px-1 rounded">▶ 6:22</span>
                  </div>
                  <h5 className="font-serif font-bold text-xs text-black leading-tight hover:underline">
                    How Democratic Socialists Are Shaking Up the Midterms
                  </h5>
                </div>
              </div>
            </div>

            {/* Right Sidebar Ad Placeholder (Span 4) */}
            <div className="md:col-span-4 space-y-4">
              <AdPlaceholder width="w-full" height="h-[600px]" resolution="300 × 600" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeBottomGrid;
