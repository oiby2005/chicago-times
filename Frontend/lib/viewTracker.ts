"use client";

/**
 * Utility helper to track and retrieve article view counts in localStorage and backend.
 */

export function recordArticleView(slugOrId: string, initialViewsCount: number = 0): number {
  if (typeof window === "undefined" || !slugOrId) return initialViewsCount;
  try {
    const raw = localStorage.getItem("wsj_article_views");
    const viewsMap: Record<string, number> = raw ? JSON.parse(raw) : {};
    const key = slugOrId.toLowerCase().trim();
    if (!key) return initialViewsCount;

    // View starts at 0 if never opened. First open makes it 1.
    const current = viewsMap[key] !== undefined ? viewsMap[key] : (initialViewsCount > 0 ? initialViewsCount : 0);
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

    // Call backend API to persist views increment across sessions and admin dashboard
    fetch("http://localhost:5000/api/posts/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: key }),
    }).catch(() => {});

    window.dispatchEvent(new CustomEvent("wsj_article_viewed", { detail: { slugOrId: key, views: updated } }));
    return updated;
  } catch (e) {
    return initialViewsCount;
  }
}

export function getArticleViews(slugOrId: string, defaultBaseline: number = 0): number {
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
    
    return defaultBaseline;
  } catch (e) {
    return defaultBaseline;
  }
}
