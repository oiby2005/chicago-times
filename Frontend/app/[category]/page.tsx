import React from "react";
import { redirect } from "next/navigation";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";

interface DynamicCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  return [
    { category: "news" },
    { category: "law" },
    { category: "politics" },
    { category: "business" },
    { category: "markets-finance" },
    { category: "economy" },
    { category: "tech" },
    { category: "entertainment" },
    { category: "arts" },
    { category: "industries" },
    { category: "fashion" },
    { category: "investing" },
    { category: "health" },
    { category: "sports" },
    { category: "lifestyle" },
    { category: "science" },
    { category: "opinion" },
    { category: "editorials" },
    { category: "world" },
    { category: "us" },
  ];
}

export default async function DynamicCategoryPage({ params }: DynamicCategoryPageProps) {
  const { category } = await params;

  if (
    category === "writer-dashboard" ||
    category === "author-workspace" ||
    category === "admin-dashboard" ||
    category === "reader-dashboard"
  ) {
    return null;
  }

  const formatTitle = (str: string) => {
    if (str === "markets-finance") return "Markets & Finance";
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const title = formatTitle(category);

  return <CategoryPageTemplate categoryTitle={title} />;
}
