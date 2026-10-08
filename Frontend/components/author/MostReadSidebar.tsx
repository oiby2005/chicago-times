"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getArticleViews } from "@/lib/viewTracker";

export interface MostReadItem {
  rank: number;
  title: string;
  views: string;
  slug: string;
  viewsCount: number;
}

interface MostReadSidebarProps {
  authorName?: string;
  authorEmail?: string;
}

const fallbackMostRead: MostReadItem[] = [
  {
    rank: 1,
    title: "How Serious Is Joe Biden's Cancer as His Son Says the Disease Has Spread Further",
    views: "142 views since publication",
    slug: "biden-cancer-disease-spread-further",
    viewsCount: 142,
  },
  {
    rank: 2,
    title: "People at This Hospital Reported Seeing a Grim Reaper on the Roof",
    views: "118 views since publication",
    slug: "grim-reaper-on-hospital-roof",
    viewsCount: 118,
  },
  {
    rank: 3,
    title: "Pax Silica Could Transform the Philippines. But Who Really Benefits?",
    views: "96 views since publication",
    slug: "pax-silica-could-transform-philippines",
    viewsCount: 96,
  },
  {
    rank: 4,
    title: "The Bodies Were Finally Found. Gaza Is Only Beginning to Grieve.",
    views: "85 views since publication",
    slug: "bodies-finally-found-gaza-grieve",
    viewsCount: 85,
  },
  {
    rank: 5,
    title: "Unconventional Traditions and Cultural Trends in Modern Business",
    views: "72 views since publication",
    slug: "cultural-trends-business",
    viewsCount: 72,
  },
];

export default function MostReadSidebar({ authorName, authorEmail }: MostReadSidebarProps) {
  const [authorArticles, setAuthorArticles] = useState<MostReadItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      let posts: any[] = [];
      const p1 = localStorage.getItem("wsj_posts");
      if (p1) posts = [...posts, ...JSON.parse(p1)];
      const p2 = localStorage.getItem("wsj_published_posts");
      if (p2) posts = [...posts, ...JSON.parse(p2)];

      const targetEmail = (authorEmail || "").toLowerCase().trim();
      const targetName = (authorName || "").toLowerCase().trim();

      const filtered = posts.filter((p: any) => {
        if (!p || p.status !== "Published") return false;
        const pEmail = (p.authorEmail || "").toLowerCase().trim();
        const pName = (p.author || "").toLowerCase().trim();

        if (targetEmail && pEmail) return pEmail === targetEmail;
        if (targetName && pName) return pName.includes(targetName) || targetName.includes(pName);
        return true;
      });

      if (filtered.length > 0) {
        const formatted: MostReadItem[] = filtered.map((p: any) => {
          const s = p.slug || String(p.id) || (p.title ? p.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") : "article");
          const views = getArticleViews(s);
          return {
            rank: 1,
            title: p.title,
            slug: s,
            viewsCount: views,
            views: `${views} views since publication`,
          };
        });

        formatted.sort((a, b) => b.viewsCount - a.viewsCount);
        setAuthorArticles(formatted.slice(0, 5));
      }
    } catch (e) {}
  }, [authorName, authorEmail]);

  const displayList = useMemo(() => {
    if (authorArticles.length > 0) {
      return authorArticles.map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));
    }
    // Fallback baseline items enriched with live view counts
    return fallbackMostRead.map((item, idx) => {
      const liveViews = getArticleViews(item.slug, item.viewsCount);
      return {
        ...item,
        rank: idx + 1,
        viewsCount: liveViews,
        views: `${liveViews} views since publication`,
      };
    }).sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 5).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [authorArticles]);

  return (
    <aside className="w-full bg-white border border-[#e5e7eb] rounded-xs p-5 select-none shadow-2xs">
      {/* Header with Trending Up Icon */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-3 mb-4">
        <svg
          className="w-4 h-4 text-[#111111]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h3 className="font-poppins font-sans font-bold text-xs uppercase tracking-wider text-[#111111]">
          MOST READ
        </h3>
      </div>

      {/* List */}
      <div className="divide-y divide-[#f1f5f9]">
        {displayList.map((item) => (
          <Link
            key={`${item.slug}-${item.rank}`}
            href={`/article/${item.slug}`}
            className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0 group"
          >
            {/* Rank Number */}
            <span className="font-serif font-bold text-lg text-gray-300 group-hover:text-[#111111] transition-colors shrink-0 w-4">
              {item.rank}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#111111] leading-snug group-hover:underline line-clamp-2">
                {item.title}
              </h4>
              <span className="font-sans text-[10.5px] text-gray-400 font-normal block mt-1">
                {item.views}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
