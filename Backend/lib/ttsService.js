const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EdgeTTS } = require('node-edge-tts');

const AUDIO_CACHE_DIR = path.join(__dirname, '..', 'data', 'audio_cache');

if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
}

// Clean HTML tags and formatting for natural speech cadence
// Filters out images, figure blocks, captions, and photo credits so only pure article prose is read
function cleanTextForSpeech(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, ' ')
    .replace(/<span[^>]*class=["'][^"']*(?:image-caption|image-credit)[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, ' ')
    .replace(/\(\s*photo\s*:[^\)]+\)/gi, ' ')
    .replace(/photo\s*:\s*[A-Z\s]{2,30}\b/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, ' and ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate human-like journalist AI audio for an article
 * @param {Object} params
 * @param {string} params.slug
 * @param {string} params.title
 * @param {string} params.deck
 * @param {string} params.bodyContent
 * @param {string} [params.voice]
 */
async function generateArticleSpeech({ slug, title = '', deck = '', bodyContent = '', voice = 'en-US-ChristopherNeural' }) {
  const cleanTitle = cleanTextForSpeech(title);
  const cleanDeck = cleanTextForSpeech(deck);
  const cleanBody = cleanTextForSpeech(bodyContent);

  const fullSpeechText = [cleanTitle, cleanDeck, cleanBody].filter(Boolean).join('. ');

  if (!fullSpeechText) {
    throw new Error('No article text provided for audio synthesis');
  }

  // Generate safe filename based on slug + voice or content hash
  const safeSlug = (slug || 'article').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 80);
  const contentHash = crypto.createHash('md5').update(fullSpeechText + voice).digest('hex').substring(0, 10);
  const fileName = `${safeSlug}_${contentHash}.mp3`;
  const filePath = path.join(AUDIO_CACHE_DIR, fileName);

  // Return cached audio file if it already exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    return {
      success: true,
      cached: true,
      fileName,
      audioUrl: `/api/tts/audio/${fileName}`,
      fullAudioUrl: `http://localhost:5000/api/tts/audio/${fileName}`,
    };
  }

  // Synthesize using Microsoft Edge Neural Voice
  const selectedVoice = voice || 'en-US-ChristopherNeural';
  const tts = new EdgeTTS({
    voice: selectedVoice,
    rate: '+0%',
    pitch: '+0Hz',
  });

  const tempFile = `${filePath}.tmp_${Date.now()}`;
  await tts.ttsPromise(fullSpeechText, tempFile);

  // Atomically rename to final file
  if (fs.existsSync(tempFile)) {
    fs.renameSync(tempFile, filePath);
  }

  return {
    success: true,
    cached: false,
    fileName,
    audioUrl: `/api/tts/audio/${fileName}`,
    fullAudioUrl: `http://localhost:5000/api/tts/audio/${fileName}`,
  };
}

module.exports = {
  AUDIO_CACHE_DIR,
  cleanTextForSpeech,
  generateArticleSpeech,
};
