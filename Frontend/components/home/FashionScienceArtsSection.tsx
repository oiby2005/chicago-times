"use client";

import React from "react";
import Link from "next/link";

export const FashionScienceArtsSection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-2 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* ==================== COLUMN 1: FASHION ==================== */}
        <div className="flex flex-col justify-start">
          {/* Top Black Bar Header */}
          <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
              <Link href="/fashion" className="hover:underline">
                Fashion
              </Link>
            </h3>
            <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
          </div>

          {/* Main Photo */}
          <Link
            href="/article/why-slow-job-growth-doesnt-mean-labor-market-trouble"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
              alt="Fashion and politics press conference"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Main Headline */}
          <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
            <Link prefetch={true} href="/article/why-slow-job-growth-doesnt-mean-labor-market-trouble">
              Why Slow Job Growth Doesn’t Mean the Labor Market Is in Trouble
            </Link>
          </h4>

          {/* Sub Article 1 */}
          <div className="pt-1 pb-2">
            <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link prefetch={true} href="/article/week-ahead-for-fx-bonds">
                Week Ahead for FX, Bonds: U.S. Inflation Data in Focus
              </Link>
            </h5>
          </div>

          {/* Sub Article 2 */}
          <div className="pt-1">
            <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link prefetch={true} href="/article/us-lost-23000-jobs-in-july">
                U.S. Lost 23,000 Jobs in July, While
              </Link>
            </h5>
          </div>
        </div>

        {/* ==================== COLUMN 2: SCIENCE ==================== */}
        <div className="flex flex-col justify-start">
          {/* Top Black Bar Header */}
          <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
              <Link href="/science" className="hover:underline">
                Science
              </Link>
            </h3>
            <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
          </div>

          {/* Main Photo */}
          <Link
            href="/article/nycs-pied-a-terre-owners-hunt-creative-ways-tax"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80"
              alt="Modern eco villa with pool"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Main Headline */}
          <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
            <Link prefetch={true} href="/article/nycs-pied-a-terre-owners-hunt-creative-ways-tax">
              NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax
            </Link>
          </h4>

          {/* Sub Article 1 */}
          <div className="pt-1 pb-2">
            <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link prefetch={true} href="/article/dc-home-market-gets-billionaire-bump">
                The D.C. Home Market Gets a Billionaire Bump
              </Link>
            </h5>
          </div>

          {/* Sub Article 2 */}
          <div className="pt-1">
            <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link prefetch={true} href="/article/house-of-the-week-built-off-site">
                House of the Week: Built Off-Site and
              </Link>
            </h5>
          </div>
        </div>

        {/* ==================== COLUMN 3: ARTS ==================== */}
        <div className="flex flex-col justify-start">
          {/* Top Black Bar Header */}
          <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
              <Link href="/arts" className="hover:underline">
                Arts
              </Link>
            </h3>
            <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
          </div>

          {/* Main Photo */}
          <Link
            href="/article/horse-racings-triple-crown-may-no-longer-be-worth-chasing"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
          >
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
              alt="White sports car on scenic road"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Main Headline */}
          <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
            <Link prefetch={true} href="/article/horse-racings-triple-crown-may-no-longer-be-worth-chasing">
              Horse Racing’s Triple Crown May No Longer Be Worth Chasing
            </Link>
          </h4>

          {/* Sub Article 1 */}
          <div className="pt-1 pb-2">
            <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link prefetch={true} href="/article/the-king-of-soccer-went-rogue">
                The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire
              </Link>
            </h5>
          </div>

          {/* Sub Article 2 */}
          <div className="pt-1">
            <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link prefetch={true} href="/article/hes-known-as-big-dumper-but-this">
                He’s Known as Big Dumper, but This
              </Link>
            </h5>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FashionScienceArtsSection;
