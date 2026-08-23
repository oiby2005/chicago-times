"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface ArticleItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  image: string;
}

const baseArticles: ArticleItem[] = [
  {
    id: "jose-rizal",
    title: "The World Needs More People Like José Rizal",
    summary:
      "But first of all, who is José Rizal?If you ask Filipinos, they will tell you that José Rizal is a hero, a writer, and a martyr who died for his country. But that is probably the least interesting...",
    author: "BY WRITER",
    date: "AUG 08, 2026",
    image: "/images/world/jose_rizal.jpg",
  },
  {
    id: "gaza-grieve",
    title: "The Bodies Were Finally Found. Gaza Is Only Beginning to Grieve.",
    summary:
      "A funeral is usually held days after a death. In Gaza, some families waited almost three years. This week, thousands of Palestinians gathered in Gaza City for a mass funeral following the recovery...",
    author: "BY WRITER",
    date: "AUG 08, 2026",
    image: "/images/world/gaza_grieve.jpg",
  },
  {
    id: "italian-dunk",
    title: 'This Italian Festival Lets You "Dunk" the Politician You Hate',
    summary:
      "Imagine choosing the politician who annoyed people the most this year then watching them get lowered into a river three times. That is the idea behind La Tonca, one of the strangest traditions...",
    author: "BY WRITER",
    date: "AUG 07, 2026",
    image: "/images/world/italian_dunk.jpg",
  },
  {
    id: "mercury-retrograde",
    title: "Mercury Retrograde Had Everyone Looking Back At Their Exes",
    summary:
      'Did you lose someone recently? Did a relationship end out of nowhere? Did someone you cared about suddenly become a stranger?Maybe you experienced what astrology believers call the "Mercury...',
    author: "BY WRITER",
    date: "AUG 07, 2026",
    image: "/images/world/mercury_retrograde.jpg",
  },
  {
    id: "trump-tariffs",
    title: "Trump Administration Returns $100 Billion in Tariff Refunds to U.S. Businesses",
    summary:
      "According to recent filings by U.S. Customs and Border Protection. The refunds account for nearly 60% of the tariff revenue collected under the policy. However, the repayment process is still...",
    author: "BY ETHAN CARTER",
    date: "AUG 06, 2026",
    image: "/images/world/trump_tariffs.jpg",
  },
  {
    id: "crypto-midterm",
    title: "Crypto Industry Invests Millions to Shape U.S. Midterm Elections",
    summary:
      "The growing financial support highlights the sector's determination to help elect lawmakers who favor clearer regulations for cryptocurrencies and blockchain technology. Industry leaders believe a...",
    author: "BY RONDA B",
    date: "AUG 06, 2026",
    image: "/images/world/crypto_midterm.jpg",
  },
  {
    id: "cameron-norrie",
    title: "Cameron Norrie Advances to Canadian Open Last 32 After Straight-Sets Victory",
    summary:
      "The match lasted one hour and 29 minutes, with Norrie producing a composed performance to overcome the world No. 33 and extend his recent improvement in form.Norrie Builds MomentumAfter ending a...",
    author: "BY RONDA B",
    date: "AUG 06, 2026",
    image: "/images/world/cameron_norrie.jpg",
  },
  {
    id: "england-cricket",
    title: "England Recall Ollie Pope and Dan Lawrence for Pakistan Test Series",
    summary:
      "As the team begins a new era following the retirement of captain Ben Stokes and the departure of head coach Brendon McCullum.The 16-man squad was announced ahead of the first Test at Headingley,...",
    author: "BY RONDA B",
    date: "AUG 06, 2026",
    image: "/images/world/england_cricket.jpg",
  },
  {
    id: "odesa-port",
    title: "Russia's Intensified Black Sea Assault Leaves Odesa's Ports Under Constant Threat",
    summary:
      "Port workers, and international shipping under unprecedented danger. The renewed offensive is disrupting global trade routes while creating one of the world's most hazardous maritime...",
    author: "BY RONDA B",
    date: "AUG 06, 2026",
    image: "/images/world/odesa_port.jpg",
  },
  {
    id: "catholicism-conversion",
    title: "Why More Young People Are Converting to Catholicism",
    summary:
      "For decades, surveys consistently showed younger generations becoming less religious than their parents. Yet in recent years, churches across the United States, France, the United Kingdom and...",
    author: "BY SAMUEL MAURICIO PATIÑO FUENTES",
    date: "AUG 06, 2026",
    image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=400&q=80",
  },
];

const trendingItems = [
  {
    id: 1,
    title: "A Month Later, Venezuela's Rubble Still Holds the Missing",
    views: "66 views since publication",
  },
  {
    id: 2,
    title: "New Exclusive Decoration Design & Fit Out LLC – Structural Acrylic Pioneers in the UAE",
    views: "66 views since publication",
  },
  {
    id: 3,
    title: "Trump Declares Iran Ceasefire 'Over,' Raising Questions About the Next Phase of the Conflict",
    views: "41 views since publication",
  },
  {
    id: 4,
    title: "Chamitha Ranneththi: From the Paddy Fields to Building the Future of Advanced Digital Agriculture",
    views: "30 views since publication",
  },
  {
    id: 5,
    title: "Man Arrested in South Yorkshire Over Ann Widdecombe Murder Investigation",
    views: "15 views since publication",
  },
];

export default function WorldPart2Section() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Generate page-specific list by rotating base articles according to selected page
  const getPageArticles = (page: number) => {
    const shift = (page - 1) % baseArticles.length;
    return [...baseArticles.slice(shift), ...baseArticles.slice(0, shift)];
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= 11) {
      setCurrentPage(newPage);
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeArticles = getPageArticles(currentPage);

  return (
    <section ref={sectionRef} className="w-full bg-white text-[#111111] pt-6 border-t border-gray-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: MORE NEWS (8 of 12 cols) */}
        <div className="lg:col-span-8">
          {/* Header with lower border line */}
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
              <article key={`${article.id}-page${currentPage}-${idx}`} className="py-5 flex flex-row items-start gap-4 sm:gap-5">
                <div className="w-[160px] sm:w-[195px] shrink-0">
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

          {/* Pagination Bar matching uploaded screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 py-8 border-t border-gray-300 mt-6">
            {/* PREV button */}
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

            {/* Page number buttons 1 to 11 */}
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

            {/* NEXT button */}
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
          {/* TRENDING IN WORLD Widget matching Image 2 100% */}
          <div className="border-[1.5px] border-[#cbd5e1] rounded-none bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {/* Header with blue trending line icon and thin bottom border */}
            <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3 mb-4">
              <svg
                className="w-4 h-4 text-[#1d4ed8]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 005.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <h3 className="font-serif font-bold text-[15px] uppercase tracking-wider text-[#111111]">
                TRENDING IN WORLD
              </h3>
            </div>

            {/* List of 5 items matching Image 2 typography and spacing */}
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
    </section>
  );
}
