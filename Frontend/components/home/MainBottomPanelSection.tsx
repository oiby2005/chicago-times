"use client";

import React from "react";
import Link from "next/link";

interface MainBottomArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  commentsCount: string;
}

const mainBottomArticles: MainBottomArticle[] = [
  {
    id: "1",
    title: "The Hidden Debt That Apple Owes to the CIA",
    slug: "the-hidden-debt-that-apple-owes-to-the-cia",
    summary:
      "Without CIA funding that helped keep NeXT afloat in the ’80s, Steve Jobs might not have made a triumphant return to Apple.",
    imageUrl: "/images/kevin_warsh.jpg",
    commentsCount: "50",
  },
  {
    id: "2",
    title: "How to Outsmart AI When It’s Tracking Your Workday",
    slug: "how-to-outsmart-ai-when-its-tracking-your-workday",
    summary: "It takes a little gamesmanship to look your best in the era of employee surveillance.",
    imageUrl: "/images/hero-ai-software.jpg",
    commentsCount: "29",
  },
];

export const MainBottomPanelSection: React.FC = () => {
  const [articles, setArticles] = React.useState<MainBottomArticle[]>(mainBottomArticles);

  const loadMainBottom = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const mbPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            p.homepagePlacement.includes("Main Bottom")
        );

        mbPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (mbPosts.length > 0) {
          const formatted: MainBottomArticle[] = mbPosts.slice(0, 2).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary:
              p.subheadline ||
              p.cardSummary ||
              (p.bodyContent
                ? p.bodyContent.replace(/<[^>]+>/g, " ").trim().slice(0, 120) + "..."
                : ""),
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
            commentsCount: p.commentsCount || "0",
          }));

          const merged = [...formatted];
          for (let i = 0; i < mainBottomArticles.length && merged.length < 2; i++) {
            if (!merged.some((m) => m.id === mainBottomArticles[i].id)) {
              merged.push(mainBottomArticles[i]);
            }
          }
          setArticles(merged.slice(0, 2));
          return;
        }
      }
    } catch (e) {}
    setArticles(mainBottomArticles);
  }, []);

  React.useEffect(() => {
    loadMainBottom();
    window.addEventListener("wsj_posts_updated", loadMainBottom);
    return () => window.removeEventListener("wsj_posts_updated", loadMainBottom);
  }, [loadMainBottom]);

  return (
    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-[0.4cm] font-sans select-none">
      {articles.map((article) => (
        <article key={article.id} className="flex flex-col justify-between">
          <div>
            <Link href={`/article/${article.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2 group">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <h3 className="font-serif font-bold text-[17.5px] sm:text-[18.5px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h3>

            <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-1.5 line-clamp-3">
              {article.summary}
            </p>
          </div>

          <div className="mt-2 flex items-center space-x-1.5 font-sans text-[10.5px] text-[#666666]">
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
            <span>{article.commentsCount}</span>
          </div>
        </article>
      ))}
    </div>
  );
};

export default MainBottomPanelSection;
