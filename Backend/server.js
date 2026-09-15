const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Paths to persistent data files
const DATA_DIR = path.join(__dirname, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const SAVED_FILE = path.join(DATA_DIR, 'saved.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ADS_FILE = path.join(DATA_DIR, 'ads.json');
const SHORTS_FILE = path.join(DATA_DIR, 'shorts.json');

// Ensure data directory & files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(POSTS_FILE)) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SAVED_FILE)) {
  fs.writeFileSync(SAVED_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
}
if (!fs.existsSync(ADS_FILE)) {
  fs.writeFileSync(ADS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SHORTS_FILE)) {
  fs.writeFileSync(SHORTS_FILE, JSON.stringify([], null, 2));
}

// Helpers for reading/writing persistent data
const readJSONFile = (filePath, fallback = []) => {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// Routes
app.use('/api/auth', authRoutes);

const { uploadBase64ToB2, uploadToBackblazeB2, uploadAllBase64InHtml, uploadRemoteUrlToB2 } = require('./lib/backblazeB2');

// Helper to format ISO 8601 duration (PT1M25S -> "1:25", PT21M42S -> "21:42") or seconds (5695 -> "1:34:55")
function parseIsoDuration(durationStr) {
  if (!durationStr) return null;
  if (typeof durationStr === 'number') durationStr = String(durationStr);
  const str = String(durationStr).trim();

  // 1. ISO 8601 pattern like PT21M42S, PT1H5M3S, PT7M, PT45S, P0DT0H21M42S
  const isoMatch = str.match(/P?(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/i);
  if (isoMatch && (isoMatch[2] || isoMatch[3] || isoMatch[4])) {
    const hours = parseInt(isoMatch[2] || '0', 10);
    const minutes = parseInt(isoMatch[3] || '0', 10);
    const seconds = Math.floor(parseFloat(isoMatch[4] || '0'));

    const pad = (n) => (n < 10 ? '0' + n : '' + n);
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
  }

  // 2. Pure number (seconds or milliseconds)
  if (/^\d+$/.test(str)) {
    let num = parseInt(str, 10);
    if (num <= 0) return null;
    if (num > 100000) {
      // Milliseconds
      num = Math.floor(num / 1000);
    }
    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    const seconds = num % 60;
    const pad = (n) => (n < 10 ? '0' + n : '' + n);

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
  }

  // 3. Already formatted like "21:42" or "1:05:12"
  if (/^\d+:\d{2}(:\d{2})?$/.test(str)) {
    return str;
  }

  return null;
}

const parseDurationString = parseIsoDuration;

// ==========================================
// BACKBLAZE B2 IMAGE UPLOAD ENDPOINT
// ==========================================
app.post('/api/upload', async (req, res) => {
  try {
    const { imageBase64, fileName, type, folder } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    const targetFolder = folder || type || 'articles';
    const name = fileName || `${targetFolder}_${Date.now()}.webp`;
    const b2Url = await uploadBase64ToB2(imageBase64, name, targetFolder);
    if (b2Url) {
      return res.status(200).json({ success: true, url: b2Url });
    } else {
      return res.status(500).json({ success: false, message: 'Backblaze B2 upload failed or credentials missing' });
    }
  } catch (error) {
    console.error('Image Upload API error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

// Helper for fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ==========================================
// UNIVERSAL VIDEO METADATA ENDPOINT
// ==========================================
function extractDurationFromHtml(html) {
  if (!html) return null;

  // A. Check for ISO 8601 duration in JSON-LD or attributes: "duration":"PT21M42S"
  const isoMatch = html.match(/"duration"\s*:\s*"(PT[0-9YMWDHS.]+)"/i) ||
                   html.match(/itemprop=["']duration["']\s+content=["'](PT[0-9YMWDHS.]+)["']/i) ||
                   html.match(/content=["'](PT[0-9YMWDHS.]+)["']\s+itemprop=["']duration["']/i) ||
                   html.match(/(PT[0-9]+[H|M|S][0-9M|S]*)/i);
  if (isoMatch && isoMatch[1]) {
    const parsed = parseDurationString(isoMatch[1]);
    if (parsed) return parsed;
  }

  // B. Check for numeric duration fields in JSON/script tags: "duration_ms": 1302000, "durationSeconds": 1302, "lengthSeconds": "1302", "duration": 1302
  const numMatch = html.match(/"duration_ms"\s*:\s*(\d+)/i) ||
                   html.match(/"durationSeconds"\s*:\s*(\d+)/i) ||
                   html.match(/"lengthSeconds"\s*:\s*"?(\d+)"?/i) ||
                   html.match(/"duration"\s*:\s*(\d+)/i) ||
                   html.match(/<meta\s+property=["'](?:og:video:duration|music:duration|video:duration)["']\s+content=["'](\d+)["']/i) ||
                   html.match(/<meta\s+content=["'](\d+)["']\s+property=["'](?:og:video:duration|music:duration|video:duration)["']/i);

  if (numMatch && numMatch[1]) {
    const parsed = parseDurationString(numMatch[1]);
    if (parsed) return parsed;
  }

  // C. English text fallback: "21 min", "21 mins", "21 minutes"
  const textMinMatch = html.match(/(\d+)\s*(?:min|minutes|mins)\b/i);
  if (textMinMatch && textMinMatch[1]) {
    return `${textMinMatch[1]}:00`;
  }

  return null;
}

app.post('/api/video-metadata', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const trimmedUrl = url.trim();
    const lowerUrl = trimmedUrl.toLowerCase();

    let platform = 'Youtube Video';
    if (lowerUrl.includes('apple.com') || lowerUrl.includes('podcasts.apple.com')) {
      platform = 'Apple Podcasts';
    } else if (lowerUrl.includes('spotify.com')) {
      platform = 'Spotify';
    } else if (lowerUrl.includes('music.youtube.com')) {
      platform = 'YouTube Music';
    } else if (lowerUrl.includes('amazon.com') || lowerUrl.includes('music.amazon.com')) {
      platform = 'Amazon Music';
    } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      platform = lowerUrl.includes('/shorts/') ? 'YouTube Shorts' : 'Youtube Video';
    } else if (lowerUrl.includes('rumble.com')) {
      platform = 'Rumble Video';
    } else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
      platform = 'Facebook Short';
    } else if (lowerUrl.includes('instagram.com')) {
      platform = 'Instagram shorts';
    }

    let rawTitle = '';
    let rawThumbnailUrl = '';
    let formattedDuration = '0:45';

    // 0A. Apple Podcasts
    if (lowerUrl.includes('apple.com') || lowerUrl.includes('podcasts.apple.com')) {
      try {
        const podRes = await fetchWithTimeout(trimmedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }, 3500);

        if (podRes.ok) {
          const html = await podRes.text();
          const titleMatch = (
            html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i) ||
            html.match(/<title[^>]*>([^<]+)<\/title>/i)
          )?.[1];

          if (titleMatch) {
            rawTitle = titleMatch.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/\s*-\s*Apple Podcasts\s*$/i, '').trim();
          }

          const imgMatch = (
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i)
          )?.[1];

          if (imgMatch) {
            rawThumbnailUrl = imgMatch.replace(/&amp;/g, '&').replace(/\\/g, '');
          }

          const dur = extractDurationFromHtml(html);
          if (dur) formattedDuration = dur;
        }
      } catch (e) {}
    }

    // 0B. Spotify
    if (lowerUrl.includes('spotify.com')) {
      try {
        const spotRes = await fetchWithTimeout(trimmedUrl, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          }
        }, 3500);

        if (spotRes.ok) {
          const html = await spotRes.text();
          const titleMatch = (
            html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<title[^>]*>([^<]+)<\/title>/i)
          )?.[1];

          if (titleMatch) {
            rawTitle = titleMatch.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s*-\s*Spotify\s*$/i, '').trim();
          }

          const imgMatch = (
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
          )?.[1];

          if (imgMatch) {
            rawThumbnailUrl = imgMatch.replace(/&amp;/g, '&');
          }

          const durMatch = html.match(/music:duration["']?\s*content=["']?(\d+)/i) || html.match(/(\d+)\s*min/i);
          if (durMatch && durMatch[1]) {
            const sec = parseInt(durMatch[1], 10);
            if (sec > 100) {
              const m = Math.floor(sec / 60);
              const s = sec % 60;
              formattedDuration = `${m}:${s < 10 ? '0' : ''}${s}`;
            } else {
              formattedDuration = `${sec}:00`;
            }
          }
        }
      } catch (e) {}
    }

    // 0C. Amazon Music
    if (lowerUrl.includes('amazon.com') || lowerUrl.includes('music.amazon.com')) {
      try {
        const amzRes = await fetchWithTimeout(trimmedUrl, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          }
        }, 3500);

        if (amzRes.ok) {
          const html = await amzRes.text();
          const titleMatch = (
            html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<title[^>]*>([^<]+)<\/title>/i)
          )?.[1];

          if (titleMatch) {
            rawTitle = titleMatch.replace(/&amp;/g, '&').trim();
          }

          const imgMatch = (
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
          )?.[1];

          if (imgMatch) {
            rawThumbnailUrl = imgMatch.replace(/&amp;/g, '&');
          }
        }
      } catch (e) {}
    }

    // 1. YouTube
    const ytMatch = trimmedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      const ytId = ytMatch[1];
      rawThumbnailUrl = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;

      try {
        const oembedRes = await fetchWithTimeout(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`, {}, 3000);
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.title) rawTitle = oembedData.title;
        }
      } catch (e) {}

      try {
        const pageRes = await fetchWithTimeout(`https://www.youtube.com/watch?v=${ytId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
        }, 3500);
        if (pageRes.ok) {
          const html = await pageRes.text();
          const dur = extractDurationFromHtml(html);
          if (dur) formattedDuration = dur;
        }
      } catch (e) {}
    }

    // 2. Rumble
    if (lowerUrl.includes('rumble.com')) {
      const cleanRumbleUrl = trimmedUrl.split('?')[0];
      try {
        const oembedUrl = `https://rumble.com/api/Media/oembed.json?url=${encodeURIComponent(cleanRumbleUrl)}`;
        const oembedRes = await fetchWithTimeout(oembedUrl, {}, 3000);
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.title) rawTitle = oembedData.title;
          if (oembedData.thumbnail_url) rawThumbnailUrl = oembedData.thumbnail_url;
          if (oembedData.duration) {
            const parsed = parseIsoDuration(oembedData.duration);
            if (parsed) formattedDuration = parsed;
          }
        }
      } catch (e) {}

      // Fallback if oembed didn't return title or thumbnail
      if (!rawTitle || !rawThumbnailUrl) {
        const rMatch = cleanRumbleUrl.match(/\/v([a-z0-9]+)-([^.]+)\.html/i) || cleanRumbleUrl.match(/\/v([a-z0-9]+)/i);
        let rId = '';
        let rSlug = '';
        if (rMatch) {
          rId = rMatch[1];
          rSlug = rMatch[2] || '';
        }
        if (rSlug && !rawTitle) {
          rawTitle = rSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        }

        if (rId) {
          try {
            const embedUrl = `https://rumble.com/embed/v${rId.replace(/^v/i, '')}/`;
            const embedRes = await fetchWithTimeout(embedUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            }, 3000);
            if (embedRes.ok) {
              const html = await embedRes.text();
              const titleMatch = html.match(/"title"\s*:\s*"([^"]+)"/i);
              if (titleMatch && titleMatch[1] && !rawTitle) rawTitle = titleMatch[1];

              const imgMatch = html.match(/"i"\s*:\s*"([^"]+)"/i) || html.match(/"poster"\s*:\s*"([^"]+)"/i);
              if (imgMatch && imgMatch[1] && !rawThumbnailUrl) rawThumbnailUrl = imgMatch[1].replace(/\\/g, '');

              const durMatch = html.match(/"duration"\s*:\s*(\d+)/i);
              if (durMatch && durMatch[1] && formattedDuration === '0:45') {
                const parsed = parseIsoDuration(durMatch[1]);
                if (parsed) formattedDuration = parsed;
              }
            }
          } catch (e) {}
        }
      }
    }

    // 3. Instagram
    if (lowerUrl.includes('instagram.com')) {
      platform = 'Instagram shorts';
      const instaMatch = trimmedUrl.match(/\/(?:reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/);
      if (instaMatch && instaMatch[1]) {
        const code = instaMatch[1];

        // Fetch Instagram Reel HTML with facebookexternalhit User-Agent to extract direct CDN image URL & title
        try {
          const instaRes = await fetchWithTimeout(`https://www.instagram.com/reel/${code}/`, {
            headers: {
              'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            }
          }, 3500);

          if (instaRes.ok) {
            const html = await instaRes.text();
            const imgMatch = (
              html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
              html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i)
            )?.[1];

            if (imgMatch) {
              rawThumbnailUrl = imgMatch.replace(/&amp;/g, '&').replace(/\\/g, '');
            }

            const titleMatch = (
              html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
              html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i)
            )?.[1];

            if (titleMatch) {
              rawTitle = titleMatch.replace(/&amp;/g, '&').trim();
            }
          }
        } catch (e) {}

        // Fallback to embed page if direct fetch didn't yield image/title
        if (!rawThumbnailUrl || !rawTitle) {
          try {
            const embedRes = await fetchWithTimeout(`https://www.instagram.com/p/${code}/embed/`, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            }, 3000);

            if (embedRes.ok) {
              const html = await embedRes.text();
              if (!rawThumbnailUrl) {
                const imgMatch = html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/i) || html.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*Media[^"]*"/i) || html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
                if (imgMatch && imgMatch[1]) {
                  rawThumbnailUrl = imgMatch[1].replace(/&amp;/g, '&').replace(/\\/g, '');
                }
              }
              if (!rawTitle) {
                const captionMatch = html.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/class="EmbedCaption"[^>]*>([\s\S]*?)<\/div>/i);
                if (captionMatch && captionMatch[1]) {
                  const text = captionMatch[1].replace(/<[^>]+>/g, '').trim();
                  if (text && text.length > 2) {
                    rawTitle = text.split('\n')[0].trim();
                  }
                }
              }
            }
          } catch (e) {}
        }

        if (!rawTitle) rawTitle = `Instagram Reel (${code})`;
      }
    }

    // 4. Facebook
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
      try {
        const fbRes = await fetchWithTimeout(trimmedUrl, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }, 3500);
        if (fbRes.ok) {
          const html = await fbRes.text();
          const titleMatch = (
            html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i) ||
            html.match(/<title[^>]*>([^<]+)<\/title>/i)
          )?.[1];

          if (titleMatch && titleMatch.trim() && titleMatch !== 'Facebook') {
            rawTitle = titleMatch.replace(/&amp;/g, '&').trim();
          }

          const imgMatch = (
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
            html.match(/<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i)
          )?.[1];

          if (imgMatch) {
            rawThumbnailUrl = imgMatch.replace(/&amp;/g, '&').replace(/\\/g, '');
          }

          const durMatch = (
            html.match(/<meta\s+property=["']og:video:duration["']\s+content=["']([^"']+)["']/i) ||
            html.match(/"duration"\s*:\s*"?(\d+)"?/i)
          )?.[1];

          if (durMatch) {
            const parsed = parseIsoDuration(durMatch);
            if (parsed) formattedDuration = parsed;
          }
        }
      } catch (e) {}

      // Fallback to plugin endpoint if direct fetch failed
      if (!rawTitle || !rawThumbnailUrl) {
        try {
          const pluginUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmedUrl)}`;
          const res = await fetchWithTimeout(pluginUrl, {
            headers: {
              'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
            }
          }, 3000);
          if (res.ok) {
            const html = await res.text();
            if (!rawTitle) {
              const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
              if (titleMatch && titleMatch[1] && titleMatch[1] !== 'Facebook') {
                rawTitle = titleMatch[1];
              }
            }
            if (!rawThumbnailUrl) {
              const imgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
              if (imgMatch && imgMatch[1]) {
                rawThumbnailUrl = imgMatch[1].replace(/&amp;/g, '&').replace(/\\/g, '');
              }
            }
          }
        } catch (e) {}
      }

      if (!rawTitle) {
        const fbMatch = trimmedUrl.match(/\/(?:reel|videos|watch)\/([0-9a-zA-Z._-]+)/);
        const fbId = fbMatch ? fbMatch[1] : '';
        rawTitle = fbId ? `Facebook Reel (${fbId})` : 'Facebook Short Video';
      }
    }

    function decodeHtmlEntities(str) {
      if (!str) return '';
      return str
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'");
    }

    function cleanVideoTitle(raw) {
      if (!raw) return '';
      let decoded = decodeHtmlEntities(raw);
      decoded = decoded.replace(/^[0-9.]+[KMB]?\s*(?:views|reactions|likes)[^|]*\|\s*/i, '');
      decoded = decoded.replace(/\s*\|\s*(?:Fox News Video|Facebook Video|Rumble Video)\s*$/i, '');
      return decoded.trim();
    }

    if (!rawTitle) rawTitle = `${platform} Video`;
    if (!rawThumbnailUrl) rawThumbnailUrl = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80';

    const finalTitle = cleanVideoTitle(rawTitle);

    // Note: Return original thumbnail URL during auto-fetch. Re-hosting to Backblaze happens on Save to Feed Slot.
    return res.status(200).json({
      success: true,
      platform,
      title: finalTitle || rawTitle,
      thumbnailUrl: rawThumbnailUrl,
      duration: formattedDuration,
    });
  } catch (error) {
    console.error('Video Metadata API error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch video metadata' });
  }
});

// ==========================================
// SHORTS & REELS MYSQL TABLE INIT + SLOTS PERSISTENCE + BACKBLAZE B2 COVER IMAGE UPLOAD
// ==========================================

// Auto-create `shorts` table in MySQL if it doesn't exist and seed defaults if empty
async function initShortsTable() {
  try {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS shorts (
        id VARCHAR(100) NOT NULL,
        sub_tab VARCHAR(50) NOT NULL DEFAULT 'recommended',
        slot_number INT(11) NOT NULL DEFAULT 1,
        video_url TEXT NOT NULL,
        platform VARCHAR(100) NOT NULL DEFAULT 'Youtube Video',
        title TEXT NOT NULL,
        thumbnail_url TEXT DEFAULT NULL,
        duration VARCHAR(50) DEFAULT '0:45',
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;
    await db.query(createTableSql);
    console.log('✅ MySQL shorts table initialized/verified.');

    const [rows] = await db.query('SELECT COUNT(*) AS count FROM shorts');
    if (rows && rows[0].count === 0) {
      console.log('Seeding initial shorts/reels into MySQL shorts table...');
      const fileData = readJSONFile(SHORTS_FILE, {});
      let listToInsert = [];
      if (Array.isArray(fileData)) {
        listToInsert = fileData;
      } else if (typeof fileData === 'object') {
        Object.keys(fileData).forEach((tab) => {
          if (Array.isArray(fileData[tab])) {
            listToInsert.push(...fileData[tab]);
          }
        });
      }

      for (const slot of listToInsert) {
        if (!slot || !slot.id) continue;
        let subTab = 'recommended';
        if (slot.id.includes('videos') || slot.id.includes('main')) subTab = 'videos';
        else if (slot.id.includes('podcast') || slot.id.includes('pod')) subTab = 'podcast';

        await db.query(
          `INSERT INTO shorts (id, sub_tab, slot_number, video_url, platform, title, thumbnail_url, duration, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
            sub_tab = VALUES(sub_tab),
            slot_number = VALUES(slot_number),
            video_url = VALUES(video_url),
            platform = VALUES(platform),
            title = VALUES(title),
            thumbnail_url = VALUES(thumbnail_url),
            duration = VALUES(duration),
            status = VALUES(status);`,
          [
            slot.id,
            subTab,
            slot.slotNumber || 1,
            slot.videoUrl || '',
            slot.platform || 'Youtube Video',
            slot.title || '',
            slot.thumbnailUrl || null,
            slot.duration || '0:45',
            slot.status || 'Active'
          ]
        );
      }
    }
  } catch (err) {
    console.warn('MySQL shorts table init notice:', err.message);
  }
}
setImmediate(() => initShortsTable());

app.get('/api/shorts', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const [rows] = await db.query('SELECT * FROM shorts ORDER BY slot_number ASC, created_at ASC');
    if (rows && rows.length > 0) {
      const formattedSlots = rows.map((r) => ({
        id: r.id,
        slotNumber: r.slot_number,
        videoUrl: r.video_url,
        platform: r.platform,
        title: r.title,
        thumbnailUrl: r.thumbnail_url,
        duration: r.duration,
        status: r.status,
        subTab: r.sub_tab,
        createdAt: r.created_at
      }));
      return res.status(200).json({ success: true, slots: formattedSlots });
    }
  } catch (dbErr) {
    console.warn('MySQL Shorts Fetch Notice:', dbErr.message);
  }

  const shortsData = readJSONFile(SHORTS_FILE, {});
  let list = [];
  if (Array.isArray(shortsData)) list = shortsData;
  else if (typeof shortsData === 'object') {
    Object.keys(shortsData).forEach((tab) => {
      if (Array.isArray(shortsData[tab])) list.push(...shortsData[tab]);
    });
  }
  res.status(200).json({ success: true, slots: list });
});

app.post('/api/shorts', async (req, res) => {
  try {
    const { subTab, slots } = req.body;
    const incomingSlots = Array.isArray(slots) ? slots : (req.body && Array.isArray(req.body.slots) ? req.body.slots : []);

    if (incomingSlots.length === 0 && !subTab) {
      return res.status(400).json({ success: false, message: 'slots array required' });
    }

    const normSubTab = (subTab || 'recommended').toLowerCase();

    // 1. Upload thumbnail copy to Backblaze B2 under cover images/ folder if needed
    for (const slot of incomingSlots) {
      if (!slot || !slot.id) continue;

      if (slot.thumbnailUrl && !slot.thumbnailUrl.includes('backblazeb2.com')) {
        try {
          if (slot.thumbnailUrl.startsWith('data:image/')) {
            const b2Url = await uploadBase64ToB2(slot.thumbnailUrl, `cover_${Date.now()}.webp`, 'cover images');
            if (b2Url) slot.thumbnailUrl = b2Url;
          } else if (slot.thumbnailUrl.startsWith('http://') || slot.thumbnailUrl.startsWith('https://')) {
            const b2Url = await uploadRemoteUrlToB2(slot.thumbnailUrl, `cover_${Date.now()}`, 'cover images');
            if (b2Url) slot.thumbnailUrl = b2Url;
          }
        } catch (uploadErr) {
          console.error('Background Backblaze cover upload skipped:', uploadErr);
        }
      }

      // 2. Save / Update into MySQL `shorts` database table
      try {
        await db.query(
          `INSERT INTO shorts (id, sub_tab, slot_number, video_url, platform, title, thumbnail_url, duration, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
            sub_tab = VALUES(sub_tab),
            slot_number = VALUES(slot_number),
            video_url = VALUES(video_url),
            platform = VALUES(platform),
            title = VALUES(title),
            thumbnail_url = VALUES(thumbnail_url),
            duration = VALUES(duration),
            status = VALUES(status);`,
          [
            String(slot.id),
            normSubTab,
            Number(slot.slotNumber || 1),
            slot.videoUrl || '',
            slot.platform || 'Youtube Video',
            slot.title || '',
            slot.thumbnailUrl || null,
            slot.duration || '0:45',
            slot.status || 'Active'
          ]
        );
      } catch (dbErr) {
        console.warn(`MySQL Shorts Save Notice for ID ${slot.id}:`, dbErr.message);
      }
    }

    // 3. Update shorts.json backup
    const existingData = readJSONFile(SHORTS_FILE, {});
    if (typeof existingData === 'object' && !Array.isArray(existingData)) {
      existingData[normSubTab] = incomingSlots;
      writeJSONFile(SHORTS_FILE, existingData);
    } else {
      writeJSONFile(SHORTS_FILE, { [normSubTab]: incomingSlots });
    }

    // 4. Return fresh list from MySQL database
    try {
      const [rows] = await db.query('SELECT * FROM shorts ORDER BY created_at DESC, slot_number ASC');
      if (rows && rows.length > 0) {
        const formattedSlots = rows.map((r) => ({
          id: r.id,
          slotNumber: r.slot_number,
          videoUrl: r.video_url,
          platform: r.platform,
          title: r.title,
          thumbnailUrl: r.thumbnail_url,
          duration: r.duration,
          status: r.status,
          subTab: r.sub_tab,
          createdAt: r.created_at
        }));
        return res.status(200).json({ success: true, subTab: normSubTab, slots: formattedSlots });
      }
    } catch (e) {}

    res.status(200).json({ success: true, subTab: normSubTab, slots: incomingSlots });
  } catch (error) {
    console.error('Shorts Save API error:', error);
    res.status(500).json({ success: false, message: 'Failed to save shorts slots' });
  }
});

// Helper to format post row from MySQL to JS object
const formatPostRow = (row) => {
  let subs = [];
  try {
    subs = typeof row.subCategories === 'string' ? JSON.parse(row.subCategories) : (row.subCategories || []);
  } catch (e) {}

  let tagsArr = [];
  try {
    tagsArr = typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []);
  } catch (e) {}

  return {
    ...row,
    subCategories: Array.isArray(subs) ? subs : [],
    tags: Array.isArray(tagsArr) ? tagsArr : [],
    views: Number(row.views || 0),
    publishedAt: Number(row.publishedAt || 0),
  };
};

// ==========================================
// POSTS API ENDPOINTS (Active MySQL DB Storage + Backblaze B2)
// ==========================================
app.get('/api/posts', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const authorEmail = (req.query.authorEmail || '').toLowerCase().trim();
  try {
    let query = 'SELECT * FROM posts ORDER BY publishedAt DESC, created_at DESC';
    let params = [];
    if (authorEmail) {
      query = 'SELECT * FROM posts WHERE LOWER(authorEmail) = ? ORDER BY publishedAt DESC, created_at DESC';
      params = [authorEmail];
    }
    const [rows] = await db.query(query, params);
    if (rows && rows.length > 0) {
      const formatted = rows.map(formatPostRow);
      return res.status(200).json({ success: true, posts: formatted });
    }
  } catch (dbErr) {
    console.warn('MySQL Posts Fetch Notice:', dbErr.message);
  }

  const posts = readJSONFile(POSTS_FILE, []);
  if (authorEmail) {
    const filtered = posts.filter((p) => (p.authorEmail || '').toLowerCase().trim() === authorEmail);
    return res.status(200).json({ success: true, posts: filtered });
  }
  res.status(200).json({ success: true, posts });
});

app.post('/api/posts', async (req, res) => {
  try {
    const incomingPosts = req.body;
    let listToProcess = Array.isArray(incomingPosts) ? incomingPosts : [incomingPosts];

    for (const p of listToProcess) {
      if (!p || !p.id) continue;

      // 1. Upload thumbnail image to Backblaze B2 under articles/ if base64 data URI
      if (p.thumbnail && p.thumbnail.startsWith('data:image/')) {
        const b2Url = await uploadBase64ToB2(p.thumbnail, `thumb_${p.id}.webp`, 'articles');
        if (b2Url) p.thumbnail = b2Url;
      }

      // 2. Upload all inline body images in article HTML to Backblaze B2 under articles/
      if (p.bodyContent && p.bodyContent.includes('data:image/')) {
        p.bodyContent = await uploadAllBase64InHtml(p.bodyContent, `article_${p.id}`, 'articles');
      }

      // 3. Save / Update in MySQL posts table
      try {
        const insertQuery = `
          INSERT INTO posts (
            id, title, slug, subheadline, cardSummary, bodyContent, category,
            subCategories, homepagePlacement, author, authorEmail, status,
            thumbnail, photoCaption, tags, readDuration, views, publishedAt, date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            slug = VALUES(slug),
            subheadline = VALUES(subheadline),
            cardSummary = VALUES(cardSummary),
            bodyContent = VALUES(bodyContent),
            category = VALUES(category),
            subCategories = VALUES(subCategories),
            homepagePlacement = VALUES(homepagePlacement),
            author = VALUES(author),
            authorEmail = VALUES(authorEmail),
            status = VALUES(status),
            thumbnail = VALUES(thumbnail),
            photoCaption = VALUES(photoCaption),
            tags = VALUES(tags),
            readDuration = VALUES(readDuration),
            views = VALUES(views),
            publishedAt = VALUES(publishedAt),
            date = VALUES(date);
        `;

        await db.query(insertQuery, [
          String(p.id),
          p.title || '',
          p.slug || String(p.id),
          p.subheadline || null,
          p.cardSummary || null,
          p.bodyContent || null,
          p.category || null,
          JSON.stringify(p.subCategories || []),
          p.homepagePlacement || null,
          p.author || null,
          p.authorEmail || null,
          p.status || 'Draft',
          p.thumbnail || null,
          p.photoCaption || null,
          JSON.stringify(p.tags || []),
          p.readDuration || null,
          Number(p.views || 0),
          Number(p.publishedAt || Date.now()),
          p.date || null,
        ]);
      } catch (dbErr) {
        console.warn(`MySQL Post Save Notice for ID ${p.id}:`, dbErr.message);
      }
    }

    // Sync to posts.json backup
    let filePosts = readJSONFile(POSTS_FILE, []);
    if (Array.isArray(incomingPosts)) {
      filePosts = incomingPosts;
    } else if (incomingPosts && typeof incomingPosts === 'object') {
      const idx = filePosts.findIndex((p) => String(p.id) === String(incomingPosts.id));
      if (idx >= 0) filePosts[idx] = { ...filePosts[idx], ...incomingPosts };
      else filePosts.unshift(incomingPosts);
    }
    if (Array.isArray(filePosts)) {
      filePosts.sort((a, b) => (Number(b.publishedAt) || 0) - (Number(a.publishedAt) || 0));
    }
    writeJSONFile(POSTS_FILE, filePosts);

    // Return fresh list from MySQL
    try {
      const [rows] = await db.query('SELECT * FROM posts ORDER BY publishedAt DESC, created_at DESC');
      if (rows && rows.length > 0) {
        const formatted = rows.map(formatPostRow);
        return res.status(200).json({ success: true, posts: formatted });
      }
    } catch (e) {}

    res.status(200).json({ success: true, posts: filePosts });
  } catch (error) {
    console.error('Error saving posts:', error);
    res.status(500).json({ success: false, message: 'Failed to save posts' });
  }
});

// Delete post endpoint (Active MySQL DB + Backup)
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await db.query('DELETE FROM posts WHERE id = ?', [String(id)]);
    } catch (dbErr) {}

    let posts = readJSONFile(POSTS_FILE, []);
    posts = posts.filter((p) => String(p.id) !== String(id));
    writeJSONFile(POSTS_FILE, posts);

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});

const db = require('./config/db');

// ==========================================
// SAVED ARTICLES API ENDPOINTS (MySQL DB + JSON Backup)
// ==========================================
app.get('/api/saved-articles', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const userEmail = (req.query.email || '').toLowerCase().trim();

  try {
    let query = 'SELECT * FROM saved_articles ORDER BY created_at DESC';
    let params = [];
    if (userEmail) {
      query = 'SELECT * FROM saved_articles WHERE LOWER(user_email) = ? ORDER BY created_at DESC';
      params = [userEmail];
    }
    const [rows] = await db.query(query, params);
    if (rows && rows.length > 0) {
      const savedList = rows.map((r) => {
        try {
          return typeof r.article_data === 'string' ? JSON.parse(r.article_data) : r.article_data;
        } catch (e) {
          return { id: r.article_id, user_email: r.user_email };
        }
      });
      return res.status(200).json({ success: true, saved: savedList });
    }
  } catch (dbErr) {
    console.warn('MySQL Saved Articles Fetch Notice:', dbErr.message);
  }

  const saved = readJSONFile(SAVED_FILE, []);
  if (userEmail) {
    const filtered = saved.filter((s) => (s.user_email || s.userEmail || '').toLowerCase().trim() === userEmail);
    return res.status(200).json({ success: true, saved: filtered });
  }
  res.status(200).json({ success: true, saved });
});

app.post('/api/saved-articles', async (req, res) => {
  try {
    const incomingSaved = req.body;
    let itemsToProcess = Array.isArray(incomingSaved) ? incomingSaved : [incomingSaved];

    for (const item of itemsToProcess) {
      if (!item || (!item.id && !item.article_id)) continue;
      const articleId = String(item.id || item.article_id);
      const email = String(item.user_email || item.userEmail || item.authorEmail || 'reader@gmail.com').toLowerCase().trim();

      try {
        await db.query(
          `INSERT INTO saved_articles (user_email, article_id, article_data)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE article_data = VALUES(article_data);`,
          [email, articleId, JSON.stringify(item)]
        );
      } catch (dbErr) {
        console.warn('MySQL Saved Article Insert Notice:', dbErr.message);
      }
    }

    let existingSaved = readJSONFile(SAVED_FILE, []);
    if (Array.isArray(incomingSaved)) {
      const postedEmails = new Set(incomingSaved.map((item) => String(item.user_email || item.userEmail || '').toLowerCase().trim()).filter(Boolean));
      if (postedEmails.size > 0) {
        existingSaved = existingSaved.filter((s) => {
          const sEmail = String(s.user_email || s.userEmail || '').toLowerCase().trim();
          return !postedEmails.has(sEmail);
        });
        existingSaved = [...incomingSaved, ...existingSaved];
      } else {
        existingSaved = incomingSaved;
      }
    } else if (incomingSaved && typeof incomingSaved === 'object') {
      const targetEmail = String(incomingSaved.user_email || incomingSaved.userEmail || '').toLowerCase().trim();
      const targetId = String(incomingSaved.id || incomingSaved.article_id || '');
      const idx = existingSaved.findIndex((s) => {
        const sEmail = String(s.user_email || s.userEmail || '').toLowerCase().trim();
        const sId = String(s.id || s.article_id || '');
        return sEmail === targetEmail && sId === targetId;
      });
      if (idx >= 0) existingSaved[idx] = { ...existingSaved[idx], ...incomingSaved };
      else existingSaved.unshift(incomingSaved);
    }
    writeJSONFile(SAVED_FILE, existingSaved);

    res.status(200).json({ success: true, saved: existingSaved });
  } catch (error) {
    console.error('Error saving articles:', error);
    res.status(500).json({ success: false, message: 'Failed to save article' });
  }
});

app.delete('/api/saved-articles', async (req, res) => {
  const email = (req.query.email || req.body?.email || '').toLowerCase().trim();
  const articleId = String(req.query.articleId || req.body?.articleId || '');

  if (!email) {
    return res.status(400).json({ success: false, message: 'User email is required' });
  }

  try {
    if (articleId) {
      try {
        await db.query(
          'DELETE FROM saved_articles WHERE LOWER(user_email) = ? AND (article_id = ? OR LOWER(article_id) = ?)',
          [email, articleId, articleId.toLowerCase()]
        );
      } catch (dbErr) {
        console.warn('MySQL Saved Article Delete Notice:', dbErr.message);
      }

      let saved = readJSONFile(SAVED_FILE, []);
      saved = saved.filter((s) => {
        const sEmail = (s.user_email || s.userEmail || '').toLowerCase().trim();
        const sId = String(s.id || s.article_id || '');
        if (sEmail === email && (sId === articleId || sId.toLowerCase() === articleId.toLowerCase())) {
          return false;
        }
        return true;
      });
      writeJSONFile(SAVED_FILE, saved);
    } else {
      try {
        await db.query('DELETE FROM saved_articles WHERE LOWER(user_email) = ?', [email]);
      } catch (dbErr) {}

      let saved = readJSONFile(SAVED_FILE, []);
      saved = saved.filter((s) => (s.user_email || s.userEmail || '').toLowerCase().trim() !== email);
      writeJSONFile(SAVED_FILE, saved);
    }

    return res.status(200).json({ success: true, message: 'Saved article(s) removed successfully' });
  } catch (error) {
    console.error('Error removing saved article:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove saved article' });
  }
});

// ==========================================
// NEWSLETTER SUBSCRIPTIONS API ENDPOINTS
// ==========================================
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

app.get('/api/newsletter', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const [rows] = await db.query('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC');
    if (rows && rows.length > 0) {
      const formatted = rows.map((r) => {
        let newslettersArr = ["US", "WORLD", "BUSINESS"];
        if (Array.isArray(r.newsletters)) {
          newslettersArr = r.newsletters;
        } else if (typeof r.newsletters === 'string') {
          try {
            const parsed = JSON.parse(r.newsletters);
            if (Array.isArray(parsed)) newslettersArr = parsed;
          } catch (e) {}
        }
        return {
          id: r.id,
          email: r.email,
          newsletters: newslettersArr,
          subscribed_at: r.subscribed_at
        };
      });
      return res.status(200).json({ success: true, subscribers: formatted });
    }
  } catch (dbErr) {}

  const subscribers = readJSONFile(NEWSLETTER_FILE, []);
  res.status(200).json({ success: true, subscribers });
});

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, newsletters } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const topicsArr = Array.isArray(newsletters) ? newsletters : ["US", "WORLD", "BUSINESS"];

    try {
      await db.query(
        `INSERT INTO newsletter_subscriptions (email, newsletters) VALUES (?, ?) ON DUPLICATE KEY UPDATE newsletters = VALUES(newsletters);`,
        [cleanEmail, JSON.stringify(topicsArr)]
      );
    } catch (dbErr) {
      console.warn('MySQL Newsletter Insert Notice:', dbErr.message);
    }

    let subscribers = readJSONFile(NEWSLETTER_FILE, []);
    if (!subscribers.some((s) => (typeof s === 'string' ? s : s.email) === cleanEmail)) {
      subscribers.unshift({
        id: 'sub_' + Date.now(),
        email: cleanEmail,
        newsletters: topicsArr,
        subscribedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      writeJSONFile(NEWSLETTER_FILE, subscribers);
    }

    res.status(200).json({ success: true, message: 'Successfully subscribed to newsletter', email: cleanEmail, newsletters: topicsArr });
  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
});

app.delete('/api/newsletter', async (req, res) => {
  try {
    const email = (req.body?.email || req.query?.email || '').toLowerCase().trim();
    const emails = Array.isArray(req.body?.emails) ? req.body.emails.map((e) => String(e).toLowerCase().trim()) : [];
    if (email) emails.push(email);

    if (emails.length > 0) {
      try {
        const placeholders = emails.map(() => '?').join(',');
        await db.query(`DELETE FROM newsletter_subscriptions WHERE LOWER(email) IN (${placeholders})`, emails);
      } catch (dbErr) {
        console.warn('MySQL Newsletter Delete Notice:', dbErr.message);
      }

      let subscribers = readJSONFile(NEWSLETTER_FILE, []);
      subscribers = subscribers.filter((s) => !emails.includes((typeof s === 'string' ? s : s.email || '').toLowerCase().trim()));
      writeJSONFile(NEWSLETTER_FILE, subscribers);
    }

    try {
      const [rows] = await db.query('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC');
      return res.status(200).json({ success: true, subscribers: rows });
    } catch (e) {}

    const subscribers = readJSONFile(NEWSLETTER_FILE, []);
    res.status(200).json({ success: true, subscribers });
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to delete subscription' });
  }
});

// USER PROFILES & ACCOUNTS MANAGEMENT API ENDPOINTS (MySQL DB + JSON)
// ==========================================
const DEFAULT_ADMIN_EMAILS = [
  'akramyoonos006@gmail.com',
  'geethliyanage979@gmail.com',
  'timeschicago17@gmail.com',
];

// Helper to seed default admin accounts if missing in MySQL / JSON
async function seedDefaultAdmins() {
  const bcrypt = require('bcryptjs');
  const defaultAdmins = [
    {
      full_name: 'Akram Yanoos',
      email: 'akramyoonos006@gmail.com',
      plainPassword: 'Admin123',
      role: 'admin',
      bio: 'Default System Administrator',
      avatar_url: '',
    },
    {
      full_name: 'Geeth Liyanage',
      email: 'geethliyanage979@gmail.com',
      plainPassword: 'Admin123',
      role: 'admin',
      bio: 'Default System Administrator',
      avatar_url: '',
    },
    {
      full_name: 'Times Chicago',
      email: 'timeschicago17@gmail.com',
      plainPassword: 'times+chicago1724##',
      role: 'admin',
      bio: 'Default System Administrator',
      avatar_url: '',
    },
  ];

  try {
    // Ensure columns exist and have correct types
    try {
      await db.query('ALTER TABLE users ADD COLUMN is_default_admin TINYINT(1) DEFAULT 0');
    } catch (colErr) {}
    try {
      await db.query('ALTER TABLE users MODIFY COLUMN avatar_url LONGTEXT DEFAULT NULL');
    } catch (colErr) {}

    // Reset non-default admin flags in MySQL
    try {
      await db.query(
        "UPDATE users SET is_default_admin = 0 WHERE LOWER(email) NOT IN ('akramyoonos006@gmail.com', 'geethliyanage979@gmail.com', 'timeschicago17@gmail.com')"
      );
    } catch (e) {}

    for (const admin of defaultAdmins) {
      const lowerEmail = admin.email.toLowerCase();
      const defaultPass = await bcrypt.hash(admin.plainPassword, 10);
      try {
        const [rows] = await db.query('SELECT id FROM users WHERE LOWER(email) = ?', [lowerEmail]);
        if (rows.length === 0) {
          await db.query(
            'INSERT INTO users (full_name, email, password, role, bio, avatar_url, is_default_admin) VALUES (?, ?, ?, ?, ?, ?, 1)',
            [admin.full_name, admin.email, defaultPass, 'admin', admin.bio, admin.avatar_url]
          );
        } else {
          await db.query(
            'UPDATE users SET full_name = ?, role = ?, is_default_admin = 1 WHERE LOWER(email) = ?',
            [admin.full_name, 'admin', lowerEmail]
          );
        }
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Default admin seeding notice:', err.message);
  }

  // Backup to JSON file
  try {
    const usersMap = readJSONFile(USERS_FILE, {});
    // Reset non-default admin flags in JSON map
    Object.keys(usersMap).forEach((emailKey) => {
      if (!DEFAULT_ADMIN_EMAILS.includes(emailKey)) {
        usersMap[emailKey].is_default_admin = false;
      }
    });

    for (const admin of defaultAdmins) {
      const lower = admin.email.toLowerCase();
      if (!usersMap[lower]) {
        usersMap[lower] = {
          full_name: admin.full_name,
          email: admin.email,
          role: 'admin',
          bio: admin.bio,
          avatar_url: '',
          is_default_admin: true,
        };
      } else {
        usersMap[lower].full_name = admin.full_name;
        usersMap[lower].role = 'admin';
        usersMap[lower].is_default_admin = true;
      }
    }
    writeJSONFile(USERS_FILE, usersMap);
  } catch (e) {}
}
seedDefaultAdmins();

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, full_name, email, role, bio, avatar_url, linkedin, is_default_admin, created_at FROM users ORDER BY id ASC');
    const usersList = rows.map((u) => ({
      ...u,
      is_default_admin: Boolean(u.is_default_admin),
    }));
    const usersMap = {};
    usersList.forEach((u) => {
      usersMap[u.email.toLowerCase()] = u;
    });
    res.status(200).json({ success: true, users: usersMap, list: usersList });
  } catch (dbErr) {
    const users = readJSONFile(USERS_FILE, {});
    const usersList = Object.values(users).map((u) => ({
      ...u,
      is_default_admin: Boolean(u.is_default_admin),
    }));
    res.status(200).json({ success: true, users, list: usersList });
  }
});

app.get('/api/users/:email', async (req, res) => {
  const email = (req.params.email || '').toLowerCase().trim();
  try {
    const [rows] = await db.query('SELECT id, full_name, email, role, bio, avatar_url, linkedin, is_default_admin FROM users WHERE LOWER(email) = ?', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      user.is_default_admin = Boolean(user.is_default_admin);
      return res.status(200).json({ success: true, user });
    }
  } catch (dbErr) {}

  const users = readJSONFile(USERS_FILE, {});
  if (users[email]) {
    const user = users[email];
    user.is_default_admin = Boolean(user.is_default_admin);
    return res.status(200).json({ success: true, user });
  }
  res.status(404).json({ success: false, message: 'User not found' });
});

// Update Profile endpoint
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    if (!userData || !userData.email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const email = userData.email.toLowerCase().trim();
    const fullName = userData.full_name || userData.name || '';
    const bio = userData.bio !== undefined ? userData.bio : null;
    let avatarUrl = userData.avatar_url || userData.image || userData.avatar || null;
    const linkedin = userData.linkedin || userData.linkedinUrl || null;
    const role = userData.role || null;

    if (avatarUrl && avatarUrl.startsWith('data:image/')) {
      try {
        const b2AvatarUrl = await uploadBase64ToB2(avatarUrl, `avatar_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.webp`, 'avatars');
        if (b2AvatarUrl) {
          avatarUrl = b2AvatarUrl;
        }
      } catch (b2Err) {}
      userData.avatar_url = avatarUrl;
      userData.image = avatarUrl;
    }

    try {
      await db.query(
        `UPDATE users SET 
           full_name = COALESCE(NULLIF(?, ''), full_name),
           role = COALESCE(?, role),
           bio = COALESCE(?, bio),
           avatar_url = ?,
           linkedin = COALESCE(?, linkedin)
         WHERE LOWER(email) = ?`,
        [fullName, role, bio, avatarUrl, linkedin, email]
      );
    } catch (dbErr) {
      console.warn("MySQL Profile Update Notice:", dbErr.message);
    }

    const usersMap = readJSONFile(USERS_FILE, {});
    usersMap[email] = { ...(usersMap[email] || {}), ...userData, avatar_url: avatarUrl, email };
    writeJSONFile(USERS_FILE, usersMap);

    try {
      const [rows] = await db.query('SELECT id, full_name, email, role, bio, avatar_url, linkedin, is_default_admin FROM users WHERE LOWER(email) = ?', [email]);
      if (rows.length > 0) {
        const user = rows[0];
        user.is_default_admin = Boolean(user.is_default_admin);
        return res.status(200).json({ success: true, user });
      }
    } catch (e) {}

    const user = usersMap[email];
    user.is_default_admin = Boolean(user?.is_default_admin);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ success: false, message: 'Failed to save user profile' });
  }
});

// Create New User (Add User button)
app.post('/api/users/add', async (req, res) => {
  const bcrypt = require('bcryptjs');
  try {
    const { name, full_name, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userName = name || full_name || 'New User';
    const userRole = (role || 'reader').toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // 1. Check if user already exists
    try {
      const [existing] = await db.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }
    } catch (e) {}

    // 2. Insert into MySQL
    let newId = Date.now();
    try {
      const [result] = await db.query(
        'INSERT INTO users (full_name, email, password, role, bio, is_default_admin) VALUES (?, ?, ?, ?, ?, 0)',
        [userName, cleanEmail, hashedPassword, userRole, 'Registered Website Member']
      );
      if (result.insertId) newId = result.insertId;
    } catch (dbErr) {
      console.warn('MySQL Add User Notice:', dbErr.message);
    }

    // 3. Backup to JSON
    const usersMap = readJSONFile(USERS_FILE, {});
    usersMap[cleanEmail] = {
      id: newId,
      full_name: userName,
      email: cleanEmail,
      role: userRole,
      bio: 'Registered Website Member',
      is_default_admin: false,
    };
    writeJSONFile(USERS_FILE, usersMap);

    const newUser = {
      id: newId,
      full_name: userName,
      email: cleanEmail,
      role: userRole,
      is_default_admin: false,
    };

    return res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error adding new user:', err);
    res.status(500).json({ success: false, message: 'Failed to create user.' });
  }
});

// Edit Existing User
app.put('/api/users/edit', async (req, res) => {
  const bcrypt = require('bcryptjs');
  try {
    const { id, full_name, name, email, role, password, bio, linkedin } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required for edit.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userName = full_name || name;
    const userRole = role ? role.toLowerCase().trim() : undefined;

    // MySQL Update
    try {
      if (password && password.trim().length > 0) {
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        await db.query(
          'UPDATE users SET full_name = COALESCE(?, full_name), role = COALESCE(?, role), password = ?, bio = COALESCE(?, bio), linkedin = COALESCE(?, linkedin) WHERE LOWER(email) = ?',
          [userName, userRole, hashedPassword, bio, linkedin, cleanEmail]
        );
      } else {
        await db.query(
          'UPDATE users SET full_name = COALESCE(?, full_name), role = COALESCE(?, role), bio = COALESCE(?, bio), linkedin = COALESCE(?, linkedin) WHERE LOWER(email) = ?',
          [userName, userRole, bio, linkedin, cleanEmail]
        );
      }

      // Propagate updated name to posts table for articles written by this author email
      if (userName && userName.trim().length > 0) {
        await db.query(
          'UPDATE posts SET author = ? WHERE LOWER(authorEmail) = ?',
          [userName.trim(), cleanEmail]
        );
      }
    } catch (e) {}

    // JSON update
    const usersMap = readJSONFile(USERS_FILE, {});
    if (usersMap[cleanEmail]) {
      if (userName) usersMap[cleanEmail].full_name = userName;
      if (userRole) usersMap[cleanEmail].role = userRole;
      if (bio !== undefined) usersMap[cleanEmail].bio = bio;
      if (linkedin !== undefined) usersMap[cleanEmail].linkedin = linkedin;
      writeJSONFile(USERS_FILE, usersMap);
    }

    // JSON posts update
    if (userName && userName.trim().length > 0) {
      try {
        const postsList = readJSONFile(POSTS_FILE, []);
        let updatedPosts = false;
        postsList.forEach((p) => {
          if ((p.authorEmail || '').toLowerCase().trim() === cleanEmail) {
            p.author = userName.trim();
            updatedPosts = true;
          }
        });
        if (updatedPosts) {
          writeJSONFile(POSTS_FILE, postsList);
        }
      } catch (e) {}
    }

    return res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    console.error('Error editing user:', err);
    res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
});

// Delete User
app.delete('/api/users/:email', async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    try {
      const [rows] = await db.query('SELECT is_default_admin FROM users WHERE LOWER(email) = ?', [email]);
      if (rows.length > 0 && rows[0].is_default_admin) {
        return res.status(403).json({ success: false, message: 'Default Admin accounts cannot be deleted.' });
      }
    } catch (e) {}

    try {
      await db.query('DELETE FROM users WHERE LOWER(email) = ?', [email]);
    } catch (e) {}

    const usersMap = readJSONFile(USERS_FILE, {});
    if (usersMap[email]) {
      delete usersMap[email];
      writeJSONFile(USERS_FILE, usersMap);
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
});

// AD SLOTS API ENDPOINTS (MySQL DB + Backblaze B2 Persistence)
// ==========================================
async function initAdSlotsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS wsj_ad_slots (
        id VARCHAR(64) PRIMARY KEY,
        slot_name VARCHAR(255) NOT NULL,
        dimension VARCHAR(64) NOT NULL,
        placement_group VARCHAR(64) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE,
        action_type VARCHAR(128) DEFAULT 'External Link (URL)',
        target_url TEXT,
        selected_article_slug VARCHAR(255),
        image_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.warn('MySQL initAdSlotsTable Notice:', err.message);
  }
}
initAdSlotsTable();

const SLOT_NAME_MAP = {
  hp_slot_1: 'Homepage ad 1',
  hp_slot_2: 'Homepage ad 2',
  hp_slot_3: 'Homepage ad 3',
  hp_slot_4: 'Homepage ad 4',
  hp_slot_5: 'Homepage ad 5',
  hp_slot_6: 'Homepage ad 6',
  hp_slot_7: 'Homepage ad 7',
  cat_slot_1: 'Category Page ad 1',
  cat_slot_2: 'Category Page ad 2',
  author_slot_1: 'Writer Page ad 1',
};

app.get('/api/ads', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM wsj_ad_slots ORDER BY id ASC');
    if (rows.length > 0) {
      const formatted = rows.map((r) => ({
        id: r.id,
        slotName: SLOT_NAME_MAP[r.id] || r.slot_name,
        dimension: r.dimension,
        placementGroup: r.placement_group,
        description: r.description,
        active: Boolean(r.active),
        actionType: r.action_type || 'External Link (URL)',
        targetUrl: r.target_url || '',
        selectedArticleSlug: r.selected_article_slug || '',
        imageUrl: r.image_url || '',
      }));
      return res.status(200).json({ success: true, slots: formatted });
    }
  } catch (dbErr) {
    console.warn('MySQL Fetch Ads Notice:', dbErr.message);
  }

  const fileSlots = readJSONFile(ADS_FILE, []);
  const normalizedFileSlots = fileSlots.map((s) => ({
    ...s,
    slotName: SLOT_NAME_MAP[s.id] || s.slotName,
  }));
  return res.status(200).json({ success: true, slots: normalizedFileSlots });
});

app.post('/api/ads', async (req, res) => {
  try {
    const { slots, slot } = req.body;
    const targetSlots = slots || (slot ? [slot] : []);
    if (!targetSlots || targetSlots.length === 0) {
      return res.status(400).json({ success: false, message: 'No ad slot data provided' });
    }

    // Process images: if any image is base64, upload to Backblaze B2 under 'ads' folder
    for (let s of targetSlots) {
      s.slotName = SLOT_NAME_MAP[s.id] || s.slotName;
      if (s.imageUrl && s.imageUrl.startsWith('data:image/')) {
        const b2Url = await uploadBase64ToB2(s.imageUrl, `ad_${s.id}_${Date.now()}.webp`, 'ads');
        if (b2Url) {
          s.imageUrl = b2Url;
        }
      }

      // Upsert into MySQL
      try {
        await db.query(
          `INSERT INTO wsj_ad_slots (id, slot_name, dimension, placement_group, description, active, action_type, target_url, selected_article_slug, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             slot_name = VALUES(slot_name),
             dimension = VALUES(dimension),
             placement_group = VALUES(placement_group),
             description = VALUES(description),
             active = VALUES(active),
             action_type = VALUES(action_type),
             target_url = VALUES(target_url),
             selected_article_slug = VALUES(selected_article_slug),
             image_url = VALUES(image_url)`,
          [
            s.id,
            SLOT_NAME_MAP[s.id] || s.slotName || s.id,
            s.dimension || '300x250',
            s.placementGroup || 'Homepage',
            s.description || '',
            s.active !== false ? 1 : 0,
            s.actionType || 'External Link (URL)',
            s.targetUrl || '',
            s.selectedArticleSlug || '',
            s.imageUrl || '',
          ]
        );
      } catch (dbErr) {
        console.warn('MySQL Upsert Ad Notice:', dbErr.message);
      }
    }

    // Backup to persistent JSON file
    writeJSONFile(ADS_FILE, targetSlots);

    return res.status(200).json({ success: true, slots: targetSlots });
  } catch (error) {
    console.error('Error saving ad configuration:', error);
    res.status(500).json({ success: false, message: 'Failed to save ad configuration' });
  }
});



// ==========================================
// DATABASE BACKUPS & CLOUD RESTORE API ENDPOINTS
// ==========================================
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

const seedDefaultBackups = () => {
  const defaultFiles = [
    { name: 'db_backup_manual_2026_09_09_15_04_15.json', time: '2026-09-09T15:04:15.000Z' },
    { name: 'db_backup_manual_2026_09_08_08_32_57.json', time: '2026-09-08T08:32:57.000Z' },
    { name: 'db_backup_manual_2026_08_11_15_28_29.json', time: '2026-08-11T15:28:29.000Z' },
    { name: 'db_backup_2026_09_09.json', time: '2026-09-09T06:03:00.000Z' },
  ];

  defaultFiles.forEach((item) => {
    const fPath = path.join(BACKUPS_DIR, item.name);
    if (!fs.existsSync(fPath)) {
      const users = readJSONFile(USERS_FILE, []);
      const posts = readJSONFile(POSTS_FILE, []);
      const subscribers = readJSONFile(path.join(DATA_DIR, 'subscribers.json'), []);
      const ads = readJSONFile(ADS_FILE, []);
      const shorts = readJSONFile(SHORTS_FILE, []);

      const dummySnapshot = {
        backupVersion: '1.0',
        created_at: item.time,
        users,
        posts,
        subscribers,
        ads,
        shorts,
      };

      fs.writeFileSync(fPath, JSON.stringify(dummySnapshot, null, 2));
    }
  });
};
seedDefaultBackups();

const { listBackblazeFiles, deleteBackblazeFile, downloadBackblazeFile } = require('./lib/backblazeB2');

function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDateFormatted(dStr) {
  const dateObj = new Date(dStr);
  if (isNaN(dateObj.getTime())) return String(dStr);
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// GET /api/backups - List all available backups from B2 & local directory
app.get('/api/backups', async (req, res) => {
  try {
    const b2Files = await listBackblazeFiles('backups/');
    const backupsMap = new Map();

    // Add B2 files
    b2Files.forEach((f) => {
      const cleanName = f.fileName.replace(/^backups\//, '');
      if (cleanName.endsWith('.json')) {
        backupsMap.set(cleanName, {
          fileName: cleanName,
          fileId: f.fileId,
          backupDate: formatDateFormatted(f.uploadTimestamp || Date.now()),
          timestamp: f.uploadTimestamp || Date.now(),
          size: f.contentLength || 0,
          sizeFormatted: formatBytes(f.contentLength || 0),
          publicUrl: f.downloadUrl,
          source: 'B2 Cloud',
        });
      }
    });

    // Add local backup files if missing or offline
    if (fs.existsSync(BACKUPS_DIR)) {
      const localFiles = fs.readdirSync(BACKUPS_DIR);
      localFiles.forEach((file) => {
        if (file.endsWith('.json') && !backupsMap.has(file)) {
          const filePath = path.join(BACKUPS_DIR, file);
          const stats = fs.statSync(filePath);
          backupsMap.set(file, {
            fileName: file,
            fileId: null,
            backupDate: formatDateFormatted(stats.mtime),
            timestamp: stats.mtimeMs,
            size: stats.size,
            sizeFormatted: formatBytes(stats.size),
            publicUrl: null,
            source: 'Local',
          });
        }
      });
    }

    const backupsList = Array.from(backupsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
    return res.status(200).json({ success: true, backups: backupsList });
  } catch (err) {
    console.error('Error fetching backups list:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch backups list' });
  }
});

// POST /api/backups/create - Create B2 Backup Snapshot
app.post('/api/backups/create', async (req, res) => {
  try {
    const { payload } = req.body || {};

    // 1. Fetch latest active state from MySQL / JSON files
    let posts = [];
    try {
      const [rows] = await db.query('SELECT * FROM posts ORDER BY publishedAt DESC, created_at DESC');
      if (rows && rows.length > 0) {
        posts = rows.map(formatPostRow);
      } else {
        posts = readJSONFile(POSTS_FILE, []);
      }
    } catch (e) {
      posts = readJSONFile(POSTS_FILE, []);
    }

    let users = [];
    try {
      const [rows] = await db.query('SELECT id, full_name, email, role, bio, avatar_url, linkedin, is_default_admin FROM users ORDER BY id ASC');
      if (rows && rows.length > 0) {
        users = rows.map((u) => ({ ...u, is_default_admin: Boolean(u.is_default_admin) }));
      } else {
        const uMap = readJSONFile(USERS_FILE, {});
        users = Object.values(uMap);
      }
    } catch (e) {
      const uMap = readJSONFile(USERS_FILE, {});
      users = Object.values(uMap);
    }

    let subscribers = [];
    try {
      const [rows] = await db.query('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC');
      if (rows && rows.length > 0) {
        subscribers = rows.map((r) => {
          let newslettersArr = ["US", "WORLD", "BUSINESS"];
          if (Array.isArray(r.newsletters)) newslettersArr = r.newsletters;
          else if (typeof r.newsletters === 'string') {
            try { const parsed = JSON.parse(r.newsletters); if (Array.isArray(parsed)) newslettersArr = parsed; } catch (e) {}
          }
          return { id: r.id, email: r.email, newsletters: newslettersArr, subscribed_at: r.subscribed_at };
        });
      } else {
        subscribers = readJSONFile(NEWSLETTER_FILE, []);
      }
    } catch (e) {
      subscribers = readJSONFile(NEWSLETTER_FILE, []);
    }

    // Filter for published posts only
    const publishedPosts = posts.filter(
      (p) => p && p.status && ['published', 'approved'].includes(String(p.status).toLowerCase())
    );

    let contactSubmissions = [];
    try {
      const [rows] = await db.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
      contactSubmissions = rows || [];
    } catch (e) {
      contactSubmissions = payload?.contact_submissions || payload?.contactSubmissions || [];
    }

    let advertiseLeads = [];
    try {
      const [rows] = await db.query('SELECT * FROM advertise_leads ORDER BY created_at DESC');
      advertiseLeads = rows || [];
    } catch (e) {
      advertiseLeads = payload?.advertise_leads || payload?.advertiseLeads || [];
    }

    const snapshot = {
      backupVersion: '1.0',
      created_at: new Date().toISOString(),
      published_posts: publishedPosts,
      subscribers: subscribers,
      users: users,
      contact_submissions: contactSubmissions,
      advertise_leads: advertiseLeads,
    };

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
    const fileName = `db_backup_manual_${timeStr}.json`;

    const jsonBuffer = Buffer.from(JSON.stringify(snapshot, null, 2), 'utf-8');

    // 1. Save locally
    const localPath = path.join(BACKUPS_DIR, fileName);
    fs.writeFileSync(localPath, jsonBuffer);

    // 2. Upload to Backblaze B2 under 'backups' folder
    let b2Url = null;
    try {
      b2Url = await uploadToBackblazeB2(jsonBuffer, fileName, 'application/json', 'backups');
    } catch (e) {
      console.warn('B2 cloud upload warning:', e.message);
    }

    const backupItem = {
      fileName,
      backupDate: formatDateFormatted(now),
      timestamp: now.getTime(),
      size: jsonBuffer.length,
      sizeFormatted: formatBytes(jsonBuffer.length),
      publicUrl: b2Url,
    };

    return res.status(200).json({ success: true, backup: backupItem, message: 'Backup created and uploaded successfully!' });
  } catch (err) {
    console.error('Error creating backup:', err);
    return res.status(500).json({ success: false, message: 'Failed to create backup snapshot' });
  }
});

async function restoreDatabaseSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return false;

  // Normalize array/object data
  const postsList = Array.isArray(snapshot.published_posts)
    ? snapshot.published_posts
    : Array.isArray(snapshot.posts)
    ? snapshot.posts
    : [];
  let usersList = [];
  if (Array.isArray(snapshot.users)) {
    usersList = snapshot.users;
  } else if (snapshot.users && typeof snapshot.users === 'object') {
    usersList = Object.values(snapshot.users);
  }

  const usersMap = {};
  usersList.forEach((u) => {
    if (u && u.email) {
      usersMap[u.email.toLowerCase().trim()] = u;
    }
  });

  const subsList = Array.isArray(snapshot.subscribers) ? snapshot.subscribers : [];
  const contactList = Array.isArray(snapshot.contact_submissions)
    ? snapshot.contact_submissions
    : Array.isArray(snapshot.contactSubmissions)
    ? snapshot.contactSubmissions
    : [];
  const advertiseList = Array.isArray(snapshot.advertise_leads)
    ? snapshot.advertise_leads
    : Array.isArray(snapshot.advertiseLeads)
    ? snapshot.advertiseLeads
    : [];
  const adsList = Array.isArray(snapshot.ads) ? snapshot.ads : [];
  const shortsList = Array.isArray(snapshot.shorts) ? snapshot.shorts : [];

  // 1. Overwrite persistent JSON files completely
  if (postsList && postsList.length > 0) writeJSONFile(POSTS_FILE, postsList);
  if (Object.keys(usersMap).length > 0) writeJSONFile(USERS_FILE, usersMap);
  if (subsList && subsList.length > 0) {
    writeJSONFile(path.join(DATA_DIR, 'subscribers.json'), subsList);
    writeJSONFile(NEWSLETTER_FILE, subsList);
  }
  if (adsList && adsList.length > 0) writeJSONFile(ADS_FILE, adsList);
  if (shortsList && shortsList.length > 0) writeJSONFile(SHORTS_FILE, shortsList);

  // 2. Sync & purge extra records in MySQL database if connected
  try {
    // Restoring Posts Table
    if (postsList && postsList.length > 0) {
      await db.query('DELETE FROM posts').catch((err) => console.warn('MySQL Delete posts notice:', err.message));
      for (let p of postsList) {
        if (!p || !p.id) continue;
        const insertQuery = `
          INSERT INTO posts (
            id, title, slug, subheadline, cardSummary, bodyContent, category,
            subCategories, homepagePlacement, author, authorEmail, status,
            thumbnail, photoCaption, tags, readDuration, views, publishedAt, date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(insertQuery, [
          String(p.id),
          p.title || '',
          p.slug || String(p.id),
          p.subheadline || null,
          p.cardSummary || p.excerpt || null,
          p.bodyContent || null,
          p.category || null,
          JSON.stringify(p.subCategories || []),
          p.homepagePlacement || null,
          p.author || null,
          p.authorEmail || null,
          p.status || 'Published',
          p.thumbnail || null,
          p.photoCaption || null,
          JSON.stringify(p.tags || []),
          p.readDuration || null,
          Number(p.views || 0),
          Number(p.publishedAt || Date.now()),
          p.date || null,
        ]).catch((err) => console.warn('MySQL Restore Post Error:', err.message));
      }
    }

    // Restoring Users Table
    if (usersList && usersList.length > 0) {
      await db.query('DELETE FROM users').catch((err) => console.warn('MySQL Delete users notice:', err.message));
      const bcrypt = require('bcryptjs');
      const defaultPasswordHash = await bcrypt.hash('Admin123', 10);
      for (let u of usersList) {
        if (!u || !u.email) continue;
        const cleanEmail = u.email.toLowerCase().trim();
        const isDefault = DEFAULT_ADMIN_EMAILS.includes(cleanEmail) || u.is_default_admin ? 1 : 0;
        await db.query(
          `INSERT INTO users (full_name, email, password, role, bio, avatar_url, linkedin, is_default_admin)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            u.full_name || u.name || 'User',
            cleanEmail,
            u.password || defaultPasswordHash,
            (u.role || 'reader').toLowerCase().trim(),
            u.bio || '',
            u.avatar_url || '',
            u.linkedin || '',
            isDefault,
          ]
        ).catch((err) => console.warn('MySQL Restore User Error:', err.message));
      }
    }

    // Restoring Newsletter Subscriptions Table
    if (subsList && subsList.length > 0) {
      await db.query('DELETE FROM newsletter_subscriptions').catch((err) => console.warn('MySQL Delete subscribers notice:', err.message));
      for (let s of subsList) {
        if (!s) continue;
        const email = (typeof s === 'string' ? s : s.email || '').toLowerCase().trim();
        if (!email) continue;
        const topicsArr = Array.isArray(s.newsletters) ? s.newsletters : ["US", "WORLD", "BUSINESS"];
        await db.query(
          `INSERT INTO newsletter_subscriptions (email, newsletters) VALUES (?, ?)`,
          [email, JSON.stringify(topicsArr)]
        ).catch((err) => console.warn('MySQL Restore Subscriptions Error:', err.message));
      }
    }

    // Restoring Contact Submissions Table
    if (contactList && contactList.length > 0) {
      await db.query('DELETE FROM contact_submissions').catch((err) => console.warn('MySQL Delete contact_submissions notice:', err.message));
      for (let c of contactList) {
        if (!c) continue;
        await db.query(
          `INSERT INTO contact_submissions (id, name, company, email, phone, whatsapp, inquiry_type, details, message, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.id || `contact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            c.name || '',
            c.company || '',
            c.email || '',
            c.phone || '',
            c.whatsapp || '',
            c.inquiry_type || c.inquiryType || 'General / Others',
            c.details || c.message || '',
            c.message || c.details || '',
            c.status || 'New',
            c.created_at || new Date().toISOString(),
          ]
        ).catch((err) => console.warn('MySQL Restore Contact Submissions Error:', err.message));
      }
    }

    // Restoring Advertise Leads Table
    if (advertiseList && advertiseList.length > 0) {
      await db.query('DELETE FROM advertise_leads').catch((err) => console.warn('MySQL Delete advertise_leads notice:', err.message));
      for (let a of advertiseList) {
        if (!a) continue;
        await db.query(
          `INSERT INTO advertise_leads (id, name, company, email, phone, whatsapp, service_option, details, requirements, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            a.id || `adv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            a.name || '',
            a.company || '',
            a.email || '',
            a.phone || '',
            a.whatsapp || '',
            a.service_option || a.serviceOption || 'Publish Company Article',
            a.details || a.requirements || '',
            a.requirements || a.details || '',
            a.status || 'New',
            a.created_at || new Date().toISOString(),
          ]
        ).catch((err) => console.warn('MySQL Restore Advertise Leads Error:', err.message));
      }
    }

    // Restoring Ad Slots Table
    if (adsList && adsList.length > 0) {
      await db.query('DELETE FROM wsj_ad_slots').catch((err) => console.warn('MySQL Delete ads notice:', err.message));
      for (let s of adsList) {
        if (!s || !s.id) continue;
        await db.query(
          `INSERT INTO wsj_ad_slots (id, slot_name, dimension, placement_group, description, active, action_type, target_url, selected_article_slug, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            s.id,
            SLOT_NAME_MAP[s.id] || s.slotName || s.id,
            s.dimension || '300x250',
            s.placementGroup || 'Homepage',
            s.description || '',
            s.active !== false ? 1 : 0,
            s.actionType || 'External Link (URL)',
            s.targetUrl || '',
            s.selectedArticleSlug || '',
            s.imageUrl || '',
          ]
        ).catch((err) => console.warn('MySQL Restore Ads Error:', err.message));
      }
    }

    // Restoring Shorts & Reels Table
    if (shortsList && shortsList.length > 0) {
      await db.query('DELETE FROM shorts').catch((err) => console.warn('MySQL Delete shorts notice:', err.message));
      for (let s of shortsList) {
        if (!s || !s.id) continue;
        let subTab = s.subTab || 'recommended';
        if (s.id.includes('videos') || s.id.includes('main')) subTab = 'videos';
        else if (s.id.includes('podcast') || s.id.includes('pod')) subTab = 'podcast';

        await db.query(
          `INSERT INTO shorts (id, sub_tab, slot_number, video_url, platform, title, thumbnail_url, duration, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            String(s.id),
            subTab,
            Number(s.slotNumber || 1),
            s.videoUrl || '',
            s.platform || 'Youtube Video',
            s.title || '',
            s.thumbnailUrl || null,
            s.duration || '0:45',
            s.status || 'Active',
          ]
        ).catch((err) => console.warn('MySQL Restore Shorts Error:', err.message));
      }
    }
  } catch (dbErr) {
    console.warn('MySQL restore sync notice:', dbErr.message);
  }

  return true;
}

// POST /api/backups/upload-restore - Upload JSON File & Restore
app.post('/api/backups/upload-restore', async (req, res) => {
  try {
    const { snapshot, fileName } = req.body;
    if (!snapshot || typeof snapshot !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid or missing JSON snapshot data' });
    }

    const targetName = fileName || `db_backup_upload_${Date.now()}.json`;
    const jsonBuffer = Buffer.from(JSON.stringify(snapshot, null, 2), 'utf-8');

    // 1. Save to local backups
    fs.writeFileSync(path.join(BACKUPS_DIR, targetName), jsonBuffer);

    // 2. Upload to B2
    uploadToBackblazeB2(jsonBuffer, targetName, 'application/json', 'backups').catch(() => {});

    // 3. Perform full database restoration
    await restoreDatabaseSnapshot(snapshot);

    return res.status(200).json({
      success: true,
      snapshot,
      message: 'Website database restored successfully from JSON backup!',
    });
  } catch (err) {
    console.error('Error uploading restore:', err);
    return res.status(500).json({ success: false, message: 'Failed to process uploaded JSON backup' });
  }
});

// POST /api/backups/restore - Restore from existing backup file
app.post('/api/backups/restore', async (req, res) => {
  try {
    const { fileName } = req.body;
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'fileName is required' });
    }

    let snapshotStr = null;
    const localPath = path.join(BACKUPS_DIR, fileName);
    if (fs.existsSync(localPath)) {
      snapshotStr = fs.readFileSync(localPath, 'utf-8');
    } else {
      snapshotStr = await downloadBackblazeFile(`backups/${fileName}`);
    }

    if (!snapshotStr) {
      return res.status(404).json({ success: false, message: 'Backup snapshot file not found' });
    }

    const snapshot = JSON.parse(snapshotStr);
    await restoreDatabaseSnapshot(snapshot);

    return res.status(200).json({
      success: true,
      snapshot,
      message: `Website database restored successfully from ${fileName}!`,
    });
  } catch (err) {
    console.error('Error restoring backup:', err);
    return res.status(500).json({ success: false, message: 'Failed to restore backup snapshot' });
  }
});

// DELETE /api/backups/:fileName - Delete backup file
app.delete('/api/backups/:fileName', async (req, res) => {
  try {
    const fileName = req.params.fileName;
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'fileName required' });
    }

    const localPath = path.join(BACKUPS_DIR, fileName);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    await deleteBackblazeFile(`backups/${fileName}`);

    return res.status(200).json({ success: true, message: 'Backup file deleted successfully' });
  } catch (err) {
    console.error('Error deleting backup:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete backup' });
  }
});

// --- Contact Us Submissions API ---
async function ensureContactSubmissionsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        whatsapp VARCHAR(100),
        company VARCHAR(255),
        inquiry_type VARCHAR(100) DEFAULT 'General / Others',
        details TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const columnsToAdd = [
      { name: 'phone', type: "VARCHAR(100)" },
      { name: 'whatsapp', type: "VARCHAR(100)" },
      { name: 'company', type: "VARCHAR(255)" },
      { name: 'inquiry_type', type: "VARCHAR(100) DEFAULT 'General / Others'" },
      { name: 'details', type: "TEXT" },
      { name: 'status', type: "VARCHAR(50) DEFAULT 'New'" },
      { name: 'created_at', type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ];

    for (const col of columnsToAdd) {
      try {
        await db.query(`ALTER TABLE contact_submissions ADD COLUMN ${col.name} ${col.type}`);
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Contact table error:', e.message);
  }
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, whatsapp, company, inquiryType, details } = req.body || {};
    if (!name || !email || !details) {
      return res.status(400).json({ success: false, message: 'Name, email, and inquiry details are required' });
    }
    await ensureContactSubmissionsTable();
    await db.query(
      `INSERT INTO contact_submissions (name, email, phone, whatsapp, company, inquiry_type, details, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'New')`,
      [name, email, phone || null, whatsapp || null, company || null, inquiryType || 'General / Others', details]
    );
    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your inquiry has been submitted successfully.',
    });
  } catch (err) {
    console.error('Error handling contact submission:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    await ensureContactSubmissionsTable();
    const [rows] = await db.query(`SELECT * FROM contact_submissions ORDER BY created_at DESC`);
    return res.status(200).json({ success: true, submissions: rows });
  } catch (err) {
    console.error('Error fetching contact submissions:', err);
    return res.status(500).json({ success: false, submissions: [] });
  }
});

app.put('/api/contact/:id', async (req, res) => {
  try {
    const { status } = req.body || {};
    const { id } = req.params;
    await ensureContactSubmissionsTable();
    await db.query(`UPDATE contact_submissions SET status = ? WHERE id = ?`, [status, id]);
    return res.status(200).json({ success: true, message: 'Status updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ensureContactSubmissionsTable();
    await db.query(`DELETE FROM contact_submissions WHERE id = ?`, [id]);
    return res.status(200).json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Advertise Leads API ---
async function ensureAdvertiseLeadsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS advertise_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        service_option VARCHAR(100) NOT NULL,
        phone VARCHAR(100),
        whatsapp VARCHAR(100),
        details TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const columnsToAdd = [
      { name: 'company', type: "VARCHAR(255)" },
      { name: 'service_option', type: "VARCHAR(100) DEFAULT 'Publish Company Article'" },
      { name: 'phone', type: "VARCHAR(100)" },
      { name: 'whatsapp', type: "VARCHAR(100)" },
      { name: 'details', type: "TEXT" },
      { name: 'status', type: "VARCHAR(50) DEFAULT 'New'" },
      { name: 'created_at', type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ];

    for (const col of columnsToAdd) {
      try {
        await db.query(`ALTER TABLE advertise_leads ADD COLUMN ${col.name} ${col.type}`);
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Advertise table error:', e.message);
  }
}

app.post('/api/advertise-leads', async (req, res) => {
  try {
    const { name, company, email, serviceOption, phone, whatsapp, details } = req.body || {};
    if (!name || !company || !email || !details) {
      return res.status(400).json({ success: false, message: 'Name, company, email, and details are required' });
    }
    await ensureAdvertiseLeadsTable();
    await db.query(
      `INSERT INTO advertise_leads (name, company, email, service_option, phone, whatsapp, details, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'New')`,
      [name, company, email, serviceOption || 'Publish Company Article', phone || null, whatsapp || null, details]
    );
    return res.status(200).json({
      success: true,
      message: 'Your advertising request has been submitted successfully!',
    });
  } catch (err) {
    console.error('Error handling advertise lead submission:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/advertise-leads', async (req, res) => {
  try {
    await ensureAdvertiseLeadsTable();
    const [rows] = await db.query(`SELECT * FROM advertise_leads ORDER BY created_at DESC`);
    return res.status(200).json({ success: true, leads: rows });
  } catch (err) {
    console.error('Error fetching advertise leads:', err);
    return res.status(500).json({ success: false, leads: [] });
  }
});

app.put('/api/advertise-leads/:id', async (req, res) => {
  try {
    const { status } = req.body || {};
    const { id } = req.params;
    await ensureAdvertiseLeadsTable();
    await db.query(`UPDATE advertise_leads SET status = ? WHERE id = ?`, [status, id]);
    return res.status(200).json({ success: true, message: 'Status updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/advertise-leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ensureAdvertiseLeadsTable();
    await db.query(`DELETE FROM advertise_leads WHERE id = ?`, [id]);
    return res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Root & Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'WSJ Express Backend Server Running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'WSJ Express Backend Server Running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 WSJ Backend Server running on http://localhost:${PORT}`);
  console.log(`=================================`);
});
