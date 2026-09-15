"use client";

import { useEffect } from "react";

export default function GlobalDataSync() {
  useEffect(() => {
    const syncDatabaseData = async () => {
      try {
        // 1. Fetch posts from Express/MySQL backend API
        const postsRes = await fetch("http://localhost:5000/api/posts", {
          cache: "no-store",
        });
        if (postsRes.ok) {
          const data = await postsRes.json();
          if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
            localStorage.setItem("wsj_posts", JSON.stringify(data.posts));
            window.dispatchEvent(new Event("wsj_posts_updated"));
          }
        }
      } catch (e) {
        console.warn("GlobalDataSync: Failed to fetch posts from backend", e);
      }

      try {
        // 2. Fetch ad configurations from Express/MySQL backend API
        const adsRes = await fetch("http://localhost:5000/api/ads", {
          cache: "no-store",
        });
        if (adsRes.ok) {
          const adsData = await adsRes.json();
          if (adsData.success && Array.isArray(adsData.ads) && adsData.ads.length > 0) {
            localStorage.setItem("wsj_ad_slots_config", JSON.stringify(adsData.ads));
            window.dispatchEvent(new Event("wsj_ads_updated"));
          }
        }
      } catch (e) {
        console.warn("GlobalDataSync: Failed to fetch ads from backend", e);
      }

      try {
        // 3. Fetch shorts, recommended videos, main videos & podcasts from Express/MySQL backend API
        const shortsRes = await fetch("http://localhost:5000/api/shorts", {
          cache: "no-store",
        });
        if (shortsRes.ok) {
          const shortsData = await shortsRes.json();
          if (shortsData.success && Array.isArray(shortsData.slots) && shortsData.slots.length > 0) {
            const allSlots = shortsData.slots;
            const rec = allSlots.filter(
              (s: any) =>
                s.id?.includes("recommended") ||
                (s.id?.startsWith("rec") && !s.id?.includes("video"))
            );
            const mainV = allSlots.filter(
              (s: any) =>
                s.id?.includes("videos") ||
                s.id?.includes("main")
            );
            const pod = allSlots.filter(
              (s: any) =>
                s.id?.includes("podcast") ||
                s.id?.includes("pod")
            );

            if (rec.length > 0) localStorage.setItem("wsj_recommended_video_slots", JSON.stringify(rec));
            if (mainV.length > 0) localStorage.setItem("wsj_main_video_slots", JSON.stringify(mainV));
            if (pod.length > 0) localStorage.setItem("wsj_podcast_slots", JSON.stringify(pod));

            window.dispatchEvent(new Event("wsj_shorts_updated"));
          }
        }
      } catch (e) {
        console.warn("GlobalDataSync: Failed to fetch shorts/videos from backend", e);
      }
    };

    // Run sync on mount
    syncDatabaseData();

    // Re-sync when window regains focus (e.g. switching between tabs/profiles/browsers)
    const handleFocus = () => {
      syncDatabaseData();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return null;
}
