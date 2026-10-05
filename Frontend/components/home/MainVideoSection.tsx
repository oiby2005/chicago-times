"use client";

import React, { useState, useEffect } from "react";

interface MainVideoSlot {
  id: string;
  slotNumber: number;
  videoUrl: string;
  platform: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  status: string;
}

const DEFAULT_MAIN_VIDEOS_SLOTS: MainVideoSlot[] = [
  {
    id: "main_slot_1",
    slotNumber: 1,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "Youtube Video",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=1200&q=80",
    duration: "10:22",
    status: "Active",
  },
  {
    id: "main_slot_2",
    slotNumber: 2,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "Youtube Video",
    title: "Mortgage Rates Hit 7 Percent: What’s Next for the Housing Market?",
    thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?fm=webp&fit=crop&w=800&q=80",
    duration: "4:15",
    status: "Active",
  },
  {
    id: "main_slot_3",
    slotNumber: 3,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "Youtube Video",
    title: "Can Hamas Really Be Disarmed? Inside the Gaza Peace Deal",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fm=webp&fit=crop&w=600&q=80",
    duration: "4:13",
    status: "Active",
  },
  {
    id: "main_slot_4",
    slotNumber: 4,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "Youtube Video",
    title: "How Democratic Socialists Are Shaking Up the Midterms",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?fm=webp&fit=crop&w=600&q=80",
    duration: "6:22",
    status: "Active",
  },
];

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

function cleanVideoTitle(rawTitle: string): string {
  if (!rawTitle) return "";
  let decoded = decodeHtmlEntities(rawTitle);
  decoded = decoded.replace(/^[0-9.]+[KMB]?\s*(?:views|reactions|likes)[^|]*\|\s*/i, "");
  decoded = decoded.replace(/\s*\|\s*(?:Fox News Video|Facebook Video|Rumble Video)\s*$/i, "");
  return decoded.trim();
}

function isVerticalVideo(url?: string, platform?: string): boolean {
  const str = `${url || ""} ${platform || ""}`.toLowerCase();
  return str.includes("facebook") || str.includes("fb_shorts") || str.includes("instagram") || str.includes("reel");
}

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

