"use client";

import React from "react";
import Link from "next/link";

interface OpinionArticle {
  id: string;
  author: string;
  title: string;
  slug: string;
  imageUrl: string;
  isCircularImage?: boolean;
}

const opinionArticles: OpinionArticle[] = [
  {
    id: "1",
    author: "JAMES TARANTO",
    title: "Justice Samuel Alito: ‘Practical Originalism’ and Its Facile Critics",
    slug: "justice-samuel-alito-practical-originalism",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    isCircularImage: true,
  },
  {
    id: "2",
    author: "THE EDITORIAL BOARD",
    title: "The Federal Reserve Status Quo vs. Kevin Warsh",
    slug: "federal-reserve-status-quo-vs-kevin-warsh",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    isCircularImage: false,
  },
  {
    id: "3",
    author: "THE EDITORIAL BOARD",
    title: "America’s Low-Hire, Low-Fire Labor Market",
    slug: "americas-low-hire-low-fire-labor-market",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80",
    isCircularImage: false,
  },
  {
    id: "4",
    author: "THE EDITORIAL BOARD",
    title: "The Saudis Spurn the Abraham Accords",
    slug: "saudis-spurn-abraham-accords",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=150&q=80",
    isCircularImage: false,
  },
  {
    id: "5",
    author: "THE EDITORIAL BOARD",
    title: "Russia Hears From Lindsey Graham",
    slug: "russia-hears-from-lindsey-graham",
    imageUrl: "/images/world/odesa_port.jpg",
    isCircularImage: false,
  },
];

export const OpinionSection: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between font-sans select-none">
      {/* Section Header */}
      <div className="pb-1 mb-1">
        <h2 className="font-serif font-bold text-[21px] sm:text-[22px] text-[#8b6f37] leading-none">
          Opinion
        </h2>
      </div>

      {/* Opinion Articles List */}
      <div className="flex-1 flex flex-col justify-between divide-y divide-dashed divide-[#D6CEBF]">
        {opinionArticles.map((article) => (
          <article key={article.id} className="py-2 flex items-start space-x-3 first:pt-0 last:pb-0">
            {/* Image */}
            <div className="shrink-0 pt-0.5">
              <img
                src={article.imageUrl}
                alt={article.author}
                className={`w-[46px] h-[46px] object-cover bg-gray-100 border border-gray-200 ${
                  article.isCircularImage ? "rounded-full" : "rounded-none"
                }`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-sans font-bold text-[9.5px] text-[#8b6f37] uppercase tracking-wider mb-0.5">
                {article.author}
              </div>
              <h3 className="font-serif font-bold text-[13.5px] sm:text-[14px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                <Link prefetch={true} href={`/article/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OpinionSection;
