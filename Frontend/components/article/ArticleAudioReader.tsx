"use client";

import React, { useState, useEffect } from "react";
import { articleAudioService, AudioPlayerState, cleanTextForProseAudio } from "@/lib/audioService";

interface ArticleAudioReaderProps {
  title?: string;
  deck?: string;
  bodyContent?: string;
  slug?: string;
}

export default function ArticleAudioReader({
  title = "",
  deck = "",
  bodyContent = "",
  slug = "",
}: ArticleAudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listenMins, setListenMins] = useState<number>(2);

  // Extract clean text (excluding image captions/credits) and calculate estimated duration
  useEffect(() => {
    const cleanBody = cleanTextForProseAudio(bodyContent);
    const fullText = `${title}. ${deck}. ${cleanBody}`.trim();
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    // Average listening rate: ~170 words per minute
    const mins = Math.max(1, Math.ceil(wordCount / 170));
    setListenMins(mins);
  }, [title, deck, bodyContent]);

  // Subscribe to audio service state
  useEffect(() => {
    const unsubscribe = articleAudioService.subscribe((state: AudioPlayerState) => {
      const isCurrentArticle = state.title === title.trim();
      setIsPlaying(isCurrentArticle && state.isPlaying);
      setIsPaused(isCurrentArticle && state.isPaused && state.isVisible);
      setIsLoading(isCurrentArticle && state.isLoading);
    });
    return () => {
      unsubscribe();
    };
  }, [title]);

  // Handle Speech playback toggle
  const handleToggleListen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    articleAudioService.togglePlayPause(title, deck, bodyContent, slug);
  };

  return (
    <div className="inline-flex items-center gap-2 pl-3 border-l border-[#CCCCCC] h-5 my-auto ml-1">
      <button
        type="button"
        onClick={handleToggleListen}
        className={`inline-flex items-center gap-1.5 text-[14px] font-sans font-bold transition-all cursor-pointer ${
          isPlaying
            ? "text-[#00558C]"
            : "text-[#0f172a] hover:text-[#00558C] hover:underline"
        }`}
        title={
          isPlaying
            ? "Pause Article Audio Reader"
            : isPaused
            ? "Resume Audio Reader"
            : "Listen to this article"
        }
        aria-label="Listen to Article"
      >
        {/* Headphone SVG Icon with pulse when active */}
        <div className="relative flex items-center justify-center">
          <svg
            className={`w-4 h-4 transition-colors ${
              isPlaying
                ? "text-sky-600 animate-pulse"
                : "text-[#4a5568]"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M3 18v-6a9 9 0 0118 0v6" />
            <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
          </svg>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          )}
        </div>

        <span className="text-[#00558C] font-bold">
          {isPlaying ? "Pause" : isPaused ? "Resume" : "Listen"}
        </span>
        <span className="font-normal text-[#00558C] text-[13.5px] whitespace-nowrap">
          ({listenMins} min)
        </span>
      </button>
    </div>
  );
}
