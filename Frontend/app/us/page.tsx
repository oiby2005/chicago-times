import CategoryPageTemplate from "@/components/category/CategoryPageTemplate";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

export const metadata = getLinkPreviewMetadata({
  type: "category",
  title: "US News",
  urlPath: "/us",
});

export default function USPage() {
  return <CategoryPageTemplate categoryTitle="U.S." />;
}
