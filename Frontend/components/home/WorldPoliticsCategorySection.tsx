"use client";

import React from "react";
import Link from "next/link";

interface WorldPoliticsArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  imageUrl: string;
}

const defaultArticles: WorldPoliticsArticle[] = [
  {
    id: "wp1",
    title: "Check your helicopters, Greece tells pilots after honeymoon crash",
    slug: "check-your-helicopters-greece-tells-pilots-after-honeymoon-crash",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wp2",
    title: "Lawrence of Arabia’s anger at being ‘banned’ from travel abroad",
    slug: "lawrence-of-arabias-anger-at-being-banned-from-travel-abroad",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wp3",
    title: "By gum, NHS’s AI phone system struggles with Yorkshire accents",
    slug: "by-gum-nhs-ai-phone-system-struggles-with-yorkshire-accents",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wp4",
    categoryTag: "THE TIMES DIARY",
    title: "Minister literally doesn’t care if you say less or fewer",
    slug: "minister-literally-doesnt-care-if-you-say-less-or-fewer",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
];

export const WorldPoliticsCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<WorldPoliticsArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const wpPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            (p.category === "World Politics" ||
             (p.homepagePlacement && p.homepagePlacement.includes("World Politics")))
        );

        wpPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (wpPosts.length > 0) {
          const formatted: WorldPoliticsArticle[] = wpPosts.slice(0, 4).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
          }));

          const merged = [...formatted];
          for (let i = 0; i < defaultArticles.length && merged.length < 4; i++) {
            if (!merged.some((m) => m.id === defaultArticles[i].id)) {
              merged.push(defaultArticles[i]);
            }
          }
          setArticles(merged.slice(0, 4));
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
    <div className="w-full font-sans select-none pb-2 my-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[0.4cm]">
        {articles.map((art) => (
          <article
            key={art.id}
            className="flex flex-col justify-start"
          >
            {/* Image */}
            <Link
              href={`/article/${art.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Optional Category Tag e.g. THE TIMES DIARY */}
            {art.categoryTag && (
              <div className="mb-1">
                <span className="font-sans font-bold text-[11px] tracking-wider text-[#00558c] uppercase">
                  {art.categoryTag}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href={`/article/${art.slug}`}>
                {art.title}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WorldPoliticsCategorySection;
