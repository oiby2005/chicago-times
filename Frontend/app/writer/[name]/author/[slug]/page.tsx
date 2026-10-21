import { Suspense } from "react";
import AuthorClientContent from "@/app/author/[slug]/AuthorClientContent";

interface Props {
  params: Promise<{ name: string; slug: string }>;
}

export default async function WriterAuthorProfilePage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={null}>
      <AuthorClientContent slug={slug} />
    </Suspense>
  );
}
