import AuthorClientContent from "@/app/author/[slug]/AuthorClientContent";

interface Props {
  params: Promise<{ name: string; slug: string }>;
}

export default async function ReaderAuthorProfilePage({ params }: Props) {
  const { slug } = await params;
  return <AuthorClientContent slug={slug} />;
}
