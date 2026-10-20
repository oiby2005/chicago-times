"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { articleAudioService, AudioPlayerState } from "@/lib/audioService";

export default function FloatingAudioPlayer() {
  const pathname = usePathname();

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    isVisible: false,
    title: "",
    slug: "",
    currentSeconds: 0,
    totalSeconds: 0,
    progressPercent: 0,
  });

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Subscribe to audio service updates
  useEffect(() => {
    const unsubscribe = articleAudioService.subscribe((newState) => {
      setState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Reset minimized mode when audio player is stopped or closed
  useEffect(() => {
    if (!state.isVisible) {
      setIsMinimized(false);
    }
  }, [state.isVisible]);

  // Keyboard shortcut listener (Esc = Close)
  useEffect(() => {
    if (!state.isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key === "Escape") {
        articleAudioService.stop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.isVisible]);

  if (!state.isVisible) return null;

  // Minimized Mode: Render a sleek, compact floating circular play/audio icon
  if (isMinimized) {
    return (
      <aside
        role="region"
        aria-label="Minimized Audio Player"
        className="tc-audio-player fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 animate-in zoom-in-75 fade-in"
      >
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-br from-[#00558C] via-[#004e80] to-[#003c66] hover:from-[#0066a8] hover:to-[#004d80] text-white rounded-full shadow-[0_8px_24px_rgba(0,85,140,0.40)] hover:shadow-[0_10px_28px_rgba(0,85,140,0.52)] border-2 border-white transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title="Click to expand Audio Player"
          aria-label="Expand Audio Player"
        >
          {/* Animated pulse halo when playing */}
          {state.isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-[#00558C] opacity-40 animate-ping pointer-events-none" />
          )}

          {/* Equalizer animation or Play icon */}
          {state.isLoading ? (
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : state.isPlaying ? (
            <div className="flex items-end gap-[2px] h-4 justify-center">
              <span className="w-[2.5px] bg-white rounded-full h-4 animate-[bounce_0.8s_infinite_ease-in-out]" />
              <span className="w-[2.5px] bg-white rounded-full h-2.5 animate-[bounce_0.6s_infinite_ease-in-out_0.2s]" />
              <span className="w-[2.5px] bg-white rounded-full h-3.5 animate-[bounce_0.7s_infinite_ease-in-out_0.4s]" />
              <span className="w-[2.5px] bg-white rounded-full h-2 animate-[bounce_0.65s_infinite_ease-in-out_0.1s]" />
            </div>
          ) : (
            <svg className="w-5 h-5 fill-current ml-0.5 text-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}

          {/* Mini expand badge pill on top right */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[#00558C] shadow-sm flex items-center justify-center border border-slate-200 text-[10px] font-black group-hover:scale-110 transition-transform">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </span>
        </button>
      </aside>
    );
  }

  const isCurrentArticlePage = state.slug
    ? pathname === `/article/${state.slug}` || pathname.endsWith(`/${state.slug}`)
    : true;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    articleAudioService.seekToPercent(newPercent);
  };

  return (
    <aside
      role="region"
      aria-label="Article Audio Player"
      className="tc-audio-player fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center pointer-events-none"
    >
      {/* "Back to Read Article" Sleek Branded Pill Badge docked seamlessly at the center top of the audio player */}
      {!isCurrentArticlePage && state.slug && (
        <div className="pointer-events-auto -mb-2.5 z-20 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Link
            href={`/article/${state.slug}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-[#00558C] via-[#004e80] to-[#003c66] hover:from-[#0066a8] hover:to-[#004d80] border border-white/30 shadow-[0_4px_14px_rgba(0,85,140,0.35)] px-3.5 py-1 rounded-full backdrop-blur-xl transition-all duration-200 cursor-pointer group hover:scale-105 active:scale-95 whitespace-nowrap tracking-wide"
            title={`Return to article: ${state.title}`}
            aria-label={`Back to Read Article: ${state.title}`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg
                className="w-2.5 h-2.5 text-white transition-transform duration-200 group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>
            <span>Back to Read Article</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse shrink-0" />
          </Link>
        </div>
      )}

      {/* Main Floating Audio Player Card */}
      <div className="w-full relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_14px_36px_-6px_rgba(0,85,140,0.18),0_6px_18px_rgba(0,0,0,0.07)] text-slate-800 p-2.5 sm:px-3.5 sm:py-2.5 flex flex-col gap-1.5 transition-all pointer-events-auto">
        {/* Subtle top ambient glowing brand line */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#00558C] to-transparent" />

        {/* Top Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Section: Equalizer + Brand Badges + Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Animated Equalizer Wave with subtle glow ring */}
            <div
              className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 shrink-0 shadow-2xs"
              title={state.isPlaying ? "Speaking" : state.isPaused ? "Paused" : "Ready"}
            >
              <div className="flex items-end gap-[2px] h-3.5 justify-center">
                <span
                  className={`w-[2px] bg-gradient-to-t from-[#00558C] to-[#0284c7] rounded-full transition-all ${
                    state.isPlaying ? "h-3.5 animate-[bounce_0.8s_infinite_ease-in-out]" : "h-1"
                  }`}
                />
                <span
                  className={`w-[2px] bg-gradient-to-t from-[#00558C] to-[#0284c7] rounded-full transition-all ${
                    state.isPlaying ? "h-2.5 animate-[bounce_0.6s_infinite_ease-in-out_0.2s]" : "h-2"
                  }`}
                />
                <span
                  className={`w-[2px] bg-gradient-to-t from-[#00558C] to-[#0284c7] rounded-full transition-all ${
                    state.isPlaying ? "h-3 animate-[bounce_0.7s_infinite_ease-in-out_0.4s]" : "h-1"
                  }`}
                />
                <span
                  className={`w-[2px] bg-gradient-to-t from-[#00558C] to-[#0284c7] rounded-full transition-all ${
                    state.isPlaying ? "h-2 animate-[bounce_0.65s_infinite_ease-in-out_0.1s]" : "h-1.5"
                  }`}
                />
              </div>
              {state.isPlaying && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00558C] animate-ping opacity-60" />
              )}
            </div>

            {/* Title & Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00558C]">
                  Times Chicago Audio
                </span>
                <span className="text-[9.5px] font-medium text-slate-400 uppercase hidden sm:inline">
                  • AI Journalist
                </span>
              </div>

              {state.slug && !isCurrentArticlePage ? (
                <Link
                  href={`/article/${state.slug}`}
                  className="text-[12.5px] font-bold text-slate-900 hover:text-[#00558C] hover:underline truncate max-w-[250px] sm:max-w-[370px] block leading-tight mt-0.5 cursor-pointer transition-colors"
                  title={`Go back to article: ${state.title}`}
                >
                  {state.isLoading ? "Connecting AI Journalist Voice..." : state.title || "Listening to article"}
                </Link>
              ) : (
                <p
                  className="text-[12.5px] font-bold text-slate-900 truncate max-w-[260px] sm:max-w-[380px] leading-tight mt-0.5"
                  title={state.title}
                >
                  {state.isLoading ? "Connecting AI Journalist Voice..." : state.title || "Listening to article"}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Main Play / Pause Button with Floating Elevation and Gradient Aura */}
            <button
              type="button"
              onClick={() => {
                if (state.isPlaying) {
                  articleAudioService.pause();
                } else {
                  articleAudioService.resume();
                }
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#00558C] via-[#004e80] to-[#003c66] hover:from-[#0066a8] hover:to-[#004d80] text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-[0_4px_12px_rgba(0,85,140,0.32)] hover:shadow-[0_6px_16px_rgba(0,85,140,0.42)] hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75"
              title={state.isLoading ? "Connecting Voice..." : state.isPlaying ? "Pause" : "Play"}
              aria-label={state.isPlaying ? "Pause audio" : "Play audio"}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <svg className="w-3.5 h-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : state.isPlaying ? (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Minimize to small round icon */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-slate-400 hover:text-[#00558C] hover:bg-sky-50 rounded-full transition-all duration-150 cursor-pointer active:scale-90"
              title="Minimize Audio Player"
              aria-label="Minimize audio player"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Close / Dismiss with soft hover state */}
            <button
              type="button"
              onClick={() => articleAudioService.stop()}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all duration-150 cursor-pointer active:scale-90"
              title="Close Audio Reader"
              aria-label="Close audio player"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Interactive Progress Bar & Timestamps */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[10px] font-mono font-semibold text-slate-500 w-7 text-right select-none tabular-nums">
            {formatTime(state.currentSeconds)}
          </span>

          {/* Interactive Progress Bar with Hover Scrub Thumb */}
          <div
            onClick={handleProgressBarClick}
            className="flex-1 h-1.5 hover:h-2 bg-slate-100 border border-slate-200/60 rounded-full cursor-pointer relative group transition-all duration-150"
            title="Click to seek position"
          >
            <div
              className="h-full bg-gradient-to-r from-[#004573] to-[#0070b8] rounded-full transition-all duration-100 relative"
              style={{ width: `${Math.min(100, Math.max(0, state.progressPercent))}%` }}
            >
              {/* Glowing Scrub thumb visible on bar hover */}
              <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#00558C] rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            </div>
          </div>

          <span className="text-[10px] font-mono font-semibold text-slate-500 w-7 text-left select-none tabular-nums">
            {formatTime(state.totalSeconds)}
          </span>
        </div>
      </div>
    </aside>
  );
}
