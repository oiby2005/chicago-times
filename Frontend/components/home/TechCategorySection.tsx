"use client";

import React from "react";
import Link from "next/link";

interface TechArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string;
  commentsCount?: number;
}

const defaultArticles: TechArticle[] = [
  {
    id: "tech1",
    categoryTag: "THE SATURDAY ESSAY",
    title: "Spanish Border Chaos Is an Illusion: Europe’s Borders Are Finally Working",
    slug: "spanish-border-chaos-is-an-illusion",
    summary: "Images of 72,000 migrants stampeding into Ceuta looked like a security collapse. In reality it revealed Europe’s much harder line on immigration.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "tech2",
    title: "EU’s Internal Borders Start to Harden as Dispute Grows Over Migrants",
    slug: "eus-internal-borders-start-to-harden",
    summary: "Spain introduced new border checks on arrivals from Italy, as a migration dispute between the countries escalated into a tit-for-tat.",
  },
  {
    id: "tech3",
    title: "Russia’s Hottest Startup Is a State-Backed Sanctions Evasion Network",
    slug: "russias-hottest-startup-sanctions-evasion",
    summary: "Founded less than two years ago, A7 says it handles nearly 20% of payments in Russian foreign trade, or more than $100 billion annually.",
    commentsCount: 39,
  },
  {
    id: "tech4",
    title: "U.S. Intel Links Russia to Explosive Drone at German Airport",
    slug: "us-intel-links-russia-explosive-drone",
    summary: "American intelligence had already suggested Putin could test NATO’s resolve with a limited incursion in the coming years.",
    commentsCount: 231,
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

export const TechCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<TechArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const techPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = p.homepagePlacement || "None";
          if (placement.includes("Tech")) return true;
          if (!placement.startsWith("None")) return false;
          const cat = p.category || "";
          return cat === "Tech" || cat === "Artificial Intelligence" || cat === "Cybersecurity" || cat === "Innovation";
        });

        techPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (techPosts.length > 0) {
          const formatted: TechArticle[] = techPosts.slice(0, 4).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
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

  const heroItem = articles[0] || defaultArticles[0];
  const side1 = articles[1] || defaultArticles[1];
  const side2 = articles[2] || defaultArticles[2];
  const side3 = articles[3] || defaultArticles[3];

  return (
    <div className="w-full font-sans select-none pt-4 pb-2 my-0">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          <Link href="/tech" className="hover:underline">
            Tech
          </Link>
        </h2>
        <Link 
          href="/tech" 
          className="font-sans font-bold text-[13px] text-[#111111] underline hover:text-[#333333]"
        >
          View All
        </Link>
      </div>

      {/* Main Grid: Left Hero (8 cols), Right 3 Stories (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[0.4cm] items-start">
        {/* LEFT HERO AREA */}
        <div className="lg:col-span-8 flex flex-col justify-start">
          {heroItem.imageUrl && (
            <Link
              href={`/article/${heroItem.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
            >
              <img
                src={heroItem.imageUrl}
                alt={heroItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}
          
          {heroItem.categoryTag && (
            <div className="mb-1">
              <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#111111]">
                {heroItem.categoryTag}
              </span>
            </div>
          )}

          <h3 className="font-serif font-bold text-[22px] sm:text-[24px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
            <Link href={`/article/${heroItem.slug}`}>
              {heroItem.title}
            </Link>
          </h3>
          
          {heroItem.summary && (
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] line-clamp-3">
              {heroItem.summary}
            </p>
          )}
        </div>

        {/* RIGHT STORIES AREA */}
        <div className="lg:col-span-4 pl-0 lg:pl-2 flex flex-col justify-start pt-4 lg:pt-0">
          {/* Story 1 */}
          <article className="pb-3 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${side1.slug}`}>
                {side1.title}
              </Link>
            </h4>
            {side1.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] line-clamp-3">
                {side1.summary}
              </p>
            )}
          </article>

          {/* Story 2 */}
          <article className="py-3 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${side2.slug}`}>
                {side2.title}
              </Link>
            </h4>
            {side2.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                {side2.summary}
              </p>
            )}
            {side2.commentsCount !== undefined && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
                <span>💬</span>
                <span>{side2.commentsCount}</span>
              </div>
            )}
          </article>

          {/* Story 3 */}
          <article className="pt-3">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${side3.slug}`}>
                {side3.title}
              </Link>
            </h4>
            {side3.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                {side3.summary}
              </p>
            )}
            {side3.commentsCount !== undefined && (
              <div className="font-sans text-[12px] text-[#777777] flex items-center space-x-1">
                <span>💬</span>
                <span>{side3.commentsCount}</span>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

export default TechCategorySection;
