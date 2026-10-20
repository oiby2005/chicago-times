const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const { contactLimiter, advertiseLimiter, subscribeLimiter, commentsLimiter } = require('./middlewares/rateLimiter');
const { protect, requireAdmin, requireWriterOrAdmin, optionalAuth } = require('./middlewares/authMiddleware');
const { validateUrlForSsrf } = require('./lib/ssrfValidator');
const { sanitizeArticleHtml, stripHtml } = require('./lib/htmlSanitizer');
const { getQuotaStatus, checkAllContributorsQuota } = require('./controllers/contributorController');

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
const PORT = process.env.PORT || 5000;

// HTTP Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows Frontend (port 3000) to fetch static images and audio from Backend
  crossOriginEmbedderPolicy: false, // Allows cross-origin media embedding (Backblaze B2, Unsplash, YouTube)
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Allows Google OAuth login popup without COOP conflicts
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  contentSecurityPolicy: false, // Prevents interfering with JSON API payloads
  xFrameOptions: { action: "sameorigin" }, // Clickjacking protection
  xContentTypeOptions: true, // MIME-sniffing protection
  hidePoweredBy: true, // Removes X-Powered-By
}));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(cookieParser());

// Request Body Parsing with Strict DoS / Payload Size Protection
// Standard routes (auth, comments, contact, subscriptions) are capped at 1MB to prevent RAM exhaustion / DoS
// Only routes handling rich media, full articles, and database snapshots are allocated 50MB
const LARGE_PAYLOAD_PATHS = [
  '/api/posts',
  '/api/upload',
  '/api/backups',
  '/api/billionaires',
  '/api/entrepreneurs',
  '/api/users',
];

app.use((req, res, next) => {
  const isLargePermitted = LARGE_PAYLOAD_PATHS.some((p) => req.path.startsWith(p));
  const limit = isLargePermitted ? '50mb' : '1mb';
  express.json({ limit })(req, res, (err) => {
    if (err) {
      if (err.type === 'entity.too.large') {
        return res.status(413).json({
          success: false,
          message: `Request payload too large. Maximum permitted body size is ${limit}.`,
        });
      }
      return next(err);
    }
    express.urlencoded({ extended: true, limit })(req, res, next);
  });
});

app.use(express.static(path.join(__dirname, '../Frontend/public')));

// Data directory for backups
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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

// Contributor Quota Status Endpoint & Periodic Monitor
app.get('/api/contributors/quota-status', optionalAuth, getQuotaStatus);
setTimeout(() => {
  checkAllContributorsQuota();
  setInterval(checkAllContributorsQuota, 10 * 60 * 1000);
}, 5000);

const { uploadBase64ToB2, uploadToBackblazeB2, uploadAllBase64InHtml, uploadRemoteUrlToB2, uploadAllExternalImagesInHtml } = require('./lib/backblazeB2');

function unwrapWebpProxyUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('webp-proxy') && url.includes('url=')) {
    try {
      let target = url;
      while (target.includes('webp-proxy') && target.includes('url=')) {
        const match = target.match(/url=([^&]+)/);
        if (match && match[1]) {
          const decoded = decodeURIComponent(match[1]);
          if (decoded && (decoded.startsWith('http') || decoded.startsWith('/'))) {
            target = decoded;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      return target;
    } catch (e) {}
  }
  return url;
}

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
// HUMAN-LIKE JOURNALIST AI VOICE (TTS) ENDPOINTS
// ==========================================
const { AUDIO_CACHE_DIR, generateArticleSpeech } = require('./lib/ttsService');

app.post('/api/tts/generate', async (req, res) => {
  try {
    const { slug, title, deck, bodyContent, voice } = req.body || {};
    if (!title && !bodyContent) {
      return res.status(400).json({ success: false, message: 'Article title or content required' });
    }

    const result = await generateArticleSpeech({
      slug,
      title,
      deck,
      bodyContent,
      voice: voice || 'en-US-ChristopherNeural',
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('TTS Generation error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to synthesize audio' });
  }
});

app.get('/api/tts/audio/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const safeName = path.basename(fileName);
    const filePath = path.join(AUDIO_CACHE_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Audio file not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };

      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error('Audio stream error:', err);
    res.status(500).end();
  }
});

// ==========================================
// BACKBLAZE B2 IMAGE UPLOAD ENDPOINT
// ==========================================
app.post('/api/upload', requireWriterOrAdmin, async (req, res) => {
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

// Upload remote URL or base64 to Backblaze B2
app.post('/api/upload-url', requireWriterOrAdmin, async (req, res) => {
  try {
    const { url, imageBase64, folder } = req.body || {};
    const targetFolder = folder || 'articles';

    if (url && typeof url === 'string') {
      const cleanUrl = url.trim();
      if (cleanUrl.includes('f005.backblazeb2.com')) {
        return res.status(200).json({ success: true, url: cleanUrl });
      }
      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        const b2Url = await uploadRemoteUrlToB2(cleanUrl, `article_img_${Date.now()}`, targetFolder);
        if (b2Url) {
          return res.status(200).json({ success: true, url: b2Url });
        }
      }
      if (cleanUrl.startsWith('data:image/')) {
        const b2Url = await uploadBase64ToB2(cleanUrl, `article_img_${Date.now()}.webp`, targetFolder);
        if (b2Url) {
          return res.status(200).json({ success: true, url: b2Url });
        }
      }
    }

    if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.startsWith('data:image/')) {
      const b2Url = await uploadBase64ToB2(imageBase64, `article_img_${Date.now()}.webp`, targetFolder);
      if (b2Url) {
        return res.status(200).json({ success: true, url: b2Url });
      }
    }

    return res.status(400).json({ success: false, message: 'Could not upload image URL to Backblaze B2' });
  } catch (error) {
    console.error('Upload URL API error:', error);
    res.status(500).json({ success: false, message: 'Failed to process image URL upload' });
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

    // SSRF Protection: Validate target URL against private/internal IPs, localhost, cloud metadata, and forbidden ports
    const ssrfCheck = await validateUrlForSsrf(trimmedUrl);
    if (!ssrfCheck.valid || !ssrfCheck.parsedUrl) {
      return res.status(403).json({ success: false, message: ssrfCheck.reason || 'Forbidden URL destination' });
    }

    const parsedHost = ssrfCheck.parsedUrl.hostname.toLowerCase();
    const isAllowedPlatform =
      parsedHost === 'apple.com' || parsedHost.endsWith('.apple.com') ||
      parsedHost === 'spotify.com' || parsedHost.endsWith('.spotify.com') ||
      parsedHost === 'youtube.com' || parsedHost.endsWith('.youtube.com') || parsedHost === 'youtu.be' ||
      parsedHost === 'amazon.com' || parsedHost.endsWith('.amazon.com') ||
      parsedHost === 'rumble.com' || parsedHost.endsWith('.rumble.com') ||
      parsedHost === 'facebook.com' || parsedHost.endsWith('.facebook.com') || parsedHost === 'fb.watch' ||
      parsedHost === 'instagram.com' || parsedHost.endsWith('.instagram.com');

    if (!isAllowedPlatform) {
      return res.status(400).json({ success: false, message: 'URL is not from a supported video or audio platform' });
    }

    let platform = 'Youtube Video';
    if (parsedHost === 'apple.com' || parsedHost.endsWith('.apple.com')) {
      platform = 'Apple Podcasts';
    } else if (parsedHost === 'spotify.com' || parsedHost.endsWith('.spotify.com')) {
      platform = 'Spotify';
    } else if (parsedHost === 'music.youtube.com') {
      platform = 'YouTube Music';
    } else if (parsedHost === 'amazon.com' || parsedHost.endsWith('.amazon.com')) {
      platform = 'Amazon Music';
    } else if (parsedHost === 'youtube.com' || parsedHost.endsWith('.youtube.com') || parsedHost === 'youtu.be') {
      platform = trimmedUrl.toLowerCase().includes('/shorts/') ? 'YouTube Shorts' : 'Youtube Video';
    } else if (parsedHost === 'rumble.com' || parsedHost.endsWith('.rumble.com')) {
      platform = 'Rumble Video';
    } else if (parsedHost === 'facebook.com' || parsedHost.endsWith('.facebook.com') || parsedHost === 'fb.watch') {
      platform = 'Facebook Short';
    } else if (parsedHost === 'instagram.com' || parsedHost.endsWith('.instagram.com')) {
      platform = 'Instagram shorts';
    }

    let rawTitle = '';
    let rawThumbnailUrl = '';
    let rawAudioUrl = '';
    let formattedDuration = '0:45';

    // 0A. Apple Podcasts
    if (parsedHost === 'apple.com' || parsedHost.endsWith('.apple.com')) {
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

          // Match specific episode streamUrl using episode ID parameter i=...
          let streamUrlMatch = null;
          const iMatch = trimmedUrl.match(/i=(\d+)/);
          if (iMatch && iMatch[1]) {
            const epId = iMatch[1];
            let pos = 0;
            while ((pos = html.indexOf(epId, pos)) !== -1) {
              const chunk = html.slice(Math.max(0, pos - 1500), Math.min(html.length, pos + 1500));
              const chunkMatch = (
                chunk.match(/"streamUrl"\s*:\s*"([^"]+)"/i) ||
                chunk.match(/"assetUrl"\s*:\s*"([^"]+)"/i)
              )?.[1];
              if (chunkMatch && !chunkMatch.includes('.m3u8')) {
                streamUrlMatch = chunkMatch;
                break;
              }
              pos += epId.length;
            }
          }
          if (!streamUrlMatch) {
            streamUrlMatch = (
              html.match(/"streamUrl"\s*:\s*"([^"]+)"/i) ||
              html.match(/"assetUrl"\s*:\s*"([^"]+)"/i) ||
              html.match(/https:\/\/[^"'\s>]+\.(?:mp3|m4a|aac)/i)
            )?.[1];
          }

          if (streamUrlMatch) {
            rawAudioUrl = decodeURIComponent(streamUrlMatch.replace(/\\/g, ''));
          }
        }

        // Query iTunes Lookup API for direct episode MP3 audio URL if HTML scraping didn't find one
        if (!rawAudioUrl) {
          const idMatch = trimmedUrl.match(/id(\d+)/);
          if (idMatch && idMatch[1]) {
            const itunesRes = await fetchWithTimeout(`https://itunes.apple.com/lookup?id=${idMatch[1]}&entity=podcastEpisode`, {}, 3000);
            if (itunesRes.ok) {
              const itunesData = await itunesRes.json();
              if (itunesData && Array.isArray(itunesData.results) && itunesData.results.length > 0) {
                const ep = itunesData.results.find(r => r.episodeUrl) || itunesData.results[0];
                if (ep && ep.episodeUrl) {
                  rawAudioUrl = ep.episodeUrl;
                }
              }
            }
          }
        }
      } catch (e) {}
    }

    // 0B. Spotify
    if (parsedHost === 'spotify.com' || parsedHost.endsWith('.spotify.com')) {
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

        // Fetch Spotify Embed page to extract Spotify's official direct 320kbps audio preview URL
        let embedPageUrl = trimmedUrl;
        if (trimmedUrl.includes('open.spotify.com/') && !trimmedUrl.includes('/embed/')) {
          embedPageUrl = trimmedUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
        }
        const embedRes = await fetchWithTimeout(embedPageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          }
        }, 3000);
        if (embedRes.ok) {
          const embedHtml = await embedRes.text();
          const mp3Match = embedHtml.match(/https:\/\/p\.scdn\.co\/mp3-preview\/[a-zA-Z0-9]+/);
          if (mp3Match && mp3Match[0]) {
            rawAudioUrl = mp3Match[0];
          }
        }
      } catch (e) {}
    }

    // 0C. Amazon Music
    if (parsedHost === 'amazon.com' || parsedHost.endsWith('.amazon.com')) {
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

    // 1. YouTube & YouTube Music
    const ytMatch = trimmedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|music\.youtube\.com\/watch\?v=)([\w-]{11})/i);
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

      // Direct high-quality audio stream extraction for YouTube & YouTube Music
      try {
        const playerRes = await fetchWithTimeout('https://www.youtube.com/youtubei/v1/player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Android; VR) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          },
          body: JSON.stringify({
            videoId: ytId,
            context: {
              client: {
                clientName: 'ANDROID_VR',
                clientVersion: '1.54.30',
                deviceMake: 'Oculus',
                deviceModel: 'Quest 3',
                osName: 'Android',
                osVersion: '12',
                hl: 'en',
                gl: 'US'
              }
            }
          })
        }, 3500);

        if (playerRes.ok) {
          const playerData = await playerRes.json();
          if (playerData.streamingData && Array.isArray(playerData.streamingData.adaptiveFormats)) {
            const audioFormats = playerData.streamingData.adaptiveFormats.filter(
              f => f.mimeType && f.mimeType.startsWith('audio/') && f.url
            );
            if (audioFormats.length > 0) {
              const mp4Audio = audioFormats.filter(f => f.mimeType.includes('audio/mp4'));
              const target = mp4Audio.length > 0 ? mp4Audio : audioFormats;
              target.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
              rawAudioUrl = target[0].url;
            }
          }
        }
      } catch (audioErr) {}
    }

    // 2. Rumble
    if (parsedHost === 'rumble.com' || parsedHost.endsWith('.rumble.com')) {
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
    if (parsedHost === 'instagram.com' || parsedHost.endsWith('.instagram.com')) {
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
    if (parsedHost === 'facebook.com' || parsedHost.endsWith('.facebook.com') || parsedHost === 'fb.watch') {
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
      audioUrl: rawAudioUrl,
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
        audio_url TEXT DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;
    await db.query(createTableSql);
    try { await db.query('ALTER TABLE shorts ADD COLUMN audio_url TEXT DEFAULT NULL'); } catch (e) {}
    console.log('✅ MySQL shorts table initialized/verified.');

    // Cleanup legacy non-canonical IDs or duplicate slot entries in MySQL shorts table
    try {
      await db.query(`DELETE FROM shorts WHERE id IN ('podcast_1', 'podcast_2', 'podcast_3', 'videos_slot_1', 'videos_slot_2', 'videos_slot_3', 'videos_slot_4', 'main_v_1', 'main_v_2', 'main_v_3', 'main_v_4', 'main_slot_1', 'main_slot_2', 'main_slot_3', 'main_slot_4')`);
      await db.query(`UPDATE shorts SET sub_tab = 'recommended' WHERE id LIKE 'recommended_slot_%' OR id LIKE 'rec%'`);
      await db.query(`UPDATE shorts SET sub_tab = 'videos' WHERE id LIKE 'video_slot_%' OR id LIKE 'videos_%' OR id LIKE 'main_%'`);
      await db.query(`UPDATE shorts SET sub_tab = 'podcast' WHERE id LIKE 'podcast_slot_%' OR id LIKE 'pod%'`);
    } catch (cleanErr) {}

    // Shorts table ready
  } catch (err) {
    console.warn('MySQL shorts table init notice:', err.message);
  }
}
setImmediate(() => initShortsTable());

app.get('/api/shorts', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  try {
    const [rows] = await db.query('SELECT * FROM shorts ORDER BY updated_at DESC, created_at DESC');
    if (rows && rows.length > 0) {
      // Deduplicate by category + slot_number keeping latest updated row
      const seenMap = new Map();
      rows.forEach((r) => {
        let cat = (r.sub_tab || 'recommended').toLowerCase();
        if (r.id?.includes('video') || r.id?.includes('main')) cat = 'videos';
        else if (r.id?.includes('podcast') || r.id?.includes('pod')) cat = 'podcast';
        else if (r.id?.includes('recommended') || r.id?.startsWith('rec')) cat = 'recommended';

        const key = `${cat}_${r.slot_number}`;
        if (!seenMap.has(key)) {
          seenMap.set(key, {
            id: r.id,
            slotNumber: r.slot_number,
            videoUrl: r.video_url,
            platform: r.platform,
            title: r.title,
            thumbnailUrl: r.thumbnail_url,
            duration: r.duration,
            status: r.status,
            audioUrl: r.audio_url || r.audioUrl || '',
            subTab: cat,
            createdAt: r.created_at
          });
        }
      });
      return res.status(200).json({ success: true, slots: Array.from(seenMap.values()) });
    }
    return res.status(200).json({ success: true, slots: [] });
  } catch (dbErr) {
    console.error('MySQL Shorts Fetch Error:', dbErr.message);
    return res.status(500).json({ success: false, slots: [], message: dbErr.message });
  }
});

