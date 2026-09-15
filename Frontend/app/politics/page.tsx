import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "Politics",
  urlPath: "/politics",
});

export default function PoliticsPage() {
  return <CategoryPageTemplate categoryTitle="Politics" />;
}
