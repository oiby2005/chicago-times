import fs from "fs";
import path from "path";

export interface CustomPost {
  id: string;
  title: string;
  slug?: string;
  subheadline?: string;
  cardSummary?: string;
  bodyContent?: string;
  category?: string;
  author?: string;
  authorEmail?: string;
  thumbnail?: string;
  publishedAt?: number;
  date?: string;
}

export function stripHtmlTags(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getCustomPostBySlugOrId(slugParam: string): CustomPost | null {
  if (!slugParam) return null;
  const decodedSlug = decodeURIComponent(slugParam).trim();
  const cleanParamSlug = decodedSlug.toLowerCase();
  const titleSlugPattern = cleanParamSlug.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const candidatePaths = [
    path.resolve(process.cwd(), "../Backend/data/posts.json"),
    path.resolve(process.cwd(), "Backend/data/posts.json"),
    path.resolve(process.cwd(), "../../Backend/data/posts.json"),
  ];

  let posts: CustomPost[] = [];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf-8");
        posts = JSON.parse(raw);
        if (Array.isArray(posts) && posts.length > 0) break;
      } catch (e) {}
    }
  }

  if (!posts || !posts.length) return null;

  return (
    posts.find((p: CustomPost) => {
      if (!p) return false;
      const pTitleSlug = p.title
        ? p.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
        : "";
      const pSlugClean = p.slug ? String(p.slug).toLowerCase().trim() : "";
      const pIdClean = p.id ? String(p.id).toLowerCase().trim() : "";

      return (
        pSlugClean === cleanParamSlug ||
        pIdClean === cleanParamSlug ||
        pTitleSlug === titleSlugPattern ||
        pTitleSlug === cleanParamSlug ||
        (p.title && p.title.toLowerCase().trim() === cleanParamSlug)
      );
    }) || null
  );
}
