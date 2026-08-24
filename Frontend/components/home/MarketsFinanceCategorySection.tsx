"use client";

import React from "react";
import Link from "next/link";

export const MarketsFinanceCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#3A2371] tracking-tight">
          Markets & Finance
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
            href="/article/eddie-richardson-south-london-gangster"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="/images/world/afiuni_judge.jpg"
              alt="Eddie Richardson, south London gangster"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link href="/article/eddie-richardson-south-london-gangster">
              Eddie Richardson, south London gangster
            </Link>
          </h4>
        </article>

        {/* Card 2 */}
        <article className="flex flex-col justify-start">
          <Link
            href="/article/enyd-williams-powerhouse-at-bbc-radio-drama"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="/images/world/jose_rizal.jpg"
              alt="Enyd Williams, powerhouse at BBC radio drama"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link href="/article/enyd-williams-powerhouse-at-bbc-radio-drama">
              Enyd Williams, powerhouse at BBC radio drama
            </Link>
          </h4>
        </article>

        {/* Card 3 */}
        <article className="flex flex-col justify-start">
          <Link
            href="/article/tom-chadbon-game-of-thrones-actor"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80"
              alt="Tom Chadbon, Game of Thrones actor"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link href="/article/tom-chadbon-game-of-thrones-actor">
              Tom Chadbon, Game of Thrones actor
            </Link>
          </h4>
        </article>

        {/* Card 4 */}
        <article className="flex flex-col justify-start">
          <Link
            href="/article/frank-beard-beardless-zz-top-drummer"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
          >
            <img
              src="/images/world/perez_hilton.jpg"
              alt="Frank Beard, beardless ZZ Top drummer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
            <Link href="/article/frank-beard-beardless-zz-top-drummer">
              Frank Beard, beardless ZZ Top drummer
            </Link>
          </h4>
        </article>
      </div>
    </div>
  );
};

export default MarketsFinanceCategorySection;
