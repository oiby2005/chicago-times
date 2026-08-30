"use client";

import React from "react";
import Link from "next/link";

interface ColumnArticle {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
}

interface SubCategoryItem {
  id: string;
  category: string;
  categorySlug: string;
  articles: ColumnArticle[];
}

const defaultRow1: SubCategoryItem[] = [
  {
    id: "economy",
    category: "Economy",
    categorySlug: "economy",
    articles: [
      {
        id: "eco1",
        title: "Why Slow Job Growth Doesn’t Mean the Labor Market Is in Trouble",
        slug: "why-slow-job-growth-doesnt-mean-labor-market-trouble",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "eco2",
        title: "Week Ahead for FX, Bonds: U.S. Inflation Data in Focus",
        slug: "week-ahead-for-fx-bonds",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "eco3",
        title: "U.S. Lost 23,000 Jobs in July, While Employment Growth Slowed",
        slug: "us-lost-23000-jobs-in-july",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "health",
    category: "Health",
    categorySlug: "health",
    articles: [
      {
        id: "hea1",
        title: "NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax",
        slug: "nycs-pied-a-terre-owners-hunt-creative-ways-tax",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "hea2",
        title: "The D.C. Home Market Gets a Billionaire Bump",
        slug: "dc-home-market-gets-billionaire-bump",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "hea3",
        title: "House of the Week: Built Off-Site and Assembled On-Site",
        slug: "house-of-the-week-built-off-site",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "investing",
    category: "Investing",
    categorySlug: "investing",
    articles: [
      {
        id: "inv1",
        title: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
        slug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "inv2",
        title: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
        slug: "the-king-of-soccer-went-rogue",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "inv3",
        title: "He’s Known as Big Dumper, but This Catcher Can Hit",
        slug: "hes-known-as-big-dumper-but-this",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "crypto",
    category: "Crypto",
    categorySlug: "crypto",
    articles: [
      {
        id: "cry1",
        title: "Crypto Midterm Elections Shift Federal Reserve Stance",
        slug: "crypto-midterm-elections",
        imageUrl: "/images/world/crypto_midterm.jpg",
      },
      {
        id: "cry2",
        title: "Digital Currencies Surge Following Strategic Asset Rulings",
        slug: "digital-currencies-surge-rulings",
        imageUrl: "/images/world/crypto_midterm.jpg",
      },
      {
        id: "cry3",
        title: "Blockchain Integration Accelerates Across Financial Institutions",
        slug: "blockchain-integration-accelerates",
        imageUrl: "/images/world/crypto_midterm.jpg",
      },
    ],
  },
];

const defaultRow2: SubCategoryItem[] = [
  {
    id: "real-estate",
    category: "Real Estate",
    categorySlug: "real-estate",
    articles: [
      {
        id: "re1",
        title: "Why Slow Job Growth Doesn’t Mean the Labor Market Is in Trouble",
        slug: "why-slow-job-growth-doesnt-mean-labor-market-trouble-re",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "re2",
        title: "Week Ahead for FX, Bonds: U.S. Inflation Data in Focus",
        slug: "week-ahead-for-fx-bonds-re",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "re3",
        title: "U.S. Lost 23,000 Jobs in July, While Employment Growth Slowed",
        slug: "us-lost-23000-jobs-in-july-re",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "industries",
    category: "Industries",
    categorySlug: "industries",
    articles: [
      {
        id: "ind1",
        title: "NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax",
        slug: "nycs-pied-a-terre-owners-hunt-creative-ways-tax-ind",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "ind2",
        title: "The D.C. Home Market Gets a Billionaire Bump",
        slug: "dc-home-market-gets-billionaire-bump-ind",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "ind3",
        title: "House of the Week: Built Off-Site and Assembled On-Site",
        slug: "house-of-the-week-built-off-site-ind",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "law",
    category: "Law",
    categorySlug: "law",
    articles: [
      {
        id: "law1",
        title: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
        slug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing-law",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "law2",
        title: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
        slug: "the-king-of-soccer-went-rogue-law",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "law3",
        title: "He’s Known as Big Dumper, but This Catcher Can Hit",
        slug: "hes-known-as-big-dumper-but-this-law",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    id: "small-business",
    category: "Small Business",
    categorySlug: "small-business",
    articles: [
      {
        id: "sb1",
        title: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
        slug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing-sb",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "sb2",
        title: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
        slug: "the-king-of-soccer-went-rogue-sb",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "sb3",
        title: "He’s Known as Big Dumper, but This Catcher Can Hit",
        slug: "hes-known-as-big-dumper-but-this-sb",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

export const EightCategoryGridSection: React.FC = () => {
  const [row1, setRow1] = React.useState<SubCategoryItem[]>(defaultRow1);
  const [row2, setRow2] = React.useState<SubCategoryItem[]>(defaultRow2);

  const loadPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const loadCategory = (catName: string, fallback: ColumnArticle[]): ColumnArticle[] => {
          const matched = posts.filter((p: any) => {
            if (p.status !== "Published") return false;
            const placement = p.homepagePlacement || "None";
            if (placement.includes(catName)) return true;
            if (!placement.startsWith("None")) return false;
            return p.category === catName;
          });
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

        setRow1(
          defaultRow1.map((item) => ({
            ...item,
            articles: loadCategory(item.category, item.articles),
          }))
        );

        setRow2(
          defaultRow2.map((item) => ({
            ...item,
            articles: loadCategory(item.category, item.articles),
          }))
        );
        return;
      }
    } catch (e) {}
    setRow1(defaultRow1);
    setRow2(defaultRow2);
  }, []);

  React.useEffect(() => {
    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, [loadPosts]);

  return (
    <div className="w-full font-sans select-none pt-4 pb-4">
      {/* ROW 1: ECONOMY, HEALTH, INVESTING, CRYPTO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-8">
        {row1.map((item) => (
          <div key={item.id} className="flex flex-col justify-start">
            <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
                <Link href={`/${item.categorySlug}`} className="hover:underline">
                  {item.category}
                </Link>
              </h3>
              <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
            </div>

            {item.articles[0] && (
              <Link
                href={`/article/${item.articles[0].slug}`}
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
              >
                <img
                  src={item.articles[0].imageUrl}
                  alt={item.articles[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}

            {item.articles[0] && (
              <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
                <Link href={`/article/${item.articles[0].slug}`}>
                  {item.articles[0].title}
                </Link>
              </h4>
            )}

            {item.articles[1] && (
              <div className="pt-1 pb-2">
                <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                  <Link href={`/article/${item.articles[1].slug}`}>
                    {item.articles[1].title}
                  </Link>
                </h5>
              </div>
            )}

            {item.articles[2] && (
              <div className="pt-1">
                <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                  <Link href={`/article/${item.articles[2].slug}`}>
                    {item.articles[2].title}
                  </Link>
                </h5>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ROW 2: REAL ESTATE, INDUSTRIES, LAW, SMALL BUSINESS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {row2.map((item) => (
          <div key={item.id} className="flex flex-col justify-start">
            <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
                <Link href={`/${item.categorySlug}`} className="hover:underline">
                  {item.category}
                </Link>
              </h3>
              <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
            </div>

            {item.articles[0] && (
              <Link
                href={`/article/${item.articles[0].slug}`}
                className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
              >
                <img
                  src={item.articles[0].imageUrl}
                  alt={item.articles[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}

            {item.articles[0] && (
              <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
                <Link href={`/article/${item.articles[0].slug}`}>
                  {item.articles[0].title}
                </Link>
              </h4>
            )}

            {item.articles[1] && (
              <div className="pt-1 pb-2">
                <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                  <Link href={`/article/${item.articles[1].slug}`}>
                    {item.articles[1].title}
                  </Link>
                </h5>
              </div>
            )}

            {item.articles[2] && (
              <div className="pt-1">
                <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                  <Link href={`/article/${item.articles[2].slug}`}>
                    {item.articles[2].title}
                  </Link>
                </h5>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EightCategoryGridSection;
