"use client";

import React from "react";
import Link from "next/link";

interface TopNewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  commentsCount: string;
  readTime: string;
}

const topNewsData: TopNewsArticle[] = [
  {
    id: "1",
    title: "Blockbuster Earnings Bolster Stocks’ Record Run",
    slug: "blockbuster-earnings-bolster-stocks-record-run",
    summary:
      "Results from the U.S.’s largest companies have helped ease worries about AI spending and inflationary pressures.",
    commentsCount: "25",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Iran Demands U.S. Withdrawal to Open Hormuz",
    slug: "iran-demands-us-withdrawal-to-open-hormuz",
    summary:
      "A top Iranian official laid out a series of tough demands for opening the Strait of Hormuz, and the United Arab Emirates said Iran launched a missile attack on one of its ships.",
    commentsCount: "2,441",
    readTime: "7 min read",
  },
  {
    id: "3",
    title: "Berkshire Hathaway, Under a New CEO, Starts to Spend Its Cash Pile",
    slug: "berkshire-hathaway-starts-to-spend-cash-pile",
    summary:
      "The conglomerate struck a $6.8 billion deal, repurchased Berkshire shares and was a net buyer of other stocks while more than doubling quarterly profit.",
    commentsCount: "134",
    readTime: "4 min read",
  },
];

export const TopNewsSection: React.FC = () => {
  return (
    <div className="w-full max-h-[12cm] h-full flex flex-col justify-between font-sans select-none overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-dashed border-[#D6CEBF] pb-1 mb-2">
        <h2 className="font-sans font-bold text-[11.5px] tracking-wider text-[#111111] uppercase">
          TOP NEWS
        </h2>
      </div>

      {/* Articles List */}
      <div className="flex-1 flex flex-col justify-between divide-y divide-dashed divide-[#D6CEBF]">
        {topNewsData.map((article) => (
          <article key={article.id} className="py-2.5 first:pt-0 last:pb-0 flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-[17px] sm:text-[18px] leading-[1.2] text-[#111111] hover:text-[#333333] hover:underline cursor-pointer">
                <Link prefetch={true} href={`/article/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>
              <p className="font-sans text-[12px] leading-[1.38] text-[#555555] mt-1 line-clamp-3">
                {article.summary}
              </p>
            </div>
            {/* Meta Row: Comments & Read Time */}
            <div className="mt-1.5 flex items-center justify-between font-sans text-[10.5px] text-[#666666]">
              <div className="flex items-center space-x-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#666666] stroke-[1.8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{article.commentsCount}</span>
              </div>
              <span>{article.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TopNewsSection;
