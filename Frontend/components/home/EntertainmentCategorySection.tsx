"use client";

import React from "react";
import Link from "next/link";

interface EntArticle {
  id: string;
  categoryTag?: string;
  title: string;
  slug: string;
  summary?: string;
  imageUrl: string;
  sectionTag?: string;
}

const defaultArticles: EntArticle[] = [
  {
    id: "ent1",
    categoryTag: "NEW",
    title: "The new faces of The Grand Tour: We have Jeremy Clarkson’s blessing",
    slug: "the-new-faces-of-the-grand-tour",
    summary: "Francis Bourgeois, Thomas Holland and James Engelsman are taking the wheel of the hit car show. They say they’re not trying to replace the original three amigos",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    sectionTag: "TV & Radio",
  },
  {
    id: "ent2",
    categoryTag: "REVIEW | FIRST NIGHT",
    title: "Abigail’s Party — Tamzin Outhwaite makes Beverly her own",
    slug: "abigails-party-tamzin-outhwaite",
    imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
    sectionTag: "Theatre & Dance",
  },
  {
    id: "ent3",
    categoryTag: "NEW | REVIEW | SOCIETY",
    title: "Why have men gone off the rails? They can’t make an honest living",
    slug: "why-have-men-gone-off-the-rails",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    sectionTag: "Books",
  },
  {
    id: "ent4",
    categoryTag: "REVIEW",
    title: "The £1m secret hiding in a French garden shed... and what happened next",
    slug: "the-1m-secret-hiding-in-a-french-garden-shed",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    sectionTag: "TV & Radio",
  },
  {
    id: "ent5",
    categoryTag: "CINEMA",
    title: "Christopher Nolan’s next cinematic epic officially set for 2026 release",
    slug: "christopher-nolans-next-cinematic-epic-2026",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    sectionTag: "Film",
  },
  {
    id: "ent6",
    categoryTag: "CONCERT REVIEW",
    title: "Pop music’s new icon takes center stage at sold-out O2 Arena",
    slug: "pop-musics-new-icon-takes-center-stage-o2-arena",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    sectionTag: "Music",
  },
  {
    id: "ent7",
    categoryTag: "AUTUMN READS",
    title: "The 10 must-read books of autumn that everyone will be talking about",
    slug: "the-10-must-read-books-of-autumn",
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
    sectionTag: "Books",
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
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
            sectionTag: p.subCategories?.[0] || "Entertainment",
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
      {/* Section Header with dashed line BELOW the Entertainment text */}
      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[26px] sm:text-[30px] text-[#b82e2e] tracking-tight">
          <Link href="/arts" className="hover:underline">
            Entertainment
          </Link>
        </h2>
        <div className="w-6 h-6 rounded-full bg-[#fcf0f0] flex items-center justify-center text-[#b82e2e] cursor-pointer hover:bg-[#f7dede]">
          <span className="text-[14px] font-bold leading-none">›</span>
        </div>
      </div>

      {/* Main Grid across all 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        
        {/* LEFT & CENTER HERO AREA (8 of 12 cols ~ 67%) */}
        <div className="lg:col-span-8 pr-0 lg:pr-4 flex flex-col justify-start h-full" style={{ borderRight: "1px solid #CCCCCC" }}>
          
          {/* Top Half: Position 1 Hero */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 pb-4 border-b border-dashed border-[#CCCCCC]">
            {/* Left Headline */}
            <div className="md:col-span-4 flex flex-col justify-start">
              {heroItem.categoryTag && (
                <div className="mb-1">
                  <span className="font-sans font-bold text-[11px] tracking-wider text-[#b82e2e] uppercase">
                    {heroItem.categoryTag}
                  </span>
                </div>
              )}
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
              <div className="mt-1">
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  {heroItem.sectionTag || "TV & Radio"}
                </span>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Position 2 */}
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
                <div>
                  {miniItem1.categoryTag && (
                    <div className="mb-1">
                      <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
                        {miniItem1.categoryTag}
                      </span>
                    </div>
                  )}
                  <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-2">
                    <Link href={`/article/${miniItem1.slug}`}>
                      {miniItem1.title}
                    </Link>
                  </h4>
                </div>
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  {miniItem1.sectionTag || "Theatre & Dance"}
                </span>
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
                  {miniItem2.categoryTag && (
                    <div className="mb-1">
                      <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
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
                <span className="font-sans font-bold text-[12px] text-[#111111]">
                  {miniItem2.sectionTag || "Books"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR STORIES AREA (2x2 Grid of 4 Articles matching Sport section) */}
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
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
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
              <span className="font-sans font-bold text-[11px] text-[#111111] mt-1">
                {sidebarItem1.sectionTag || "TV & Radio"}
              </span>
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
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
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
              <span className="font-sans font-bold text-[11px] text-[#111111] mt-1">
                {sidebarItem2.sectionTag || "Film"}
              </span>
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
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
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
              <span className="font-sans font-bold text-[11px] text-[#111111] mt-1">
                {sidebarItem3.sectionTag || "Music"}
              </span>
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
                    <span className="font-sans font-bold text-[10px] tracking-wider text-[#b82e2e] uppercase">
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
              <span className="font-sans font-bold text-[11px] text-[#111111] mt-1">
                {sidebarItem4.sectionTag || "Books"}
              </span>
            </article>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EntertainmentCategorySection;
