"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { homepageArticles, Article } from "@/data/articles";
import { ensureWebpUrl } from "@/lib/webpConverter";
import { getFormattedDateTime } from "@/lib/relativeTime";

export interface UpNextArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  image: string;
  category: string;
  timestampNum: number;
}

interface ArticleUpNextSectionProps {
  categoryName?: string;
  currentSlug?: string;
  currentId?: string;
}

function parseTimestamp(dateStr?: string, isoStr?: string): number {
  if (isoStr) {
    const t = new Date(isoStr).getTime();
    if (!isNaN(t)) return t;
  }
  if (dateStr) {
    const t = new Date(dateStr).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 200);
};

export const ArticleUpNextSection: React.FC<ArticleUpNextSectionProps> = ({
  categoryName,
  currentSlug,
  currentId,
}) => {
  const [articles, setArticles] = useState<UpNextArticleItem[]>([]);

  useEffect(() => {
    let allList: UpNextArticleItem[] = [];
    const seenSlugs = new Set<string>();

    const cleanCurrentSlug = (currentSlug || "").toLowerCase().trim();
    const cleanCurrentId = String(currentId || "").toLowerCase().trim();

    // 1. Fetch custom writer posts from localStorage
    if (typeof window !== "undefined") {
      try {
        let customPosts: any[] = [];
        const stored = localStorage.getItem("wsj_posts");
        if (stored) customPosts = [...customPosts, ...JSON.parse(stored)];
        const storedPub = localStorage.getItem("wsj_published_posts");
        if (storedPub) customPosts = [...customPosts, ...JSON.parse(storedPub)];

        customPosts.forEach((post: any) => {
          if (!post) return;
          const pStatus = (post.status || "").toLowerCase();
          if (pStatus && pStatus !== "published") return;

          const pSlug = post.slug || (post.title ? post.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : String(post.id));
          const pId = String(post.id || pSlug);

          if (seenSlugs.has(pSlug)) return;
          seenSlugs.add(pSlug);

          const dateDisplay = getFormattedDateTime(post.publishedAt, post.date || post.createdAt);
          const rawImg = post.thumbnail || post.imageUrl || post.photoUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?fm=webp&fit=crop&w=600&q=80";
          const summaryText = post.subheadline || post.cardSummary || extractText(post.bodyContent) || "";

          allList.push({
            id: pId,
            slug: pSlug,
            title: post.title || "Untitled Article",
            summary: summaryText,
            date: dateDisplay,
            image: ensureWebpUrl(rawImg),
            category: post.category || categoryName || "Business",
            timestampNum: parseTimestamp(post.date, post.publishedAt || post.createdAt),
          });
        });
      } catch (e) {}
    }

    // 2. Fetch static articles from data/articles.ts
    Object.values(homepageArticles).forEach((art: Article) => {
      const aSlug = art.slug;
      if (seenSlugs.has(aSlug)) return;
      seenSlugs.add(aSlug);

      const dateDisplay = art.publishedDate || "September 30, 2026";
      const rawImg = art.imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?fm=webp&fit=crop&w=600&q=80";
      const summaryText = art.deck || art.summary || "";

      allList.push({
        id: art.id,
        slug: aSlug,
        title: art.title,
        summary: summaryText,
        date: dateDisplay,
        image: ensureWebpUrl(rawImg),
        category: art.category || categoryName || "Business",
        timestampNum: parseTimestamp(art.publishedDate, art.timestamp),
      });
    });

    const targetCat = (categoryName || "Business").toLowerCase().trim();

    // 3. Filter out current article being viewed AND keep ONLY matching category articles
    const filteredList = allList.filter((art) => {
      const artSlugClean = art.slug.toLowerCase().trim();
      const artIdClean = String(art.id).toLowerCase().trim();
      if (cleanCurrentSlug && artSlugClean === cleanCurrentSlug) return false;
      if (cleanCurrentId && artIdClean === cleanCurrentId) return false;

      const artCat = (art.category || "").toLowerCase().trim();
      if (targetCat) {
        if (artCat === targetCat) return true;
        if (artCat && (targetCat.includes(artCat) || artCat.includes(targetCat))) return true;
        return false;
      }
      return true;
    });

    // 4. Sort by timestampNum descending
    filteredList.sort((a, b) => (b.timestampNum || 0) - (a.timestampNum || 0));

    // Limit to max 9 articles as requested
    setArticles(filteredList.slice(0, 9));
  }, [categoryName, currentSlug, currentId]);

  if (articles.length === 0) return null;

  return (
    <section className="w-full select-none my-8 pt-4">
      {/* Section Header: UP NEXT */}
      <div className="border-b border-dashed border-[#CCCCCC] pb-2 mb-6">
        <h2 className="font-serif font-bold text-[22px] sm:text-[24px] text-[#111111] tracking-tight uppercase">
          Up Next
        </h2>
      </div>

      {/* List of 9 Articles Matching Image 4 Structure */}
      <div className="space-y-6">
        {articles.map((item) => (
          <article
            key={item.id + "-" + item.slug}
            className="border-b border-dashed border-[#CCCCCC] pb-6 last:border-b-0 last:pb-0"
          >
            {/* Category / Newsletter Tag */}
            <div className="text-[11px] font-sans font-bold text-[#666666] uppercase tracking-wider mb-1">
              {item.category.toUpperCase()} {item.category.toLowerCase() === "business" || item.category.toLowerCase() === "markets" ? "AM NEWSLETTER" : ""}
            </div>

            {/* Main Headline */}
            <h3 className="font-serif font-bold text-[20px] sm:text-[23px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${item.slug}`}>
                {item.title}
              </Link>
            </h3>

            {/* Publication Date */}
            <div className="text-xs font-sans text-[#777777] mb-3">
              {item.date}
            </div>

            {/* 2-Column Row: Left Image + Right Summary & Continue Button (Matching Image 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Left Column Thumbnail Image */}
              <div className="sm:col-span-5 md:col-span-4">
                <Link href={`/article/${item.slug}`} className="block w-full aspect-[16/10] overflow-hidden bg-gray-100 rounded-xs border border-gray-200 group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?fm=webp&fit=crop&w=600&q=80";
                    }}
                  />
                </Link>
              </div>

              {/* Right Column Summary & Continue Button */}
              <div className="sm:col-span-7 md:col-span-8 flex flex-col justify-between items-start h-full min-h-[120px]">
                {item.summary && (
                  <p className="font-sans text-[13.5px] sm:text-[14px] text-[#444444] leading-relaxed line-clamp-3 mb-3">
                    {item.summary}
                  </p>
                )}

                <Link
                  href={`/article/${item.slug}`}
                  className="inline-flex items-center space-x-2 bg-[#1A1A1A] hover:bg-[#333333] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xs shadow-2xs transition-colors cursor-pointer mt-auto"
                >
                  <span>Continue To Article</span>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ArticleUpNextSection;
