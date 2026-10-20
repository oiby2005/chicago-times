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
import { getAuthorForArticle, slugifyAuthorName } from "@/data/authors";
import { ensureWebpUrl, migrateLocalStorageToWebP } from "@/lib/webpConverter";
import { sanitizeArticleHtml } from "@/lib/htmlSanitizer";
import { getRelativeTime, getFormattedDateTime } from "@/lib/relativeTime";
import { recordArticleView } from "@/lib/viewTracker";

interface ArticleClientContentProps {
  slug: string;
  initialArticle?: any;
}

export default function ArticleClientContent({ slug, initialArticle }: ArticleClientContentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [customPost, setCustomPost] = useState<any>(null);
  const [isMainShareOpen, setIsMainShareOpen] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [headlinePassed, setHeadlinePassed] = useState(false);
  const [isStickyHeader, setIsStickyHeader] = useState(false);
  const [notificationTop, setNotificationTop] = useState(170);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);

  // Track scroll progress along the entire article page (0% at top to 100% at bottom)
  useEffect(() => {
    const handleScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    window.addEventListener("resize", handleScrollProgress);
    handleScrollProgress();

    return () => {
      window.removeEventListener("scroll", handleScrollProgress);
      window.removeEventListener("resize", handleScrollProgress);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {}
    }
  }, []);

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
      const userStr = sessionStorage.getItem("wsj_user");
      const sessionDismissed = sessionStorage.getItem("wsj_notification_dismissed");
      // Show the alert card when reading an article in a signed-out account unless dismissed in this session
      if (!userStr && !sessionDismissed) {
        setShowNotificationAlert(true);
      }
    }
  }, []);

  const handleDismissNotification = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("wsj_notification_dismissed", "true");
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

  // Dynamically compute exact bottom of active navbar so notification has 0 padding / 0 gap
  useEffect(() => {
    const updateNotificationTop = () => {
      if (typeof window === "undefined") return;

      // 1. Article toolbar is active when headline has passed
      if (headlinePassed) {
        const toolbarEl = document.getElementById("article-toolbar-nav");
        if (toolbarEl) {
          const rect = toolbarEl.getBoundingClientRect();
          setNotificationTop(Math.max(0, Math.round(rect.bottom)));
          return;
        }
      }

      // 2. Sticky header bar is active when scrolled past threshold (and before headlinePassed)
      if (isStickyHeader) {
        const stickyEl = document.getElementById("sticky-header-bar");
        if (stickyEl) {
          const rect = stickyEl.getBoundingClientRect();
          setNotificationTop(Math.max(0, Math.round(rect.bottom)));
          return;
        }
      }

      // 3. Otherwise, main header nav is visible at normal position
      const mainNavEl = document.getElementById("main-header-nav");
      if (mainNavEl) {
        const rect = mainNavEl.getBoundingClientRect();
        setNotificationTop(Math.max(0, Math.round(rect.bottom)));
        return;
      }
    };

    updateNotificationTop();
    window.addEventListener("scroll", updateNotificationTop, { passive: true });
    window.addEventListener("resize", updateNotificationTop);

    return () => {
      window.removeEventListener("scroll", updateNotificationTop);
      window.removeEventListener("resize", updateNotificationTop);
    };
  }, [headlinePassed, isStickyHeader]);

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
  const rawBodyHtml = customPost?.bodyContent || staticArticle?.bodyContent || null;
  const bodyHtml = rawBodyHtml ? sanitizeArticleHtml(rawBodyHtml) : null;
  const tags: string[] = customPost?.tags || [];

  const [authorObj, setAuthorObj] = useState<any>(() => getAuthorForArticle(slug, authorName, customPost?.authorEmail));

  // Resolve all writers (Main writer first, then sub writers added by admin)
  const allArticleWriters = React.useMemo(() => {
    const list: { name: string; slug: string; email?: string; linkedinUrl?: string }[] = [];
    const primaryEmail = (authorObj?.email || customPost?.authorEmail || "").toLowerCase().trim();
    if (authorObj && authorObj.name) {
      list.push({
        name: authorObj.name,
        slug: authorObj.slug || slugifyAuthorName(authorObj.name),
        email: primaryEmail,
        linkedinUrl: authorObj.linkedinUrl,
      });
    } else if (authorName) {
      list.push({
        name: authorName,
        slug: slugifyAuthorName(authorName),
        email: primaryEmail,
      });
    }

    if (customPost?.sub_writers && Array.isArray(customPost.sub_writers)) {
      customPost.sub_writers.forEach((sw: any) => {
        const swName = sw.name || sw.full_name || sw;
        const swEmail = (sw.email || "").toLowerCase().trim();
        if (swName && typeof swName === "string" && !list.some((w) => w.name.toLowerCase() === swName.toLowerCase())) {
          list.push({
            name: swName,
            slug: sw.slug || slugifyAuthorName(swName),
            email: swEmail,
            linkedinUrl: sw.linkedin || sw.linkedinUrl,
          });
        }
      });
    }
    return list;
  }, [authorObj, authorName, customPost]);

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
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between ">
      {/* Article Reading Scroll Progress Bar (Extends from 0% to 100% when scrolled to bottom) */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] sm:h-[3.5px] pointer-events-none  bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#cc0000] transition-[width] duration-75 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div>
        {/* Main Header & Navigation */}
        <Header />

        {/* Top Push Notification Alert Floating Card (Matching Image 2) */}
        {showNotificationAlert && (
          <div
            style={{ top: `${notificationTop}px` }}
            className="fixed right-4 sm:right-6 z-[999] max-w-[340px] w-[calc(100vw-32px)] sm:w-full bg-[#FAF8F5] border border-[#EBE6DC] shadow-xl p-5 font-sans text-xs text-[#333333] transition-[top] duration-150 rounded-none"
          >
            <p className="font-semibold text-sm text-[#3b3735] mb-1.5 leading-snug">
              We’d like to send you notifications.
            </p>
            <p className="text-[12.5px] text-[#57534e] leading-relaxed mb-4">
              To get the latest from Times Chicago select “Sign up” and then “Allow”
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={handleDismissNotification}
                className="text-[#444444] hover:text-black font-bold text-xs cursor-pointer transition-colors"
              >
                Dismiss
              </button>
              <Link
                href="/signup"
                onClick={handleDismissNotification}
                className="bg-[#524e4a] hover:bg-[#3d3a37] text-white font-bold text-xs px-5 py-2 rounded-md transition-colors cursor-pointer inline-block text-center"
              >
                Sign Up
              </Link>
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
                  <p
                    className="font-georgia-serif font-bold text-base sm:text-lg md:text-[19px] text-[#111111] leading-relaxed"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, color: "#111111" }}
                  >
                    {deck}
                  </p>
                )}

                {/* Author Byline & Share + Bookmark Icons */}
                <div className="pt-2 pb-4 border-b border-dashed border-[#CCCCCC]">
                  {/* DESKTOP VIEW (sm:flex) */}
                  <div className="hidden sm:flex font-sans items-start justify-start gap-3">
                    {/* Writer's Profile Image */}
                    <div className="relative w-[38px] h-[38px] rounded-none overflow-hidden shrink-0 border border-gray-300 shadow-2xs bg-gray-100 flex items-center justify-center">
                      {isMounted && authorObj.image ? (
                        <img
                          src={authorObj.image}
                          alt={authorObj.name}
                          className="w-full h-full object-contain rounded-none bg-slate-50"
                        />
                      ) : (
                        <div className="w-full h-full rounded-none bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                          {authorObj.name ? authorObj.name.charAt(0).toUpperCase() : "W"}
                        </div>
                      )}
                    </div>

                    {/* Writer Name + Inline Share & Bookmark Icons + Published Date */}
                    <div className="flex flex-col justify-between h-[38px]">
                      <div className="text-[14px] font-bold text-[#111111] leading-none flex items-center gap-2">
                        <span>
                          By{" "}
                          {allArticleWriters.map((writer, idx) => {
                            const isLast = idx === allArticleWriters.length - 1;
                            const isSecondToLast = idx === allArticleWriters.length - 2;
                            return (
                              <React.Fragment key={`${writer.slug}-${idx}`}>
                                <Link
                                  href={writer.email ? `/author/${writer.slug}?email=${encodeURIComponent(writer.email)}` : `/author/${writer.slug}`}
                                  className="hover:underline hover:text-black cursor-pointer"
                                >
                                  {writer.name}
                                </Link>
                                {allArticleWriters.length > 1 && !isLast && (
                                  isSecondToLast ? " and " : ", "
                                )}
                              </React.Fragment>
                            );
                          })}
                        </span>

                        {authorObj.linkedinUrl && (
                          <a
                            href={authorObj.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-5 h-5 rounded-none hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                            title={`${authorObj.name}'s LinkedIn Profile`}
                          >
                            <svg className="w-5 h-5 rounded-none" viewBox="0 0 24 24">
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
                            className="inline-flex items-center justify-center w-5 h-5 rounded-none border border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#334155] hover:text-[#0f172a] transition-colors cursor-pointer shadow-2xs"
                            title="Share Article"
                            aria-label="Share Article"
                            suppressHydrationWarning
                          >
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                        <BookmarkButton article={currentArticleData} variant="inline" size="sm" />

                        {/* Google Auto Reader / Listen Audio Control */}
                        <ArticleAudioReader title={title} deck={deck} bodyContent={bodyHtml || undefined} slug={slug} />
                      </div>

                      <div className="text-[13px] font-semibold text-[#555555] leading-none">
                        {publishedDate}
                      </div>
                    </div>
                  </div>

                  {/* MOBILE VIEW (<sm) - Organised cleanly with buttons next to date & time */}
                  <div className="flex sm:hidden font-sans items-start justify-start gap-3">
                    {/* Writer's Profile Image */}
                    <div className="relative w-[76px] h-[76px] aspect-square rounded-none overflow-hidden shrink-0 border border-gray-300 shadow-2xs bg-gray-100 flex items-center justify-center">
                      {isMounted && authorObj.image ? (
                        <img
                          src={authorObj.image}
                          alt={authorObj.name}
                          className="w-full h-full object-contain rounded-none bg-slate-50"
                        />
                      ) : (
                        <div className="w-full h-full rounded-none bg-[#111111] text-white flex items-center justify-center font-bold text-base">
                          {authorObj.name ? authorObj.name.charAt(0).toUpperCase() : "W"}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Row 1 (Name), Row 2 (Date + 3 Buttons), Row 3 (Listen Audio Reader) */}
                    <div className="flex flex-col justify-between h-[76px] w-full min-w-0">
                      {/* Row 1: Writer Name */}
                      <div className="text-[14px] font-bold text-[#111111] leading-none">
                        <span>
                          By{" "}
                          {allArticleWriters.map((writer, idx) => {
                            const isLast = idx === allArticleWriters.length - 1;
                            const isSecondToLast = idx === allArticleWriters.length - 2;
                            return (
                              <React.Fragment key={`${writer.slug}-${idx}`}>
                                <Link
                                  href={writer.email ? `/author/${writer.slug}?email=${encodeURIComponent(writer.email)}` : `/author/${writer.slug}`}
                                  className="hover:underline hover:text-black cursor-pointer"
                                >
                                  {writer.name}
                                </Link>
                                {allArticleWriters.length > 1 && !isLast && (
                                  isSecondToLast ? " and " : ", "
                                )}
                              </React.Fragment>
                            );
                          })}
                        </span>
                      </div>

                      {/* Row 2: Published Date */}
                      <div className="text-[12px] font-semibold text-[#555555] leading-none">
                        {publishedDate}
                      </div>

                      {/* Row 3: Action Buttons (LinkedIn, Share, Bookmark) + Listen Audio Reader */}
                      <div className="flex items-center gap-2 flex-nowrap min-w-0">
                        <div className="flex items-center gap-1.5 shrink-0">
                          {authorObj.linkedinUrl && (
                            <a
                              href={authorObj.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center w-6 h-6 rounded-none hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                              title={`${authorObj.name}'s LinkedIn Profile`}
                            >
                              <svg className="w-6 h-6 rounded-none" viewBox="0 0 24 24">
                                <rect width="24" height="24" fill="#0077b5" rx="0" />
                                <path
                                  d="M8 19H5V8h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                                  fill="white"
                                />
                              </svg>
                            </a>
                          )}

                          {/* Share Icon */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => setIsMainShareOpen(!isMainShareOpen)}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-none border border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#334155] hover:text-[#0f172a] transition-colors cursor-pointer shadow-2xs"
                              title="Share Article"
                              aria-label="Share Article"
                              suppressHydrationWarning
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                        </div>

                        {/* Listen Audio Reader next to action symbols */}
                        <div className="[&>div]:border-l [&>div]:border-[#CCCCCC] [&>div]:pl-2.5 [&>div]:ml-0 flex items-center shrink-0">
                          <ArticleAudioReader title={title} deck={deck} bodyContent={bodyHtml || undefined} slug={slug} />
                        </div>
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

                {/* Middle In-Article Google Ad Container */}
                <div className="my-4 py-2 text-center flex flex-col items-center justify-center clear-both w-full">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#94a3b8] font-bold mb-1">Advertisement</span>
                  
                  {/* Google AdSense ins Tag */}
                  <ins className="adsbygoogle"
                       style={{ display: "block", textAlign: "center", width: "100%", maxWidth: "728px" }}
                       data-ad-layout="in-article"
                       data-ad-format="fluid"
                       data-ad-client="ca-pub-3455329981771469"
                       data-ad-slot="article_middle_inline_ad"
                       data-ad-test="on"></ins>
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
                    commentCount={0}
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
                  className="w-full sm:w-auto inline-block bg-white hover:bg-slate-100 text-[#334155] border border-[#cbd5e1] font-sans font-bold text-xs sm:text-sm px-6 py-2.5 rounded-none shadow-2xs transition-colors cursor-pointer whitespace-nowrap text-center"
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
