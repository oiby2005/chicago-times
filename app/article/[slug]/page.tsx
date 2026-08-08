import React from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import { getArticleBySlug, homepageArticles } from "@/data/articles";
import { ArticleToolbar } from "@/components/article/ArticleToolbar";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  // Recommended/Related articles
  const relatedArticles = Object.values(homepageArticles)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const sponsoredTopics = [
    {
      id: "s1",
      title: "Stay updated with the newest gold market developments.",
      tag: "MarketViews",
      image: "/images/investigator-magnifying-glass.jpg",
    },
    {
      id: "s2",
      title: "The latest news on commodity markets from leading experts",
      tag: "MarketViews",
      image: "/images/refinery-energy.jpg",
    },
    {
      id: "s3",
      title: "Uncover the latest trends in retirement planning strategies.",
      tag: "MarketViews",
      image: "/images/wine-plane.jpg",
    },
    {
      id: "s4",
      title: "What is the latest on ETFs?",
      tag: "MarketViews",
      image: "/images/hero-ai-software.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        {/* Main Header & Navigation */}
        <Header />

        {/* Sticky Action Toolbar on Scroll (Screenshot 3) */}
        <ArticleToolbar
          commentCount={article.commentCount || 181}
          listenTime={article.listenTime || "2 min"}
        />

        <Container className="py-6">
          {/* ==================================================================== */}
          {/* 1. TOP SPONSORED TOPICS DIANOMI BANNER (Screenshot 1)                */}
          {/* ==================================================================== */}
          <div className="w-full mb-8 pb-6 border-b border-[#e2e2e2]">
            <div className="text-center text-[10px] font-sans text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
              Advertisement
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-3">
              <span className="text-xs font-sans font-bold text-black uppercase tracking-wider">
                SPONSORED TOPICS
              </span>
              <span className="text-[11px] font-sans font-bold text-black flex items-center gap-1">
                <span className="font-serif italic font-normal text-gray-600">dianomi</span> Advertise Here
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-xs">
              {sponsoredTopics.map((topic) => (
                <div key={topic.id} className="space-y-2 cursor-pointer group">
                  <div className="w-full aspect-[16/9] overflow-hidden rounded-xs bg-gray-100">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h5 className="font-serif font-bold text-xs text-black leading-snug group-hover:underline">
                    {topic.title}
                  </h5>
                  <span className="text-[10px] text-gray-500 font-serif italic block">
                    {topic.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 2. ARTICLE HEADER: BREADCRUMB, HEADLINE & DECK (Screenshots 1 & 2)  */}
          {/* ==================================================================== */}
          <div className="max-w-4xl mb-6">
            {/* Category / Topic Breadcrumb */}
            <div className="text-xs font-sans font-bold text-[#666666] uppercase tracking-wider mb-2">
              {article.topicBreadcrumb || `${article.category?.toUpperCase() || "POLITICS"} • POLICY`}
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] leading-[1.14] tracking-tight mb-3">
              {article.title}
            </h1>

            {/* Subheadline / Deck */}
            {(article.deck || article.summary) && (
              <p className="font-serif text-lg sm:text-xl text-[#444444] leading-relaxed mb-4">
                {article.deck || article.summary}
              </p>
            )}

            {/* Author Byline & Date */}
            <div className="space-y-1 text-xs font-sans text-[#444444] mb-4">
              <div>
                By <span className="font-bold text-black">{article.author || "Michelle Hackman and Marianne LeVine"}</span>
              </div>
              <div className="text-[#666666]">{article.publishedDate || "Aug. 7, 2026 9:00 pm ET"}</div>
            </div>

            {/* In-Page Action Toolbar Row (Screenshot 2) */}
            <div className="flex items-center space-x-6 py-2.5 border-y border-[#e2e2e2] text-xs font-sans text-[#444444]">
              {/* Share */}
              <button className="flex items-center space-x-1 hover:text-black transition-colors" title="Share article">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.367 3 3 0 000 5.367zm0 11.367a3 3 0 100-5.367 3 3 0 000 5.367z" />
                </svg>
              </button>

              {/* Text Size */}
              <button className="flex items-center space-x-1 hover:text-black font-semibold text-sm transition-colors" title="Adjust text size">
                <span>Aa</span>
              </button>

              {/* Comment Count */}
              <button className="flex items-center space-x-1.5 hover:text-black transition-colors" title="Comments">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-bold text-black">{article.commentCount || 181}</span>
              </button>

              {/* Listen Duration */}
              <button className="flex items-center space-x-1.5 hover:text-black transition-colors" title="Listen to article">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span className="font-medium text-black">Listen <span className="text-gray-500 font-normal">({article.listenTime || "2 min"})</span></span>
              </button>

              {/* Overflow Menu */}
              <button className="hover:text-black transition-colors text-base font-bold" title="More options">
                ⋮
              </button>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 3. MAIN 2-COLUMN GRID: HERO PHOTO & MARKETVIEWS SIDEBAR (Screenshot 2) */}
          {/* ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Article Content Column (Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Hero Image */}
              {article.imageUrl && (
                <div>
                  <div className="w-full aspect-[16/10] overflow-hidden rounded-xs bg-gray-100 mb-2">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Photo Caption & Photo Credit */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs text-[#555555] font-sans pt-1 gap-1">
                    <p className="flex-1">
                      {article.photoCaption || "Homeland Security Secretary Markwayne Mullin is facing strong internal opposition"}
                    </p>
                    <span className="text-[10px] font-sans font-medium uppercase text-gray-400 shrink-0">
                      {article.photoCredit || "JULIA DEMAREE NIKHINSON/AP"}
                    </span>
                  </div>
                </div>
              )}

              {/* Article Paragraphs Body */}
              <div className="font-serif text-[17px] md:text-[18px] text-[#222222] leading-[1.7] space-y-6 pt-2">
                {article.paragraphs && article.paragraphs.length > 0 ? (
                  article.paragraphs.map((paragraph, index) => (
                    <p key={index}>
                      {index === 0 && article.dateline ? (
                        <>
                          <span className="font-bold font-sans tracking-tight text-black">
                            {article.dateline}—
                          </span>
                          {paragraph.replace(/^[A-Z\s]+—/, "")}
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))
                ) : (
                  <>
                    <p>
                      <span className="font-bold font-sans tracking-tight text-black">
                        WASHINGTON—
                      </span>
                      President <a href="#" className="underline text-black font-semibold">Trump</a> is growing increasingly frustrated with Homeland Security Secretary <a href="#" className="underline text-black font-semibold">Markwayne Mullin</a> after Mullin made a series of off-message remarks recently that angered many of the president’s outside allies, according to people familiar with the matter.
                    </p>
                    <p>
                      Trump has complained to advisers and cabinet members about Mullin’s performance during recent high-stakes immigration and border policy meetings at the White House, the people said. Despite the private criticism, a senior administration official emphasized that the president currently has no plans to fire him.
                    </p>
                    <p>
                      The friction highlights the mounting political pressure facing the Department of Homeland Security as it executes sweeping federal policy mandates amid intense public and congressional scrutiny.
                    </p>
                    <p>
                      White House aides have urged cabinet secretaries to maintain tight discipline around public messaging, particularly regarding enforcement timelines and inter-agency coordination.
                    </p>
                  </>
                )}
              </div>

              {/* Bottom Tags / Category Footer */}
              <div className="pt-6 border-t border-[#e2e2e2] flex items-center justify-between text-xs font-sans text-gray-600">
                <div>
                  Filed under: <span className="font-bold text-black">{article.category || "Politics"}</span>
                </div>
                <Link href="/" className="font-bold text-[#007cba] hover:underline">
                  Back to Top Stories &rarr;
                </Link>
              </div>
            </div>

            {/* Right Sidebar (Span 4) — Dark Blue MarketViews Sponsored Stack (Screenshot 2 & 3) */}
            <div className="lg:col-span-4 space-y-2 sticky top-16">
              <div className="text-[10px] text-gray-500 font-sans text-right uppercase tracking-widest font-semibold">
                Advertisement
              </div>

              <div className="bg-[#1c3550] text-white rounded-xs border border-[#2b4866] overflow-hidden shadow-xs">
                {/* Card 1 */}
                <div className="relative group p-4 border-b border-[#2b4866]">
                  <div className="aspect-[16/9] w-full mb-3 overflow-hidden rounded-xs bg-black/20">
                    <img
                      src="/images/hero-ai-software.jpg"
                      alt="ETFs"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs leading-snug">
                      What is the latest on ETFs?
                    </h4>
                    <span className="text-gray-400 font-serif italic text-[11px] block">
                      MarketViews
                    </span>
                  </div>
                  <button className="absolute right-3 bottom-3 bg-[#007cba] hover:bg-[#006996] text-white p-1 rounded text-xs font-bold">
                    ›
                  </button>
                </div>

                {/* Card 2 */}
                <div className="relative group p-4 border-b border-[#2b4866]">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-xs leading-snug">
                        Discover top insights on commodity trends and developments.
                      </h4>
                      <span className="text-gray-400 font-serif italic text-[11px] block">
                        MarketViews
                      </span>
                    </div>
                    <img
                      src="/images/bangkok-factory.jpg"
                      alt="Commodities"
                      className="w-16 h-14 object-cover rounded-xs shrink-0"
                    />
                  </div>
                  <button className="absolute right-3 bottom-2 bg-[#007cba] hover:bg-[#006996] text-white p-1 rounded text-xs font-bold">
                    ›
                  </button>
                </div>

                {/* Card 3 */}
                <div className="relative group p-4 border-b border-[#2b4866]">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-xs leading-snug">
                        Stay updated with the newest gold market developments.
                      </h4>
                      <span className="text-gray-400 font-serif italic text-[11px] block">
                        MarketViews
                      </span>
                    </div>
                    <img
                      src="/images/investigator-magnifying-glass.jpg"
                      alt="Gold"
                      className="w-16 h-14 object-cover rounded-xs shrink-0"
                    />
                  </div>
                  <button className="absolute right-3 bottom-2 bg-[#007cba] hover:bg-[#006996] text-white p-1 rounded text-xs font-bold">
                    ›
                  </button>
                </div>

                {/* Card 4 */}
                <div className="relative group p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-xs leading-snug">
                        Uncover the latest trends in retirement planning strategies.
                      </h4>
                      <span className="text-gray-400 font-serif italic text-[11px] block">
                        MarketViews
                      </span>
                    </div>
                    <img
                      src="/images/wine-plane.jpg"
                      alt="Retirement"
                      className="w-16 h-14 object-cover rounded-xs shrink-0"
                    />
                  </div>
                  <button className="absolute right-3 bottom-2 bg-[#007cba] hover:bg-[#006996] text-white p-1 rounded text-xs font-bold">
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>

        </Container>

        <StickySubscribeBar />
      </div>

      <Footer />
    </main>
  );
}