app.post('/api/shorts', requireAdmin, async (req, res) => {
  try {
    const { subTab, slots } = req.body;
    const incomingSlots = Array.isArray(slots) ? slots : (req.body && Array.isArray(req.body.slots) ? req.body.slots : []);

    if (incomingSlots.length === 0 && !subTab) {
      return res.status(400).json({ success: false, message: 'slots array required' });
    }

    const normSubTab = (subTab || 'recommended').toLowerCase();

    // 1. Upload thumbnail copy to Backblaze B2 under cover images/ folder if needed & auto-extract audioUrl if missing
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

      // Auto-extract audioUrl for podcast slots whenever videoUrl is present
      if ((normSubTab === 'podcast' || slot.id?.includes('podcast')) && slot.videoUrl) {
        slot.audioUrl = ''; // Reset audioUrl before extracting for new videoUrl
        try {
          const videoSsrf = await validateUrlForSsrf(slot.videoUrl.trim());
          if (videoSsrf.valid && videoSsrf.parsedUrl) {
            const pHost = videoSsrf.parsedUrl.hostname.toLowerCase();
            if (pHost === 'apple.com' || pHost.endsWith('.apple.com')) {
              const podRes = await fetchWithTimeout(slot.videoUrl.trim(), {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              }, 3000);
              if (podRes.ok) {
                const html = await podRes.text();
                let streamUrlMatch = null;
                const iMatch = slot.videoUrl.trim().match(/i=(\d+)/);
                if (iMatch && iMatch[1]) {
                  const epId = iMatch[1];
                  let pos = 0;
                  while ((pos = html.indexOf(epId, pos)) !== -1) {
                    const chunk = html.slice(Math.max(0, pos - 1500), Math.min(html.length, pos + 1500));
                    const chunkMatch = (
                      chunk.match(/"streamUrl"\s*:\s*"([^"]+)"/i) ||
                      chunk.match(/"assetUrl"\s*:\s*"([^"]+)"/i)
                    )?.[1];
                    if (chunkMatch && !chunkMatch.includes('.m3u8')) {
                      streamUrlMatch = chunkMatch;
                      break;
                    }
                    pos += epId.length;
                  }
                }
                if (!streamUrlMatch) {
                  streamUrlMatch = (
                    html.match(/"streamUrl"\s*:\s*"([^"]+)"/i) ||
                    html.match(/"assetUrl"\s*:\s*"([^"]+)"/i) ||
                    html.match(/https:\/\/[^"'\s>]+\.(?:mp3|m4a|aac)/i)
                  )?.[1];
                }
                if (streamUrlMatch) {
                  slot.audioUrl = decodeURIComponent(streamUrlMatch.replace(/\\/g, ''));
                }
              }
            } else if (pHost === 'spotify.com' || pHost.endsWith('.spotify.com')) {
              let embedUrl = slot.videoUrl.trim();
              if (embedUrl.includes('open.spotify.com/') && !embedUrl.includes('/embed/')) {
                embedUrl = embedUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
              }
              const spotRes = await fetchWithTimeout(embedUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
              }, 3000);
              if (spotRes.ok) {
                const html = await spotRes.text();
                const match = html.match(/https:\/\/p\.scdn\.co\/mp3-preview\/[a-zA-Z0-9]+/);
                if (match && match[0]) slot.audioUrl = match[0];
              }
            } else if (pHost === 'youtube.com' || pHost.endsWith('.youtube.com') || pHost === 'youtu.be') {
              const ytMatch = slot.videoUrl.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|music\.youtube\.com\/watch\?v=)([\w-]{11})/i);
              if (ytMatch && ytMatch[1]) {
                const ytId = ytMatch[1];
                const playerRes = await fetchWithTimeout('https://www.youtube.com/youtubei/v1/player', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Android; VR) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
                  },
                  body: JSON.stringify({
                    videoId: ytId,
                    context: {
                      client: {
                        clientName: 'ANDROID_VR',
                        clientVersion: '1.54.30',
                        deviceMake: 'Oculus',
                        deviceModel: 'Quest 3',
                        osName: 'Android',
                        osVersion: '12',
                        hl: 'en',
                        gl: 'US'
                      }
                    }
                  })
                }, 3500);

                if (playerRes.ok) {
                  const playerData = await playerRes.json();
                  if (playerData.streamingData && Array.isArray(playerData.streamingData.adaptiveFormats)) {
                    const audioFormats = playerData.streamingData.adaptiveFormats.filter(
                      f => f.mimeType && f.mimeType.startsWith('audio/') && f.url
                    );
                    if (audioFormats.length > 0) {
                      const mp4Audio = audioFormats.filter(f => f.mimeType.includes('audio/mp4'));
                      const target = mp4Audio.length > 0 ? mp4Audio : audioFormats;
                      target.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                      slot.audioUrl = target[0].url;
                    }
                  }
                }
              }
            } else if (slot.videoUrl.toLowerCase().endsWith('.mp3') || slot.videoUrl.toLowerCase().endsWith('.m4a') || slot.videoUrl.toLowerCase().endsWith('.wav')) {
              slot.audioUrl = slot.videoUrl.trim();
            }
          }
        } catch (audioExtractErr) {}
      }

      // 2. Save / Update into MySQL `shorts` database table
      try {
        const canonicalPrefix = normSubTab === 'podcast' ? 'podcast' : normSubTab === 'videos' ? 'video' : 'recommended';
        const canonicalId = `${canonicalPrefix}_slot_${slot.slotNumber || 1}`;
        slot.id = canonicalId;

        // Delete any existing entries for this slot_number in this category or with legacy IDs
        await db.query(
          `DELETE FROM shorts WHERE (sub_tab = ? AND slot_number = ?) OR id = ? OR id = ? OR id = ? OR id = ? OR id = ?`,
          [
            normSubTab,
            Number(slot.slotNumber || 1),
            canonicalId,
            `podcast_${slot.slotNumber}`,
            `videos_slot_${slot.slotNumber}`,
            `main_v_${slot.slotNumber}`,
            `main_slot_${slot.slotNumber}`
          ]
        ).catch(() => {});

        await db.query(
          `INSERT INTO shorts (id, sub_tab, slot_number, video_url, platform, title, thumbnail_url, duration, status, audio_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
            sub_tab = VALUES(sub_tab),
            slot_number = VALUES(slot_number),
            video_url = VALUES(video_url),
            platform = VALUES(platform),
            title = VALUES(title),
            thumbnail_url = VALUES(thumbnail_url),
            duration = VALUES(duration),
            status = VALUES(status),
            audio_url = VALUES(audio_url);`,
          [
            canonicalId,
            normSubTab,
            Number(slot.slotNumber || 1),
            slot.videoUrl || '',
            slot.platform || 'Youtube Video',
            slot.title || '',
            slot.thumbnailUrl || null,
            slot.duration || '0:45',
            slot.status || 'Active',
            slot.audioUrl || null
          ]
        );
      } catch (dbErr) {
        console.warn(`MySQL Shorts Save Notice for ID ${slot.id}:`, dbErr.message);
      }
    }

    // 3. Return fresh list from MySQL database
    try {
      const [rows] = await db.query('SELECT * FROM shorts ORDER BY updated_at DESC, created_at DESC');
      if (rows && rows.length > 0) {
        const seenMap = new Map();
        rows.forEach((r) => {
          let cat = (r.sub_tab || 'recommended').toLowerCase();
          if (r.id?.includes('video') || r.id?.includes('main')) cat = 'videos';
          else if (r.id?.includes('podcast') || r.id?.includes('pod')) cat = 'podcast';
          else if (r.id?.includes('recommended') || r.id?.startsWith('rec')) cat = 'recommended';

          const key = `${cat}_${r.slot_number}`;
          if (!seenMap.has(key)) {
            seenMap.set(key, {
              id: r.id,
              slotNumber: r.slot_number,
              videoUrl: r.video_url,
              platform: r.platform,
              title: r.title,
              thumbnailUrl: r.thumbnail_url,
              duration: r.duration,
              status: r.status,
              audioUrl: r.audio_url || r.audioUrl || '',
              subTab: cat,
              createdAt: r.created_at
            });
          }
        });
        return res.status(200).json({ success: true, subTab: normSubTab, slots: Array.from(seenMap.values()) });
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

  let imageSeoKeywordsArr = [];
  try {
    imageSeoKeywordsArr = typeof row.imageSeoKeywords === 'string' ? JSON.parse(row.imageSeoKeywords) : (row.imageSeoKeywords || []);
  } catch (e) {}

  let targetedEmailsArr = [];
  try {
    targetedEmailsArr = typeof row.targetedEmails === 'string' ? JSON.parse(row.targetedEmails) : (row.targetedEmails || []);
  } catch (e) {}

  let subWritersArr = [];
  try {
    subWritersArr = typeof row.sub_writers === 'string' ? JSON.parse(row.sub_writers) : (row.sub_writers || []);
  } catch (e) {}

  const cleanThumb = unwrapWebpProxyUrl(row.thumbnail || '');

  return {
    ...row,
    thumbnail: cleanThumb,
    subCategories: Array.isArray(subs) ? subs : [],
    tags: Array.isArray(tagsArr) ? tagsArr : [],
    imageSeoKeywords: Array.isArray(imageSeoKeywordsArr) ? imageSeoKeywordsArr : [],
    targetedEmails: Array.isArray(targetedEmailsArr) ? targetedEmailsArr : [],
    sub_writers: Array.isArray(subWritersArr) ? subWritersArr : [],
    focusKeyword: row.focusKeyword || '',
    seoTitle: row.seoTitle || '',
    seoDescription: row.seoDescription || '',
    broadcastToSubscribers: row.broadcastToSubscribers !== undefined && row.broadcastToSubscribers !== null
      ? (row.broadcastToSubscribers !== 0 && row.broadcastToSubscribers !== '0' && row.broadcastToSubscribers !== false && row.broadcastToSubscribers !== 'false')
      : true,
    views: Number(row.views || 0),
    publishedAt: Number(row.publishedAt || 0),
  };
};

// Centralized Transporter Helper - Prioritizes Gmail App Password if available
const getEmailTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const senderName = process.env.SMTP_SENDER_NAME || 'Times Chicago News';

  if (gmailUser && gmailPass) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });
    const fromEmail = { name: senderName, address: gmailUser };
    return { transporter, fromEmail };
  }

  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;
  const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);

  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
    const fromEmail = { name: senderName, address: user };
    return { transporter, fromEmail };
  }

  const transporter = nodemailer.createTransport({ jsonTransport: true });
  const fromEmail = { name: senderName, address: 'news@chicagotimes.com' };
  return { transporter, fromEmail };
};

