"use client";

import React from "react";
import Link from "next/link";

interface LifeArticle {
  id: string;
  categoryTag?: string;
  homeTags?: string[];
  tags?: string[];
  title: string;
  slug: string;
  summary?: string;
  imageUrl: string;
  sectionTag?: string;
  publishedAt?: number | string;
}

const LIFESTYLE_SUBCATS = ["travel", "food & dining", "cars", "food and dining"];

const getLifestyleLabel = (p: any): string => {
  const mainCat = (p.category || "").trim().toLowerCase();
  const subCats: string[] = Array.isArray(p.subCategories) ? p.subCategories : [];

  const validSub = subCats.find((sc) => LIFESTYLE_SUBCATS.includes(sc.trim().toLowerCase()));
  if (mainCat === "lifestyle" && validSub) {
    return validSub;
  }
  return "Lifestyle";
};

const parseHomeTags = (p: any): string[] => {
  if (!p) return [];
  let tags: string[] = [];
  if (Array.isArray(p.homeTags) && p.homeTags.length > 0) {
    tags = p.homeTags;
  } else if (typeof p.homeTags === "string" && p.homeTags.trim() !== "") {
    tags = p.homeTags.split(",").map((s: string) => s.trim());
  } else if (Array.isArray(p.tags) && p.tags.length > 0) {
    tags = p.tags;
  } else if (typeof p.tags === "string" && p.tags.trim() !== "") {
    tags = p.tags.split(",").map((s: string) => s.trim());
  }
  return tags.map((t: string) => t.replace(/^#/, "").trim()).filter(Boolean).slice(0, 2);
};

import { getRelativeTime } from "@/lib/relativeTime";

const formatTimeAgo = (timestamp?: number | string): string => {
  return getRelativeTime(timestamp);
};

const STATIC_BASE_TIME = 1730000000000;

const defaultArticles: LifeArticle[] = [
  {
    id: "life1",
    homeTags: ["TRAVEL", "WORLD"],
    title: "They Forget Who Started the War",
    slug: "they-forget-who-started-the-war",
    summary: "The leading candidate for U.N. secretary-general can't face the truth of Palestine in 1948 or Israel in 2023. As diplomats debate future leadership, former ambassadors and international legal experts warn that ignoring foundational historical context risks compromising future peacekeeping mandates across the region.",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?fm=webp&fit=crop&w=800&q=80",
    sectionTag: "Lifestyle",
    publishedAt: STATIC_BASE_TIME - 2 * 3600 * 1000,
  },
  {
    id: "life2",
    homeTags: ["FOOD", "DINING"],
    title: "A Realistic Look at the Iran War",
    slug: "a-realistic-look-at-the-iran-war",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Lifestyle",
    publishedAt: STATIC_BASE_TIME - 4 * 3600 * 1000,
  },
  {
    id: "life3",
    homeTags: ["CARS", "LUXURY"],
    title: "Higher Ed's Secret Foreign Funding",
    slug: "higher-eds-secret-foreign-funding",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Lifestyle",
    publishedAt: STATIC_BASE_TIME - 6 * 3600 * 1000,
  },
  {
    id: "life4",
    homeTags: ["TRAVEL", "ADVENTURE"],
    title: "A New Look at the Universe",
    slug: "a-new-look-at-the-universe",
    imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Lifestyle",
    publishedAt: STATIC_BASE_TIME - 8 * 3600 * 1000,
  },
  {
    id: "life5",
    homeTags: ["FOOD", "RECIPES"],
    title: "Who's 'Working Class' Anymore?",
    slug: "whos-working-class-anymore",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Lifestyle",
    publishedAt: STATIC_BASE_TIME - 10 * 3600 * 1000,
  },
  {
    id: "life6",
    homeTags: ["CARS", "EV"],
    title: "Trump's Great White Whale: Canada",
    slug: "trumps-great-white-whale-canada",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Lifestyle",
    publishedAt: STATIC_BASE_TIME - 12 * 3600 * 1000,
  },
  {
    id: "life7",
    homeTags: ["LIFESTYLE", "CULTURE"],
    title: "Chuck Schumer and Hasan Piker",
    slug: "chuck-schumer-and-hasan-piker",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Lifestyle",
    publishedAt: STATIC_BASE_TIME - 15 * 3600 * 1000,
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 450);
};

export const LifestyleCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<LifeArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const lifePosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = p.homepagePlacement || "None";
          if (placement.includes("Lifestyle")) return true;
          if (!placement.startsWith("None")) return false;
          const cat = p.category || "";
          return cat === "Lifestyle" || cat === "Travel" || cat === "Food & Dining" || cat === "Cars";
        });

        lifePosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (lifePosts.length > 0) {
          const formatted: LifeArticle[] = lifePosts.slice(0, 7).map((p: any) => {
            let summary = p.subheadline || extractText(p.bodyContent) || "";
            const matchDefault = defaultArticles.find(
              (d) => d.title.toLowerCase().trim() === p.title.toLowerCase().trim() || (d.slug && d.slug === p.slug)
            );
            if (matchDefault && matchDefault.summary && matchDefault.summary.length > summary.length) {
              summary = matchDefault.summary;
            } else if (summary && summary.length < 180 && p.title.includes("They Forget")) {
              summary += " As diplomats debate future leadership, former ambassadors and international legal experts warn that ignoring foundational historical context risks compromising future peacekeeping mandates across the region.";
            }
            return {
              id: p.id,
              title: p.title,
              slug: p.slug || p.id,
              summary: summary,
              imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1541872703-74c5e44368f9?fm=webp&fit=crop&w=800&q=80",
              sectionTag: getLifestyleLabel(p),
              publishedAt: p.publishedAt,
              homeTags: parseHomeTags(p),
            };
          });

          const merged = [...formatted];
          for (let i = 0; i < defaultArticles.length && merged.length < 7; i++) {
            if (!merged.some((m) => m.id === defaultArticles[i].id)) {
              merged.push(defaultArticles[i]);
            }
          }
          setArticles(merged.slice(0, 7));
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
  const miniItem1 = articles[1] || defaultArticles[1];
  const miniItem2 = articles[2] || defaultArticles[2];

  const sidebarItem1 = articles[3] || defaultArticles[3];
  const sidebarItem2 = articles[4] || defaultArticles[4];
  const sidebarItem3 = articles[5] || defaultArticles[5];
  const sidebarItem4 = articles[6] || defaultArticles[6];

  const renderHomeTags = (item: LifeArticle) => {
    const tags = parseHomeTags(item);
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        {tags.slice(0, 2).map((t, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-[#666666] font-bold text-[11px] mx-0.5">|</span>}
            <span
              className={`${idx === 0 ? "text-[#C00000]" : "text-[#005599]"} font-sans font-bold text-[11px] uppercase tracking-wider block`}
            >
              {t}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full font-sans select-none pt-2 pb-4 my-0">
      {/* Section Header */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#4A2E80] tracking-tight">
          <Link href="/lifestyle" className="hover:underline">
            Lifestyle
          </Link>
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#f4effc] flex items-center justify-center text-[#4A2E80] cursor-pointer hover:bg-[#e9defa] translate-y-[2px]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* Main Grid across all 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* LEFT & CENTER HERO AREA (8 of 12 cols ~ 67%) */}
        <div className="lg:col-span-8 pr-0 lg:pr-4 flex flex-col justify-start h-full border-r border-dashed border-[#CCCCCC]">
          
          {/* Top Half: Left Headline Text (4 cols) + Large Hero Photo (4 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 pb-4 border-b border-dashed border-[#CCCCCC]">
            {/* Left Headline */}
            <div className="md:col-span-4 flex flex-col justify-start">
              {renderHomeTags(heroItem)}
              <h3 className="font-serif font-bold text-[26px] sm:text-[30px] leading-[1.12] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href={`/article/${heroItem.slug}`}>
                  {heroItem.title}
                </Link>
              </h3>
              {heroItem.summary && (
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-6">
                  {heroItem.summary}
                </p>
              )}
              {heroItem.sectionTag && (
                <span className="font-sans font-bold text-[11.5px] text-[#111111] block mb-1">
                  {heroItem.sectionTag}
                </span>
              )}
              <span className="font-mono text-[11px] text-[#666666] mt-1 block">
                {formatTimeAgo(heroItem.publishedAt)}
              </span>
            </div>

            {/* Right Large Hero Image */}
            <div className="md:col-span-4">
              <Link
                href={`/article/${heroItem.slug}`}
                className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 group"
              >
                <img
                  src={heroItem.imageUrl}
                  alt={heroItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Bottom Half: 2 Mini Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mt-2">
            {/* Mini Story 1 */}
            <div className="flex items-start space-x-3 pr-0 md:pr-3 border-r border-dashed border-[#CCCCCC]">
              <Link
                href={`/article/${miniItem1.slug}`}
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src={miniItem1.imageUrl}
                  alt={miniItem1.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  {renderHomeTags(miniItem1)}
                  <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-1 line-clamp-3 overflow-hidden text-ellipsis" style={{ fontFamily: "Georgia, serif" }}>
                    <Link href={`/article/${miniItem1.slug}`}>
                      {miniItem1.title}
                    </Link>
                  </h4>
                  {miniItem1.sectionTag && (
                    <span className="font-sans font-bold text-[11.5px] text-[#333333] block mb-1">
                      {miniItem1.sectionTag}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                    {formatTimeAgo(miniItem1.publishedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mini Story 2 */}
            <div className="flex items-start space-x-3 pl-0 md:pl-1">
              <Link
                href={`/article/${miniItem2.slug}`}
                className="block relative w-[140px] sm:w-[165px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
              >
                <img
                  src={miniItem2.imageUrl}
                  alt={miniItem2.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  {renderHomeTags(miniItem2)}
                  <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-1 line-clamp-3 overflow-hidden text-ellipsis" style={{ fontFamily: "Georgia, serif" }}>
                    <Link href={`/article/${miniItem2.slug}`}>
                      {miniItem2.title}
                    </Link>
                  </h4>
                  {miniItem2.sectionTag && (
                    <span className="font-sans font-bold text-[11.5px] text-[#333333] block mb-1">
                      {miniItem2.sectionTag}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                    {formatTimeAgo(miniItem2.publishedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR STORIES AREA (2x2 Grid of 4 Articles) */}
        <div className="lg:col-span-4 pl-0 lg:pl-4 pt-4 lg:pt-0">
          <div className="grid grid-cols-2 gap-0">
            
            {/* Top-Left (Item 1 of sidebar) */}
            <article className="pr-3.5 pb-4 border-r border-dashed border-[#CCCCCC] flex flex-col justify-between">
              <div className="pb-3 border-b border-dashed border-[#CCCCCC] flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/article/${sidebarItem1.slug}`}
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
                  >
                    <img
                      src={sidebarItem1.imageUrl}
                      alt={sidebarItem1.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {renderHomeTags(sidebarItem1)}
                  <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-1 line-clamp-3 overflow-hidden text-ellipsis" style={{ fontFamily: "Georgia, serif" }}>
                    <Link href={`/article/${sidebarItem1.slug}`}>
                      {sidebarItem1.title}
                    </Link>
                  </h4>
                  {sidebarItem1.sectionTag && (
                    <span className="font-sans font-bold text-[11.5px] text-[#333333] block mb-1">
                      {sidebarItem1.sectionTag}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                    {formatTimeAgo(sidebarItem1.publishedAt)}
                  </span>
                </div>
              </div>
            </article>

            {/* Top-Right (Item 2 of sidebar) */}
            <article className="pl-3.5 pb-4 flex flex-col justify-between">
              <div className="pb-3 border-b border-dashed border-[#CCCCCC] flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/article/${sidebarItem2.slug}`}
                    className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
                  >
                    <img
                      src={sidebarItem2.imageUrl}
                      alt={sidebarItem2.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {renderHomeTags(sidebarItem2)}
                  <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-1 line-clamp-3 overflow-hidden text-ellipsis" style={{ fontFamily: "Georgia, serif" }}>
                    <Link href={`/article/${sidebarItem2.slug}`}>
                      {sidebarItem2.title}
                    </Link>
                  </h4>
                  {sidebarItem2.sectionTag && (
                    <span className="font-sans font-bold text-[11.5px] text-[#333333] block mb-1">
                      {sidebarItem2.sectionTag}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                    {formatTimeAgo(sidebarItem2.publishedAt)}
                  </span>
                </div>
              </div>
            </article>

            {/* Bottom-Left (Item 3 of sidebar) */}
            <article className="pr-3.5 pt-4 border-r border-dashed border-[#CCCCCC] flex flex-col justify-between">
              <div>
                <Link
                  href={`/article/${sidebarItem3.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
                >
                  <img
                    src={sidebarItem3.imageUrl}
                    alt={sidebarItem3.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                {renderHomeTags(sidebarItem3)}
                <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-1 line-clamp-3 overflow-hidden text-ellipsis" style={{ fontFamily: "Georgia, serif" }}>
                  <Link href={`/article/${sidebarItem3.slug}`}>
                    {sidebarItem3.title}
                  </Link>
                </h4>
                {sidebarItem3.sectionTag && (
                  <span className="font-sans font-bold text-[11.5px] text-[#333333] block mb-1">
                    {sidebarItem3.sectionTag}
                  </span>
                )}
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                  {formatTimeAgo(sidebarItem3.publishedAt)}
                </span>
              </div>
            </article>

            {/* Bottom-Right (Item 4 of sidebar) */}
            <article className="pl-3.5 pt-4 flex flex-col justify-between">
              <div>
                <Link
                  href={`/article/${sidebarItem4.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2 group"
                >
                  <img
                    src={sidebarItem4.imageUrl}
                    alt={sidebarItem4.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                {renderHomeTags(sidebarItem4)}
                <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-1 line-clamp-3 overflow-hidden text-ellipsis" style={{ fontFamily: "Georgia, serif" }}>
                  <Link href={`/article/${sidebarItem4.slug}`}>
                    {sidebarItem4.title}
                  </Link>
                </h4>
                {sidebarItem4.sectionTag && (
                  <span className="font-sans font-bold text-[11.5px] text-[#333333] block mb-1">
                    {sidebarItem4.sectionTag}
                  </span>
                )}
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                  {formatTimeAgo(sidebarItem4.publishedAt)}
                </span>
              </div>
            </article>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LifestyleCategorySection;
