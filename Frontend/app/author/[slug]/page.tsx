import { Suspense } from "react";
import { Metadata } from "next";
import AuthorClientContent from "./AuthorClientContent";
import { fetchAuthorBySlug } from "@/data/authors";
import { getLinkPreviewMetadata } from "@/lib/linkPreview";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const author = await fetchAuthorBySlug(slug);

  const roleLabel = author.role || "STAFF WRITER";
  const displayTitle = `${author.name} | ${roleLabel}`;

  return getLinkPreviewMetadata({
    type: "author",
    title: displayTitle,
    authorRole: roleLabel,
    authorBio: author.bio || `${author.name} is a ${roleLabel} at Times Chicago.`,
    image: author.image || author.avatarUrl || "/images/design-reference/Fav-Icon-Padded.jpg",
    urlPath: `/author/${slug}`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  return (
    <Suspense fallback={null}>
      <AuthorClientContent />
    </Suspense>
  );
}
