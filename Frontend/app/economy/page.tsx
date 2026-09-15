import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "Economy",
  urlPath: "/economy",
});

export default function EconomyPage() {
  return <CategoryPageTemplate categoryTitle="Economy" />;
}
