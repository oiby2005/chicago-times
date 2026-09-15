import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "Opinion",
  urlPath: "/opinion",
});

export default function OpinionPage() {
  return <CategoryPageTemplate categoryTitle="Opinion" />;
}
