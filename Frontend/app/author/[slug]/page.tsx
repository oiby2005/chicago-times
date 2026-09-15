import { Metadata } from "next";
import AuthorClientContent from "./AuthorClientContent";
import { getAuthorBySlug } from "@/data/authors";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const author = getAuthorBySlug(slug);

  const displayRole = author.role === "WRITER" || author.role === "writer" ? "Writer User" : (author.role || "Writer User");

  return getLinkPreviewMetadata({
    type: "author",
    title: author.name,
    authorRole: displayRole,
    authorBio: displayRole,
    image: author.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fm=webp&fit=crop&w=300&q=80",
    urlPath: `/author/${slug}`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  return <AuthorClientContent />;
}
