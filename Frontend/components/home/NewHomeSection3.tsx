"use client";

import React from "react";
import Link from "next/link";

export default function NewHomeSection3() {
  return (
    <section className="w-full bg-white text-[#111111] pt-2 pb-6">
      {/* 12-Column Grid Alignment matching Section 1 & Section 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* ==================== LEFT MAIN CONTAINER (9 of 12 Cols ~ 75%) ==================== */}
        <div className="lg:col-span-9 pr-0 lg:pr-6 lg:border-r lg:border-gray-300">
          
          {/* Top Divider Line across Left Column */}
          <div className="border-t border-black pt-3 pb-1 mb-2" />

          {/* 3-Column Card Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-4">
            
            {/* Card 1: Private Equity Boyfriend */}
            <article className="flex flex-col justify-between">
              <div>
                <Link
                  href="/article/this-summers-hottest-arm-candy-is-a-private-equity-boyfriend"
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80"
                    alt="This Summer's Hottest Arm Candy Is a Private Equity Boyfriend"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <h3 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:text-gray-800 hover:underline cursor-pointer">
                  <Link href="/article/this-summers-hottest-arm-candy-is-a-private-equity-boyfriend">
                    This Summer’s Hottest Arm Candy Is a Private Equity Boyfriend
                  </Link>
                </h3>
              </div>
              <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                <span>💬</span>
                <span>456</span>
              </div>
            </article>

            {/* Card 2: Lost Civilization */}
            <article className="flex flex-col justify-between">
              <div>
                <Link
                  href="/article/a-lost-civilization-is-baffling-experts-and-rewriting-chinas-origin-story"
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80"
                    alt="A Lost Civilization Is Baffling Experts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white font-sans text-[9px] px-1 py-0.5 rounded-2xs pointer-events-none">
                    Photo: ZUMA Press
                  </div>
                </Link>
                <h3 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:text-gray-800 hover:underline cursor-pointer">
                  <Link href="/article/a-lost-civilization-is-baffling-experts-and-rewriting-chinas-origin-story">
                    A Lost Civilization Is Baffling Experts and Rewriting China’s Origin Story
                  </Link>
                </h3>
              </div>
              <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                <span>💬</span>
                <span>151</span>
              </div>
            </article>

            {/* Card 3: My Secret Diet */}
            <article className="flex flex-col justify-between">
              <div>
                <Link
                  href="/article/my-secret-diet-is-a-trip-to-europe"
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=600&q=80"
                    alt="My Secret Diet Is a Trip to Europe"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <h3 className="font-serif font-bold text-[17px] xl:text-[18px] leading-[1.22] text-[#111111] hover:text-gray-800 hover:underline cursor-pointer">
                  <Link href="/article/my-secret-diet-is-a-trip-to-europe">
                    My Secret Diet Is a Trip to Europe
                  </Link>
                </h3>
              </div>
              <div className="font-sans text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                <span>💬</span>
                <span>326</span>
              </div>
            </article>

          </div>

          {/* Bottom Line inside Left Column */}
          <div className="border-b border-gray-300 pt-2" />

        </div>

        {/* ==================== RIGHT SIDEBAR CONTAINER (3 of 12 Cols ~ 25%) ==================== */}
        <div className="lg:col-span-3 pl-0 lg:pl-6 pt-3 lg:pt-0 flex flex-col gap-4">
          
          {/* Top Advertisement Label */}
          <div className="text-right lg:text-center">
            <span className="text-[10px] font-sans text-gray-400 uppercase tracking-widest">
              Advertisement
            </span>
          </div>

          {/* MarketViews Sponsored Banner */}
          <Link
            href="/article/what-is-the-latest-on-etfs"
            className="bg-[#0e2744] text-white overflow-hidden shadow-xs cursor-pointer group border border-[#0e2744] block"
          >
            <div className="aspect-[16/8] w-full overflow-hidden relative bg-[#051326]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
                alt="Stock Market Board"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3.5">
              <h4 className="font-sans font-bold text-[14px] leading-tight text-white group-hover:underline">
                What is the latest on ETFs?
              </h4>
              <span className="font-serif italic text-[11.5px] text-gray-300 block mt-0.5">
                MarketViews
              </span>
              <div className="flex items-center justify-between pt-3">
                <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <div className="w-6 h-6 bg-[#0274b6] group-hover:bg-[#005599] flex items-center justify-center text-white transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* "Got a tip for us?" Callout Box */}
          <div className="border border-gray-400 p-3 bg-white flex items-center gap-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-7 h-7 shrink-0 text-black flex items-center justify-center">
              <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="1" />
                <path d="M22 6L12 13L2 6" />
              </svg>
            </div>
            <div>
              <span className="font-sans font-bold text-[13px] text-[#111111] leading-tight block">
                Got a tip for us?
              </span>
              <Link
                href="/newsletter"
                className="font-sans font-bold text-[13px] text-[#111111] leading-tight block hover:underline"
              >
                Here’s how to submit
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
