"use client";

import React, { useState } from "react";
import Link from "next/link";

interface APlusMainNewsSectionProps {
  category?: string;
  title?: string;
  slug?: string;
  summary?: string;
  imageUrl?: string;
  commentsCount?: string;
  readTime?: string;
}

export const APlusMainNewsSection: React.FC<APlusMainNewsSectionProps> = ({
  category = "WORLD",
  title = "The Suspected Gangster Causing Headaches for Kushner’s Albania Deal",
  slug = "suspected-gangster-headaches-kushner-albania-deal",
  summary = "Villagers say they warned Trump's son-in-law their beachfront land was stolen by Artur Shehu, who now faces drug-related charges, which he denies.",
  imageUrl = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
  commentsCount = "101",
  readTime = "8 min read",
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [activeArticle, setActiveArticle] = useState({
    category,
    title,
    slug,
    summary,
    imageUrl,
    commentsCount,
    readTime,
  });

  const loadCustomAPlus = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const aPlusPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            (p.homepagePlacement.includes("A+ Main News") ||
             p.homepagePlacement.includes("A+ Section (main hero)"))
        );

        aPlusPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (aPlusPosts.length > 0) {
          const topPost = aPlusPosts[0];
          setActiveArticle({
            category: topPost.category ? topPost.category.toUpperCase() : category,
            title: topPost.title || title,
            slug: topPost.slug || topPost.id || slug,
            summary:
              topPost.subheadline ||
              topPost.cardSummary ||
              (topPost.bodyContent
                ? topPost.bodyContent.replace(/<[^>]+>/g, " ").trim().slice(0, 160) + "..."
                : summary),
            imageUrl: topPost.thumbnail || imageUrl,
            commentsCount: topPost.commentsCount || "0",
            readTime: topPost.readDuration || topPost.readTime || readTime,
          });
          return;
        }
      }
    } catch (e) {}
    setActiveArticle({ category, title, slug, summary, imageUrl, commentsCount, readTime });
  }, [category, title, slug, summary, imageUrl, commentsCount, readTime]);

  React.useEffect(() => {
    loadCustomAPlus();
    window.addEventListener("wsj_posts_updated", loadCustomAPlus);
    return () => window.removeEventListener("wsj_posts_updated", loadCustomAPlus);
  }, [loadCustomAPlus]);

  const displayCat = activeArticle.category;
  const displayTitle = activeArticle.title;
  const displaySlug = activeArticle.slug;
  const displaySummary = activeArticle.summary;
  const displayImage = activeArticle.imageUrl;
  const displayComments = activeArticle.commentsCount;
  const displayReadTime = activeArticle.readTime;

  return (
    <article className="w-full h-full flex flex-col justify-between font-sans select-none">
      {/* Featured Main Hero Image expanding horizontally to align with text below */}
      <Link href={`/article/${displaySlug}`} className="block w-full h-[8.4cm] overflow-hidden bg-gray-100 mb-3 group">
        <img
          src={displayImage}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
        />
      </Link>

      {/* Category / Kicker Tag */}
      <div className="mb-1">
        <span className="font-sans font-bold text-[11px] tracking-wider text-[#00558c] uppercase">
          {displayCat}
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-serif font-bold text-[26px] sm:text-[30px] lg:text-[32px] leading-[1.15] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer tracking-tight">
        <Link href={`/article/${displaySlug}`}>
          {displayTitle}
        </Link>
      </h1>

      {/* Summary */}
      <p className="font-sans text-[13.5px] sm:text-[14px] leading-[1.4] text-[#444444] mt-2">
        {displaySummary}
      </p>

      {/* Metadata Row: Comments, Read Time & Action Icons */}
      <div className="mt-3.5 flex items-center justify-between font-sans text-[11.5px] text-[#666666]">
        {/* Left Side: Comments & Read Time */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#666666] stroke-[1.8]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{displayComments}</span>
          </div>
          <span>{displayReadTime}</span>
        </div>

        {/* Right Side: Bookmark & Share Icons */}
        <div className="flex items-center space-x-3.5 text-[#555555]">
          {/* Bookmark Button */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            aria-label="Save article"
            className="hover:text-black transition-colors cursor-pointer focus:outline-none"
          >
            <svg
              className={`w-4 h-4 ${
                isBookmarked ? "fill-black stroke-black" : "fill-none stroke-currentColor stroke-[1.8]"
              }`}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            aria-label="Share article"
            className="hover:text-black transition-colors cursor-pointer focus:outline-none"
          >
            <svg
              className="w-4 h-4 stroke-currentColor stroke-[1.8] fill-none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default APlusMainNewsSection;
