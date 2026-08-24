"use client";

import React from "react";
import Link from "next/link";

export const EntertainmentCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-2 pb-4 my-0">
      {/* Section Header with dashed line BELOW the Entertainment text */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#b82e2e] tracking-tight">
          Entertainment
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#fcf0f0] flex items-center justify-center text-[#b82e2e] cursor-pointer hover:bg-[#f7dede]">
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
                <span className="font-sans font-bold text-[11px] tracking-wider text-[#b82e2e] uppercase">
                  NEW
                </span>
              </div>
              <h3 className="font-serif font-bold text-[26px] sm:text-[30px] leading-[1.12] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/the-new-faces-of-the-grand-tour">
                  The new faces of The<br />
                  Grand Tour: We have<br />
                  Jeremy Clarkson’s<br />
                  blessing
                </Link>
              </h3>
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
                Francis Bourgeois, Thomas Holland and James Engelsman are taking the wheel of the hit car show. They say they’re not trying to replace the original three amigos
              </p>
              <div className="mt-1">
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  TV & Radio
                </span>
              </div>
            </div>

            {/* Right Large Hero Image */}
            <div className="md:col-span-4">
              <Link
                href="/article/the-new-faces-of-the-grand-tour"
                className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                  alt="The Grand Tour presenter trio with sports car"
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
                href="/article/abigails-party-tamzin-outhwaite"
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80"
                  alt="Theatre performance stage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
                      REVIEW | FIRST NIGHT
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                    <Link href="/article/abigails-party-tamzin-outhwaite">
                      Abigail’s Party — Tamzin Outhwaite makes Beverly her own
                    </Link>
                  </h4>
                </div>
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  Theatre & Dance
                </span>
              </div>
            </div>

            {/* Mini Story 2 */}
            <div className="flex items-start space-x-3 pl-0 md:pl-1">
              <Link
                href="/article/why-have-men-gone-off-the-rails"
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="Man speaking outdoors"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
                      NEW | REVIEW | SOCIETY
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                    <Link href="/article/why-have-men-gone-off-the-rails">
                      Why have men gone off the rails? They can’t make an honest living
                    </Link>
                  </h4>
                </div>
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  Books
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
                href="/article/the-1m-secret-hiding-in-a-french-garden-shed"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"
                  alt="French garden shed artwork"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
                  REVIEW
                </span>
              </div>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/the-1m-secret-hiding-in-a-french-garden-shed">
                  The £1m secret hiding in a French garden shed... and what happened next
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                TV & Radio
              </span>
            </article>

            {/* Story 2 */}
            <article className="pt-1">
              <Link
                href="/article/the-hilarious-tale-of-a-jilted-bride"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Fringe comedy bride performer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/the-hilarious-tale-of-a-jilted-bride">
                  The hilarious tale of a jilted bride — the best (and worst) Fringe comedy
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                Comedy
              </span>
            </article>
          </div>

          {/* Column 2 of Right Sidebar */}
          <div className="flex flex-col justify-between pl-0 md:pl-2 h-full">
            {/* Story 3 */}
            <article className="pb-3 mb-3 border-b border-dashed border-[#CCCCCC]">
              <Link
                href="/article/recollections-of-an-unrepentant-nazi-mass-murderer"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80"
                  alt="Historical military photo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
                  NEW | HISTORY
                </span>
              </div>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/recollections-of-an-unrepentant-nazi-mass-murderer">
                  Recollections of an unrepentant Nazi mass murderer
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                Books
              </span>
            </article>

            {/* Story 4 */}
            <article className="pt-1">
              <Link
                href="/article/a-real-life-lion-king"
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=600&q=80"
                  alt="Lioness and cub in savanna"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href="/article/a-real-life-lion-king">
                  A real-life Lion King: ‘It’s the holy grail of natural history film-making’
                </Link>
              </h4>
              <span className="font-sans font-bold text-[12px] text-[#111111]">
                TV & Radio
              </span>
            </article>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EntertainmentCategorySection;
