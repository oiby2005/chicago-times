"use client";

import React from "react";
import Link from "next/link";

export const YourWeekendSection: React.FC = () => {
  return (
    <section className="w-full font-sans select-none my-4 pt-2">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          Your Weekend
        </h2>
      </div>

      {/* Main Package Grid: Left Hero (8 cols) | Right Side Stories (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        
        {/* ==================== LEFT HERO PACKAGE (8 of 12 cols ~ 67%) ==================== */}
        <div className="md:col-span-8 pr-0 md:pr-[0.4cm] flex flex-col justify-between mb-6 md:mb-0">
          <Link
            href="/article/why-it-is-impossible-to-get-restaurant-reservation"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Restaurant Reservation"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div>
            <h3 className="font-serif font-bold text-[24px] sm:text-[28px] leading-[1.15] text-[#111111] hover:underline cursor-pointer mb-2">
              <Link href="/article/why-it-is-impossible-to-get-restaurant-reservation">
                Why It is Impossible to Get a Restaurant Reservation
              </Link>
            </h3>
            <p className="font-sans text-[13.5px] sm:text-[14px] leading-relaxed text-[#444444] mb-2">
              New apps, membership clubs and other middlemen are fighting over access to high-spending customers and the eateries they love.
            </p>
            <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
              <span>💬</span>
              <span>363</span>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT SIDE STORIES (4 of 12 cols ~ 33%) ==================== */}
        <div 
          className="md:col-span-4 pl-0 md:pl-[0.4cm] flex flex-col justify-between border-t md:border-t-0 pt-4 md:pt-0"
          style={{ borderLeft: "1px solid #CCCCCC" }}
        >
          {/* Top Story 1 */}
          <article className="pb-4 border-b border-dashed border-[#CCCCCC] mb-4">
            <Link
              href="/article/the-cyberattack-that-brought-distant-war"
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
            >
              <img
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
                alt="Cyberattack drone"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <h4 className="font-serif font-bold text-[17px] sm:text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href="/article/the-cyberattack-that-brought-distant-war">
                The Cyberattack That Brought a Distant War to Small-Town Minnesota
              </Link>
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
              The water system in Braham was one of dozens affected after federal agencies warned Iran-linked hackers could target U.S. infrastructure.
            </p>
            <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
              <span>💬</span>
              <span>92</span>
            </div>
          </article>

          {/* Bottom Story 2 */}
          <article className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-[17px] sm:text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                <Link href="/article/situational-awareness-bets-400-million">
                  Situational Awareness Bets $400 Million on Stealth Chip Startup After Crash
                </Link>
              </h4>
              <p className="font-sans text-[13px] leading-relaxed text-[#555555]">
                The AI-battered hedge fund made a big bet this week in Source Foundry, a private company aiming to reinvent how chips are manufactured.
              </p>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
};

export default YourWeekendSection;
