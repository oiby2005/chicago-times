const DOMPurify = require('isomorphic-dompurify');

/**
 * Sanitizes article HTML content before persisting to database or file:
 * - Strips all executable scripts (<script>, <svg>, <object>, <embed>, <link>, <meta>, <form>, etc.).
 * - Strips all inline JavaScript event handlers (onerror, onload, onclick, onmouseover, etc.).
 * - Strips dangerous URL schemes (javascript:, vbscript:, data:text/html, etc.).
 * - Preserves safe rich-text formatting (paragraphs, headings, bold, italic, lists, blockquotes, tables, figures, images).
 */
function sanitizeArticleHtml(rawHtml, options = {}) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  const config = {
    ALLOWED_TAGS: [
      'p', 'span', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup', 'mark', 'small',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'figure', 'figcaption', 'img', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a',
      ...(options.allowIframes ? ['iframe'] : []),
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title',
      'src', 'alt', 'width', 'height',
      'class', 'style', 'data-type', 'data-testid', 'data-webp-converted',
      'id',
      ...(options.allowIframes ? ['frameborder', 'allow', 'allowfullscreen'] : []),
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: [
      'script', 'style', 'object', 'embed', 'link', 'meta', 'base',
      'form', 'input', 'button', 'textarea', 'svg', 'applet',
    ],
    FORBID_ATTR: [
      'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave',
      'onfocus', 'onblur', 'onkeydown', 'onkeyup', 'onkeypress', 'onsubmit', 'onchange', 'oninput',
      'formaction', 'autofocus',
    ],
  };

  let clean = DOMPurify.sanitize(rawHtml, config);

  // Ensure all anchor links have safe target and rel attributes
  clean = clean.replace(/<a\b([^>]*)>/gi, (_match, attrs) => {
    let updatedAttrs = attrs;
    if (!/target\s*=/i.test(updatedAttrs)) {
      updatedAttrs += ' target="_blank"';
    } else {
      updatedAttrs = updatedAttrs.replace(/target\s*=\s*(['"])[^'"]*\1/gi, 'target="_blank"');
    }

    if (!/rel\s*=/i.test(updatedAttrs)) {
      updatedAttrs += ' rel="noopener noreferrer"';
    } else if (!updatedAttrs.includes("noopener")) {
      updatedAttrs = updatedAttrs.replace(/rel\s*=\s*(['"])(.*?)\1/gi, 'rel="noopener noreferrer"');
    }

    return `<a${updatedAttrs}>`;
  });

  return clean;
}

/**
 * Completely strips all HTML tags and returns safe plain text.
 * Suitable for comment text, author names, review summaries, etc.
 */
function stripHtml(input) {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

module.exports = {
  sanitizeArticleHtml,
  stripHtml,
};
