"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { homepageArticles, Article } from "@/data/articles";
import { ensureWebpUrl } from "@/lib/webpConverter";

export interface MoreArticleCard {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  tags?: string[];
  subCategories?: string[];
  timestampNum?: number;
}

interface MoreFromWsjSectionProps {
  title?: string;
  categoryName?: string;
  currentSlug?: string;
  currentId?: string;
  tags?: string[];
  subCategories?: string[];
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

export default function MoreFromWsjSection({
  title,
  categoryName = "US",
  currentSlug,
  currentId,
  tags = [],
  subCategories = [],
}: MoreFromWsjSectionProps) {
  const [articles, setArticles] = useState<MoreArticleCard[]>([]);

  useEffect(() => {
    let allList: MoreArticleCard[] = [];
    const seenSlugs = new Set<string>();

    const cleanCurrentSlug = (currentSlug || "").toLowerCase().trim();
    const cleanCurrentId = String(currentId || "").toLowerCase().trim();

    // Clean active tags and subcategories for keyword matching
    const targetTagsSet = new Set(
      tags.map((t) => t.replace(/^#/, "").toLowerCase().trim()).filter(Boolean)
    );
    const targetSubCatsSet = new Set(
      subCategories.map((s) => s.toLowerCase().trim()).filter(Boolean)
    );

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

          const pSlug =
            post.slug ||
            (post.title
              ? post.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
              : String(post.id));
          const pId = String(post.id || pSlug);

          if (seenSlugs.has(pSlug)) return;
          seenSlugs.add(pSlug);

          const dateDisplay = post.date || "Aug 7, 2026";
          const rawImg = post.thumbnail || post.imageUrl || post.photoUrl || "/images/bangkok-factory.jpg";

          allList.push({
            id: pId,
            slug: pSlug,
            title: post.title || "Untitled Article",
            author: post.author || "Times Chicago Staff",
            date: dateDisplay,
            image: ensureWebpUrl(rawImg),
            category: (post.category || categoryName || "NEWS").toUpperCase(),
            tags: Array.isArray(post.tags) ? post.tags : [],
            subCategories: Array.isArray(post.subCategories) ? post.subCategories : [],
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

      const dateDisplay = art.publishedDate || art.timestamp || "Aug 7, 2026";
      const rawImg = art.imageUrl || "/images/bangkok-factory.jpg";

      allList.push({
        id: art.id,
        slug: aSlug,
        title: art.title,
        author: art.author || "Times Chicago Staff",
        date: dateDisplay,
        image: ensureWebpUrl(rawImg),
        category: (art.category || categoryName || "NEWS").toUpperCase(),
        tags: Array.isArray(art.tags) ? art.tags : [],
        subCategories: Array.isArray(art.subCategories) ? art.subCategories : [],
        timestampNum: parseTimestamp(art.publishedDate, art.timestamp),
      });
    });

    // 3. Filter out current article being viewed
    const candidateList = allList.filter((art) => {
      const artSlugClean = art.slug.toLowerCase().trim();
      const artIdClean = String(art.id).toLowerCase().trim();
      if (cleanCurrentSlug && artSlugClean === cleanCurrentSlug) return false;
      if (cleanCurrentId && artIdClean === cleanCurrentId) return false;
      return true;
    });

    // 4. STRICTLY filter candidates to ONLY those matching categoryName (e.g., Business only for Related in Business)
    const categoryCandidateList = candidateList.filter((art) =>
      matchesCategory(art.category, undefined, categoryName)
    );

    const catArticlesSorted = [...categoryCandidateList].sort(
      (a, b) => (b.timestampNum || 0) - (a.timestampNum || 0)
    );

    // Exclude top 10 recent sidebar items in this category
    const recentSidebarSlugs = new Set(
      catArticlesSorted.slice(0, 10).map((a) => a.slug.toLowerCase().trim())
    );

    let nonRecentCategoryCandidates = categoryCandidateList.filter(
      (art) => !recentSidebarSlugs.has(art.slug.toLowerCase().trim())
    );

    // Fallback: If non-recent candidates in this category are less than 4, use remaining category candidates
    if (nonRecentCategoryCandidates.length < 4) {
      nonRecentCategoryCandidates = categoryCandidateList;
    }

    // 5. Calculate Method 1 Tag & Subcategory Overlap Score for category candidates
    const scoredList = nonRecentCategoryCandidates.map((art) => {
      let score = 0;
      const isSameCategory = matchesCategory(art.category, undefined, categoryName);
      if (isSameCategory) score += 5;

      // Tag overlap (+2 per match)
      if (art.tags && art.tags.length > 0) {
        art.tags.forEach((t) => {
          const cleanTag = t.replace(/^#/, "").toLowerCase().trim();
          if (cleanTag && targetTagsSet.has(cleanTag)) {
            score += 2;
          }
        });
      }

      // Subcategory overlap (+2 per match)
      if (art.subCategories && art.subCategories.length > 0) {
        art.subCategories.forEach((s) => {
          const cleanSub = s.toLowerCase().trim();
          if (cleanSub && targetSubCatsSet.has(cleanSub)) {
            score += 2;
          }
        });
      }

      // Headline keyword match with target tags (+1 per match)
      const titleLower = art.title.toLowerCase();
      targetTagsSet.forEach((cleanTag) => {
        if (cleanTag.length > 3 && titleLower.includes(cleanTag)) {
          score += 1;
        }
      });

      return { article: art, score };
    });

    // Sort by score descending, then by timestamp descending
    scoredList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.article.timestampNum || 0) - (a.article.timestampNum || 0);
    });

    let selectedArticles: MoreArticleCard[] = scoredList
      .map((item) => item.article)
      .slice(0, 4);

    // 6. Backfill strictly from category articles if fewer than 4
    if (selectedArticles.length < 4) {
      const selectedSlugs = new Set(selectedArticles.map((a) => a.slug));
      const remainingCatArticles = catArticlesSorted.filter(
        (art) => !selectedSlugs.has(art.slug)
      );

      for (const extra of remainingCatArticles) {
        if (selectedArticles.length >= 4) break;
        selectedArticles.push(extra);
      }
    }

    setArticles(selectedArticles.slice(0, 4));
  }, [categoryName, currentSlug, currentId, tags, subCategories]);

  const displayTitle =
    title || `Related in ${categoryName || "This Category"}`;

  return (
    <section className="w-full pt-8 mt-10 border-t border-dashed border-[#CCCCCC] select-none">
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-[11px] sm:text-[12px] font-bold text-[#505e70] tracking-wider uppercase font-sans">
          {displayTitle}
        </h3>
      </div>

      {/* 4-Column Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {articles.map((item) => (
          <Link
            key={item.id + "-" + item.slug}
            href={`/article/${item.slug}`}
            prefetch={true}
            className="group flex flex-col justify-between h-full"
          >
            <div>
              {/* Image Container with Overlay Category Badge */}
              <div className="w-full aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/bangkok-factory.jpg";
                  }}
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
              <span className="truncate max-w-[120px]">{item.author}</span>
              <span className="shrink-0">{item.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
