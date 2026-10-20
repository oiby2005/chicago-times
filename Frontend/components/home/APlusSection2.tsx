"use client";

import React from "react";
import Link from "next/link";

interface APlus2Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  category?: string;
}

const defaultHero: APlus2Article = {
  id: "aplus2_1",
  title: "The gorgeous (and tourist-free) Adriatic islands with a royal link",
  slug: "the-gorgeous-tourist-free-adriatic-islands",
  summary: "Croatia’s Zadar archipelago is a heavenly place — Edward VIII and Wallis Simpson were fans, and this luxe hotel on Dugi Otok is the perfect base",
  imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=webp&fit=crop&w=1000&q=80",
  category: "TRAVEL",
};

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 160);
};

export const APlusSection2: React.FC = () => {
  const [hero, setHero] = React.useState<APlus2Article>(defaultHero);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const aplusPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            p.homepagePlacement.includes("A+ Section 2")
        );

        aplusPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (aplusPosts.length > 0) {
          const match = aplusPosts[0];
          setHero({
            id: match.id,
            title: match.title,
            slug: match.slug || match.id,
            summary: match.subheadline || extractText(match.bodyContent) || "",
            imageUrl: match.thumbnail || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=webp&fit=crop&w=1000&q=80",
            category: match.category || match.mainCategory || "TRAVEL",
          });
          return;
        }
      }
    } catch (e) {}
    setHero(defaultHero);
  }, []);

  React.useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  return (
    <div className="w-full font-sans my-4 relative">
      {/* Category Tag in Top Right of Section */}
      <div className="absolute top-2 right-2 md:top-6 md:right-6 bg-black text-white text-[8px] sm:text-[9px] md:text-[11px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 md:px-2.5 md:py-1 z-10 shadow-xs">
        {hero.category || "TRAVEL"}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch border-t-0 md:border-t border-dashed border-[#CCCCCC] pt-0 md:pt-4">
        {/* Left Text Card (6 of 12 cols) */}
        <div className="col-span-12 md:col-span-6 bg-[#F7F4EB] p-6 sm:p-10 flex flex-col justify-center">
          <h2 className="font-serif font-bold text-[26px] sm:text-[34px] leading-[1.15] text-[#111111] hover:underline cursor-pointer mb-4">
            <Link href={`/article/${hero.slug}`}>
              {hero.title}
            </Link>
          </h2>
          {hero.summary && (
            <p className="font-sans text-[14px] leading-relaxed text-[#444444] line-clamp-4">
              {hero.summary}
            </p>
          )}
        </div>

        {/* Right Photo Card (6 of 12 cols) */}
        <div className="col-span-12 md:col-span-6">
          <Link
            href={`/article/${hero.slug}`}
            className="block relative aspect-[4/3] md:aspect-auto md:h-full w-full overflow-hidden bg-gray-100 group"
          >
            <img
              src={hero.imageUrl}
              alt={hero.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default APlusSection2;
