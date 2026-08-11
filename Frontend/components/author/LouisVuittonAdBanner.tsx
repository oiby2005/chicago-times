"use client";

import React from "react";

export default function LouisVuittonAdBanner() {
  return (
    <div className="w-full mt-6 select-none">
      {/* ADVERTISEMENT label */}
      <div className="text-center text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-400 mb-2">
        ADVERTISEMENT
      </div>

      {/* Banner Card */}
      <div className="w-full relative rounded-xs overflow-hidden shadow-sm bg-black group cursor-pointer">
        {/* Ad Image */}
        <div className="w-full aspect-[4/3] relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
            alt="Louis Vuitton Advertisement"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

          {/* Center Brand Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
            <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-[0.2em] text-[#f7f3e9] uppercase drop-shadow-md">
              LOUIS VUITTON
            </h3>
            <p className="font-sans font-semibold text-[8px] sm:text-[9px] tracking-[0.25em] text-[#f7f3e9] uppercase mt-2 drop-shadow-sm">
              LE MONOGRAM, TRANSCENDING GENERATIONS SINCE 1896
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
