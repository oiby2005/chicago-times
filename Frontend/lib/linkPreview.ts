export interface LinkPreviewOptions {
  type: "homepage" | "static_page" | "article" | "author" | "category";
  title?: string;
  description?: string;
  image?: string;
  authorRole?: string;
  authorBio?: string;
  urlPath?: string;
  categoryName?: string;
}

export const DEFAULT_SITE_PREVIEWS = {
  domain: "www.timeschicago.com",
  siteName: "Times Chicago",
  homepageTitle: "Breaking News, US News, World News, Politics, Business & Technology | Times Chicago",
  homepageDescription: "Times Chicago delivers breaking news, US and world news, politics, business, economy, technology, crypto, travel, sports, health, opinion and CEO spotlight.",
  homepageImage: "/images/design-reference/website-thumbnail.jpg",
  staticEmblemImage: "/images/design-reference/Fav-Icon-Padded.jpg",
  fallbackArticleImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=1200&q=80",
};

function resolveImageUrl(img?: string): string {
  if (!img) return DEFAULT_SITE_PREVIEWS.homepageImage;
  let target = img.trim();

  // If it's a webp-proxy URL, extract the underlying target URL
  if (target.includes("webp-proxy") && target.includes("url=")) {
    try {
      const match = target.match(/[?&]url=([^&]+)/);
      if (match) {
        target = decodeURIComponent(match[1]);
      }
    } catch (e) {}
  }

  // If it starts with localhost, convert to clean path or direct URL
  if (target.startsWith("http://localhost:3000/") || target.startsWith("http://localhost:5000/")) {
    target = target.replace(/^http:\/\/localhost:\d+/, "");
  }

  if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("data:")) {
    return target;
  }

  const cleanPath = target.startsWith("/") ? target : `/${target}`;
  return cleanPath;
}

export function getLinkPreviewMetadata(options: LinkPreviewOptions): Metadata {
  const { type, title, description, image, authorRole, authorBio, urlPath, categoryName } = options;
  const canonicalUrl = `https://${DEFAULT_SITE_PREVIEWS.domain}${urlPath || ""}`;

  switch (type) {
    case "category": {
      const rawCat = title || categoryName || "News";
      let displayCat = rawCat.trim();
      if (!displayCat.toLowerCase().includes("news") && !["politics", "business", "tech", "economy", "opinion", "arts", "sports", "lifestyle", "health", "markets", "crypto", "real estate"].includes(displayCat.toLowerCase())) {
        displayCat = `${displayCat} News`;
      }
      const catTitle = `${displayCat} | ${DEFAULT_SITE_PREVIEWS.siteName}`;
      const catDesc =
        description ||
        `Latest ${displayCat}, analysis and executive briefings from ${DEFAULT_SITE_PREVIEWS.siteName}.`;
      const catImg = resolveImageUrl(image || DEFAULT_SITE_PREVIEWS.homepageImage);

      return {
        title: catTitle,
        description: catDesc,
        openGraph: {
          title: catTitle,
          description: catDesc,
          url: canonicalUrl,
          siteName: DEFAULT_SITE_PREVIEWS.siteName,
          type: "website",
          images: [{ url: catImg, alt: catTitle }],
        },
        twitter: {
          card: "summary_large_image",
          title: catTitle,
          description: catDesc,
          images: [catImg],
        },
      };
    }

    case "homepage": {
      const finalTitle = DEFAULT_SITE_PREVIEWS.homepageTitle;
      const finalDesc = DEFAULT_SITE_PREVIEWS.homepageDescription;
      const finalImg = resolveImageUrl(DEFAULT_SITE_PREVIEWS.homepageImage);
      return {
        title: finalTitle,
        description: finalDesc,
        openGraph: {
          title: finalTitle,
          description: finalDesc,
          url: canonicalUrl,
          siteName: DEFAULT_SITE_PREVIEWS.siteName,
          type: "website",
          images: [{ url: finalImg, alt: finalTitle }],
        },
        twitter: {
          card: "summary_large_image",
          title: finalTitle,
          description: finalDesc,
          images: [finalImg],
        },
      };
    }

    case "static_page": {
      const pageTitle = title ? `${title} | ${DEFAULT_SITE_PREVIEWS.siteName}` : DEFAULT_SITE_PREVIEWS.siteName;
      const pageDesc = description || `Learn about ${DEFAULT_SITE_PREVIEWS.siteName}, our mission, editorial values, experienced journalists, and commitment to accurate reporting.`;
      const pageImg = resolveImageUrl(image || DEFAULT_SITE_PREVIEWS.staticEmblemImage);

      return {
        title: pageTitle,
        description: pageDesc,
        openGraph: {
          title: pageTitle,
          description: pageDesc,
          url: canonicalUrl,
          siteName: DEFAULT_SITE_PREVIEWS.siteName,
          type: "website",
          images: [{ url: pageImg, alt: pageTitle, width: 300, height: 300 }],
        },
        twitter: {
          card: "summary",
          title: pageTitle,
          description: pageDesc,
          images: [pageImg],
        },
      };
    }

    case "article": {
      const artTitle = title || DEFAULT_SITE_PREVIEWS.siteName;
      const artDesc = description || DEFAULT_SITE_PREVIEWS.homepageDescription;
      const artImg = resolveImageUrl(image || DEFAULT_SITE_PREVIEWS.fallbackArticleImage);

      return {
        title: artTitle,
        description: artDesc,
        openGraph: {
          title: artTitle,
          description: artDesc,
          url: canonicalUrl,
          siteName: DEFAULT_SITE_PREVIEWS.siteName,
          type: "article",
          images: [{ url: artImg, alt: artTitle }],
        },
        twitter: {
          card: "summary_large_image",
          title: artTitle,
          description: artDesc,
          images: [artImg],
        },
      };
    }

    case "author": {
      const authorName = title || "Author";
      const roleText = authorRole || "Writer User";
      const bioText = authorBio || roleText;
      const authorImg = resolveImageUrl(image || DEFAULT_SITE_PREVIEWS.staticEmblemImage);

      return {
        title: authorName,
        description: bioText,
        openGraph: {
          title: authorName,
          description: bioText,
          url: canonicalUrl,
          siteName: DEFAULT_SITE_PREVIEWS.siteName,
          type: "profile",
          images: [{ url: authorImg, alt: authorName, width: 300, height: 300 }],
        },
        twitter: {
          card: "summary",
          title: authorName,
          description: bioText,
          images: [authorImg],
        },
      };
    }

    default:
      return {
        title: DEFAULT_SITE_PREVIEWS.homepageTitle,
        description: DEFAULT_SITE_PREVIEWS.homepageDescription,
      };
  }
}
