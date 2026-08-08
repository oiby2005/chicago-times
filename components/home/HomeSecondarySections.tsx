"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { homepageArticles } from "@/data/articles";

export const HomeSecondarySections: React.FC = () => {
  const art = homepageArticles;
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full bg-white text-[#111111] font-sans pb-12 select-none">
      <Container>
        {/* ================================================================= */}
        {/* SECTION 1: PODCASTS & MARKETVIEWS SIDEBAR (Screenshot 1)         */}
        {/* ================================================================= */}
        <div className="pt-6 pb-8 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Main Podcast Column (Span 8) */}
            <div className="md:col-span-8 space-y-6">
              {/* Header Row */}
              <div className="flex items-center justify-between border-t-2 border-black pt-1 mb-2">
                <h3 className="font-serif font-bold text-xl text-black">
                  Podcasts
                </h3>
                <a
                  href="#"
                  className="text-xs font-sans font-bold text-black hover:underline"
                >
                  View All
                </a>
              </div>

              {/* Main Audio Player Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 bg-[#f9f9f9] p-4 border border-[#e2e2e2] rounded-xs">
                {/* Podcast Thumbnail Cover */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative bg-[#0d1b3e] rounded-xs overflow-hidden flex items-center justify-center p-2 text-white text-center">
                  <div className="space-y-1">
                    <div className="text-[10px] font-sans font-bold uppercase text-red-400 tracking-wider">
                      Tech News
                    </div>
                    <div className="text-[11px] font-sans font-extrabold leading-tight">
                      Briefing
                    </div>
                    <div className="text-[12px] font-serif font-black tracking-widest text-white border-t border-gray-600 pt-0.5 mt-0.5">
                      WSJ
                    </div>
                  </div>
                </div>

                {/* Podcast Details & Audio Player Controls */}
                <div className="flex-1 space-y-2.5">
                  <Link href={`/article/${art["can-ai-find-next-summer-romance"].slug}`}>
                    <h4 className="font-serif font-bold text-lg sm:text-xl text-black leading-tight hover:underline cursor-pointer">
                      {art["can-ai-find-next-summer-romance"].title}
                    </h4>
                  </Link>
                  <p className="text-[12px] font-sans text-[#444444] leading-relaxed">
                    {art["can-ai-find-next-summer-romance"].summary}{" "}
                    <a href="#" className="underline font-medium text-black">
                      Read Transcript
                    </a>
                  </p>

                  {/* Audio Controls Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#555555]">
                    {/* Play/Pause Button */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center text-xs transition-colors"
                      aria-label="Play podcast"
                    >
                      {isPlaying ? "❚❚" : "▶"}
                    </button>

                    {/* Timeline Bar */}
                    <div className="flex-1 min-w-[120px] flex items-center space-x-2">
                      <div className="w-full h-1 bg-gray-300 rounded-full relative cursor-pointer">
                        <div className="w-1/4 h-full bg-[#007cba] rounded-full relative">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#007cba] absolute -right-1 -top-0.75" />
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-gray-500 whitespace-nowrap">
                        00:00 / 12:15
                      </span>
                    </div>

                    {/* Speed Selector */}
                    <div className="border border-[#cccccc] px-1.5 py-0.5 rounded text-[10px] font-bold">
                      1x
                    </div>

                    {/* Volume Icon */}
                    <span className="text-sm cursor-pointer">🔊</span>

                    {/* Subscribe Dropdown */}
                    <button className="border border-[#cccccc] px-2.5 py-1 rounded text-[11px] font-bold text-black flex items-center space-x-1 hover:bg-gray-100">
                      <span>Subscribe</span>
                      <span className="text-[9px]">▼</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider Line Below Podcasts Audio Player (Solid Black) */}
              <div className="w-full h-px bg-black my-6" />

              {/* 3-Grid Below Podcasts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Amazon Data Center */}
                <div className="space-y-2">
                  <Link href={`/article/${art["how-amazon-built-data-center-california"].slug}`}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                      <img
                        src={art["how-amazon-built-data-center-california"].imageUrl}
                        alt={art["how-amazon-built-data-center-california"].title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-serif font-bold text-base text-black leading-tight mt-2 hover:underline cursor-pointer">
                      {art["how-amazon-built-data-center-california"].title}
                    </h4>
                  </Link>
                  <div className="text-[11px] text-[#666666]">
                    💬 {art["how-amazon-built-data-center-california"].commentCount}
                  </div>
                </div>

                {/* Winemakers 30,000 Feet */}
                <div className="space-y-2">
                  <Link href={`/article/${art["most-fertile-land-winemakers-30000-feet"].slug}`}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                      <img
                        src={art["most-fertile-land-winemakers-30000-feet"].imageUrl}
                        alt={art["most-fertile-land-winemakers-30000-feet"].title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-serif font-bold text-base text-black leading-tight mt-2 hover:underline cursor-pointer">
                      {art["most-fertile-land-winemakers-30000-feet"].title}
                    </h4>
                  </Link>
                  <div className="text-[11px] text-[#666666]">
                    💬 {art["most-fertile-land-winemakers-30000-feet"].commentCount}
                  </div>
                </div>

                {/* Trump Account Tax Report */}
                <div className="space-y-2">
                  <div className="w-full aspect-[4/3] bg-[#00a896] rounded-xs flex items-center justify-center p-4 text-white text-center">
                    <div className="space-y-1">
                      <span className="text-3xl">🎰</span>
                      <div className="text-xs font-bold font-sans uppercase tracking-wider text-yellow-200">
                        TAX REPORT
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold font-sans text-gray-500 uppercase tracking-wider">
                    {art["pros-cons-putting-extra-dollars-trump-account"].tag}
                  </div>
                  <Link href={`/article/${art["pros-cons-putting-extra-dollars-trump-account"].slug}`}>
                    <h4 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                      {art["pros-cons-putting-extra-dollars-trump-account"].title}
                    </h4>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar Column (Span 4) */}
            <div className="md:col-span-4 space-y-5">
              {/* MarketViews Sponsored Cards Stack */}
              <div className="bg-[#122b40] text-white p-4 space-y-4 rounded-xs">
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  What is the latest on ETFs? <br />
                  <span className="text-gray-400 font-serif italic text-[11px]">
                    MarketViews
                  </span>
                </div>
                <div className="text-xs font-bold tracking-tight border-b border-gray-600 pb-2">
                  Find expert news and trends in the world of commodities. <br />
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

              {/* Tip Submission Box (Matching Screenshot 2 Exactly) */}
              <div className="border border-black bg-white p-4 flex items-center space-x-3 rounded-xs shadow-2xs">
                <div className="text-2xl text-black">✉</div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-sm text-black leading-tight">
                    Got a tip for us?
                  </h5>
                  <a
                    href="#"
                    className="text-xs font-bold text-black hover:underline block leading-tight"
                  >
                    Here’s how to submit
                  </a>
                </div>
              </div>

              {/* Grey Advertisement Box Filling Remaining Sidebar Space */}
              <div className="w-full bg-[#f4f4f4] border border-[#d4d4d4] rounded-xs p-6 text-center text-gray-500 font-sans font-bold text-xs uppercase tracking-wider h-[180px] flex items-center justify-center">
                ADVERTISEMENT
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 2: SPECIAL OFFER PROMO & WSJ OPINION (Screenshot 2)       */}
        {/* ================================================================= */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Special Offer Banner Box (Span 8 with scoped top black border) */}
            <div className="md:col-span-8 border-t-2 border-black pt-4">
              <div className="bg-[#fbfbfb] border border-[#d4d4d4] p-8 text-center space-y-4 rounded-xs">
                <h2 className="font-serif font-black text-3xl sm:text-4xl text-black">
                  Special Offer: $3 USD/Month
                </h2>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 font-sans font-bold uppercase tracking-wider">
                <span>—————</span>
                <span>WSJ PROMOTION</span>
                <span>—————</span>
              </div>
              <p className="text-xs sm:text-sm font-sans text-gray-700 max-w-md mx-auto">
                Award-winning coverage on breaking news and today's top stories that impact you.
              </p>
              <div>
                <button className="bg-[#007cba] hover:bg-[#006996] text-white font-bold text-sm px-6 py-2.5 rounded-xs transition-colors">
                  Subscribe Now
                </button>
              </div>
              <div className="pt-2">
                <span className="font-serif font-black text-sm tracking-wider text-black block">
                  THE WALL STREET JOURNAL.
                </span>
                <span className="text-[9px] font-sans text-gray-500 uppercase tracking-widest block">
                  IT'S YOUR BUSINESS
                </span>
              </div>
              </div>
            </div>

            {/* WSJ Opinion | Free Expression Sidebar (Span 4) */}
            <div className="md:col-span-4 border border-[#4a6b7c] rounded-xs overflow-hidden">
              <div className="bg-[#4a6b7c] text-white px-4 py-2.5 font-sans font-bold text-sm">
                WSJ Opinion | Free Expression
              </div>
              <div className="p-4 bg-[#f4f8fa] space-y-4 text-xs">
                {/* Opinion 1 */}
                <div className="flex justify-between items-start space-x-3 pb-3 border-b border-[#d0e0e8]">
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-sm text-black leading-tight">
                      Trump Should Worry About a ‘10-Year Itch’
                    </h5>
                    <div className="text-[11px] text-gray-600">
                      By Matthew Continetti{" "}
                      <button className="bg-[#4a6b7c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">
                        Follow
                      </button>
                    </div>
                    <div className="text-[10px] text-red-600 font-bold">
                      56 min ago
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-300 rounded shrink-0" />
                </div>

                {/* Opinion 2 */}
                <div className="flex justify-between items-start space-x-3 pb-3 border-b border-[#d0e0e8]">
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-sm text-black leading-tight">
                      Gawking at Ariana Grande Isn’t Noble
                    </h5>
                    <div className="text-[11px] text-gray-600">
                      By Emma Camp{" "}
                      <button className="bg-[#4a6b7c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">
                        Follow
                      </button>
                    </div>
                    <div className="text-[10px] text-red-600 font-bold">
                      58 min ago
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-300 rounded shrink-0" />
                </div>

                {/* Opinion 3 */}
                <div className="flex justify-between items-start space-x-3 pb-3">
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-sm text-black leading-tight">
                      No Day at the Beach
                    </h5>
                    <div className="text-[11px] text-gray-600">
                      By Christopher J. Scalia
                    </div>
                    <div className="text-[10px] text-red-600 font-bold">
                      58 min ago
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-300 rounded shrink-0" />
                </div>

                {/* Action Button */}
                <button className="w-full bg-[#4a6b7c] hover:bg-[#3b5766] text-white font-bold text-xs py-2 rounded-xs transition-colors">
                  Go to Free Expression
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 3: FASHION & THE WHATNOT APP EXPERIENCE (Screenshot)      */}
        {/* ================================================================= */}
        <div className="py-8 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Fashion & Whatnot App Main Feed (Span 8) */}
            <div className="md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Column 1: Fashion */}
                <div className="space-y-3">
                  <div className="border-t-2 border-black pt-1 mb-3">
                    <h3 className="font-serif font-bold text-xl text-black">
                      Fashion
                    </h3>
                  </div>

                  <Link href={`/article/${art["how-family-flower-farm-became-essential-chanel"]?.slug || "how-family-flower-farm-became-essential-chanel"}`}>
                    <div className="w-full aspect-[16/10] overflow-hidden rounded-xs bg-gray-100 relative group cursor-pointer">
                      <img
                        src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80"
                        alt="Flower Farm Chanel No. 5"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Top-left pill overlay */}
                      <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-xs">
                        <span>🔊</span>
                        <span>Click for Sound</span>
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-bold text-[#666666] tracking-wider uppercase">
                      WSJ. MAGAZINE
                    </span>
                    <Link href={`/article/${art["how-family-flower-farm-became-essential-chanel"]?.slug || "how-family-flower-farm-became-essential-chanel"}`}>
                      <h4 className="font-serif font-bold text-xl text-black leading-tight hover:underline cursor-pointer">
                        {art["how-family-flower-farm-became-essential-chanel"]?.title || "How One Family’s Flower Farm Became Essential to Chanel No. 5"}
                      </h4>
                    </Link>
                    <p className="text-xs font-sans text-[#444444] leading-relaxed pt-1">
                      {art["how-family-flower-farm-became-essential-chanel"]?.summary || "Watch to see why one of the world’s most recognizable fragrances depends on flowers grown in the south of France."}
                    </p>
                    <div className="text-[11px] text-[#666666] pt-1">
                      💬 {art["how-family-flower-farm-became-essential-chanel"]?.commentCount || 9}
                    </div>

                    {/* Grey Advertisement Box Below Chanel Story (Screenshot 1) */}
                    <div className="w-full bg-[#f4f4f4] border border-[#d4d4d4] rounded-xs p-4 text-center text-gray-500 font-sans font-bold text-xs uppercase tracking-wider h-[100px] flex items-center justify-center mt-4">
                      ADVERTISEMENT
                    </div>
                  </div>
                </div>

                {/* Column 2: The Whatnot App Experience */}
                <div className="space-y-3">
                  <div className="border-t-2 border-black pt-1 mb-3">
                    <h3 className="font-serif font-bold text-xl text-black">
                      The Whatnot App Experience
                    </h3>
                  </div>

                  {/* Whatnot Item 1 */}
                  <div className="space-y-2">
                    <Link href={`/article/${art["live-shopping-app-where-some-people-bid-broke"]?.slug || "live-shopping-app-where-some-people-bid-broke"}`}>
                      <div className="w-full aspect-[16/10] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                        <img
                          src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80"
                          alt="Whatnot Live Shopping App"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-serif font-bold text-base text-black leading-tight mt-2 hover:underline cursor-pointer">
                        {art["live-shopping-app-where-some-people-bid-broke"]?.title || "The Live Shopping App Where Some People Bid Until They’re Broke"}
                      </h4>
                    </Link>
                    <p className="text-xs font-sans text-[#444444] leading-relaxed">
                      {art["live-shopping-app-where-some-people-bid-broke"]?.summary || "Whatnot’s fast-moving auctions hook users hoping to buy prized sports cards."}
                    </p>
                    <div className="text-[11px] text-[#666666]">
                      💬 {art["live-shopping-app-where-some-people-bid-broke"]?.commentCount || 372}
                    </div>
                  </div>

                  <hr className="border-t border-[#e2e2e2] my-3" />

                  {/* Whatnot Item 2 */}
                  <div className="space-y-1.5">
                    <Link href={`/article/${art["shopping-app-whatnot-valued-20-billion"]?.slug || "shopping-app-whatnot-valued-20-billion"}`}>
                      <h4 className="font-serif font-bold text-base text-black leading-tight hover:underline cursor-pointer">
                        {art["shopping-app-whatnot-valued-20-billion"]?.title || "Shopping App Whatnot Valued at $20 Billion in New Funding"}
                      </h4>
                    </Link>
                    <p className="text-xs font-sans text-[#444444] leading-relaxed">
                      {art["shopping-app-whatnot-valued-20-billion"]?.summary || "Whatnot, a fast-growing live-shopping platform, has nearly doubled its valuation."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Most Popular News Sidebar with Real Images (Span 4, Screenshot 1) */}
            <div className="md:col-span-4 space-y-4">
              <div className="border-b border-[#e2e2e2] pb-1 mb-2">
                <h3 className="font-serif font-bold text-xl text-black">
                  Most Popular News
                </h3>
              </div>

              <div className="space-y-4">
                {/* Popular 1: Harvard Appalachia Woman */}
                <div className="flex justify-between items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                  <Link href={`/article/${art["escaped-teen-marriage-appalachia-harvard"]?.slug || "escaped-teen-marriage-appalachia-harvard"}`}>
                    <h5 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer flex-1">
                      {art["escaped-teen-marriage-appalachia-harvard"]?.title || "She Escaped Teen Marriage in Appalachia. Her Time at Harvard Was Even Worse."}
                    </h5>
                  </Link>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80"
                    alt="Appalachia Harvard"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Popular 2: Burger King */}
                <div className="flex justify-between items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                  <Link href={`/article/${art["burger-king-whopper-fast-food-wars"]?.slug || "burger-king-whopper-fast-food-wars"}`}>
                    <h5 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer flex-1">
                      {art["burger-king-whopper-fast-food-wars"]?.title || "Burger King’s New Whopper Strikes a Blow in Fast-Food Burger Wars"}
                    </h5>
                  </Link>
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=140&q=80"
                    alt="Burger King"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Popular 3: Airlines ICE / Putin NATO */}
                <div className="flex justify-between items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                  <div className="flex-1 space-y-1">
                    <span className="inline-block border border-black px-1.5 py-0.5 text-[9px] font-bold font-sans uppercase tracking-wider text-black">
                      EXCLUSIVE
                    </span>
                    <Link href={`/article/${art["us-intel-putin-nato"]?.slug || "us-intel-putin-nato"}`}>
                      <h5 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer">
                        {art["us-intel-putin-nato"]?.title || "U.S. Intel Finds Putin Could Test NATO’s Resolve With Limited Incursion"}
                      </h5>
                    </Link>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=140&q=80"
                    alt="NATO Intel"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Popular 4: Amazon Data Center */}
                <div className="flex justify-between items-start space-x-3 pb-3 border-b border-[#e2e2e2]">
                  <Link href={`/article/${art["how-amazon-built-data-center-california"]?.slug || "how-amazon-built-data-center-california"}`}>
                    <h5 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer flex-1">
                      {art["how-amazon-built-data-center-california"]?.title || "How Amazon Built a Data Center in a California Town Without Anyone Noticing"}
                    </h5>
                  </Link>
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=140&q=80"
                    alt="Amazon Data Center"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>

                {/* Popular 5: China Export Engine */}
                <div className="flex justify-between items-start space-x-3 pb-3">
                  <Link href={`/article/${art["chinas-new-export-engine-supplying-factories"]?.slug || "chinas-new-export-engine-supplying-factories"}`}>
                    <h5 className="font-serif font-bold text-sm text-black leading-tight hover:underline cursor-pointer flex-1">
                      {art["chinas-new-export-engine-supplying-factories"]?.title || "China’s New Export Engine: Supplying Factories Around the World"}
                    </h5>
                  </Link>
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=140&q=80"
                    alt="China Export Engine"
                    className="w-14 h-14 object-cover rounded-xs shrink-0"
                  />
                </div>
              </div>

              {/* Grey Advertisement Box Below Most Popular News (Screenshot 1) */}
              <div className="w-full bg-[#f4f4f4] border border-[#d4d4d4] rounded-xs p-4 text-center text-gray-500 font-sans font-bold text-xs uppercase tracking-wider h-[140px] flex items-center justify-center mt-4">
                ADVERTISEMENT
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 4: POLITICS & POLYMARKET WIDGET (Screenshot 2)            */}
        {/* ================================================================= */}
        <div className="py-8 border-t border-[#e2e2e2]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Politics Section Main Feed (Span 8 - Enlarged Font Sizes) */}
            <div className="md:col-span-8 space-y-6">
              <div className="border-t-2 border-black pt-1 mb-2">
                <h3 className="font-serif font-bold text-2xl text-black">
                  Politics
                </h3>
              </div>

              {/* 3-Grid Articles with Larger Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Politics 1: Trump Leak Probe */}
                <div className="space-y-2.5">
                  <Link href={`/article/${art["trump-orders-leak-probe-media-coverage-munitions"]?.slug || "trump-orders-leak-probe-media-coverage-munitions"}`}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xs bg-gray-100 cursor-pointer">
                      <img
                        src={art["trump-orders-leak-probe-media-coverage-munitions"]?.imageUrl || "/images/trump-rally.jpg"}
                        alt={art["trump-orders-leak-probe-media-coverage-munitions"]?.title || "Trump Leak Probe"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-serif font-bold text-lg sm:text-xl text-black leading-snug mt-2 hover:underline cursor-pointer">
                      {art["trump-orders-leak-probe-media-coverage-munitions"]?.title || "Trump Orders Leak Probe After Venting About Media Coverage of Munitions Stockpile"}
                    </h4>
                  </Link>
                  <p className="text-xs sm:text-sm font-sans text-[#333333] leading-relaxed">
                    {art["trump-orders-leak-probe-media-coverage-munitions"]?.summary || "The president made the demand after weeks of headlines describing depleted munitions levels."}
                  </p>
                  <div className="text-xs text-[#666666] font-medium">
                    💬 {art["trump-orders-leak-probe-media-coverage-munitions"]?.commentCount || 148}
                  </div>
                </div>

                {/* Politics 2: Chinese Subscriber Guide */}
                <div className="space-y-2.5">
                  <div className="w-full aspect-[4/3] bg-[#f4f4f4] border border-[#d4d4d4] rounded-xs overflow-hidden">
                    <img
                      src="/images/handcuffs-money.jpg"
                      alt="Handcuffs money"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-lg sm:text-xl text-black leading-snug">
                    诈骗、制裁与空壳公司指南
                  </h4>
                  <p className="text-xs sm:text-sm font-sans text-[#333333] leading-relaxed">
                    保护您的全局业务，免受跨国犯罪组织与洗钱活动的侵害。
                  </p>
                  <span className="inline-block bg-black text-white text-[10px] font-bold font-sans uppercase px-2 py-0.5 rounded-xs">
                    SUBSCRIBER MESSAGE
                  </span>
                </div>

                {/* Politics 3: Fauci Legal Trouble */}
                <div className="space-y-2.5">
                  <Link href={`/article/${art["fauci-legal-trouble-contempt-vote"]?.slug || "fauci-legal-trouble-contempt-vote"}`}>
                    <h4 className="font-serif font-bold text-lg sm:text-xl text-black leading-snug hover:underline cursor-pointer">
                      {art["fauci-legal-trouble-contempt-vote"]?.title || "Is Fauci in Legal Trouble? What to Know After Contempt Vote"}
                    </h4>
                  </Link>
                  <p className="text-xs sm:text-sm font-sans text-[#333333] leading-relaxed">
                    {art["fauci-legal-trouble-contempt-vote"]?.summary || "A Senate panel's atypical criminal referral comes against Dr. Anthony Fauci."}
                  </p>
                  <div className="text-xs text-[#666666] font-medium">
                    💬 {art["fauci-legal-trouble-contempt-vote"]?.commentCount || 698}
                  </div>

                  {/* Sub item: Max Miller */}
                  <div className="pt-3 border-t border-[#e2e2e2] space-y-1.5">
                    <span className="inline-block border border-black px-1.5 py-0.5 text-[9px] font-bold font-sans uppercase tracking-wider text-black">
                      EXCLUSIVE
                    </span>
                    <Link href={`/article/${art["max-miller-loan-campaign-million-rejecting-calls"]?.slug || "max-miller-loan-campaign-million-rejecting-calls"}`}>
                      <h5 className="font-serif font-bold text-base text-black leading-snug hover:underline cursor-pointer">
                        {art["max-miller-loan-campaign-million-rejecting-calls"]?.title || "Max Miller to Loan Campaign $1 Million, Rejecting Calls to Withdraw"}
                      </h5>
                    </Link>
                    <p className="text-xs font-sans text-[#333333] leading-relaxed">
                      {art["max-miller-loan-campaign-million-rejecting-calls"]?.summary || "The Ohio congressman has said he would remain in the race despite domestic abuse allegations."}
                    </p>
                    <div className="text-xs text-[#666666] font-medium">
                      💬 {art["max-miller-loan-campaign-million-rejecting-calls"]?.commentCount || 164}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grey Advertisement Bar Below Politics Main Feed (Screenshot 2) */}
              <div className="w-full bg-[#f4f4f4] border border-[#d4d4d4] rounded-xs p-4 text-center text-gray-500 font-sans font-bold text-xs uppercase tracking-wider h-[120px] flex items-center justify-center mt-6">
                ADVERTISEMENT
              </div>
            </div>

            {/* Polymarket Partner Widget & Advertisement Sidebar (Span 4, Screenshot 2) */}
            <div className="md:col-span-4 space-y-4">
              <div className="border border-[#e2e2e2] bg-[#fcfcfc] p-4 rounded-xs space-y-3">
                <div className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between border-b border-gray-200 pb-2">
                  <span>Polymarket | A Dow Jones partner</span>
                  <span>ⓘ</span>
                </div>
                <h4 className="font-bold text-xs text-black">
                  Featured Prediction Market
                </h4>

                <div className="space-y-3 bg-white p-3 border border-[#e2e2e2] rounded-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🗺️</span>
                    <h5 className="font-bold text-xs text-black leading-snug">
                      Michigan Senate Election Winner ↗
                    </h5>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-teal-700 font-bold">
                      <span>■ Abdul El-Sayed (D)</span>
                      <span>61%</span>
                    </div>
                    <div className="flex justify-between items-center text-blue-900 font-bold">
                      <span>■ Mike Rogers (R)</span>
                      <span>40%</span>
                    </div>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="w-full h-20 pt-2">
                    <svg className="w-full h-full" viewBox="0 0 200 60">
                      <path
                        d="M0 45 Q50 35 100 40 T200 20"
                        fill="none"
                        stroke="#0f766e"
                        strokeWidth="2"
                      />
                      <path
                        d="M0 25 Q50 30 100 22 T200 35"
                        fill="none"
                        stroke="#1e3a8a"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>Aug 1</span>
                    <span>Aug 4</span>
                    <span>Aug 7</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono pt-1">
                    $252,064 Volume
                  </div>
                </div>
              </div>

              {/* Grey Advertisement Box Below Polymarket Widget (Screenshot 2) */}
              <div className="w-full bg-[#f4f4f4] border border-[#d4d4d4] rounded-xs p-6 text-center text-gray-500 font-sans font-bold text-xs uppercase tracking-wider h-[180px] flex items-center justify-center">
                ADVERTISEMENT
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeSecondarySections;
