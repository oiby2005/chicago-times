/**
 * Helper utility to extract or generate clean human-readable title slugs for article URLs.
 */
export function getArticleSlug(article: any): string {
  if (!article) return "article";
  
  // If post already has a valid non-numeric slug, use it
  if (article.slug && typeof article.slug === "string" && !/^\d+$/.test(article.slug.trim())) {
    return article.slug.trim();
  }

  // Generate clean title slug from headline/title
  const titleText = article.title || article.headline || "";
  if (titleText) {
    const slugified = titleText
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (slugified) return slugified;
  }

  return article.slug || String(article.id || "article");
}

export function getArticleUrl(article: any): string {
  const slug = getArticleSlug(article);
  return `/article/${slug}`;
}
