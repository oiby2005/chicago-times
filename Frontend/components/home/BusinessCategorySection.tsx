"use client";

import React from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

import { getRelativeTime } from "@/lib/relativeTime";

interface BusinessArticle {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  imageUrl?: string;
  customBreakTitle?: string;
  publishedAt?: number;
}

const formatTimeAgo = (timestamp?: number | string): string => {
  return getRelativeTime(timestamp);
};

const STATIC_BASE_TIME = 1730000000000;

const defaultArticles: BusinessArticle[] = [
  // Position 1: Left Top
  {
    id: "l1",
    title: "Business secretary’s wife is favourite for Labour general secretary",
    slug: "business-secretary-wife-favourite-labour-general-secretary",
    summary:
      "No 10 insider Claire Reynolds, who is married to Jonathan Reynolds, is also a close friend of Burnham's chief of staff James Purnell. Former ministers and senior party officials expect her to stand for the powerful internal role, which manages party operations, election strategies, and staff across the nation.",
    publishedAt: STATIC_BASE_TIME - 3 * 3600 * 1000,
  },
  // Position 2: Left Middle
  {
    id: "l2",
    title: "Domestic abuse is illegal, asylum seekers told in advice on UK life",
    slug: "domestic-abuse-illegal-asylum-seekers-advice-uk-life",
    summary:
      "Nine-page Home Office pamphlet to help behaviour of new arrivals says men and women are equal — critics claim it paints the entire group as a 'menace'. The comprehensive guidance document outlines societal expectations, legal obligations, domestic violence laws, and cultural standards in detail.",
    publishedAt: STATIC_BASE_TIME - 5 * 3600 * 1000,
  },
  // Position 3: Left Bottom
  {
    id: "l3",
    title: "Migrant who raped sleeping woman allowed to stay in UK",
    slug: "migrant-who-raped-sleeping-woman-allowed-stay-uk",
    summary:
      "Immigration tribunal ruling fuels calls from the Conservatives and Reform UK for Britain to leave the ECHR. The controversial decision has sparked intense national debate regarding judicial discretion, deportation powers, and human rights legislation across parliament.",
    publishedAt: STATIC_BASE_TIME - 8 * 3600 * 1000,
  },
  // Position 4: Center Main Hero
  {
    id: "cm1",
    title: "Inside the Wales wildfire zone: ‘Like something from Apocalypse Now’",
    slug: "inside-wales-wildfire-zone-like-something-from-apocalypse-now",
    summary:
      "A photographer spent 36 hours with embattled firefighters who were stretched to their limits as fires ravaged tinderbox hillsides",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?fm=webp&fit=crop&w=800&q=80",
    publishedAt: STATIC_BASE_TIME - 2 * 3600 * 1000,
  },
  // Position 5: Center Bottom Left
  {
    id: "cb1",
    title: "New NHS drug for diabetes could cut jabs to one a week",
    slug: "new-nhs-drug-diabetes-cut-jabs-one-week",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?fm=webp&fit=crop&w=400&q=80",
    publishedAt: STATIC_BASE_TIME - 14 * 3600 * 1000,
  },
  // Position 6: Center Bottom Right
  {
    id: "cb2",
    title: "Israel to investigate its killing of five-year-old girl",
    slug: "israel-investigate-killing-five-year-old-girl",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fm=webp&fit=crop&w=400&q=80",
    publishedAt: STATIC_BASE_TIME - 18 * 3600 * 1000,
  },
  // Position 7: Right Top
  {
    id: "rt1",
    title: "Trump declares ‘economic D-Day’ against Iran",
    slug: "trump-declares-economic-d-day-against-iran",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=300&q=80",
    publishedAt: STATIC_BASE_TIME - 4 * 3600 * 1000,
  },
  // Position 8: Right Bottom
  {
    id: "rt2",
    title: "Fastest star in the galaxy ‘will reveal black hole’s secrets’",
    slug: "fastest-star-galaxy-will-reveal-black-hole-secrets",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?fm=webp&fit=crop&w=300&q=80",
    publishedAt: STATIC_BASE_TIME - 29 * 3600 * 1000,
  },
];

const extractText = (html: string): string => {
  if (!html) return "";
  if (typeof window !== "undefined") {
    try {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      const figures = tmp.querySelectorAll("figure, img, style, script");
      figures.forEach((f) => f.remove());
      const text = (tmp.textContent || tmp.innerText || "").trim();
      if (text) return text.slice(0, 600);
    } catch (e) {}
  }
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
};

