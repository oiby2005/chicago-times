/**
 * Audio Service for Times Chicago Article Speech Synthesis
 * Uses Human-like AI Journalist Voice (Edge Neural TTS) via Backend API
 * with automatic fallback to Web Speech API.
 */

export interface AudioPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isVisible: boolean;
  title: string;
  slug: string;
  currentSeconds: number;
  totalSeconds: number;
  progressPercent: number;
}

type AudioStateListener = (state: AudioPlayerState) => void;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Filters out image tags, figure blocks, captions, and photo credits so only pure article prose is read
export function cleanTextForProseAudio(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, " ")
    .replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, " ")
    .replace(/<span[^>]*class=["'][^"']*(?:image-caption|image-credit)[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, " ")
    .replace(/\(\s*photo\s*:[^\)]+\)/gi, " ")
    .replace(/photo\s*:\s*[A-Z\s]{2,30}\b/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, " and ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

class ArticleAudioService {
  private audioElement: HTMLAudioElement | null = null;
  private currentSlug: string = "";
  private currentTitle: string = "";
  private currentDeck: string = "";
  private currentBodyContent: string = "";
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private isLoading: boolean = false;
  private isVisible: boolean = false;
  private isStopping: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();

  // Fallback Web Speech synthesizer
  private isUsingSpeechSynthesis: boolean = false;
  private synthUtterance: SpeechSynthesisUtterance | null = null;
  private synthCharIndex: number = 0;
  private synthCleanText: string = "";

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioElement();
    }
  }

  private initAudioElement(): void {
    if (this.audioElement) return;
    const audio = new Audio();
    audio.preload = "auto";

    audio.onplay = () => {
      this.isStopping = false;
      this.isPlaying = true;
      this.isPaused = false;
      this.isLoading = false;
      this.isVisible = true;
      this.notify();
    };

    audio.onpause = () => {
      if (this.isStopping) return;
      if (!audio.ended) {
        this.isPlaying = false;
        this.isPaused = true;
        this.notify();
      }
    };

    audio.ontimeupdate = () => {
      if (this.isPlaying || this.isPaused) {
        this.notify();
      }
    };

    audio.onended = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    audio.onerror = () => {
      console.warn("HTML5 Audio failed, falling back to Web Speech API");
      if (this.isPlaying || this.isLoading) {
        this.fallbackToSpeechSynthesis();
      }
    };

    this.audioElement = audio;
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  public getState(): AudioPlayerState {
    let currentSecs = 0;
    let totalSecs = 0;
    let percent = 0;

    if (this.isUsingSpeechSynthesis) {
      const words = this.synthCleanText.split(/\s+/).filter(Boolean).length;
      totalSecs = Math.max(1, Math.ceil((words / 170) * 60));
      percent =
        this.synthCleanText.length > 0
          ? Math.min(100, Math.max(0, (this.synthCharIndex / this.synthCleanText.length) * 100))
          : 0;
      currentSecs = Math.floor((percent / 100) * totalSecs);
    } else if (this.audioElement && !isNaN(this.audioElement.duration) && this.audioElement.duration > 0) {
      currentSecs = Math.floor(this.audioElement.currentTime || 0);
      totalSecs = Math.floor(this.audioElement.duration || 0);
      percent = Math.min(100, Math.max(0, (currentSecs / totalSecs) * 100));
    } else {
      // Estimated from word count excluding image captions & credits
      const cleanContent = cleanTextForProseAudio(this.currentBodyContent);
      const words = (this.currentTitle + " " + this.currentDeck + " " + cleanContent)
        .split(/\s+/)
        .filter(Boolean).length;
      totalSecs = Math.max(1, Math.ceil((words / 170) * 60));
    }

    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      isLoading: this.isLoading,
      isVisible: this.isVisible,
      title: this.currentTitle,
      slug: this.currentSlug,
      currentSeconds: currentSecs,
      totalSeconds: totalSecs,
      progressPercent: percent,
    };
  }

  public async togglePlayPause(
    title: string = "",
    deck: string = "",
    bodyContent: string = "",
    slug: string = ""
  ): Promise<void> {
    if (typeof window === "undefined") return;

    const trimmedTitle = title.trim();
    // Check if starting a new article
    const isNewArticle = trimmedTitle !== "" && trimmedTitle !== this.currentTitle;

    if (isNewArticle) {
      this.stop();
      this.currentTitle = trimmedTitle;
      this.currentDeck = deck.trim();
      this.currentBodyContent = bodyContent.trim();
      this.currentSlug = slug.trim() || trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await this.startJournalistVoice();
      return;
    }

    if (trimmedTitle) this.currentTitle = trimmedTitle;
    if (deck.trim()) this.currentDeck = deck.trim();
    if (bodyContent.trim()) this.currentBodyContent = bodyContent.trim();
    if (slug.trim()) this.currentSlug = slug.trim();

    // If player was dismissed/closed, re-open it and play!
    if (!this.isVisible) {
      this.isVisible = true;
      if (this.audioElement && this.audioElement.src && !this.isUsingSpeechSynthesis) {
        try {
          await this.audioElement.play();
          this.isPlaying = true;
          this.isPaused = false;
          this.notify();
          return;
        } catch (_) {}
      }
      await this.startJournalistVoice();
      return;
    }

    if (this.isPlaying) {
      this.pause();
    } else if (this.isPaused) {
      this.resume();
    } else {
      await this.startJournalistVoice();
    }
  }

  private async startJournalistVoice(): Promise<void> {
    this.initAudioElement();
    this.isUsingSpeechSynthesis = false;
    this.isLoading = true;
    this.isVisible = true;
    this.isPaused = false;
    this.isPlaying = false;
    this.notify();

    try {
      // Request neural journalist audio from backend
      const res = await fetch(`${BACKEND_URL}/api/tts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: this.currentSlug,
          title: this.currentTitle,
          deck: this.currentDeck,
          bodyContent: this.currentBodyContent,
          voice: "en-US-ChristopherNeural", // Authoritative news anchor
        }),
      });

      if (!res.ok) {
        throw new Error(`TTS backend returned ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !data.audioUrl) {
        throw new Error(data.message || "No audio URL returned");
      }

      const fullUrl = `${BACKEND_URL}${data.audioUrl}`;
      if (this.audioElement) {
        this.audioElement.src = fullUrl;
        await this.audioElement.play();
        this.isPlaying = true;
        this.isPaused = false;
        this.isLoading = false;
        this.notify();
      }
    } catch (err) {
      console.warn("Journalist AI Voice generation failed, using browser speech fallback:", err);
      this.fallbackToSpeechSynthesis();
    }
  }

  private fallbackToSpeechSynthesis(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.isLoading = false;
      this.isPlaying = false;
      this.notify();
      return;
    }

    this.isUsingSpeechSynthesis = true;
    this.isLoading = false;
    this.isVisible = true;
    window.speechSynthesis.cancel();

    const cleanBody = cleanTextForProseAudio(this.currentBodyContent);
    this.synthCleanText = [this.currentTitle, this.currentDeck, cleanBody].filter(Boolean).join(". ");

    const utterance = new SpeechSynthesisUtterance(this.synthCleanText);
    this.synthUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => (v.name.includes("Natural") || v.name.includes("Google")) && v.lang.startsWith("en")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.isVisible = true;
      this.notify();
    };

    utterance.onboundary = (e) => {
      if (typeof e.charIndex === "number") {
        this.synthCharIndex = e.charIndex;
        this.notify();
      }
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    utterance.onerror = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();
  }

  public pause(): void {
    if (this.isUsingSpeechSynthesis) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.isPaused = true;
    this.notify();
  }

  public resume(): void {
    this.isVisible = true;
    if (this.isUsingSpeechSynthesis) {
      this.fallbackToSpeechSynthesis();
    } else if (this.audioElement) {
      this.audioElement.play().catch(console.error);
    }
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();
  }

  public stop(): void {
    this.isStopping = true;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.isLoading = false;
    this.isVisible = false;
    this.notify();
    setTimeout(() => {
      this.isStopping = false;
    }, 150);
  }

  public seekBy(seconds: number): void {
    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      const dur = this.audioElement.duration || 0;
      const target = Math.max(0, Math.min(dur, this.audioElement.currentTime + seconds));
      this.audioElement.currentTime = target;
      this.notify();
    }
  }

  public seekToPercent(percent: number): void {
    if (!this.isUsingSpeechSynthesis && this.audioElement && this.audioElement.duration > 0) {
      const clamped = Math.max(0, Math.min(100, percent));
      this.audioElement.currentTime = (clamped / 100) * this.audioElement.duration;
      this.notify();
    }
  }

  public getArticleDurationMinutes(wordCount: number): number {
    return Math.max(1, Math.ceil(wordCount / 170));
  }
}

export const articleAudioService = new ArticleAudioService();
