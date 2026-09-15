"use client";

import React from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface PeopleArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string;
  commentCount?: number;
  publishedAt?: number | string;
}

const formatTimeAgo = (timestamp?: number | string): string => {
  if (!timestamp) return "2 hours ago";
  const now = Date.now();
  const time = typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp;
  if (isNaN(time) || time <= 0) return "2 hours ago";
  const diffMs = Math.max(0, now - time);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const defaultArticles: PeopleArticle[] = [
  // Position 1: Column 1 Left Hero (California Wildfire)
  {
    id: "ptk1",
    title: "Who Pays for Wildfire Damage? California Can’t Agree",
    slug: "who-pays-for-wildfire-damage-california-cant-agree",
    summary: "Lawmakers balk at Newsom's proposal to limit utilities' wildfire liabilities, sending shares down sharply",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=webp&fit=crop&w=600&q=80",
    publishedAt: Date.now() - 2 * 3600 * 1000,
  },
  // Position 2: Column 2 Center Top Article (Seattle and D.C.)
  {
    id: "ptk2",
    title: "Seattle and D.C. Are Bucking the Trend by Attracting Families With Kids",
    slug: "seattle-and-dc-are-bucking-the-trend-attracting-families-with-kids",
    summary: "The number of kids rose 10% in both places, even as it fell in most other similar cities",
    publishedAt: Date.now() - 4 * 3600 * 1000,
  },
  // Position 3: Column 3 Right Top Article (The Final Solution...)
  {
    id: "ptk3",
    title: "‘The Final Solution to the Jewish Question’ Review: Confronting the Oldest Hatred",
    slug: "the-final-solution-to-the-jewish-question-review",
    summary: "The author of ‘People Love Dead Jews’ argues that rising antisemitism cannot be fought using the methods that have failed before.",
    publishedAt: Date.now() - 6 * 3600 * 1000,
  },
  // Position 4: Column 3 Right Bottom Article (How Trump's...)
  {
    id: "ptk4",
    title: "How Trump’s Ever-Present Executive Assistant Became the Talk of Washington",
    slug: "how-trumps-executive-assistant-became-talk-of-washington",
    summary: "Natalie Harp, a personal aide to the president, has become an object of fascination for both the left and right.",
    publishedAt: Date.now() - 9 * 3600 * 1000,
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 180);
};

const usePeopleToKnowArticles = () => {
  const [articles, setArticles] = React.useState<PeopleArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const ptkPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            p.homepagePlacement.includes("People to know")
        );

        ptkPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (ptkPosts.length > 0) {
          const formatted: PeopleArticle[] = ptkPosts.slice(0, 4).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=webp&fit=crop&w=600&q=80",
            commentCount: p.commentsCount || 0,
            publishedAt: p.publishedAt,
          }));

          const merged = [...formatted];
          for (let i = 0; i < defaultArticles.length && merged.length < 4; i++) {
            if (!merged.some((m) => m.id === defaultArticles[i].id)) {
              merged.push(defaultArticles[i]);
            }
          }
          setArticles(merged.slice(0, 4));
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

  return articles;
};

