"use client";

import React from "react";
import Link from "next/link";

export default function WorldPart1Hero() {
  return (
    <section className="w-full bg-white text-[#111111] pt-6 sm:pt-10">
      {/* Top Header Banner for WORLD with increased top spacing */}
      <div className="border-t-2 border-[#111111] border-b border-[#111111] py-3 text-center mb-8">
        <h1 className="font-serif text-[30px] sm:text-[36px] font-extrabold uppercase tracking-[0.16em] text-[#111111] leading-none">
          WORLD
        </h1>
      </div>

      {/* 3-Column Grid with clearly visible vertical grey borders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pb-8">
        {/* Column 1 (Left): Two Horizontal Cards */}
        <div className="pr-0 md:pr-6 pb-6 md:pb-0 flex flex-col justify-between md:border-r md:border-gray-300">
          {/* Card 1 */}
          <article className="flex flex-row items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                <Link href="/article/judge-maria-lourdes-afiuni-regains-full-freedom">
                  Judge María Lourdes Afiuni Regains Full Freedom After More Than 16 Years
                </Link>
              </h2>
              <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                Venezuelan judge María Lourdes Afiuni, one of the most emblematic cases of alleged judicial persecution during the...
              </p>
            </div>
            <div className="w-[120px] sm:w-[135px] shrink-0">
              <Link href="/article/judge-maria-lourdes-afiuni-regains-full-freedom" className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/world/afiuni_judge.jpg"
                  alt="Judge María Lourdes Afiuni case"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </article>

          {/* Clearly visible horizontal grey divider line */}
          <div className="border-b border-gray-300 my-5" />

          {/* Card 2 */}
          <article className="flex flex-row items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                <Link href="/article/human-rights-groups-urge-immediate-release-political-prisoners-venezuela">
                  Human Rights Groups Urge Immediate Release of Political Prisoners After Venezuela Earthquake
                </Link>
              </h2>
              <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                The devastating earthquakes that struck northern Venezuela in late June have not only triggered a humanitarian crisis but...
              </p>
            </div>
            <div className="w-[120px] sm:w-[135px] shrink-0">
              <Link href="/article/human-rights-groups-urge-immediate-release-political-prisoners-venezuela" className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/world/venezuela_city.jpg"
                  alt="Venezuela earthquake affected area"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </article>
        </div>

        {/* Column 2 (Middle): Vertical Card */}
        <div className="px-0 md:px-6 py-6 md:py-0 md:border-r md:border-gray-300">
          <article>
            <Link href="/article/us-strategy-in-venezuela-can-washington-help-rebuild-trust" className="block relative aspect-[16/10] w-full mb-3.5 overflow-hidden bg-gray-100 border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/world/trump_venezuela.jpg"
                alt="U.S. Strategy in Venezuela"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <h2 className="font-serif font-bold text-[19px] sm:text-[20px] leading-[1.2] text-[#990000] hover:text-[#b30000] hover:underline cursor-pointer">
              <Link href="/article/us-strategy-in-venezuela-can-washington-help-rebuild-trust">
                U.S. Strategy in Venezuela: Can Washington Help Rebuild Trust?
              </Link>
            </h2>
            <p className="font-sans text-[13px] leading-[1.42] text-[#555555] mt-2.5">
              Following the political upheaval in Venezuela during 2026, the United States has shifted from a strategy centered on sanctions and diplomatic isolation to one focused on political stabilization,...
            </p>
          </article>
        </div>

        {/* Column 3 (Right): Vertical Card */}
        <div className="pl-0 md:pl-6 pt-6 md:pt-0">
          <article>
            <Link href="/article/the-livestream-that-ended-with-police-outside-the-door" className="block relative aspect-[16/10] w-full mb-3.5 overflow-hidden bg-gray-100 border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/world/perez_hilton.jpg"
                alt="The Livestream That Ended With Police Outside the Door"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <h2 className="font-serif font-bold text-[19px] sm:text-[20px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href="/article/the-livestream-that-ended-with-police-outside-the-door">
                The Livestream That Ended With Police Outside the Door
              </Link>
            </h2>
            <p className="font-sans text-[13px] leading-[1.42] text-[#555555] mt-2.5">
              For years, Perez Hilton made a living by talking about other people&apos;s lives. This week, the internet was talking about his.Celebrity blogger Perez Hilton, whose real name is Mario Lavandeira Jr.,...
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
