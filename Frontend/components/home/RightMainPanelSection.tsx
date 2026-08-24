"use client";

import React from "react";
import Link from "next/link";

interface RightMainPanelArticle {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  imageAlt: string;
}

const rightPanelArticles: RightMainPanelArticle[] = [
  {
    id: "1",
    title: "Prince Harry and Meghan Markle to Return to the U.S.",
    slug: "prince-harry-and-meghan-markle-return-uk",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Prince Harry and Meghan Markle",
  },
  {
    id: "2",
    title: "Prince Harry and Meghan Markle to Return to the U.S.",
    slug: "prince-harry-and-meghan-markle-return-uk-2",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Prince Harry and Meghan Markle",
  },
];

export const RightMainPanelSection: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between font-sans select-none space-y-4">
      {rightPanelArticles.map((article) => (
        <article key={article.id} className="flex flex-col justify-between flex-1">
          <Link href={`/article/${article.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group">
            <img
              src={article.imageUrl}
              alt={article.imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h3 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
            <Link href={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
        </article>
      ))}
    </div>
  );
};

export default RightMainPanelSection;
