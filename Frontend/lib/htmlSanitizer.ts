import DOMPurify from "isomorphic-dompurify";
import { ensureWebpUrl } from "@/lib/webpConverter";

export interface SanitizeArticleOptions {
  allowIframes?: boolean;
}

/**
 * Sanitizes article HTML content to completely prevent Stored and Reflected XSS:
 * - Strips all executable scripts (<script>, <svg>, <object>, <embed>, <link>, <meta>, <form>, etc.).
 * - Strips all inline JavaScript event handlers (onerror, onload, onclick, onmouseover, etc.).
 * - Strips dangerous URL schemes (javascript:, vbscript:, data:text/html, etc.).
 * - Preserves safe rich-text formatting (paragraphs, headings, bold, italic, lists, blockquotes, tables, figures, images).
 * - Enforces target="_blank" and rel="noopener noreferrer" on external anchor links.
 * - Converts image src attributes through ensureWebpUrl to serve optimal WebP format.
 */
export function sanitizeArticleHtml(
  rawHtml: string | null | undefined,
  options: SanitizeArticleOptions = {}
): string {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  const config: DOMPurify.Config = {
    ALLOWED_TAGS: [
      "p", "span", "br", "hr",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup", "mark", "small",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "figure", "figcaption", "img", "div",
      "table", "thead", "tbody", "tr", "th", "td",
      "a",
      ...(options.allowIframes ? ["iframe"] : []),
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "title",
      "src", "alt", "width", "height",
      "class", "style", "data-type", "data-testid", "data-webp-converted",
      "id",
      ...(options.allowIframes ? ["frameborder", "allow", "allowfullscreen"] : []),
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: [
      "script", "style", "object", "embed", "link", "meta", "base",
      "form", "input", "button", "textarea", "svg", "applet",
    ],
    FORBID_ATTR: [
      "onerror", "onload", "onclick", "onmouseover", "onmouseout", "onmouseenter", "onmouseleave",
      "onfocus", "onblur", "onkeydown", "onkeyup", "onkeypress", "onsubmit", "onchange", "oninput",
      "formaction", "autofocus",
    ],
  };

  let clean: string = String(DOMPurify.sanitize(rawHtml, config as Parameters<typeof DOMPurify.sanitize>[1]));

  // 1. Ensure external image URLs are passed through ensureWebpUrl
  clean = clean.replace(/src=["']([^"']+)["']/g, (_match: string, src: string) => {
    return `src="${ensureWebpUrl(src)}"`;
  });

  // 2. Ensure all anchor links have safe target and rel attributes
  clean = clean.replace(/<a\b([^>]*)>/gi, (_match: string, attrs: string) => {
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
