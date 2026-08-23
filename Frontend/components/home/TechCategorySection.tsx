"use client";

import React from "react";
import Link from "next/link";

export const TechCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-4 pb-2 my-0">
      {/* Section Header with View All link without top border */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          Tech
        </h2>
        <Link 
          href="/category/tech" 
          className="font-sans font-bold text-[13px] text-[#111111] underline hover:text-[#333333]"
        >
          View All
        </Link>
      </div>

      {/* Main Grid: Left Hero (8 cols ~ 67%), Right 3 Stories (4 cols ~ 33%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[0.4cm] items-start">
        
        {/* LEFT HERO AREA (8 of 12 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-start">
          <Link
            href="/article/spanish-border-chaos-is-an-illusion"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              alt="Spanish Border Chaos"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          
          <div className="mb-1">
            <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#111111]">
              THE SATURDAY ESSAY
            </span>
          </div>

          <h3 className="font-serif font-bold text-[22px] sm:text-[24px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
            <Link prefetch={true} href="/article/spanish-border-chaos-is-an-illusion">
              Spanish Border Chaos Is an Illusion: Europe’s Borders Are Finally Working
            </Link>
          </h3>
          
          <p className="font-sans text-[13px] leading-relaxed text-[#555555]">
            Images of 72,000 migrants stampeding into Ceuta looked like a security collapse. In reality it revealed Europe’s much harder line on immigration.
          </p>
        </div>

        {/* RIGHT STORIES AREA (4 of 12 cols) */}
        <div className="lg:col-span-4 pl-0 lg:pl-2 flex flex-col justify-start pt-4 lg:pt-0">
          
          {/* Story 1 */}
          <article className="pb-3 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link prefetch={true} href="/article/eus-internal-borders-start-to-harden">
                EU’s Internal Borders Start to Harden as Dispute Grows Over Migrants
              </Link>
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555]">
              Spain introduced new border checks on arrivals from Italy, as a migration dispute between the countries escalated into a tit-for-tat that is testing the unity of the European Union.
            </p>
          </article>

          {/* Story 2 */}
          <article className="py-3 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link prefetch={true} href="/article/russias-hottest-startup-sanctions-evasion">
                Russia’s Hottest Startup Is a State-Backed Sanctions Evasion Network
              </Link>
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
              Founded less than two years ago, A7 says it handles nearly 20% of payments in Russian foreign trade, or more than $100 billion annually.
            </p>
            <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
              <span>💬</span>
              <span>39</span>
            </div>
          </article>

          {/* Story 3 */}
          <article className="pt-3">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link prefetch={true} href="/article/us-intel-links-russia-explosive-drone">
                U.S. Intel Links Russia to Explosive Drone at German Airport
              </Link>
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
              American intelligence had already suggested Putin could test NATO’s resolve with a limited incursion in the coming years.
            </p>
            <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
              <span>💬</span>
              <span>231</span>
            </div>
          </article>

        </div>

      </div>
    </div>
  );
};

export default TechCategorySection;
