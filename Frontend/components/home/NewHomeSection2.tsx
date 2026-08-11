"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function NewHomeSection2() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(974); // 16:14 in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubscribeDropdown, setShowSubscribeDropdown] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback simulated timer if audio source fails to play
        setIsPlaying(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${mm}:${ss}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="w-full bg-white text-[#111111] pt-2 pb-6">
      {/* Hidden audio element with sample audio track */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main 12-Column Grid Alignment matching Section 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* ==================== LEFT MAIN CONTAINER (9 of 12 Cols ~ 75%) ==================== */}
        <div className="lg:col-span-9 pr-0 lg:pr-6 lg:border-r lg:border-gray-300">
          
          {/* Top Line & Podcasts Section Header Row */}
          <div className="border-t border-black pt-2 pb-3 mb-4 flex items-center justify-between">
            <h2 className="font-serif font-bold text-[20px] text-[#111111] tracking-tight">
              Podcasts
            </h2>
            <Link
              href="/podcasts"
              className="font-sans text-[13px] font-semibold text-[#111111] underline underline-offset-2 hover:text-gray-700 transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Podcast Card Content */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 pb-4">
            
            {/* Podcast Cover Artwork */}
            <div className="w-[125px] h-[125px] shrink-0 relative bg-gradient-to-br from-[#b30000] via-[#7a0000] to-[#0c1f3f] overflow-hidden border border-gray-300 shadow-xs flex flex-col justify-between p-2.5 text-white select-none">
              <div>
                <div className="font-sans text-[8.5px] font-extrabold uppercase tracking-widest text-red-200">
                  Tech News Briefing
                </div>
                <div className="font-sans text-[10.5px] font-extrabold leading-tight text-white mt-1">
                  AI and the Blurring of Reality
                </div>
              </div>
              <div className="border-t border-white/30 pt-1">
                <span className="font-serif font-black tracking-widest text-[12px] text-white">
                  WSJ
                </span>
              </div>
            </div>

            {/* Title, Description & Interactive Audio Bar */}
            <div className="flex-1 min-w-0">
              {/* Podcast Title */}
              <h3 className="font-serif font-bold text-[19px] sm:text-[21px] leading-[1.22] text-[#111111] hover:text-gray-800 cursor-pointer">
                <Link href="/article/ai-is-fueling-a-new-kind-of-political-propaganda">
                  AI Is Fueling a New Kind of Political Propaganda
                </Link>
              </h3>

              {/* Description & Read Transcript Link */}
              <p className="font-sans text-[12.5px] leading-[1.42] text-[#444444] mt-1.5">
                In this second installment of our three-part series, &quot;AI and the Blurring of Reality,&quot; personal tech columnist Nicole Nguyen explores how this technology is turbocharging deepfakes and shaping politics.{" "}
                <Link
                  href="/article/ai-is-fueling-a-new-kind-of-political-propaganda#transcript"
                  className="text-[#0274b6] underline underline-offset-2 font-medium hover:text-[#005599] transition-colors"
                >
                  Read Transcript
                </Link>
              </p>

              {/* Audio Controls Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-3.5 text-[12px] text-gray-700">
                {/* Play / Pause Circular Button */}
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-[#111111] transition-colors cursor-pointer shrink-0 shadow-2xs"
                  aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
                >
                  {isPlaying ? (
                    <svg className="w-3.5 h-3.5 fill-current text-black" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 fill-current text-black ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Progress / Seek Track Bar */}
                <div className="flex-1 min-w-[140px] max-w-[280px] flex items-center gap-2">
                  <div className="relative w-full flex items-center h-4 cursor-pointer group">
                    {/* Track Background */}
                    <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-[#0274b6] rounded-full transition-all duration-75"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {/* Scrubber Knob */}
                    <div
                      className="absolute w-3 h-3 bg-[#0274b6] border-2 border-white rounded-full shadow-xs -ml-1.5 pointer-events-none group-hover:scale-125 transition-transform"
                      style={{ left: `${progressPercent}%` }}
                    />
                    {/* Native Slider for Click/Drag seeking */}
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                {/* Time Display */}
                <span className="font-mono text-[11.5px] text-gray-600 whitespace-nowrap">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Playback Speed Button */}
                <button
                  onClick={cycleSpeed}
                  className="border border-gray-300 px-2 py-0.5 rounded text-[11px] font-sans font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Change playback speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Volume / Mute Button */}
                <button
                  onClick={toggleMute}
                  className="p-1 text-gray-600 hover:text-black transition-colors cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
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

                {/* Subscribe Dropdown Pill */}
                <div className="relative">
                  <button
                    onClick={() => setShowSubscribeDropdown(!showSubscribeDropdown)}
                    className="border border-gray-300 rounded px-2.5 py-1 text-[11.5px] font-sans font-semibold text-[#111111] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Subscribe</span>
                    <svg
                      className={`w-3 h-3 text-gray-600 transition-transform ${
                        showSubscribeDropdown ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showSubscribeDropdown && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 shadow-md rounded-xs py-1 z-30 font-sans text-[12px] text-[#111111]">
                      <a href="#" className="block px-3 py-1.5 hover:bg-gray-100">
                        Apple Podcasts
                      </a>
                      <a href="#" className="block px-3 py-1.5 hover:bg-gray-100">
                        Spotify
                      </a>
                      <a href="#" className="block px-3 py-1.5 hover:bg-gray-100">
                        YouTube Music
                      </a>
                      <a href="#" className="block px-3 py-1.5 hover:bg-gray-100">
                        RSS Feed
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Divider Line in Left Column */}
          <div className="border-b border-gray-300 pt-2" />

        </div>

        {/* ==================== RIGHT SIDEBAR CONTAINER (3 of 12 Cols ~ 25%) ==================== */}
        <div className="lg:col-span-3 pl-0 lg:pl-6 pt-3 lg:pt-0">
          <div className="text-right lg:text-center pb-2">
            <span className="text-[10px] font-sans text-gray-400 uppercase tracking-widest">
              Advertisement
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
