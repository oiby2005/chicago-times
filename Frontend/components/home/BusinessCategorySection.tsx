"use client";

import React from "react";
import Link from "next/link";

interface BusinessArticle {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  imageUrl?: string;
  customBreakTitle?: string;
}

const defaultArticles: BusinessArticle[] = [
  // Position 1: Left Top
  {
    id: "l1",
    title: "Business secretary’s wife is favourite for Labour general secretary",
    customBreakTitle: "Business\nsecretary’s wife is\nfavourite for\nLabour general\nsecretary",
    slug: "business-secretary-wife-favourite-labour-general-secretary",
    summary:
      "No 10 insider Claire Reynolds, who is married to Jonathan Reynolds, is also a close friend of Burnham's chief of staff James Purnell",
  },
  // Position 2: Left Middle
  {
    id: "l2",
    title: "Domestic abuse is illegal, asylum seekers told in advice on UK life",
    slug: "domestic-abuse-illegal-asylum-seekers-advice-uk-life",
    summary:
      "Nine-page Home Office pamphlet to help behaviour of new arrivals says men and women are equal — critics claim it paints the entire group as a 'menace'",
  },
  // Position 3: Left Bottom
  {
    id: "l3",
    title: "Migrant who raped sleeping woman allowed to stay in UK",
    slug: "migrant-who-raped-sleeping-woman-allowed-stay-uk",
    summary:
      "Immigration tribunal ruling fuels calls from the Conservatives and Reform UK for Britain to leave the ECHR",
  },
  // Position 4: Center Main Hero
  {
    id: "cm1",
    title: "Inside the Wales wildfire zone: ‘Like something from Apocalypse Now’",
    slug: "inside-wales-wildfire-zone-like-something-from-apocalypse-now",
    summary:
      "A photographer spent 36 hours with embattled firefighters who were stretched to their limits as fires ravaged tinderbox hillsides",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  },
  // Position 5: Center Bottom Left
  {
    id: "cb1",
    title: "New NHS drug for diabetes could cut jabs to one a week",
    slug: "new-nhs-drug-diabetes-cut-jabs-one-week",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80",
  },
  // Position 6: Center Bottom Right
  {
    id: "cb2",
    title: "Israel to investigate its killing of five-year-old girl",
    slug: "israel-investigate-killing-five-year-old-girl",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  // Position 7: Right Top
  {
    id: "rt1",
    title: "Trump declares ‘economic D-Day’ against Iran",
    customBreakTitle: "Trump declares\n‘economic D-Day’\nagainst Iran",
    slug: "trump-declares-economic-d-day-against-iran",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=300&q=80",
  },
  // Position 8: Right Bottom
  {
    id: "rt2",
    title: "Fastest star in the galaxy ‘will reveal black hole’s secrets’",
    customBreakTitle: "Fastest star in the\ngalaxy ‘will reveal\nblack hole’s secrets’",
    slug: "fastest-star-galaxy-will-reveal-black-hole-secrets",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80",
  },
];

const extractText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim().slice(0, 140);
};

