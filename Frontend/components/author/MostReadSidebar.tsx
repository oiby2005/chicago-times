"use client";

import React from "react";
import Link from "next/link";

export interface MostReadItem {
  rank: number;
  title: string;
  views: string;
  slug: string;
}

const mostReadData: MostReadItem[] = [
  {
    rank: 1,
    title: "How Serious Is Joe Biden's Cancer as His Son Says the Disease Has Spread Further",
    views: "9 views",
    slug: "biden-cancer-disease-spread-further",
  },
  {
    rank: 2,
    title: "People at This Hospital Reported Seeing a Grim Reaper on the Roof",
    views: "8 views",
    slug: "grim-reaper-on-hospital-roof",
  },
  {
    rank: 3,
    title: "Pax Silica Could Transform the Philippines. But Who Really Benefits?",
    views: "6 views",
    slug: "pax-silica-could-transform-philippines",
  },
  {
    rank: 4,
    title: "The Bodies Were Finally Found. Gaza Is Only Beginning to Grieve.",
    views: "5 views",
    slug: "bodies-finally-found-gaza-grieve",
  },
];

export default function MostReadSidebar() {
  return (
    <aside className="w-full bg-white border border-[#e5e7eb] rounded-xs p-5 select-none">
      {/* Header with Trending Up Icon */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-3 mb-4">
        <svg
          className="w-4 h-4 text-[#111111]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#111111]">
          MOST READ
        </h3>
      </div>

      {/* List */}
      <div className="divide-y divide-[#f1f5f9]">
        {mostReadData.map((item) => (
          <Link
            key={item.rank}
            href={`/article/${item.slug}`}
            className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0 group"
          >
            {/* Rank Number */}
            <span className="font-serif font-bold text-lg text-gray-300 group-hover:text-[#111111] transition-colors shrink-0 w-4">
              {item.rank}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#111111] leading-snug group-hover:underline line-clamp-2">
                {item.title}
              </h4>
              <span className="font-sans text-[10px] text-gray-400 block mt-1">
                {item.views}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
