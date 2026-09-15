import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "Tech",
  urlPath: "/tech",
});

export default function TechPage() {
  return <CategoryPageTemplate categoryTitle="Tech" />;
}
