import React from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import { getArticleBySlug } from "@/data/articles";
import ArticleTopBar from "@/components/article/ArticleTopBar";
import RecentInUsSidebar from "@/components/article/RecentInUsSidebar";
import NewsletterSignupBanner from "@/components/article/NewsletterSignupBanner";
import ArticleCommentsSection from "@/components/article/ArticleCommentsSection";
import MarketViewsAdCard from "@/components/article/MarketViewsAdCard";
import MoreFromWsjSection from "@/components/article/MoreFromWsjSection";
import { getAuthorForArticle } from "@/data/authors";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const authorObj = getAuthorForArticle(slug);

  // Default values matching Screenshots 1 & 2
  const category = article.category || "US";
  const title =
    article.title ||
    "How Serious Is Joe Biden’s Cancer as His Son Says the Disease Has Spread Further";
  const deck =
    article.deck ||
    article.summary ||
    'Former U.S. President Joe Biden is facing a worsening health situation after his son Hunter Biden said the cancer has spread to his bones and described the disease as "very painful" and "very debilitating."';
  const authorName = article.author || "Dylan Candice Odulio";
  const publishedDate = article.publishedDate || "08/09/26 AT 11:30 AM EDT";
  const imageUrl =
    article.imageUrl ||
    "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80";
  const photoCaption = article.photoCaption || "Former U.S. President Joe Biden";

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        {/* Main Header & Navigation (completely untouched) */}
        <Header />

        {/* NEW Article Page Body */}
        <div className="article-body">
          {/* Section 1: Top Bar (< BACK TO NEWSFEED + A A A, Bookmark, Share) */}
          <ArticleTopBar />

          {/* Section 2: Main Article Content & Recent in US Sidebar */}
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Main Article Body (Span 8) */}
              <article className="lg:col-span-8 space-y-5">
                {/* Category Kicker */}
                <div className="font-sans font-extrabold text-[11px] text-[#111111] uppercase tracking-wider">
                  {category}
                </div>

                {/* Article Headline */}
                <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[38px] lg:text-[40px] text-[#111111] leading-[1.14] tracking-tight">
                  {title}
                </h1>

                {/* Subheadline / Deck */}
                <p className="font-serif text-base sm:text-lg md:text-[19px] text-[#555555] leading-relaxed">
                  {deck}
                </p>

                {/* Author Byline & Date Row */}
                <div className="pt-2 pb-4 border-b border-[#e5e7eb] flex items-center gap-3">
                  {/* Circular Author Avatar Link */}
                  <Link href={`/author/${authorObj.slug}`}>
                    <img
                      src={authorObj.image}
                      alt={authorObj.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </Link>

                  {/* Author Name + LinkedIn Icon + Published Date */}
                  <div className="text-xs font-sans space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                      <Link
                        href={`/author/${authorObj.slug}`}
                        className="font-bold text-[#111111] hover:underline cursor-pointer"
                      >
                        By {authorObj.name}
                      </Link>
                      <a
                        href={authorObj.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#0077b5] text-white rounded-[2px] text-[8px] font-bold leading-none hover:opacity-80 transition-opacity"
                        title={`${authorObj.name} LinkedIn Profile`}
                      >
                        in
                      </a>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                      Published {publishedDate}
                    </div>
                  </div>
                </div>

                {/* Hero Image & Photo Caption */}
                <div className="pt-2">
                  <div className="w-full aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-sans italic text-[11px] text-gray-500 mt-2">
                    {photoCaption}
                  </p>
                </div>

                {/* Article Paragraphs Body */}
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
                    diagnosed with an aggressive form of prostate cancer. The
                    statement said the cancer had a{" "}
                    <strong className="font-bold text-[#111111]">
                      Gleason score of 9
                    </strong>
                    , placing it in{" "}
                    <strong className="font-bold text-[#111111]">
                      Grade Group 5
                    </strong>
                    , and had already metastasized to the bone.
                  </p>

                  <p>
                    The diagnosis came after Biden had already left the White
                    House. He served as the{" "}
                    <strong className="font-bold text-[#111111]">
                      46th president of the United States from 2021 to 2025
                    </strong>
                    , following his earlier career as a U.S. senator and vice
                    president under Barack Obama.
                  </p>

                  <p>
                    <a
                      href="#"
                      className="text-[#c96218] font-bold underline hover:text-[#a34b0f] transition-colors"
                    >
                      Hunter Biden
                    </a>{" "}
                    said watching his father deal with the disease has been
                    difficult for the family. He also said that his father
                    continues to make public appearances and speak about issues
                    important to him despite his health problems.
                  </p>

                  <p className="pt-2 font-serif font-normal text-[#1a1a1a]">
                    What does it mean when prostate cancer spreads to the bones?
                  </p>
                </div>

                {/* Section 3: Wall Street Journal Fast Start Newsletter Signup Banner */}
                <NewsletterSignupBanner />

                {/* Section 4: Continuation Paragraphs & Hashtags */}
                <div className="font-serif text-[17px] sm:text-[18px] text-[#1a1a1a] leading-[1.75] space-y-5 pt-2">
                  <p>
                    According to Dr. Michael Dabrow, medical director of the Cancer
                    Center at Paoli Hospital in Pennsylvania, the bones are the
                    most common location for prostate cancer to spread outside the
                    prostate. Treatment can still be available after the cancer has
                    spread, including therapies that can help manage symptoms.
                  </p>

                  <p>
                    The latest comments also add context to Biden's earlier
                    treatment. His office said he completed a course of{" "}
                    <strong className="font-bold text-[#111111]">
                      radiation therapy in October 2025
                    </strong>
                    , while he also underwent surgery in September of that year to
                    remove skin cancer lesions.
                  </p>

                  <p>
                    Biden’s family has a long history of involvement in cancer
                    advocacy. His eldest son,{" "}
                    <strong className="font-bold text-[#111111]">Beau Biden</strong>
                    , died from brain cancer in{" "}
                    <strong className="font-bold text-[#111111]">
                      2015 at age 46
                    </strong>
                    , an experience that later influenced Joe and Jill Biden’s work
                    on cancer research and the{" "}
                    <strong className="font-bold text-[#111111]">
                      Cancer Moonshot
                    </strong>{" "}
                    initiative.
                  </p>

                  <p>
                    The latest health update comes more than a year after Biden's
                    diagnosis and raises new questions about how his condition has
                    progressed since then. His personal office has not publicly
                    provided further details about the extent of the cancer beyond
                    what was disclosed by his son.
                  </p>

                  <p>
                    For now, the most recent information comes from Hunter Biden's
                    account that the disease has spread further and has become
                    increasingly difficult for his father to live with.
                  </p>

                  <p>
                    Biden is no longer president, but at{" "}
                    <strong className="font-bold text-[#111111]">83</strong>, his
                    health remains a matter of public interest because of his former
                    position, his continued public appearances, and the long
                    political career that made him one of the most recognizable
                    figures in American politics.
                  </p>

                  {/* Hashtags Footer Row */}
                  <div className="pt-6 border-b border-[#e5e7eb] pb-6 font-sans text-[11px] font-bold text-[#666666] tracking-wider flex flex-wrap gap-2 uppercase">
                    <span>#JOEBIDEN,</span>
                    <span>#CANCER,</span>
                    <span>#HUNTERBIDEN,</span>
                    <span>#USPOLITICS,</span>
                    <span>#POLITICS,</span>
                    <span>#UNITEDSTATES,</span>
                    <span>#PROSTATECANCER,</span>
                    <span>#HEALTH</span>
                  </div>
                </div>

                {/* Section 5: Article Comments Section */}
                <ArticleCommentsSection commentCount={article.commentCount || 0} />
              </article>

              {/* Right Column: Recent in US Sidebar & MarketViews Ad Card (Span 4) */}
              <div className="lg:col-span-4 sticky top-6 pl-0 lg:pl-4">
                <RecentInUsSidebar categoryName={category} />
                <MarketViewsAdCard />
              </div>
            </div>

            {/* Bottom Full-Width Section: MORE FROM THE WALL STREET JOURNAL */}
            <MoreFromWsjSection />
          </Container>
        </div>

        <StickySubscribeBar />
      </div>

      {/* Main Footer (completely untouched) */}
      <Footer />
    </main>
  );
}
