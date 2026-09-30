import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function cleanCdata(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/\]\]>/g, "]]&gt;")
    .trim();
}

function getCleanDescription(post: any): string {
  let raw =
    post.cardSummary ||
    post.subheadline ||
    post.excerpt ||
    post.summary ||
    post.description ||
    "";

  if (!raw && (post.bodyContent || post.content)) {
    raw = post.bodyContent || post.content;
  }

  if (!raw) {
    raw = post.title || post.headline || "";
  }

  const cleaned = String(raw)
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length > 250) {
    return cleaned.substring(0, 247) + "...";
  }
  return cleaned || "Read the latest news report on Times Chicago.";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isRaw = searchParams.get("raw") === "true" || searchParams.get("format") === "raw";
  const isDownload = searchParams.get("download") === "1" || searchParams.get("download") === "true";

  const siteUrl = "http://localhost:3000";
  let posts: any[] = [];

  try {
    const res = await fetch("http://localhost:5000/api/posts", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        posts = data.posts;
      }
    }
  } catch (e) {
    console.error("Failed to fetch posts for RSS:", e);
  }

  // Fallback posts if database API is offline
  if (!posts || posts.length === 0) {
    posts = [
      {
        id: "post-1",
        slug: "pizza-hut-lost-in-the-us-now-selling-for-2-7b",
        title: "Pizza Hut Lost in the U.S. Now It’s Selling for $2.7B.",
        excerpt: "Inside the strategic moves and private equity acquisition behind Pizza Hut's global restructuring.",
        author: "Times Chicago Staff",
        category: "Business",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=webp&fit=crop&w=800&q=80",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "post-2",
        slug: "how-one-familys-flower-farm-became-essential-to-chanel-no-5",
        title: "How One Family’s Flower Farm Became Essential to Chanel No. 5",
        excerpt: "Exploring the legendary jasmine and rose fields in Grasse that supply the world's most iconic perfume.",
        author: "Times Chicago Staff",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?fm=webp&fit=crop&w=800&q=80",
        publishedAt: new Date().toISOString(),
      },
    ];
  }

  // Filter published posts
  const activePosts = posts.filter(
    (p) => (p.status || "Published").toLowerCase() === "published"
  );

  const itemsXml = activePosts
    .map((post) => {
      const title = cleanCdata(post.title || post.headline || "Untitled");
      const description = cleanCdata(getCleanDescription(post));
      const slug = post.slug || post.id || "article";
      const link = `${siteUrl}/article/${slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date(post.created_at || Date.now()).toUTCString();
      const author = cleanCdata(post.author || post.authorName || "Times Chicago Staff");
      const category = cleanCdata(post.category || "News");
      const imageUrl = post.image || post.imageUrl || post.thumbnailUrl || post.coverImage || "";

      const enclosureTag = imageUrl
        ? `\n<enclosure url="${imageUrl.replace(/&/g, "&amp;")}" length="0" type="image/jpeg"/>`
        : "";

      return `<item>
<title>
<![CDATA[ ${title} ]]>
</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<description>
<![CDATA[ ${description} ]]>
</description>
<pubDate>${pubDate}</pubDate>
<author>
<![CDATA[ ${author} ]]>
</author>
<category>
<![CDATA[ ${category} ]]>
</category>${enclosureTag}
</item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Times Chicago</title>
<link>${siteUrl}</link>
<description>Latest news, politics, business, technology, sports and health updates from Times Chicago.</description>
<language>en-us</language>
<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
<image>
<url>${siteUrl}/favicon.jpg</url>
<title>Times Chicago</title>
<link>${siteUrl}</link>
</image>
${itemsXml}
</channel>
</rss>`;

  const headers: Record<string, string> = {
    "Content-Type": isRaw ? "text/plain; charset=utf-8" : "application/xml; charset=utf-8",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };

  if (isDownload) {
    headers["Content-Disposition"] = 'attachment; filename="rss.xml"';
  }

  return new NextResponse(rssXml, { headers });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
