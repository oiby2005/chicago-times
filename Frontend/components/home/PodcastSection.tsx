"use client";

import React, { useState, useEffect } from "react";

export interface PodcastSlot {
  id: string;
  slotNumber: number;
  videoUrl: string;
  platform: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  status: string;
}

const DEFAULT_PODCAST_SLOTS: PodcastSlot[] = [
  {
    id: "podcast_slot_1",
    slotNumber: 1,
    videoUrl: "https://podcasts.apple.com/us/podcast/liv-golfs-%245-billion-path-to-bankruptcy/id1578096201?i=1000789339748",
    platform: "Apple Podcasts",
    title: "LIV Golf’s $5 Billion Path to Bankruptcy",
    thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?fm=webp&fit=crop&w=600&q=80",
    duration: "16:24",
    status: "Active",
  },
  {
    id: "podcast_slot_2",
    slotNumber: 2,
    videoUrl: "https://www.youtube.com/watch?v=rv1",
    platform: "Apple Podcasts",
    title: "The Market Watch: Federal Reserve Rate Strategy & Global Outlook",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?fm=webp&fit=crop&w=600&q=80",
    duration: "18:30",
    status: "Active",
  },
  {
    id: "podcast_slot_3",
    slotNumber: 3,
    videoUrl: "https://podcasts.apple.com/in/podcast/story-of-kandy-temple-jadetimes-talk-travel-episode-01/id1791836245?i=1000685037348&l=kn",
    platform: "Apple Podcasts",
    title: "Story of Kandy Temple | Jadetimes Talk | Travel Episode 01",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fm=webp&fit=crop&w=600&q=80",
    duration: "8:27",
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

interface PodcastSectionProps {
  onActiveCountChange?: (count: number) => void;
}

export const PodcastSection: React.FC<PodcastSectionProps> = ({ onActiveCountChange }) => {
  const [podcasts, setPodcasts] = useState<PodcastSlot[]>(DEFAULT_PODCAST_SLOTS);

  const loadSlots = async () => {
    if (typeof window !== "undefined") {
      const podMap = new Map<number, PodcastSlot>();
      DEFAULT_PODCAST_SLOTS.forEach((d) => podMap.set(d.slotNumber, d));

      try {
        const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.slots)) {
            const allPods = data.slots.filter(
              (v: any) =>
                v.id?.includes("podcast") ||
                v.id?.includes("pod") ||
                (v.subTab || "").toLowerCase() === "podcast"
            );
            // Sort so canonical podcast_slot_ IDs take precedence over legacy ones
            allPods.sort((a: any, b: any) => (a.id?.includes("_slot_") ? 1 : -1));
            allPods.forEach((p: any) => {
              const num = Number(p.slotNumber || 1);
              if (num >= 1 && num <= 3) {
                if ((p.status || "Active").toLowerCase() !== "inactive" && p.videoUrl && p.videoUrl.trim() !== "") {
                  podMap.set(num, { ...p, id: `podcast_slot_${num}` });
                } else if ((p.status || "").toLowerCase() === "inactive" || !p.videoUrl || p.videoUrl.trim() === "") {
                  podMap.delete(num);
                }
              }
            });
          }
        }
      } catch (err) {}

      const saved = localStorage.getItem("wsj_podcast_slots");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((p: PodcastSlot) => {
              const num = Number(p.slotNumber || 1);
              if (num >= 1 && num <= 3) {
                if ((p.status || "Active").toLowerCase() !== "inactive" && p.videoUrl && p.videoUrl.trim() !== "") {
                  podMap.set(num, { ...p, id: `podcast_slot_${num}` });
                } else if ((p.status || "").toLowerCase() === "inactive" || !p.videoUrl || p.videoUrl.trim() === "") {
                  podMap.delete(num);
                }
              }
            });
          }
        } catch (e) {}
      }

      const activePods = Array.from(podMap.values());
      activePods.sort((a, b) => Number(a.slotNumber || 1) - Number(b.slotNumber || 1));
      setPodcasts(activePods);

      if (onActiveCountChange) {
        onActiveCountChange(activePods.length);
      }
    }
  };

  useEffect(() => {
    loadSlots();
    window.addEventListener("wsj_shorts_updated", loadSlots);
    return () => window.removeEventListener("wsj_shorts_updated", loadSlots);
  }, []);

  return (
    <div className="w-full flex flex-col space-y-4">
      {podcasts.map((podcast, idx) => {
        const displayTitle = cleanVideoTitle(podcast.title);
        return (
          <div
            key={podcast.id || `podcast_${idx}`}
            className="w-full font-sans select-none my-0 bg-[#FFFDF7] border border-[#E2DDD0] rounded-none overflow-hidden shadow-xs"
          >
            {/* Top Image Banner */}
            <a
              href={podcast.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full aspect-[4/3] bg-black overflow-hidden group cursor-pointer"
            >
              <img
                src={podcast.thumbnailUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?fm=webp&fit=crop&w=600&q=80"}
                alt={displayTitle}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />

              {/* Top Left: Sound Button Pill */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1 bg-white/95 text-black text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full shadow-xs">
                <span>🎙 Podcast / Audio</span>
              </div>

              {/* Bottom Image Subtitle Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white font-sans text-[11px] leading-tight px-3 py-1.5 text-center truncate">
                Click to Listen in New Tab ↗
              </div>
            </a>

            {/* Content Area */}
            <div className="p-3 bg-[#FFFDF7]">
              {/* Title with Line Clamp 2 */}
              <h4 className="font-sans font-bold text-[14px] leading-snug text-[#111111] mb-3 hover:underline line-clamp-2">
                <a href={podcast.videoUrl} target="_blank" rel="noopener noreferrer" title={displayTitle}>
                  {displayTitle}
                </a>
              </h4>

              {/* Audio Player Control Bar */}
              <div className="flex items-center justify-between pt-1 border-t border-[#e5e0d3]">
                {/* Pause / Play Circular Button */}
                <a
                  href={podcast.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full border border-[#333333] flex items-center justify-center text-[#111111] hover:bg-[#EAE5DB] transition-colors cursor-pointer"
                >
                  <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>

                {/* Time Counter */}
                <span className="font-mono text-[12px] text-[#555555] tracking-tight">
                  ⏱ {podcast.duration}
                </span>

                <a
                  href={podcast.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#b8860b] hover:underline"
                >
                  Listen ↗
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PodcastSection;
