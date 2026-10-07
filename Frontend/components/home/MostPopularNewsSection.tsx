"use client";

import React from "react";
import Link from "next/link";

interface PopularItem {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  publishedAt?: number | string;
}

import { getRelativeTime } from "@/lib/relativeTime";

const formatTimeAgo = (timestamp?: number | string): string => {
  return getRelativeTime(timestamp);
};

const STATIC_BASE_TIME = 1730000000000;

const defaultArticles: PopularItem[] = [
  {
    id: "pop1",
    title: "How Trump’s Ever-Present Executive Assistant Became the Talk of Washington",
    slug: "how-trumps-executive-assistant-became-talk-of-washington",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=webp&fit=crop&w=300&q=80",
    publishedAt: STATIC_BASE_TIME - 2 * 3600 * 1000,
  },
  {
    id: "pop2",
    title: "Moderna Shares More Than Double on Success of mRNA Cancer Vaccine",
    slug: "moderna-shares-more-than-double-mrna-cancer-vaccine",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?fm=webp&fit=crop&w=300&q=80",
    publishedAt: STATIC_BASE_TIME - 4 * 3600 * 1000,
  },
  {
    id: "pop3",
    title: "The Cast-Iron Company That Has Been Controlled by the Same Family for 130 Years",
    slug: "cast-iron-company-controlled-same-family-130-years",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fm=webp&fit=crop&w=300&q=80",
    publishedAt: STATIC_BASE_TIME - 6 * 3600 * 1000,
  },
  {
    id: "pop4",
    title: "LinkedIn Has Accidentally Become a Dating Site—Despite Its No-Romance Rules",
    slug: "linkedin-accidentally-become-dating-site",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fm=webp&fit=crop&w=300&q=80",
    publishedAt: STATIC_BASE_TIME - 8 * 3600 * 1000,
  },
  {
    id: "pop5",
    title: "The Lakers Heiress at the Center of the NBA’s Nastiest Succession Drama",
    slug: "the-lakers-heiress-nba-succession-drama",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=webp&fit=crop&w=300&q=80",
    publishedAt: STATIC_BASE_TIME - 10 * 3600 * 1000,
  },
];

export const MostPopularNewsSection: React.FC = () => {
  const [articles, setArticles] = React.useState<PopularItem[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const popPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            p.homepagePlacement.includes("Most Popular News")
        );

        popPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (popPosts.length > 0) {
          const formatted: PopularItem[] = popPosts.slice(0, 5).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
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
      }
    } catch (e) {}
    setArticles(defaultArticles);
  }, []);

  React.useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  return (
    <section className="w-full font-sans select-none my-0 pt-0">
      <div className="w-full">
        {/* Header Title */}
        <div className="mb-3">
          <h3 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight leading-none">
            Most Popular News
          </h3>
        </div>

        {/* Popular Items List */}
        <div className="space-y-4">
          {articles.map((item, idx) => (
            <React.Fragment key={item.id}>
              <article className="flex items-start justify-between space-x-3">
                <div className="flex-1">
                  <h4 className="font-poppins font-medium text-[14px] sm:text-[15px] leading-snug text-[#111111] hover:underline cursor-pointer">
                    <Link href={`/article/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>
                  <span className="font-mono text-[11px] text-[#666666] mt-1 block" suppressHydrationWarning>
                    {formatTimeAgo(item.publishedAt)}
                  </span>
                </div>

                <Link
                  href={`/article/${item.slug}`}
                  className="shrink-0 block w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] overflow-hidden bg-gray-100 border border-gray-200"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </article>

              {idx < articles.length - 1 && (
                <hr className="border-t border-dashed border-[#CCCCCC] my-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostPopularNewsSection;
