import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "Business",
  urlPath: "/business",
});

export default function BusinessPage() {
  return <CategoryPageTemplate categoryTitle="Business" />;
}
