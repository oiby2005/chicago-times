"use client";

import React from "react";
import Link from "next/link";

interface MarketArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  imageUrl: string;
}

const defaultArticles: MarketArticle[] = [
  {
    id: "mf1",
    title: "Global Stock Markets Rally Following Federal Reserve Policy Signals",
    slug: "global-stock-markets-rally",
    imageUrl: "/images/world/afiuni_judge.jpg",
  },
  {
    id: "mf2",
    title: "Central Banks Evaluate Digital Currency Frameworks for Trade Settlement",
    slug: "central-banks-evaluate-digital-currency-frameworks",
    imageUrl: "/images/world/jose_rizal.jpg",
  },
  {
    id: "mf3",
    title: "Banking Sector Reports Resilience Amid Shifting Interest Rate Trends",
    slug: "banking-sector-reports-resilience",
    imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mf4",
    title: "Treasury Yields Adjust as Inflation Expectations Modernize Globally",
    slug: "treasury-yields-adjust-inflation",
    imageUrl: "/images/world/perez_hilton.jpg",
  },
];

export const MarketsFinanceCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<MarketArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const mfPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = p.homepagePlacement || "None";
          if (placement.includes("Markets & Finance")) return true;
          if (!placement.startsWith("None")) return false;
          const cat = p.category || "";
          return cat === "Markets & Finance" || cat === "Market & Finance" || cat === "Stocks" || cat === "Currencies" || cat === "Banking";
        });

        mfPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (mfPosts.length > 0) {
          const formatted: MarketArticle[] = mfPosts.slice(0, 4).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
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
          <Link href="/markets" className="hover:underline">
            Markets & Finance
          </Link>
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#f4effc] flex items-center justify-center text-[#3A2371] cursor-pointer hover:bg-[#e9defa]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* 4 Cards Row */}
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

export default MarketsFinanceCategorySection;
