"use client";

import React from "react";
import Link from "next/link";

export interface RecentArticle {
  id: string;
  title: string;
  date: string;
  image: string;
  slug?: string;
}

const recentArticlesData: RecentArticle[] = [
  {
    id: "r1",
    title: "Automakers Still Reluctant to Move...",
    date: "Jul 13, 2026",
    image: "/images/bangkok-factory.jpg",
    slug: "automakers-reluctant-to-move",
  },
  {
    id: "r2",
    title: "Mexico–US Relations Face New Strain After...",
    date: "Jul 13, 2026",
    image: "/images/handcuffs-money.jpg",
    slug: "mexico-us-relations-strain",
  },
  {
    id: "r3",
    title: "Trump Administration Subpoenas New York...",
    date: "Jul 13, 2026",
    image: "/images/nyc-skyscrapers.jpg",
    slug: "trump-subpoenas-ny",
  },
  {
    id: "r4",
    title: "Andrew and Tristan Tate Arrested in US...",
    date: "Jul 20, 2026",
    image: "/images/investigator-magnifying-glass.jpg",
    slug: "tate-brothers-arrested",
  },
  {
    id: "r5",
    title: "Court Hears Text Messages Between...",
    date: "Jul 25, 2026",
    image: "/images/ariana-grande.jpg",
    slug: "court-hears-text-messages",
  },
  {
    id: "r6",
    title: "More Than 600 US Troops Injured as Ira...",
    date: "Jul 28, 2026",
    image: "/images/labor_market.jpg",
    slug: "us-troops-injured",
  },
  {
    id: "r7",
    title: "Trump Says New US-Iran Nuclear Talks to...",
    date: "Aug 03, 2026",
    image: "/images/kevin_warsh.jpg",
    slug: "trump-iran-nuclear-talks",
  },
  {
    id: "r8",
    title: "Armed Suspect Detained Near Trump'...",
    date: "Aug 05, 2026",
    image: "/images/dc-townhouse.jpg",
    slug: "armed-suspect-detained",
  },
  {
    id: "r9",
    title: "The Livestream That Ended With Police...",
    date: "Aug 08, 2026",
    image: "/images/podcast-tech-news.jpg",
    slug: "livestream-ended-with-police",
  },
];

interface RecentInUsSidebarProps {
  categoryName?: string;
}

export default function RecentInUsSidebar({ categoryName = "US" }: RecentInUsSidebarProps) {
  return (
    <aside className="w-full select-none">
      {/* Sidebar Header */}
      <div className="border-b border-[#111111] pb-1.5 mb-4">
        <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#111111]">
          RECENT IN {categoryName}
        </h3>
      </div>

      {/* List of Recent Articles */}
      <div className="divide-y divide-[#f1f5f9]">
        {recentArticlesData.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.slug || "biden-cancer-disease-spread-further"}`}
            className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0 group"
          >
            {/* Thumbnail Image */}
            <div className="w-[88px] h-[60px] shrink-0 overflow-hidden bg-gray-100 rounded-xs">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Article Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-bold text-[13px] text-[#111111] leading-[1.25] group-hover:underline line-clamp-2">
                {item.title}
              </h4>
              <span className="font-sans text-[11px] text-gray-400 block mt-1">
                {item.date}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
