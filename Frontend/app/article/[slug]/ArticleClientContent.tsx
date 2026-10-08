"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import { getArticleBySlug } from "@/data/articles";
import ArticleTopBar from "@/components/article/ArticleTopBar";
import ArticleToolbar from "@/components/article/ArticleToolbar";
import BookmarkButton from "@/components/article/BookmarkButton";
import ArticleAudioReader from "@/components/article/ArticleAudioReader";
import ArticleUpNextSection from "@/components/article/ArticleUpNextSection";
import RecentAllCategoriesSidebar from "@/components/article/RecentAllCategoriesSidebar";
import ArticleSidebarAds from "@/components/article/ArticleSidebarAds";
import MostPopularNewsSidebar from "@/components/article/MostPopularNewsSidebar";
import ArticleVideosSection from "@/components/article/ArticleVideosSection";
import NewsletterSignupBanner from "@/components/article/NewsletterSignupBanner";
import ArticleCommentsSection from "@/components/article/ArticleCommentsSection";
import ShareCardModal from "@/components/article/ShareCardModal";
import { getAuthorForArticle } from "@/data/authors";
import { ensureWebpUrl, migrateLocalStorageToWebP } from "@/lib/webpConverter";
import { getRelativeTime, getFormattedDateTime } from "@/lib/relativeTime";
import { recordArticleView } from "@/lib/viewTracker";

interface ArticleClientContentProps {
  slug: string;
  initialArticle?: any;
}

