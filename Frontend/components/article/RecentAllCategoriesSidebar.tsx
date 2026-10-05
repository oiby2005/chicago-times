"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { homepageArticles, Article } from "@/data/articles";
import { ensureWebpUrl } from "@/lib/webpConverter";
import { getRelativeTime } from "@/lib/relativeTime";

export interface RecentItem {
  id: string;
  title: string;
  date: string;
  image: string;
  slug: string;
  category?: string;
  timestampNum?: number;
}

interface RecentAllCategoriesSidebarProps {
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

export const RecentAllCategoriesSidebar: React.FC<RecentAllCategoriesSidebarProps> = ({
  currentSlug,
  currentId,
}) => {
  const [articles, setArticles] = useState<RecentItem[]>([]);

  useEffect(() => {
    let allList: RecentItem[] = [];
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
            category: post.category || "General",
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
        date: dateDisplay,
        image: ensureWebpUrl(rawImg),
        category: art.category || "General",
        timestampNum: parseTimestamp(art.publishedDate, art.timestamp),
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

    // 4. Sort by timestampNum descending to get most recent 5 articles across ALL categories
    filteredList.sort((a, b) => (b.timestampNum || 0) - (a.timestampNum || 0));

    setArticles(filteredList.slice(0, 5));
  }, [currentSlug, currentId]);

  return (
    <aside className="w-full select-none mb-8">
      {/* Sidebar Header */}
      <div className="border-b border-dashed border-[#CCCCCC] pb-1.5 mb-4">
        <h3 className="font-sans font-bold text-[12px] tracking-wider uppercase text-[#111111]">
          Recent Article
        </h3>
      </div>

      {/* List of 5 Recent Articles Across All Categories */}
      <div className="divide-y divide-dashed divide-[#CCCCCC]">
        {articles.map((item) => (
          <Link
            key={item.id + "-" + item.slug}
            href={`/article/${item.slug}`}
            prefetch={true}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 group"
          >
            {/* Thumbnail Image */}
            <div className="w-[84px] h-[58px] shrink-0 overflow-hidden bg-gray-100 rounded-xs border border-gray-200">
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
              {item.category && (
                <span className="font-sans font-bold text-[10.5px] uppercase tracking-wider text-[#007cba] block mb-0.5">
                  {item.category}
                </span>
              )}
              <h4 className="font-serif font-bold text-[13px] text-[#111111] leading-[1.25] group-hover:underline line-clamp-2">
                {item.title}
              </h4>
              <span className="font-sans text-[10.5px] text-gray-400 block mt-1">
                {item.date}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default RecentAllCategoriesSidebar;
