"use client";

/**
 * Utility helper to track and retrieve article view counts in localStorage.
 */

export function recordArticleView(slugOrId: string, initialViewsCount: number = 0): number {
  if (typeof window === "undefined" || !slugOrId) return initialViewsCount;
  try {
    const raw = localStorage.getItem("wsj_article_views");
    const viewsMap: Record<string, number> = raw ? JSON.parse(raw) : {};
    const key = slugOrId.toLowerCase().trim();
    if (!key) return initialViewsCount;

    // Base initial default views count if first view
    const defaultSeed = initialViewsCount > 0 ? initialViewsCount : 85;
    const current = viewsMap[key] !== undefined ? viewsMap[key] : defaultSeed;
    const updated = current + 1;
    viewsMap[key] = updated;
    localStorage.setItem("wsj_article_views", JSON.stringify(viewsMap));

    // Sync back to wsj_posts if item exists there
    const postsRaw = localStorage.getItem("wsj_posts");
    if (postsRaw) {
      const posts = JSON.parse(postsRaw);
      let changed = false;
      posts.forEach((p: any) => {
        if (!p) return;
        const pSlug = (p.slug || "").toLowerCase().trim();
        const pId = (String(p.id) || "").toLowerCase().trim();
        const pTitleSlug = p.title
          ? p.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
          : "";
        if (pSlug === key || pId === key || pTitleSlug === key) {
          p.views = updated;
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem("wsj_posts", JSON.stringify(posts));
        window.dispatchEvent(new Event("wsj_posts_updated"));
      }
    }

    window.dispatchEvent(new CustomEvent("wsj_article_viewed", { detail: { slugOrId: key, views: updated } }));
    return updated;
  } catch (e) {
    return initialViewsCount;
  }
}

export function getArticleViews(slugOrId: string, defaultBaseline: number = 65): number {
  if (typeof window === "undefined" || !slugOrId) return defaultBaseline;
  try {
    const raw = localStorage.getItem("wsj_article_views");
    const viewsMap: Record<string, number> = raw ? JSON.parse(raw) : {};
    const key = slugOrId.toLowerCase().trim();
    if (!key) return defaultBaseline;

    if (viewsMap[key] !== undefined) {
      return viewsMap[key];
    }

    // Check wsj_posts
    const postsRaw = localStorage.getItem("wsj_posts");
    if (postsRaw) {
      const posts = JSON.parse(postsRaw);
      const match = posts.find((p: any) => {
        if (!p) return false;
        const pSlug = (p.slug || "").toLowerCase().trim();
        const pId = (String(p.id) || "").toLowerCase().trim();
        const pTitleSlug = p.title
          ? p.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
          : "";
        return pSlug === key || pId === key || pTitleSlug === key;
      });
      if (match) {
        if (typeof match.views === "number") return match.views;
        if (typeof match.views === "string") {
          const parsed = parseInt(match.views.replace(/[^0-9]/g, ""), 10);
          if (!isNaN(parsed)) return parsed;
        }
      }
    }
    
    // Fallback deterministic baseline view count based on string hash if not viewed yet
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    const pseudoRand = (Math.abs(hash) % 150) + 25;
    return pseudoRand;
  } catch (e) {
    return defaultBaseline;
  }
}
