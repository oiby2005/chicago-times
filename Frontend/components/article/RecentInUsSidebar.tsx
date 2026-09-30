"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { homepageArticles, Article } from "@/data/articles";
import { ensureWebpUrl } from "@/lib/webpConverter";
import { getRelativeTime } from "@/lib/relativeTime";

export interface RecentArticle {
  id: string;
  title: string;
  date: string;
  image: string;
  slug: string;
  category?: string;
  timestampNum?: number;
}

interface RecentInUsSidebarProps {
  categoryName?: string;
  currentSlug?: string;
  currentId?: string;
}

function matchesCategory(
  articleCat?: string,
  articleBreadcrumb?: string,
  targetCat?: string
): boolean {
  if (!targetCat) return true;
  const target = targetCat.toLowerCase().trim();
  const cat = (articleCat || "").toLowerCase().trim();

  if (!cat) return false;

  // Strict check for business / economy / markets / finance
  const isBusinessTarget =
    target === "business" ||
    target === "business & finance" ||
    target === "economy" ||
    target === "markets" ||
    target === "markets & finance";
  const isBusinessArticle =
    cat.includes("business") ||
    cat.includes("economy") ||
    cat.includes("market") ||
    cat.includes("finance") ||
    cat.includes("investing") ||
    cat.includes("corporate") ||
    cat.includes("stock") ||
    cat.includes("crypto") ||
    cat.includes("wealth");

  if (isBusinessTarget) {
    if (
      cat.includes("sport") ||
      cat.includes("opinion") ||
      cat.includes("lifestyle") ||
      cat.includes("entertainment") ||
      cat.includes("culture") ||
      cat.includes("art")
    ) {
      return false;
    }
    return isBusinessArticle;
  }

  // Strict check for sports
  if (target === "sports" || target === "sport") {
    return cat.includes("sport") || cat.includes("nba") || cat.includes("soccer") || cat.includes("tennis");
  }

  // Strict check for opinion
  if (target === "opinion" || target === "opinions" || target === "editorial" || target === "editorials") {
    return cat.includes("opinion") || cat.includes("editorial");
  }

  // Strict check for lifestyle
  if (target === "lifestyle" || target === "style") {
    return cat.includes("lifestyle") || cat.includes("style") || cat.includes("food") || cat.includes("travel");
  }

  // Standard category check
  if (cat === target) return true;
  if (cat.includes(target) || target.includes(cat)) return true;

  return false;
}

function parseArticleTimestamp(dateStr?: string, isoStr?: string): number {
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

export default function RecentInUsSidebar({
  categoryName = "US",
  currentSlug,
  currentId,
}: RecentInUsSidebarProps) {
  const [articles, setArticles] = useState<RecentArticle[]>([]);

  useEffect(() => {
    let allList: RecentArticle[] = [];
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

          const dateDisplay = getRelativeTime(post.publishedAt, post.date || post.createdAt);
          const rawImg = post.thumbnail || post.imageUrl || post.photoUrl || "/images/bangkok-factory.jpg";

          allList.push({
            id: pId,
            slug: pSlug,
            title: post.title || "Untitled Article",
            date: dateDisplay,
            image: ensureWebpUrl(rawImg),
            category: post.category || "US",
            timestampNum: parseArticleTimestamp(post.date, post.publishedAt || post.createdAt),
          });
        });
      } catch (e) {}
    }

    // 2. Fetch static articles from data/articles.ts
    Object.values(homepageArticles).forEach((art: Article) => {
      const aSlug = art.slug;
      if (seenSlugs.has(aSlug)) return;
      seenSlugs.add(aSlug);

      const dateDisplay = art.publishedDate || art.timestamp || "Aug 7, 2026";
      const rawImg = art.imageUrl || "/images/bangkok-factory.jpg";

      allList.push({
        id: art.id,
        slug: aSlug,
        title: art.title,
        date: dateDisplay,
        image: ensureWebpUrl(rawImg),
        category: art.category || "US",
        timestampNum: parseArticleTimestamp(art.publishedDate, art.timestamp),
      });
    });

    // 3. Filter out current article being viewed
    const filteredList = allList.filter((art) => {
      const artSlugClean = art.slug.toLowerCase().trim();
      const artIdClean = String(art.id).toLowerCase().trim();
      if (cleanCurrentSlug && artSlugClean === cleanCurrentSlug) return false;
      if (cleanCurrentId && artIdClean === cleanCurrentId) return false;
      return true;
    });

    // 4. Find category matching articles
    const catMatches = filteredList.filter((art) =>
      matchesCategory(art.category, undefined, categoryName)
    );

    // Sort category matches by timestampNum descending
    catMatches.sort((a, b) => (b.timestampNum || 0) - (a.timestampNum || 0));

    let finalItems: RecentArticle[] = [...catMatches];

    // 5. Backfill with non-category articles if < 10
    if (finalItems.length < 10) {
      const chosenSlugs = new Set(finalItems.map((item) => item.slug));
      const remainingArticles = filteredList.filter(
        (art) => !chosenSlugs.has(art.slug)
      );
      remainingArticles.sort((a, b) => (b.timestampNum || 0) - (a.timestampNum || 0));

      for (const rem of remainingArticles) {
        if (finalItems.length >= 10) break;
        finalItems.push(rem);
      }
    }

    // Slice top 10
    setArticles(finalItems.slice(0, 10));
  }, [categoryName, currentSlug, currentId]);

  return (
    <aside className="w-full select-none">
      {/* Sidebar Header */}
      <div className="border-b border-dashed border-[#CCCCCC] pb-1.5 mb-4">
        <h3 className="font-sans font-bold text-[12px] tracking-wider uppercase text-[#111111]">
          Recent in {categoryName || "US"}
        </h3>
      </div>

      {/* List of Recent Articles */}
      <div className="divide-y divide-dashed divide-[#CCCCCC]">
        {articles.map((item) => (
          <Link
            key={item.id + "-" + item.slug}
            href={`/article/${item.slug}`}
            prefetch={true}
            className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0 group"
          >
            {/* Thumbnail Image */}
            <div className="w-[88px] h-[60px] shrink-0 overflow-hidden bg-gray-100 rounded-xs">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/bangkok-factory.jpg";
                }}
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
