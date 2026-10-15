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

  const loadAuthorPosts = React.useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      let posts: any[] = [];
      const p1 = localStorage.getItem("wsj_posts");
      if (p1) posts = [...posts, ...JSON.parse(p1)];
      const p2 = localStorage.getItem("wsj_published_posts");
      if (p2) posts = [...posts, ...JSON.parse(p2)];

      if (posts.length === 0) {
        try {
          const res = await fetch("http://localhost:5000/api/posts").catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            const remote = Array.isArray(data) ? data : (data && Array.isArray(data.posts) ? data.posts : []);
            if (remote.length > 0) posts = remote;
          }
        } catch (e) {}
      }

      // Deduplicate posts
      const seenIds = new Set<string>();
      const uniquePosts: any[] = [];
      posts.forEach((p) => {
        const pid = String(p?.id || p?.slug || "");
        if (pid && !seenIds.has(pid)) {
          seenIds.add(pid);
          uniquePosts.push(p);
        }
      });

      let profilesMap: Record<string, any> = {};
      try {
        profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
      } catch (e) {}

      const cleanStr = (s: string) => (s || "").toLowerCase().trim();
      const cleanSlug = (s: string) => (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const targetEmail = cleanStr(authorEmail);
      const targetName = cleanStr(authorName);
      const targetSlug = cleanSlug(authorName);

      const filtered = uniquePosts.filter((p: any) => {
        if (!p) return false;
        const status = cleanStr(p.status);
        if (!["published", "approved"].includes(status)) return false;

        const pEmail = cleanStr(p.authorEmail);
        const pName = cleanStr(p.author);
        const pSlug = cleanSlug(p.author);

        // Resolve dynamic writer name from account profile if available
        let profileName = "";
        if (pEmail && profilesMap[pEmail]) {
          profileName = cleanStr(profilesMap[pEmail].full_name || profilesMap[pEmail].name || "");
        }

        const isEmailMatch = targetEmail && pEmail && pEmail === targetEmail;
        const isNameMatch =
          (targetName && pName && (pName === targetName || pName.includes(targetName) || targetName.includes(pName))) ||
          (targetSlug && pSlug && (pSlug === targetSlug || pSlug.includes(targetSlug) || targetSlug.includes(pSlug))) ||
          (targetName && profileName && (profileName === targetName || profileName.includes(targetName) || targetName.includes(profileName)));

        return isEmailMatch || isNameMatch;
      });

      if (filtered.length > 0) {
        const formatted: MostReadItem[] = filtered.map((p: any) => {
          const s = p.slug || String(p.id) || (p.title ? cleanSlug(p.title) : "article");
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
      } else {
        setAuthorArticles([]);
      }
    } catch (e) {}
  }, [authorName, authorEmail]);

  useEffect(() => {
    loadAuthorPosts();
    window.addEventListener("wsj_posts_updated", loadAuthorPosts);
    window.addEventListener("wsj_article_viewed", loadAuthorPosts);
    return () => {
      window.removeEventListener("wsj_posts_updated", loadAuthorPosts);
      window.removeEventListener("wsj_article_viewed", loadAuthorPosts);
    };
  }, [loadAuthorPosts]);

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
    <aside className="w-full bg-white border border-[#e5e7eb] rounded-xs p-5  shadow-2xs">
      {/* Header with Trending Up Icon */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-3 mb-4">
        <h3 className="font-poppins font-sans font-bold text-xs uppercase tracking-wider text-[#111111]">
          MOST READ
        </h3>
        <svg
          className="w-4 h-4 text-[#111111]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
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
              <h4
                className="font-bold text-xs sm:text-[13.5px] text-[#111111] leading-snug group-hover:underline line-clamp-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
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
