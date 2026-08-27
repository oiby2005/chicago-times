"use client";

import React from "react";
import Link from "next/link";

interface PolArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string;
}

const defaultArticles: PolArticle[] = [
  {
    id: "pol1",
    title: "Hegseth Strips Security Clearance From Biden’s Air Force Secretary",
    slug: "hegseth-strips-security-clearance-biden-air-force-secretary",
    summary: "Frank Kendall, accused of leaking sensitive information, is the latest former defense official to lose access to classified information.",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pol2",
    title: "Senate Committees Prepare Key Confirmation Hearings Following Recess",
    slug: "senate-committees-prepare-key-confirmation-hearings",
    summary: "Lawmakers return to Washington with a packed schedule of high-stakes hearings and policy debates.",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pol3",
    title: "Trump Showed Up at a Rally With Lustrous Locks. The Memes Won’t Stop.",
    slug: "trump-showed-up-at-rally-with-lustrous-locks",
    summary: "The president’s hair looked more voluminous at an event in Las Vegas, and the internet was quick to respond.",
  },
  {
    id: "pol4",
    title: "Trump Revives Attempt to Fire Fed Governor Lisa Cook",
    slug: "trump-revives-attempt-to-fire-fed-governor-lisa-cook",
    summary: "The move, outlined in a White House letter to Cook this week, follows a Supreme Court ruling in June that blocked an earlier attempt.",
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

export const PoliticsCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<PolArticle[]>(defaultArticles);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const polPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            (p.category === "Politics" ||
             p.category === "Law" ||
             p.category === "U.S. News" ||
             p.category === "Congress" ||
             p.category === "Elections" ||
             (p.homepagePlacement && p.homepagePlacement.includes("Politics")))
        );

        polPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (polPosts.length > 0) {
          const formatted: PolArticle[] = polPosts.slice(0, 4).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
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

  const col1 = articles[0] || defaultArticles[0];
  const col2 = articles[1] || defaultArticles[1];
  const col3Top = articles[2] || defaultArticles[2];
  const col3Bottom = articles[3] || defaultArticles[3];

  return (
    <div className="w-full font-sans select-none pt-3 pb-2 my-0">
      {/* Section Title */}
      <div className="mb-3">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          <Link href="/politics" className="hover:underline">
            Politics
          </Link>
        </h2>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-start">
        {/* COLUMN 1 */}
        <article 
          className="pr-0 md:pr-4 flex flex-col justify-start"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          {col1.imageUrl && (
            <Link
              href={`/article/${col1.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
            >
              <img
                src={col1.imageUrl}
                alt={col1.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}
          <h3 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
            <Link href={`/article/${col1.slug}`}>
              {col1.title}
            </Link>
          </h3>
          {col1.summary && (
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] line-clamp-3">
              {col1.summary}
            </p>
          )}
        </article>

        {/* COLUMN 2 */}
        <article 
          className="px-0 md:px-4 py-4 md:py-0 flex flex-col justify-start"
          style={{ borderRight: "1px solid #CCCCCC" }}
        >
          {col2.imageUrl && (
            <Link
              href={`/article/${col2.slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-2.5 group"
            >
              <img
                src={col2.imageUrl}
                alt={col2.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}
          <h3 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
            <Link href={`/article/${col2.slug}`}>
              {col2.title}
            </Link>
          </h3>
          {col2.summary && (
            <p className="font-sans text-[13px] leading-relaxed text-[#555555] line-clamp-3">
              {col2.summary}
            </p>
          )}
        </article>

        {/* COLUMN 3 */}
        <div className="pl-0 md:pl-4 pt-4 md:pt-0 flex flex-col justify-start">
          {/* Top Story */}
          <article className="pb-2.5 mb-2.5 border-b border-dashed border-[#CCCCCC]">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${col3Top.slug}`}>
                {col3Top.title}
              </Link>
            </h4>
            {col3Top.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] line-clamp-3">
                {col3Top.summary}
              </p>
            )}
          </article>

          {/* Bottom Story */}
          <article className="pt-0">
            <h4 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:underline cursor-pointer mb-1.5">
              <Link href={`/article/${col3Bottom.slug}`}>
                {col3Bottom.title}
              </Link>
            </h4>
            {col3Bottom.summary && (
              <p className="font-sans text-[13px] leading-relaxed text-[#555555] line-clamp-3">
                {col3Bottom.summary}
              </p>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

export default PoliticsCategorySection;
