import React from "react";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";

interface Props {
  params: Promise<{ name: string; category: string }>;
}

export default async function WriterCategoryPage({ params }: Props) {
  const { category } = await params;
  const cleanCat = (category || "").toLowerCase().trim();
  const title = cleanCat
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return <CategoryPageTemplate categoryTitle={title} categorySlug={cleanCat} />;
}
