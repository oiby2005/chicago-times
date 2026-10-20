"use client";

import React, { useState, useEffect } from "react";

interface RecommendedVideo {
  id: string;
  slotNumber: number;
  videoUrl: string;
  platform: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  status: string;
}

const DEFAULT_RECOMMENDED_SLOTS: RecommendedVideo[] = [
  {
    id: "rec_slot_1",
    slotNumber: 1,
    videoUrl: "https://www.youtube.com/watch?v=rv1",
    platform: "Youtube Video",
    title: "Pizza Hut Lost in the U.S. Now It’s Selling for $2.7B.",
    thumbnailUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=webp&fit=crop&w=400&q=80",
    duration: "0:45",
    status: "Active",
  },
  {
    id: "rec_slot_2",
    slotNumber: 2,
    videoUrl: "https://www.youtube.com/watch?v=rv2",
    platform: "Youtube Video",
    title: "How One Family’s Flower Farm Became Essential to Chanel No. 5",
    thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?fm=webp&fit=crop&w=400&q=80",
    duration: "0:58",
    status: "Active",
  },
  {
    id: "rec_slot_3",
    slotNumber: 3,
    videoUrl: "https://www.youtube.com/watch?v=rv3",
    platform: "Youtube Video",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?fm=webp&fit=crop&w=400&q=80",
    duration: "1:15",
    status: "Active",
  },
  {
    id: "rec_slot_4",
    slotNumber: 4,
    videoUrl: "https://www.youtube.com/watch?v=rv4",
    platform: "Youtube Video",
    title: "WSJ Opinion: Hits and Misses",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?fm=webp&fit=crop&w=400&q=80",
    duration: "0:50",
    status: "Active",
  },
  {
    id: "rec_slot_5",
    slotNumber: 5,
    videoUrl: "https://www.youtube.com/watch?v=rv5",
    platform: "Youtube Video",
    title: "The Evolution of Modern Motorsports",
    thumbnailUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?fm=webp&fit=crop&w=400&q=80",
    duration: "1:05",
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

export const RecommendedVideosSection: React.FC = () => {
  const [videos, setVideos] = useState<RecommendedVideo[]>(DEFAULT_RECOMMENDED_SLOTS);

  const loadSlots = async () => {
    if (typeof window !== "undefined") {
      const recMap = new Map<number, RecommendedVideo>();
      DEFAULT_RECOMMENDED_SLOTS.forEach((d) => recMap.set(d.slotNumber, d));

      try {
        const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.slots)) {
            const rec = data.slots.filter(
              (v: any) =>
                v.id?.includes("recommended") ||
                (v.id?.startsWith("rec") && !v.id?.includes("video")) ||
                (v.subTab || "").toUpperCase() === "RECOMMENDED"
            );
            rec.forEach((v: any) => {
              const num = Number(v.slotNumber || 1);
              if (num >= 1 && num <= 5) {
                if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                  recMap.set(num, { ...v, slotNumber: num, id: `recommended_slot_${num}` });
                } else if ((v.status || "").toLowerCase() === "inactive" || !v.videoUrl || v.videoUrl.trim() === "") {
                  recMap.delete(num);
                }
              }
            });
          }
        }
      } catch (err) {}

      const saved = localStorage.getItem("wsj_recommended_video_slots");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((v: RecommendedVideo) => {
              const num = Number(v.slotNumber || 1);
              if (num >= 1 && num <= 5) {
                if ((v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl && v.videoUrl.trim() !== "") {
                  recMap.set(num, { ...v, slotNumber: num, id: `recommended_slot_${num}` });
                } else if ((v.status || "").toLowerCase() === "inactive" || !v.videoUrl || v.videoUrl.trim() === "") {
                  recMap.delete(num);
                }
              }
            });
          }
        } catch (e) {}
      }

      const activeVideos = Array.from(recMap.values());
      activeVideos.sort((a, b) => Number(a.slotNumber || 1) - Number(b.slotNumber || 1));
      setVideos(activeVideos);
    }
  };

  useEffect(() => {
    loadSlots();
    window.addEventListener("wsj_shorts_updated", loadSlots);
    return () => window.removeEventListener("wsj_shorts_updated", loadSlots);
  }, []);

  return (
    <div className="w-full font-sans pt-0 pb-2 my-0">
      {/* Section Title */}
      <div className="mb-4">
        <h3 className="font-sans font-bold text-[20px] text-[#111111] tracking-tight">
          Recommended Videos
        </h3>
        <div className="block md:hidden border-b border-dashed border-[#CCCCCC] my-3.5" />
      </div>

      {/* Videos List */}
      <div className="divide-y divide-dashed divide-[#CCCCCC]">
        {videos.map((video, idx) => {
          const displayTitle = cleanVideoTitle(video.title);
          const pLower = (video.platform || "").toLowerCase();
          const uLower = (video.videoUrl || "").toLowerCase();

          const isShortOrReel =
            pLower.includes("instagram") ||
            pLower.includes("facebook") ||
            pLower.includes("short") ||
            pLower.includes("reel") ||
            uLower.includes("instagram.com") ||
            uLower.includes("facebook.com") ||
            uLower.includes("fb.watch") ||
            uLower.includes("/shorts/") ||
            uLower.includes("/reel/");

          return (
            <article 
              key={video.id || video.slotNumber} 
              className={`flex items-start justify-between gap-3 ${idx === 0 ? "pb-[24px]" : idx === videos.length - 1 ? "pt-[24px]" : "py-[24px]"}`}
            >
              {/* Thumbnail with Play Icon Overlay - Left on mobile, Right on md+ */}
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="order-1 md:order-2 relative w-[130px] sm:w-[140px] md:w-[105px] aspect-[16/10] overflow-hidden bg-black flex-shrink-0 group"
              >
                <img
                  src={video.thumbnailUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=webp&fit=crop&w=400&q=80"}
                  alt={video.title}
                  className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${
                    isShortOrReel ? "object-contain bg-black" : "object-cover object-center"
                  }`}
                />
                {/* White triangle play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  <svg className="w-5 h-5 text-white fill-current group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>

              {/* Title with Line Clamp 4 - Right on mobile, Left on md+ */}
              <h4
                className="order-2 md:order-1 font-poppins font-medium text-[16px] sm:text-[16px] md:text-[14px] leading-snug text-[#111111] hover:underline cursor-pointer flex-1"
                style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" title={displayTitle}>
                  {displayTitle}
                </a>
              </h4>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedVideosSection;
