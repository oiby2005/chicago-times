"use client";

import React, { useState } from "react";

export const PodcastSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="w-full font-sans select-none my-0 bg-[#FFFDF7] border border-[#E2DDD0] rounded-none overflow-hidden shadow-xs">
      {/* Top Image Banner */}
      <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
          alt="Inside the Pacific Wargames Watched by America's Adversaries"
          className="w-full h-full object-cover"
        />

        {/* Top Left: Mute Sound Button Pill */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1 bg-white/95 text-black hover:bg-white text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full shadow-xs cursor-pointer"
        >
          <span>{isMuted ? "🔊 Mute Sound" : "🔇 Sound On"}</span>
        </button>

        {/* Top Right: WSJ Watermark */}
        <div className="absolute top-2.5 right-3 z-10 pointer-events-none">
          <span className="font-serif font-bold text-[16px] text-white tracking-widest opacity-90 drop-shadow-md">
            WSJ
          </span>
        </div>

        {/* Bottom Image Subtitle Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white font-sans text-[11px] leading-tight px-3 py-1.5 text-center truncate">
          we help fill in the gaps in tactics and strategies
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 bg-[#FFFDF7]">
        {/* Title */}
        <h4 className="font-sans font-bold text-[14px] leading-snug text-[#111111] mb-3">
          Inside the Pacific Wargames Watched by America’s Adversaries
        </h4>

        {/* Audio Player Control Bar */}
        <div className="flex items-center justify-between pt-1">
          {/* Pause / Play Circular Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-7 rounded-full border border-[#333333] flex items-center justify-center text-[#111111] hover:bg-[#EAE5DB] transition-colors cursor-pointer"
          >
            {isPlaying ? (
              /* Pause Icon */
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              /* Play Icon */
              <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Time Counter */}
          <span className="font-mono text-[12px] text-[#555555] tracking-tight">
            03:42 / 10:22
          </span>

          {/* Close Icon */}
          <button className="text-[#666666] hover:text-[#111111] transition-colors text-[14px] font-bold cursor-pointer px-1">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodcastSection;
