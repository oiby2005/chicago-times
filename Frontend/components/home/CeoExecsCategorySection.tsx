"use client";

import React from "react";
import Link from "next/link";

export const CeoExecsCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#3A2371] tracking-tight">
          CEOs & Executives
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#f4effc] flex items-center justify-center text-[#3A2371] cursor-pointer hover:bg-[#e9defa]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* 4 Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Card 1 */}
        <article className="flex flex-col justify-start">
          <Link
            href="/article/the-workwear-brands-that-mean-business"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
              alt="The workwear brands that mean business"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="mb-1">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#336699] uppercase">
              SHOPPING
            </span>
          </div>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link prefetch={true} href="/article/the-workwear-brands-that-mean-business">
              The workwear brands that mean business
            </Link>
          </h4>
        </article>

        {/* Card 2 */}
        <article className="flex flex-col justify-start">
          <Link
            href="/article/sign-up-for-the-times-luxx-newsletter"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              alt="Sign up for the Times LUXX newsletter"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="mb-1">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#336699] uppercase">
              NEWSLETTER
            </span>
          </div>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link prefetch={true} href="/article/sign-up-for-the-times-luxx-newsletter">
              Sign up for the Times LUXX newsletter
            </Link>
          </h4>
        </article>

        {/* Card 3 */}
        <article className="flex flex-col justify-start">
          <Link
            href="/article/the-poshest-prams-to-shop-now"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
              alt="The poshest prams to shop now"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="mb-1">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#336699] uppercase">
              SHOPPING
            </span>
          </div>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link prefetch={true} href="/article/the-poshest-prams-to-shop-now">
              The poshest prams to shop now
            </Link>
          </h4>
        </article>

        {/* Card 4 */}
        <article className="flex flex-col justify-start">
          <Link
            href="/article/what-your-posh-cycling-gear-says-about-you"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=600&q=80"
              alt="What your posh cycling gear says about you"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link prefetch={true} href="/article/what-your-posh-cycling-gear-says-about-you">
              What your posh cycling gear says about you
            </Link>
          </h4>
        </article>
      </div>
    </div>
  );
};

export default CeoExecsCategorySection;
