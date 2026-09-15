"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { getAuthorForArticle } from "@/data/authors";
import { getRelativeTime } from "@/lib/relativeTime";

interface CategoryPageTemplateProps {
  categoryTitle?: string;
}

interface ArticleItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  image: string;
  slug?: string;
  publishedAt?: number;
  views?: string | number;
}

export default function CategoryPageTemplate({
  categoryTitle = "Business",
}: CategoryPageTemplateProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const newsSectionRef = useRef<HTMLDivElement>(null);

  const upperCategory = categoryTitle.toUpperCase();
  const targetTitleLower = categoryTitle.toLowerCase().trim();

  // Reset to page 1 whenever categoryTitle changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [categoryTitle]);

  // Pre-populated base template fallback articles tailored to this category title
  const baseNewsArticles: ArticleItem[] = useMemo(() => [
    {
      id: `${targetTitleLower}-1`,
      title: `Key Legislative Shifts Impacting ${categoryTitle} Policies Nationwide`,
      summary: `Regulatory frameworks governing ${categoryTitle.toLowerCase()} are experiencing major updates following bipartisan deliberations in Washington...`,
      author: "BY ETHAN CARTER",
      date: "AUG 08, 2026",
      image: "/images/world/afiuni_judge.jpg",
      slug: `${targetTitleLower}-policy-shifts`,
      views: "128 views",
    },
    {
      id: `${targetTitleLower}-2`,
      title: `Global Economic Outlook: What the Latest Data Means for ${categoryTitle}`,
      summary: `Analysts examine the quarterly performance indicators across major markets, highlighting resilience amid shifting trade dynamics...`,
      author: "BY SARAH JENNINGS",
      date: "AUG 08, 2026",
      image: "/images/world/venezuela_city.jpg",
      slug: `${targetTitleLower}-economic-outlook`,
      views: "94 views",
    },
    {
      id: `${targetTitleLower}-3`,
      title: `U.S. Strategy in ${categoryTitle}: Can Washington Rebuild Industry Trust?`,
      summary: `Following political and economic deliberations during 2026, federal leaders have shifted strategy toward long-term market stability and infrastructure investments...`,
      author: "BY MICHAEL REED",
      date: "AUG 08, 2026",
      image: "/images/world/trump_venezuela.jpg",
      slug: `us-strategy-in-${targetTitleLower}`,
      views: "88 views",
    },
    {
      id: `${targetTitleLower}-4`,
      title: `The Breakthrough Innovation Transforming Modern ${categoryTitle}`,
      summary: `Industry pioneers reveal how next-generation technologies are restructuring business operations, supply chains, and consumer expectations...`,
      author: "BY CLARA VANCE",
      date: "AUG 07, 2026",
      image: "/images/world/perez_hilton.jpg",
      slug: `innovation-in-${targetTitleLower}`,
      views: "76 views",
    },
    {
      id: `${targetTitleLower}-5`,
      title: `How Leadership Principles Are Reshaping ${categoryTitle} in 2026`,
      summary: `Historical insights and modern strategic frameworks continue to guide executives navigating complex international markets...`,
      author: "BY JAMES TARANTO",
      date: "AUG 07, 2026",
      image: "/images/world/jose_rizal.jpg",
      slug: `leadership-in-${targetTitleLower}`,
      views: "66 views",
    },
    {
      id: `${targetTitleLower}-6`,
      title: `Humanitarian Initiatives and Economic Aid Focus on Impacted ${categoryTitle} Corridors`,
      summary: `International organizations roll out targeted funding and infrastructure support to stabilize key economic corridors...`,
      author: "BY WRITER",
      date: "AUG 07, 2026",
      image: "/images/world/gaza_grieve.jpg",
      slug: `humanitarian-economic-aid-${targetTitleLower}`,
      views: "62 views",
    },
    {
      id: `${targetTitleLower}-7`,
      title: `Unconventional Traditions and Cultural Trends in ${categoryTitle}`,
      summary: `Local celebrations showcase unique cultural history, attracting international visitors and boosting regional sentiment...`,
      author: "BY WRITER",
      date: "AUG 07, 2026",
      image: "/images/world/italian_dunk.jpg",
      slug: `cultural-trends-${targetTitleLower}`,
      views: "58 views",
    },
    {
      id: `${targetTitleLower}-8`,
      title: `Market Volatility and Behavioral Dynamics in the ${categoryTitle} Sector`,
      summary: `Behavioral economists examine consumer sentiment shifts during periods of rapid digital transformation...`,
      author: "BY WRITER",
      date: "AUG 07, 2026",
      image: "/images/world/mercury_retrograde.jpg",
      slug: `market-volatility-${targetTitleLower}`,
      views: "51 views",
    },
    {
      id: `${targetTitleLower}-9`,
      title: `Administration Announces $100 Billion Adjustment for U.S. ${categoryTitle} Entities`,
      summary: `Recent filings by federal agencies outline tax credit mechanisms and compliance updates for primary stakeholders...`,
      author: "BY ETHAN CARTER",
      date: "AUG 06, 2026",
      image: "/images/world/trump_tariffs.jpg",
      slug: `administration-100b-adjustment-${targetTitleLower}`,
      views: "45 views",
    },
    {
      id: `${targetTitleLower}-10`,
      title: `Industry Coalitions Invest Millions to Shape Strategic ${categoryTitle} Standards`,
      summary: `Financial support highlights the sector's determination to establish clearer regulatory standards and compliance pathways...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/crypto_midterm.jpg",
      slug: `industry-coalitions-invest-${targetTitleLower}`,
      views: "41 views",
    },
    {
      id: `${targetTitleLower}-11`,
      title: `Competitive Milestones and Institutional Excellence in ${categoryTitle}`,
      summary: `Top performers demonstrate exceptional consistency during key championship series, setting new records...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/cameron_norrie.jpg",
      slug: `competitive-milestones-excellence-${targetTitleLower}`,
      views: "38 views",
    },
    {
      id: `${targetTitleLower}-12`,
      title: `Executive Rosters and Leadership Appointments in ${categoryTitle}`,
      summary: `Coaching staff and board members reveal squad selections for the upcoming international summit starting next week...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/england_cricket.jpg",
      slug: `executive-rosters-appointments-${targetTitleLower}`,
      views: "35 views",
    },
    {
      id: `${targetTitleLower}-13`,
      title: `Global Maritime Routes and Logistics Corridors in ${categoryTitle}`,
      summary: `Shipping logistics experts monitor port operations and trade flow dynamics across critical global corridors...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/odesa_port.jpg",
      slug: `global-maritime-routes-${targetTitleLower}`,
      views: "30 views",
    },
    {
      id: `${targetTitleLower}-14`,
      title: `Demographic Trends Highlight Shifting Perspectives in ${categoryTitle}`,
      summary: `Surveys consistently indicate evolving preferences among younger demographics across North America and Europe...`,
      author: "BY SAMUEL PATIÑO",
      date: "AUG 06, 2026",
      image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?fm=webp&fit=crop&w=400&q=80",
      slug: `demographic-trends-perspectives-${targetTitleLower}`,
      views: "27 views",
    },
    {
      id: `${targetTitleLower}-15`,
      title: `Strategic Capital Deployment Reaches Record Highs in ${categoryTitle}`,
      summary: `Venture funds and private equity firms scale commitments across early-stage startups and established market leaders...`,
      author: "BY JONATHAN BLAKE",
      date: "AUG 05, 2026",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fm=webp&fit=crop&w=400&q=80",
      slug: `strategic-capital-deployment-${targetTitleLower}`,
      views: "22 views",
    },
  ], [categoryTitle, targetTitleLower]);

  const [customArticles, setCustomArticles] = useState<ArticleItem[]>([]);

  const loadCustomCategoryPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const normalize = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const targetNorm = normalize(categoryTitle);

        const catPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const cat = (p.category || "").toLowerCase().trim();
          const catNorm = normalize(cat);
          const subs = (p.subCategories || []).map((s: string) => (s || "").toLowerCase().trim());
          const subsNorm = subs.map(normalize);
          const placement = (p.homepagePlacement || "").toLowerCase().trim();
          const placementNorm = normalize(placement);

          if (targetNorm === "news") {
            return catNorm.includes("news") || placementNorm.includes("news") || subsNorm.some((s: string) => s.includes("news"));
          }

          if (targetNorm === "opinion" || targetNorm === "opinions" || targetNorm === "editorial") {
            return (
              catNorm.includes("opinion") ||
              catNorm.includes("editorial") ||
              subsNorm.some((s: string) => s.includes("opinion") || s.includes("editorial")) ||
              placementNorm.includes("opinion") ||
              placementNorm.includes("editorial")
            );
          }

          if (targetNorm === "usnews" || targetNorm === "us") {
            return (
              catNorm === "us" ||
              catNorm === "usnews" ||
              subsNorm.includes("us") ||
              subsNorm.includes("usnews") ||
              placementNorm.includes("us")
            );
          }

          return (
            catNorm === targetNorm ||
            catNorm.includes(targetNorm) ||
            (targetNorm.length >= 4 && catNorm.includes(targetNorm)) ||
            (catNorm.length >= 4 && targetNorm.includes(catNorm)) ||
            subsNorm.some((s: string) => s === targetNorm || (targetNorm.length >= 4 && s.includes(targetNorm)) || (s.length >= 4 && targetNorm.includes(s))) ||
            placementNorm.includes(targetNorm)
          );
        });

        catPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        const formatted: ArticleItem[] = catPosts.map((p: any) => {
          const authorObj = getAuthorForArticle(p.slug || p.id, p.author, p.authorEmail);
          return {
            id: p.id || p.slug,
            title: p.title,
            summary:
              p.subheadline ||
              p.cardSummary ||
              (p.bodyContent ? p.bodyContent.replace(/<[^>]+>/g, " ").trim().slice(0, 140) + "..." : ""),
            author: `BY ${authorObj.name.toUpperCase()}`,
            date: getRelativeTime(p.publishedAt, p.date).toUpperCase(),
            image: p.thumbnail || "/images/world/afiuni_judge.jpg",
            slug: p.slug || p.id,
            publishedAt: p.publishedAt,
            views: p.views ? `${p.views} views since publication` : "66 views since publication",
          };
        });
        setCustomArticles(formatted);
      }
    } catch (e) {}
  }, [categoryTitle, targetTitleLower]);

  React.useEffect(() => {
    loadCustomCategoryPosts();
    window.addEventListener("wsj_posts_updated", loadCustomCategoryPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadCustomCategoryPosts);
  }, [loadCustomCategoryPosts]);

  // Combine custom published posts (newest first) with baseNewsArticles for full coverage
  const allCategoryArticles = useMemo(() => {
    const combined = [...customArticles];
    baseNewsArticles.forEach((base) => {
      if (!combined.some((c) => c.id === base.id || c.title === base.title)) {
        combined.push(base);
      }
    });
    return combined;
  }, [customArticles, baseNewsArticles]);

  // Requirement 2: First Part consists of the top 5 latest published articles ordered from left to right, top to bottom
  const top5Articles = useMemo(() => {
    return allCategoryArticles.slice(0, 5);
  }, [allCategoryArticles]);

  // Requirement 3: Articles starting from index 5 go into the "More News" section
  const moreNewsAll = useMemo(() => {
    return allCategoryArticles.slice(5);
  }, [allCategoryArticles]);

  // Requirement 3: Maximum 10 articles shown per page in More News section
  const itemsPerPage = 10;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(moreNewsAll.length / itemsPerPage));
  }, [moreNewsAll.length]);

  const currentMoreNews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return moreNewsAll.slice(start, start + itemsPerPage);
  }, [moreNewsAll, currentPage]);

  // Requirement 4: For Trending in News, take the FIRST FIVE articles of More News section!
  const trendingArticles = useMemo(() => {
    const first5OfMore = moreNewsAll.slice(0, 5);
    if (first5OfMore.length >= 5) return first5OfMore;
    return [...first5OfMore, ...allCategoryArticles.slice(0, 5 - first5OfMore.length)];
  }, [moreNewsAll, allCategoryArticles]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      newsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper getters for top 5 articles (First Part grid)
  const card1 = top5Articles[0] || baseNewsArticles[0];
  const card2 = top5Articles[1] || baseNewsArticles[1];
  const card3 = top5Articles[2] || baseNewsArticles[2];
  const card4 = top5Articles[3] || baseNewsArticles[3];
  const card5 = top5Articles[4] || baseNewsArticles[4];

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between text-[#111111]">
      <div>
        <Header />
        <StickyHeaderBar />

        {/* Category Page Main Body */}
        <Container className="pt-6 sm:pt-10 pb-10">
          {/* Top Header Banner with Category Title */}
          <div className="border-t-2 border-[#111111] border-b border-[#111111] py-3 text-center mb-8">
            <h1 className="font-serif text-[30px] sm:text-[36px] font-extrabold uppercase tracking-[0.16em] text-[#111111] leading-none">
              {upperCategory}
            </h1>
          </div>

          {/* Part 1: Top 5 Latest Articles Grid (Latest Article in Big Hero Card on Left) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pb-8 border-b border-gray-300">
            {/* Column 1 (Left): Center Hero Feature Card for Latest Article (Card 1) */}
            <div className="pr-0 md:pr-6 pb-6 md:pb-0 md:border-r md:border-gray-300">
              <article>
                <Link
                  href={`/article/${card1.slug || card1.id}`}
                  className="block relative aspect-[16/10] w-full mb-3.5 overflow-hidden bg-gray-100 border border-gray-200 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card1.image}
                    alt={card1.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <h2 className="font-serif font-bold text-[20px] sm:text-[22px] leading-[1.18] text-[#990000] hover:text-[#b30000] hover:underline cursor-pointer">
                  <Link href={`/article/${card1.slug || card1.id}`}>
                    {card1.title}
                  </Link>
                </h2>
                <p className="font-sans text-[13px] sm:text-[13.5px] leading-[1.42] text-[#444444] mt-2.5">
                  {card1.summary}
                </p>
              </article>
            </div>

            {/* Column 2 (Middle): Two Stacked Horizontal Cards (Card 2 & Card 3) */}
            <div className="px-0 md:px-6 py-6 md:py-0 flex flex-col justify-between md:border-r md:border-gray-300">
              {/* Card 2 (Top Middle) */}
              <article className="flex flex-row items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                    <Link href={`/article/${card2.slug || card2.id}`}>
                      {card2.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                    {card2.summary}
                  </p>
                </div>
                <div className="w-[120px] sm:w-[135px] shrink-0">
                  <Link
                    href={`/article/${card2.slug || card2.id}`}
                    className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card2.image}
                      alt={card2.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </article>

              {/* Horizontal Divider */}
              <div className="border-b border-gray-300 my-5" />

              {/* Card 3 (Bottom Middle) */}
              <article className="flex flex-row items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                    <Link href={`/article/${card3.slug || card3.id}`}>
                      {card3.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                    {card3.summary}
                  </p>
                </div>
                <div className="w-[120px] sm:w-[135px] shrink-0">
                  <Link
                    href={`/article/${card3.slug || card3.id}`}
                    className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card3.image}
                      alt={card3.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </article>
            </div>

            {/* Column 3 (Right): Two Stacked Horizontal Cards (Card 4 & Card 5) */}
            <div className="pl-0 md:pl-6 pt-6 md:pt-0 flex flex-col justify-between">
              {/* Card 4 (Top Right) */}
              <article className="flex flex-row items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                    <Link href={`/article/${card4.slug || card4.id}`}>
                      {card4.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                    {card4.summary}
                  </p>
                </div>
                <div className="w-[120px] sm:w-[135px] shrink-0">
                  <Link
                    href={`/article/${card4.slug || card4.id}`}
                    className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card4.image}
                      alt={card4.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </article>

              {/* Horizontal Divider */}
              <div className="border-b border-gray-300 my-5" />

              {/* Card 5 (Bottom Right) */}
              <article className="flex flex-row items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                    <Link href={`/article/${card5.slug || card5.id}`}>
                      {card5.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                    {card5.summary}
                  </p>
                </div>
                <div className="w-[120px] sm:w-[135px] shrink-0">
                  <Link
                    href={`/article/${card5.slug || card5.id}`}
                    className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card5.image}
                      alt={card5.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </article>
            </div>
          </div>

          {/* Part 2: MORE NEWS & TRENDING Sidebar */}
          <div ref={newsSectionRef} className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: MORE NEWS (8 of 12 cols - 10 Articles Max per Page) */}
              <div className="lg:col-span-8">
                {/* Header with Page Count */}
                <div className="border-b border-[#111111] pb-2 mb-6 flex justify-between items-center">
                  <h2 className="font-serif font-bold text-[18px] uppercase tracking-wider text-[#111111]">
                    MORE {upperCategory}
                  </h2>
                  <span className="font-sans text-[12px] font-semibold text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* Articles List with horizontal grey border lines */}
                <div className="divide-y divide-gray-300">
                  {currentMoreNews.map((article, idx) => (
                    <article
                      key={`${article.id}-page${currentPage}-${idx}`}
                      className="py-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-5"
                    >
                      <div className="w-full sm:w-[195px] shrink-0">
                        <Link
                          href={`/article/${article.slug || article.id}`}
                          className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 border border-gray-200"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.22] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                          <Link href={`/article/${article.slug || article.id}`}>{article.title}</Link>
                        </h3>
                        <p className="font-sans text-[12.5px] leading-[1.4] text-[#555555] mt-1.5 line-clamp-3">
                          {article.summary}
                        </p>
                        <div className="font-sans text-[10.5px] font-semibold text-[#777777] tracking-wider uppercase mt-2.5">
                          {article.author} • {article.date}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls (Maximum 10 per page) */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 py-8 border-t border-gray-300 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 text-[11px] font-bold uppercase transition-colors ${
                        currentPage === 1
                          ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                          : "text-[#111111] bg-white border border-gray-300 hover:border-black hover:text-[#990000] cursor-pointer"
                      }`}
                    >
                      PREV
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const isActive = page === currentPage;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-7 h-7 text-[12px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#990000] text-white border border-[#990000] shadow-sm"
                              : "bg-white text-[#333333] border border-gray-200 hover:border-gray-400 hover:text-[#990000]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 text-[11px] font-bold uppercase transition-colors ${
                        currentPage === totalPages
                          ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                          : "text-[#111111] bg-white border border-gray-300 hover:border-black hover:text-[#990000] cursor-pointer"
                      }`}
                    >
                      NEXT
                    </button>
                  </div>
                )}
              </div>

              {/* Right Sidebar: TRENDING IN [CATEGORY] (Populated with First 5 Articles of More News) */}
              <aside className="lg:col-span-4 flex flex-col gap-6">
                <div className="border-[1.5px] border-[#cbd5e1] rounded-none bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3 mb-4">
                    <svg
                      className="w-4 h-4 text-[#1d4ed8]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 005.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                      />
                    </svg>
                    <h3 className="font-serif font-bold text-[15px] uppercase tracking-wider text-[#111111]">
                      TRENDING IN {upperCategory}
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {trendingArticles.map((item, idx) => (
                      <div key={item.id} className="py-3.5 flex items-start gap-4">
                        <span className="font-serif font-bold text-[24px] leading-none text-[#cbd5e1] w-5 shrink-0 pt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-bold text-[13.5px] leading-[1.3] text-[#111111] hover:underline cursor-pointer">
                            <Link href={`/article/${item.slug || item.id}`}>{item.title}</Link>
                          </h4>
                          <p className="font-sans text-[11px] text-[#94a3b8] mt-1 font-normal tracking-wide">
                            {item.views || "66 views since publication"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Ad Placeholders (2 Ads for Category Pages) */}
                <AdPlaceholder slotId="cat_slot_1" width="w-full" height="h-[250px]" resolution="300 × 250" />
                <AdPlaceholder slotId="cat_slot_2" width="w-full" height="h-[600px]" resolution="300 × 600" />
              </aside>
            </div>
          </div>
        </Container>
        <StickySubscribeBar />
      </div>
      <Footer />
    </main>
  );
}
