/**
 * Utility to convert any uploaded image File into WebP format data URL.
 */
export function convertFileToWebP(file: File, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve("");
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const webpUrl = canvas.toDataURL("image/webp", quality);
            resolve(webpUrl);
            return;
          }
        } catch (err) {
          console.error("Canvas WebP conversion error:", err);
        }
        resolve(src);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

/**
 * Utility to convert any image data URL or blob URL to WebP format data URL.
 */
export function convertDataUrlToWebP(dataUrl: string, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || dataUrl.startsWith("data:image/webp")) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const webpUrl = canvas.toDataURL("image/webp", quality);
          resolve(webpUrl);
          return;
        }
      } catch (err) {}
      resolve(dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Utility to ensure any image URL (Unsplash, WSJ CDN, or external) serves WebP format natively.
 */
export function ensureWebpUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("/api/webp-proxy")) return url;

  // Local static assets, relative paths, localhost URLs, SVGs & WebPs: preserve directly without proxying
  if (
    url.startsWith("/") ||
    url.startsWith(".") ||
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    /\.(svg|webp)(\?.*)?$/i.test(url)
  ) {
    return url;
  }

  if (url.startsWith("data:image/")) {
    if (url.startsWith("data:image/webp")) return url;
    return url.replace(/^data:image\/(?:png|jpeg|jpg|avif|gif);base64,/i, "data:image/webp;base64,");
  }

  if (url.includes("images.unsplash.com")) {
    let clean = url.replace(/auto=format/g, "fm=webp");
    if (!clean.includes("fm=webp") && !clean.includes("format=webp")) {
      clean = clean.includes("?") ? `${clean}&fm=webp` : `${clean}?fm=webp`;
    }
    return clean;
  }

  // WSJ CDN and all external remote images: route through server-side WebP proxy
  if (/^https?:\/\//i.test(url)) {
    return `/api/webp-proxy?url=${encodeURIComponent(url)}`;
  }

  return url;
}

/**
 * Automatically migrates existing published posts in localStorage to WebP format.
 */
export function migrateLocalStorageToWebP(): void {
  if (typeof window === "undefined") return;

  const storageKeys = ["wsj_posts", "wsj_published_posts"];

  storageKeys.forEach((key) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return;

      let posts = JSON.parse(stored);
      if (!Array.isArray(posts) || posts.length === 0) return;

      let modified = false;

      posts = posts.map((post: any) => {
        if (!post) return post;
        let updatedPost = { ...post };

        // 1. Migrate thumbnail
        if (updatedPost.thumbnail) {
          const newThumb = ensureWebpUrl(updatedPost.thumbnail);
          if (newThumb !== updatedPost.thumbnail) {
            updatedPost.thumbnail = newThumb;
            modified = true;
          }
        }

        // 2. Migrate bodyContent
        if (updatedPost.bodyContent) {
          let newBody = updatedPost.bodyContent;
          newBody = newBody.replace(/auto=format/g, "fm=webp");
          newBody = newBody.replace(/src=["'](data:image\/(?:png|jpeg|jpg|avif);base64,[^"']+)["']/gi, (match: string, dataUrl: string) => {
            modified = true;
            return `src="${dataUrl.replace(/^data:image\/(?:png|jpeg|jpg|avif)/i, "data:image/webp")}"`;
          });
          newBody = newBody.replace(/src=["'](https?:\/\/[^"']+)["']/gi, (match: string, src: string) => {
            const cleanSrc = ensureWebpUrl(src);
            if (cleanSrc !== src) modified = true;
            return `src="${cleanSrc}"`;
          });

          if (newBody !== updatedPost.bodyContent) {
            updatedPost.bodyContent = newBody;
            modified = true;
          }
        }

        return updatedPost;
      });

      if (modified) {
        localStorage.setItem(key, JSON.stringify(posts));
        window.dispatchEvent(new Event("wsj_posts_updated"));
      }
    } catch (e) {
      console.error(`Error migrating ${key} to WebP:`, e);
    }
  });
}
