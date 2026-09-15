"use client";

import { useEffect } from "react";
import { ensureWebpUrl, migrateLocalStorageToWebP } from "@/lib/webpConverter";

export default function WebpGlobalInterceptor() {
  useEffect(() => {
    // 1. Run migration of all published posts in localStorage
    migrateLocalStorageToWebP();

    // 2. DOM Interceptor: ensure external non-local images load WebP without mutating dataset attributes
    const transformImages = () => {
      const images = document.querySelectorAll<HTMLImageElement>("img");
      images.forEach((img) => {
        const rawSrc = img.getAttribute("src") || img.src;
        if (!rawSrc) return;

        // Skip local static assets, relative paths, localhost URLs, SVGs, and already proxied images
        if (
          rawSrc.startsWith("/") ||
          rawSrc.startsWith(".") ||
          rawSrc.includes("localhost") ||
          rawSrc.includes("127.0.0.1") ||
          /\.(svg|webp)(\?.*)?$/i.test(rawSrc) ||
          rawSrc.startsWith("/api/webp-proxy")
        ) {
          return;
        }

        const webpSrc = ensureWebpUrl(rawSrc);
        if (webpSrc !== rawSrc && webpSrc !== img.src) {
          img.src = webpSrc;
        }
      });
    };

    const timer = setTimeout(() => {
      transformImages();
    }, 100);

    // Observe dynamic DOM additions (e.g. dynamically rendered articles/posts)
    const observer = new MutationObserver(() => {
      transformImages();
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