// Helper to dispatch targeted email notifications for published articles
const sendTargetedArticleEmails = async (post) => {
  if (!post || (post.status !== 'Published' && post.status !== 'published')) {
    return { success: false, reason: 'Article is not published' };
  }

  const recipients = new Set();
  const recipientCategoryMap = new Map();

  // 1. Collect custom targeted emails added to this article
  let targetedArr = [];
  if (Array.isArray(post.targetedEmails)) {
    targetedArr = post.targetedEmails;
  } else if (typeof post.targetedEmails === 'string') {
    try {
      const parsed = JSON.parse(post.targetedEmails);
      if (Array.isArray(parsed)) targetedArr = parsed;
    } catch (e) {}
  }

  targetedArr.forEach((email) => {
    const clean = String(email).trim().toLowerCase();
    if (clean && clean.includes('@')) {
      recipients.add(clean);
    }
  });

  // 2. Collect newsletter subscribers ONLY if broadcastToSubscribers is explicitly checked
  const shouldBroadcast = post.broadcastToSubscribers === true ||
    post.broadcastToSubscribers === 1 ||
    post.broadcastToSubscribers === '1' ||
    post.broadcastToSubscribers === 'true';

  if (shouldBroadcast) {
    try {
      let subRows = [];
      try {
        const [rows] = await db.query('SELECT * FROM newsletter_subscriptions');
        if (rows && rows.length > 0) subRows = rows;
      } catch (dbErr) {}

      // Determine article published timestamp & categories
      const postTime = (post.justPublished || post.notifySubscribers || post._triggerEmail)
        ? Date.now()
        : (post.publishedAt ? new Date(post.publishedAt).getTime() : (post.date ? new Date(post.date).getTime() : Date.now()));

      const postCat = (post.category || '').toLowerCase().trim();
      const postSubs = Array.isArray(post.subCategories) ? post.subCategories.map((s) => String(s).toLowerCase().trim()) : [];
      const postTags = Array.isArray(post.tags) ? post.tags.map((t) => String(t).toLowerCase().trim()) : [];
      const allPostCategories = Array.from(new Set([postCat, ...postSubs, ...postTags])).filter(Boolean);

      const normalizeCatStr = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const normPostCategories = allPostCategories.map(normalizeCatStr).filter(Boolean);

      const genericWords = new Set(['news', 'all', 'general', 'world', 'daily', 'editorial', 'opinion', 'business', 'tech', 'arts', 'sports']);

      subRows.forEach((sub) => {
        const subEmail = (typeof sub === 'string' ? sub : sub.email || '').toLowerCase().trim();
        if (!subEmail || !subEmail.includes('@')) return;

        // Rule 1: Timestamp check - Article MUST be published AFTER subscriber signed up
        const subTime = sub.subscribed_at ? new Date(sub.subscribed_at).getTime() : (sub.subscribedTimestamp || 0);
        if (subTime > 0 && postTime < subTime - 60000) {
          // Post was published BEFORE the user signed up to the newsletter -> Skip!
          return;
        }

        // Rule 2: Category check - Article category MUST strictly match subscriber's chosen categories
        let rawTopics = [];
        if (Array.isArray(sub.newsletters)) {
          rawTopics = sub.newsletters;
        } else if (typeof sub.newsletters === 'string') {
          try {
            const parsed = JSON.parse(sub.newsletters);
            if (Array.isArray(parsed)) rawTopics = parsed;
          } catch (e) {}
        }

        const topics = rawTopics.map((t) => String(t).trim()).filter(Boolean);
        const normTopics = topics.map(normalizeCatStr).filter(Boolean);
        const isAllSelected = normTopics.includes('all') || normTopics.includes('allnewsletters');

        let matchesCategory = false;
        let matchedCategoryName = post.category || 'World';

        if (isAllSelected) {
          matchesCategory = true;
          matchedCategoryName = post.category || 'World';
        } else if (topics.length > 0) {
          for (let i = 0; i < topics.length; i++) {
            const origTopic = topics[i];
            const normT = normalizeCatStr(origTopic);
            if (!normT) continue;

            const isMatch = allPostCategories.some((rawC) => {
              const c = normalizeCatStr(rawC);
              if (!c || !normT) return false;
              if (c === normT) return true;

              // Check if both contain "international"
              if (normT.includes('international') && c.includes('international')) return true;

              // Check if both match "us" / "usnews"
              if ((normT === 'usnews' || normT === 'us') && (c === 'usnews' || c === 'us')) return true;

              // Don't let generic words (e.g. "news") falsely match specific topics (e.g. "internationalnews")
              if (genericWords.has(c) || genericWords.has(normT)) {
                return c === normT;
              }

              if (c.length >= 4 && normT.length >= 4) {
                return c.includes(normT) || normT.includes(c);
              }
              return false;
            });

            if (isMatch) {
              matchesCategory = true;
              matchedCategoryName = origTopic; // Use the exact matching category topic subscriber signed up for
              break;
            }
          }
        }

        if (matchesCategory) {
          recipients.add(subEmail);
          recipientCategoryMap.set(subEmail, matchedCategoryName);
        }
      });
    } catch (err) {
      console.warn('Newsletter subscriber fetch notice:', err.message);
    }
  }

  const finalRecipientList = Array.from(recipients);
  if (finalRecipientList.length === 0) {
    console.log(`[EMAIL DISTRIBUTION] No matching subscribers for published article "${post.title}" (ID: ${post.id}).`);
    return { success: true, count: 0, recipients: [] };
  }

  const siteUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const articleUrl = `${siteUrl}/article/${post.slug || post.id}`;
  const articleTitle = post.title || 'Untitled Article';
  const articleSubheadline = post.subheadline || post.cardSummary || post.description || '';
  const articleAuthor = post.author || 'The Editorial Board';
  
  const formattedDate = new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  // Exact requested logo: website-thumbnail - Copy.jpg (hosted on B2)
  const logoSrc = 'https://f005.backblazeb2.com/file/timeschicago/branding/exact_timeschicago_logo.jpg';

  // Resolve article thumbnail: filter out article page URLs, base64 strings, and relative/local paths
  let rawThumb = unwrapWebpProxyUrl((post.thumbnail || '').trim());

  // 1. Filter out article webpage URLs (e.g. http://localhost:3000/article/slug)
  if (rawThumb.includes('/article/') || rawThumb.includes('timeschicago.com/article') || rawThumb.includes('localhost:3000/article')) {
    rawThumb = '';
  }

  // 2. If thumbnail is empty or was an article page URL, extract first <img> from bodyContent
  if (!rawThumb && post.bodyContent) {
    const imgMatch = post.bodyContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      const candidate = imgMatch[1].trim();
      if (!candidate.includes('/article/')) {
        rawThumb = candidate;
      }
    }
  }

  // 3. Upload base64 data URIs to Backblaze B2
  if (rawThumb.startsWith('data:image/')) {
    try {
      const b2Url = await uploadBase64ToB2(rawThumb, `thumb_${post.id || Date.now()}.webp`, 'articles');
      if (b2Url) rawThumb = b2Url;
    } catch (e) {}
  }

  // 4. Resolve relative image paths
  if (rawThumb.startsWith('/') || rawThumb.startsWith('images/') || rawThumb.startsWith('uploads/')) {
    const cleanPath = rawThumb.startsWith('/') ? rawThumb : `/${rawThumb}`;
    rawThumb = `${siteUrl}${cleanPath}`;
  }

  // 5. Upload local localhost images to Backblaze B2 so external email clients can view them
  if (rawThumb.includes('localhost:') || rawThumb.includes('127.0.0.1:')) {
    try {
      const relativePart = rawThumb.replace(/^https?:\/\/[^\/]+/, '');
      const diskPathFrontend = path.join(__dirname, '../Frontend/public', relativePart);
      const diskPathBackend = path.join(__dirname, relativePart);

      let diskPath = null;
      if (fs.existsSync(diskPathFrontend)) diskPath = diskPathFrontend;
      else if (fs.existsSync(diskPathBackend)) diskPath = diskPathBackend;

      if (diskPath) {
        const fileBuffer = fs.readFileSync(diskPath);
        const ext = path.extname(diskPath).replace('.', '') || 'jpeg';
        const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        const uploadedUrl = await uploadToBackblazeB2(fileBuffer, `thumb_${post.id || Date.now()}.${ext}`, mimeType, 'articles');
        if (uploadedUrl) rawThumb = uploadedUrl;
      }
    } catch (e) {}
  }

  // Final valid image thumbnail URL fallback
  const articleThumbnail = (rawThumb && rawThumb.startsWith('http'))
    ? rawThumb
    : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80';

  const buildEmailHtml = (categoryHeaderStr) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${articleTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap');
          .article-title {
            font-family: 'Playfair Display', Georgia, 'Times New Roman', serif !important;
            font-weight: 700 !important;
          }
          .article-summary {
            font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 20px 0; background-color: #f4f4f0; font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; color: #111111;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; margin: 20px auto; background-color: #ffffff; border: 1px solid #eae6da; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
          
          <!-- Top Masthead Header -->
          <tr>
            <td style="padding: 24px 24px 8px 24px; text-align: center;">
              <p style="margin: 0 0 16px 0;">
                <a href="${siteUrl}" target="_blank" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #718096 !important; text-decoration: none !important; letter-spacing: 0.5px;">
                  <span style="color: #718096 !important; text-decoration: none !important;">timeschicago.com</span>
                </a>
              </p>
              <!-- Masthead Logo -->
              <a href="${siteUrl}" target="_blank" style="text-decoration: none;">
                <img src="${logoSrc}" alt="Times Chicago" style="max-width: 280px; width: 100%; height: auto; display: block; margin: 0 auto; border: 0;" />
              </a>
            </td>
          </tr>

          <!-- Category Title & Date -->
          <tr>
            <td style="padding: 16px 24px 20px 24px; text-align: center;">
              <h1 class="article-title" style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 900; color: #111111; margin: 12px 0 6px 0; text-transform: uppercase; letter-spacing: 1px;">
                ${categoryHeaderStr}
              </h1>
              <p style="font-family: Arial, sans-serif; font-size: 12px; color: #777777; margin: 0; text-transform: uppercase; letter-spacing: 1.5px;">
                ${formattedDate}
              </p>
            </td>
          </tr>

          <!-- Main Article Layout -->
          <tr>
            <td style="padding: 0 24px 28px 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <!-- Left: Article Thumbnail Image -->
                  ${articleThumbnail ? `
                  <td width="38%" valign="top" style="padding-right: 18px;">
                    <a href="${articleUrl}" target="_blank">
                      <img src="${articleThumbnail}" alt="${articleTitle}" style="width: 100%; max-width: 220px; border-radius: 8px; display: block; object-fit: cover; border: 1px solid #eae6da;" />
                    </a>
                  </td>
                  ` : ''}

                  <!-- Right: Article Content -->
                  <td width="${articleThumbnail ? '62%' : '100%'}" valign="top">
                    <h2 class="article-title" style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; line-height: 1.2; color: #111111; margin: 0 0 10px 0; letter-spacing: -0.2px;">
                      <a href="${articleUrl}" target="_blank" class="article-title" style="color: #111111; text-decoration: none; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-weight: 700;">
                        ${articleTitle}
                      </a>
                    </h2>
                    ${articleSubheadline ? `
                    <p class="article-summary" style="font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.5; color: #333333; margin: 0 0 12px 0;">
                      ${articleSubheadline}
                    </p>
                    ` : ''}
                    <p style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; color: #555555; margin: 0 0 14px 0;">
                      By ${articleAuthor}
                    </p>
                    <div>
                      <a href="${articleUrl}" target="_blank" style="font-family: Arial, sans-serif; font-size: 12px; font-weight: 800; color: #990000; text-transform: uppercase; text-decoration: underline; letter-spacing: 0.5px;">
                        READ FULL ARTICLE &raquo;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 24px 24px 28px 24px; text-align: center; border-top: 1px solid #eae6da; background-color: #ffffff;">
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #777777; line-height: 1.5; margin: 0 0 6px 0;">
                &copy; 2026 Times Chicago LLC. All Rights Reserved.
              </p>
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #777777; line-height: 1.5; margin: 0 0 4px 0;">
                You received this email because you are on the Times Chicago distribution list.
              </p>
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #777777; line-height: 1.5; margin: 0;">
                To manage your notification preferences, <a href="${siteUrl}/newsletters" target="_blank" style="color: #990000; text-decoration: underline;">click here</a>.
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;

  const { transporter, fromEmail } = getEmailTransporter();

  let sentCount = 0;
  for (const toEmail of finalRecipientList) {
    try {
      const userMatchedCat = recipientCategoryMap.get(toEmail) || post.category || 'World';
      const categoryHeaderStr = String(userMatchedCat).toUpperCase();
      const personalizedHtml = buildEmailHtml(categoryHeaderStr);

      await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: articleTitle,
        html: personalizedHtml
      });
      sentCount++;
    } catch (mailErr) {
      console.warn(`[EMAIL DISTRIBUTION NOTICE] Mail error for ${toEmail}:`, mailErr.message);
    }
  }

  console.log(`[EMAIL DISTRIBUTION DISPATCHED] Article "${articleTitle}" sent to ${sentCount} recipient(s):`, finalRecipientList);
  return { success: true, count: sentCount, recipients: finalRecipientList };
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
      query = 'SELECT * FROM posts WHERE LOWER(authorEmail) = ? OR (sub_writers IS NOT NULL AND LOWER(CAST(sub_writers AS CHAR)) LIKE ?) ORDER BY publishedAt DESC, created_at DESC';
      params = [authorEmail, `%${authorEmail}%`];
    }
    const [rows] = await db.query(query, params);
    const formatted = (rows || []).map(formatPostRow);
    return res.status(200).json({ success: true, posts: formatted });
  } catch (dbErr) {
    console.error('MySQL Posts Fetch Error:', dbErr.message);
    return res.status(500).json({ success: false, posts: [], message: dbErr.message });
  }
});

app.post('/api/posts', requireWriterOrAdmin, async (req, res) => {
  try {
    const incomingPosts = req.body;
    let listToProcess = Array.isArray(incomingPosts) ? incomingPosts : [incomingPosts];

    for (const p of listToProcess) {
      if (!p || !p.id) continue;

      // 1. Resolve and upload thumbnail image to Backblaze B2 under articles/
      let rawThumb = unwrapWebpProxyUrl(String(p.thumbnail || '').trim());

      // A. Filter out article webpage URLs (e.g. http://localhost:3000/article/slug)
      if (rawThumb.includes('/article/') || rawThumb.includes('timeschicago.com/article') || rawThumb.includes('localhost:3000/article')) {
        rawThumb = '';
      }

      // B. Extract first <img> from bodyContent if thumbnail is empty or was an article webpage URL
      if (!rawThumb && p.bodyContent) {
        const imgMatch = p.bodyContent.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
          const candidate = imgMatch[1].trim();
          if (!candidate.includes('/article/')) {
            rawThumb = candidate;
          }
        }
      }

      // C. Upload base64 image data URIs to Backblaze B2
      if (rawThumb.startsWith('data:image/')) {
        try {
          const b2Url = await uploadBase64ToB2(rawThumb, `thumb_${p.id}_${Date.now()}.webp`, 'articles');
          if (b2Url) rawThumb = b2Url;
        } catch (e) {}
      } 
      // D. Upload remote image URLs (e.g. Unsplash or external image links) to Backblaze B2 if not already B2
      else if (rawThumb.startsWith('http://') || rawThumb.startsWith('https://')) {
        if (!rawThumb.includes('backblazeb2.com') && !rawThumb.includes('localhost:') && !rawThumb.includes('127.0.0.1:')) {
          try {
            const b2Url = await uploadRemoteUrlToB2(rawThumb, `thumb_${p.id}_${Date.now()}.webp`, 'articles');
            if (b2Url) rawThumb = b2Url;
          } catch (e) {}
        }
      }
      // E. Resolve relative or local image paths by uploading local file to Backblaze B2
      else if (rawThumb.startsWith('/') || rawThumb.startsWith('images/') || rawThumb.startsWith('uploads/')) {
        try {
          const cleanPath = rawThumb.startsWith('/') ? rawThumb : `/${rawThumb}`;
          const diskPathFrontend = path.join(__dirname, '../Frontend/public', cleanPath);
          const diskPathBackend = path.join(__dirname, cleanPath);
          let diskPath = null;
          if (fs.existsSync(diskPathFrontend)) diskPath = diskPathFrontend;
          else if (fs.existsSync(diskPathBackend)) diskPath = diskPathBackend;

          if (diskPath) {
            const fileBuffer = fs.readFileSync(diskPath);
            const ext = path.extname(diskPath).replace('.', '') || 'webp';
            const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
            const uploadedUrl = await uploadToBackblazeB2(fileBuffer, `thumb_${p.id}_${Date.now()}.${ext}`, mimeType, 'articles');
            if (uploadedUrl) rawThumb = uploadedUrl;
          }
        } catch (e) {}
      }

      if (rawThumb) {
        p.thumbnail = rawThumb;
      }

      // Sanitize metadata fields to neutralize any injected scripts/HTML tags
      if (p.title) p.title = stripHtml(p.title);
      if (p.subheadline) p.subheadline = stripHtml(p.subheadline);
      if (p.cardSummary) p.cardSummary = stripHtml(p.cardSummary);
      if (p.author) p.author = stripHtml(p.author);
      if (p.photoCaption) p.photoCaption = stripHtml(p.photoCaption);
      if (p.focusKeyword) p.focusKeyword = stripHtml(p.focusKeyword);
      if (p.seoTitle) p.seoTitle = stripHtml(p.seoTitle);
      if (p.seoDescription) p.seoDescription = stripHtml(p.seoDescription);

      // 2. Upload all inline body images (base64 & external URLs) in article HTML to Backblaze B2 under articles/
      // and sanitize HTML bodyContent to completely eliminate Stored XSS vectors before database persistence
      if (p.bodyContent) {
        p.bodyContent = await uploadAllExternalImagesInHtml(p.bodyContent, `article_${p.id}`, 'articles');
        p.bodyContent = sanitizeArticleHtml(p.bodyContent);
      }

      // 3. Save / Update in MySQL posts table
      try {
        // Ensure imageSeoKeywords, targetedEmails, broadcastToSubscribers, focusKeyword, seoTitle, seoDescription, sub_writers columns exist in MySQL posts table
        try { await db.query('ALTER TABLE posts ADD COLUMN imageSeoKeywords JSON DEFAULT NULL'); } catch (colErr) {}
        try { await db.query('ALTER TABLE posts ADD COLUMN targetedEmails JSON DEFAULT NULL'); } catch (colErr) {}
        try { await db.query('ALTER TABLE posts ADD COLUMN broadcastToSubscribers TINYINT(1) DEFAULT 1'); } catch (colErr) {}
        try { await db.query('ALTER TABLE posts ADD COLUMN focusKeyword VARCHAR(255) DEFAULT NULL'); } catch (colErr) {}
        try { await db.query('ALTER TABLE posts ADD COLUMN seoTitle VARCHAR(255) DEFAULT NULL'); } catch (colErr) {}
        try { await db.query('ALTER TABLE posts ADD COLUMN seoDescription TEXT DEFAULT NULL'); } catch (colErr) {}
        try { await db.query('ALTER TABLE posts ADD COLUMN sub_writers JSON DEFAULT NULL'); } catch (colErr) {}

        const insertQuery = `
          INSERT INTO posts (
            id, title, slug, subheadline, cardSummary, bodyContent, category,
            subCategories, homepagePlacement, author, authorEmail, status,
            thumbnail, photoCaption, tags, imageSeoKeywords, targetedEmails, broadcastToSubscribers, readDuration, views, publishedAt, date,
            focusKeyword, seoTitle, seoDescription, sub_writers
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            imageSeoKeywords = VALUES(imageSeoKeywords),
            targetedEmails = VALUES(targetedEmails),
            broadcastToSubscribers = VALUES(broadcastToSubscribers),
            readDuration = VALUES(readDuration),
            views = VALUES(views),
            publishedAt = VALUES(publishedAt),
            date = VALUES(date),
            focusKeyword = VALUES(focusKeyword),
            seoTitle = VALUES(seoTitle),
            seoDescription = VALUES(seoDescription),
            sub_writers = VALUES(sub_writers);
        `;

        // Check if article was previously published in database to avoid duplicate email broadcasts
        let wasAlreadyPublished = false;
        try {
          const [existingRows] = await db.query('SELECT status FROM posts WHERE id = ?', [String(p.id)]);
          if (existingRows && existingRows.length > 0) {
            const prevStatus = String(existingRows[0].status || '').toLowerCase().trim();
            if (prevStatus === 'published') {
              wasAlreadyPublished = true;
            }
          }
        } catch (checkErr) {}

        const isCurrentlyPublished = String(p.status || '').toLowerCase().trim() === 'published';
        const isExplicitNotify = p.justPublished === true || p.notifySubscribers === true || p._triggerEmail === true;

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
          JSON.stringify(p.imageSeoKeywords || []),
          JSON.stringify(p.targetedEmails || []),
          (p.broadcastToSubscribers !== false && p.broadcastToSubscribers !== 0 && p.broadcastToSubscribers !== '0' && p.broadcastToSubscribers !== 'false') ? 1 : 0,
          p.readDuration || null,
          Number(p.views || 0),
          Number(p.publishedAt || Date.now()),
          p.date || null,
          p.focusKeyword || null,
          p.seoTitle || null,
          p.seoDescription || null,
          JSON.stringify(p.sub_writers || [])
        ]);

        // Dispatch targeted email notifications ONLY if status is Published AND it was not previously published (or explicit notify requested)
        if (isCurrentlyPublished && (!wasAlreadyPublished || isExplicitNotify)) {
          sendTargetedArticleEmails(p).catch((err) => console.warn('Targeted Email Dispatch Error:', err.message));
        }
      } catch (dbErr) {
        console.warn(`MySQL Post Save Notice for ID ${p.id}:`, dbErr.message);
      }
    }

    // Return fresh list from MySQL
    try {
      const [rows] = await db.query('SELECT * FROM posts ORDER BY publishedAt DESC, created_at DESC');
      const formatted = (rows || []).map(formatPostRow);
      return res.status(200).json({ success: true, posts: formatted });
    } catch (e) {
      console.error('MySQL Posts Fetch After Save Error:', e.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch updated posts' });
    }
  } catch (error) {
    console.error('Error saving posts:', error);
    res.status(500).json({ success: false, message: 'Failed to save posts' });
  }
});