export const BusinessCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<BusinessArticle[]>(defaultArticles);

  const loadBusinessPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const bizPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = p.homepagePlacement || "None";
          if (placement.includes("Business")) return true;
          if (!placement.startsWith("None")) return false;
          return p.category === "Business";
        });

        bizPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (bizPosts.length > 0) {
          const formatted: BusinessArticle[] = bizPosts.slice(0, 8).map((p: any) => {
            const bodyTxt = extractText(p.bodyContent);
            let summaryText = (p.subheadline || "").trim();
            if (bodyTxt) {
              if (summaryText) {
                if (!summaryText.endsWith(".") && !summaryText.endsWith("!") && !summaryText.endsWith("?")) {
                  summaryText += ".";
                }
                summaryText += " " + bodyTxt;
              } else {
                summaryText = bodyTxt;
              }
            }
            return {
              id: p.id,
              title: p.title,
              slug: p.slug || p.id,
              summary: summaryText,
              imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?fm=webp&fit=crop&w=800&q=80",
              publishedAt: p.publishedAt || (p.id && !isNaN(Number(p.id)) ? Number(p.id) : undefined),
            };
          });

          const merged = [...formatted];
          for (let i = 0; i < defaultArticles.length && merged.length < 8; i++) {
            if (!merged.some((m) => m.id === defaultArticles[i].id)) {
              merged.push(defaultArticles[i]);
            }
          }
          setArticles(merged.slice(0, 8));
          return;
        }
      }
    } catch (e) {}
    setArticles(defaultArticles);
  }, []);

  React.useEffect(() => {
    loadBusinessPosts();
    window.addEventListener("wsj_posts_updated", loadBusinessPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadBusinessPosts);
  }, [loadBusinessPosts]);

  // Position 1..3: Left Column
  const leftItems = articles.slice(0, 3);
  // Position 4: Center Hero
  const centerHeroItem = articles[3] || defaultArticles[3];
  // Position 5..6: Center Bottom
  const centerBottomItems = articles.slice(4, 6);
  // Position 7..8: Right Column
  const rightItems = articles.slice(6, 8);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0 font-sans select-none border-b border-dashed border-[#888070] pb-5 items-stretch">
      {/* COLUMN 1 (LEFT ~ 3 of 12 cols): Positions 1, 2, 3 */}
      <div 
        className="col-span-12 md:col-span-1 lg:col-span-3 pr-0 md:pr-[0.3cm] pb-0 lg:pb-0 flex flex-col lg:justify-between justify-start border-b lg:border-b-0 lg:border-r border-dashed border-[#888070] mb-0 lg:mb-0 lg:h-full"
      >
        {/* Business Category Section Topic Header */}
        <div className="flex items-center space-x-2 pb-2 mb-2 lg:pb-1 lg:mb-1 shrink-0">
          <h2 className="font-serif font-bold text-[24px] sm:text-[26px] lg:text-[26px] text-[#1b7538] leading-none tracking-tight">
            <Link href="/business" className="hover:underline">
              Business
            </Link>
          </h2>
          <div className="w-5 h-5 rounded-full bg-[#f0f7f2] flex items-center justify-center text-[#1b7538] cursor-pointer hover:bg-[#e1f0e5] translate-y-[3px]">
            <span className="text-[13px] font-bold leading-none">›</span>
          </div>
        </div>

        {/* Articles List with equal space for all 3 articles on desktop */}
        <div className="divide-y divide-dashed divide-[#888070] lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
          {leftItems.map((art, idx) => (
            <article
              key={art.id}
              className={`py-4 lg:py-2 ${idx === 0 ? "pt-0 lg:pt-0" : ""} ${idx === leftItems.length - 1 ? "pb-[24px] lg:pb-0" : ""} flex flex-col justify-between lg:flex-1 lg:min-h-0 lg:overflow-hidden`}
            >
              <div className="lg:min-h-0 lg:overflow-hidden">
                <h3
                  className={`font-serif font-bold text-[#111111] hover:text-[#333333] hover:underline cursor-pointer ${idx === 0 ? "text-[22px] sm:text-[24px] lg:text-[21px] leading-[1.12]" : "text-[17px] sm:text-[18px] lg:text-[17.5px] leading-[1.15]"}`}
                  style={{
                    whiteSpace: art.customBreakTitle ? "pre-line" : "normal",
                    ...(idx > 0 ? { fontFamily: "Georgia, serif" } : {}),
                  }}
                >
                  <Link href={`/article/${art.slug}`}>
                    {art.customBreakTitle || art.title}
                  </Link>
                </h3>
                {art.summary && (
                  <p className={`font-sans text-[12.5px] sm:text-[13px] lg:text-[12px] leading-[1.4] lg:leading-[1.3] text-[#444444] mt-1.5 lg:mt-1 line-clamp-5 ${
                    (art.title?.length || 0) > 60 ? "lg:line-clamp-3" : "lg:line-clamp-4"
                  }`}>
                    {art.summary}
                  </p>
                )}
              </div>
              <span className="font-mono text-[11px] text-[#666666] mt-1 lg:mt-auto block shrink-0">
                {formatTimeAgo(art.publishedAt)}
              </span>
            </article>
          ))}
        </div>
      </div>

      {/* COLUMN 2 (CENTER ~ 5 of 12 cols): Position 4 (Hero) and Positions 5, 6 (Bottom Cards) */}
      <div 
        className="col-span-12 md:col-span-1 lg:col-span-5 px-0 md:px-[0.3cm] py-0 lg:py-0 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-dashed border-[#888070] my-0 lg:my-0 pb-5 lg:pb-0"
      >
        {/* Position 4: Featured Main Hero */}
        {centerHeroItem && (
          <article className="pt-[24px] lg:pt-0 pb-6 lg:pb-3 mb-0 lg:mb-3 border-b border-dashed border-[#888070] flex flex-col justify-center">
            <Link href={`/article/${centerHeroItem.slug}`} className="block relative w-full h-[5.5cm] sm:h-[5.8cm] lg:h-[5.5cm] overflow-hidden bg-gray-100 mb-2 group">
              <img
                src={centerHeroItem.imageUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?fm=webp&fit=crop&w=800&q=80"}
                alt={centerHeroItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <h2 className="font-serif font-bold text-[19px] sm:text-[20px] leading-[1.18] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer" style={{ fontFamily: "Georgia, serif" }}>
              <Link href={`/article/${centerHeroItem.slug}`}>
                {centerHeroItem.title}
              </Link>
            </h2>
            {centerHeroItem.summary && (
              <p className="font-sans text-[12px] sm:text-[12.5px] leading-[1.35] text-[#555555] mt-1 line-clamp-2">
                {centerHeroItem.summary}
              </p>
            )}
            <span className="font-mono text-[11px] text-[#666666] mt-1 block">
              {formatTimeAgo(centerHeroItem.publishedAt)}
            </span>
          </article>
        )}

        {/* Positions 5 & 6: Bottom 2 Side-by-Side Cards */}
        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-[0.3cm]">
          {centerBottomItems.map((art) => (
            <article key={art.id} className="flex flex-col justify-start py-[20px] sm:py-0 border-b sm:border-b-0 border-dashed border-[#888070] last:border-b-0">
              <div className="flex flex-col h-full">
                <Link href={`/article/${art.slug}`} className="shrink-0 block w-full h-[110px] sm:h-[110px] lg:h-[120px] overflow-hidden bg-gray-100 border border-gray-200 group mb-2">
                  <img
                    src={art.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?fm=webp&fit=crop&w=400&q=80"}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="font-serif font-bold text-[16px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer" style={{ fontFamily: "Georgia, serif" }}>
                    <Link href={`/article/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>
                  <span className="font-mono text-[11px] text-[#666666] mt-1.5 block">
                    {formatTimeAgo(art.publishedAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* COLUMN 3 (RIGHT ~ 4 of 12 cols): Positions 7 & 8 + Ad 1 Box */}
      <div className="col-span-12 md:col-span-2 lg:col-span-4 pl-0 md:pl-[0.3cm] pt-6 lg:pt-0 flex flex-col justify-between h-full">
        {/* Positions 7 & 8: Top 2 Thumbnail Stories */}
        <div className="divide-y divide-dashed divide-[#888070] shrink-0">
          {rightItems.map((art, idx) => (
            <article key={art.id} className={`py-4 lg:py-2 ${idx === 0 ? "pt-0" : ""} flex items-stretch lg:items-start justify-between space-x-3`}>
              <div className="flex-1 min-w-0 flex flex-col justify-between lg:block">
                <h3 className="font-serif font-bold text-[17px] sm:text-[18px] lg:text-[18px] leading-[1.15] text-[#111111] hover:underline cursor-pointer line-clamp-2" style={{ fontFamily: "Georgia, serif" }}>
                  <Link href={`/article/${art.slug}`}>
                    {art.title}
                  </Link>
                </h3>
                <span className="font-mono text-[11px] text-[#666666] mt-1 block">
                  {formatTimeAgo(art.publishedAt)}
                </span>
              </div>
              <Link href={`/article/${art.slug}`} className="shrink-0 block w-[100px] h-auto self-stretch lg:h-[66px] overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={art.imageUrl || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=300&q=80"}
                  alt={art.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </article>
          ))}
        </div>

        {/* Ad 1 (Business Sidebar) - Equalized top and bottom spacing to dashed lines on desktop/laptop */}
        <div className="mt-3 lg:mt-2 pt-3 lg:pt-[36px] pb-4 lg:pb-[16px] border-t-0 border-b-0 lg:border-t border-dashed border-[#888070] flex-1 flex flex-col items-center justify-center min-h-0">
          <AdPlaceholder slotId="hp_slot_1" width="w-full" height="h-full min-h-[160px]" resolution="300 × 300" className="my-0 mb-0 h-full flex-1 flex flex-col" />
        </div>
      </div>
    </div>
  );
};

export default BusinessCategorySection;
