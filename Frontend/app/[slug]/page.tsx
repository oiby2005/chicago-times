import React from "react";
import type { Metadata } from "next";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import NewHomeBody from "@/components/home/NewHomeBody";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Footer from "@/components/layout/Footer";

interface DynamicSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "news": "News",
  "us-news": "US News",
  "us news": "US News",
  "us": "US News",
  "international-news": "International News",
  "international news": "International News",
  "law": "Law",
  "criminal-cases": "Criminal Cases",
  "legal-affairs": "Legal Affairs",
  "politics": "Politics",
  "world-politics": "World Politics",
  "world": "World Politics",
  "world news": "World News",
  "congress": "Congress",
  "elections": "Elections",
  "business": "Business",
  "corporate-news": "Corporate News",
  "small-business": "Small Business",
  "entrepreneurship": "Entrepreneurship",
  "ceos-and-executives": "CEOs & Executives",
  "ceos-executives": "CEOs & Executives",
  "markets-finance": "Markets & Finance",
  "markets": "Markets & Finance",
  "stocks": "Stocks",
  "currencies": "Currencies",
  "banking": "Banking",
  "economy": "Economy",
  "jobs-employment": "Jobs & Employment",
  "interest-rates": "Interest Rates",
  "tech": "Tech",
  "artificial-intelligence": "Artificial Intelligence",
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
  "wealth-management": "Wealth Management",
  "crypto": "Crypto",
  "health": "Health",
  "medical-research": "Medical Research",
  "mental-health": "Mental Health",
  "sports": "Sports",
  "sport": "Sports",
  "soccer": "Soccer",
  "golf": "Golf",
  "tennis": "Tennis",
  "cricket": "Cricket",
  "lifestyle": "Lifestyle",
  "travel": "Travel",
  "food-dining": "Food & Dining",
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

function formatCategoryTitle(str?: string): string {
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

export async function generateMetadata({ params }: DynamicSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = (slug || "").toLowerCase().trim();

  if (CATEGORY_SLUG_MAP[cleanSlug]) {
    const title = formatCategoryTitle(slug);
    return getLinkPreviewMetadata({
      type: "category",
      title: title,
      urlPath: `/${slug}`,
    });
  }

  return getLinkPreviewMetadata({
    type: "website",
    title: "Times Chicago - Breaking News, Analysis & Opinion",
    urlPath: `/${slug}`,
  });
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;

  if (
    slug === "writer-dashboard" ||
    slug === "author-workspace" ||
    slug === "admin-dashboard" ||
    slug === "reader-dashboard"
  ) {
    return null;
  }

  const cleanSlug = (slug || "").toLowerCase().trim();
  const isKnownCategory = Boolean(CATEGORY_SLUG_MAP[cleanSlug]);

  if (isKnownCategory) {
    const title = formatCategoryTitle(slug);
    return <CategoryPageTemplate categoryTitle={title} categorySlug={cleanSlug} />;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header />
        <StickyHeaderBar />
        <NewHomeBody />
        <StickySubscribeBar />
      </div>
      <Footer />
    </main>
  );
}