export default function ArticleClientContent({ slug, initialArticle }: ArticleClientContentProps) {
  const [customPost, setCustomPost] = useState<any>(null);
  const [isMainShareOpen, setIsMainShareOpen] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [headlinePassed, setHeadlinePassed] = useState(false);
  const [isStickyHeader, setIsStickyHeader] = useState(false);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && slug) {
      recordArticleView(slug);
    }
  }, [slug]);

  useEffect(() => {
    const handleScrollSticky = () => {
      if (window.scrollY > 220) {
        setIsStickyHeader(true);
      } else {
        setIsStickyHeader(false);
      }
    };
    window.addEventListener("scroll", handleScrollSticky);
    handleScrollSticky();
    return () => window.removeEventListener("scroll", handleScrollSticky);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("wsj_notification_dismissed");
      if (!dismissed) {
        setShowNotificationAlert(true);
      }
    }
  }, []);

  const handleDismissNotification = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wsj_notification_dismissed", "true");
    }
    setShowNotificationAlert(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (headlineRef.current) {
        const rect = headlineRef.current.getBoundingClientRect();
        if (rect.bottom < 60) {
          setHeadlinePassed(true);
        } else {
          setHeadlinePassed(false);
        }
      } else {
        if (window.scrollY > 450) {
          setHeadlinePassed(true);
        } else {
          setHeadlinePassed(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      migrateLocalStorageToWebP();
      try {
        let posts: any[] = [];
        const stored = localStorage.getItem("wsj_posts");
        if (stored) posts = [...posts, ...JSON.parse(stored)];
        const storedPub = localStorage.getItem("wsj_published_posts");
        if (storedPub) posts = [...posts, ...JSON.parse(storedPub)];

        const cleanParamSlug = slug.toLowerCase().trim();
        const match = posts.find((p: any) => {
          if (!p) return false;
          const pTitleSlug = p.title
            ? p.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
            : "";
          return (
            p.slug === slug ||
            String(p.id) === String(slug) ||
            pTitleSlug === cleanParamSlug ||
            (p.title && p.title.toLowerCase().trim() === cleanParamSlug)
          );
        });

        if (match) {
          setCustomPost(match);
          const cleanTitleSlug = match.title
            ? match.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
            : match.slug;
          if (cleanTitleSlug && slug !== cleanTitleSlug && typeof window !== "undefined" && window.history) {
            window.history.replaceState(null, "", `/article/${cleanTitleSlug}`);
          }
        }
      } catch (e) {}
    }
  }, [slug]);

  const staticArticle = initialArticle || getArticleBySlug(slug) || {};

  // Resolve values: preferring custom writer post data from localStorage
  const title =
    customPost?.title ||
    staticArticle.title ||
    "How Serious Is Joe Biden’s Cancer as His Son Says the Disease Has Spread Further";
  const deck =
    customPost?.subheadline ||
    customPost?.cardSummary ||
    staticArticle.deck ||
    staticArticle.summary ||
    'Former U.S. President Joe Biden is facing a worsening health situation after his son Hunter Biden said the cancer has spread to his bones and described the disease as "very painful" and "very debilitating."';
  const category = customPost?.category || staticArticle.category || "US";
  const authorName = customPost?.author || staticArticle.author || "writer";

  const publishedDate = getFormattedDateTime(
    customPost?.publishedAt || staticArticle?.publishedAt,
    customPost?.date || staticArticle?.publishedDate
  );
  const rawImageUrl = customPost?.thumbnail || staticArticle.imageUrl || "";
  const imageUrl = ensureWebpUrl(rawImageUrl);
  const photoCaption = customPost?.photoCaption || staticArticle.photoCaption || "";
  const rawBodyHtml = customPost?.bodyContent || null;
  const bodyHtml = rawBodyHtml
    ? rawBodyHtml
        .replace(/src=["']([^"']+)["']/g, (match: string, src: string) => `src="${ensureWebpUrl(src)}"`)
        .replace(/<a\b([^>]*)>/gi, (match: string, p1: string) => {
          let attrs = p1;
          if (!/target\s*=/i.test(attrs)) {
            attrs += ' target="_blank"';
          } else {
            attrs = attrs.replace(/target\s*=\s*(['"])[^'"]*\1/gi, 'target="_blank"');
          }
          if (!/rel\s*=/i.test(attrs)) {
            attrs += ' rel="noopener noreferrer"';
          }
          return `<a${attrs}>`;
        })
    : null;
  const tags: string[] = customPost?.tags || [];

  const [authorObj, setAuthorObj] = useState<any>(() => getAuthorForArticle(slug, authorName, customPost?.authorEmail));

  useEffect(() => {
    if (typeof window !== "undefined" && title) {
      document.title = `${title} - Times Chicago`;
    }
  }, [title]);

  useEffect(() => {
    const syncAuthor = () => {
      const updated = getAuthorForArticle(slug, authorName, customPost?.authorEmail);
      setAuthorObj(updated);
    };
    syncAuthor();
    if (typeof window !== "undefined") {
      window.addEventListener("wsj_user_updated", syncAuthor);
      return () => window.removeEventListener("wsj_user_updated", syncAuthor);
    }
  }, [slug, authorName, customPost]);

  const currentArticleData = {
    id: customPost?.id || staticArticle.id || slug,
    slug: slug,
    title: title,
    deck: deck,
    category: category,
    date: publishedDate,
    author: authorName,
    image: imageUrl,
  };

  // Check if bodyHtml already embeds the hero image to prevent duplicate rendering
  const bodyHasHeroImg = bodyHtml && imageUrl && bodyHtml.includes(imageUrl);

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        {/* Main Header & Navigation */}
        <Header />

        {/* Top Push Notification Alert Floating Card (Image 1) */}
        {showNotificationAlert && (
          <div
            className={`fixed right-6 z-50 max-w-sm bg-[#FAF8F5] border border-[#E5E0D5] shadow-2xl p-4 font-sans text-xs text-[#1e293b] transition-all duration-200 ${
              headlinePassed
                ? "top-[48px]"
                : isStickyHeader
                ? "top-[92px]"
                : "top-[145px]"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-[#0f172a] mb-1">Stay updated with Times Chicago</p>
                <p className="text-[11.5px] text-[#475569] leading-relaxed mb-3">
                  We’d like to send you notifications for the latest breaking news and market updates.
                </p>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/signup"
                    onClick={handleDismissNotification}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-3 py-1.5 rounded-none text-xs transition-colors cursor-pointer"
                  >
                    Sign Up
                  </Link>
                  <button
                    onClick={handleDismissNotification}
                    className="text-[#64748b] hover:text-[#0f172a] text-xs font-semibold underline transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismissNotification}
                className="text-[#94a3b8] hover:text-[#0f172a] p-1 leading-none text-sm cursor-pointer"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <StickyHeaderBar visible={!headlinePassed} />

        {/* Sticky Article Scroll Navbar (Appears after scrolling past article title) */}
        <ArticleToolbar
          visible={headlinePassed}
          articleTitle={title}
          deck={deck}
          bodyContent={bodyHtml || undefined}
          currentFontSize={fontSize}
          onFontSizeChange={setFontSize}
          article={currentArticleData}
        />

        {/* Article Page Body */}
        <div className="article-body">
          {/* Section 1: Top Bar (< BACK TO NEWSFEED + A A A, Bookmark, Share) */}
          <ArticleTopBar article={currentArticleData} />

          {/* Section 2: Main Article Content & Sidebar */}
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Main Article Body (Span 8) */}
              <article className="lg:col-span-8 space-y-5 lg:border-r lg:border-dashed lg:border-[#CCCCCC] lg:pr-10">
                {/* Category Badge */}
                <div className="flex items-center space-x-3 mb-3">
                  <Link
                    href={`/${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[13px] font-sans font-bold text-[#505e70] hover:text-[#111111] hover:underline tracking-wider uppercase cursor-pointer transition-colors"
                  >
                    {category}
                  </Link>
                </div>

                {/* Article Headline */}
                <h1 ref={headlineRef} className="text-3xl sm:text-4xl md:text-[38px] lg:text-[42px] font-serif font-playfair font-bold text-[#111111] leading-tight mb-4">
                  {title}
                </h1>

                {/* Subheadline / Deck */}
                {deck && (
                  <p className="font-serif text-base sm:text-lg md:text-[19px] text-[#333333] leading-relaxed">
                    {deck}
                  </p>
                )}

                {/* Author Byline & Share + Bookmark Icons */}
                <div className="pt-2 pb-4 border-b border-dashed border-[#CCCCCC]">
                  <div className="font-sans flex items-start justify-start gap-3 select-none">
                    {/* Writer's Profile Image - Height aligned to cover bottom of date line */}
                    <div className="relative w-[56px] h-[56px] sm:w-[60px] sm:h-[60px] rounded-none overflow-hidden shrink-0 border border-gray-300 shadow-2xs bg-gray-100 flex items-center justify-center">
                      {authorObj.image ? (
                        <img
                          src={authorObj.image}
                          alt={authorObj.name}
                          className="w-full h-full object-cover rounded-none"
                        />
                      ) : (
                        <div className="w-full h-full rounded-none bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                          {authorObj.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Writer Name + Inline Share & Bookmark Icons + Published Date */}
                    <div className="flex flex-col justify-between h-[56px] sm:h-[60px]">
                      <div className="text-[14px] font-bold text-[#111111] leading-none flex items-center gap-2">
                        <span>
                          By{" "}
                          <Link
                            href={`/author/${authorObj.slug}`}
                            className="underline hover:text-black cursor-pointer"
                          >
                            {authorObj.name}
                          </Link>
                        </span>

                        {authorObj.linkedinUrl && (
                          <a
                            href={authorObj.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-none hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                            title={`${authorObj.name}'s LinkedIn Profile`}
                          >
                            <svg className="w-8 h-8 rounded-none" viewBox="0 0 24 24">
                              <rect width="24" height="24" fill="#0077b5" rx="0" />
                              <path
                                d="M8 19H5V8h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                                fill="white"
                              />
                            </svg>
                          </a>
                        )}

                        {/* Share Icon */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsMainShareOpen(!isMainShareOpen)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-none border border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#334155] hover:text-[#0f172a] transition-colors cursor-pointer shadow-2xs"
                            title="Share Article"
                            aria-label="Share Article"
                            suppressHydrationWarning
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M4 19c2.5-2.5 6-4.5 11-4.5v4.5l8-8.5L15 2v4.5C8.5 6.5 4.5 11 4 19z" />
                            </svg>
                          </button>
                          <ShareCardModal
                            isOpen={isMainShareOpen}
                            onClose={() => setIsMainShareOpen(false)}
                            title={title}
                          />
                        </div>

                        {/* Bookmark Icon */}
                        <BookmarkButton article={currentArticleData} variant="inline" />

                        {/* Google Auto Reader / Listen Audio Control */}
                        <ArticleAudioReader title={title} deck={deck} bodyContent={bodyHtml || undefined} />
                      </div>

                      <div className="text-[13.5px] font-semibold text-[#555555] leading-none">
                        {publishedDate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Image (rendered if not already embedded in bodyHtml) */}
                {imageUrl && !bodyHasHeroImg && (
                  <div className="pt-2">
                    <div className="w-full aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {photoCaption && (
                      <p className="font-sans italic text-[11px] text-gray-500 mt-2">
                        {photoCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Article Content: Render custom writer HTML if available, else static paragraphs */}
                {bodyHtml ? (
                  <div
                    className="article-body-content font-serif text-[17px] sm:text-[18px] text-[#1a1a1a] leading-[1.75] space-y-5 pt-3 w-full clear-both block"
                    style={{ fontFamily: "Exchange, Georgia, 'Source Serif 4', serif" }}
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                ) : (
                  <div
                    className="article-body-content font-serif text-[17px] sm:text-[18px] text-[#1a1a1a] leading-[1.75] space-y-5 pt-3 w-full clear-both block"
                    style={{ fontFamily: "Exchange, Georgia, 'Source Serif 4', serif" }}
                  >
                    <p>Joe Biden’s health has taken a more serious turn.</p>
                    <p>
                      In an interview with the BBC on{" "}
                      <strong className="font-bold text-[#111111]">
                        Friday, August 7, 2026
                      </strong>
                      , Hunter Biden said his father’s prostate cancer has spread
                      further, including to his bones. The former president is{" "}
                      <strong className="font-bold text-[#111111]">
                        83 years old
                      </strong>
                      , and his office has not publicly disclosed additional
                      details about where else the cancer may have spread.
                    </p>
                    <p>
                      Biden’s cancer was first made public in{" "}
                      <strong className="font-bold text-[#111111]">
                        May 2025
                      </strong>
                      , when his personal office announced that he had been
                      diagnosed with an aggressive form of prostate cancer.
                    </p>
                  </div>
                )}

                {/* Middle In-Article Google Ad Placeholder */}
                <div className="my-8 py-5 px-4 border-y border-[#e2e8f0] text-center bg-[#fafafa] flex flex-col items-center justify-center clear-both w-full rounded-none">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#94a3b8] font-bold mb-2">Advertisement</span>
                  
                  {/* Google AdSense ins Tag */}
                  <ins className="adsbygoogle"
                       style={{ display: "block", textAlign: "center", minWidth: "250px", minHeight: "90px" }}
                       data-ad-layout="in-article"
                       data-ad-format="fluid"
                       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                       data-ad-slot="XXXXXXXXXX"
                       data-ad-test="on"></ins>

                  {/* Localhost Development Visual Test Box */}
                  <div className="mt-2 w-full max-w-lg border border-dashed border-[#94a3b8] bg-[#f1f5f9] p-4 rounded text-center">
                    <p className="font-sans text-xs font-bold text-[#1e293b]">
                      [ Google AdSense Banner Slot - Localhost Test Preview ]
                    </p>
                    <p className="font-sans text-[11px] text-[#64748b] mt-1">
                      Format: Fluid In-Article Ad | Test Mode: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-300 font-mono text-[10.5px]">data-ad-test=&quot;on&quot;</code>
                    </p>
                  </div>
                </div>

                {/* Hashtags Footer Row */}
                {tags && tags.length > 0 && (
                  <div className="pt-6 border-b border-[#e5e7eb] pb-6 font-sans text-[11px] font-bold text-[#666666] tracking-wider flex flex-wrap gap-2 uppercase clear-both w-full">
                    {tags.map((t: string, idx: number) => {
                      const cleanTag = t.replace(/^#/, "").trim().toUpperCase();
                      return (
                        <span key={idx}>
                          #{cleanTag}{idx < tags.length - 1 ? "," : ""}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Section 4: Article Comments Section (Without top border) */}
                <div className="w-full clear-both pt-6 mt-4">
                  <ArticleCommentsSection
                    articleSlug={slug}
                    commentCount={customPost?.commentsCount || staticArticle.commentCount || 0}
                  />
                </div>

                {/* Section 5: Up Next Section (Matching Image 4 - Up to 9 articles) */}
                <div className="w-full clear-both pt-4 mt-4">
                  <ArticleUpNextSection
                    categoryName={category}
                    currentSlug={slug}
                    currentId={currentArticleData.id}
                  />
                </div>

                {/* Section 6: Video Section (Matching Image 1 - 3 Recent Videos) */}
                <ArticleVideosSection />
              </article>

              {/* Right Sidebar Column (Span 4) */}
              <div className="lg:col-span-4 pl-0 lg:pl-4 mt-8 lg:mt-0">
                {/* 1. Top: Recent in All Categories (5 most recent articles across any category) */}
                <RecentAllCategoriesSidebar
                  currentSlug={slug}
                  currentId={currentArticleData.id}
                />

                {/* 2. Middle: 2 Advertisements (Admin Manageable) */}
                <ArticleSidebarAds />

                {/* 3. Bottom: Most Popular News (Sticky until bottom of videos section) */}
                <div className="lg:sticky lg:top-[90px] self-start w-full">
                  <MostPopularNewsSidebar />
                </div>
              </div>
            </div>
          </Container>

          {/* Subscription Banner Section (White background, mobile, tablet & desktop responsive) */}
          <Container className="pb-12 pt-4">
            <div className="w-full bg-white border border-[#e2e8f0] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 my-4 font-sans shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
              <h2 className="font-serif font-bold text-base sm:text-lg md:text-xl lg:text-[22px] text-black tracking-tight text-left leading-snug flex-1">
                Continue reading your article with a Times Chicago subscription
              </h2>
              <div className="shrink-0 w-full sm:w-auto text-center sm:text-right">
                <Link
                  href="/special-offer"
                  className="w-full sm:w-auto inline-block bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-none shadow-xs transition-colors cursor-pointer whitespace-nowrap text-center"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Main Footer */}
      <Footer />
    </main>
  );
}
