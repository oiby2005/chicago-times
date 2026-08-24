"use client";

import React from "react";
import Link from "next/link";

export const PoliticsCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-3 pb-2 my-0">
      {/* Section Title without top border */}
      <div className="mb-3">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          Politics
        </h2>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-start">
        
        {/* COLUMN 1 */}
        <article 
          className="pr-0 md:pr-4 flex flex-col justify-start"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <Link
            href="/article/hegseth-strips-security-clearance-biden-air-force-secretary"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
          >
            <img
              src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80"
              alt="Ballot Box"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h3 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
            <Link href="/article/hegseth-strips-security-clearance-biden-air-force-secretary">
              Hegseth Strips Security Clearance From Biden’s Air Force Secretary
            </Link>
          </h3>
          <p className="font-sans text-[13px] leading-relaxed text-[#555555]">
            Frank Kendall, accused of leaking sensitive information, is the latest former defense official to lose access to classified information.
          </p>
        </article>

        {/* COLUMN 2 */}
        <article 
          className="px-0 md:px-4 py-4 md:py-0 flex flex-col justify-start"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <Link
            href="/article/hegseth-strips-security-clearance-biden-air-force-secretary-2"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
          >
            <img
              src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80"
              alt="Ballot Box"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h3 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
            <Link href="/article/hegseth-strips-security-clearance-biden-air-force-secretary-2">
              Hegseth Strips Security Clearance From Biden’s Air Force Secretary
            </Link>
          </h3>
          <p className="font-sans text-[13px] leading-relaxed text-[#555555]">
            Frank Kendall, accused of leaking sensitive information, is the latest former defense official to lose access to classified information.
          </p>
        </article>

        {/* COLUMN 3 */}
        <div className="pl-0 md:pl-4 pt-4 md:pt-0 flex flex-col justify-start">
          {/* Top Story */}
          <article className="pb-2.5 mb-2.5 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href="/article/trump-showed-up-at-rally-with-lustrous-locks">
                Trump Showed Up at a Rally With Lustrous Locks. The Memes Won’t Stop.
              </Link>
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555]">
              The president’s hair looked more voluminous at an event in Las Vegas, and the internet was quick to respond.
            </p>
          </article>

          {/* Bottom Story */}
          <article className="pt-0">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href="/article/trump-revives-attempt-to-fire-fed-governor-lisa-cook">
                Trump Revives Attempt to Fire Fed Governor Lisa Cook
              </Link>
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555]">
              The move, outlined in a White House letter to Cook this week, follows a Supreme Court ruling in June that blocked an earlier attempt.
            </p>
          </article>
        </div>

      </div>
    </div>
  );
};

export default PoliticsCategorySection;
