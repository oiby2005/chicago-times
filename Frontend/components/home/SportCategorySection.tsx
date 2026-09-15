"use client";

import React from "react";
import Link from "next/link";

interface SportArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  summary?: string;
  imageUrl: string;
  sectionTag?: string;
  publishedAt?: number | string;
}

const formatTimeAgo = (timestamp?: number | string): string => {
  if (!timestamp) return "2 hours ago";
  const now = Date.now();
  const time = typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp;
  if (isNaN(time) || time <= 0) return "2 hours ago";
  const diffMs = Math.max(0, now - time);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const defaultArticles: SportArticle[] = [
  {
    id: "sp1",
    categoryTag: "FIRST TEST | MIKE ATHERTON",
    title: "Returning Robinson’s excellence ensures Stokes is not missed",
    slug: "returning-robinsons-excellence",
    summary: "Headingley (day one of five): Root guides England to 112 for two in reply to Pakistan’s 171 after five wickets each for Robinson and Tongue",
    imageUrl: "/images/world/england_cricket.jpg",
    sectionTag: "Cricket",
    publishedAt: Date.now() - 2 * 3600 * 1000,
  },
  {
    id: "sp2",
    title: "Spurs in double swoop for Marmoush and Savinho from City",
    slug: "spurs-in-double-swoop-for-marmoush-and-savinho",
    imageUrl: "/images/spurs.jpg",
    sectionTag: "Football",
    publishedAt: Date.now() - 4 * 3600 * 1000,
  },
  {
    id: "sp3",
    categoryTag: "COMMENT | MATTHEW SYED",
    title: "Poor old Warner — forever the victim, never the culprit",
    slug: "poor-old-warner-forever-the-victim",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Cricket",
    publishedAt: Date.now() - 6 * 3600 * 1000,
  },
  {
    id: "sp4",
    categoryTag: "FIRST TEST | STEVE JAMES",
    title: "Root ditches tinkering on day of sharp, decisive captaincy",
    slug: "root-ditches-tinkering-on-day-of-sharp-decisive-captaincy",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Cricket",
    publishedAt: Date.now() - 8 * 3600 * 1000,
  },
  {
    id: "sp5",
    categoryTag: "WINDOW WATCH",
    title: "United submit £65m bid for Brighton’s Baleba as Jones nears Inter move",
    slug: "united-submit-65m-bid-for-brightons-baleba",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Football",
    publishedAt: Date.now() - 10 * 3600 * 1000,
  },
  {
    id: "sp6",
    categoryTag: "TOM KERSHAW",
    title: "Cocaine ban does not mean the end for Kyrgios in sport that consumes stars",
    slug: "cocaine-ban-does-not-mean-end-for-kyrgios",
    imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Tennis",
    publishedAt: Date.now() - 12 * 3600 * 1000,
  },
  {
    id: "sp7",
    title: "‘Off grid’ UK athletics coach in Moroccan jail for sexually assaulting minor",
    slug: "off-grid-uk-athletics-coach-in-moroccan-jail",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?fm=webp&fit=crop&w=600&q=80",
    sectionTag: "Athletics",
    publishedAt: Date.now() - 15 * 3600 * 1000,
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

export const SportCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<SportArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const sportPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const placement = p.homepagePlacement || "None";
          if (placement.includes("Sport")) return true;
          if (!placement.startsWith("None")) return false;
          const cat = p.category || "";
          return cat === "Sports" || cat === "Sport" || cat === "Soccer" || cat === "Golf" || cat === "Tennis" || cat === "Cricket";
        });

        sportPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (sportPosts.length > 0) {
          const formatted: SportArticle[] = sportPosts.slice(0, 7).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?fm=webp&fit=crop&w=800&q=80",
            sectionTag: p.subCategories?.[0] || "Sports",
            publishedAt: p.publishedAt,
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

  return (
    <div className="w-full font-sans select-none pt-2 pb-4 my-0">
      {/* Section Header with dashed line BELOW the Sport text */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#1b7538] tracking-tight">
          <Link href="/sports" className="hover:underline">
            Sport
          </Link>
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#f0f7f2] flex items-center justify-center text-[#1b7538] cursor-pointer hover:bg-[#e1f0e5]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* Main Grid across all 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* LEFT & CENTER HERO AREA (8 of 12 cols ~ 67%) */}
        <div className="lg:col-span-8 pr-0 lg:pr-4 flex flex-col justify-start h-full" style={{ borderRight: "1px solid #CCCCCC" }}>
          
          {/* Top Half: Left Headline Text (4 cols) + Large Hero Photo (4 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 pb-4 border-b border-dashed border-[#CCCCCC]">
            {/* Left Headline */}
            <div className="md:col-span-4 flex flex-col justify-start">
              {heroItem.categoryTag && (
                <div className="mb-1">
                  <span className="font-sans font-bold text-[11px] tracking-wider text-[#1b7538] uppercase">
                    {heroItem.categoryTag}
                  </span>
                </div>
              )}
              <h3 className="font-serif font-bold text-[28px] sm:text-[32px] leading-[1.12] text-[#111111] hover:underline cursor-pointer mb-2">
                <Link href={`/article/${heroItem.slug}`}>
                  {heroItem.title}
                </Link>
              </h3>
              {heroItem.summary && (
                <p className="font-sans text-[13px] leading-relaxed text-[#555555] mb-2 line-clamp-3">
                  {heroItem.summary}
                </p>
              )}
              <div className="mt-1">
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  {heroItem.sectionTag || "Cricket"}
                </span>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Mini Story 1 */}
            <div className="flex items-start space-x-3 pr-0 md:pr-3" style={{ borderRight: "1px solid #CCCCCC" }}>
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
                <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                  <Link href={`/article/${miniItem1.slug}`}>
                    {miniItem1.title}
                  </Link>
                </h4>
                <div>
                  <span className="font-sans font-bold text-[12px] text-[#111111]">
                    {miniItem1.sectionTag || "Football"}
                  </span>
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
                  {miniItem2.categoryTag && (
                    <div className="mb-1">
                      <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                        {miniItem2.categoryTag}
                      </span>
                    </div>
                  )}
                  <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                    <Link href={`/article/${miniItem2.slug}`}>
                      {miniItem2.title}
                    </Link>
                  </h4>
                </div>
                <div>
                  <span className="font-sans font-bold text-[12px] text-[#111111]">
                    {miniItem2.sectionTag || "Cricket"}
                  </span>
                  <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                    {formatTimeAgo(miniItem2.publishedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR STORIES AREA (2x2 Grid of 4 Articles matching Image 1) */}
        <div className="lg:col-span-4 pl-0 lg:pl-4 pt-4 lg:pt-0">
          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            
            {/* Top-Left (Item 1 of sidebar) */}
            <article className="pr-2 pb-3 border-r border-b border-dashed border-[#CCCCCC] flex flex-col justify-between">
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
                {sidebarItem1.categoryTag && (
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                      {sidebarItem1.categoryTag}
                    </span>
                  </div>
                )}
                <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                  <Link href={`/article/${sidebarItem1.slug}`}>
                    {sidebarItem1.title}
                  </Link>
                </h4>
              </div>
              <div>
                <span className="font-sans font-bold text-[11px] text-[#111111] mt-1 block">
                  {sidebarItem1.sectionTag || "Cricket"}
                </span>
                <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                  {formatTimeAgo(sidebarItem1.publishedAt)}
                </span>
              </div>
            </article>

            {/* Top-Right (Item 2 of sidebar) */}
            <article className="pl-1 pb-3 border-b border-dashed border-[#CCCCCC] flex flex-col justify-between">
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
                {sidebarItem2.categoryTag && (
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                      {sidebarItem2.categoryTag}
                    </span>
                  </div>
                )}
                <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                  <Link href={`/article/${sidebarItem2.slug}`}>
                    {sidebarItem2.title}
                  </Link>
                </h4>
              </div>
              <div>
                <span className="font-sans font-bold text-[11px] text-[#111111] mt-1 block">
                  {sidebarItem2.sectionTag || "Football"}
                </span>
                <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                  {formatTimeAgo(sidebarItem2.publishedAt)}
                </span>
              </div>
            </article>

            {/* Bottom-Left (Item 3 of sidebar) */}
            <article className="pr-2 pt-1 border-r border-dashed border-[#CCCCCC] flex flex-col justify-between">
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
                {sidebarItem3.categoryTag && (
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                      {sidebarItem3.categoryTag}
                    </span>
                  </div>
                )}
                <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                  <Link href={`/article/${sidebarItem3.slug}`}>
                    {sidebarItem3.title}
                  </Link>
                </h4>
              </div>
              <div>
                <span className="font-sans font-bold text-[11px] text-[#111111] mt-1 block">
                  {sidebarItem3.sectionTag || "Tennis"}
                </span>
                <span className="font-mono text-[11px] text-[#666666] mt-0.5 block">
                  {formatTimeAgo(sidebarItem3.publishedAt)}
                </span>
              </div>
            </article>

            {/* Bottom-Right (Item 4 of sidebar) */}
            <article className="pl-1 pt-1 flex flex-col justify-between">
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
                {sidebarItem4.categoryTag && (
                  <div className="mb-1">
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#1b7538] uppercase">
                      {sidebarItem4.categoryTag}
                    </span>
                  </div>
                )}
                <h4 className="font-serif font-bold text-[14px] sm:text-[15px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                  <Link href={`/article/${sidebarItem4.slug}`}>
                    {sidebarItem4.title}
                  </Link>
                </h4>
              </div>
              <div>
                <span className="font-sans font-bold text-[11px] text-[#111111] mt-1 block">
                  {sidebarItem4.sectionTag || "Athletics"}
                </span>
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

export default SportCategorySection;
