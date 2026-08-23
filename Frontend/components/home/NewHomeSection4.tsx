"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export default function NewHomeSection4() {
  const [followedAuthor1, setFollowedAuthor1] = useState(false);
  const [followedAuthor2, setFollowedAuthor2] = useState(false);
  
  // Sticky Video Player States
  const [showStickyVideo, setShowStickyVideo] = useState(true);
  const [isPlayingStickyVideo, setIsPlayingStickyVideo] = useState(true);
  const [isMutedVideo, setIsMutedVideo] = useState(true);

  // Main Videos Module Player States
  const [isPlayingMainVideo, setIsPlayingMainVideo] = useState(true);
  const [isMutedMainVideo, setIsMutedMainVideo] = useState(true);

  return (
    <section className="w-full bg-white text-[#111111] pt-2 pb-6">
      {/* 12-Column Grid Alignment matching Section 1, 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* ==================== LEFT MAIN CONTAINER (9 of 12 Cols ~ 75%) ==================== */}
        <div className="lg:col-span-9 pr-0 lg:pr-6 lg:border-r lg:border-gray-300 flex flex-col border-t border-black pt-3">
          
          {/* Special Offer Promotion Box */}
          <div className="py-6 px-4 sm:px-8 text-center flex flex-col items-center justify-center">
            {/* Main Bold Serif Promo Headline */}
            <h2 className="font-serif font-black text-[28px] sm:text-[36px] lg:text-[42px] text-[#111111] leading-tight tracking-tight max-w-2xl">
              Special Offer: $3 USD/Month
            </h2>

            {/* Sub-heading with flanking lines */}
            <div className="flex items-center justify-center gap-3 my-3 text-[11px] font-sans font-extrabold tracking-widest text-[#111111] uppercase select-none">
              <span className="w-8 sm:w-12 h-px bg-black/70"></span>
              <span>WSJ PROMOTION</span>
              <span className="w-8 sm:w-12 h-px bg-black/70"></span>
            </div>

            {/* Subtitle Paragraph */}
            <p className="font-serif text-[15px] sm:text-[16px] text-center text-[#222222] my-2 max-w-xl leading-relaxed">
              Award-winning coverage on breaking news and today’s top stories that impact you.
            </p>

            {/* Subscribe Now Button */}
            <div className="my-3">
              <Link
                href="/special-offer"
                className="bg-[#007cb9] hover:bg-[#005599] text-white font-sans font-bold text-[13.5px] px-8 py-2.5 inline-block transition-colors cursor-pointer text-center shadow-2xs select-none"
              >
                Subscribe Now
              </Link>
            </div>

            {/* Brand Logo & Tagline */}
            <div className="pt-2 select-none">
              <span className="font-serif font-black text-[17px] sm:text-[19px] tracking-[0.14em] text-[#111111] block">
                TIMES CHICAGO
              </span>
              <span className="font-sans font-bold text-[8.5px] text-[#666666] tracking-[0.24em] uppercase block mt-0.5">
                IT&apos;S YOUR BUSINESS
              </span>
            </div>
          </div>

          {/* ==================== SUB-GRID BELOW SPECIAL OFFER (Your Weekend & Tech) ==================== */}
          <div className="border-t border-gray-300 pt-4 mt-2 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* SUB-COLUMN 1: YOUR WEEKEND (8 of 12 cols in 9-col container ~ 66.7%) */}
              <div className="md:col-span-8 pr-0 md:pr-4 md:border-r md:border-gray-200">
                <div className="border-t border-black pt-2 mb-3.5">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                    Your Weekend
                  </h3>
                </div>

                <article className="pb-2">
                  <Link
                    href="/article/why-it-is-impossible-to-get-a-restaurant-reservation"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                      alt="Restaurant Interior"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h3 className="font-serif font-bold text-[22px] sm:text-[24px] leading-[1.18] text-[#111111] hover:text-gray-800 hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/why-it-is-impossible-to-get-a-restaurant-reservation">
                      Why It is Impossible to Get a Restaurant Reservation
                    </Link>
                  </h3>

                  <p className="font-sans text-[13px] leading-[1.4] text-[#555555] mt-1.5">
                    New apps, membership clubs and other middlemen are fighting over access to high-spending customers and the eateries they love.
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                    <span>💬</span>
                    <span>363</span>
                  </div>
                </article>
              </div>

              {/* SUB-COLUMN 2: TECH (4 of 12 cols in 9-col container ~ 33.3%) */}
              <div className="md:col-span-4 pl-0 md:pl-2">
                <div className="border-t border-black pt-2 mb-3.5">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                    Tech
                  </h3>
                </div>

                {/* Tech Article 1 */}
                <article className="pb-3.5 border-b border-gray-200">
                  <Link
                    href="/article/the-cyberattack-that-brought-a-distant-war-to-small-town-minnesota"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
                      alt="Minnesota Water Tower"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/the-cyberattack-that-brought-a-distant-war-to-small-town-minnesota">
                      The Cyberattack That Brought a Distant War to Small-Town Minnesota
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    The water system in Braham was one of dozens affected after federal agencies warned Iran-linked hackers could target U.S. infrastructure.
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>💬</span>
                    <span>92</span>
                  </div>
                </article>

                {/* Tech Article 2 */}
                <article className="pt-3.5">
                  <div className="border border-black text-black font-sans font-bold text-[9px] tracking-widest uppercase px-1.5 py-0.5 inline-block mb-1.5 rounded-none">
                    EXCLUSIVE
                  </div>
                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/situational-awareness-bets-400-million-on-stealth-chip-startup">
                      Situational Awareness Bets $400 Million on Stealth Chip Startup After Crash
                    </Link>
                  </h4>
                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1.5">
                    The AI-battered hedge fund made a big bet this week in Source Foundry, a private company aiming to reinvent how chips are manufactured.
                  </p>
                  <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>💬</span>
                    <span>110</span>
                  </div>
                </article>

              </div>

            </div>
          </div>

          {/* ==================== POLITICS MODULE (Matching Screenshot) ==================== */}
          <div className="border-t border-black pt-2 mt-6 pb-2">
            <h3 className="font-serif font-bold text-[18px] sm:text-[19px] text-[#111111] mb-3.5">
              Politics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sub-Column 1: Hegseth Security Clearance */}
              <div>
                <article>
                  <Link
                    href="/article/hegseth-strips-security-clearance-from-bidens-air-force-secretary"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80"
                      alt="Air Force Secretary Frank Kendall"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/hegseth-strips-security-clearance-from-bidens-air-force-secretary">
                      Hegseth Strips Security Clearance From Biden’s Air Force Secretary
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1.5">
                    Frank Kendall, accused of leaking sensitive information, is the latest former defense official to lose access to classified information.
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                    <span>💬</span>
                    <span>246</span>
                  </div>
                </article>
              </div>

              {/* Sub-Column 2: Sponsored AI Course Card */}
              <div className="bg-[#f4f5f6] p-3 border border-gray-200 flex flex-col justify-between select-none">
                <div>
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-white border border-gray-200 mb-2">
                    {/* Top Left Ad Badge */}
                    <span className="absolute top-1.5 left-1.5 bg-[#3b82f6] text-white font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-2xs z-10">
                      Ad
                    </span>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                      alt="AI Skill Course Graphic"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="font-sans font-bold text-[13px] text-[#0274b6] hover:underline cursor-pointer block">
                    Coursiv
                  </span>

                  <h4 className="font-sans font-extrabold text-[15px] leading-snug text-[#111111] mt-1">
                    用AI更聪明地工作
                  </h4>

                  <p className="font-sans text-[12px] text-[#555555] mt-1">
                    用热门AI技能提升你的职业
                  </p>
                </div>
              </div>

              {/* Sub-Column 3: Trump Stories */}
              <div className="divide-y divide-gray-200">
                {/* Trump Hair Memes */}
                <article className="pb-3.5">
                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/trump-showed-up-at-rally-with-lustrous-locks">
                      Trump Showed Up at a Rally With Lustrous Locks. The Memes Won’t Stop.
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1.5">
                    The president’s hair looked more voluminous at an event in Las Vegas, and the internet was quick to respond.
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                    <span>💬</span>
                    <span>499</span>
                  </div>
                </article>

                {/* Trump Fire Fed Governor Lisa Cook */}
                <article className="pt-3.5">
                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/trump-revives-attempt-to-fire-fed-governor-lisa-cook">
                      Trump Revives Attempt to Fire Fed Governor Lisa Cook
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1.5">
                    The move, outlined in a White House letter to Cook this week, follows a Supreme Court ruling in June that blocked an earlier attempt.
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                    <span>💬</span>
                    <span>615</span>
                  </div>
                </article>
              </div>

            </div>
          </div>

          {/* ==================== DESIGN & BOOKS MODULE (Matching Screenshot) ==================== */}
          <div className="border-t border-gray-300 pt-6 mt-4 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* SUB-COLUMN 1: DESIGN (8 of 12 cols in 9-col container ~ 66.7%) */}
              <div className="md:col-span-8 pr-0 md:pr-4 md:border-r md:border-gray-200">
                <div className="border-t border-black pt-2 mb-3.5">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                    Design
                  </h3>
                </div>

                <article className="pb-2">
                  <Link
                    href="/article/a-spa-in-the-middle-of-the-desert-500000-bathroom"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
                      alt="Spa Bathroom in Desert"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h3 className="font-serif font-bold text-[22px] sm:text-[24px] leading-[1.18] text-[#111111] hover:text-gray-800 hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/a-spa-in-the-middle-of-the-desert-500000-bathroom">
                      A Spa in the Middle of the Desert? It’s Actually a $500,000 Bathroom
                    </Link>
                  </h3>

                  <p className="font-sans text-[13px] leading-[1.4] text-[#555555] mt-1.5">
                    The owners enlisted an interior designer to create a nature-infused luxury retreat inside their Arizona home.
                  </p>
                </article>
              </div>

              {/* SUB-COLUMN 2: BOOKS (4 of 12 cols in 9-col container ~ 33.3%) */}
              <div className="md:col-span-4 pl-0 md:pl-2">
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                    Books
                  </h3>
                  <Link
                    href="/books"
                    className="font-sans text-[13px] font-bold text-[#111111] underline hover:text-gray-700"
                  >
                    View All
                  </Link>
                </div>

                {/* Books Article 1 */}
                <article className="pb-3.5 border-b border-gray-200">
                  <Link
                    href="/article/she-escaped-teen-marriage-in-appalachia-harvard"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                      alt="Emilee Hackney portrait"
                      className="w-full h-full object-cover grayscale hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/she-escaped-teen-marriage-in-appalachia-harvard">
                      She Escaped Teen Marriage in Appalachia. Her Time at Harvard Was Even Worse.
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    Emilee Hackney writes about her tumultuous coming of age in “All That’s Unseen”
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>💬</span>
                    <span>804</span>
                  </div>
                </article>

                {/* Books Article 2 */}
                <article className="pt-3.5">
                  <div className="font-sans font-extrabold text-[10px] text-[#444444] uppercase tracking-wider mb-1 block">
                    BOOK REVIEW
                  </div>
                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link prefetch={true} href="/article/15-books-we-read-this-week">
                      15 Books We Read This Week
                    </Link>
                  </h4>
                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    How pitchers found more power, Mahalia Jackson on the march, the work that shaped Hannah Arendt and more.
                  </p>
                  <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>💬</span>
                    <span>1</span>
                  </div>
                </article>

              </div>

            </div>
          </div>

          {/* ==================== WORLD MODULE (Matching Screenshots 1 & 2) ==================== */}
          <div className="border-t border-gray-300 pt-6 mt-4 pb-2">
            <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                World
              </h3>
              <Link
                href="/world"
                className="font-sans text-[13px] font-bold text-[#111111] underline hover:text-gray-700"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* SUB-COLUMN 1: SPANISH BORDER CHAOS (8 of 12 cols in 9-col container ~ 66.7%) */}
              <div className="md:col-span-8 pr-0 md:pr-4 md:border-r md:border-gray-200">
                <article className="pb-2">
                  <Link
                    href="/article/spanish-border-chaos-is-an-illusion"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                      alt="Spanish Border Fence Patrol"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="font-sans font-extrabold text-[10px] text-[#444444] uppercase tracking-wider mb-1 block">
                    THE SATURDAY ESSAY
                  </div>

                  <h3 className="font-serif font-bold text-[22px] sm:text-[24px] leading-[1.18] text-[#111111] hover:text-gray-800 hover:underline cursor-pointer">
                    <Link href="/article/spanish-border-chaos-is-an-illusion">
                      Spanish Border Chaos Is an Illusion: Europe’s Borders Are Finally Working
                    </Link>
                  </h3>

                  <p className="font-sans text-[13px] leading-[1.4] text-[#555555] mt-1.5">
                    Images of 72,000 migrants stampeding into Ceuta looked like a security collapse. In reality it revealed Europe’s much harder line on immigration.
                  </p>
                </article>
              </div>

              {/* SUB-COLUMN 2: WORLD STORIES LIST (4 of 12 cols in 9-col container ~ 33.3%) */}
              <div className="md:col-span-4 pl-0 md:pl-2 divide-y divide-gray-200">
                
                {/* World Story 1 */}
                <article className="pb-3.5">
                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/eus-internal-borders-start-to-harden">
                      EU’s Internal Borders Start to Harden as Dispute Grows Over Migrants
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    Spain introduced new border checks on arrivals from Italy, as a migration dispute between the countries escalated into a tit-for-tat that is testing the unity of the European Union.
                  </p>
                </article>

                {/* World Story 2 */}
                <article className="py-3.5">
                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/russias-hottest-startup-sanctions-evasion">
                      Russia’s Hottest Startup Is a State-Backed Sanctions Evasion Network
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    Founded less than two years ago, A7 says it handles nearly 20% of payments in Russian foreign trade, or more than $100 billion annually.
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>💬</span>
                    <span>39</span>
                  </div>
                </article>

                {/* World Story 3 (From Screenshot 2) */}
                <article className="pt-3.5">
                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/us-intel-links-russia-to-explosive-drone-german-airport">
                      U.S. Intel Links Russia to Explosive Drone at German Airport
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    American intelligence had already suggested Putin could test NATO’s resolve with a limited incursion in the coming years.
                  </p>

                  <div className="font-sans text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                    <span>💬</span>
                    <span>231</span>
                  </div>
                </article>

              </div>

            </div>
          </div>

          {/* ==================== WSJ BUY SIDE MAIN MODULE (Matching Screenshot) ==================== */}
          <div className="border-t-2 border-[#2b595f] pt-3 mt-6 pb-2">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="font-serif font-extrabold text-[20px] text-[#2b595f] tracking-tight">
                WSJ Buy Side
              </h3>
              <Link
                href="/buyside"
                className="font-sans text-[13px] font-bold text-[#2b595f] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            <p className="font-sans text-[12px] leading-tight text-[#666666] mb-4">
              Reviews and recommendations, independent of The Wall Street Journal newsroom.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Smartphones (Pushed to bottom matching original layout) */}
              <div className="flex flex-col justify-end h-full">
                <article>
                  <div className="font-sans font-extrabold text-[10.5px] text-[#2c5d63] uppercase tracking-wider mb-1 block">
                    SMARTPHONES
                  </div>

                  <h4 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/best-bluetooth-trackers-for-finding-your-stuff">
                      The Best Bluetooth Trackers for Finding Your Stuff
                    </Link>
                  </h4>

                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
                    If you’re prone to losing things, or just worried you might, a Bluetooth tracker will help ease your anxiety.
                  </p>
                </article>
              </div>

              {/* Column 2: Pet Insurance (Pushed to bottom matching original layout) */}
              <div className="flex flex-col justify-end h-full">
                <article>
                  <div className="font-sans font-extrabold text-[10.5px] text-[#2c5d63] uppercase tracking-wider mb-1 block">
                    PET INSURANCE
                  </div>

                  <h4 className="font-serif font-bold text-[18px] xl:text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/cheap-pet-insurance-most-affordable-options">
                      Cheap Pet Insurance: The Most Affordable Options
                    </Link>
                  </h4>

                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
                    See the lowest-cost pet insurers and the trade-offs that come with choosing the cheapest options.
                  </p>
                </article>
              </div>

              {/* Column 3: Coffee & Shoes List */}
              <div className="divide-y divide-gray-200">
                {/* Coffee */}
                <article className="pb-3.5">
                  <div className="font-sans font-extrabold text-[10.5px] text-[#2c5d63] uppercase tracking-wider mb-1 block">
                    COFFEE
                  </div>

                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/baratza-encore-esp-pro-grinder-review">
                      The Baratza Encore ESP Pro Grinder Is Great for Coffee Connoisseurs, from Espresso to Cold Brew
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    This coffee grinder gives the at-home barista an opportunity to perfect their espresso routine.
                  </p>
                </article>

                {/* Shoes */}
                <article className="pt-3.5">
                  <div className="font-sans font-extrabold text-[10.5px] text-[#2c5d63] uppercase tracking-wider mb-1 block">
                    SHOES
                  </div>

                  <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/mary-jane-sneakers-trending-top-picks">
                      Mary Jane Sneakers Are Trending. These Are Stylists’ Top Picks.
                    </Link>
                  </h4>

                  <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1">
                    The stylish shoes combine the elegance of a ballet flat with the comfort of a sneaker.
                  </p>
                </article>
              </div>

            </div>
          </div>

          {/* ==================== VIDEOS MAIN MODULE (Matching Screenshot) ==================== */}
          <div className="border-t border-gray-300 pt-6 mt-4 pb-2">
            {/* Header Row */}
            <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
              <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                Videos
              </h3>
              <Link
                href="/video"
                className="font-sans text-[13px] font-bold text-[#111111] underline hover:text-gray-700"
              >
                View All
              </Link>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black border border-gray-300 shadow-md group/mainvid select-none">
              {/* Video Thumbnail Background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80"
                alt="Naval Aircraft Carrier Fleet"
                className="w-full h-full object-cover opacity-90 group-hover/mainvid:scale-105 transition-transform duration-300"
              />

              {/* Top-Left Sound Pill Button */}
              <button
                onClick={() => setIsMutedMainVideo(!isMutedMainVideo)}
                className="absolute top-3 left-3 bg-white/95 hover:bg-white text-black font-sans font-bold text-[11.5px] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer transition-colors z-10"
                suppressHydrationWarning
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <span>{isMutedMainVideo ? "Click for Sound" : "Mute Sound"}</span>
              </button>

              {/* Top-Right WSJ Watermark */}
              <span className="absolute top-3 right-4 text-white/80 font-serif font-bold text-[15px] tracking-wider pointer-events-none">
                WSJ
              </span>

              {/* Bottom Video Controls Overlay Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-white z-10">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  {/* Pause / Play Button */}
                  <button
                    onClick={() => setIsPlayingMainVideo(!isPlayingMainVideo)}
                    className="w-7 h-7 border border-[#00a3c4] bg-[#007cb9]/30 hover:bg-[#007cb9]/60 flex items-center justify-center text-white cursor-pointer transition-colors rounded-2xs"
                    aria-label={isPlayingMainVideo ? "Pause video" : "Play video"}
                    suppressHydrationWarning
                  >
                    {isPlayingMainVideo ? (
                      <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 fill-current text-white ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Volume Icon */}
                  <button
                    onClick={() => setIsMutedMainVideo(!isMutedMainVideo)}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                    suppressHydrationWarning
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                  </button>

                  {/* Time Stamp */}
                  <span className="font-mono text-[12px] text-white/90">
                    0:00 / 10:22
                  </span>
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-3 text-white/80">
                  {/* Share Icon */}
                  <button className="hover:text-white transition-colors cursor-pointer" title="Share" suppressHydrationWarning>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </button>

                  {/* Closed Captions CC Icon */}
                  <button className="hover:text-white transition-colors cursor-pointer font-bold text-[11px] border border-white/60 px-1 py-0.5 rounded-2xs" title="Captions" suppressHydrationWarning>
                    CC
                  </button>

                  {/* Fullscreen Icon */}
                  <button className="hover:text-white transition-colors cursor-pointer" title="Fullscreen" suppressHydrationWarning>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 3-Video Playlist Row below Featured Video Player (Matching Screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 pt-4 border-t border-gray-200">
              
              {/* Video Item 1 */}
              <article>
                <Link
                  href="/article/inside-the-pacific-wargames-watched-by-americas-adversaries"
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-900 border border-gray-300 group/v1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
                    alt="Pacific Wargames Host"
                    className="w-full h-full object-cover group-hover/v1:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Overlay Pill Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white font-sans text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                      <svg className="w-2 h-2 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span>10:22</span>
                  </div>
                </Link>

                <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#005580] hover:underline cursor-pointer mt-2.5">
                  <Link href="/article/inside-the-pacific-wargames-watched-by-americas-adversaries">
                    Inside the Pacific Wargames Watched by America’s Adversaries
                  </Link>
                </h4>
              </article>

              {/* Video Item 2 */}
              <article>
                <Link
                  href="/article/can-hamas-really-be-disarmed-gaza-peace-deal"
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-900 border border-gray-300 group/v2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
                    alt="Gaza Peace Deal Personnel"
                    className="w-full h-full object-cover group-hover/v2:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Overlay Pill Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white font-sans text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                      <svg className="w-2 h-2 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span>4:13</span>
                  </div>
                </Link>

                <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer mt-2.5">
                  <Link href="/article/can-hamas-really-be-disarmed-gaza-peace-deal">
                    Can Hamas Really Be Disarmed? Inside the Gaza Peace Deal
                  </Link>
                </h4>
              </article>

              {/* Video Item 3 */}
              <article>
                <Link
                  href="/article/how-democratic-socialists-are-shaking-up-the-midterms"
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-900 border border-gray-300 group/v3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                    alt="Democratic Socialists Midterms"
                    className="w-full h-full object-cover group-hover/v3:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Overlay Pill Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white font-sans text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                      <svg className="w-2 h-2 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span>6:22</span>
                  </div>
                </Link>

                <h4 className="font-serif font-bold text-[16px] xl:text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer mt-2.5">
                  <Link href="/article/how-democratic-socialists-are-shaking-up-the-midterms">
                    How Democratic Socialists Are Shaking Up the Midterms
                  </Link>
                </h4>
              </article>

            </div>
          </div>

          {/* ==================== 5 CATEGORY TRIPLET BLOCKS (Matching Screenshot) ==================== */}
          
          {/* BLOCK 1: Economy | Real Estate | Sports (Exact from Screenshot) */}
          <div className="border-t border-gray-300 pt-6 mt-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Economy */}
              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                    Economy
                  </h3>
                  <Link href="/economy" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">
                    &gt;
                  </Link>
                </div>

                <article className="pb-3 border-b border-gray-200">
                  <Link
                    href="/article/why-slow-job-growth-doesnt-mean-labor-market-trouble"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
                      alt="Job seekers in line"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/why-slow-job-growth-doesnt-mean-labor-market-trouble">
                      Why Slow Job Growth Doesn’t Mean the Labor Market Is in Trouble
                    </Link>
                  </h4>
                </article>

                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/week-ahead-fx-bonds-inflation-in-focus">
                      Week Ahead for FX, Bonds: U.S. Inflation Data in Focus
                    </Link>
                  </h4>
                </article>

                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/us-lost-23000-jobs-july-unemployment-ticked-lower">
                      U.S. Lost 23,000 Jobs in July, While Unemployment Ticked Lower
                    </Link>
                  </h4>
                </article>
              </div>

              {/* Column 2: Real Estate */}
              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                    Real Estate
                  </h3>
                  <Link href="/real-estate" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">
                    &gt;
                  </Link>
                </div>

                <article className="pb-3 border-b border-gray-200">
                  <Link
                    href="/article/nyc-pied-a-terre-owners-hunt-creative-ways-dodge-tax"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                      alt="NYC Skyscrapers"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/nyc-pied-a-terre-owners-hunt-creative-ways-dodge-tax">
                      NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax
                    </Link>
                  </h4>
                </article>

                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/dc-home-market-gets-billionaire-bump">
                      The D.C. Home Market Gets a Billionaire Bump
                    </Link>
                  </h4>
                </article>

                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/house-of-the-week-remote-new-zealand">
                      House of the Week: Built Off-Site and Hauled to Remote New Zealand
                    </Link>
                  </h4>
                </article>
              </div>

              {/* Column 3: Sports */}
              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">
                    Sports
                  </h3>
                  <Link href="/sports" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">
                    &gt;
                  </Link>
                </div>

                <article className="pb-3 border-b border-gray-200">
                  <Link
                    href="/article/horse-racing-triple-crown-may-no-longer-be-worth-chasing"
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80"
                      alt="Horse Racing Triple Crown"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/horse-racing-triple-crown-may-no-longer-be-worth-chasing">
                      Horse Racing’s Triple Crown May No Longer Be Worth Chasing
                    </Link>
                  </h4>
                </article>

                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/king-of-soccer-went-rogue-lost-fifa-empire">
                      The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire
                    </Link>
                  </h4>
                </article>

                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/big-dumper-baseballs-big-bust">
                      He’s Known as Big Dumper, but This Year He’s Baseball’s Big Bust
                    </Link>
                  </h4>
                </article>
              </div>

            </div>
          </div>

          {/* BLOCK 2: CMO Today | CIO Journal | CFO Journal */}
          <div className="border-t border-gray-300 pt-6 mt-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">CMO Today</h3>
                  <Link href="/cmo" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/retail-giants-turn-to-ai-pricing" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80" alt="Retail storefront" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/retail-giants-turn-to-ai-pricing">Retail Giants Turn to AI for Next-Gen Pricing Strategies</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/global-supply-chains-adapt-trade-rules">Global Supply Chains Adapt to New International Trade Rules</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/automakers-shift-focus-next-gen-hybrids">Automakers Shift Focus Toward High-Efficiency Hybrid Engines</Link>
                  </h4>
                </article>
              </div>

              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">CIO Journal</h3>
                  <Link href="/cio" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/central-banks-cautious-rate-cuts" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80" alt="Trading floor" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/central-banks-cautious-rate-cuts">Central Banks Signal Cautious Approach to Future Interest Rate Cuts</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/bond-yields-adjust-economic-outlook">Bond Yields Adjust Amid Shifting Global Economic Outlook</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/venture-capital-resurgence-tech">Venture Capital Activity Shows Signs of Resurgence in Tech Sector</Link>
                  </h4>
                </article>
              </div>

              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">CFO Journal</h3>
                  <Link href="/cfo" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/cloud-providers-race-microchips" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" alt="Server microchips" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/cloud-providers-race-microchips">Cloud Providers Race to Secure Advanced AI Microchips</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/cybersecurity-surge-enterprise-demand">Cybersecurity Firms See Surge in Enterprise Demand</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/quantum-computing-startups-milestone">Quantum Computing Startups Reach Key Hardware Milestone</Link>
                  </h4>
                </article>
              </div>
            </div>
          </div>

          {/* BLOCK 3: Risk & Compliance | Sponsored Ad Card | Logistics Report */}
          <div className="border-t border-gray-300 pt-6 mt-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">Risk &amp; Compliance</h3>
                  <Link href="/risk-compliance" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/hidden-costs-economic-policy" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80" alt="Capital building" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/hidden-costs-economic-policy">The Hidden Costs of Modern Economic Policy Frameworks</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/why-innovation-thrives-free-market">Why Innovation Thrives Under Free Market Competition</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/reimagining-global-energy-strategy">Reimagining Global Energy Strategy for the Next Decade</Link>
                  </h4>
                </article>
              </div>

              {/* Middle Column: Sponsored Ad Card (Matching Screenshot) */}
              <div className="bg-[#f4f5f6] p-3 border border-gray-200 flex flex-col justify-between select-none h-full">
                <div>
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-white border border-gray-200 mb-2">
                    {/* Top Left Ad Badge */}
                    <span className="absolute top-1.5 left-1.5 bg-[#3b82f6] text-white font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-2xs z-10">
                      Ad
                    </span>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                      alt="AI Skill Course Graphic"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="font-sans font-bold text-[13px] text-[#0274b6] hover:underline cursor-pointer block">
                    Coursiv
                  </span>

                  <h4 className="font-sans font-extrabold text-[15px] leading-snug text-[#111111] mt-1">
                    用AI更聪明地工作
                  </h4>

                  <p className="font-sans text-[12px] text-[#555555] mt-1">
                    用热门AI技能提升你的职业
                  </p>
                </div>
              </div>

              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">Logistics Report</h3>
                  <Link href="/logistics" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/smart-strategies-high-yield-savings" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80" alt="Logistics cargo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/smart-strategies-high-yield-savings">Smart Strategies for Navigating High-Yield Cargo Networks</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/tax-efficient-portfolios-preserve-wealth">How Efficient Logistics Hubs Support Global Supply Chains</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/what-investors-know-retirement-accounts">What Shipping Operators Should Know About Port Freight Tech</Link>
                  </h4>
                </article>
              </div>
            </div>
          </div>

          {/* BLOCK 4: Elections | Heard on the Street | Barron's */}
          <div className="border-t border-gray-300 pt-6 mt-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">Elections</h3>
                  <Link href="/elections" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/revival-timeless-craftsmanship-luxury-fashion" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80" alt="Elections campaign" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/revival-timeless-craftsmanship-luxury-fashion">Key Senate Races Highlight Shifting Voter Demographics</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/modern-architecture-blends-heritage">Campaign Finance Trends Reshape Battleground State Contests</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/minimalist-interiors-global-capitals">Early Voting Polling Numbers Show Strong Suburban Turnout</Link>
                  </h4>
                </article>
              </div>

              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">Heard on the Street</h3>
                  <Link href="/heard-on-the-street" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/landmark-museum-retrospective-exhibition" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80" alt="Stock market analysis" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/landmark-museum-retrospective-exhibition">Why Tech Stocks Are Overvalued Ahead of Earnings Season</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/literary-classics-digital-formats">Oil Price Volatility Creates Buying Opportunities in Energy</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/renaissance-independent-cinema-festivals">Retail Investor Demand Drives Unexpected Crypto Stock Surge</Link>
                  </h4>
                </article>
              </div>

              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">Barron’s</h3>
                  <Link href="/barrons" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/research-highlights-daily-sleep-routines" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80" alt="Barron's financial report" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/research-highlights-daily-sleep-routines">Barron’s Top 10 Stock Picks for Long-Term Portfolio Growth</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/nutritionists-share-habits-vitality">Market Analysts Weigh In on Central Bank Monetary Outlook</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/science-behind-mindfulness-focus">Real Estate Funds Offer High Dividends in Shifting Market</Link>
                  </h4>
                </article>
              </div>
            </div>
          </div>

          {/* BLOCK 5: MarketWatch | Mansion Global | Investor's Business Daily */}
          <div className="border-t border-gray-300 pt-6 mt-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">MarketWatch</h3>
                  <Link href="/marketwatch" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/infrastructure-projects-accelerate-transit" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80" alt="MarketWatch ticker" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/infrastructure-projects-accelerate-transit">MarketWatch: Dow Futures Rise Ahead of Key Economic Indicators</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/state-legislatures-debate-regional-plans">Tech Earnings Surprise Boosts Investor Sentiment Across Indexes</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/port-modernization-reaches-final-stage">Treasury Yields Stabilize Following Inflation Benchmark Release</Link>
                  </h4>
                </article>
              </div>

              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">Mansion Global</h3>
                  <Link href="/mansion-global" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/international-summit-maritime-security" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Mansion Global luxury home" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/international-summit-maritime-security">Inside a $45 Million Waterfront Estate in Miami Beach</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/diplomatic-talks-transatlantic-energy">High-Net-Worth Buyers Drive Demand for Alpine Chalets</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/global-logistics-routes-adapt">Historic Tuscan Villa Historic Restoration Project Lists for $18M</Link>
                  </h4>
                </article>
              </div>

              <div>
                <div className="border-t border-black pt-2 mb-3.5 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[18px] text-[#111111]">Investor’s Business Daily</h3>
                  <Link href="/ibd" className="font-serif font-bold text-[18px] text-[#111111] hover:underline">&gt;</Link>
                </div>
                <article className="pb-3 border-b border-gray-200">
                  <Link href="/article/offshore-wind-farms-expand-energy-grid" className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80" alt="Investor's Business Daily chart" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <h4 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/offshore-wind-farms-expand-energy-grid">IBD 50 Top-Performing Growth Stocks Outperform Market Averages</Link>
                  </h4>
                </article>
                <article className="py-3 border-b border-gray-200">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/next-gen-solar-batteries-efficiency">Technical Breakout Signals Bullish Trend for Semiconductor Leader</Link>
                  </h4>
                </article>
                <article className="pt-3">
                  <h4 className="font-serif font-bold text-[15.5px] xl:text-[16.5px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                    <Link href="/article/urban-forestry-projects-metropolitan">CAN SLIM Investing Strategy: Key Indicators to Watch This Week</Link>
                  </h4>
                </article>
              </div>
            </div>
          </div>

          {/* Empty Banner for Dianomi Advertisement */}
          <div className="border-t border-black pt-3 mt-8 pb-4">
            <AdPlaceholder width="w-full" height="h-[120px]" resolution="728 × 90" />
          </div>

          {/* ==================== REAL ESTATE INSIGHTS MODULE (realtor.com) (Matching Screenshot) ==================== */}
          <div className="border-t border-black pt-3 mt-8 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-[20px] text-[#111111]">
                Real Estate Insights
              </h3>
              <div className="font-sans text-[12px] text-[#666666] flex items-center gap-1.5 select-none">
                <span>Content provided by</span>
                <span className="font-bold text-[#d9222a] flex items-center gap-0.5 text-[13px]">
                  <span className="text-[14px]">🏠</span> realtor.com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 Item 1 */}
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=200&q=80"
                  alt="Elizabeth Warren hearing"
                  className="w-[65px] h-[48px] object-cover border border-gray-200 shrink-0"
                />
                <h4 className="font-serif font-bold text-[14px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  EXCL: Sen. Warren Slams Compass Private Listings Network in Letter to CEO
                </h4>
              </div>

              {/* Row 1 Item 2 */}
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Ali Larter portrait"
                  className="w-[65px] h-[48px] object-cover border border-gray-200 shrink-0"
                />
                <h4 className="font-serif font-bold text-[14px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  Ali Larter Shares Glimpse Inside ‘Simple’ Idaho Lifestyle After Quitting L.A.
                </h4>
              </div>

              {/* Row 1 Item 3 */}
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80"
                  alt="UK City Skyline"
                  className="w-[65px] h-[48px] object-cover border border-gray-200 shrink-0"
                />
                <h4 className="font-serif font-bold text-[14px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  Why U.K. Homebuyers Are Flocking to This Affordable Heartland State
                </h4>
              </div>

              {/* Row 2 Item 1 */}
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=200&q=80"
                  alt="Carly Simon portrait"
                  className="w-[65px] h-[48px] object-cover border border-gray-200 shrink-0"
                />
                <h4 className="font-serif font-bold text-[14px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  Inside Carly Simon’s Martha’s Vineyard Retreat Where She ‘Withdrew From View’
                </h4>
              </div>

              {/* Row 2 Item 2 */}
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80"
                  alt="House on money stack"
                  className="w-[65px] h-[48px] object-cover border border-gray-200 shrink-0"
                />
                <h4 className="font-serif font-bold text-[14px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  The ‘Widow Tax’ Could Reshape the Great Wealth Transfer
                </h4>
              </div>

              {/* Row 2 Item 3 */}
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80"
                  alt="Donald Trump Jr portrait"
                  className="w-[65px] h-[48px] object-cover border border-gray-200 shrink-0"
                />
                <h4 className="font-serif font-bold text-[14px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  Donald Trump Jr. Pays $7.6 Million for Ex Kimberly Guilfoyle’s Share of Mansion
                </h4>
              </div>
            </div>
          </div>

        </div>

        {/* ==================== RIGHT SIDEBAR CONTAINER (3 of 12 Cols ~ 25%) ==================== */}
        <div className="lg:col-span-3 pl-0 lg:pl-6 pt-3 lg:pt-0">
          
          {/* "WSJ Opinion | Free Expression" Module Card */}
          <div className="border border-[#b8d1db] bg-[#f0f7f9] overflow-hidden rounded-none shadow-2xs">
            
            {/* Card Dark Slate Teal Header */}
            <div className="bg-[#426a79] text-white px-4 py-3 font-sans font-bold text-[15px] leading-tight tracking-tight">
              WSJ Opinion | Free Expression
            </div>

            {/* Inner Content Area */}
            <div className="p-4 flex flex-col gap-4 text-[#111111]">
              
              {/* Opinion Story 1 */}
              <div className="pb-3 border-b border-[#cbe0e7]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer">
                      <Link href="/article/trump-should-worry-about-a-10-year-itch">
                        Trump Should Worry About a ‘10-Year Itch’
                      </Link>
                    </h3>
                    
                    <div className="font-sans text-[12px] text-gray-700 mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span>By Matthew Continetti</span>
                    </div>
                    
                    <button
                      onClick={() => setFollowedAuthor1(!followedAuthor1)}
                      className={`mt-1 text-[10px] font-sans font-bold px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
                        followedAuthor1
                          ? "bg-gray-400 text-white"
                          : "bg-[#4f7382] hover:bg-[#3f6575] text-white"
                      }`}
                      suppressHydrationWarning
                    >
                      {followedAuthor1 ? "Following" : "Follow"}
                    </button>

                    <div className="font-sans text-[11.5px] text-gray-500 mt-1.5">
                      Aug. 7
                    </div>
                  </div>

                  {/* Thumbnail Image 1 */}
                  <Link
                    href="/article/trump-should-worry-about-a-10-year-itch"
                    className="w-[58px] h-[58px] shrink-0 overflow-hidden bg-gray-200 border border-gray-300 block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=300&q=80"
                      alt="Trump Should Worry About a 10-Year Itch"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>

              {/* Opinion Story 2 */}
              <div className="pb-3 border-b border-[#cbe0e7]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer">
                      <Link href="/article/gawking-at-ariana-grande-isnt-noble">
                        Gawking at Ariana Grande Isn’t Noble
                      </Link>
                    </h3>
                    
                    <div className="font-sans text-[12px] text-gray-700 mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span>By Emma Camp</span>
                      <button
                        onClick={() => setFollowedAuthor2(!followedAuthor2)}
                        className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
                          followedAuthor2
                            ? "bg-gray-400 text-white"
                            : "bg-[#4f7382] hover:bg-[#3f6575] text-white"
                        }`}
                        suppressHydrationWarning
                      >
                        {followedAuthor2 ? "Following" : "Follow"}
                      </button>
                    </div>

                    <div className="font-sans text-[11.5px] text-gray-500 mt-1.5">
                      Aug. 7
                    </div>
                  </div>

                  {/* Thumbnail Image 2 */}
                  <Link
                    href="/article/gawking-at-ariana-grande-isnt-noble"
                    className="w-[58px] h-[58px] shrink-0 overflow-hidden bg-gray-200 border border-gray-300 block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Gawking at Ariana Grande Isn't Noble"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>

              {/* Opinion Story 3 */}
              <div className="pb-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer">
                      <Link href="/article/no-day-at-the-beach">
                        No Day at the Beach
                      </Link>
                    </h3>
                    
                    <div className="font-sans text-[12px] text-gray-700 mt-1.5">
                      By Christopher J. Scalia
                    </div>

                    <div className="font-sans text-[11.5px] text-gray-500 mt-1.5">
                      Aug. 7
                    </div>
                  </div>

                  {/* Thumbnail Image 3 */}
                  <Link
                    href="/article/no-day-at-the-beach"
                    className="w-[58px] h-[58px] shrink-0 overflow-hidden bg-gray-200 border border-gray-300 block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80"
                      alt="No Day at the Beach"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>

              {/* Go to Free Expression CTA Button */}
              <div className="pt-2">
                <Link
                  href="/free-expression"
                  className="w-full bg-[#426a79] hover:bg-[#345763] text-white font-sans font-bold text-[13.5px] py-2.5 rounded-none text-center block transition-colors shadow-2xs select-none"
                >
                  Go to Free Expression
                </Link>
              </div>

            </div>

          </div>

          {/* ==================== MOST POPULAR NEWS MODULE ==================== */}
          <div className="pt-4 mt-6 border-t border-black">
            <h3 className="font-sans font-bold text-[18px] sm:text-[19px] text-[#111111] mb-3">
              Most Popular News
            </h3>

            <div className="divide-y divide-gray-200">
              {/* Popular Item 1 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/this-summers-hottest-arm-candy-is-a-private-equity-boyfriend">
                    This Summer’s Hottest Arm Candy Is a Private Equity Boyfriend
                  </Link>
                </h4>
                <Link
                  href="/article/this-summers-hottest-arm-candy-is-a-private-equity-boyfriend"
                  className="w-[64px] h-[64px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80"
                    alt="This Summer's Hottest Arm Candy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Popular Item 2 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/move-37-is-the-moment-ai-changes-everything">
                    Move 37 Is the Moment AI Changes Everything. It’s Suddenly Happening Everywhere.
                  </Link>
                </h4>
                <Link
                  href="/article/move-37-is-the-moment-ai-changes-everything"
                  className="w-[64px] h-[64px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80"
                    alt="Move 37 AI Moment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Popular Item 3 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/a-lost-civilization-is-baffling-experts-and-rewriting-chinas-origin-story">
                    A Lost Civilization Is Baffling Experts and Rewriting China’s Origin Story
                  </Link>
                </h4>
                <Link
                  href="/article/a-lost-civilization-is-baffling-experts-and-rewriting-chinas-origin-story"
                  className="w-[64px] h-[64px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80"
                    alt="Lost Civilization Baffling Experts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Popular Item 4 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/was-his-home-connecticut-or-florida-difference-is-13-million-tax-bill">
                    Was His Home Connecticut or Florida? The Difference Is a $13 Million Tax Bill
                  </Link>
                </h4>
                <Link
                  href="/article/was-his-home-connecticut-or-florida-difference-is-13-million-tax-bill"
                  className="w-[64px] h-[64px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80"
                    alt="Connecticut or Florida Tax Bill"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Popular Item 5 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/iran-sees-opening-to-kick-us-out-of-gulf">
                    Iran Sees an Opening to Kick the U.S. Out of the Gulf
                  </Link>
                </h4>
                <Link
                  href="/article/iran-sees-opening-to-kick-us-out-of-gulf"
                  className="w-[64px] h-[64px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80"
                    alt="Iran Sees Opening in Gulf"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>
            </div>

            {/* Bottom Border Divider Line */}
            <div className="border-b border-black mt-2" />
          </div>

          {/* ==================== FEATURED PREDICTION MARKET MODULE ==================== */}
          <div className="mt-6 border border-gray-300 rounded-md bg-[#f8f9fa] p-4 shadow-2xs">
            
            {/* Header */}
            <div className="flex items-center gap-1.5 text-[12px] font-sans font-medium text-gray-600">
              <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Polymarket | A Dow Jones partner</span>
              <span className="text-gray-400 cursor-pointer hover:text-gray-600 ml-0.5" title="Partnership Info">ⓘ</span>
            </div>

            <h3 className="font-sans font-bold text-[18px] text-[#0a2540] mt-1.5 mb-3 tracking-tight">
              Featured Prediction Market
            </h3>

            {/* Market Item Header */}
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                <span className="text-red-600 font-extrabold text-[12px] tracking-tighter">🐘</span>
              </div>
              <a
                href="https://polymarket.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-bold text-[15px] leading-tight text-[#0a2540] hover:underline flex items-center gap-1 group"
              >
                <span>Republican Presidential Nominee 2028</span>
                <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#0a2540] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* Candidate Legend Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-2 my-3 text-[12.5px] font-sans font-bold text-[#2d3748]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#00a3c4] inline-block shrink-0" />
                <span>J.D. Vance 44%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#0e6273] inline-block shrink-0" />
                <span>Marco Rubio 23%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#7cc9e3] inline-block shrink-0" />
                <span>Ron DeSantis 3%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#111111] inline-block shrink-0" />
                <span>Tucker Carlson 3%</span>
              </div>
            </div>

            {/* Chart Container with Percentage Grid Lines */}
            <div className="relative pt-2 pb-1 my-2">
              <div className="relative w-full h-[100px] border-b border-gray-200">
                
                {/* 50% line */}
                <div className="absolute top-[15%] left-0 right-0 border-b border-gray-200 border-dashed flex justify-end">
                  <span className="text-[10px] font-sans text-gray-400 bg-[#f8f9fa] pl-1 relative -top-2">50%</span>
                </div>

                {/* 33% line */}
                <div className="absolute top-[48%] left-0 right-0 border-b border-gray-200 border-dashed flex justify-end">
                  <span className="text-[10px] font-sans text-gray-400 bg-[#f8f9fa] pl-1 relative -top-2">33%</span>
                </div>

                {/* 17% line */}
                <div className="absolute top-[75%] left-0 right-0 border-b border-gray-200 border-dashed flex justify-end">
                  <span className="text-[10px] font-sans text-gray-400 bg-[#f8f9fa] pl-1 relative -top-2">17%</span>
                </div>

                {/* 0% line label */}
                <div className="absolute bottom-0 right-0">
                  <span className="text-[10px] font-sans text-gray-400 bg-[#f8f9fa] pl-1 relative -top-1">0%</span>
                </div>

                {/* SVG Trend Lines */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* J.D. Vance (44%) */}
                  <path d="M 0 22 C 30 18, 60 22, 100 22 C 140 22, 150 32, 170 34 C 200 36, 240 36, 265 36" fill="none" stroke="#00a3c4" strokeWidth="2.5" />
                  <circle cx="265" cy="36" r="3.5" fill="#00a3c4" />

                  {/* Marco Rubio (23%) */}
                  <path d="M 0 54 C 60 54, 120 54, 150 54 C 160 66, 180 72, 220 72 C 240 72, 255 72, 265 72" fill="none" stroke="#0e6273" strokeWidth="2.5" />
                  <circle cx="265" cy="72" r="3.5" fill="#0e6273" />

                  {/* Ron DeSantis (3%) */}
                  <path d="M 0 95 C 60 95, 120 95, 180 94 C 220 94, 250 94, 265 94" fill="none" stroke="#7cc9e3" strokeWidth="2" />

                  {/* Tucker Carlson (3%) */}
                  <path d="M 0 98 C 40 100, 90 98, 140 96 C 180 96, 230 94, 265 94" fill="none" stroke="#111111" strokeWidth="2" />
                  <circle cx="265" cy="94" r="3.5" fill="#111111" />
                </svg>

              </div>

              {/* X-Axis Timeline Dates */}
              <div className="flex justify-between text-[11px] font-sans text-gray-500 pt-1.5 px-2">
                <span>Aug 3</span>
                <span>Aug 6</span>
                <span>Aug 9</span>
              </div>
            </div>

            {/* Volume Footer */}
            <div className="font-sans text-[12.5px] text-gray-500 font-medium mt-2.5">
              $686,449,299 Volume
            </div>

          </div>

          {/* ==================== WSJ | BUY SIDE MODULE ==================== */}
          <div className="pt-4 mt-6 border-t-2 border-[#2b595f]">
            <h3 className="font-serif font-extrabold text-[20px] text-[#4d5656] tracking-tight">
              WSJ | Buy Side
            </h3>
            
            <p className="font-sans text-[12px] leading-tight text-[#666666] mt-1 mb-4">
              Reviews and recommendations, independent of The Wall Street Journal newsroom.
            </p>

            <div className="space-y-4">
              {/* Buy Side Item 1 */}
              <article className="space-y-1">
                <div className="font-sans font-extrabold text-[11px] text-[#2c5d63] uppercase tracking-wider">
                  STUDENT LOANS
                </div>
                <h4 className="font-sans font-bold text-[16px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  <Link href="/article/best-private-student-loans">
                    Best Private Student Loans
                  </Link>
                </h4>
              </article>

              {/* Buy Side Item 2 */}
              <article className="space-y-1 pt-2">
                <div className="font-sans font-extrabold text-[11px] text-[#2c5d63] uppercase tracking-wider">
                  AUTO INSURANCE
                </div>
                <h4 className="font-sans font-bold text-[16px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  <Link href="/article/cheapest-car-insurance-options">
                    Cheapest Car Insurance Options
                  </Link>
                </h4>
              </article>

              {/* Buy Side Item 3 */}
              <article className="space-y-1 pt-2">
                <div className="font-sans font-extrabold text-[11px] text-[#2c5d63] uppercase tracking-wider">
                  FINANCIAL ADVISORS
                </div>
                <h4 className="font-sans font-bold text-[16px] leading-snug text-[#111111] hover:underline cursor-pointer">
                  <Link href="/article/5-top-financial-advisor-companies-for-retirees">
                    5 of the Top Financial Advisor Companies for Retirees: Well-Known Fiduciary Firms to Consider
                  </Link>
                </h4>
              </article>
            </div>
          </div>

          {/* ==================== MOST POPULAR OPINION MODULE ==================== */}
          <div className="pt-4 mt-6 border-t-2 border-[#8b6f37]">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-extrabold text-[20px] text-[#8b6f37] tracking-tight">
                Most Popular
              </h3>
              <span className="bg-[#8b6f37] text-white font-sans font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-2xs">
                OPINION
              </span>
            </div>

            {/* 5 Stories List */}
            <div className="divide-y divide-gray-200">
              {/* Opinion Item 1 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/tim-walz-has-hit-the-wall">
                    Tim Walz Has Hit the Wall
                  </Link>
                </h4>
                <Link
                  href="/article/tim-walz-has-hit-the-wall"
                  className="w-[60px] h-[60px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=300&q=80"
                    alt="Tim Walz Has Hit the Wall"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Opinion Item 2 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/justice-samuel-alito-practical-originalism">
                    Justice Samuel Alito: ‘Practical Originalism’ and Its Facile Critics
                  </Link>
                </h4>
                <Link
                  href="/article/justice-samuel-alito-practical-originalism"
                  className="w-[60px] h-[60px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80"
                    alt="Justice Samuel Alito"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Opinion Item 3 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/saudis-spurn-abraham-accords">
                    The Saudis Spurn the Abraham Accords
                  </Link>
                </h4>
                <Link
                  href="/article/saudis-spurn-abraham-accords"
                  className="w-[60px] h-[60px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80"
                    alt="The Saudis Spurn the Abraham Accords"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Opinion Item 4 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/federal-reserve-status-quo-vs-kevin-warsh">
                    The Federal Reserve Status Quo vs. Kevin Warsh
                  </Link>
                </h4>
                <Link
                  href="/article/federal-reserve-status-quo-vs-kevin-warsh"
                  className="w-[60px] h-[60px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"
                    alt="Federal Reserve Status Quo vs Kevin Warsh"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {/* Opinion Item 5 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/intricate-system-lets-you-find-yourself">
                    The Intricate System That Lets You Find Yourself
                  </Link>
                </h4>
                <Link
                  href="/article/intricate-system-lets-you-find-yourself"
                  className="w-[60px] h-[60px] shrink-0 overflow-hidden bg-gray-100 border border-gray-200 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/world/mercury_retrograde.jpg"
                    alt="Celestial globe"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>
            </div>
          </div>

          {/* ==================== RECOMMENDED VIDEOS MODULE ==================== */}
          <div className="pt-4 mt-6 border-t border-black">
            <h3 className="font-sans font-bold text-[18px] sm:text-[19px] text-[#111111] mb-3">
              Recommended Videos
            </h3>

            <div className="divide-y divide-gray-200">
              {/* Video Item 1 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/pizza-hut-lost-in-the-us-now-selling-for-2-7b">
                    Pizza Hut Lost in the U.S. Now It’s Selling for $2.7B.
                  </Link>
                </h4>
                <Link
                  href="/article/pizza-hut-lost-in-the-us-now-selling-for-2-7b"
                  className="w-[92px] h-[54px] shrink-0 overflow-hidden bg-gray-900 border border-gray-300 block relative group/vid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80"
                    alt="Pizza Hut Storefront"
                    className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-black/75 flex items-center justify-center text-white shadow-xs group-hover/vid:bg-black group-hover/vid:scale-110 transition-all">
                    <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </Link>
              </article>

              {/* Video Item 2 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/how-one-familys-flower-farm-became-essential-to-chanel-no-5">
                    How One Family’s Flower Farm Became Essential to Chanel No. 5
                  </Link>
                </h4>
                <Link
                  href="/article/how-one-familys-flower-farm-became-essential-to-chanel-no-5"
                  className="w-[92px] h-[54px] shrink-0 overflow-hidden bg-gray-900 border border-gray-300 block relative group/vid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=300&q=80"
                    alt="Flower Farm Chanel No. 5"
                    className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-black/75 flex items-center justify-center text-white shadow-xs group-hover/vid:bg-black group-hover/vid:scale-110 transition-all">
                    <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </Link>
              </article>

              {/* Video Item 3 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/inside-the-pacific-wargames-watched-by-americas-adversaries">
                    Inside the Pacific Wargames Watched by America’s Adversaries
                  </Link>
                </h4>
                <Link
                  href="/article/inside-the-pacific-wargames-watched-by-americas-adversaries"
                  className="w-[92px] h-[54px] shrink-0 overflow-hidden bg-gray-900 border border-gray-300 block relative group/vid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=300&q=80"
                    alt="Pacific Wargames"
                    className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-black/75 flex items-center justify-center text-white shadow-xs group-hover/vid:bg-black group-hover/vid:scale-110 transition-all">
                    <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </Link>
              </article>

              {/* Video Item 4 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/wsj-opinion-hits-and-misses">
                    WSJ Opinion: Hits and Misses
                  </Link>
                </h4>
                <Link
                  href="/article/wsj-opinion-hits-and-misses"
                  className="w-[92px] h-[54px] shrink-0 overflow-hidden bg-gray-900 border border-gray-300 block relative group/vid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80"
                    alt="WSJ Opinion Hits and Misses"
                    className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-black/75 flex items-center justify-center text-white shadow-xs group-hover/vid:bg-black group-hover/vid:scale-110 transition-all">
                    <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </Link>
              </article>

              {/* Video Item 5 */}
              <article className="py-3 flex items-start justify-between gap-3 group">
                <h4 className="font-serif font-bold text-[14.5px] xl:text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer group-hover:text-gray-800 flex-1 min-w-0">
                  <Link href="/article/the-evolution-of-modern-motorsports">
                    The Evolution of Modern Motorsports
                  </Link>
                </h4>
                <Link
                  href="/article/the-evolution-of-modern-motorsports"
                  className="w-[92px] h-[54px] shrink-0 overflow-hidden bg-gray-900 border border-gray-300 block relative group/vid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=300&q=80"
                    alt="The Evolution of Modern Motorsports"
                    className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-300 opacity-90"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-black/75 flex items-center justify-center text-white shadow-xs group-hover/vid:bg-black group-hover/vid:scale-110 transition-all">
                    <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </Link>
              </article>
            </div>
          </div>

          {/* ==================== JOURNAL REPORTS MODULE ==================== */}
          <div className="pt-4 mt-6 border-t border-black">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-bold text-[18px] sm:text-[19px] text-[#111111]">
                Journal Reports
              </h3>
              <Link
                href="/journal-reports"
                className="font-sans text-[13px] font-bold text-[#111111] underline hover:text-gray-700"
              >
                View All
              </Link>
            </div>

            {/* Featured Top Story */}
            <article className="pb-3">
              <Link
                href="/article/the-simple-mental-tricks-that-make-us-better-with-money"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80"
                  alt="Mental Tricks Make Us Better With Money"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <h4 className="font-serif font-bold text-[17px] leading-[1.22] text-[#111111] hover:underline cursor-pointer">
                <Link href="/article/the-simple-mental-tricks-that-make-us-better-with-money">
                  The Simple Mental Tricks That Make Us Better With Money
                </Link>
              </h4>

              <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5">
                The digital environment makes it so easy to spend money. The key is to put a little friction between us and our purchases.
              </p>
            </article>

            {/* Secondary List Items */}
            <div className="divide-y divide-gray-200 border-t border-gray-200">
              <article className="py-3">
                <h4 className="font-serif font-bold text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer">
                  <Link href="/article/where-reit-investors-have-earned-the-best-returns">
                    Where REIT Investors Have Earned the Best Returns
                  </Link>
                </h4>
              </article>

              <article className="py-3">
                <h4 className="font-serif font-bold text-[15px] leading-[1.25] text-[#111111] hover:underline cursor-pointer">
                  <Link href="/article/what-to-know-before-doing-a-cash-out-refinancing-on-your-home">
                    What to Know Before Doing a Cash-Out Refinancing on Your Home
                  </Link>
                </h4>
              </article>
            </div>
          </div>

          {/* ==================== STICKY BOTTOM ADVERTISEMENT & FLOATING VIDEO MODULE ==================== */}
          <div className="sticky top-20 z-20 mt-8 space-y-4 pt-2">
            
            {/* Empty Banner below Refinancing Article */}
            <AdPlaceholder width="w-full" height="h-[250px]" resolution="300 × 250" />

            {/* Floating Video Player Card */}
            {showStickyVideo && (
              <div className="bg-white border border-gray-300 shadow-xl rounded-none overflow-hidden text-[#111111] transition-all">
                {/* Video Preview Aspect Container */}
                <div className="relative aspect-[16/10] bg-black overflow-hidden group/vid">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
                    alt="Pacific Wargames Video Preview"
                    className="w-full h-full object-cover opacity-90 group-hover/vid:scale-105 transition-transform duration-300"
                  />

                  {/* Top-Left Sound Pill Button */}
                  <button
                    onClick={() => setIsMutedVideo(!isMutedVideo)}
                    className="absolute top-2.5 left-2.5 bg-white/95 hover:bg-white text-black font-sans font-bold text-[11.5px] px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer transition-colors z-10 select-none"
                    suppressHydrationWarning
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    <span>{isMutedVideo ? "Click for Sound" : "Mute Sound"}</span>
                  </button>

                  {/* Top-Right WSJ Watermark */}
                  <span className="absolute top-2 right-3 text-white/80 font-serif font-bold text-[12px] tracking-wider pointer-events-none">
                    WSJ
                  </span>

                  {/* Video Captions Subtitle Overlay */}
                  <div className="absolute bottom-2 inset-x-0 text-center px-2">
                    <span className="bg-black/80 text-white font-sans text-[11px] px-2 py-0.5 rounded-xs inline-block">
                      we help fill in the gaps in tactics and strategies
                    </span>
                  </div>
                </div>

                {/* Video Information & Control Footer */}
                <div className="p-3.5 bg-white">
                  <h4 className="font-sans font-bold text-[13.5px] leading-snug text-[#111111] hover:underline cursor-pointer mb-2.5">
                    <Link href="/article/inside-the-pacific-wargames-watched-by-americas-adversaries">
                      Inside the Pacific Wargames Watched by America’s Adversaries
                    </Link>
                  </h4>

                  <div className="flex items-center justify-between pt-1 text-gray-700">
                    {/* Pause / Play Icon */}
                    <button
                      onClick={() => setIsPlayingStickyVideo(!isPlayingStickyVideo)}
                      className="w-7 h-7 rounded-full border border-gray-400 hover:bg-gray-100 flex items-center justify-center text-black cursor-pointer transition-colors"
                      aria-label={isPlayingStickyVideo ? "Pause video" : "Play video"}
                      suppressHydrationWarning
                    >
                      {isPlayingStickyVideo ? (
                        <svg className="w-3 h-3 fill-current text-black" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 fill-current text-black ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Timestamp */}
                    <span className="font-mono text-[11.5px] text-gray-600">
                      03:42 / 10:22
                    </span>

                    {/* Close Button X */}
                    <button
                      onClick={() => setShowStickyVideo(false)}
                      className="p-1 text-gray-500 hover:text-black transition-colors cursor-pointer"
                      aria-label="Close video player"
                      suppressHydrationWarning
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
