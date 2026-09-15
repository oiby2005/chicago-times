import React from "react";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "News",
  urlPath: "/news",
});

export default function NewsPage() {
  return <CategoryPageTemplate categoryTitle="News" />;
}
