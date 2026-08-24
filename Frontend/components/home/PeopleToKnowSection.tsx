"use client";

import React from "react";
import Link from "next/link";

export const PeopleToKnowTop: React.FC = () => {
  return (
    <div className="w-full font-sans select-none mt-2 mb-0 pt-0 pb-0">
      {/* Section Title without bottom border */}
      <div className="mb-3">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          People to Know
        </h2>
      </div>

      {/* 3-Column Package Grid Top Part */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pt-1 pb-0 items-stretch">
        
        {/* COLUMN 1: LEFT CARD PHOTO */}
        <article 
          className="pr-0 md:pr-4 flex flex-col justify-start pb-0"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <Link
            href="/article/the-lakers-heiress-nba-succession-drama"
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 group"
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
              alt="Lakers Heiress"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </article>

        {/* COLUMN 2: CENTER AD 04 BOX */}
        <div 
          className="px-0 md:px-4 py-0 flex flex-col items-center justify-start pb-0"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <div className="w-full aspect-[16/10] bg-[#E8E3D7] border border-[#D6CEBF] flex items-center justify-center text-center p-4">
            <span className="font-sans font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
              Ad 04
            </span>
          </div>
        </div>

        {/* COLUMN 3: TOP STORY */}
        <div className="pl-0 md:pl-4 pt-0 flex flex-col justify-start pb-0">
          <article className="pb-2.5 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href="/article/how-trumps-executive-assistant-became-talk-of-washington">
                How Trump’s Ever-Present Executive Assistant Became the Talk of Washington
              </Link>
            </h4>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
              Natalie Harp, a personal aide to the president, has become an object of fascination for both the left and right.
            </p>
            <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
              <span>💬</span>
              <span>2,008</span>
            </div>
          </article>
        </div>

      </div>
    </div>
  );
};

export const PeopleToKnowBottom: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-0 mt-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pt-0 pb-2 items-stretch">
        
        {/* COLUMN 1: LEFT CARD HEADLINE + PARAGRAPH */}
        <div 
          className="pr-0 md:pr-4 flex flex-col justify-between pt-2"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <div>
            <h3 className="font-serif font-bold text-[18px] sm:text-[20px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
              <Link href="/article/the-lakers-heiress-nba-succession-drama">
                The Lakers Heiress at the Center of the NBA’s Nastiest Succession Drama
              </Link>
            </h3>
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
              When Mark Walter sold the Lakers last week, it touched off an unexpected side battle: the handpicked inheritor of Jerry Buss’ franchise vs. five of her siblings.
            </p>
          </div>
          <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1 mt-2">
            <span>💬</span>
            <span>152</span>
          </div>
        </div>

        {/* COLUMN 2: CENTER SPACER */}
        <div 
          className="px-0 md:px-4 py-0"
          style={{ borderRight: "1px solid #CCCCCC" }}
        />

        {/* COLUMN 3: BOTTOM STORY (What to Know About Florida Progressive Angie Nixon) */}
        <div className="pl-0 md:pl-4 pt-2 flex flex-col justify-between">
          <article className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                <Link href="/article/what-to-know-about-florida-progressive-angie-nixon">
                  What to Know About Florida Progressive Angie Nixon
                </Link>
              </h4>
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2">
                The Democratic socialist and state representative scored an upset victory in Florida’s Senate primary.
              </p>
            </div>
            <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1 mt-1">
              <span>💬</span>
              <span>195</span>
            </div>
          </article>
        </div>

      </div>
    </div>
  );
};

export const PeopleToKnowSection: React.FC = () => {
  return (
    <>
      <PeopleToKnowTop />
      <PeopleToKnowBottom />
    </>
  );
};

export default PeopleToKnowSection;
