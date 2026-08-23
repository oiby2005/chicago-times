"use client";

import React from "react";
import Link from "next/link";

interface SubCategoryItem {
  id: string;
  category: string;
  categorySlug: string;
  imageUrl: string;
  mainHeadline: string;
  mainSlug: string;
  sub1Text: string;
  sub1Slug: string;
  sub2Text: string;
  sub2Slug: string;
}

const row1Categories: SubCategoryItem[] = [
  {
    id: "economy",
    category: "Economy",
    categorySlug: "economy",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
    mainHeadline: "Why Slow Job Growth Doesn’t Mean the Labor Market Is in Trouble",
    mainSlug: "why-slow-job-growth-doesnt-mean-labor-market-trouble",
    sub1Text: "Week Ahead for FX, Bonds: U.S. Inflation Data in Focus",
    sub1Slug: "week-ahead-for-fx-bonds",
    sub2Text: "U.S. Lost 23,000 Jobs in July, While",
    sub2Slug: "us-lost-23000-jobs-in-july",
  },
  {
    id: "health",
    category: "Health",
    categorySlug: "health",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    mainHeadline: "NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax",
    mainSlug: "nycs-pied-a-terre-owners-hunt-creative-ways-tax",
    sub1Text: "The D.C. Home Market Gets a Billionaire Bump",
    sub1Slug: "dc-home-market-gets-billionaire-bump",
    sub2Text: "House of the Week: Built Off-Site and",
    sub2Slug: "house-of-the-week-built-off-site",
  },
  {
    id: "investing",
    category: "Investing",
    categorySlug: "investing",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    mainHeadline: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
    mainSlug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing",
    sub1Text: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
    sub1Slug: "the-king-of-soccer-went-rogue",
    sub2Text: "He’s Known as Big Dumper, but This",
    sub2Slug: "hes-known-as-big-dumper-but-this",
  },
  {
    id: "crypto",
    category: "Crypto",
    categorySlug: "crypto",
    imageUrl: "/images/world/crypto_midterm.jpg",
    mainHeadline: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
    mainSlug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing-crypto",
    sub1Text: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
    sub1Slug: "the-king-of-soccer-went-rogue-crypto",
    sub2Text: "He’s Known as Big Dumper, but This",
    sub2Slug: "hes-known-as-big-dumper-but-this-crypto",
  },
];

const row2Categories: SubCategoryItem[] = [
  {
    id: "real-estate",
    category: "Real Estate",
    categorySlug: "real-estate",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
    mainHeadline: "Why Slow Job Growth Doesn’t Mean the Labor Market Is in Trouble",
    mainSlug: "why-slow-job-growth-doesnt-mean-labor-market-trouble-re",
    sub1Text: "Week Ahead for FX, Bonds: U.S. Inflation Data in Focus",
    sub1Slug: "week-ahead-for-fx-bonds-re",
    sub2Text: "U.S. Lost 23,000 Jobs in July, While",
    sub2Slug: "us-lost-23000-jobs-in-july-re",
  },
  {
    id: "industries",
    category: "Industries",
    categorySlug: "industries",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    mainHeadline: "NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax",
    mainSlug: "nycs-pied-a-terre-owners-hunt-creative-ways-tax-ind",
    sub1Text: "The D.C. Home Market Gets a Billionaire Bump",
    sub1Slug: "dc-home-market-gets-billionaire-bump-ind",
    sub2Text: "House of the Week: Built Off-Site and",
    sub2Slug: "house-of-the-week-built-off-site-ind",
  },
  {
    id: "law",
    category: "Law",
    categorySlug: "law",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    mainHeadline: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
    mainSlug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing-law",
    sub1Text: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
    sub1Slug: "the-king-of-soccer-went-rogue-law",
    sub2Text: "He’s Known as Big Dumper, but This",
    sub2Slug: "hes-known-as-big-dumper-but-this-law",
  },
  {
    id: "small-business",
    category: "Small Business",
    categorySlug: "small-business",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    mainHeadline: "Horse Racing’s Triple Crown May No Longer Be Worth Chasing",
    mainSlug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing-sb",
    sub1Text: "The ‘King of Soccer’ Went Rogue and Nearly Lost His FIFA Empire",
    sub1Slug: "the-king-of-soccer-went-rogue-sb",
    sub2Text: "He’s Known as Big Dumper, but This",
    sub2Slug: "hes-known-as-big-dumper-but-this-sb",
  },
];

export const EightCategoryGridSection: React.FC = () => {
  return (
    <div className="w-full font-sans select-none pt-4 pb-4">
      {/* ==================== ROW 1: ECONOMY, HEALTH, INVESTING, CRYPTO ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-8">
        {row1Categories.map((item) => (
          <div key={item.id} className="flex flex-col justify-start">
            {/* Top Black Bar Header */}
            <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
                <Link href={`/${item.categorySlug}`} className="hover:underline">
                  {item.category}
                </Link>
              </h3>
              <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
            </div>

            {/* Main Photo */}
            <Link
              href={`/article/${item.mainSlug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
            >
              <img
                src={item.imageUrl}
                alt={item.mainHeadline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Main Headline */}
            <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
              <Link prefetch={true} href={`/article/${item.mainSlug}`}>
                {item.mainHeadline}
              </Link>
            </h4>

            {/* Sub Article 1 */}
            <div className="pt-1 pb-2">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href={`/article/${item.sub1Slug}`}>
                  {item.sub1Text}
                </Link>
              </h5>
            </div>

            {/* Sub Article 2 */}
            <div className="pt-1">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href={`/article/${item.sub2Slug}`}>
                  {item.sub2Text}
                </Link>
              </h5>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== ROW 2: REAL ESTATE, INDUSTRIES, LAW, SMALL BUSINESS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {row2Categories.map((item) => (
          <div key={item.id} className="flex flex-col justify-start">
            {/* Top Black Bar Header */}
            <div className="border-t-2 border-black pt-2 mb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-[20px] sm:text-[22px] text-[#111111] tracking-tight">
                <Link href={`/${item.categorySlug}`} className="hover:underline">
                  {item.category}
                </Link>
              </h3>
              <span className="font-sans font-bold text-[16px] text-[#111111] cursor-pointer">›</span>
            </div>

            {/* Main Photo */}
            <Link
              href={`/article/${item.mainSlug}`}
              className="block relative aspect-[16/10] w-full overflow-hidden bg-gray-100 mb-3 group"
            >
              <img
                src={item.imageUrl}
                alt={item.mainHeadline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Main Headline */}
            <h4 className="font-serif font-bold text-[17px] leading-[1.18] text-[#111111] hover:underline cursor-pointer mb-3">
              <Link prefetch={true} href={`/article/${item.mainSlug}`}>
                {item.mainHeadline}
              </Link>
            </h4>

            {/* Sub Article 1 */}
            <div className="pt-1 pb-2">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href={`/article/${item.sub1Slug}`}>
                  {item.sub1Text}
                </Link>
              </h5>
            </div>

            {/* Sub Article 2 */}
            <div className="pt-1">
              <h5 className="font-serif font-bold text-[14px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
                <Link prefetch={true} href={`/article/${item.sub2Slug}`}>
                  {item.sub2Text}
                </Link>
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EightCategoryGridSection;
