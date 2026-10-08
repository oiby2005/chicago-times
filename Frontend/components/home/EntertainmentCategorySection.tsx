"use client";

import React from "react";
import Link from "next/link";

interface EntArticle {
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

const ENTERTAINMENT_SUBCATS = ["movies", "television", "music", "celebrity"];

const getEntertainmentLabel = (p: any): string => {
  const mainCat = (p.category || "").trim().toLowerCase();
  const subCats: string[] = Array.isArray(p.subCategories) ? p.subCategories : [];

  const validSub = subCats.find((sc) => ENTERTAINMENT_SUBCATS.includes(sc.trim().toLowerCase()));
  if (mainCat === "entertainment" && validSub) {
    return validSub;
  }
  return "Entertainment";
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

const defaultArticles: EntArticle[] = [
  {
    id: "ent1",
    categoryTag: "NEW",
    homeTags: ["TELEVISION", "EXCLUSIVE"],
    title: "The new faces of The Grand Tour: We have Jeremy Clarkson’s blessing",
    slug: "the-new-faces-of-the-grand-tour",
    summary: "Francis Bourgeois, Thomas Holland and James Engelsman are taking the wheel of the hit car show. They say they’re not trying to replace the original three amigos",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?fm=webp&fit=crop&w=800&q=80",
    sectionTag: "TV & Radio",
    publishedAt: STATIC_BASE_TIME - 2 * 3600 * 1000,
  },
  {
    id: "ent2",
    categoryTag: "REVIEW | FIRST NIGHT",
    homeTags: ["THEATRE", "REVIEW"],
    title: "Abigail’s Party — Tamzin Outhwaite makes Beverly her own",
    slug: "abigails-party-tamzin-outhwaite",
    imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Theatre & Dance",
    publishedAt: STATIC_BASE_TIME - 4 * 3600 * 1000,
  },
  {
    id: "ent3",
    categoryTag: "NEW | REVIEW | SOCIETY",
    homeTags: ["BOOKS", "SOCIETY"],
    title: "Why have men gone off the rails? They can’t make an honest living",
    slug: "why-have-men-gone-off-the-rails",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Books",
    publishedAt: STATIC_BASE_TIME - 6 * 3600 * 1000,
  },
  {
    id: "ent4",
    categoryTag: "REVIEW",
    homeTags: ["TV", "REVIEW"],
    title: "The £1m secret hiding in a French garden shed... and what happened next",
    slug: "the-1m-secret-hiding-in-a-french-garden-shed",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "TV & Radio",
    publishedAt: STATIC_BASE_TIME - 8 * 3600 * 1000,
  },
  {
    id: "ent5",
    categoryTag: "CINEMA",
    homeTags: ["MOVIES", "CINEMA"],
    title: "Christopher Nolan’s next cinematic epic officially set for 2026 release",
    slug: "christopher-nolans-next-cinematic-epic-2026",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Film",
    publishedAt: STATIC_BASE_TIME - 10 * 3600 * 1000,
  },
  {
    id: "ent6",
    categoryTag: "CONCERT REVIEW",
    homeTags: ["MUSIC", "CONCERT"],
    title: "Pop music’s new icon takes center stage at sold-out O2 Arena",
    slug: "pop-musics-new-icon-takes-center-stage-o2-arena",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Music",
    publishedAt: STATIC_BASE_TIME - 12 * 3600 * 1000,
  },
  {
    id: "ent7",
    categoryTag: "AUTUMN READS",
    homeTags: ["BOOKS", "READS"],
    title: "The 10 must-read books of autumn that everyone will be talking about",
    slug: "the-10-must-read-books-of-autumn",
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Books",
    publishedAt: STATIC_BASE_TIME - 15 * 3600 * 1000,
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

export const EntertainmentCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<EntArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const entPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = p.homepagePlacement || "None";
          if (placement.includes("Entertainment")) return true;
          if (!placement.startsWith("None")) return false;
          return p.category === "Entertainment" || p.category === "Arts" || p.category === "Culture";
        });

        entPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (entPosts.length > 0) {
          const formatted: EntArticle[] = entPosts.slice(0, 7).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?fm=webp&fit=crop&w=800&q=80",
            sectionTag: getEntertainmentLabel(p),
            publishedAt: p.publishedAt,
            homeTags: parseHomeTags(p),
          }));

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

  const renderHomeTags = (item: EntArticle) => {
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
      {/* Section Header with dashed line BELOW the Entertainment text */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#b82e2e] tracking-tight">
          <Link href="/entertainment" className="hover:underline">
            Entertainment
          </Link>
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#fcf0f0] flex items-center justify-center text-[#b82e2e] cursor-pointer hover:bg-[#f7dede] translate-y-[2px]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* Main Grid across all 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* LEFT & CENTER HERO AREA (8 of 12 cols ~ 67%) */}
        <div className="lg:col-span-8 pr-0 lg:pr-4 flex flex-col justify-start h-full border-b lg:border-b-0 lg:border-r border-dashed border-[#CCCCCC] pb-6 lg:pb-0 mb-6 lg:mb-0">
          
          {/* Top Half: Position 1 Hero */}
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
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
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

          {/* Bottom Half: Positions 2 & 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 mt-4">
            {/* Position 2 */}
            <div className="flex items-start space-x-3 pr-0 md:pr-3 border-b md:border-b-0 md:border-r border-dashed border-[#CCCCCC] pb-4 md:pb-0 mb-4 md:mb-0">
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

            {/* Position 3 */}
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
            <article className="pr-2 sm:pr-3.5 pb-4 sm:border-r border-dashed border-[#CCCCCC] flex flex-col justify-between">
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
            <article className="pr-2 sm:pr-3.5 pt-4 sm:border-r border-dashed border-[#CCCCCC] flex flex-col justify-between">
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

export default EntertainmentCategorySection;
