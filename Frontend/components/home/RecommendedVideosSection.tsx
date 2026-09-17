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
      // 1. ALWAYS attempt fresh fetch from backend API first to guarantee sync across browsers/accounts
      try {
        const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.slots)) {
            const rec = data.slots.filter(
              (v: any) =>
                v.status === "Active" &&
                v.videoUrl &&
                (v.id?.includes("recommended") || (v.id?.startsWith("rec") && !v.id?.includes("video")))
            );
            if (rec.length > 0) {
              setVideos(rec);
              localStorage.setItem("wsj_recommended_video_slots", JSON.stringify(rec));
              return;
            }
          }
        }
      } catch (err) {}

      // 2. Fallback to localStorage if offline/API fails
      const saved = localStorage.getItem("wsj_recommended_video_slots");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeOnly = parsed.filter(
              (v: RecommendedVideo) =>
                v.status === "Active" &&
                v.videoUrl &&
                (v.id?.includes("recommended") || (v.id?.startsWith("rec") && !v.id?.includes("video")))
            );
            if (activeOnly.length > 0) {
              setVideos(activeOnly);
              return;
            }
          }
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    loadSlots();
    window.addEventListener("wsj_shorts_updated", loadSlots);
    return () => window.removeEventListener("wsj_shorts_updated", loadSlots);
  }, []);

  return (
    <div className="w-full font-sans select-none pt-4 pb-2 my-0">
      {/* Section Title */}
      <div className="mb-4">
        <h3 className="font-sans font-bold text-[20px] text-[#111111] tracking-tight">
          Recommended Videos
        </h3>
      </div>

      {/* Videos List */}
      <div className="flex flex-col space-y-4">
        {videos.map((video) => {
          const displayTitle = cleanVideoTitle(video.title);
          return (
            <article key={video.id || video.slotNumber} className="flex items-start justify-between gap-3">
              {/* Title with Line Clamp 4 */}
              <h4
                className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.25] text-[#111111] hover:underline cursor-pointer flex-1"
                style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" title={displayTitle}>
                  {displayTitle}
                </a>
              </h4>

            {/* Thumbnail with Play Icon Overlay */}
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[105px] sm:w-[115px] aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0 group"
            >
              <img
                src={video.thumbnailUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=webp&fit=crop&w=400&q=80"}
                alt={video.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                <div className="w-7 h-7 rounded-full bg-black/60 border border-white/80 flex items-center justify-center text-white">
                  <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
          </article>
        );
      })}
      </div>
    </div>
  );
};

export default RecommendedVideosSection;
