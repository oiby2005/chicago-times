import React from "react";
import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "World News",
  urlPath: "/world",
});

export default function WorldPage() {
  return <CategoryPageTemplate categoryTitle="World" />;
}
