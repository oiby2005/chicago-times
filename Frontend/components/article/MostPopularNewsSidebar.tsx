"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PopularItem {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
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

const defaultArticles: PopularItem[] = [
  {
    id: "pop1",
    title: "How Trump’s Ever-Present Executive Assistant Became the Talk of Washington",
    slug: "how-trumps-executive-assistant-became-talk-of-washington",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=webp&fit=crop&w=300&q=80",
    publishedAt: Date.now() - 2 * 3600 * 1000,
  },
  {
    id: "pop2",
    title: "Moderna Shares More Than Double on Success of mRNA Cancer Vaccine",
    slug: "moderna-shares-more-than-double-mrna-cancer-vaccine",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?fm=webp&fit=crop&w=300&q=80",
    publishedAt: Date.now() - 4 * 3600 * 1000,
  },
  {
    id: "pop3",
    title: "The Cast-Iron Company That Has Been Controlled by the Same Family for 130 Years",
    slug: "cast-iron-company-controlled-same-family-130-years",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fm=webp&fit=crop&w=300&q=80",
    publishedAt: Date.now() - 6 * 3600 * 1000,
  },
  {
    id: "pop4",
    title: "LinkedIn Has Accidentally Become a Dating Site—Despite Its No-Romance Rules",
    slug: "linkedin-accidentally-become-dating-site",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fm=webp&fit=crop&w=300&q=80",
    publishedAt: Date.now() - 8 * 3600 * 1000,
  },
  {
    id: "pop5",
    title: "The Lakers Heiress at the Center of the NBA’s Nastiest Succession Drama",
    slug: "the-lakers-heiress-nba-succession-drama",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=webp&fit=crop&w=300&q=80",
    publishedAt: Date.now() - 10 * 3600 * 1000,
  },
];

export const MostPopularNewsSidebar: React.FC = () => {
  const [articles, setArticles] = useState<PopularItem[]>(defaultArticles);

  const loadPosts = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      let posts: any[] = [];
      const stored = localStorage.getItem("wsj_posts");
      if (stored) posts = [...posts, ...JSON.parse(stored)];
      const storedPub = localStorage.getItem("wsj_published_posts");
      if (storedPub) posts = [...posts, ...JSON.parse(storedPub)];

      const popPosts = posts.filter(
        (p: any) =>
          (p.status || "").toLowerCase() === "published" &&
          p.homepagePlacement &&
          p.homepagePlacement.includes("Most Popular News")
      );

      popPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

      if (popPosts.length > 0) {
        const formatted: PopularItem[] = popPosts.slice(0, 5).map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug || (p.title ? p.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : String(p.id)),
          imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=webp&fit=crop&w=300&q=80",
          publishedAt: p.publishedAt,
        }));

        const merged = [...formatted];
        for (let i = 0; i < defaultArticles.length && merged.length < 5; i++) {
          if (!merged.some((m) => m.id === defaultArticles[i].id)) {
            merged.push(defaultArticles[i]);
          }
        }
        setArticles(merged.slice(0, 5));
        return;
      }
    } catch (e) {}

    setArticles(defaultArticles);
  }, []);

  useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  return (
    <aside className="w-full select-none my-8">
      {/* Header matching Image 1 */}
      <div className="pb-2 mb-2">
        <h3 className="font-serif font-bold text-[24px] sm:text-[26px] text-[#111111] tracking-tight">
          Most Popular News
        </h3>
      </div>

      {/* Most Popular List Matching Image 1 Layout */}
      <div className="divide-y divide-dashed divide-[#CCCCCC]">
        {articles.map((item, index) => (
          <Link
            key={item.id + "-" + index}
            href={`/article/${item.slug}`}
            prefetch={true}
            className="flex items-start justify-between gap-4 py-4 group"
          >
            {/* Left: Title & Time Ago */}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="font-serif font-bold text-[15px] sm:text-[16px] text-[#111111] leading-[1.25] group-hover:underline">
                {item.title}
              </h4>
              <span className="font-mono text-[12px] text-[#666666] block mt-1.5">
                {formatTimeAgo(item.publishedAt)}
              </span>
            </div>

            {/* Right: Square Thumbnail Image (80x80) */}
            <div className="w-[80px] h-[80px] shrink-0 overflow-hidden bg-gray-100 rounded-xs border border-gray-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultArticles[index]?.imageUrl || "/images/bangkok-factory.jpg";
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default MostPopularNewsSidebar;
