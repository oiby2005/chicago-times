"use client";

import React, { useState } from "react";
import Link from "next/link";

interface VideoCardItem {
  id: string;
  title: string;
  duration: string;
  slug: string;
  imageUrl: string;
}

const subVideos: VideoCardItem[] = [
  {
    id: "v1",
    title: "Inside the Pacific Wargames Watched by America’s Adversaries",
    duration: "10:22",
    slug: "inside-pacific-wargames",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "v2",
    title: "Can Hamas Really Be Disarmed? Inside the Gaza Peace Deal",
    duration: "4:13",
    slug: "can-hamas-be-disarmed",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "v3",
    title: "How Democratic Socialists Are Shaking Up the Midterms",
    duration: "6:22",
    slug: "democratic-socialists-midterms",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  },
];

export const MainVideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
      <div className="relative w-full aspect-[16/9] bg-black overflow-hidden group mb-4">
        {/* Main Video Background / Poster Image */}
        <img
          src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80"
          alt="Inside the Pacific Wargames Watched by America's Adversaries"
          className="w-full h-full object-cover"
        />

        {/* Top Left: Sound Button Pill */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-white/95 text-black hover:bg-white text-[12px] font-sans font-medium px-3 py-1 rounded-full shadow-md transition-all cursor-pointer"
        >
          <span className="text-[12px]">
            {isMuted ? "🔊 Click for Sound" : "🔇 Mute Sound"}
          </span>
        </button>

        {/* Top Right: WSJ Watermark */}
        <div className="absolute top-3 right-4 z-10 pointer-events-none">
          <span className="font-serif font-bold text-[18px] text-white tracking-widest opacity-90 drop-shadow-md">
            WSJ
          </span>
        </div>

        {/* Bottom Video Controls Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex items-center justify-between text-white text-[12px] font-sans">
          {/* Left Controls: Pause/Play, Volume, Time */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 rounded border border-white/40 bg-black/40 flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                /* Pause Icon */
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                /* Play Icon */
                <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute/Volume Icon */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              {isMuted ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            {/* Time Tracker */}
            <span className="font-mono text-[12px] tracking-tight text-white/90">
              0:00 / 10:22
            </span>
          </div>

          {/* Right Controls: Share, CC, Fullscreen */}
          <div className="flex items-center space-x-3">
            {/* Share Icon */}
            <button className="hover:opacity-80 transition-opacity cursor-pointer">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
            </button>

            {/* CC Icon */}
            <button className="border border-white/60 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer">
              CC
            </button>

            {/* Fullscreen Icon */}
            <button className="hover:opacity-80 transition-opacity cursor-pointer">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Bottom Video Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {subVideos.map((video) => (
          <article key={video.id} className="flex flex-col justify-start">
            {/* Thumbnail with Duration Overlay */}
            <Link
              href={`/article/${video.slug}`}
              className="block relative aspect-[16/9] w-full overflow-hidden bg-gray-100 mb-2 group"
            >
              <img
                src={video.imageUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Duration Badge */}
              <div className="absolute bottom-2 left-2 bg-black/85 text-white font-sans text-[11px] font-bold px-1.5 py-0.5 rounded-xs flex items-center space-x-1">
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{video.duration}</span>
              </div>
            </Link>

            {/* Title */}
            <h4 className="font-serif font-bold text-[15px] sm:text-[16px] leading-[1.2] text-[#111111] hover:underline cursor-pointer">
              <Link prefetch={true} href={`/article/${video.slug}`}>
                {video.title}
              </Link>
            </h4>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MainVideoSection;
