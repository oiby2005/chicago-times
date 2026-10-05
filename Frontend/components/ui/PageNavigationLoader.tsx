"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const COMMON_ROUTES = [
  "/",
  "/signin",
  "/sign-in",
  "/signup",
  "/admin-dashboard",
  "/reader-dashboard",
  "/writer-dashboard",
  "/author-workspace",
  "/leadership",
  "/special-offer",
  "/contact-us",
  "/advertise",
  "/newsletter",
  "/newsletters",
  "/terms-and-conditions",
  "/privacy-policy",
  "/world",
  "/business",
  "/politics",
  "/tech",
  "/sports",
  "/lifestyle",
  "/entertainment",
  "/search",
];

export default function PageNavigationLoader() {
  const router = useRouter();

  // 1. Prefetch key site routes immediately on mount for instant clicks
  useEffect(() => {
    if (typeof window === "undefined") return;

    COMMON_ROUTES.forEach((route) => {
      try {
        router.prefetch(route);
      } catch (e) {}
    });

    const timer = setTimeout(() => {
      COMMON_ROUTES.forEach((route) => {
        try {
          router.prefetch(route);
        } catch (e) {}
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  // 2. Prefetch any target link immediately on hover, touch, pointerdown, or focus
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefetchTarget = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("//") &&
          !href.startsWith("#")
        ) {
          try {
            router.prefetch(href);
          } catch (err) {}
        }
      }
    };

    document.addEventListener("pointerover", prefetchTarget, { passive: true });
    document.addEventListener("pointerdown", prefetchTarget, { passive: true });
    document.addEventListener("touchstart", prefetchTarget, { passive: true });
    document.addEventListener("focusin", prefetchTarget, { passive: true });

    return () => {
      document.removeEventListener("pointerover", prefetchTarget);
      document.removeEventListener("pointerdown", prefetchTarget);
      document.removeEventListener("touchstart", prefetchTarget);
      document.removeEventListener("focusin", prefetchTarget);
    };
  }, [router]);

  return null;
}
