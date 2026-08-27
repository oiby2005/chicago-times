"use client";

import React from "react";
import Link from "next/link";

interface ColumnArticle {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
}

const defaultFashion: ColumnArticle[] = [
  {
    id: "fas1",
    title: "Why Slow Job Growth Doesn’t Mean the Labor Market Is in Trouble",
    slug: "why-slow-job-growth-doesnt-mean-labor-market-trouble",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "fas2",
    title: "Week Ahead for FX, Bonds: U.S. Inflation Data in Focus",
    slug: "week-ahead-for-fx-bonds",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "fas3",
    title: "U.S. Lost 23,000 Jobs in July, While Employment Growth Slowed",
    slug: "us-lost-23000-jobs-in-july",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  },
];

const defaultScience: ColumnArticle[] = [
  {
    id: "sci1",
    title: "NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax",
    slug: "nycs-pied-a-terre-owners-hunt-creative-ways-tax",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sci2",
    title: "The D.C. Home Market Gets a Billionaire Bump",
    slug: "dc-home-market-gets-billionaire-bump",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sci3",
    title: "House of the Week: Built Off-Site and Assembled On-Site",
    slug: "house-of-the-week-built-off-site",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  },
];

const defaultArts: ColumnArticle[] = [
  {
    id: "art1",
    title: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
    slug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "art2",
    title: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
    slug: "the-king-of-soccer-went-rogue",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "art3",
    title: "He’s Known as Big Dumper, but This Catcher Can Hit",
    slug: "hes-known-as-big-dumper-but-this",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  },
];

export const FashionScienceArtsSection: React.FC = () => {
  const [fashionItems, setFashionItems] = React.useState<ColumnArticle[]>(defaultFashion);
  const [scienceItems, setScienceItems] = React.useState<ColumnArticle[]>(defaultScience);
  const [artsItems, setArtsItems] = React.useState<ColumnArticle[]>(defaultArts);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const getCategoryPosts = (keyword: string, fallback: ColumnArticle[]) => {
          const matched = posts.filter(
            (p: any) =>
              p.status === "Published" &&
              (p.category === keyword ||
               (p.homepagePlacement && p.homepagePlacement.includes(keyword)))
          );
          matched.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

          if (matched.length > 0) {
            const formatted: ColumnArticle[] = matched.slice(0, 3).map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug || p.id,
              imageUrl: p.thumbnail || fallback[0].imageUrl,
            }));
            const merged = [...formatted];
            for (let i = 0; i < fallback.length && merged.length < 3; i++) {
              if (!merged.some((m) => m.id === fallback[i].id)) {
                merged.push(fallback[i]);
              }
            }
            return merged.slice(0, 3);
          }
          return fallback;
        };

        setFashionItems(getCategoryPosts("Fashion", defaultFashion));
        setScienceItems(getCategoryPosts("Science", defaultScience));
        setArtsItems(getCategoryPosts("Arts", defaultArts));
        return;
      }
    } catch (e) {}
    setFashionItems(defaultFashion);
    setScienceItems(defaultScience);
    setArtsItems(defaultArts);
  }, []);

  React.useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  return (
    <div className="w-full font-sans select-none pt-2 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* ==================== COLUMN 1: FASHION ==================== */}
        <div className="flex flex-col justify-start">
          <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
              <Link href="/fashion" className="hover:underline">
                Fashion
              </Link>
            </h3>
            <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
          </div>

          {fashionItems[0] && (
            <Link
              href={`/article/${fashionItems[0].slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
            >
              <img
                src={fashionItems[0].imageUrl}
                alt={fashionItems[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}

          {fashionItems[0] && (
            <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
              <Link href={`/article/${fashionItems[0].slug}`}>
                {fashionItems[0].title}
              </Link>
            </h4>
          )}

          {fashionItems[1] && (
            <div className="pt-1 pb-2">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link href={`/article/${fashionItems[1].slug}`}>
                  {fashionItems[1].title}
                </Link>
              </h5>
            </div>
          )}

          {fashionItems[2] && (
            <div className="pt-1">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link href={`/article/${fashionItems[2].slug}`}>
                  {fashionItems[2].title}
                </Link>
              </h5>
            </div>
          )}
        </div>

        {/* ==================== COLUMN 2: SCIENCE ==================== */}
        <div className="flex flex-col justify-start">
          <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
              <Link href="/science" className="hover:underline">
                Science
              </Link>
            </h3>
            <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
          </div>

          {scienceItems[0] && (
            <Link
              href={`/article/${scienceItems[0].slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
            >
              <img
                src={scienceItems[0].imageUrl}
                alt={scienceItems[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}

          {scienceItems[0] && (
            <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
              <Link href={`/article/${scienceItems[0].slug}`}>
                {scienceItems[0].title}
              </Link>
            </h4>
          )}

          {scienceItems[1] && (
            <div className="pt-1 pb-2">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link href={`/article/${scienceItems[1].slug}`}>
                  {scienceItems[1].title}
                </Link>
              </h5>
            </div>
          )}

          {scienceItems[2] && (
            <div className="pt-1">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link href={`/article/${scienceItems[2].slug}`}>
                  {scienceItems[2].title}
                </Link>
              </h5>
            </div>
          )}
        </div>

        {/* ==================== COLUMN 3: ARTS ==================== */}
        <div className="flex flex-col justify-start">
          <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
              <Link href="/arts" className="hover:underline">
                Arts
              </Link>
            </h3>
            <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
          </div>

          {artsItems[0] && (
            <Link
              href={`/article/${artsItems[0].slug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
            >
              <img
                src={artsItems[0].imageUrl}
                alt={artsItems[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}

          {artsItems[0] && (
            <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
              <Link href={`/article/${artsItems[0].slug}`}>
                {artsItems[0].title}
              </Link>
            </h4>
          )}

          {artsItems[1] && (
            <div className="pt-1 pb-2">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link href={`/article/${artsItems[1].slug}`}>
                  {artsItems[1].title}
                </Link>
              </h5>
            </div>
          )}

          {artsItems[2] && (
            <div className="pt-1">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link href={`/article/${artsItems[2].slug}`}>
                  {artsItems[2].title}
                </Link>
              </h5>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FashionScienceArtsSection;
