"use client";

import React from "react";
import Link from "next/link";

export interface MoreArticleCard {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  image: string;
  slug: string;
}

const moreArticlesData: MoreArticleCard[] = [
  {
    id: "m1",
    category: "POLITICS",
    title: "Trump Declares Iran Ceasefire 'Over,' Raising Questions About the Next Phase of the Conflict",
    author: "Ronda B",
    date: "Jul 19, 2026",
    image: "/images/kevin_warsh.jpg",
    slug: "trump-declares-iran-ceasefire-over",
  },
  {
    id: "m2",
    category: "BUSINESS",
    title: "U.S. Stocks End Higher as SK Hynix's Wall Street Debut and Meta's AI Momentum Lift Markets",
    author: "Ronda B",
    date: "Jul 11, 2026",
    image: "/images/hero-ai-software.jpg",
    slug: "us-stocks-end-higher-sk-hynix",
  },
  {
    id: "m3",
    category: "BUSINESS",
    title: "New Exclusive Decoration Design & Fit Out LLC – Structural Acrylic Pioneers in the UAE",
    author: "Ronda B",
    date: "Jul 15, 2026",
    image: "/images/berkshire_resort.jpg",
    slug: "new-exclusive-decoration-design",
  },
  {
    id: "m4",
    category: "SPORTS",
    title: "Argentina Edge Switzerland in Extra Time to Set Up World Cup Semi-Final Clash With England",
    author: "Ronda B",
    date: "Jul 12, 2026",
    image: "/images/ariana-grande.jpg",
    slug: "argentina-edge-switzerland-world-cup",
  },
];

interface MoreFromWsjSectionProps {
  title?: string;
}

export default function MoreFromWsjSection({
  title = "MORE FROM THE WALL STREET JOURNAL",
}: MoreFromWsjSectionProps) {
  return (
    <section className="w-full pt-8 mt-10 border-t border-[#111111] select-none">
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="font-serif font-bold text-sm tracking-wider uppercase text-[#111111]">
          {title}
        </h3>
      </div>

      {/* 4-Column Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {moreArticlesData.map((item) => (
          <Link
            key={item.id}
            href={`/article/${item.slug}`}
            className="group flex flex-col justify-between h-full"
          >
            <div>
              {/* Image Container with Overlay Category Badge */}
              <div className="w-full aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category Overlay Badge */}
                <span className="bg-black/85 text-white font-sans text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs absolute left-2.5 bottom-2.5 z-10">
                  {item.category}
                </span>
              </div>

              {/* Headline */}
              <h4 className="font-serif font-bold text-sm sm:text-[15px] text-[#111111] leading-snug mt-3 group-hover:underline line-clamp-3">
                {item.title}
              </h4>
            </div>

            {/* Author & Date Footer Row */}
            <div className="flex items-center justify-between pt-3 text-[11px] text-gray-400 font-sans mt-auto">
              <span>{item.author}</span>
              <span>{item.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