export const BusinessCategorySection: React.FC = () => {
  const [articles, setArticles] = React.useState<BusinessArticle[]>(defaultArticles);

  const loadBusinessPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const bizPosts = posts.filter(
          (p: any) =>
            p.status === "Published" &&
            (p.category === "Business" ||
             (p.homepagePlacement && p.homepagePlacement.includes("Business")))
        );

        bizPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        if (bizPosts.length > 0) {
          const formatted: BusinessArticle[] = bizPosts.slice(0, 8).map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug || p.id,
            summary: p.subheadline || extractText(p.bodyContent) || "",
            imageUrl: p.thumbnail || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
          }));

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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0 font-sans select-none border-b border-dashed border-[#888070] pb-5">
      {/* COLUMN 1 (LEFT ~ 3 of 12 cols): Positions 1, 2, 3 */}
      <div 
        className="col-span-12 md:col-span-1 lg:col-span-3 pr-0 md:pr-[0.3cm] pb-6 lg:pb-0 flex flex-col justify-start divide-y divide-dashed divide-[#888070]"
        style={{ borderRight: "1.5px dashed #888070" }}
      >
        {/* Business Category Section Topic Header */}
        <div className="pb-2 mb-1">
          <h2 className="font-serif font-bold text-[24px] sm:text-[26px] text-[#111111] leading-none tracking-tight">
            <Link href="/business" className="hover:underline">
              Business
            </Link>
          </h2>
        </div>

        {leftItems.map((art, idx) => (
          <article key={art.id} className={`py-2.5 ${idx === 0 ? "pt-0" : ""} ${idx === leftItems.length - 1 ? "pb-0" : ""}`}>
            <h3 className={`font-serif font-bold text-[#111111] hover:text-[#333333] hover:underline cursor-pointer ${idx === 0 ? "text-[26px] sm:text-[28px] lg:text-[30px] leading-[1.12]" : "text-[20px] sm:text-[21px] leading-[1.18]"}`} style={{ whiteSpace: art.customBreakTitle ? "pre-line" : "normal" }}>
              <Link href={`/article/${art.slug}`}>
                {art.customBreakTitle || art.title}
              </Link>
            </h3>
            {art.summary && (
              <p className="font-sans text-[12px] sm:text-[12.5px] leading-[1.38] text-[#555555] mt-1.5 line-clamp-3">
                {art.summary}
              </p>
            )}
          </article>
        ))}
      </div>

      {/* COLUMN 2 (CENTER ~ 5 of 12 cols): Position 4 (Hero) and Positions 5, 6 (Bottom Cards) */}
      <div 
        className="col-span-12 md:col-span-1 lg:col-span-5 px-0 md:px-[0.3cm] py-6 lg:py-0 flex flex-col justify-between"
        style={{ borderRight: "1.5px dashed #888070" }}
      >
        {/* Position 4: Featured Main Hero */}
        {centerHeroItem && (
          <article className="pb-3.5 border-b border-dashed border-[#888070]">
            <Link href={`/article/${centerHeroItem.slug}`} className="block relative w-full h-[8cm] overflow-hidden bg-gray-100 mb-2.5 group">
              <img
                src={centerHeroItem.imageUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"}
                alt={centerHeroItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <h2 className="font-serif font-bold text-[20px] sm:text-[21px] leading-[1.18] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
              <Link href={`/article/${centerHeroItem.slug}`}>
                {centerHeroItem.title}
              </Link>
            </h2>
            {centerHeroItem.summary && (
              <p className="font-sans text-[12px] sm:text-[12.5px] leading-[1.38] text-[#555555] mt-1 line-clamp-2">
                {centerHeroItem.summary}
              </p>
            )}
          </article>
        )}

        {/* Positions 5 & 6: Bottom 2 Side-by-Side Cards */}
        <div className="pt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-[0.4cm]">
          {centerBottomItems.map((art) => (
            <article key={art.id} className="flex flex-col justify-between">
              <Link href={`/article/${art.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 mb-2 group">
                <img
                  src={art.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80"}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="font-serif font-bold text-[15px] sm:text-[15.5px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link href={`/article/${art.slug}`}>
                  {art.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>

      {/* COLUMN 3 (RIGHT ~ 4 of 12 cols): Positions 7 & 8 + Ad 1 Box */}
      <div className="col-span-12 md:col-span-2 lg:col-span-4 pl-0 md:pl-[0.3cm] pt-6 lg:pt-0 flex flex-col justify-between">
        {/* Positions 7 & 8: Top 2 Thumbnail Stories */}
        <div className="divide-y divide-dashed divide-[#888070]">
          {rightItems.map((art, idx) => (
            <article key={art.id} className={`py-3 ${idx === 0 ? "pt-0" : ""} flex items-start justify-between space-x-3`}>
              <h3 className="font-serif font-bold text-[17px] sm:text-[17.5px] leading-[1.18] text-[#111111] hover:underline cursor-pointer flex-1" style={{ whiteSpace: art.customBreakTitle ? "pre-line" : "normal" }}>
                <Link href={`/article/${art.slug}`}>
                  {art.customBreakTitle || art.title}
                </Link>
              </h3>
              <Link href={`/article/${art.slug}`} className="shrink-0 block w-[110px] h-[72px] overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={art.imageUrl || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=300&q=80"}
                  alt={art.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </article>
          ))}
        </div>

        {/* Ad 1 Grey Box */}
        <div className="mt-3 pt-3 border-t border-dashed border-[#888070] flex-1 flex flex-col justify-stretch">
          <div className="w-full h-full min-h-[220px] bg-[#E8E3D7] border border-[#C8C0B0] flex items-center justify-center p-4">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-[#111111] tracking-tight">
              Ad 1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCategorySection;