// Explicit Email Notification Endpoint for any published article
app.post('/api/posts/notify', async (req, res) => {
  try {
    const { postId, post } = req.body || {};
    let targetPost = post;
    if (!targetPost && postId) {
      try {
        const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [String(postId)]);
        if (rows && rows.length > 0) targetPost = formatPostRow(rows[0]);
      } catch (e) {}
    }
    if (!targetPost) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    const result = await sendTargetedArticleEmails(targetPost);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Increment article view count endpoint
app.post('/api/posts/view', async (req, res) => {
  try {
    const { slug, id } = req.body || {};
    const targetKey = String(slug || id || '').toLowerCase().trim();
    if (!targetKey) {
      return res.status(400).json({ success: false, message: 'slug or id required' });
    }

    let updatedViews = 1;

    // Update directly in MySQL
    try {
      await db.query('UPDATE posts SET views = views + 1 WHERE id = ? OR slug = ?', [targetKey, targetKey]);
      const [rows] = await db.query('SELECT views FROM posts WHERE id = ? OR slug = ? LIMIT 1', [targetKey, targetKey]);
      if (rows && rows.length > 0) {
        updatedViews = Number(rows[0].views) || 1;
      }
    } catch (e) {
      console.warn('MySQL views increment notice:', e.message);
    }

    return res.status(200).json({ success: true, views: updatedViews });
  } catch (err) {
    console.error('Error incrementing view count:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete post endpoint (Active MySQL DB)
app.delete('/api/posts/:id', requireWriterOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const requesterRole = (req.user?.role || '').toLowerCase().trim();
    const requesterEmail = (req.user?.email || '').toLowerCase().trim();

    // If writer, verify they are deleting their own article
    if (requesterRole !== 'admin') {
      const [postRows] = await db.query('SELECT authorEmail FROM posts WHERE id = ?', [String(id)]);
      if (postRows && postRows.length > 0) {
        const postAuthor = (postRows[0].authorEmail || '').toLowerCase().trim();
        if (postAuthor && postAuthor !== requesterEmail) {
          return res.status(403).json({ success: false, message: 'Access denied: You can only delete your own articles.' });
        }
      }
    }

    try {
      await db.query('DELETE FROM posts WHERE id = ?', [String(id)]);
    } catch (dbErr) {
      console.warn('MySQL Delete Post error:', dbErr.message);
    }

    const [rows] = await db.query('SELECT * FROM posts ORDER BY publishedAt DESC, created_at DESC');
    res.status(200).json({ success: true, posts: (rows || []).map(formatPostRow) });
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
    return res.status(200).json({ success: true, saved: [] });
  } catch (dbErr) {
    console.warn('MySQL Saved Articles Fetch Notice:', dbErr.message);
    return res.status(500).json({ success: false, saved: [], message: dbErr.message });
  }
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

    const [rows] = await db.query('SELECT * FROM saved_articles ORDER BY created_at DESC');
    const savedList = (rows || []).map((r) => {
      try {
        return typeof r.article_data === 'string' ? JSON.parse(r.article_data) : r.article_data;
      } catch (e) {
        return { id: r.article_id, user_email: r.user_email };
      }
    });

    res.status(200).json({ success: true, saved: savedList });
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
      await db.query(
        'DELETE FROM saved_articles WHERE LOWER(user_email) = ? AND (article_id = ? OR LOWER(article_id) = ?)',
        [email, articleId, articleId.toLowerCase()]
      );
    } else {
      await db.query('DELETE FROM saved_articles WHERE LOWER(user_email) = ?', [email]);
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

app.get('/api/newsletter', requireAdmin, async (req, res) => {
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
    return res.status(200).json({ success: true, subscribers: [] });
  } catch (dbErr) {
    return res.status(500).json({ success: false, subscribers: [], message: dbErr.message });
  }
});

async function sendUserSignupWelcomeEmail({ name, email }) {
  try {
    const { transporter, fromEmail } = getEmailTransporter();
    const userName = name && name.trim() ? name.trim() : 'Reader';

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: `Welcome, ${userName}! - Times Chicago`,
      html: `
        <div style="background-color: #FCFAF2; padding: 40px 16px; font-family: Arial, sans-serif; min-height: 100%;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #FCFAF2; border: 1px solid #EAE6DA; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            
            <!-- Top Logo Header matching Image 1 -->
            <div style="padding: 32px 24px 20px 24px; text-align: center; border-bottom: 1px solid #EAE6DA;">
              <p style="margin: 0 0 16px 0;">
                <a href="https://timeschicago.com" target="_blank" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #718096 !important; text-decoration: none !important; letter-spacing: 0.5px;">
                  <span style="color: #718096 !important; text-decoration: none !important;">timeschicago.com</span>
                </a>
              </p>
              <a href="https://timeschicago.com" target="_blank" style="text-decoration: none;">
                <img src="https://f005.backblazeb2.com/file/timeschicago/branding/exact_timeschicago_logo.jpg" alt="Times Chicago" style="max-width: 280px; width: 100%; height: auto; display: block; margin: 0 auto; border: 0;" />
              </a>
            </div>
            
            <!-- Main Content Area matching Image 1 Layout & Typography -->
            <div style="padding: 36px 36px 28px 36px; color: #111111; font-family: Arial, sans-serif; line-height: 1.6;">
              <h1 style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 24px; font-weight: bold; color: #111111; margin-top: 0; margin-bottom: 24px; text-align: center;">
                Welcome, ${userName}!
              </h1>

              <p style="font-size: 15px; color: #222222; margin-bottom: 18px; line-height: 1.6;">
                Your account has been successfully created at <strong>Times Chicago</strong>. You now have full access to our premium corporate news portal, executive briefings, reader dashboard, and personalized bookmarks.
              </p>

              <p style="font-size: 15px; color: #222222; margin-bottom: 32px; line-height: 1.6;">
                Get started by exploring today's top stories, geopolitical risk analysis, emerging markets, and venture metrics.
              </p>

              <!-- Call to Action Button matching Image 1 -->
              <div style="text-align: center; margin: 32px 0 36px 0;">
                <a href="http://localhost:3000" target="_blank" style="display: inline-block; background-color: #111111; color: #FFFFFF !important; font-family: Arial, sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-decoration: none !important; padding: 14px 32px; border-radius: 2px;">
                  <span style="color: #FFFFFF !important; text-decoration: none !important;">EXPLORE HEADLINES</span>
                </a>
              </div>

              <!-- Sign-off matching Image 1 -->
              <p style="font-size: 14.5px; color: #333333; margin-top: 32px; margin-bottom: 4px;">
                Best regards,
              </p>
              <p style="font-size: 14.5px; color: #111111; font-weight: bold; margin-top: 0; margin-bottom: 0;">
                The Times Chicago Editorial Desk
              </p>
            </div>

            <!-- Footer matching Image 1 -->
            <div style="padding: 20px 24px; text-align: center; border-top: 1px solid #EAE6DA; font-size: 12px; color: #718096; line-height: 1.5;">
              <p style="margin: 0 0 6px 0;">
                &copy; 2026 <strong>Times Chicago</strong> Media Inc. All Rights Reserved.
              </p>
              <p style="margin: 0;">
                You received this email because you registered an account on <a href="https://timeschicago.com" target="_blank" style="color: #4A5568; text-decoration: underline;">timeschicago.com</a>.
              </p>
            </div>

          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[USER SIGNUP WELCOME EMAIL SENT] to ${email} (Message ID: ${info?.messageId || 'OK'})`);
  } catch (err) {
    console.warn(`[USER SIGNUP WELCOME EMAIL NOTICE] Failed to send email to ${email}:`, err.message);
  }
}

app.post('/api/newsletter', subscribeLimiter, async (req, res) => {
  try {
    const { email, newsletters } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const topicsArr = Array.isArray(newsletters) ? newsletters : ["US", "WORLD", "BUSINESS"];

    // 1. Strict single subscription check per email
    let isAlreadySubscribed = false;
    try {
      const [rows] = await db.query('SELECT id FROM newsletter_subscriptions WHERE LOWER(email) = ?', [cleanEmail]);
      if (rows && rows.length > 0) {
        isAlreadySubscribed = true;
      }
    } catch (dbErr) {}

    if (isAlreadySubscribed) {
      return res.status(400).json({
        success: false,
        isDuplicate: true,
        message: 'You have already signed up for the newsletter with this email address. Please try signing up with a different email address.'
      });
    }

    // 2. Insert new subscriber into MySQL
    try {
      await db.query(
        `INSERT INTO newsletter_subscriptions (email, newsletters, subscribed_at) VALUES (?, ?, NOW());`,
        [cleanEmail, JSON.stringify(topicsArr)]
      );
    } catch (dbErr) {
      console.warn('MySQL Newsletter Insert Notice:', dbErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      email: cleanEmail,
      newsletters: topicsArr
    });
  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
});

app.delete('/api/newsletter', optionalAuth, async (req, res) => {
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
    }

    const isAdmin = req.user && String(req.user.role || '').toLowerCase() === 'admin';
    if (isAdmin) {
      const [rows] = await db.query('SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC');
      return res.status(200).json({ success: true, message: 'Unsubscribed successfully', subscribers: rows || [] });
    }

    return res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
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
      role: 'admin',
      bio: 'Default System Administrator',
      avatar_url: '',
    },
    {
      full_name: 'Geeth Liyanage',
      email: 'geethliyanage979@gmail.com',
      role: 'admin',
      bio: 'Default System Administrator',
      avatar_url: '',
    },
    {
      full_name: 'Times Chicago',
      email: 'timeschicago17@gmail.com',
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
      try {
        const [rows] = await db.query('SELECT id FROM users WHERE LOWER(email) = ?', [lowerEmail]);
        if (rows.length === 0) {
          const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || 'ChangeMe979!';
          const defaultPass = await bcrypt.hash(initialPassword, 12);
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
}
async function initUserExtraColumns() {
  try { await db.query('ALTER TABLE users ADD COLUMN phone VARCHAR(64) DEFAULT NULL'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN country VARCHAR(128) DEFAULT NULL'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN phone_country_code VARCHAR(32) DEFAULT NULL'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN is_blocked TINYINT(1) DEFAULT 0'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN experiences LONGTEXT DEFAULT NULL'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN education LONGTEXT DEFAULT NULL'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN publications LONGTEXT DEFAULT NULL'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN issued_date VARCHAR(64) DEFAULT NULL'); } catch(e) {}
  try { await db.query('ALTER TABLE users ADD COLUMN press_id VARCHAR(64) DEFAULT NULL'); } catch(e) {}
}
initUserExtraColumns();

const safeParseJsonArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const p = JSON.parse(val);
      return Array.isArray(p) ? p : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

app.get('/api/users', optionalAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, full_name, email, role, writer_type, cycle_started_at, block_reason, bio, avatar_url, linkedin, is_default_admin, is_blocked, phone, country, phone_country_code, experiences, education, publications, issued_date, press_id, created_at FROM users ORDER BY id ASC');
    const usersList = (rows || []).map((u) => ({
      ...u,
      writer_type: u.writer_type || 'staff',
      is_default_admin: Boolean(u.is_default_admin),
      is_blocked: Boolean(u.is_blocked),
      experiences: safeParseJsonArray(u.experiences),
      education: safeParseJsonArray(u.education),
      publications: safeParseJsonArray(u.publications),
    }));
    const usersMap = {};
    usersList.forEach((u) => {
      usersMap[u.email.toLowerCase()] = u;
    });
    res.status(200).json({ success: true, users: usersMap, list: usersList });
  } catch (dbErr) {
    console.error('MySQL Users Fetch Error:', dbErr.message);
    res.status(500).json({ success: false, message: 'Failed to fetch users from database' });
  }
});

// Sanitized public writers list for search and author directory (excludes Readers, Admins, Passwords, and PII)
app.get('/api/writers', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, role, writer_type, bio, avatar_url, linkedin, country, experiences, education, publications, issued_date, press_id 
       FROM users 
       WHERE LOWER(role) IN ('writer', 'author') 
         AND (is_blocked IS NULL OR is_blocked = 0)
       ORDER BY full_name ASC, id ASC`
    );
    const sanitizedRows = (rows || []).map((w) => ({
      ...w,
      experiences: safeParseJsonArray(w.experiences),
      education: safeParseJsonArray(w.education),
      publications: safeParseJsonArray(w.publications),
    }));
    res.status(200).json({ success: true, list: sanitizedRows, writers: sanitizedRows });
  } catch (dbErr) {
    console.error('MySQL Writers Fetch Error:', dbErr.message);
    res.status(500).json({ success: false, message: 'Failed to fetch writers' });
  }
});

app.get('/api/users/:email', optionalAuth, async (req, res) => {
  const email = (req.params.email || '').toLowerCase().trim();
  try {
    const [rows] = await db.query('SELECT id, full_name, email, role, writer_type, cycle_started_at, block_reason, bio, avatar_url, linkedin, is_default_admin, is_blocked, phone, country, phone_country_code, experiences, education, publications, issued_date, press_id FROM users WHERE LOWER(email) = ?', [email]);
    if (rows && rows.length > 0) {
      const user = { ...rows[0] };
      user.writer_type = user.writer_type || 'staff';
      user.is_default_admin = Boolean(user.is_default_admin);
      user.is_blocked = Boolean(user.is_blocked);
      user.experiences = safeParseJsonArray(user.experiences);
      user.education = safeParseJsonArray(user.education);
      user.publications = safeParseJsonArray(user.publications);

      // Privacy check: only self or admin can view phone, country, phone_country_code
      // Country is public for writers and contributors so readers can see their country on the byline/writer page
      let isPrivileged = false;
      if (req.user) {
        const callerEmail = String(req.user.email || '').toLowerCase().trim();
        const callerRole = String(req.user.role || '').toLowerCase().trim();
        if (callerEmail === email || callerRole === 'admin') {
          isPrivileged = true;
        }
      }

      if (!isPrivileged) {
        delete user.phone;
        const uRole = (user.role || '').toLowerCase();
        if (uRole !== 'writer' && uRole !== 'author') {
          delete user.country;
        }
        delete user.phone_country_code;
      }

      return res.status(200).json({ success: true, user });
    }
    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (dbErr) {
    return res.status(500).json({ success: false, message: dbErr.message });
  }
});

// Update Profile endpoint
app.post('/api/users', protect, async (req, res) => {
  try {
    const userData = req.body;
    if (!userData || !userData.email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const email = userData.email.toLowerCase().trim();
    const isTargetingSelf = (req.user.email || '').toLowerCase().trim() === email;
    const isAdmin = req.user.role === 'admin';

    if (!isTargetingSelf && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your own profile.',
      });
    }

    const fullName = userData.full_name || userData.name || '';
    const bio = userData.bio !== undefined ? userData.bio : null;
    let avatarUrl = userData.avatar_url || userData.image || userData.avatar || null;
    const linkedin = userData.linkedin || userData.linkedinUrl || null;
    // Only administrators can change roles
    const role = isAdmin ? (userData.role || null) : null;

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

    const phone = userData.phone !== undefined ? userData.phone : null;
    const country = userData.country !== undefined ? userData.country : null;
    const phoneCountryCode = userData.phone_country_code || userData.dial_code || null;
    const experiences = userData.experiences !== undefined ? JSON.stringify(userData.experiences || []) : null;
    const education = userData.education !== undefined ? JSON.stringify(userData.education || []) : null;
    const publications = userData.publications !== undefined ? JSON.stringify(userData.publications || []) : null;
    const lookupEmail = (userData.old_email || userData.previous_email || email).toLowerCase().trim();

    try {
      await db.query(
        `UPDATE users SET 
           email = ?,
           full_name = COALESCE(NULLIF(?, ''), full_name),
           role = COALESCE(?, role),
           bio = COALESCE(?, bio),
           avatar_url = ?,
           linkedin = COALESCE(?, linkedin),
           phone = COALESCE(?, phone),
           country = COALESCE(?, country),
           phone_country_code = COALESCE(?, phone_country_code),
           experiences = COALESCE(?, experiences),
           education = COALESCE(?, education),
           publications = COALESCE(?, publications)
         WHERE LOWER(email) = ?`,
        [email, fullName, role, bio, avatarUrl, linkedin, phone, country, phoneCountryCode, experiences, education, publications, lookupEmail]
      );
      if (email !== lookupEmail) {
        await db.query('UPDATE posts SET authorEmail = ? WHERE LOWER(authorEmail) = ?', [email, lookupEmail]);
      }
    } catch (dbErr) {
      console.warn("MySQL Profile Update Notice:", dbErr.message);
    }

    // Cascade user full_name and avatar change to all matching posts in MySQL and posts.json
    if (fullName) {
      const oldName = userData.old_full_name || userData.previous_name || '';
      try {
        await db.query(
          `UPDATE posts SET author = ? WHERE LOWER(authorEmail) = ? OR (author = ? AND ? != '') OR (LOWER(author) = 'writer user' AND ? = 'writer@gmail.com')`,
          [fullName, email, oldName, oldName, email]
        );
      } catch (postDbErr) {
        console.warn("MySQL Posts Author Update Notice:", postDbErr.message);
      }
    }

    const [rows] = await db.query('SELECT id, full_name, email, role, writer_type, bio, avatar_url, linkedin, is_default_admin, is_blocked, phone, country, phone_country_code, experiences, education, publications, issued_date, press_id FROM users WHERE LOWER(email) = ?', [email]);
    if (rows && rows.length > 0) {
      const user = rows[0];
      user.is_default_admin = Boolean(user.is_default_admin);
      user.is_blocked = Boolean(user.is_blocked);
      user.experiences = safeParseJsonArray(user.experiences);
      user.education = safeParseJsonArray(user.education);
      user.publications = safeParseJsonArray(user.publications);
      return res.status(200).json({ success: true, user });
    }

    res.status(200).json({ success: true, user: { ...userData, avatar_url: avatarUrl, email } });
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ success: false, message: 'Failed to save user profile' });
  }
});

const registerUserHandler = async (req, res) => {
  const bcrypt = require('bcryptjs');
  try {
    const { name, full_name, email, password, role, writer_type } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userName = name || full_name || 'New User';
    const userRole = (role || 'reader').toLowerCase().trim();
    const userWriterType = (writer_type || 'staff').toLowerCase().trim();
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
        'INSERT INTO users (full_name, email, password, role, writer_type, cycle_started_at, bio, is_default_admin) VALUES (?, ?, ?, ?, ?, NOW(), ?, 0)',
        [userName, cleanEmail, hashedPassword, userRole, userWriterType, 'Registered Website Member']
      );
      if (result.insertId) newId = result.insertId;
    } catch (dbErr) {
      console.warn('MySQL Add User Notice:', dbErr.message);
    }

    const newUser = {
      id: newId,
      full_name: userName,
      email: cleanEmail,
      role: userRole,
      writer_type: userWriterType,
      is_default_admin: false,
    };

    // 3. Send Welcome Email matching Image 1 layout & Times Chicago branding
    sendUserSignupWelcomeEmail({ name: userName, email: cleanEmail }).catch(console.error);

    return res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error adding new user:', err);
    res.status(500).json({ success: false, message: 'Failed to create user.' });
  }
};

app.post('/api/users/add', requireAdmin, registerUserHandler);
app.post('/api/users/signup', (req, res, next) => {
  if (req.body) req.body.role = 'reader';
  registerUserHandler(req, res, next);
});

// Edit Existing User
app.put('/api/users/edit', protect, async (req, res) => {
  const bcrypt = require('bcryptjs');
  try {
    const { id, full_name, name, email, role, writer_type, password, bio, linkedin, phone, country, phone_country_code, is_blocked, original_email, old_email, experiences, education, publications, issued_date, press_id, avatar_url } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required for edit.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const lookupEmail = (original_email || old_email || email).toLowerCase().trim();
    const requesterRole = (req.user?.role || '').toLowerCase().trim();
    const requesterEmail = (req.user?.email || '').toLowerCase().trim();

    // Non-admin can only edit their own profile
    if (requesterRole !== 'admin' && lookupEmail !== requesterEmail) {
      return res.status(403).json({ success: false, message: 'Access denied: You can only edit your own profile.' });
    }

    const userName = full_name || name;
    // Only admin can change user roles, writer types, or block status
    const userRole = requesterRole === 'admin' && role ? role.toLowerCase().trim() : undefined;
    const userWriterType = requesterRole === 'admin' && writer_type ? writer_type.toLowerCase().trim() : undefined;
    const blockedVal = requesterRole === 'admin' && is_blocked !== undefined ? (is_blocked ? 1 : 0) : null;
    const experiencesJson = experiences !== undefined ? JSON.stringify(experiences || []) : null;
    const educationJson = education !== undefined ? JSON.stringify(education || []) : null;
    const publicationsJson = publications !== undefined ? JSON.stringify(publications || []) : null;
    const issuedDateVal = issued_date !== undefined ? issued_date : null;
    const pressIdVal = press_id !== undefined ? press_id : null;
    const avatarUrlVal = avatar_url !== undefined ? avatar_url : null;

    // Check duplicate Press ID / Staff ID / Contributor ID
    if (pressIdVal && pressIdVal.trim().length > 0) {
      const cleanPressId = pressIdVal.trim();
      try {
        const [existingIdRows] = await db.query(
          'SELECT id, email, full_name FROM users WHERE LOWER(press_id) = LOWER(?) AND LOWER(email) != LOWER(?)',
          [cleanPressId, lookupEmail]
        );
        if (existingIdRows && existingIdRows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'This ID is allocated for another contributor or Staff writer.'
          });
        }
      } catch (checkErr) {
        console.warn('Press ID check notice:', checkErr.message);
      }
    }

    // MySQL Update
    try {
      if (password && password.trim().length > 0) {
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        await db.query(
          `UPDATE users SET 
             email = ?,
             full_name = COALESCE(?, full_name), 
             role = COALESCE(?, role), 
             writer_type = COALESCE(?, writer_type),
             password = ?, 
             bio = COALESCE(?, bio), 
             linkedin = COALESCE(?, linkedin),
             phone = COALESCE(?, phone),
             country = COALESCE(?, country),
             phone_country_code = COALESCE(?, phone_country_code),
             is_blocked = COALESCE(?, is_blocked),
             experiences = COALESCE(?, experiences),
             education = COALESCE(?, education),
             publications = COALESCE(?, publications),
             issued_date = COALESCE(?, issued_date),
             press_id = COALESCE(?, press_id),
             avatar_url = COALESCE(?, avatar_url)
           WHERE LOWER(email) = ?`,
          [cleanEmail, userName, userRole, userWriterType, hashedPassword, bio, linkedin, phone, country, phone_country_code, blockedVal, experiencesJson, educationJson, publicationsJson, issuedDateVal, pressIdVal, avatarUrlVal, lookupEmail]
        );
      } else {
        await db.query(
          `UPDATE users SET 
             email = ?,
             full_name = COALESCE(?, full_name), 
             role = COALESCE(?, role), 
             writer_type = COALESCE(?, writer_type),
             bio = COALESCE(?, bio), 
             linkedin = COALESCE(?, linkedin),
             phone = COALESCE(?, phone),
             country = COALESCE(?, country),
             phone_country_code = COALESCE(?, phone_country_code),
             is_blocked = COALESCE(?, is_blocked),
             experiences = COALESCE(?, experiences),
             education = COALESCE(?, education),
             publications = COALESCE(?, publications),
             issued_date = COALESCE(?, issued_date),
             press_id = COALESCE(?, press_id),
             avatar_url = COALESCE(?, avatar_url)
           WHERE LOWER(email) = ?`,
          [cleanEmail, userName, userRole, userWriterType, bio, linkedin, phone, country, phone_country_code, blockedVal, experiencesJson, educationJson, publicationsJson, issuedDateVal, pressIdVal, avatarUrlVal, lookupEmail]
        );
      }

      // Propagate updated email & name to posts table
      if (cleanEmail !== lookupEmail) {
        await db.query('UPDATE posts SET authorEmail = ? WHERE LOWER(authorEmail) = ?', [cleanEmail, lookupEmail]);
      }

      // Propagate updated name to posts table for articles written by this author email
      if (userName && userName.trim().length > 0) {
        await db.query(
          'UPDATE posts SET author = ? WHERE LOWER(authorEmail) = ?',
          [userName.trim(), cleanEmail]
        );
      }
    } catch (e) {
      console.warn('MySQL User Edit Notice:', e.message);
    }

    return res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    console.error('Error editing user:', err);
    res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
});

// Block / Unblock User Status Endpoint
app.put('/api/users/:email/status', requireAdmin, async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    const { is_blocked } = req.body;
    const blockedVal = is_blocked ? 1 : 0;

    if (!blockedVal) {
      // Unblocking user -> Reset block_reason, cycle_started_at, and last_warning_email_sent
      await db.query(
        'UPDATE users SET is_blocked = 0, block_reason = NULL, cycle_started_at = NOW(), last_warning_email_sent = NULL WHERE LOWER(email) = ?',
        [email]
      );
    } else {
      await db.query('UPDATE users SET is_blocked = 1 WHERE LOWER(email) = ?', [email]);
    }
    console.log(`[STATUS] User ${email} block status updated to ${blockedVal} in database`);
    return res.status(200).json({ success: true, is_blocked: Boolean(is_blocked) });
  } catch (err) {
    console.error('Error updating block status in database:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete User (With Cascade Deletion for Writer Articles)
app.delete('/api/users/:email', optionalAuth, async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    const requesterRole = (req.user?.role || '').toLowerCase().trim();
    const requesterEmail = (req.user?.email || '').toLowerCase().trim();

    // Only admin or the account owner can delete an account (if authenticated)
    if (req.user && requesterRole !== 'admin' && email !== requesterEmail) {
      return res.status(403).json({ success: false, message: 'Access denied: Only administrators can delete other user accounts.' });
    }
    try {
      const [rows] = await db.query('SELECT is_default_admin, role, full_name FROM users WHERE LOWER(email) = ?', [email]);
      if (rows.length > 0) {
        if (rows[0].is_default_admin) {
          return res.status(403).json({ success: false, message: 'Default Admin accounts cannot be deleted.' });
        }
        const userRole = (rows[0].role || '').toLowerCase();
        const userName = (rows[0].full_name || '').trim();
        // If writer, delete all articles written by this writer from whole website
        if (userRole === 'writer') {
          await db.query('DELETE FROM posts WHERE LOWER(authorEmail) = ? OR LOWER(author) = ?', [email, userName.toLowerCase()]);
        }
      }
    } catch (e) {
      console.warn('MySQL Delete Writer Articles Notice:', e.message);
    }

    await db.query('DELETE FROM users WHERE LOWER(email) = ?', [email]);

    return res.status(200).json({ success: true, message: 'User and all articles deleted successfully' });
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
  article_slot_1: 'Article Page ad 01',
  article_slot_2: 'Article Page ad 02',
  article_slot_3: 'Article Page ad 03',
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
    return res.status(200).json({ success: true, slots: [] });
  } catch (dbErr) {
    console.error('MySQL Fetch Ads Error:', dbErr.message);
    return res.status(500).json({ success: false, slots: [], message: dbErr.message });
  }
});

app.post('/api/ads', requireAdmin, async (req, res) => {
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

    return res.status(200).json({ success: true, slots: targetSlots });
  } catch (error) {
    console.error('Error saving ad configuration:', error);
    res.status(500).json({ success: false, message: 'Failed to save ad configuration' });
  }
});



// ==========================================
// BILLIONAIRES API ENDPOINTS (MySQL DB + Backblaze B2 Storage)
// ==========================================

async function initBillionairesTable() {
  try {
    const tableSchema = `
      id VARCHAR(64) PRIMARY KEY,
      rank INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      net_worth VARCHAR(64) NOT NULL,
      change_status VARCHAR(32) DEFAULT 'UP',
      age VARCHAR(32) DEFAULT '',
      country VARCHAR(255) DEFAULT '',
      source VARCHAR(255) DEFAULT '',
      industry VARCHAR(255) DEFAULT '',
      photo_url TEXT,
      highlight_text TEXT,
      end_year INT DEFAULT 2026,
      title_role VARCHAR(255) DEFAULT '',
      real_time_net_worth VARCHAR(64) DEFAULT '',
      real_time_change VARCHAR(128) DEFAULT '',
      real_time_as_of VARCHAR(64) DEFAULT '',
      list_net_worth_as_of VARCHAR(64) DEFAULT '',
      photo_credit VARCHAR(255) DEFAULT '',
      editor_last_updated VARCHAR(255) DEFAULT '',
      editor_bullet_points LONGTEXT,
      in_their_own_words_quote TEXT,
      self_made_score VARCHAR(32) DEFAULT '',
      philanthropy_score VARCHAR(32) DEFAULT '',
      residence VARCHAR(255) DEFAULT '',
      citizenship VARCHAR(255) DEFAULT '',
      marital_status VARCHAR(128) DEFAULT '',
      children VARCHAR(32) DEFAULT '',
      education TEXT,
      did_you_know_facts LONGTEXT,
      wealth_history LONGTEXT,
      data LONGTEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `;
    await db.query(`CREATE TABLE IF NOT EXISTS billionaires (${tableSchema})`);
    await db.query(`CREATE TABLE IF NOT EXISTS wsj_billionaires (${tableSchema})`);
  } catch (err) {
    console.warn('MySQL initBillionairesTable Notice:', err.message);
  }
}
initBillionairesTable();

// GET /api/billionaires - Retrieve billionaires list from MySQL DB / persistent storage
app.get('/api/billionaires', async (req, res) => {
  try {
    let list = [];
    try {
      const [rows] = await db.query('SELECT * FROM billionaires ORDER BY rank ASC');
      if (rows && rows.length > 0) {
        list = rows.map((r) => {
          const item = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || {});
          return {
            ...item,
            id: String(r.id || item.id),
            rank: Number(r.rank || item.rank || 1),
            name: r.name || item.name || '',
            netWorth: r.net_worth || item.netWorth || '',
            changeStatus: r.change_status || item.changeStatus || 'UP',
            age: r.age || item.age || '',
            country: r.country || item.country || '',
            source: r.source || item.source || '',
            industry: r.industry || item.industry || '',
            photoUrl: r.photo_url || item.photoUrl || '',
            highlightText: r.highlight_text || item.highlightText || '',
            endYear: Number(r.end_year || item.endYear || 2026),
            titleRole: r.title_role || item.titleRole || '',
            realTimeNetWorth: r.real_time_net_worth || item.realTimeNetWorth || '',
            realTimeChange: r.real_time_change || item.realTimeChange || '',
            realTimeAsOf: r.real_time_as_of || item.realTimeAsOf || '',
            listNetWorthAsOf: r.list_net_worth_as_of || item.listNetWorthAsOf || '',
            photoCredit: r.photo_credit || item.photoCredit || '',
            editorLastUpdated: r.editor_last_updated || item.editorLastUpdated || '',
            editorBulletPoints: typeof r.editor_bullet_points === 'string' ? JSON.parse(r.editor_bullet_points) : (r.editor_bullet_points || item.editorBulletPoints || []),
            inTheirOwnWordsQuote: r.in_their_own_words_quote || item.inTheirOwnWordsQuote || '',
            selfMadeScore: r.self_made_score || item.selfMadeScore || '',
            philanthropyScore: r.philanthropy_score || item.philanthropyScore || '',
            residence: r.residence || item.residence || '',
            citizenship: r.citizenship || item.citizenship || '',
            maritalStatus: r.marital_status || item.maritalStatus || '',
            children: r.children || item.children || '',
            education: r.education || item.education || '',
            didYouKnowFacts: typeof r.did_you_know_facts === 'string' ? JSON.parse(r.did_you_know_facts) : (r.did_you_know_facts || item.didYouKnowFacts || []),
            wealthHistory: typeof r.wealth_history === 'string' ? JSON.parse(r.wealth_history) : (r.wealth_history || item.wealthHistory || []),
          };
        });
      }
    } catch (dbErr) {
      console.warn('MySQL GET billionaires warning:', dbErr.message);
    }

    return res.status(200).json({ success: true, billionaires: list || [] });
  } catch (error) {
    console.error('Error fetching billionaires:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch billionaires' });
  }
});

// POST /api/billionaires - Save/update billionaires list in MySQL DB & upload images to Backblaze B2
app.post('/api/billionaires', requireAdmin, async (req, res) => {
  try {
    let items = req.body;
    if (req.body && req.body.billionaires) {
      items = req.body.billionaires;
    }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: expected an array of billionaires' });
    }

    // Limit to max 20
    const processedItems = items.slice(0, 20);

    for (let i = 0; i < processedItems.length; i++) {
      const b = processedItems[i];
      b.rank = i + 1;

      // Image upload to Backblaze B2 under 'billionaires' folder if photoUrl is provided
      if (b.photoUrl && typeof b.photoUrl === 'string') {
        const rawPhoto = b.photoUrl.trim();
        if (rawPhoto.startsWith('data:image/')) {
          try {
            const b2Url = await uploadBase64ToB2(rawPhoto, `headshot_${b.id || Date.now()}_${i}.webp`, 'billionaires');
            if (b2Url) b.photoUrl = b2Url;
          } catch (b2Err) {
            console.error('B2 uploadBase64ToB2 error for billionaire:', b2Err);
          }
        } else if (
          !rawPhoto.includes('backblazeb2.com') &&
          !rawPhoto.includes('localhost:') &&
          !rawPhoto.includes('127.0.0.1:') &&
          (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://'))
        ) {
          try {
            const b2Url = await uploadRemoteUrlToB2(rawPhoto, `headshot_${b.id || Date.now()}_${i}`, 'billionaires');
            if (b2Url) b.photoUrl = b2Url;
          } catch (b2Err) {
            console.error('B2 uploadRemoteUrlToB2 error for billionaire:', b2Err);
          }
        }
      }
    }

    // 1. Save to MySQL DB (billionaires & wsj_billionaires tables with dedicated columns)
    try {
      await db.query('DELETE FROM billionaires');
      await db.query('DELETE FROM wsj_billionaires');
      for (const item of processedItems) {
        const insertSql = `
          INSERT INTO billionaires (
            id, rank, name, net_worth, change_status, age, country, source, industry,
            photo_url, highlight_text, end_year, title_role, real_time_net_worth,
            real_time_change, real_time_as_of, list_net_worth_as_of, photo_credit,
            editor_last_updated, editor_bullet_points, in_their_own_words_quote,
            self_made_score, philanthropy_score, residence, citizenship, marital_status,
            children, education, did_you_know_facts, wealth_history, data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertSqlWsj = `
          INSERT INTO wsj_billionaires (
            id, rank, name, net_worth, change_status, age, country, source, industry,
            photo_url, highlight_text, end_year, title_role, real_time_net_worth,
            real_time_change, real_time_as_of, list_net_worth_as_of, photo_credit,
            editor_last_updated, editor_bullet_points, in_their_own_words_quote,
            self_made_score, philanthropy_score, residence, citizenship, marital_status,
            children, education, did_you_know_facts, wealth_history, data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          String(item.id),
          Number(item.rank || 1),
          String(item.name || ''),
          String(item.netWorth || ''),
          String(item.changeStatus || 'UP'),
          String(item.age || ''),
          String(item.country || ''),
          String(item.source || ''),
          String(item.industry || ''),
          String(item.photoUrl || ''),
          String(item.highlightText || ''),
          Number(item.endYear || 2026),
          String(item.titleRole || ''),
          String(item.realTimeNetWorth || ''),
          String(item.realTimeChange || ''),
          String(item.realTimeAsOf || ''),
          String(item.listNetWorthAsOf || ''),
          String(item.photoCredit || ''),
          String(item.editorLastUpdated || ''),
          JSON.stringify(item.editorBulletPoints || []),
          String(item.inTheirOwnWordsQuote || ''),
          String(item.selfMadeScore || ''),
          String(item.philanthropyScore || ''),
          String(item.residence || ''),
          String(item.citizenship || ''),
          String(item.maritalStatus || ''),
          String(item.children || ''),
          String(item.education || ''),
          JSON.stringify(item.didYouKnowFacts || []),
          JSON.stringify(item.wealthHistory || []),
          JSON.stringify(item)
        ];
        await db.query(insertSql, params);
        await db.query(insertSqlWsj, params);
      }
    } catch (dbErr) {
      console.warn('MySQL Save Billionaires Notice:', dbErr.message);
    }

    return res.status(200).json({ success: true, billionaires: processedItems });
  } catch (error) {
    console.error('Error saving billionaires to database:', error);
    res.status(500).json({ success: false, message: 'Failed to save billionaires' });
  }
});

// ==========================================
// UPCOMING TOP 20 ENTREPRENEURS API ENDPOINTS
// ==========================================
async function initEntrepreneursTable() {
  try {
    const tableSchema = `
      id VARCHAR(64) PRIMARY KEY,
      rank INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      title_role VARCHAR(255) DEFAULT '',
      bio TEXT,
      website VARCHAR(255) DEFAULT '',
      photo_url TEXT,
      age VARCHAR(32) DEFAULT '',
      country VARCHAR(255) DEFAULT '',
      source VARCHAR(255) DEFAULT '',
      industry VARCHAR(255) DEFAULT '',
      gender VARCHAR(32) DEFAULT '',
      net_worth_millions VARCHAR(64) DEFAULT '',
      companies LONGTEXT,
      data LONGTEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `;
    await db.query(`CREATE TABLE IF NOT EXISTS entrepreneurs (${tableSchema})`);
  } catch (err) {
    console.warn('MySQL initEntrepreneursTable Notice:', err.message);
  }
}
initEntrepreneursTable();

// GET /api/entrepreneurs - Retrieve entrepreneurs list from MySQL DB
app.get('/api/entrepreneurs', async (req, res) => {
  try {
    let list = [];
    try {
      const [rows] = await db.query('SELECT * FROM entrepreneurs ORDER BY rank ASC');
      if (rows && rows.length > 0) {
        list = rows.map((r) => {
          const item = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || {});
          return {
            ...item,
            id: String(r.id || item.id),
            rank: Number(r.rank || item.rank || 1),
            name: r.name || item.name || '',
            titleRole: r.title_role || item.titleRole || '',
            bio: r.bio || item.bio || '',
            website: r.website || item.website || '',
            photoUrl: r.photo_url || item.photoUrl || '',
            age: r.age || item.age || '',
            country: r.country || item.country || '',
            source: r.source || item.source || '',
            industry: r.industry || item.industry || '',
            gender: r.gender || item.gender || '',
            netWorthMillions: r.net_worth_millions || item.netWorthMillions || '',
            companies: typeof r.companies === 'string' ? JSON.parse(r.companies) : (r.companies || item.companies || []),
          };
        });
      }
    } catch (dbErr) {
      console.warn('MySQL GET entrepreneurs warning:', dbErr.message);
    }

    return res.status(200).json({ success: true, entrepreneurs: list || [] });
  } catch (error) {
    console.error('Error fetching entrepreneurs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch entrepreneurs' });
  }
});

// POST /api/entrepreneurs - Save/update entrepreneurs list in MySQL DB & upload images to Backblaze B2
app.post('/api/entrepreneurs', requireAdmin, async (req, res) => {
  try {
    let items = req.body;
    if (req.body && req.body.entrepreneurs) {
      items = req.body.entrepreneurs;
    }
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: expected an array of entrepreneurs' });
    }

    const processedItems = items.slice(0, 20);

    for (let i = 0; i < processedItems.length; i++) {
      const b = processedItems[i];
      b.rank = i + 1;

      // Upload headshot to Backblaze B2 if base64 or remote URL
      const rawPhoto = b.photoUrl;
      if (rawPhoto && typeof rawPhoto === 'string') {
        if (rawPhoto.startsWith('data:image/')) {
          try {
            const b2Url = await uploadBase64ToB2(rawPhoto, `entrepreneur_${b.id || Date.now()}_${i}.webp`, 'entrepreneurs');
            if (b2Url) b.photoUrl = b2Url;
          } catch (b2Err) {
            console.error('B2 uploadBase64ToB2 error for entrepreneur:', b2Err);
          }
        } else if (rawPhoto.startsWith('http') && !rawPhoto.includes('backblazeb2.com') && !rawPhoto.includes('f005.backblazeb2.com')) {
          try {
            const b2Url = await uploadRemoteUrlToB2(rawPhoto, `entrepreneur_${b.id || Date.now()}_${i}`, 'entrepreneurs');
            if (b2Url) b.photoUrl = b2Url;
          } catch (b2Err) {
            console.error('B2 uploadRemoteUrlToB2 error for entrepreneur:', b2Err);
          }
        }
      }

      // Process companies logos if base64
      if (Array.isArray(b.companies)) {
        for (let j = 0; j < b.companies.length; j++) {
          const comp = b.companies[j];
          if (comp.logoUrl && typeof comp.logoUrl === 'string' && comp.logoUrl.startsWith('data:image/')) {
            try {
              const compLogoUrl = await uploadBase64ToB2(comp.logoUrl, `company_logo_${b.id}_${j}.webp`, 'entrepreneurs/companies');
              if (compLogoUrl) comp.logoUrl = compLogoUrl;
            } catch (err) {}
          }
        }
      }
    }

    // 1. Save to MySQL DB
    try {
      await db.query('DELETE FROM entrepreneurs');
      const insertSql = `
        INSERT INTO entrepreneurs (
          id, rank, name, title_role, bio, website, photo_url,
          age, country, source, industry, gender, net_worth_millions,
          companies, data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      for (const item of processedItems) {
        const params = [
          String(item.id),
          Number(item.rank),
          String(item.name || ''),
          String(item.titleRole || ''),
          String(item.bio || ''),
          String(item.website || ''),
          String(item.photoUrl || ''),
          String(item.age || ''),
          String(item.country || ''),
          String(item.source || ''),
          String(item.industry || ''),
          String(item.gender || ''),
          String(item.netWorthMillions || ''),
          JSON.stringify(item.companies || []),
          JSON.stringify(item)
        ];
        await db.query(insertSql, params);
      }
    } catch (dbErr) {
      console.warn('MySQL Save Entrepreneurs Notice:', dbErr.message);
    }

    return res.status(200).json({ success: true, entrepreneurs: processedItems });
  } catch (error) {
    console.error('Error saving entrepreneurs to database:', error);
    res.status(500).json({ success: false, message: 'Failed to save entrepreneurs' });
  }
});

// ==========================================
// DATABASE BACKUPS & CLOUD RESTORE API ENDPOINTS
// ==========================================
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

/**
 * Validates and sanitizes a backup file name to prevent Path Traversal:
 * - Rejects path separators (/ and \), traversal sequences (..), null bytes, and URL encoding.
 * - Extracts basename and permits only alphanumeric, underscore, hyphen, and dot.
 * - Enforces non-empty name with strict .json extension.
 * - Verifies that the resolved path is strictly within BACKUPS_DIR.
 */
function getSafeBackupPath(inputFileName) {
  if (!inputFileName || typeof inputFileName !== 'string') return null;

  const raw = inputFileName.trim();

  // 1. Explicitly reject any path traversal sequence or separator
  if (raw.includes('/') || raw.includes('\\') || raw.includes('..') || raw.includes('%') || raw.includes('\0')) {
    return null;
  }

  // 2. Extract basename and remove any invalid characters
  const base = path.basename(raw);
  const sanitized = base.replace(/[^a-zA-Z0-9._-]/g, '');

  // 3. Must be non-empty and must end with .json
  if (!sanitized || !sanitized.endsWith('.json')) return null;

  // 4. Prevent hidden or empty-name files
  if (sanitized === '.json' || sanitized.startsWith('.')) return null;

  // 5. Resolve absolute path and verify directory boundary constraint
  const resolvedDir = path.resolve(BACKUPS_DIR);
  const resolvedPath = path.resolve(resolvedDir, sanitized);

  if (!resolvedPath.startsWith(resolvedDir + path.sep)) {
    return null;
  }

  return { safeFileName: sanitized, fullPath: resolvedPath };
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
      const dummySnapshot = {
        backupVersion: '1.0',
        created_at: item.time,
        users: [],
        posts: [],
        subscribers: [],
        ads: [],
        shorts: [],
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
app.get('/api/backups', requireAdmin, async (req, res) => {
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
app.post('/api/backups/create', requireAdmin, async (req, res) => {
  try {
    const { payload } = req.body || {};

    // 1. Fetch latest active state from MySQL
    let posts = [];
    try {
      const [rows] = await db.query('SELECT * FROM posts ORDER BY publishedAt DESC, created_at DESC');
      if (rows && rows.length > 0) {
        posts = rows.map(formatPostRow);
      }
    } catch (e) {
      console.warn('Backup fetch posts notice:', e.message);
    }

    let users = [];
    try {
      const [rows] = await db.query('SELECT id, full_name, email, role, bio, avatar_url, linkedin, is_default_admin FROM users ORDER BY id ASC');
      if (rows && rows.length > 0) {
        users = rows.map((u) => ({ ...u, is_default_admin: Boolean(u.is_default_admin) }));
      }
    } catch (e) {
      console.warn('Backup fetch users notice:', e.message);
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
      }
    } catch (e) {
      console.warn('Backup fetch subscribers notice:', e.message);
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

    let billionaires = [];
    try {
      const [rows] = await db.query('SELECT * FROM billionaires ORDER BY rank ASC');
      if (rows && rows.length > 0) {
        billionaires = rows.map((r) => {
          const item = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || {});
          return {
            ...item,
            id: String(r.id || item.id),
            rank: Number(r.rank || item.rank || 1),
            name: r.name || item.name || '',
            netWorth: r.net_worth || item.netWorth || '',
            changeStatus: r.change_status || item.changeStatus || 'UP',
            age: r.age || item.age || '',
            country: r.country || item.country || '',
            source: r.source || item.source || '',
            industry: r.industry || item.industry || '',
            photoUrl: r.photo_url || item.photoUrl || '',
            highlightText: r.highlight_text || item.highlightText || '',
            endYear: Number(r.end_year || item.endYear || 2026),
            titleRole: r.title_role || item.titleRole || '',
            realTimeNetWorth: r.real_time_net_worth || item.realTimeNetWorth || '',
            realTimeChange: r.real_time_change || item.realTimeChange || '',
            realTimeAsOf: r.real_time_as_of || item.realTimeAsOf || '',
            listNetWorthAsOf: r.list_net_worth_as_of || item.listNetWorthAsOf || '',
            photoCredit: r.photo_credit || item.photoCredit || '',
            editorLastUpdated: r.editor_last_updated || item.editorLastUpdated || '',
            editorBulletPoints: typeof r.editor_bullet_points === 'string' ? JSON.parse(r.editor_bullet_points) : (r.editor_bullet_points || item.editorBulletPoints || []),
            inTheirOwnWordsQuote: r.in_their_own_words_quote || item.inTheirOwnWordsQuote || '',
            selfMadeScore: r.self_made_score || item.selfMadeScore || '',
            philanthropyScore: r.philanthropy_score || item.philanthropyScore || '',
            residence: r.residence || item.residence || '',
            citizenship: r.citizenship || item.citizenship || '',
            maritalStatus: r.marital_status || item.maritalStatus || '',
            children: r.children || item.children || '',
            education: r.education || item.education || '',
            didYouKnowFacts: typeof r.did_you_know_facts === 'string' ? JSON.parse(r.did_you_know_facts) : (r.did_you_know_facts || item.didYouKnowFacts || []),
            wealthHistory: typeof r.wealth_history === 'string' ? JSON.parse(r.wealth_history) : (r.wealth_history || item.wealthHistory || []),
          };
        });
      }
    } catch (e) {
      billionaires = payload?.billionaires || [];
    }

    let entrepreneurs = [];
    try {
      const [rows] = await db.query('SELECT * FROM entrepreneurs ORDER BY rank ASC');
      if (rows && rows.length > 0) {
        entrepreneurs = rows.map((r) => {
          const item = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || {});
          return {
            ...item,
            id: String(r.id || item.id),
            rank: Number(r.rank || item.rank || 1),
            name: r.name || item.name || '',
            titleRole: r.title_role || item.titleRole || '',
            bio: r.bio || item.bio || '',
            website: r.website || item.website || '',
            photoUrl: r.photo_url || item.photoUrl || '',
            age: r.age || item.age || '',
            country: r.country || item.country || '',
            source: r.source || item.source || '',
            industry: r.industry || item.industry || '',
            gender: r.gender || item.gender || '',
            netWorthMillions: r.net_worth_millions || item.netWorthMillions || '',
            companies: typeof r.companies === 'string' ? JSON.parse(r.companies) : (r.companies || item.companies || []),
          };
        });
      }
    } catch (e) {
      entrepreneurs = payload?.entrepreneurs || [];
    }

    const snapshot = {
      backupVersion: '1.0',
      created_at: new Date().toISOString(),
      published_posts: publishedPosts,
      subscribers: subscribers,
      users: users,
      contact_submissions: contactSubmissions,
      advertise_leads: advertiseLeads,
      billionaires: billionaires,
      entrepreneurs: entrepreneurs,
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

  // 1. Sync & purge extra records in MySQL database if connected
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
          p.subheadline ? stripHtml(p.subheadline) : null,
          p.cardSummary || p.excerpt ? stripHtml(p.cardSummary || p.excerpt) : null,
          p.bodyContent ? sanitizeArticleHtml(p.bodyContent) : null,
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
      const defaultPasswordHash = await bcrypt.hash(process.env.DEFAULT_FALLBACK_PASSWORD || 'ChangeMe123!', 12);
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

    // Restoring Billionaires Table
    const billionairesList = Array.isArray(snapshot.billionaires) ? snapshot.billionaires : [];
    if (billionairesList && billionairesList.length > 0) {
      await db.query('DELETE FROM billionaires').catch((err) => console.warn('MySQL Delete billionaires notice:', err.message));
      await db.query('DELETE FROM wsj_billionaires').catch((err) => console.warn('MySQL Delete wsj_billionaires notice:', err.message));
      for (let i = 0; i < billionairesList.length; i++) {
        const item = billionairesList[i];
        if (!item || !item.name) continue;
        const insertSql = `
          INSERT INTO billionaires (
            id, rank, name, net_worth, change_status, age, country, source, industry,
            photo_url, highlight_text, end_year, title_role, real_time_net_worth,
            real_time_change, real_time_as_of, list_net_worth_as_of, photo_credit,
            editor_last_updated, editor_bullet_points, in_their_own_words_quote,
            self_made_score, philanthropy_score, residence, citizenship, marital_status,
            children, education, did_you_know_facts, wealth_history, data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertSqlWsj = `
          INSERT INTO wsj_billionaires (
            id, rank, name, net_worth, change_status, age, country, source, industry,
            photo_url, highlight_text, end_year, title_role, real_time_net_worth,
            real_time_change, real_time_as_of, list_net_worth_as_of, photo_credit,
            editor_last_updated, editor_bullet_points, in_their_own_words_quote,
            self_made_score, philanthropy_score, residence, citizenship, marital_status,
            children, education, did_you_know_facts, wealth_history, data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          String(item.id || `billionaire_${i + 1}`),
          Number(item.rank || (i + 1)),
          String(item.name || ''),
          String(item.netWorth || ''),
          String(item.changeStatus || 'UP'),
          String(item.age || ''),
          String(item.country || ''),
          String(item.source || ''),
          String(item.industry || ''),
          String(item.photoUrl || ''),
          String(item.highlightText || ''),
          Number(item.endYear || 2026),
          String(item.titleRole || ''),
          String(item.realTimeNetWorth || ''),
          String(item.realTimeChange || ''),
          String(item.realTimeAsOf || ''),
          String(item.listNetWorthAsOf || ''),
          String(item.photoCredit || ''),
          String(item.editorLastUpdated || ''),
          JSON.stringify(item.editorBulletPoints || []),
          String(item.inTheirOwnWordsQuote || ''),
          String(item.selfMadeScore || ''),
          String(item.philanthropyScore || ''),
          String(item.residence || ''),
          String(item.citizenship || ''),
          String(item.maritalStatus || ''),
          String(item.children || ''),
          String(item.education || ''),
          JSON.stringify(item.didYouKnowFacts || []),
          JSON.stringify(item.wealthHistory || []),
          JSON.stringify(item)
        ];
        await db.query(insertSql, params).catch((err) => console.warn('MySQL restore billionaires error:', err.message));
        await db.query(insertSqlWsj, params).catch((err) => console.warn('MySQL restore wsj_billionaires error:', err.message));
      }
    }

    // Restoring Entrepreneurs Table
    const entrepreneursList = Array.isArray(snapshot.entrepreneurs) ? snapshot.entrepreneurs : [];
    if (entrepreneursList && entrepreneursList.length > 0) {
      await db.query('DELETE FROM entrepreneurs').catch((err) => console.warn('MySQL Delete entrepreneurs notice:', err.message));
      for (let i = 0; i < entrepreneursList.length; i++) {
        const item = entrepreneursList[i];
        if (!item || !item.name) continue;
        const insertSql = `
          INSERT INTO entrepreneurs (
            id, rank, name, title_role, bio, website, photo_url,
            age, country, source, industry, gender, net_worth_millions, companies, data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          String(item.id || `ent_${i + 1}`),
          Number(item.rank || (i + 1)),
          String(item.name || ''),
          String(item.titleRole || ''),
          String(item.bio || ''),
          String(item.website || ''),
          String(item.photoUrl || ''),
          String(item.age || ''),
          String(item.country || ''),
          String(item.source || ''),
          String(item.industry || ''),
          String(item.gender || ''),
          String(item.netWorthMillions || ''),
          JSON.stringify(item.companies || []),
          JSON.stringify(item)
        ];
        await db.query(insertSql, params).catch((err) => console.warn('MySQL restore entrepreneurs error:', err.message));
      }
    }
  } catch (dbErr) {
    console.warn('MySQL restore sync notice:', dbErr.message);
  }

  return true;
}

// POST /api/backups/upload-restore - Upload JSON File & Restore
app.post('/api/backups/upload-restore', requireAdmin, async (req, res) => {
  try {
    const { snapshot, fileName } = req.body;
    if (!snapshot || typeof snapshot !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid or missing JSON snapshot data' });
    }

    let targetName = `db_backup_upload_${Date.now()}.json`;
    if (fileName && typeof fileName === 'string') {
      const safeCheck = getSafeBackupPath(fileName);
      if (!safeCheck) {
        return res.status(400).json({ success: false, message: 'Invalid or prohibited backup file name. Path traversal characters are blocked.' });
      }
      targetName = safeCheck.safeFileName;
    }

    const safeTarget = getSafeBackupPath(targetName);
    if (!safeTarget) {
      return res.status(400).json({ success: false, message: 'Invalid target backup file name' });
    }

    const jsonBuffer = Buffer.from(JSON.stringify(snapshot, null, 2), 'utf-8');

    // 1. Save to local backups (guaranteed strictly inside BACKUPS_DIR)
    fs.writeFileSync(safeTarget.fullPath, jsonBuffer);

    // 2. Upload to B2
    uploadToBackblazeB2(jsonBuffer, safeTarget.safeFileName, 'application/json', 'backups').catch(() => {});

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
app.post('/api/backups/restore', requireAdmin, async (req, res) => {
  try {
    const { fileName } = req.body;
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'fileName is required' });
    }

    const safeFile = getSafeBackupPath(fileName);
    if (!safeFile) {
      return res.status(400).json({ success: false, message: 'Prohibited file path: Path traversal attempt detected' });
    }

    let snapshotStr = null;
    if (fs.existsSync(safeFile.fullPath)) {
      snapshotStr = fs.readFileSync(safeFile.fullPath, 'utf-8');
    } else {
      snapshotStr = await downloadBackblazeFile(`backups/${safeFile.safeFileName}`);
    }

    if (!snapshotStr) {
      return res.status(404).json({ success: false, message: 'Backup snapshot file not found' });
    }

    const snapshot = JSON.parse(snapshotStr);
    await restoreDatabaseSnapshot(snapshot);

    return res.status(200).json({
      success: true,
      snapshot,
      message: `Website database restored successfully from ${safeFile.safeFileName}!`,
    });
  } catch (err) {
    console.error('Error restoring backup:', err);
    return res.status(500).json({ success: false, message: 'Failed to restore backup snapshot' });
  }
});

// GET /api/backups/download/:fileName - Force download backup file as attachment
app.get('/api/backups/download/:fileName', requireAdmin, async (req, res) => {
  try {
    const rawFileName = req.params.fileName;
    if (!rawFileName) {
      return res.status(400).json({ success: false, message: 'fileName required' });
    }

    const safeFile = getSafeBackupPath(rawFileName);
    if (!safeFile) {
      return res.status(400).json({ success: false, message: 'Prohibited file path: Path traversal attempt detected' });
    }

    let fileBuffer = null;

    if (fs.existsSync(safeFile.fullPath)) {
      fileBuffer = fs.readFileSync(safeFile.fullPath);
    } else {
      const downloadedStr = await downloadBackblazeFile(`backups/${safeFile.safeFileName}`).catch(() => null);
      if (downloadedStr) {
        fileBuffer = Buffer.from(downloadedStr, 'utf-8');
      }
    }

    if (!fileBuffer) {
      return res.status(404).json({ success: false, message: 'Backup file not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFile.safeFileName}"`);
    return res.send(fileBuffer);
  } catch (err) {
    console.error('Error downloading backup file:', err);
    return res.status(500).json({ success: false, message: 'Failed to download backup file' });
  }
});

// DELETE /api/backups/:fileName - Delete backup file
app.delete('/api/backups/:fileName', requireAdmin, async (req, res) => {
  try {
    const rawFileName = req.params.fileName;
    if (!rawFileName) {
      return res.status(400).json({ success: false, message: 'fileName required' });
    }

    const safeFile = getSafeBackupPath(rawFileName);
    if (!safeFile) {
      return res.status(400).json({ success: false, message: 'Prohibited file path: Path traversal attempt detected' });
    }

    if (fs.existsSync(safeFile.fullPath)) {
      fs.unlinkSync(safeFile.fullPath);
    }

    await deleteBackblazeFile(`backups/${safeFile.safeFileName}`);

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
      { name: 'user_email', type: "VARCHAR(255)" },
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

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, whatsapp, company, inquiryType, details, userEmail } = req.body || {};
    if (!name || !email || !details) {
      return res.status(400).json({ success: false, message: 'Name, email, and inquiry details are required' });
    }
    await ensureContactSubmissionsTable();
    await db.query(
      `INSERT INTO contact_submissions (name, email, phone, whatsapp, company, inquiry_type, details, status, user_email) VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?)`,
      [name, email, phone || null, whatsapp || null, company || null, inquiryType || 'General / Others', details, userEmail ? String(userEmail).toLowerCase().trim() : null]
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

app.get('/api/contact/user', protect, async (req, res) => {
  try {
    const email = String(req.query.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ success: false, submissions: [] });
    if (req.user.role !== 'admin' && (req.user.email || '').toLowerCase().trim() !== email) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    await ensureContactSubmissionsTable();
    const [rows] = await db.query(`SELECT * FROM contact_submissions WHERE LOWER(user_email) = ? ORDER BY created_at DESC`, [email]);
    return res.status(200).json({ success: true, submissions: rows });
  } catch (err) {
    console.error('Error fetching user contact submissions:', err);
    return res.status(500).json({ success: false, submissions: [] });
  }
});

app.get('/api/contact', requireAdmin, async (req, res) => {
  try {
    await ensureContactSubmissionsTable();
    const [rows] = await db.query(`SELECT * FROM contact_submissions ORDER BY created_at DESC`);
    return res.status(200).json({ success: true, submissions: rows });
  } catch (err) {
    console.error('Error fetching contact submissions:', err);
    return res.status(500).json({ success: false, submissions: [] });
  }
});

app.put('/api/contact/:id', requireAdmin, async (req, res) => {
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

app.delete('/api/contact/:id', requireAdmin, async (req, res) => {
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

app.post('/api/advertise-leads', advertiseLimiter, async (req, res) => {
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

app.get('/api/advertise-leads', requireAdmin, async (req, res) => {
  try {
    await ensureAdvertiseLeadsTable();
    const [rows] = await db.query(`SELECT * FROM advertise_leads ORDER BY created_at DESC`);
    return res.status(200).json({ success: true, leads: rows });
  } catch (err) {
    console.error('Error fetching advertise leads:', err);
    return res.status(500).json({ success: false, leads: [] });
  }
});

app.put('/api/advertise-leads/:id', requireAdmin, async (req, res) => {
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

app.delete('/api/advertise-leads/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await ensureAdvertiseLeadsTable();
    await db.query(`DELETE FROM advertise_leads WHERE id = ?`, [id]);
    return res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Subscription Requests API ---
async function ensureSubscriptionRequestsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS subscription_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        packageName VARCHAR(255) NOT NULL,
        price VARCHAR(100) DEFAULT 'Free for 1 Year',
        status VARCHAR(50) DEFAULT 'Active',
        start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Safely add extra columns if table was created previously without them
    await db.query(`ALTER TABLE subscription_requests ADD COLUMN start_date DATETIME DEFAULT CURRENT_TIMESTAMP`).catch(() => {});
    await db.query(`ALTER TABLE subscription_requests ADD COLUMN end_date DATETIME`).catch(() => {});
    await db.query(`ALTER TABLE subscription_requests ADD COLUMN price VARCHAR(100) DEFAULT 'Free for 1 Year'`).catch(() => {});
  } catch (e) {
    console.warn('Subscription table error:', e.message);
  }
}

async function sendSubscriptionConfirmationEmail({ name, email, phone, packageName, price = "Free for 1 Year", startDate, endDate, isDuplicate = false }) {
  try {
    const { transporter, fromEmail } = getEmailTransporter();

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
    const formatDate = (d) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedStartDate = formatDate(start);
    const formattedEndDate = formatDate(end);

    const noticeMessage = isDuplicate
      ? "Your subscription is already active for 1 year. Below are your active subscription details."
      : "Your subscription has activated for 1 year.";

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: `Your subscription has activated for 1 year | Times Chicago`,
      html: `
        <div style="background-color: #FCFAF2; padding: 40px 16px; font-family: Arial, sans-serif; min-height: 100%;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #FCFAF2; border: 1px solid #EAE6DA; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            
            <!-- Top Logo Header Matching Published Article Email Header -->
            <div style="padding: 32px 24px 20px 24px; text-align: center; border-bottom: 1px solid #EAE6DA;">
              <p style="margin: 0 0 16px 0;">
                <a href="https://timeschicago.com" target="_blank" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; color: #718096 !important; text-decoration: none !important; letter-spacing: 0.5px;">
                  <span style="color: #718096 !important; text-decoration: none !important;">timeschicago.com</span>
                </a>
              </p>
              <a href="https://timeschicago.com" target="_blank" style="text-decoration: none;">
                <img src="https://f005.backblazeb2.com/file/timeschicago/branding/exact_timeschicago_logo.jpg" alt="Times Chicago" style="max-width: 280px; width: 100%; height: auto; display: block; margin: 0 auto; border: 0;" />
              </a>
            </div>
            
            <!-- Main Body Content -->
            <div style="padding: 32px 32px; color: #111111; font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="font-size: 20px; color: #111111; margin-top: 0; font-weight: bold;">Dear ${name},</h2>
              <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">Thank you for subscribing to Times Chicago digital editions. We are delighted to confirm that your subscription is now live!</p>
              
              <!-- Highlighted Green Box -->
              <div style="background-color: #EFFFEC; border: 1px solid #BFF0B7; border-left: 5px solid #227419; padding: 18px 20px; margin: 24px 0; border-radius: 12px;">
                <p style="margin: 0; font-weight: bold; color: #227419; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.5;">
                  ${noticeMessage}
                </p>
              </div>
              
              <!-- SUBSCRIPTION DETAILS Heading -->
              <h3 style="font-size: 12px; font-weight: bold; color: #6b7280; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #EAE6DA; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px;">SUBSCRIPTION DETAILS</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; width: 160px; border-bottom: 1px solid #F3F0E6;">Plan Name:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #111111; border-bottom: 1px solid #F3F0E6;">${packageName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #F3F0E6;">Plan Price:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #007cba; border-bottom: 1px solid #F3F0E6;">${price}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #F3F0E6;">Status:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #227419; border-bottom: 1px solid #F3F0E6;">Active (1 Year)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #F3F0E6;">Activation Date:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #111111; border-bottom: 1px solid #F3F0E6;">${formattedStartDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #F3F0E6;">Subscription End Date:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #b91c1c; border-bottom: 1px solid #F3F0E6;">${formattedEndDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #F3F0E6;">Full Name:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #111111; border-bottom: 1px solid #F3F0E6;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #F3F0E6;">Email Address:</td>
                  <td style="padding: 10px 0; color: #4f46e5; font-family: monospace; border-bottom: 1px solid #F3F0E6;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280;">Mobile Number:</td>
                  <td style="padding: 10px 0; font-weight: bold; color: #111111;">${phone}</td>
                </tr>
              </table>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 13px; color: #1e293b;">Included with your 1-Year Subscription:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
                  <li>Unlimited access on Times Chicago website and mobile apps</li>
                  <li>Daily puzzles and crosswords</li>
                  <li>Audio versions of Times Chicago articles</li>
                  <li>Full premium access to all Times Chicago digital editions</li>
                  <li>Breaking alerts, newsletters, and exclusive editorial reporting</li>
                </ul>
              </div>

              <p style="font-size: 13.5px; color: #6b7280; margin-bottom: 0;">If you have any questions or wish to manage your subscription, please reply to this email or contact us at <a href="mailto:worldnews@timeschicago.com" style="color: #00558c; text-decoration: underline;">worldnews@timeschicago.com</a>.</p>
            </div>
            
            <!-- Footer Matching Image 2 Exactly -->
            <div style="padding: 24px; text-align: center; font-family: Arial, sans-serif; font-size: 11.5px; color: #6b7280; border-top: 1px solid #EAE6DA;">
              <p style="margin: 0 0 6px 0;">&copy; ${new Date().getFullYear()} Times Chicago LLC. All Rights Reserved.</p>
              <p style="margin: 0 0 6px 0;">You received this email because you subscribed to Times Chicago.</p>
              <p style="margin: 0;">To view your account or manage subscriptions, visit <a href="http://localhost:3000/reader/john/saved" style="color: #00558c; text-decoration: underline;">your Reader Dashboard</a>.</p>
            </div>
            
          </div>
        </div>
      `,
      attachments: []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[SUBSCRIPTION EMAIL] Confirmation sent to ${email} (duplicate=${isDuplicate}):`, info.messageId || info);
    return true;
  } catch (err) {
    console.error('[SUBSCRIPTION EMAIL ERROR]', err);
    return false;
  }
}

app.post('/api/subscriptions', subscribeLimiter, async (req, res) => {
  try {
    const { name, email, phone, packageName } = req.body || {};
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone number are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const selectedPackage = packageName || 'Times Chicago Digital Bundle';
    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    // Check if subscription request already exists for this email
    let existingRequests = [];
    try {
      await ensureSubscriptionRequestsTable();
      const [rows] = await db.query(`SELECT * FROM subscription_requests WHERE LOWER(email) = ? ORDER BY id DESC`, [cleanEmail]);
      if (rows && rows.length > 0) {
        existingRequests = rows;
      }
    } catch (e) {}

    // Check if user already has an active, non-expired subscription
    const activeSub = existingRequests.find(s => {
      const end = s.end_date ? new Date(s.end_date) : null;
      return s.status === 'Active' && end && end > now;
    });

    if (activeSub) {
      // Send active subscription details notice
      sendSubscriptionConfirmationEmail({
        name,
        email: cleanEmail,
        phone,
        packageName: activeSub.packageName || selectedPackage,
        price: activeSub.price || 'Free for 1 Year',
        startDate: activeSub.start_date || activeSub.created_at || now,
        endDate: activeSub.end_date || oneYearLater,
        isDuplicate: true
      }).catch(console.error);

      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: 'Your subscription is already active for 1 year.',
        subscription: activeSub
      });
    }

    const newRecord = {
      id: Date.now().toString(),
      name,
      email: cleanEmail,
      phone,
      packageName: selectedPackage,
      price: 'Free for 1 Year',
      status: 'Active',
      start_date: now.toISOString(),
      end_date: oneYearLater.toISOString(),
      created_at: now.toISOString()
    };

    // 1. Save to MySQL Database
    try {
      await ensureSubscriptionRequestsTable();
      const [result] = await db.query(
        `INSERT INTO subscription_requests (name, email, phone, packageName, price, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, 'Active', ?, ?)`,
        [name, cleanEmail, phone, selectedPackage, 'Free for 1 Year', now, oneYearLater]
      );
      if (result && result.insertId) {
        newRecord.id = String(result.insertId);
      }
    } catch (dbErr) {
      console.warn('MySQL Subscription Save Notice:', dbErr.message);
    }

    // 2. Trigger confirmation email with end date & details
    sendSubscriptionConfirmationEmail({
      name,
      email: cleanEmail,
      phone,
      packageName: selectedPackage,
      price: 'Free for 1 Year',
      startDate: now,
      endDate: oneYearLater,
      isDuplicate: false
    }).catch(console.error);

    return res.status(200).json({
      success: true,
      isDuplicate: false,
      message: 'Your subscription has activated for 1 year! A confirmation email has been sent.',
      subscription: newRecord
    });
  } catch (err) {
    console.error('Error handling subscription submission:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/subscriptions/user?email=...
app.get('/api/subscriptions/user', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required' });
    }
    const cleanEmail = String(email).toLowerCase().trim();
    let userSubs = [];

    try {
      await ensureSubscriptionRequestsTable();
      const [rows] = await db.query(`SELECT * FROM subscription_requests WHERE LOWER(email) = ? ORDER BY id DESC`, [cleanEmail]);
      if (rows && rows.length > 0) {
        userSubs = rows;
      }
    } catch (e) {}

    const validSubs = userSubs.filter(s => (s.status === 'Active' || s.status === 'Cancelled') && s.end_date);

    if (validSubs.length === 0) {
      return res.status(200).json({ success: true, subscription: null, isSubscribed: false, daysRemaining: 0 });
    }

    const latest = validSubs[0];
    const now = new Date();
    const end = latest.end_date ? new Date(latest.end_date) : new Date(new Date(latest.created_at || latest.start_date).getTime() + 365 * 24 * 60 * 60 * 1000);
    const isExpired = end <= now;

    if (isExpired && latest.status === 'Active') {
      latest.status = 'Cancelled';
      db.query(`UPDATE subscription_requests SET status = 'Cancelled' WHERE id = ?`, [latest.id]).catch(() => {});
    }

    const remainingMs = end.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60 * 24)));

    return res.status(200).json({
      success: true,
      subscription: {
        ...latest,
        end_date: end.toISOString(),
        status: isExpired ? 'Cancelled' : latest.status
      },
      isSubscribed: !isExpired && latest.status === 'Active',
      daysRemaining: isExpired ? 0 : daysRemaining
    });
  } catch (err) {
    console.error('Error fetching user subscription:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/subscriptions', requireAdmin, async (req, res) => {
  try {
    await ensureSubscriptionRequestsTable();
    const [rows] = await db.query(`SELECT * FROM subscription_requests ORDER BY id ASC`);
    const seen = new Set();
    const uniqueRows = [];
    for (const row of (rows || [])) {
      const lower = (row.email || '').toLowerCase().trim();
      if (lower && !seen.has(lower)) {
        seen.add(lower);
        uniqueRows.push(row);
      }
    }
    return res.status(200).json({ success: true, subscriptions: uniqueRows });
  } catch (err) {
    console.error('Error fetching subscription requests:', err);
    return res.status(500).json({ success: false, subscriptions: [] });
  }
});

app.put('/api/subscriptions/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body || {};
    const { id } = req.params;

    await ensureSubscriptionRequestsTable();
    await db.query(`UPDATE subscription_requests SET status = ? WHERE id = ?`, [status, id]);

    return res.status(200).json({ success: true, message: 'Status updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/subscriptions/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await ensureSubscriptionRequestsTable();
    await db.query(`DELETE FROM subscription_requests WHERE id = ?`, [id]);

    return res.status(200).json({ success: true, message: 'Subscription request deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// =================================================================
// COMMENTS API ENDPOINTS (MySQL Database)
// =================================================================
async function ensureCommentsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(100) PRIMARY KEY,
        articleSlug VARCHAR(255) NOT NULL,
        authorName VARCHAR(255) NOT NULL,
        authorEmail VARCHAR(255) DEFAULT '',
        createdAt VARCHAR(100) DEFAULT '',
        timestamp BIGINT DEFAULT 0,
        text TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure all required columns exist even if table was created with an older schema
    const requiredColumns = [
      { name: 'articleSlug', type: 'VARCHAR(255) NOT NULL DEFAULT ""' },
      { name: 'authorName', type: 'VARCHAR(255) NOT NULL DEFAULT "Anonymous"' },
      { name: 'authorEmail', type: 'VARCHAR(255) DEFAULT ""' },
      { name: 'createdAt', type: 'VARCHAR(100) DEFAULT ""' },
      { name: 'timestamp', type: 'BIGINT DEFAULT 0' },
      { name: 'text', type: 'TEXT' },
    ];

    for (const col of requiredColumns) {
      try {
        await db.query(`ALTER TABLE comments ADD COLUMN ${col.name} ${col.type}`);
      } catch (colErr) {}
    }

    try {
      await db.query(`UPDATE comments SET articleSlug = article_slug WHERE (articleSlug IS NULL OR articleSlug = '') AND article_slug IS NOT NULL`);
    } catch (e) {}
  } catch (err) {
    console.warn('MySQL comments table initialization notice:', err.message);
  }
}
ensureCommentsTable();

app.get('/api/comments/:articleSlug', async (req, res) => {
  try {
    await ensureCommentsTable();
    const { articleSlug } = req.params;
    let query = 'SELECT * FROM comments ORDER BY timestamp DESC';
    let params = [];
    if (articleSlug && articleSlug !== 'all') {
      query = 'SELECT * FROM comments WHERE articleSlug = ? OR articleSlug = ? ORDER BY timestamp DESC';
      params = [articleSlug, articleSlug.toLowerCase()];
    }
    const [rows] = await db.query(query, params);
    return res.status(200).json({ success: true, comments: rows || [] });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.status(500).json({ success: false, comments: [], message: err.message });
  }
});

app.post('/api/comments', commentsLimiter, async (req, res) => {
  try {
    await ensureCommentsTable();
    const { id, articleSlug, text, authorName, authorEmail } = req.body || {};
    if (!articleSlug || !text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'articleSlug and text are required' });
    }
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const commentId = (id && typeof id === 'string' && id.trim())
      ? id.trim()
      : `comment_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const sanitizedText = stripHtml(text);
    if (!sanitizedText) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty or malicious HTML' });
    }

    const newComment = {
      id: commentId,
      articleSlug: articleSlug.trim(),
      authorName: stripHtml(authorName || 'Anonymous') || 'Anonymous',
      authorEmail: stripHtml(authorEmail || ''),
      createdAt: formattedDate,
      timestamp: Date.now(),
      text: sanitizedText,
    };

    await db.query(
      'INSERT INTO comments (id, articleSlug, authorName, authorEmail, createdAt, timestamp, text) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newComment.id, newComment.articleSlug, newComment.authorName, newComment.authorEmail, newComment.createdAt, newComment.timestamp, newComment.text]
    );

    return res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    console.error('Error saving comment:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/comments/:id', protect, async (req, res) => {
  try {
    const rawId = req.params.id || '';
    const targetId = decodeURIComponent(rawId).trim();

    if (req.user.role !== 'admin') {
      const [existing] = await db.query('SELECT * FROM comments WHERE id = ?', [targetId]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }
      const comment = existing[0];
      const userEmail = (req.user.email || '').toLowerCase().trim();
      const commentEmail = (comment.authorEmail || '').toLowerCase().trim();
      if (commentEmail && userEmail !== commentEmail) {
        return res.status(403).json({ success: false, message: 'Access denied: You can only delete your own comments' });
      }
    }

    const [result] = await db.query('DELETE FROM comments WHERE id = ?', [targetId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
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

// ==========================================
// RSS 2.0 XML ENDPOINT FOR TIMES CHICAGO
// ==========================================
app.get(['/rss.xml', '/api/rss'], async (req, res) => {
  const isRaw = req.query.raw === 'true' || req.query.format === 'raw';
  const isDownload = req.query.download === '1' || req.query.download === 'true';

  res.setHeader('Content-Type', isRaw ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (isDownload) {
    res.setHeader('Content-Disposition', 'attachment; filename="rss.xml"');
  }

  let posts = [];
  try {
    const [rows] = await db.query('SELECT * FROM posts ORDER BY publishedAt DESC, created_at DESC LIMIT 50');
    if (rows && rows.length > 0) {
      posts = rows.map(formatPostRow);
    }
  } catch (err) {
    posts = [];
  }

  const cleanCdata = (str) => {
    if (!str) return '';
    return String(str).replace(/\]\]>/g, ']]&gt;').trim();
  };

  const getCleanDescription = (post) => {
    const raw =
      post.excerpt ||
      post.summary ||
      post.description ||
      post.content ||
      post.headline ||
      post.title ||
      '';
    const cleaned = String(raw)
      .replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned.length > 250) {
      return cleaned.substring(0, 247) + '...';
    }
    return cleaned || 'Read the latest news report on Times Chicago.';
  };

  const siteUrl = 'http://localhost:3000';
  const activePosts = posts.filter((p) => (p.status || 'Published').toLowerCase() === 'published');

  const itemsXml = activePosts
    .map((post) => {
      const title = cleanCdata(post.title || post.headline || 'Untitled');
      const description = cleanCdata(getCleanDescription(post));
      const slug = post.slug || post.id || 'article';
      const link = `${siteUrl}/article/${slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date(post.created_at || Date.now()).toUTCString();
      const author = cleanCdata(post.author || post.authorName || 'Times Chicago Staff');
      const category = cleanCdata(post.category || 'News');
      const imageUrl = post.image || post.imageUrl || post.thumbnailUrl || post.coverImage || '';

      const enclosureTag = imageUrl
        ? `\n<enclosure url="${imageUrl.replace(/&/g, '&amp;')}" length="0" type="image/jpeg"/>`
        : '';

      return `<item>
<title>
<![CDATA[ ${title} ]]>
</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<description>
<![CDATA[ ${description} ]]>
</description>
<pubDate>${pubDate}</pubDate>
<author>
<![CDATA[ ${author} ]]>
</author>
<dc:creator>
<![CDATA[ ${author} ]]>
</dc:creator>
<category>
<![CDATA[ ${category} ]]>
</category>${enclosureTag}
</item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Times Chicago</title>
<link>${siteUrl}</link>
<description>Latest news, politics, business, technology, sports and health updates from Times Chicago.</description>
<language>en-us</language>
<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
<image>
<url>${siteUrl}/favicon.jpg</url>
<title>Times Chicago</title>
<link>${siteUrl}</link>
</image>
${itemsXml}
</channel>
</rss>`;

  res.send(rssXml);
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Payload too large. Request body exceeds maximum allowed size.',
    });
  }
  console.error('Unhandled Application Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 WSJ Backend Server running on http://localhost:${PORT}`);
  console.log(`=================================`);
});
