import { Metadata } from "next";
import ArticleClientContent from "./ArticleClientContent";
import { getArticleBySlug } from "@/data/articles";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";
import { getCustomPostBySlugOrId, stripHtmlTags } from "@/lib/posts";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const customPost = getCustomPostBySlugOrId(slug);
  const staticArticle = getArticleBySlug(slug) || {};

  let title = customPost?.title || staticArticle.title;
  if (!title) {
    if (/^\d+$/.test(slug)) {
      title = "Article";
    } else {
      title = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  const description =
    customPost?.subheadline ||
    customPost?.cardSummary ||
    (customPost?.bodyContent ? stripHtmlTags(customPost.bodyContent).substring(0, 160) : undefined) ||
    staticArticle.deck ||
    staticArticle.summary ||
    (staticArticle.content ? staticArticle.content.substring(0, 160) : undefined);

  const imageUrl = customPost?.thumbnail || staticArticle.imageUrl;

  return getLinkPreviewMetadata({
    type: "article",
    title: title ? `${title} | Times Chicago` : undefined,
    description: description,
    image: imageUrl,
    urlPath: `/article/${slug}`,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const customPost = getCustomPostBySlugOrId(slug);
  const staticArticle = getArticleBySlug(slug);

  const initialArticle = customPost || staticArticle;

  return <ArticleClientContent slug={slug} initialArticle={initialArticle} />;
}
