/**
 * Universal Embed URL Generator for YouTube, Rumble, Instagram, and Facebook.
 * Converts watch/share URLs into playable embed iframe URLs.
 */
export function getEmbedUrl(rawUrl?: string): string {
  if (!rawUrl) return "";
  const url = rawUrl.trim();

  // 1. YouTube (Standard, Shorts, YouTu.be)
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]+)/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }

  // 2. Rumble
  const rumbleMatch = url.match(/rumble\.com\/(v[a-zA-Z0-9_-]+)/i);
  if (rumbleMatch && rumbleMatch[1]) {
    return `https://rumble.com/embed/${rumbleMatch[1]}/?autoplay=1`;
  }

  // 3. Instagram (Reels, Posts, TV, Blockquotes)
  const igMatch = url.match(/instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    return `https://www.instagram.com/reel/${igMatch[1]}/embed`;
  }

  // 4. Facebook (Reels, Videos, Shorts)
  if (url.includes("facebook.com") || url.includes("fb.watch") || url.includes("fb_shorts")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`;
  }

  return url;
}

export function isVerticalVideo(url?: string, platform?: string): boolean {
  const str = `${url || ""} ${platform || ""}`.toLowerCase();
  return str.includes("facebook") || str.includes("fb_shorts") || str.includes("instagram") || str.includes("reel");
}

export function isInstagramVideo(url?: string): boolean {
  if (!url) return false;
  return url.toLowerCase().includes("instagram.com");
}
