"use client";

import React from "react";
import Link from "next/link";

export const SportCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-2 pb-4 my-0">
      {/* Section Header with dashed line BELOW the Sport text */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#1b7538] tracking-tight">
          Sport
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#f0f7f2] flex items-center justify-center text-[#1b7538] cursor-pointer hover:bg-[#e1f0e5]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* Main Grid across all 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* LEFT & CENTER HERO AREA (8 of 12 cols ~ 67%) */}
        <div className="lg:col-span-8 pr-0 lg:pr-4 flex flex-col justify-start h-full" style={{ borderRight: "1px solid #CCCCCC" }}>
          
          {/* Top Half: Left Headline Text (4 cols) + Large Hero Photo (4 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 pb-4 border-b border-dashed border-[#CCCCCC]">
            {/* Left Headline */}
            <div className="md:col-span-4 flex flex-col justify-start">
              <div className="mb-1">
                <span className="font-sans font-bold text-[11px] tracking-wider text-[#1b7538] uppercase">
                  FIRST TEST | MIKE ATHERTON
                </span>
              </div>
              <h3 className="font-serif font-bold text-[28px] sm:text-[32px] leading-[1.12] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link prefetch={true} href="/article/returning-robinsons-excellence">
                  Returning<br />
                  Robinson’s<br />
                  excellence ensures<br />
                  Stokes is not missed
                </Link>
              </h3>
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
                Headingley (day one of five): Root guides England to 112 for two in reply to Pakistan’s 171 after five wickets each for Robinson and Tongue
              </p>
              <div className="mt-1">
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  Cricket
                </span>
              </div>
            </div>

            {/* Right Large Hero Image */}
            <div className="md:col-span-4">
              <Link
                href="/article/returning-robinsons-excellence"
                className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
                  alt="Cricket Players Celebrating"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Bottom Half: 2 Mini Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Mini Story 1 */}
            <div className="flex items-start space-x-3 pr-0 md:pr-3" style={{ borderRight: "1px solid #CCCCCC" }}>
              <Link
                href="/article/spurs-in-double-swoop-for-marmoush-and-savinho"
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src="/images/spurs.jpg"
                  alt="Spurs Footballer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                  <Link prefetch={true} href="/article/spurs-in-double-swoop-for-marmoush-and-savinho">
                    Spurs in double swoop for Marmoush and Savinho from City
                  </Link>
                </h4>
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  Football
                </span>
              </div>
            </div>

            {/* Mini Story 2 */}
            <div className="flex items-start space-x-3 pl-0 md:pl-1">
              <Link
                href="/article/poor-old-warner-forever-the-victim"
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src="/images/world/england_cricket.jpg"
                  alt="David Warner Press Conference"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                      COMMENT | MATTHEW SYED
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                    <Link prefetch={true} href="/article/poor-old-warner-forever-the-victim">
                      Poor old Warner — forever the victim, never the culprit
                    </Link>
                  </h4>
                </div>
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  Cricket
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR STORIES AREA (4 of 12 cols ~ 33%) */}
        <div className="lg:col-span-4 pl-0 lg:pl-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-stretch pt-4 lg:pt-0 h-full">
          
          {/* Column 1 of Right Sidebar */}
          <div className="flex flex-col justify-between pr-0 md:pr-2 h-full" style={{ borderRight: "1px solid #CCCCCC" }}>
            {/* Story 1 */}
            <article className="pb-3 mb-3 border-b border-dashed border-[#CCCCCC]">
              <Link
                href="/article/root-ditches-tinkering-on-day-of-sharp-decisive-captaincy"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80"
                  alt="Cricket Match"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                  FIRST TEST | STEVE JAMES
                </span>
              </div>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link prefetch={true} href="/article/root-ditches-tinkering-on-day-of-sharp-decisive-captaincy">
                  Root ditches tinkering on day of sharp, decisive captaincy
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                Cricket
              </span>
            </article>

            {/* Story 2 */}
            <article className="pt-1">
              <Link
                href="/article/cocaine-ban-does-not-mean-the-end-for-kyrgios"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80"
                  alt="Tennis Player"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                  TOM KERSHAW
                </span>
              </div>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link prefetch={true} href="/article/cocaine-ban-does-not-mean-the-end-for-kyrgios">
                  Cocaine ban does not mean the end for Kyrgios in sport that consumes stars
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                Tennis
              </span>
            </article>
          </div>

          {/* Column 2 of Right Sidebar */}
          <div className="flex flex-col justify-start pl-0 md:pl-2">
            {/* Story 3 */}
            <article className="pb-3 mb-3 border-b border-dashed border-[#CCCCCC]">
              <Link
                href="/article/united-submit-65m-bid-for-brightons-baleba"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80"
                  alt="Football Player Brighton"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                  WINDOW WATCH
                </span>
              </div>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link prefetch={true} href="/article/united-submit-65m-bid-for-brightons-baleba">
                  United submit £65m bid for Brighton’s Baleba as Jones nears Inter move
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                Football
              </span>
            </article>

            {/* Story 4 */}
            <article className="pt-1">
              <Link
                href="/article/off-grid-uk-athletics-coach-in-moroccan-jail"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80"
                  alt="Athletics Runner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link prefetch={true} href="/article/off-grid-uk-athletics-coach-in-moroccan-jail">
                  ‘Off grid’ UK athletics coach in Moroccan jail for sexually assaulting minor
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                Athletics
              </span>
            </article>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SportCategorySection;