export const MainVideoSection: React.FC = () => {
  const [slots, setSlots] = useState<MainVideoSlot[]>(DEFAULT_MAIN_VIDEOS_SLOTS);

  const loadSlots = async () => {
    if (typeof window === "undefined") return;

    const vMap = new Map<number, MainVideoSlot>();
    DEFAULT_MAIN_VIDEOS_SLOTS.forEach((d) => vMap.set(d.slotNumber, d));

    try {
      const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const slotsArray = data.slots || data.shorts || [];
        if (Array.isArray(slotsArray)) {
          slotsArray.forEach((v: any) => {
            const num = Number(v.slotNumber || 1);
            if (num >= 1 && num <= 4) {
              if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                vMap.set(num, {
                  id: `video_slot_${num}`,
                  slotNumber: num,
                  title: v.title || DEFAULT_MAIN_VIDEOS_SLOTS[num - 1]?.title || `Video ${num}`,
                  videoUrl: v.videoUrl,
                  thumbnailUrl: resolveThumbnail(v.videoUrl, v.thumbnailUrl),
                  platform: v.platform || "Watch Video",
                  duration: v.duration || "0:00",
                  status: v.status || "Active",
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
              if (num >= 1 && num <= 4) {
                if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                  vMap.set(num, {
                    id: `video_slot_${num}`,
                    slotNumber: num,
                    title: v.title || DEFAULT_MAIN_VIDEOS_SLOTS[num - 1]?.title || `Video ${num}`,
                    videoUrl: v.videoUrl,
                    thumbnailUrl: resolveThumbnail(v.videoUrl, v.thumbnailUrl),
                    platform: v.platform || "Watch Video",
                    duration: v.duration || "0:00",
                    status: v.status || "Active",
                  });
                }
              }
            });
          }
        }
      }
    } catch (e) {}

    const activeVideos = Array.from(vMap.values());
    activeVideos.sort((a, b) => Number(a.slotNumber || 1) - Number(b.slotNumber || 1));
    if (activeVideos.length > 0) {
      setSlots(activeVideos);
    }
  };

  useEffect(() => {
    loadSlots();
    window.addEventListener("wsj_shorts_updated", loadSlots);
    window.addEventListener("wsj_videos_updated", loadSlots);
    window.addEventListener("storage", loadSlots);
    return () => {
      window.removeEventListener("wsj_shorts_updated", loadSlots);
      window.removeEventListener("wsj_videos_updated", loadSlots);
      window.removeEventListener("storage", loadSlots);
    };
  }, []);

  if (!slots || slots.length === 0) return null;

  const slot1 = slots.find((s) => s.slotNumber === 1) || slots[0] || DEFAULT_MAIN_VIDEOS_SLOTS[0];
  const subSlots = [2, 3, 4].map((num) => slots.find((s) => s.slotNumber === num)).filter(Boolean) as MainVideoSlot[];
  const slot1Title = cleanVideoTitle(slot1.title);

  return (
    <div className="w-full font-sans select-none pt-2 pb-4">
      {/* Section Header: Videos */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashed border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          Videos
        </h2>
      </div>

      {/* Slot 1: Main Widescreen Featured Video Player Card - Clicking opens link in new tab */}
      <a
        href={slot1.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full aspect-[16/9] bg-black overflow-hidden group mb-4 shadow-md rounded-xs text-decoration-none cursor-pointer"
      >
        <img
          src={slot1.thumbnailUrl || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=1200&q=80"}
          alt={slot1Title}
          className={`w-full h-full ${
            isVerticalVideo(slot1.videoUrl, slot1.platform) ? "object-contain" : "object-cover"
          } bg-black opacity-90 group-hover:scale-105 transition-transform duration-300`}
        />

        {/* Play Icon Center */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Top Left: Sound/Platform Pill */}
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-white/95 text-black text-[12px] font-sans font-medium px-3 py-1 rounded-full shadow-md">
          <span className="text-[12px]">
            🔊 {slot1.platform || "Watch Video"}
          </span>
        </div>

        {/* Bottom Video Title & Duration Controls Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-12 pb-3.5 px-3.5 flex flex-col justify-end text-white text-[12px] font-sans z-10">
          <h3
            className="font-serif font-bold text-[18px] sm:text-[20px] text-white leading-tight mb-2 drop-shadow-md group-hover:underline"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {slot1Title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[12px] text-white/90">
                ⏱ {slot1.duration}
              </span>
            </div>
            <span className="text-[11px] font-mono uppercase bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded text-white font-bold">
              Watch Video ↗
            </span>
          </div>
        </div>
      </a>

      {/* Slots 2-4: 3 Sub-Video Cards Row below slot 1 - Clicking opens link in new tab */}
      {subSlots.length > 0 && (
        <div className={`grid grid-cols-1 ${
          subSlots.length === 1 ? "md:grid-cols-1" : subSlots.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
        } gap-4 pt-5 mt-2`}>
          {subSlots.map((video) => {
            const subTitle = cleanVideoTitle(video.title);

            return (
              <a
                key={video.id || video.slotNumber}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-start group cursor-pointer text-decoration-none"
              >
                <div className="block relative aspect-[16/9] w-full overflow-hidden bg-black mb-2 rounded-xs shadow-xs flex items-center justify-center">
                  <img
                    src={video.thumbnailUrl || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=600&q=80"}
                    alt={subTitle}
                    className={`w-full h-full ${
                      isVerticalVideo(video.videoUrl, video.platform) ? "object-contain" : "object-cover"
                    } bg-black group-hover:scale-105 transition-transform duration-300`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/85 text-white font-sans text-[11px] font-bold px-1.5 py-0.5 rounded-xs flex items-center space-x-1 z-10">
                    <span>⏱ {video.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h4
                  className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] group-hover:underline"
                  style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {subTitle}
                </h4>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MainVideoSection;

