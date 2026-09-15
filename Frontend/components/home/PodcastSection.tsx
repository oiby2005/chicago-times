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

const DEFAULT_PODCAST_SLOT: PodcastSlot = {
  id: "podcast_1",
  slotNumber: 1,
  videoUrl: "https://www.wsj.com/podcasts/the-journal",
  platform: "Youtube Video",
  title: "The Journal: Daily Economic & Financial Deep Dive Podcast",
  thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?fm=webp&fit=crop&w=600&q=80",
  duration: "24:15",
  status: "Active",
};

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
  const [podcasts, setPodcasts] = useState<PodcastSlot[]>([DEFAULT_PODCAST_SLOT]);

  const loadSlots = async () => {
    let activePods: PodcastSlot[] = [];

    if (typeof window !== "undefined") {
      // 1. ALWAYS attempt fresh fetch from backend API first
      try {
        const res = await fetch("http://localhost:5000/api/shorts", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.slots)) {
            const allPods = data.slots.filter(
              (v: any) => (v.id?.includes("podcast") || v.id?.includes("pod") || v.subTab === "podcast")
            );
            activePods = allPods.filter(
              (v: any) => (v.status || "Active").toLowerCase() !== "inactive" && v.videoUrl
            );
          }
        }
      } catch (err) {}

      // 2. Fallback to localStorage if offline or empty backend response
      if (activePods.length === 0) {
        const saved = localStorage.getItem("wsj_podcast_slots");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              activePods = parsed.filter(
                (p: PodcastSlot) => (p.status || "Active").toLowerCase() !== "inactive" && p.videoUrl && (p.id?.includes("podcast") || p.id?.includes("pod") || (p as any).subTab === "podcast")
              );
            }
          } catch (e) {}
        }
      }

      if (activePods.length === 0) {
        activePods = [DEFAULT_PODCAST_SLOT];
      }

      // Sort by slotNumber ASC
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
