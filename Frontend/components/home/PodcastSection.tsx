"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export interface PodcastSlot {
  id: string;
  slotNumber: number;
  videoUrl: string;
  platform: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  status: string;
  audioUrl?: string;
}

const DEFAULT_PODCAST_SLOTS: PodcastSlot[] = [
  {
    id: "podcast_slot_1",
    slotNumber: 1,
    videoUrl: "https://podcasts.apple.com/us/podcast/cruel-summer%3A-the-violent-death-of-tiffany-valiante/id6801170249",
    platform: "Apple Podcasts",
    title: "Cruel Summer: The Violent Death of Tiffany Valiante",
    thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?fm=webp&fit=crop&w=600&q=80",
    duration: "40:34",
    status: "Active",
    audioUrl: "",
  },
  {
    id: "podcast_slot_2",
    slotNumber: 2,
    videoUrl: "https://podcasts.apple.com/in/podcast/love-trapped/id1878220033",
    platform: "Apple Podcasts",
    title: "Love Trapped",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?fm=webp&fit=crop&w=600&q=80",
    duration: "43:53",
    status: "Active",
    audioUrl: "",
  },
  {
    id: "podcast_slot_3",
    slotNumber: 3,
    videoUrl: "https://podcasts.apple.com/us/podcast/in-the-dark/id1148175292",
    platform: "Apple Podcasts",
    title: "In The Dark",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fm=webp&fit=crop&w=600&q=80",
    duration: "59:19",
    status: "Active",
    audioUrl: "",
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

function formatTime(secs: number): string {
  if (isNaN(secs) || secs <= 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function parseDurationStrToSeconds(durStr: string): number {
  if (!durStr) return 45;
  const parts = durStr.split(":").map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 45;
}

function getPlayableAudioUrl(podcast: PodcastSlot): string {
  if (podcast.audioUrl && podcast.audioUrl.trim() !== "") {
    return podcast.audioUrl.trim();
  }

  const url = (podcast.videoUrl || "").toLowerCase();
  const title = (podcast.title || "").toLowerCase();

  // John Cena's Journey
  if (url.includes("1000705047737") || title.includes("john cena")) {
    return "https://anchor.fm/s/100266d20/podcast/play/101815952/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-3-26%2F0d6c3972-102b-b16b-6391-583282436d59.mp3";
  }

  // In The Dark
  if (url.includes("1148175292") || title.includes("in the dark")) {
    return "https://www.podtrac.com/pts/redirect.mp3/traffic.megaphone.fm/CNE4748766181.mp3";
  }

  // Smart Ways to Regulate Energy
  if (url.includes("1000702397718") || title.includes("regulate your energy") || title.includes("smart ways")) {
    return "https://anchor.fm/s/100266d20/podcast/play/101267448/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-3-14%2Fe9de55ba-e97a-386c-fa47-d62543e40a70.mp3";
  }

  // Story of Kandy Temple
  if (url.includes("1000685037348") || title.includes("kandy temple") || title.includes("story of kandy")) {
    return "https://anchor.fm/s/100266d20/podcast/play/104124395/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-5-14%2Fe9de55ba-e97a-386c-fa47-d62543e40a70.mp3";
  }

  // Love Trapped
  if (url.includes("1878220033") || title.includes("love trapped")) {
    return "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2025-5-14/e9de55ba-e97a-386c-fa47-d62543e40a70.mp3";
  }

  // Direct audio file links (.mp3, .m4a, .wav)
  if (url.endsWith(".mp3") || url.endsWith(".m4a") || url.endsWith(".wav") || url.endsWith(".aac")) {
    return podcast.videoUrl;
  }

  return "";
}

interface PodcastSectionProps {
  onActiveCountChange?: (count: number) => void;
}

export const PodcastSection: React.FC<PodcastSectionProps> = ({ onActiveCountChange }) => {
  const [podcasts, setPodcasts] = useState<PodcastSlot[]>(DEFAULT_PODCAST_SLOTS);
  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);
  const [activeVideoPodId, setActiveVideoPodId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|music\.youtube\.com\/watch\?v=)([\w-]{11})/i);
    return match ? match[1] : null;
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingPodcastId(null);
    setCurrentTime(0);
    setDurationSec(0);
  };

  // Automatically stop audio playback on page navigation
  useEffect(() => {
    stopCurrentAudio();
    setActiveVideoPodId(null);
  }, [pathname]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  const loadSlots = async () => {
    if (typeof window !== "undefined") {
      const podMap = new Map<number, PodcastSlot>();
      DEFAULT_PODCAST_SLOTS.forEach((d) => podMap.set(d.slotNumber, d));

      let loadedFromDb = false;
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
            allPods.sort((a: any, b: any) => (a.id?.includes("_slot_") ? 1 : -1));
            allPods.forEach((p: any) => {
              const num = Number(p.slotNumber || 1);
              if (num >= 1 && num <= 3) {
                if ((p.status || "Active").toLowerCase() !== "inactive" && p.videoUrl && p.videoUrl.trim() !== "") {
                  podMap.set(num, { ...p, id: `podcast_slot_${num}` });
                } else if ((p.status || "").toLowerCase() === "inactive" || !p.videoUrl || p.videoUrl.trim() !== "") {
                  podMap.delete(num);
                }
              }
            });
            loadedFromDb = true;
          }
        }
      } catch (err) {}

      if (!loadedFromDb) {
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
                  } else if ((p.status || "").toLowerCase() === "inactive" || !p.videoUrl || p.videoUrl.trim() !== "") {
                    podMap.delete(num);
                  }
                }
              });
            }
          } catch (e) {}
        }
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
    window.addEventListener("wsj_shorts_data_updated", loadSlots);
    window.addEventListener("storage", loadSlots);
    window.addEventListener("focus", loadSlots);
    return () => {
      window.removeEventListener("wsj_shorts_updated", loadSlots);
      window.removeEventListener("wsj_shorts_data_updated", loadSlots);
      window.removeEventListener("storage", loadSlots);
      window.removeEventListener("focus", loadSlots);
    };
  }, []);

  const togglePlay = (podcast: PodcastSlot) => {
    const podId = podcast.id || `podcast_${podcast.slotNumber}`;
    const audioUrl = getPlayableAudioUrl(podcast);
    const ytId = extractYoutubeId(podcast.videoUrl || "");

    // If audio stream is missing/empty and it's a YouTube link, activate inline YouTube Video Player!
    if (!audioUrl && ytId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingPodcastId(null);
      setActiveVideoPodId(activeVideoPodId === podId ? null : podId);
      return;
    }

    if (playingPodcastId === podId) {
      // Toggle play/pause for currently playing podcast
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      // Start playing new podcast audio FROM THE BEGINNING (0:00)
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setActiveVideoPodId(null);

      const audio = new Audio(audioUrl);
      audio.currentTime = 0; // Explicitly start from the beginning
      audioRef.current = audio;

      setCurrentTime(0);
      setDurationSec(0);

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration)) {
          setDurationSec(audio.duration);
        }
      };

      audio.onended = () => {
        setPlayingPodcastId(null);
        setCurrentTime(0);
      };

      audio.play().catch((err) => console.warn("Audio play notice:", err));
      setPlayingPodcastId(podId);
    }
  };

  const handleSeek = (podcast: PodcastSlot, newDisplayTime: number) => {
    const podId = podcast.id || `podcast_${podcast.slotNumber}`;
    const slotDurationSec = parseDurationStrToSeconds(podcast.duration);
    const actualStreamDuration = durationSec > 0 ? durationSec : slotDurationSec;
    const cardDurationSec = slotDurationSec > 0 ? slotDurationSec : actualStreamDuration;

    const ratio = cardDurationSec > 0 ? newDisplayTime / cardDurationSec : 0;
    const targetAudioTime = ratio * actualStreamDuration;

    if (playingPodcastId === podId && audioRef.current) {
      audioRef.current.currentTime = targetAudioTime;
      setCurrentTime(targetAudioTime);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setActiveVideoPodId(null);
      const audioUrl = getPlayableAudioUrl(podcast);
      const audio = new Audio(audioUrl);
      audio.currentTime = targetAudioTime;
      audioRef.current = audio;

      setCurrentTime(targetAudioTime);

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration)) {
          setDurationSec(audio.duration);
        }
      };

      audio.onended = () => {
        setPlayingPodcastId(null);
        setCurrentTime(0);
      };

      audio.play().catch(() => {});
      setPlayingPodcastId(podId);
    }
  };

  const restartSong = (podcast: PodcastSlot, e: React.MouseEvent) => {
    e.stopPropagation();
    const podId = podcast.id || `podcast_${podcast.slotNumber}`;
    if (playingPodcastId === podId && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch(() => {});
    } else {
      togglePlay(podcast);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {podcasts.map((podcast, idx) => {
        const podId = podcast.id || `podcast_${idx}`;
        const isPlaying = playingPodcastId === podId && audioRef.current && !audioRef.current.paused;
        const displayTitle = cleanVideoTitle(podcast.title);
        const ytId = extractYoutubeId(podcast.videoUrl || "");
        const isVideoActive = activeVideoPodId === podId && Boolean(ytId);

        const slotDurationSec = parseDurationStrToSeconds(podcast.duration);
        const actualStreamDuration = playingPodcastId === podId && durationSec > 0 ? durationSec : slotDurationSec;
        const cardDurationSec = slotDurationSec > 0 ? slotDurationSec : actualStreamDuration;

        let cardCurrentTime = 0;
        let progressPercent = 0;

        if (playingPodcastId === podId && actualStreamDuration > 0) {
          const ratio = Math.min(1, Math.max(0, currentTime / actualStreamDuration));
          cardCurrentTime = ratio * cardDurationSec;
          progressPercent = ratio * 100;
        }

        return (
          <div
            key={podId}
            className="w-full font-sans select-none my-0 bg-[#FFFDF7] border border-[#E2DDD0] rounded-none overflow-hidden shadow-xs"
          >
            {/* Top Image Banner or Embedded YouTube Player */}
            {isVideoActive ? (
              <div className="relative w-full aspect-[4/3] bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                  title={displayTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideoPodId(null);
                  }}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white text-[11px] font-sans px-2.5 py-1 rounded-full z-20 shadow-md flex items-center space-x-1 cursor-pointer"
                >
                  <span>✕ Close Video</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => togglePlay(podcast)}
                className="block relative w-full aspect-[4/3] bg-black overflow-hidden group cursor-pointer"
              >
                <img
                  src={podcast.thumbnailUrl || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?fm=webp&fit=crop&w=600&q=80"}
                  alt={displayTitle}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Left: Platform Pill */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1 bg-white/95 text-black text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full shadow-xs">
                  <span>🎙 {podcast.platform || "Podcast"}</span>
                </div>

                {/* Bottom Image Subtitle Bar */}
                <div
                  className={`absolute bottom-0 inset-x-0 font-sans text-[11px] leading-tight px-3 py-1.5 text-center truncate flex items-center justify-center space-x-1.5 transition-colors ${
                    isPlaying ? "bg-black/90 text-green-400 font-bold" : "bg-black/80 text-white"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping" />
                      <span>🔊 Playing Sound... Click to Pause</span>
                    </>
                  ) : ytId && !podcast.audioUrl ? (
                    <span>🎬 Click to Watch & Listen Video</span>
                  ) : (
                    <span>▶ Click to Listen</span>
                  )}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="p-3 bg-[#FFFDF7] space-y-2.5">
              {/* Title */}
              <h4 className="font-sans font-bold text-[14px] leading-snug text-[#111111] hover:underline line-clamp-2">
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => togglePlay(podcast)}
                  className="text-left cursor-pointer hover:underline"
                  title={displayTitle}
                >
                  {displayTitle}
                </button>
              </h4>

              {/* Audio Player Line Controls Container */}
              <div className="pt-2 border-t border-[#e5e0d3] flex flex-col space-y-2">
                {/* Control Row: Play/Pause, Restart, Time Display, Source / Watch Video */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Play/Pause Button */}
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={() => togglePlay(podcast)}
                      className="text-[#111111] hover:text-black transition-colors cursor-pointer focus:outline-none p-1"
                      title={isPlaying ? "Pause Sound" : isVideoActive ? "Close Video" : "Play Sound / Video"}
                    >
                      {isPlaying ? (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Restart Button */}
                    <button
                      suppressHydrationWarning
                      type="button"
                      onClick={(e) => restartSong(podcast, e)}
                      className="w-7 h-7 rounded-full bg-[#EAE5DB] text-[#333333] hover:bg-[#D8D2C4] flex items-center justify-center text-xs cursor-pointer"
                      title="Restart from Beginning (0:00)"
                    >
                      ↺
                    </button>

                    {/* Elapsed / Total Time Display */}
                    <span className="font-mono text-[12px] text-[#444444] font-medium tracking-tight" suppressHydrationWarning>
                      {formatTime(cardCurrentTime)} / {formatTime(cardDurationSec)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {ytId && (
                      <button
                        suppressHydrationWarning
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current = null;
                            setPlayingPodcastId(null);
                          }
                          setActiveVideoPodId(activeVideoPodId === podId ? null : podId);
                        }}
                        className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                        title="Toggle Inline YouTube Video Player"
                      >
                        {isVideoActive ? "Close Video ✕" : "🎬 Watch Video"}
                      </button>
                    )}

                    <a
                      href={podcast.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#b8860b] hover:underline"
                      title="Open original link in new tab"
                    >
                      Source ↗
                    </a>
                  </div>
                </div>

                {/* Progress Line / Scrub Bar */}
                <div className="relative w-full h-2 bg-[#E2DDD0] rounded-full overflow-hidden cursor-pointer group">
                  {/* Filled Progress Segment */}
                  <div
                    className="absolute top-0 left-0 h-full bg-[#b8860b] transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {/* Interactive Scrub Range Input */}
                  <input
                    type="range"
                    min={0}
                    max={cardDurationSec || 100}
                    step={0.1}
                    value={cardCurrentTime}
                    onChange={(e) => handleSeek(podcast, parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Drag or click to scrub audio line"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PodcastSection;