export const PeopleToKnowTop: React.FC = () => {
  const articles = usePeopleToKnowArticles();
  const leftHero = articles[0] || defaultArticles[0];
  const centerTop = articles[1] || defaultArticles[1];
  const rightTop = articles[2] || defaultArticles[2];

  return (
    <div className="w-full font-sans select-none mt-2 mb-0 pt-0 pb-0">
      <div className="mb-3">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          People to Know
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pt-1 pb-0 items-stretch">
        {/* COLUMN 1: LEFT CARD PHOTO */}
        <article 
          className="pr-0 md:pr-4 flex flex-col justify-start pb-0"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <Link
            href={`/article/${leftHero.slug}`}
            className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 group"
          >
            <img
              src={leftHero.imageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=webp&fit=crop&w=600&q=80"}
              alt={leftHero.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </article>

        {/* COLUMN 2: CENTER TOP ARTICLE */}
        <div 
          className="px-0 md:px-4 pt-0 flex flex-col justify-between pb-0 h-full"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <article className="flex-1 flex flex-col justify-between pb-3 border-b border-dashed border-[#CCCCCC]">
            <div>
              <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                <Link href={`/article/${centerTop.slug}`}>
                  {centerTop.title}
                </Link>
              </h4>
              {centerTop.summary && (
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                  {centerTop.summary}
                </p>
              )}
            </div>
            <div>
              {centerTop.commentCount !== undefined && centerTop.commentCount > 0 && (
                <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
                  <span>💬</span>
                  <span>{centerTop.commentCount}</span>
                </div>
              )}
              <span className="font-mono text-[11px] text-[#666666] mt-1 block">
                {formatTimeAgo(centerTop.publishedAt)}
              </span>
            </div>
          </article>
        </div>

        {/* COLUMN 3: RIGHT TOP STORY */}
        <div className="pl-0 md:pl-4 pt-0 flex flex-col justify-between pb-0 h-full">
          <article className="flex-1 flex flex-col justify-between pb-3 border-b border-dashed border-[#CCCCCC]">
            <div>
              <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                <Link href={`/article/${rightTop.slug}`}>
                  {rightTop.title}
                </Link>
              </h4>
              {rightTop.summary && (
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                  {rightTop.summary}
                </p>
              )}
            </div>
            <div>
              {rightTop.commentCount !== undefined && rightTop.commentCount > 0 && (
                <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
                  <span>💬</span>
                  <span>{rightTop.commentCount}</span>
                </div>
              )}
              <span className="font-mono text-[11px] text-[#666666] mt-1 block">
                {formatTimeAgo(rightTop.publishedAt)}
              </span>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export const PeopleToKnowBottom: React.FC = () => {
  const articles = usePeopleToKnowArticles();
  const leftHero = articles[0] || defaultArticles[0];
  const rightBottom = articles[3] || defaultArticles[3];

  return (
    <div className="w-full font-sans select-none pt-0 mt-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pt-0 pb-2 items-stretch">
        {/* COLUMN 1: LEFT CARD HEADLINE + PARAGRAPH */}
        <div 
          className="pr-0 md:pr-4 flex flex-col justify-between pt-3"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <div>
            <h3 className="font-serif font-bold text-[18px] sm:text-[20px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
              <Link href={`/article/${leftHero.slug}`}>
                {leftHero.title}
              </Link>
            </h3>
            {leftHero.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                {leftHero.summary}
              </p>
            )}
          </div>
          <div>
            {leftHero.commentCount !== undefined && leftHero.commentCount > 0 && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1 mt-2">
                <span>💬</span>
                <span>{leftHero.commentCount}</span>
              </div>
            )}
            <span className="font-mono text-[11px] text-[#666666] mt-1 block">
              {formatTimeAgo(leftHero.publishedAt)}
            </span>
          </div>
        </div>

        {/* COLUMN 2: CENTER AD 04 BOX AT BOTTOM */}
        <div 
          className="px-0 md:px-4 pt-3 flex flex-col justify-stretch"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          <AdPlaceholder slotId="hp_slot_4" width="w-full" height="h-[150px]" resolution="300 × 150" />
        </div>

        {/* COLUMN 3: RIGHT BOTTOM STORY */}
        <div className="pl-0 md:pl-4 pt-3 flex flex-col justify-between">
          <article className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
                <Link href={`/article/${rightBottom.slug}`}>
                  {rightBottom.title}
                </Link>
              </h4>
              {rightBottom.summary && (
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                  {rightBottom.summary}
                </p>
              )}
            </div>
            <div>
              {rightBottom.commentCount !== undefined && rightBottom.commentCount > 0 && (
                <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1 mt-1">
                  <span>💬</span>
                  <span>{rightBottom.commentCount}</span>
                </div>
              )}
              <span className="font-mono text-[11px] text-[#666666] mt-1 block">
                {formatTimeAgo(rightBottom.publishedAt)}
              </span>
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
