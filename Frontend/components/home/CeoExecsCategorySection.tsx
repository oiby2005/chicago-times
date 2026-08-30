"use client";

import React from "react";
import Link from "next/link";

interface CeoArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  imageUrl: string;
}

const defaultArticles: CeoArticle[] = [
  {
    id: "ceo1",
    categoryTag: "SHOPPING",
    title: "The workwear brands that mean business",
    slug: "the-workwear-brands-that-mean-business",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ceo2",
    categoryTag: "NEWSLETTER",
    title: "Sign up for the Times LUXX newsletter",
    slug: "sign-up-for-the-times-luxx-newsletter",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ceo3",
    categoryTag: "SHOPPING",
    title: "The poshest prams to shop now",
    slug: "the-poshest-prams-to-shop-now",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ceo4",
    title: "What your posh cycling gear says about you",
    slug: "what-your-posh-cycling-gear-says-about-you",
    imageUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=600&q=80",
  },
];

export const CeoExecsCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<CeoArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const ceoPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = p.homepagePlacement || "None";
          if (placement.includes("CEOs & Executives")) return true;
          if (!placement.startsWith("None")) return false;
          const cat = p.category || "";
          return cat === "CEOs & Executives" || cat === "CEO & Executives";
        });

        ceoPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (ceoPosts.length > 0) {
          const formatted: CeoArticle[] = ceoPosts.slice(0, 4).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
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
    <div className="w-full font-sans select-none pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#3A2371] tracking-tight">
          CEOs & Executives
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#f4effc] flex items-center justify-center text-[#3A2371] cursor-pointer hover:bg-[#e9defa]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* 4 Cards Row (Positions 1..4 left-to-right) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {articles.map((art) => (
          <article key={art.id} className="flex flex-col justify-start">
            <Link
              href={`/article/${art.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            {art.categoryTag && (
              <div className="mb-1">
                <span className="font-sans font-bold text-[10px] tracking-wider text-[#336699] uppercase">
                  {art.categoryTag}
                </span>
              </div>
            )}
            <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link href={`/article/${art.slug}`}>
                {art.title}
              </Link>
            </h4>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CeoExecsCategorySection;
