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
import BookmarkButton from "@/components/article/BookmarkButton";
import RecentInUsSidebar from "@/components/article/RecentInUsSidebar";
import NewsletterSignupBanner from "@/components/article/NewsletterSignupBanner";
import ArticleCommentsSection from "@/components/article/ArticleCommentsSection";
import MarketViewsAdCard from "@/components/article/MarketViewsAdCard";
import MoreFromWsjSection from "@/components/article/MoreFromWsjSection";
import { getAuthorForArticle } from "@/data/authors";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [customPost, setCustomPost] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_posts");
        if (stored) {
          const posts = JSON.parse(stored);
          const match = posts.find(
            (p: any) =>
              p.slug === slug ||
              p.id === slug ||
              (p.title &&
                p.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "") === slug)
          );
          if (match) {
            setCustomPost(match);
          }
        }
      } catch (e) {}
    }
  }, [slug]);

  const staticArticle = getArticleBySlug(slug) || {};

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
  const publishedDate = customPost?.date || staticArticle.publishedDate || "08/09/26 AT 11:30 AM EDT";
  const imageUrl = customPost?.thumbnail || staticArticle.imageUrl || "";
  const photoCaption = customPost?.photoCaption || staticArticle.photoCaption || "";
  const bodyHtml = customPost?.bodyContent || null;
  const tags: string[] = customPost?.tags || [];

  const [authorObj, setAuthorObj] = useState<any>(() => getAuthorForArticle(slug, authorName));

  useEffect(() => {
    const syncAuthor = () => {
      const updated = getAuthorForArticle(slug, authorName);
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
        <StickyHeaderBar />

        {/* Article Page Body */}
        <div className="article-body">
          {/* Section 1: Top Bar (< BACK TO NEWSFEED + A A A, Bookmark, Share) */}
          <ArticleTopBar article={currentArticleData} />

          {/* Section 2: Main Article Content & Sidebar */}
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Main Article Body (Span 8) */}
              <article className="lg:col-span-8 space-y-5">
                {/* Category Badge */}
                <div className="flex items-center space-x-3 mb-3 font-sans">
                  <span className="text-[12px] font-sans font-bold text-[#666666] tracking-wider uppercase">
                    {category}
                  </span>
                </div>

                {/* Article Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-[38px] lg:text-[40px] font-encorpada-headline font-bold text-[#111111] mb-4">
                  {title}
                </h1>

                {/* Subheadline / Deck */}
                {deck && (
                  <p className="font-sans text-base sm:text-lg md:text-[19px] text-[#555555] leading-relaxed">
                    {deck}
                  </p>
                )}

                {/* Author Byline & Share + Bookmark Icons */}
                <div className="pt-2 pb-4 border-b border-[#e5e7eb]">
                  <div className="font-sans flex items-center gap-3.5 flex-wrap">
                    {/* Writer's Circular Headshot Profile Image */}
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-xs bg-gray-100 flex items-center justify-center">
                      {authorObj.image ? (
                        <img
                          src={authorObj.image}
                          alt={authorObj.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                          {authorObj.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Writer Name + Inline Share & Bookmark Icons + Published Date */}
                    <div>
                      <div className="text-[14px] font-bold text-[#111111] leading-tight flex items-center gap-2 flex-wrap">
                        <span>
                          By{" "}
                          <Link
                            href={`/author/${authorObj.slug}`}
                            className="underline hover:text-black cursor-pointer"
                          >
                            {authorObj.name}
                          </Link>
                        </span>

                        {/* Share Icon */}
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#334155] hover:text-[#0f172a] transition-colors cursor-pointer shadow-2xs ml-1"
                          title="Share Article"
                          aria-label="Share Article"
                          suppressHydrationWarning
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M4 19c2.5-2.5 6-4.5 11-4.5v4.5l8-8.5L15 2v4.5C8.5 6.5 4.5 11 4 19z" />
                          </svg>
                        </button>

                        {/* Bookmark Icon */}
                        <BookmarkButton article={currentArticleData} variant="inline" />
                      </div>

                      <div className="text-[13.5px] font-semibold text-[#555555] leading-tight mt-1">
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
                    className="article-body-content font-serif text-[17px] sm:text-[18px] text-[#1a1a1a] leading-[1.75] space-y-5 pt-3"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                ) : (
                  <div className="font-serif text-[17px] sm:text-[18px] text-[#1a1a1a] leading-[1.75] space-y-5 pt-3">
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



                {/* Hashtags Footer Row */}
                {tags && tags.length > 0 && (
                  <div className="pt-6 border-b border-[#e5e7eb] pb-6 font-sans text-[11px] font-bold text-[#666666] tracking-wider flex flex-wrap gap-2 uppercase">
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

                {/* Section 4: Article Comments Section */}
                <ArticleCommentsSection commentCount={customPost?.commentsCount || staticArticle.commentCount || 0} />
              </article>

              {/* Right Column: Recent Sidebar & MarketViews Ad Card (Span 4) */}
              <div className="lg:col-span-4 lg:sticky lg:top-6 pl-0 lg:pl-4 mt-8 lg:mt-0">
                <RecentInUsSidebar categoryName={category} />
                <MarketViewsAdCard />
              </div>
            </div>

            {/* Bottom Full-Width Section: MORE FROM THE WALL STREET JOURNAL */}
            <MoreFromWsjSection />
          </Container>
        </div>
      </div>

      {/* Main Footer */}
      <Footer />
    </main>
  );
}
