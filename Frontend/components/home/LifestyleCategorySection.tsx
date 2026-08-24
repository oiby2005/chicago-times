"use client";

import React from "react";
import Link from "next/link";

export const LifestyleCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-2 pb-4 my-0">
      {/* Section Header with dashed line BELOW the Lifestyle text */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#4A2E80] tracking-tight">
          Lifestyle
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#f4effc] flex items-center justify-center text-[#4A2E80] cursor-pointer hover:bg-[#e9defa]">
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
              <h3 className="font-serif font-bold text-[26px] sm:text-[30px] leading-[1.12] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/chicest-stays-in-balearic-islands">
                  These are the chicest<br />
                  stays in the Balearic<br />
                  islands
                </Link>
              </h3>
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
                From a boutique townhouse hotel in Menorca’s capital to a peaceful Ibiza villa with a pool, we’ve tracked down the finest spots to have on your radar
              </p>
            </div>

            {/* Right Large Hero Image */}
            <div className="md:col-span-4">
              <Link
                href="/article/chicest-stays-in-balearic-islands"
                className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
                  alt="Balearic islands villa resort terrace pool"
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
                href="/article/are-airport-lounges-worth-it"
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                  alt="Airport lounge interior"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
                      EXCLUSIVE
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                    <Link href="/article/are-airport-lounges-worth-it">
                      Are airport lounges worth it? Probably not, according to new study
                    </Link>
                  </h4>
                </div>
              </div>
            </div>

            {/* Mini Story 2 */}
            <div className="flex items-start space-x-3 pl-0 md:pl-1">
              <Link
                href="/article/this-ayrshire-hotels-new-spa-is-star-turn"
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
                  alt="Ayrshire hotel resort sunset"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#336699] uppercase">
                      REVIEW
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                    <Link href="/article/this-ayrshire-hotels-new-spa-is-star-turn">
                      This Ayrshire hotel’s new spa is the star turn
                    </Link>
                  </h4>
                </div>
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
                href="/article/naples-hotel-scene-has-never-been-better"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
                  alt="Naples hotel pool view"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/naples-hotel-scene-has-never-been-better">
                  Naples’ hotel scene has never been better. Here’s where to stay
                </Link>
              </h4>
            </article>

            {/* Story 2 */}
            <article className="pt-1">
              <Link
                href="/article/win-a-luxury-highlands-break"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
                  alt="Luxury Glenmorangie House interior"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#336699] uppercase">
                  WHERE WAS I? COMPETITION
                </span>
              </div>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/win-a-luxury-highlands-break">
                  Win a luxury Highlands break worth up to £1,210 with Glenmorangie House
                </Link>
              </h4>
            </article>
          </div>

          {/* Column 2 of Right Sidebar */}
          <div className="flex flex-col justify-between pl-0 md:pl-2 h-full">
            {/* Story 3 */}
            <article className="pb-3 mb-3 border-b border-dashed border-[#CCCCCC]">
              <Link
                href="/article/these-beautiful-islands-are-closer-than-you-think"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                  alt="Beautiful island beach"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/these-beautiful-islands-are-closer-than-you-think">
                  These beautiful islands are closer to home than you think
                </Link>
              </h4>
            </article>

            {/* Story 4 */}
            <article className="pt-1">
              <Link
                href="/article/why-book-a-cruise-and-stay-with-times-holidays"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80"
                  alt="Taj Mahal reflection at sunset"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#336699] uppercase">
                  PROMOTED CONTENT
                </span>
              </div>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/why-book-a-cruise-and-stay-with-times-holidays">
                  Why book a cruise-and-stay with Times Holidays? The best offers for 2027 and 2028
                </Link>
              </h4>
            </article>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LifestyleCategorySection;
