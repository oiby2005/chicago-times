"use client";

import React, { useState, useEffect, useRef } from "react";

interface ArticleAudioReaderProps {
  title?: string;
  deck?: string;
  bodyContent?: string;
}

export default function ArticleAudioReader({ title = "", deck = "", bodyContent = "" }: ArticleAudioReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [listenMins, setListenMins] = useState<number>(2);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Extract clean text and calculate listen duration
  useEffect(() => {
    let cleanBody = "";
    if (bodyContent) {
      cleanBody = bodyContent.replace(/<[^>]+>/g, " ");
    }
    const fullText = `${title}. ${deck}. ${cleanBody}`.trim();
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    // Average speaking/listening rate: ~170 words per minute
    const mins = Math.max(1, Math.ceil(wordCount / 170));
    setListenMins(mins);
  }, [title, deck, bodyContent]);

  // Handle SpeechSynthesis audio playback
  const handleToggleListen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Google auto reader is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Cancel any existing speech synthesis playback first
    window.speechSynthesis.cancel();

    let cleanBody = "";
    if (bodyContent) {
      cleanBody = bodyContent.replace(/<[^>]+>/g, " ");
    }
    const fullText = `${title}. ${deck}. ${cleanBody}`.trim();
    if (!fullText) return;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utteranceRef.current = utterance;

    // Pick Google Auto Reader or best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(
      (v) =>
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("English")) &&
        v.lang.startsWith("en")
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (googleVoice) {
      utterance.voice = googleVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Cleanup speech on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 pl-3 border-l border-[#CCCCCC] h-5 my-auto select-none ml-1">
      <button
        type="button"
        onClick={handleToggleListen}
        className="inline-flex items-center gap-1.5 text-[14px] font-sans font-bold text-[#0f172a] hover:text-[#00558C] hover:underline cursor-pointer transition-colors"
        title={isPlaying ? "Pause Article Audio Reader" : "Listen to this article"}
        aria-label="Listen to Article"
      >
        {/* Headphone SVG Icon */}
        <svg
          className={`w-4 h-4 text-[#4a5568] ${isPlaying ? "animate-pulse text-[#0f172a]" : ""}`}
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

        <span className="text-[#00558C] font-bold">{isPlaying ? "Pause" : "Listen"}</span>
        <span className="font-normal text-[#00558C] text-[13.5px]">({listenMins} min)</span>
      </button>
    </div>
  );
}
