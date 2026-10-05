"use client";

import React, { useState, useEffect } from "react";

export interface ArticleVideoItem {
  id: string;
  slotNumber: number;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  platform?: string;
  duration?: string;
}

const DEFAULT_ARTICLE_VIDEOS: ArticleVideoItem[] = [
  {
    id: "v1",
    slotNumber: 1,
    title: "Mortgage Rates Hit 7 Percent: What’s Next for the Housing Market?",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?fm=webp&fit=crop&w=800&q=80",
    platform: "YouTube",
    duration: "4:15",
  },
  {
    id: "v2",
    slotNumber: 2,
    title: "GE Vernova CEO on Energy Demand and Economic Stability",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=800&q=80",
    platform: "YouTube",
    duration: "3:42",
  },
  {
    id: "v3",
    slotNumber: 3,
    title: "Kevin Warsh Gives Three Reasons Behind Bond-Price Increase",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?fm=webp&fit=crop&w=800&q=80",
    platform: "YouTube",
    duration: "5:10",
  },
];

function resolveThumbnail(videoUrl: string, providedThumb?: string): string {
  if (providedThumb && providedThumb.trim() !== "") {
    return providedThumb.trim();
  }
  if (!videoUrl) return "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=800&q=80";

  const trimmed = videoUrl.trim();
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/i);
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }
  return "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=800&q=80";
}

function isVerticalVideo(url?: string, platform?: string): boolean {
  const str = `${url || ""} ${platform || ""}`.toLowerCase();
  return str.includes("facebook") || str.includes("fb_shorts") || str.includes("instagram") || str.includes("reel");
}

export function ArticleVideosSection() {
  const [videos, setVideos] = useState<ArticleVideoItem[]>(DEFAULT_ARTICLE_VIDEOS);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const loadVideos = async () => {
    if (typeof window === "undefined") return;

    const vMap = new Map<number, ArticleVideoItem>();
    DEFAULT_ARTICLE_VIDEOS.forEach((d) => vMap.set(d.slotNumber, d));

    try {
      const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const slotsArray = data.slots || data.shorts || [];
        if (Array.isArray(slotsArray)) {
          slotsArray.forEach((v: any) => {
            const num = Number(v.slotNumber || 1);
            if (num >= 1 && num <= 3) {
              if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                vMap.set(num, {
                  id: `video_slot_${num}`,
                  slotNumber: num,
                  title: v.title || DEFAULT_ARTICLE_VIDEOS[num - 1]?.title || `Video ${num}`,
                  videoUrl: v.videoUrl,
                  thumbnailUrl: resolveThumbnail(v.videoUrl, v.thumbnailUrl),
                  platform: v.platform || "Watch Video",
                  duration: v.duration || "0:00",
                });
              }
            }
          });
        }
      }
    } catch (e) {}

    try {
      const keys = ["wsj_shorts_slots", "wsj_shorts", "wsj_main_video_slots"];
      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((v: any) => {
              const num = Number(v.slotNumber || 1);
              if (num >= 1 && num <= 3) {
                if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                  vMap.set(num, {
                    id: `video_slot_${num}`,
                    slotNumber: num,
                    title: v.title || DEFAULT_ARTICLE_VIDEOS[num - 1]?.title || `Video ${num}`,
                    videoUrl: v.videoUrl,
                    thumbnailUrl: resolveThumbnail(v.videoUrl, v.thumbnailUrl),
                    platform: v.platform || "Watch Video",
                    duration: v.duration || "0:00",
                  });
                }
              }
            });
          }
        }
      }
    } catch (e) {}

    const activeVideos = Array.from(vMap.values());
    activeVideos.sort((a, b) => a.slotNumber - b.slotNumber);

    if (activeVideos.length > 0) {
      setVideos(activeVideos.slice(0, 3));
    }
  };

  useEffect(() => {
    loadVideos();
    window.addEventListener("wsj_shorts_updated", loadVideos);
    window.addEventListener("wsj_videos_updated", loadVideos);
    window.addEventListener("storage", loadVideos);
    return () => {
      window.removeEventListener("wsj_shorts_updated", loadVideos);
      window.removeEventListener("wsj_videos_updated", loadVideos);
      window.removeEventListener("storage", loadVideos);
    };
  }, []);

  const activeVideo = videos[activeIndex] || videos[0] || DEFAULT_ARTICLE_VIDEOS[0];

  return (
    <div className="w-full select-none pt-8 mt-8 border-t border-dashed border-[#CCCCCC]">
      {/* Title */}
      <h3 className="font-serif font-bold text-xl sm:text-[22px] text-[#111111] leading-tight mb-4">
        Videos
      </h3>

      {/* Main Display Screen: Displays thumbnail with play button; clicking opens video in new tab */}
      <a
        href={activeVideo.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full aspect-[16/9] bg-black rounded-xs overflow-hidden mb-4 group shadow-md text-decoration-none cursor-pointer"
      >
        <img
          src={activeVideo.thumbnailUrl}
          alt={activeVideo.title}
          className={`w-full h-full ${
            isVerticalVideo(activeVideo.videoUrl, activeVideo.platform) ? "object-contain" : "object-cover"
          } bg-black opacity-90 group-hover:scale-105 transition-transform duration-300`}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
          <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Top Left Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white font-mono text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center text-[10px]">▶</span>
          <span className="font-bold tracking-wider uppercase text-[10px]">{activeVideo.platform || "WATCH VIDEO"}</span>
        </div>
      </a>

      {/* 3 Titles Selection Row: Clicking shifts the active video */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {videos.slice(0, 3).map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={item.id + "-" + index}
              onClick={() => {
                setActiveIndex(index);
              }}
              className="cursor-pointer group pt-2 transition-all"
            >
              {/* Active Indicator Top Blue Bar */}
              <div className={`h-[3px] w-full mb-2.5 transition-colors ${isActive ? "bg-[#007cb9]" : "bg-transparent group-hover:bg-gray-300"}`} />

              {/* Title */}
              <h4
                className={`font-sans font-bold text-[13.5px] sm:text-[14px] leading-[1.3] transition-colors line-clamp-3 ${
                  isActive ? "text-[#007cb9]" : "text-[#111111] group-hover:text-[#007cb9]"
                }`}
                style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {item.title}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ArticleVideosSection;
