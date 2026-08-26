"use client";

import React from "react";
import Link from "next/link";

interface InDepthArticle {
  id: string;
  category?: string;
  title: string;
  slug: string;
  imageUrl: string;
}

const inDepthArticles: InDepthArticle[] = [
  {
    id: "1",
    category: "IN DEPTH",
    title: "Could Andy Burnham really end rough sleeping by Christmas?",
    slug: "could-andy-burnham-end-rough-sleeping-christmas",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "2",
    title: "Girl, 13, ‘was fed suicide videos by algorithms’ before death",
    slug: "girl-13-fed-suicide-videos-algorithms-before-death",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "3",
    title: "Kennedy scion who dated Taylor Swift goes on Russia’s wanted list",
    slug: "kennedy-scion-taylor-swift-russia-wanted-list",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "4",
    title: "Kennedy scion who dated Taylor Swift goes on Russia’s wanted list",
    slug: "kennedy-scion-taylor-swift-russia-wanted-list-2",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
];

export const InDepthPanelSection: React.FC = () => {
  const [articles, setArticles] = React.useState<InDepthArticle[]>(inDepthArticles);

  const loadInDepth = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const inDepthPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            p.homepagePlacement &&
            p.homepagePlacement.includes("In Depth")
        );

        inDepthPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (inDepthPosts.length > 0) {
          const formatted: InDepthArticle[] = inDepthPosts.slice(0, 4).map((p: any, idx: number) => ({
            id: p.id,
            category: idx === 0 ? "IN DEPTH" : undefined,
            title: p.title,
            slug: p.slug || p.id,
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80",
          }));

          const merged = [...formatted];
          for (let i = 0; i < inDepthArticles.length && merged.length < 4; i++) {
            if (!merged.some((m) => m.id === inDepthArticles[i].id)) {
              merged.push(inDepthArticles[i]);
            }
          }
          setArticles(merged.slice(0, 4));
          return;
        }
      }
    } catch (e) {}
    setArticles(inDepthArticles);
  }, []);

  React.useEffect(() => {
    loadInDepth();
    window.addEventListener("wsj_posts_updated", loadInDepth);
    return () => window.removeEventListener("wsj_posts_updated", loadInDepth);
  }, [loadInDepth]);

  return (
    <div className="w-full max-h-[9.5cm] h-full flex flex-col justify-between font-sans select-none overflow-hidden divide-y divide-dashed divide-[#D6CEBF]">
      {articles.map((article) => (
        <article key={article.id} className="py-2 flex items-start justify-between space-x-2.5 first:pt-0 last:pb-0">
          <div className="flex-1 min-w-0 pr-1">
            {article.category && (
              <div className="mb-0.5">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#00558c] uppercase">
                  {article.category}
                </span>
              </div>
            )}
            <h3 className="font-serif font-bold text-[13px] sm:text-[13.5px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h3>
          </div>

          <Link href={`/article/${article.slug}`} className="shrink-0 block w-[95px] h-[64px] overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </article>
      ))}
    </div>
  );
};

export default InDepthPanelSection;
