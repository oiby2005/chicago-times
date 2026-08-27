"use client";

import React from "react";
import Link from "next/link";

interface WeekendArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  commentCount?: number;
}

const defaultArticles: WeekendArticle[] = [
  {
    id: "yw1",
    title: "Why It is Impossible to Get a Restaurant Reservation",
    slug: "why-it-is-impossible-to-get-restaurant-reservation",
    summary: "New apps, membership clubs and other middlemen are fighting over access to high-spending customers and the eateries they love.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    commentCount: 363,
  },
  {
    id: "yw2",
    title: "The Cyberattack That Brought a Distant War to Small-Town Minnesota",
    slug: "the-cyberattack-that-brought-distant-war",
    summary: "The water system in Braham was one of dozens affected after federal agencies warned Iran-linked hackers could target U.S. infrastructure.",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
    commentCount: 92,
  },
  {
    id: "yw3",
    title: "Situational Awareness Bets $400 Million on Stealth Chip Startup After Crash",
    slug: "situational-awareness-bets-400-million",
    summary: "The AI-battered hedge fund made a big bet this week in Source Foundry, a private company aiming to reinvent how chips are manufactured.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

export const YourWeekendSection: React.FC = () => {
  const [articles, setArticles] = React.useState<WeekendArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const weekendPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            p.homepagePlacement.includes("Your Weekend")
        );

        weekendPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (weekendPosts.length > 0) {
          const formatted: WeekendArticle[] = weekendPosts.slice(0, 3).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
            commentCount: p.commentsCount || 0,
          }));

          const merged = [...formatted];
          for (let i = 0; i < defaultArticles.length && merged.length < 3; i++) {
            if (!merged.some((m) => m.id === defaultArticles[i].id)) {
              merged.push(defaultArticles[i]);
            }
          }
          setArticles(merged.slice(0, 3));
          return;
        }
      }
    } catch (e) {}
    setArticles(defaultArticles);
  }, []);

  React.useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  const hero = articles[0] || defaultArticles[0];
  const rightTop = articles[1] || defaultArticles[1];
  const rightBottom = articles[2] || defaultArticles[2];

  return (
    <section className="w-full font-sans select-none my-4 pt-2">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          Your Weekend
        </h2>
      </div>

      {/* Main Package Grid: Left Hero (8 cols) | Right Side Stories (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* ==================== LEFT HERO PACKAGE (8 of 12 cols ~ 67%) ==================== */}
        <div className="md:col-span-8 pr-0 md:pr-[0.4cm] flex flex-col justify-between mb-6 md:mb-0">
          <Link
            href={`/article/${hero.slug}`}
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
          >
            <img
              src={hero.imageUrl}
              alt={hero.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div>
            <h3 className="font-serif font-bold text-[24px] sm:text-[28px] leading-[1.15] text-[#111111] hover:underline cursor-pointer mb-2">
              <Link href={`/article/${hero.slug}`}>
                {hero.title}
              </Link>
            </h3>
            {hero.summary && (
              <p className="font-sans text-[13.5px] sm:text-[14px] leading-relaxed text-[#444444] mb-2 line-clamp-3">
                {hero.summary}
              </p>
            )}
            {hero.commentCount !== undefined && hero.commentCount > 0 && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
                <span>💬</span>
                <span>{hero.commentCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* ==================== RIGHT SIDE STORIES (4 of 12 cols ~ 33%) ==================== */}
        <div 
          className="md:col-span-4 pl-0 md:pl-[0.4cm] flex flex-col justify-between border-t md:border-t-0 pt-4 md:pt-0"
          style={{ borderLeft: "1px solid #CCCCCC" }}
        >
          {/* Top Story (Position 2) */}
          <article className="pb-4 border-b border-dashed border-[#CCCCCC] mb-4">
            <Link
              href={`/article/${rightTop.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
            >
              <img
                src={rightTop.imageUrl}
                alt={rightTop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <h4 className="font-serif font-bold text-[17px] sm:text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${rightTop.slug}`}>
                {rightTop.title}
              </Link>
            </h4>
            {rightTop.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                {rightTop.summary}
              </p>
            )}
            {rightTop.commentCount !== undefined && rightTop.commentCount > 0 && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
                <span>💬</span>
                <span>{rightTop.commentCount}</span>
              </div>
            )}
          </article>

          {/* Bottom Story (Position 3) */}
          <article className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-[17px] sm:text-[19px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                <Link href={`/article/${rightBottom.slug}`}>
                  {rightBottom.title}
                </Link>
              </h4>
              {rightBottom.summary && (
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] line-clamp-3">
                  {rightBottom.summary}
                </p>
              )}
            </div>
            {rightBottom.commentCount !== undefined && rightBottom.commentCount > 0 && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1 mt-2">
                <span>💬</span>
                <span>{rightBottom.commentCount}</span>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default YourWeekendSection;
