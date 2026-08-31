"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

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
}

export default function CategoryPageTemplate({
  categoryTitle = "Business",
}: CategoryPageTemplateProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const newsSectionRef = useRef<HTMLDivElement>(null);

  const upperCategory = categoryTitle.toUpperCase();

  // Part 1 Hero Articles tailored with category title
  const heroArticles = useMemo(() => ({
    card1: {
      title: `Key Legislative Shifts Impacting ${categoryTitle} Policies Nationwide`,
      summary: `Regulatory frameworks governing ${categoryTitle.toLowerCase()} are experiencing major updates following bipartisan deliberations in Washington...`,
      image: "/images/world/afiuni_judge.jpg",
      slug: `${categoryTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-policy-shifts`,
    },
    card2: {
      title: `Global Economic Outlook: What the Latest Data Means for ${categoryTitle}`,
      summary: `Analysts examine the quarterly performance indicators across major markets, highlighting resilience amid shifting trade dynamics...`,
      image: "/images/world/venezuela_city.jpg",
      slug: `${categoryTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-economic-outlook`,
    },
    middleCard: {
      title: `U.S. Strategy in ${categoryTitle}: Can Washington Rebuild Industry Trust?`,
      summary: `Following political and economic deliberations during 2026, federal leaders have shifted strategy toward long-term market stability and infrastructure investments...`,
      image: "/images/world/trump_venezuela.jpg",
      slug: `us-strategy-in-${categoryTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    },
    rightCard: {
      title: `The Breakthrough Innovation Transforming Modern ${categoryTitle}`,
      summary: `Industry pioneers reveal how next-generation technologies are restructuring business operations, supply chains, and consumer expectations...`,
      image: "/images/world/perez_hilton.jpg",
      slug: `innovation-in-${categoryTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    },
  }), [categoryTitle]);

  const baseNewsArticles: ArticleItem[] = useMemo(() => [
    {
      id: "jose-rizal",
      title: `How Leadership Principles Are Reshaping ${categoryTitle} in 2026`,
      summary: `Historical insights and modern strategic frameworks continue to guide executives navigating complex international markets...`,
      author: "BY WRITER",
      date: "AUG 08, 2026",
      image: "/images/world/jose_rizal.jpg",
    },
    {
      id: "gaza-grieve",
      title: `Humanitarian Initiatives and Economic Aid Focus on Impacted Regions`,
      summary: `International organizations roll out targeted funding and infrastructure support to stabilize key economic corridors...`,
      author: "BY WRITER",
      date: "AUG 08, 2026",
      image: "/images/world/gaza_grieve.jpg",
    },
    {
      id: "italian-dunk",
      title: `Unconventional Traditions and Cultural Festivals Draw Global Attention`,
      summary: `Local celebrations showcase unique cultural history, attracting international visitors and boosting regional tourism...`,
      author: "BY WRITER",
      date: "AUG 07, 2026",
      image: "/images/world/italian_dunk.jpg",
    },
    {
      id: "mercury-retrograde",
      title: `Market Volatility and Behavioral Trends in the ${categoryTitle} Sector`,
      summary: `Behavioral economists examine consumer sentiment shifts during periods of rapid digital transformation...`,
      author: "BY WRITER",
      date: "AUG 07, 2026",
      image: "/images/world/mercury_retrograde.jpg",
    },
    {
      id: "trump-tariffs",
      title: `Administration Announces $100 Billion Tariff Adjustment for U.S. Businesses`,
      summary: `Recent filings by federal agencies outline tax credit mechanisms and compliance updates for manufacturing sectors...`,
      author: "BY ETHAN CARTER",
      date: "AUG 06, 2026",
      image: "/images/world/trump_tariffs.jpg",
    },
    {
      id: "crypto-midterm",
      title: `Industry Coalitions Invest Millions to Shape Strategic ${categoryTitle} Initiatives`,
      summary: `Financial support highlights the sector's determination to establish clearer regulatory standards and compliance pathways...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/crypto_midterm.jpg",
    },
    {
      id: "cameron-norrie",
      title: `Competitive Milestones and Athletic Excellence in International Arenas`,
      summary: `Top performers demonstrate exceptional consistency during key championship series, setting new records...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/cameron_norrie.jpg",
    },
    {
      id: "england-cricket",
      title: `National Teams Announce Roster Updates Ahead of Major Series`,
      summary: `Coaching staff reveal squad selections for the upcoming international tournament starting next week...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/england_cricket.jpg",
    },
    {
      id: "odesa-port",
      title: `Global Maritime Routes and Logistics Hubs Under Constant Assessment`,
      summary: `Shipping logistics experts monitor port operations and trade flow dynamics across critical ocean corridors...`,
      author: "BY RONDA B",
      date: "AUG 06, 2026",
      image: "/images/world/odesa_port.jpg",
    },
    {
      id: "catholicism-conversion",
      title: `Demographic Trends Highlight Shifting Cultural Perspectives in ${categoryTitle}`,
      summary: `Surveys consistently indicate evolving preferences among younger demographics across North America and Europe...`,
      author: "BY SAMUEL MAURICIO PATIÑO FUENTES",
      date: "AUG 06, 2026",
      image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=400&q=80",
    },
  ], [categoryTitle]);

  const trendingItems = useMemo(() => [
    {
      id: 1,
      title: `Key Developments shaping ${categoryTitle} this quarter`,
      views: "66 views since publication",
    },
    {
      id: 2,
      title: `Exclusive Insights: Strategic Innovations in ${categoryTitle}`,
      views: "66 views since publication",
    },
    {
      id: 3,
      title: `Policy Debate Rises Over Next Phase of ${categoryTitle} Regulations`,
      views: "41 views since publication",
    },
    {
      id: 4,
      title: `Leading Agriculture & Tech Ventures Accelerate Global Reach`,
      views: "30 views since publication",
    },
    {
      id: 5,
      title: `Analysis: What Recent Reports Signal for Future Industry Growth`,
      views: "15 views since publication",
    },
  ], [categoryTitle]);

  const [customArticles, setCustomArticles] = useState<ArticleItem[]>([]);

  const loadCustomCategoryPosts = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_posts");
      if (stored) {
        const posts = JSON.parse(stored);
        const targetTitleLower = categoryTitle.toLowerCase().trim();
        const isOpinionPage = targetTitleLower.includes("opinion") || targetTitleLower.includes("editorial");

        const catPosts = posts.filter((p: any) => {
          if (p.status !== "Published") return false;
          const cat = (p.category || "").toLowerCase().trim();
          const subs = (p.subCategories || []).map((s: string) => s.toLowerCase());
          const placement = (p.homepagePlacement || "").toLowerCase();

          if (isOpinionPage) {
            return (
              cat === "opinion" ||
              cat === "opinions" ||
              cat === "editorial" ||
              cat === "editorials" ||
              subs.some((s: string) => s.includes("opinion") || s.includes("editorial")) ||
              placement.includes("opinion") ||
              placement.includes("editorial")
            );
          }

          return (
            cat === targetTitleLower ||
            subs.some((s: string) => s === targetTitleLower) ||
            placement.includes(targetTitleLower)
          );
        });

        catPosts.sort((a: any, b: any) => (b.publishedAt || 0) - (a.publishedAt || 0));

        const formatted: ArticleItem[] = catPosts.map((p: any) => ({
          id: p.id || p.slug,
          title: p.title,
          summary:
            p.subheadline ||
            p.cardSummary ||
            (p.bodyContent ? p.bodyContent.replace(/<[^>]+>/g, " ").trim().slice(0, 140) + "..." : ""),
          author: `BY ${(p.author || "WRITER").toUpperCase()}`,
          date: p.date ? p.date.toUpperCase() : "RECENT",
          image: p.thumbnail || "/images/world/afiuni_judge.jpg",
        }));
        setCustomArticles(formatted);
      }
    } catch (e) {}
  }, [categoryTitle]);

  React.useEffect(() => {
    loadCustomCategoryPosts();
    window.addEventListener("wsj_posts_updated", loadCustomCategoryPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadCustomCategoryPosts);
  }, [loadCustomCategoryPosts]);

  const activeArticles = useMemo(() => {
    const shift = (currentPage - 1) % baseNewsArticles.length;
    const baseShifted = [...baseNewsArticles.slice(shift), ...baseNewsArticles.slice(0, shift)];
    return [...customArticles, ...baseShifted];
  }, [currentPage, baseNewsArticles, customArticles]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= 11) {
      setCurrentPage(newPage);
      newsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between text-[#111111]">
      <div>
        <Header />
        <StickyHeaderBar />

        {/* Category Page Main Body */}
        <Container className="pt-6 sm:pt-10 pb-10">
          {/* Part 1: Top Header Banner with Category Title */}
          <div className="border-t-2 border-[#111111] border-b border-[#111111] py-3 text-center mb-8">
            <h1 className="font-serif text-[30px] sm:text-[36px] font-extrabold uppercase tracking-[0.16em] text-[#111111] leading-none">
              {upperCategory}
            </h1>
          </div>

          {/* Part 1: 3-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 pb-8 border-b border-gray-300">
            {/* Column 1 (Left): Two Horizontal Cards */}
            <div className="pr-0 md:pr-6 pb-6 md:pb-0 flex flex-col justify-between md:border-r md:border-gray-300">
              {/* Card 1 */}
              <article className="flex flex-row items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                    <Link href={`/article/${heroArticles.card1.slug}`}>
                      {heroArticles.card1.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                    {heroArticles.card1.summary}
                  </p>
                </div>
                <div className="w-[120px] sm:w-[135px] shrink-0">
                  <Link
                    href={`/article/${heroArticles.card1.slug}`}
                    className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroArticles.card1.image}
                      alt={heroArticles.card1.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </article>

              {/* Horizontal Divider */}
              <div className="border-b border-gray-300 my-5" />

              {/* Card 2 */}
              <article className="flex flex-row items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-[16px] sm:text-[17px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                    <Link href={`/article/${heroArticles.card2.slug}`}>
                      {heroArticles.card2.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-[12.5px] leading-[1.38] text-[#555555] mt-2 line-clamp-3">
                    {heroArticles.card2.summary}
                  </p>
                </div>
                <div className="w-[120px] sm:w-[135px] shrink-0">
                  <Link
                    href={`/article/${heroArticles.card2.slug}`}
                    className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroArticles.card2.image}
                      alt={heroArticles.card2.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </article>
            </div>

            {/* Column 2 (Middle): Vertical Feature Card */}
            <div className="px-0 md:px-6 py-6 md:py-0 md:border-r md:border-gray-300">
              <article>
                <Link
                  href={`/article/${heroArticles.middleCard.slug}`}
                  className="block relative aspect-[16/10] w-full mb-3.5 overflow-hidden bg-gray-100 border border-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroArticles.middleCard.image}
                    alt={heroArticles.middleCard.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <h2 className="font-serif font-bold text-[19px] sm:text-[20px] leading-[1.2] text-[#990000] hover:text-[#b30000] hover:underline cursor-pointer">
                  <Link href={`/article/${heroArticles.middleCard.slug}`}>
                    {heroArticles.middleCard.title}
                  </Link>
                </h2>
                <p className="font-sans text-[13px] leading-[1.42] text-[#555555] mt-2.5">
                  {heroArticles.middleCard.summary}
                </p>
              </article>
            </div>

            {/* Column 3 (Right): Vertical Feature Card */}
            <div className="pl-0 md:pl-6 pt-6 md:pt-0">
              <article>
                <Link
                  href={`/article/${heroArticles.rightCard.slug}`}
                  className="block relative aspect-[16/10] w-full mb-3.5 overflow-hidden bg-gray-100 border border-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroArticles.rightCard.image}
                    alt={heroArticles.rightCard.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <h2 className="font-serif font-bold text-[19px] sm:text-[20px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                  <Link href={`/article/${heroArticles.rightCard.slug}`}>
                    {heroArticles.rightCard.title}
                  </Link>
                </h2>
                <p className="font-sans text-[13px] leading-[1.42] text-[#555555] mt-2.5">
                  {heroArticles.rightCard.summary}
                </p>
              </article>
            </div>
          </div>

          {/* Part 2: MORE NEWS & Sidebar */}
          <div ref={newsSectionRef} className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: MORE NEWS (8 of 12 cols) */}
              <div className="lg:col-span-8">
                {/* Header with ONLY lower border line */}
                <div className="border-b border-[#111111] pb-2 mb-6 flex justify-between items-center">
                  <h2 className="font-serif font-bold text-[18px] uppercase tracking-wider text-[#111111]">
                    MORE NEWS
                  </h2>
                  <span className="font-sans text-[12px] font-semibold text-gray-500">
                    Page {currentPage} of 11
                  </span>
                </div>

                {/* Articles List with visible horizontal grey border lines */}
                <div className="divide-y divide-gray-300">
                  {activeArticles.map((article, idx) => (
                    <article
                      key={`${article.id}-page${currentPage}-${idx}`}
                      className="py-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-5"
                    >
                      <div className="w-full sm:w-[195px] shrink-0">
                        <Link
                          href={`/article/${article.id}`}
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
                          <Link href={`/article/${article.id}`}>{article.title}</Link>
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

                {/* Pagination Bar */}
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

                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((page) => {
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
                    disabled={currentPage === 11}
                    className={`px-3 py-1 text-[11px] font-bold uppercase transition-colors ${
                      currentPage === 11
                        ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
                        : "text-[#111111] bg-white border border-gray-300 hover:border-black hover:text-[#990000] cursor-pointer"
                    }`}
                  >
                    NEXT
                  </button>
                </div>
              </div>

              {/* Right Sidebar (4 of 12 cols) */}
              <aside className="lg:col-span-4 flex flex-col gap-6">
                {/* TRENDING IN [CATEGORY] Widget */}
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
                    {trendingItems.map((item) => (
                      <div key={item.id} className="py-3.5 flex items-start gap-4">
                        <span className="font-serif font-bold text-[24px] leading-none text-[#cbd5e1] w-5 shrink-0 pt-0.5">
                          {item.id}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-bold text-[13.5px] leading-[1.3] text-[#111111] hover:underline cursor-pointer">
                            <Link href={`/article/trending-${item.id}`}>{item.title}</Link>
                          </h4>
                          <p className="font-sans text-[11px] text-[#94a3b8] mt-1 font-normal tracking-wide">
                            {item.views}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Ad Placeholders with Resolution Display */}
                <AdPlaceholder width="w-full" height="h-[250px]" resolution="300 × 250" />
                <AdPlaceholder width="w-full" height="h-[600px]" resolution="300 × 600" />
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
