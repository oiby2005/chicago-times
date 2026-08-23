import React from "react";
import { redirect } from "next/navigation";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";

interface SubCategoryPageProps {
  params: Promise<{
    category: string;
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  return [
    { category: "business", slug: ["cfo-spotlight"] },
    { category: "business", slug: ["economy-markets"] },
    { category: "world", slug: ["us"] },
    { category: "world", slug: ["politics"] },
    { category: "tech", slug: ["crypto"] },
    { category: "tech", slug: ["technology"] },
    { category: "markets-finance", slug: ["stocks"] },
    { category: "opinion", slug: ["editorials"] },
    { category: "lifestyle", slug: ["travel"] },
    { category: "arts", slug: ["culture"] },
  ];
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { category, slug } = await params;

  if (
    category === "writer-dashboard" ||
    category === "author-workspace" ||
    category === "admin-dashboard" ||
    category === "reader-dashboard"
  ) {
    redirect("/signin");
  }

  const formatTitle = (str: string) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const mainCategory = formatTitle(category);
  const subCategory = (slug || []).map(formatTitle).join(" > ");
  const title = subCategory ? `${mainCategory} - ${subCategory}` : mainCategory;

  return <CategoryPageTemplate categoryTitle={title} />;
}
