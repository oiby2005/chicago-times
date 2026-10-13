import React from "react";
import type { Metadata } from "next";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

interface SubCategoryPageProps {
  params: Promise<{
    slug: string;
    subCategory: string;
  }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "news": "News",
  "us-news": "US News",
  "us news": "US News",
  "us": "US News",
  "u-s-news": "US News",
  "u.s. news": "US News",
  "international-news": "International News",
  "international news": "International News",
  "law": "Law",
  "criminal-cases": "Criminal Cases",
  "criminal cases": "Criminal Cases",
  "legal-affairs": "Legal Affairs",
  "legal affairs": "Legal Affairs",
  "politics": "Politics",
  "world-politics": "World Politics",
  "world politics": "World Politics",
  "world": "World Politics",
  "world news": "World News",
  "congress": "Congress",
  "elections": "Elections",
  "business": "Business",
  "corporate-news": "Corporate News",
  "corporate news": "Corporate News",
  "small-business": "Small Business",
  "small business": "Small Business",
  "entrepreneurship": "Entrepreneurship",
  "ceos-and-executives": "CEOs & Executives",
  "ceos & executives": "CEOs & Executives",
  "ceos executives": "CEOs & Executives",
  "markets-finance": "Markets & Finance",
  "markets": "Markets & Finance",
  "stocks": "Stocks",
  "currencies": "Currencies",
  "banking": "Banking",
  "economy": "Economy",
  "jobs-employment": "Jobs & Employment",
  "jobs & employment": "Jobs & Employment",
  "jobs employment": "Jobs & Employment",
  "interest-rates": "Interest Rates",
  "interest rates": "Interest Rates",
  "tech": "Tech",
  "artificial-intelligence": "Artificial Intelligence",
  "artificial intelligence": "Artificial Intelligence",
  "ai": "Artificial Intelligence",
  "cybersecurity": "Cybersecurity",
  "innovation": "Innovation",
  "entertainment": "Entertainment",
  "movies": "Movies",
  "television": "Television",
  "music": "Music",
  "celebrity": "Celebrity",
  "arts": "Arts",
  "upcoming-brands": "Upcoming Brands",
  "upcoming brands": "Upcoming Brands",
  "architecture": "Architecture",
  "books": "Books",
  "culture": "Culture",
  "industries": "Industries",
  "energy": "Energy",
  "automotive": "Automotive",
  "manufacturing": "Manufacturing",
  "agriculture": "Agriculture",
  "construction": "Construction",
  "fashion": "Fashion",
  "designers": "Designers",
  "jewelry": "Jewelry",
  "investing": "Investing",
  "real-estate": "Real Estate",
  "real estate": "Real Estate",
  "wealth-management": "Wealth Management",
  "wealth management": "Wealth Management",
  "crypto": "Crypto",
  "health": "Health",
  "medical-research": "Medical Research",
  "medical research": "Medical Research",
  "mental-health": "Mental Health",
  "mental health": "Mental Health",
  "sports": "Sports",
  "sport": "Sports",
  "soccer": "Soccer",
  "golf": "Golf",
  "tennis": "Tennis",
  "cricket": "Cricket",
  "lifestyle": "Lifestyle",
  "travel": "Travel",
  "food-dining": "Food & Dining",
  "food & dining": "Food & Dining",
  "cars": "Cars",
  "science": "Science",
  "space": "Space",
  "climate": "Climate",
  "environment": "Environment",
  "research": "Research",
  "opinions": "Opinions",
  "opinion": "Opinions",
  "editorials": "Editorials",
  "editorial": "Editorials",
  "interviews": "Interviews",
  "interview": "Interviews",
};

function formatSubCategoryTitle(str?: string): string {
  if (!str) return "News";
  let decoded = str;
  try {
    decoded = decodeURIComponent(str);
  } catch (e) {}

  const clean = decoded.toLowerCase().trim();
  if (CATEGORY_SLUG_MAP[clean]) {
    return CATEGORY_SLUG_MAP[clean];
  }
  return decoded
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { slug, subCategory } = await params;
  let decodedSub = subCategory || "";
  try {
    decodedSub = decodeURIComponent(subCategory);
  } catch (e) {}

  const title = formatSubCategoryTitle(decodedSub);
  return getLinkPreviewMetadata({
    type: "category",
    title: title,
    urlPath: `/${slug}/${subCategory}`,
  });
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { slug, subCategory } = await params;
  let decodedSub = subCategory || "";
  try {
    decodedSub = decodeURIComponent(subCategory);
  } catch (e) {}

  const title = formatSubCategoryTitle(decodedSub);
  const cleanSubSlug = decodedSub.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return <CategoryPageTemplate categoryTitle={title} categorySlug={cleanSubSlug} />;
}
