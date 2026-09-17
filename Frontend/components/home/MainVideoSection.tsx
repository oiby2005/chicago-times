"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
    videoUrl: "https://www.youtube.com/watch?v=main1",
    platform: "Youtube Video",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=1200&q=80",
    duration: "10:22",
    status: "Active",
  },
  {
    id: "main_slot_2",
    slotNumber: 2,
    videoUrl: "https://www.youtube.com/watch?v=main2",
    platform: "Youtube Video",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=600&q=80",
    duration: "10:22",
    status: "Active",
  },
  {
    id: "main_slot_3",
    slotNumber: 3,
    videoUrl: "https://www.youtube.com/watch?v=main3",
    platform: "Youtube Video",
    title: "Can Hamas Really Be Disarmed? Inside the Gaza Peace Deal",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fm=webp&fit=crop&w=600&q=80",
    duration: "4:13",
    status: "Active",
  },
  {
    id: "main_slot_4",
    slotNumber: 4,
    videoUrl: "https://www.youtube.com/watch?v=main4",
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

export const MainVideoSection: React.FC = () => {
  const [slots, setSlots] = useState<MainVideoSlot[]>(DEFAULT_MAIN_VIDEOS_SLOTS);

  const loadSlots = async () => {
    if (typeof window !== "undefined") {
      const vMap = new Map<number, MainVideoSlot>();
      DEFAULT_MAIN_VIDEOS_SLOTS.forEach((d) => vMap.set(d.slotNumber, d));

      try {
        const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.slots)) {
            const allVideos = data.slots.filter(
              (v: any) =>
                v.id?.includes("video") ||
                v.id?.includes("main") ||
                (v.subTab || "").toLowerCase() === "videos"
            );
            allVideos.sort((a: any, b: any) => (a.id?.includes("_slot_") ? 1 : -1));
            allVideos.forEach((v: any) => {
              const num = Number(v.slotNumber || 1);
              if (num >= 1 && num <= 4) {
                if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                  vMap.set(num, { ...v, id: `video_slot_${num}` });
                } else if ((v.status || "").toLowerCase() === "inactive" || !v.videoUrl || v.videoUrl.trim() === "") {
                  vMap.delete(num);
                }
              }
            });
          }
        }
      } catch (err) {}

      const saved = localStorage.getItem("wsj_main_video_slots");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((v: MainVideoSlot) => {
              const num = Number(v.slotNumber || 1);
              if (num >= 1 && num <= 4) {
                if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                  vMap.set(num, { ...v, id: `video_slot_${num}` });
                } else if ((v.status || "").toLowerCase() === "inactive" || !v.videoUrl || v.videoUrl.trim() === "") {
                  vMap.delete(num);
                }
              }
            });
          }
        } catch (e) {}
      }

      const activeVideos = Array.from(vMap.values());
      activeVideos.sort((a, b) => Number(a.slotNumber || 1) - Number(b.slotNumber || 1));
      setSlots(activeVideos);
    }
  };

  useEffect(() => {
    loadSlots();
    window.addEventListener("wsj_shorts_updated", loadSlots);
    return () => window.removeEventListener("wsj_shorts_updated", loadSlots);
  }, []);

  if (!slots || slots.length === 0) return null;

  const featured = slots[0];
  const subVideos = slots.slice(1, 4);
  const featuredTitle = cleanVideoTitle(featured.title);

  return (
    <div className="w-full font-sans select-none pt-2 pb-4">
      {/* Section Header: Videos | View All */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#CCCCCC]">
        <h2 className="font-serif font-bold text-[24px] sm:text-[28px] text-[#111111] tracking-tight">
          Videos
        </h2>
        <Link
          href="/videos"
          className="font-sans font-medium text-[13px] text-[#111111] underline hover:no-underline"
        >
          View All
        </Link>
      </div>

      {/* Main Widescreen Featured Video Player */}
      <a
        href={featured.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full aspect-[16/9] bg-black overflow-hidden group mb-4 cursor-pointer"
      >
        {/* Main Video Background / Poster Image */}
        <img
          src={featured.thumbnailUrl || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=1200&q=80"}
          alt={featuredTitle}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Left: Sound Button Pill */}
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-white/95 text-black text-[12px] font-sans font-medium px-3 py-1 rounded-full shadow-md">
          <span className="text-[12px]">
            🔊 {featured.platform || "Watch Video"}
          </span>
        </div>



        {/* Bottom Video Controls Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 flex flex-col justify-end text-white text-[12px] font-sans">
          <h3
            className="font-serif font-bold text-[18px] sm:text-[20px] text-white leading-tight mb-2 drop-shadow-md group-hover:underline"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {featuredTitle}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full border border-white/80 bg-black/60 flex items-center justify-center text-white">
                <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-mono text-[12px] text-white/90">
                ⏱ {featured.duration}
              </span>
            </div>
            <span className="text-[11px] font-mono uppercase bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded text-white font-bold">
              Watch on {featured.platform?.replace(" Video", "").replace(" Short", "").replace(" shorts", "") || "External"} ↗
            </span>
          </div>
        </div>
      </a>

      {/* Dynamic Bottom Video Cards Row based on active sub-videos */}
      {subVideos.length > 0 && (
        <div className={`grid grid-cols-1 ${
          subVideos.length === 1 ? "md:grid-cols-1" : subVideos.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
        } gap-4 pt-1`}>
          {subVideos.map((video) => {
            const subTitle = cleanVideoTitle(video.title);
            return (
              <article key={video.id || video.slotNumber} className="flex flex-col justify-start">
                {/* Thumbnail with Duration Overlay */}
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-[16/9] w-full overflow-hidden bg-gray-100 mb-2 group"
                >
                  <img
                    src={video.thumbnailUrl || "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=600&q=80"}
                    alt={subTitle}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/85 text-white font-sans text-[11px] font-bold px-1.5 py-0.5 rounded-xs flex items-center space-x-1">
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>{video.duration}</span>
                  </div>
                </a>

                {/* Title with Line Clamp 4 */}
                <h4
                  className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer"
                  style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" title={subTitle}>
                    {subTitle}
                  </a>
                </h4>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MainVideoSection;
