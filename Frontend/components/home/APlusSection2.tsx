"use client";

import React from "react";
import Link from "next/link";

export const APlusSection2: React.FC = () => {
  return (
    <div className="w-full font-sans select-none my-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch border-t border-dashed border-[#CCCCCC] pt-4">
        {/* Left Text Card (6 of 12 cols) */}
        <div className="col-span-12 md:col-span-6 bg-[#F7F4EB] p-6 sm:p-10 flex flex-col justify-center">
          <h2 className="font-serif font-bold text-[26px] sm:text-[34px] leading-[1.15] text-[#111111] hover:underline cursor-pointer mb-4">
            <Link prefetch={true} href="/article/the-gorgeous-tourist-free-adriatic-islands">
              The gorgeous (and tourist-free) Adriatic islands with a royal link
            </Link>
          </h2>
          <p className="font-sans text-[14px] leading-relaxed text-[#444444]">
            Croatia’s Zadar archipelago is a heavenly place — Edward VIII and Wallis Simpson were fans, and this luxe hotel on Dugi Otok is the perfect base
          </p>
        </div>

        {/* Right Photo Card (6 of 12 cols) */}
        <div className="col-span-12 md:col-span-6">
          <Link
            href="/article/the-gorgeous-tourist-free-adriatic-islands"
            className="block relative aspect-[4/3] md:aspect-auto md:h-full w-full overflow-hidden bg-gray-100 group"
          >
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
              alt="Sailboat on Adriatic sea next to Zadar island"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default APlusSection2;
