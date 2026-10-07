import ArticleClientContent from "@/app/article/[slug]/ArticleClientContent";
import { getArticleBySlug } from "@/data/articles";
import { getCustomPostBySlugOrId } from "@/lib/posts";

interface Props {
  params: Promise<{ name: string; slug: string }>;
}

export default async function ReaderArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const customPost = getCustomPostBySlugOrId(slug);
  const staticArticle = getArticleBySlug(slug);
  const initialArticle = customPost || staticArticle;

  return <ArticleClientContent slug={slug} initialArticle={initialArticle} />;
}
