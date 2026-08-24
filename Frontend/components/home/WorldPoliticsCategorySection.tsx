"use client";

import React from "react";
import Link from "next/link";

interface WorldPoliticsArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  imageUrl: string;
}

const worldPoliticsArticles: WorldPoliticsArticle[] = [
  {
    id: "wp1",
    title: "Check your helicopters, Greece tells pilots after honeymoon crash",
    slug: "check-your-helicopters-greece-tells-pilots-after-honeymoon-crash",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wp2",
    title: "Lawrence of Arabia’s anger at being ‘banned’ from travel abroad",
    slug: "lawrence-of-arabias-anger-at-being-banned-from-travel-abroad",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wp3",
    title: "By gum, NHS’s AI phone system struggles with Yorkshire accents",
    slug: "by-gum-nhs-ai-phone-system-struggles-with-yorkshire-accents",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wp4",
    categoryTag: "THE TIMES DIARY",
    title: "Minister literally doesn’t care if you say less or fewer",
    slug: "minister-literally-doesnt-care-if-you-say-less-or-fewer",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
];

export const WorldPoliticsCategorySection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pb-2 my-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[0.4cm]">
        {worldPoliticsArticles.map((art) => (
          <article
            key={art.id}
            className="flex flex-col justify-start"
          >
            {/* Image */}
            <Link
              href={`/article/${art.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Optional Category Tag e.g. THE TIMES DIARY */}
            {art.categoryTag && (
              <div className="mb-1">
                <span className="font-sans font-bold text-[11px] tracking-wider text-[#00558c] uppercase">
                  {art.categoryTag}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href={`/article/${art.slug}`}>
                {art.title}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WorldPoliticsCategorySection;
