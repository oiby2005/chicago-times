"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";
import AdPlaceholder from "@/components/ui/AdPlaceholder";
import { EntrepreneurItem, CompanyShareholding, INITIAL_ENTREPRENEURS, getEntrepreneursList } from "@/data/entrepreneurs";

// Helper to extract clean domain from website string
const getCleanDomain = (url: string) => {
  if (!url) return "";
  try {
    return url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];
  } catch (e) {
    return url;
  }
};

// "Did You Know" Facts Slider Sub-component (Exact structure as /world-billionaire/1)
function DidYouKnowSlider({ facts }: { facts?: string[] }) {
  const [currIdx, setCurrIdx] = useState(0);

  const factList = useMemo(() => {
    if (facts && facts.length > 0) return facts;
    return [
      "Secured multiple patent filings across distributed micro-grid energy architectures before the age of 30.",
      "Spearheaded international supply chain consortiums reducing component manufacturing latency by 45%.",
      "Regularly mentors early-stage university engineering accelerators across North America and Europe.",
      "Passionate advocate for open-access mathematical research and public high-performance computing clusters."
    ];
  }, [facts]);

  const handlePrev = () => {
    setCurrIdx((prev) => (prev - 1 + factList.length) % factList.length);
  };

  const handleNext = () => {
    setCurrIdx((prev) => (prev + 1) % factList.length);
  };

  return (
    <div className="w-full pt-6 pb-2 border-t border-[#111111]">
      <h3
        className="font-bold text-[19px] text-[#111111] mb-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Did you know
      </h3>

      <div className="relative bg-white border border-[#E5E0D5] p-6 sm:p-10 min-h-[150px] flex items-center justify-between gap-4">
        {/* Previous Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-9 h-9 rounded-full bg-[#EFECE6] hover:bg-[#DDD8CC] text-[#111111] font-bold text-base flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          title="Previous Fact"
        >
          ←
        </button>

        {/* Fact Quote Text */}
        <div className="flex-1 text-center max-w-xl px-2">
          <p
            className="text-[16px] sm:text-[18px] leading-relaxed text-[#111111]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {factList[currIdx]}
          </p>
        </div>

        {/* Next Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-9 h-9 rounded-full bg-[#EFECE6] hover:bg-[#DDD8CC] text-[#111111] font-bold text-base flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          title="Next Fact"
        >
          →
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center space-x-2 mt-3">
        {factList.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrIdx(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currIdx === i ? "bg-[#555555] scale-110" : "bg-[#CCCCCC]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function EntrepreneurProfileClient({ id }: { id: string }) {
  const [entrepreneurs, setEntrepreneurs] = useState<EntrepreneurItem[]>(INITIAL_ENTREPRENEURS);

  const basePath = "/upcoming-entrepreneurs";
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showAllEntrepreneurs, setShowAllEntrepreneurs] = useState(false);
  const [visibleArticleCount, setVisibleArticleCount] = useState(5);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const slugify = (str: string) =>
    (str || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const cleanParam = decodeURIComponent(id || "").toLowerCase().trim();

  // Load Entrepreneurs
  useEffect(() => {
    let localItems: EntrepreneurItem[] = [];
    try {
      localItems = getEntrepreneursList();
    } catch (e) {}

    fetch("http://localhost:5000/api/entrepreneurs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.entrepreneurs) && data.entrepreneurs.length > 0) {
          setEntrepreneurs(data.entrepreneurs);
        } else if (localItems.length > 0) {
          setEntrepreneurs(localItems);
        }
      })
      .catch(() => {
        if (localItems.length > 0) {
          setEntrepreneurs(localItems);
        }
      });

    const handleUpdate = () => {
      try {
        setEntrepreneurs(getEntrepreneursList());
      } catch (e) {}
    };
    window.addEventListener("wsj_entrepreneurs_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("wsj_entrepreneurs_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Target Entrepreneur: matches ID, rank, exact name, or slugified name
  const item = useMemo(() => {
    if (!entrepreneurs || entrepreneurs.length === 0) return null;
    return (
      entrepreneurs.find((e) => {
        const eSlug = slugify(e.name);
        const eName = (e.name || "").toLowerCase().trim();
        return (
          e.id === id ||
          e.rank.toString() === id ||
          eSlug === cleanParam ||
          eName === cleanParam
        );
      }) || entrepreneurs[0]
    );
  }, [entrepreneurs, id, cleanParam]);

  // Next & Previous in rank order
  const nextEntrepreneur = useMemo(() => {
    if (!item || entrepreneurs.length <= 1) return null;
    const currIndex = entrepreneurs.findIndex((e) => e.id === item.id);
    const nextIndex = (currIndex + 1) % entrepreneurs.length;
    return entrepreneurs[nextIndex];
  }, [entrepreneurs, item]);

  const prevEntrepreneur = useMemo(() => {
    if (!item || entrepreneurs.length <= 1) return null;
    const currIndex = entrepreneurs.findIndex((e) => e.id === item.id);
    const prevIndex = (currIndex - 1 + entrepreneurs.length) % entrepreneurs.length;
    return entrepreneurs[prevIndex];
  }, [entrepreneurs, item]);

  // Other Entrepreneurs list (excluding current active profile)
  const otherEntrepreneurs = useMemo(() => {
    if (!item) return [];
    return entrepreneurs.filter((e) => e.id !== item.id);
  }, [entrepreneurs, item]);

  // Fetch Published posts from API / localStorage for "More from Times Chicago"
  useEffect(() => {
    const loadPosts = () => {
      let local: any[] = [];
      try {
        const stored = localStorage.getItem("wsj_posts");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) local = parsed;
        }
      } catch (e) {}

      fetch("http://localhost:5000/api/posts")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const postsArr = Array.isArray(d) ? d : d && d.posts && Array.isArray(d.posts) ? d.posts : [];
          if (postsArr.length > 0) {
            setUserPosts(postsArr);
          } else if (local.length > 0) {
            setUserPosts(local);
          }
        })
        .catch(() => {
          if (local.length > 0) setUserPosts(local);
        });
    };

    loadPosts();
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, []);

  // 3 Articles for Right Sidebar "ALSO ON TIMES CHICAGO"
  const sidebarRelatedArticles = useMemo(() => {
    if (!item) return [];
    const entName = item.name;
    const entLastName = item.name.split(" ").pop() || item.name;
    const entSource = (item.source || "Technology").split(",")[0].trim();

    return [
      {
        id: "rel_1",
        title: `${entName} Drives Capital Expansion Across High-Impact Tech Ventures`,
        slug: "the-new-faces-of-the-grand-tour",
      },
      {
        id: "rel_2",
        title: `Times Chicago Analysis: How ${entLastName} Navigates Global Market Realignment`,
        slug: "why-have-men-gone-off-the-rails",
      },
      {
        id: "rel_3",
        title: `${entLastName} Outlines Decade Vision For ${entSource} And Scaled Infrastructure`,
        slug: "christopher-nolans-next-cinematic-epic-2026",
      },
    ];
  }, [item]);

  // Main content articles for "More from Times Chicago"
  const articlesList = useMemo(() => {
    if (!item) return [];

    const nameLower = item.name.toLowerCase().trim();

    // Filter user created articles tagged with entrepreneur's name AND approved / published by Admin
    const taggedUserArticles = userPosts
      .filter((post) => {
        if (!post) return false;
        const statusLower = (post.status || "").toLowerCase().trim();
        if (statusLower !== "published" && statusLower !== "approved") return false;

        let postTags: string[] = [];
        if (Array.isArray(post.tags)) {
          postTags = post.tags;
        } else if (typeof post.tags === "string") {
          postTags = post.tags.split(",").map((t: string) => t.replace(/^#/, "").trim());
        }
        return postTags.some((t) => t.toLowerCase().trim() === nameLower);
      })
      .map((post) => ({
        id: String(post.id),
        date: post.date || "Recent",
        title: post.title,
        slug: post.slug || post.id,
        description: post.subheadline || post.excerpt || (post.bodyContent ? post.bodyContent.replace(/<[^>]*>?/gm, "").slice(0, 140) + "..." : ""),
        author: (() => {
          if (typeof window !== "undefined") {
            try {
              const storedUser = JSON.parse(sessionStorage.getItem("wsj_user") || "null");
              if (storedUser && (storedUser.full_name || storedUser.name)) {
                const uEmail = (storedUser.email || "").toLowerCase().trim();
                const pEmail = (post.authorEmail || "").toLowerCase().trim();
                const pAuthor = (post.author || "").toLowerCase().trim();
                if (
                  (pEmail && pEmail === uEmail) ||
                  pAuthor === "writer user" ||
                  pAuthor === "by writer user" ||
                  (uEmail === "writer@gmail.com" && pAuthor.includes("writer"))
                ) {
                  return `By ${storedUser.full_name || storedUser.name}`;
                }
              }
            } catch (e) {}
          }
          if (!post.author) return "By Times Chicago";
          return post.author.startsWith("By ") ? post.author : `By ${post.author}`;
        })(),
        image: post.thumbnail || item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      }));

    const sampleFallbackArticles = [
      {
        id: "ent_art_1",
        date: "Sep 28, 2026",
        title: `${item.name} Outlines Global Expansion Strategy Across ${item.industry}`,
        slug: "why-slow-job-growth-doesnt-mean-labor-market-trouble",
        description: `Executive leadership updates showcase rapid acceleration in ${item.source} and global venture milestones under the direction of ${item.name}.`,
        author: "By Antonio Pequeño IV",
        image: item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_2",
        date: "Sep 21, 2026",
        title: `Strategic Corporate Governance: Inside the Playbook of ${item.name}`,
        slug: "nycs-pied-a-terre-owners-hunt-creative-ways-tax",
        description: `A comprehensive evaluation of corporate structure, board governance, and technological roadmaps under executive guidance.`,
        author: "By Mary Whitfill Roeloffs",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_3",
        date: "Sep 15, 2026",
        title: `Upcoming Top 20 Entrepreneurs: Growth Capital And The Future Of ${item.industry}`,
        slug: "the-new-faces-of-the-grand-tour",
        description: `Analysis into the founders accelerating high-impact solutions across global markets in 2026.`,
        author: "By Times Chicago Markets Desk",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_4",
        date: "Aug 20, 2026",
        title: `Venture Ecosystem Shifts: Why Emerging Founders Are Raising Record Capital`,
        slug: "abigails-party-tamzin-outhwaite",
        description: `Market insights examining private valuations, venture investments, and commercial milestones.`,
        author: "By Derek Saul",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_5",
        date: "Jul 14, 2026",
        title: `Technology Frontiers: Sustainable Architectures In Modern Deep Tech`,
        slug: "horse-racings-triple-crown-may-no-longer-be-worth-chasing",
        description: `How industry pioneers are leveraging modern compute architectures to scale sustainable infrastructure worldwide.`,
        author: "By Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_6",
        date: "Jun 29, 2026",
        title: `Capital Formation in 2026: The Strategic Rise of Emerging Tech Hubs`,
        slug: "the-1m-secret-hiding-in-a-french-garden-shed",
        description: `Institutional allocations point to unprecedented capital deployment across distributed engineering hubs and renewable data centers.`,
        author: "By Marcus Vance",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_7",
        date: "Jun 11, 2026",
        title: `Breakthrough Compute: Inside the Hardware Foundations of Next-Gen Platforms`,
        slug: "pop-musics-new-icon-takes-center-stage-o2-arena",
        description: `How next-generation semiconductor fabrication and custom silicon are unlocking unprecedented efficiencies in production lines.`,
        author: "By Rachel Sterling",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_8",
        date: "May 25, 2026",
        title: `Executive Roadmap: Scaling Enterprise Operations from Seed to Unicorn`,
        slug: "the-10-must-read-books-of-autumn",
        description: `Key strategic takeaways from founders navigating hyper-growth while maintaining robust corporate governance and customer trust.`,
        author: "By David Miller",
        image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_9",
        date: "May 08, 2026",
        title: `Sustainable Manufacturing: How Leading Founders Decarbonize Heavy Industry`,
        slug: "why-have-men-gone-off-the-rails",
        description: `Innovative production cycles and circular economics are proving that environmental sustainability directly enhances shareholder value.`,
        author: "By Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: "ent_art_10",
        date: "Apr 19, 2026",
        title: `Global Venture Dynamics: Emerging Entrepreneurs Redefining Financial Markets`,
        slug: "christopher-nolans-next-cinematic-epic-2026",
        description: `Times Chicago comprehensive economic review examining the top 20 visionaries forging the modern commercial landscape.`,
        author: "By Times Chicago Markets Desk",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80",
      },
    ];

    return [...taggedUserArticles, ...sampleFallbackArticles];
  }, [item, userPosts]);

  if (!item) {
    return (
      <main className="min-h-screen flex flex-col bg-white text-[#111111]">
        <Header />
        <StickyHeaderBar />
        <Container className="flex-1 py-16 text-center bg-white">
          <p className="text-gray-500 font-sans text-base">Loading entrepreneur profile...</p>
        </Container>
        <Footer />
      </main>
    );
  }

  // Companies & Shareholdings carousel logic (up to 25 companies, 4 per slide, 5 dots)
  const rawCompanies: CompanyShareholding[] = item.companies || [];
  const companiesList: CompanyShareholding[] = rawCompanies.length > 0 ? rawCompanies : [
    { id: "c1", name: "Tesla", role: "CEO", website: "www.tesla.com", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" },
    { id: "c2", name: "SpaceX", role: "Founder & CEO", website: "www.spacex.com", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg" },
    { id: "c3", name: "xAI", role: "Founder & CEO", website: "www.x.ai", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png" },
    { id: "c4", name: "Neuralink", role: "Founder", website: "www.neuralink.com", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Neuralink_logo.svg" },
  ];

  const maxVisiblePerSlide = isMobile ? 2 : 4;
  const totalSlides = Math.min(5, Math.max(1, Math.ceil(companiesList.length / maxVisiblePerSlide)));
  const currentSlideCompanies = companiesList.slice(
    carouselIndex * maxVisiblePerSlide,
    carouselIndex * maxVisiblePerSlide + maxVisiblePerSlide
  );
  // If current slide has fewer or none, wrap or show first batch so carousel always looks full
  const displayedCompanies = currentSlideCompanies.length > 0 ? currentSlideCompanies : companiesList.slice(0, maxVisiblePerSlide);

  const bulletPoints = item.editorBulletPoints && item.editorBulletPoints.length > 0
    ? item.editorBulletPoints
    : [
        `${item.name} is a leading global entrepreneur shaping modern industry and technology.`,
        `Directs major operational and capital milestones in ${item.source}.`,
        `Maintains executive leadership in ${item.industry} and international ventures.`,
        `Recognized across financial sectors for rapid growth and sustainable business innovation.`
      ];

  const ownWordsQuotes = [
    item.inTheirOwnWordsQuote || `“When tackling unprecedented problems in deep technology, the fastest path forward is questioning conventional industry boundaries and building relentlessly from core physics principles.”`,
    item.inTheirOwnWordsQuote2 || (item.inTheirOwnWordsQuotes && item.inTheirOwnWordsQuotes[1]) || `“Innovation distinguishes between a leader and a follower. Relentless execution turns vision into reality.”`
  ];
  const [quoteIdx, setQuoteIdx] = useState(0);

  const displayedOthers = showAllEntrepreneurs ? otherEntrepreneurs : otherEntrepreneurs.slice(0, 5);
  const currentVisibleArticles = articlesList.slice(0, visibleArticleCount);

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#111111]" suppressHydrationWarning>
      <Header />
      <StickyHeaderBar />

      {/* ========================================================================= */}
      {/* TOP ALIGNED BAR: EXACTLY AS http://localhost:3000/world-billionaire/1      */}
      {/* #<Rank> | Upcoming Entrepreneurs (Left) and PREV / NEXT (Right)           */}
      {/* ========================================================================= */}
      <Container className="pt-6 pb-2 bg-white flex items-center justify-between" suppressHydrationWarning>
        <div className="flex items-center space-x-2 font-sans text-xs sm:text-sm">
          <span className="font-extrabold text-[15px] sm:text-[17px] text-[#111111]">
            #{item.rank}
          </span>
          <span className="text-[#999999]">|</span>
          <Link
            href={basePath}
            className="hover:underline font-extrabold text-[12px] sm:text-[14px] uppercase tracking-wider text-[#111111]"
          >
            Upcoming Entrepreneurs
          </Link>
        </div>

        {/* Top Right Navigation: PREV / NEXT controls */}
        {item.rank > 1 && prevEntrepreneur ? (
          <div className="flex items-center space-x-3 font-sans text-xs sm:text-sm" suppressHydrationWarning>
            <Link
              href={`${basePath}/${slugify(prevEntrepreneur.name)}`}
              className="w-8 h-8 rounded-full border border-[#DDD8CC] bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#111111] flex items-center justify-center transition-colors shadow-2xs shrink-0"
              title={`Previous: ${prevEntrepreneur.name}`}
            >
              <svg className="w-4 h-4 text-[#444444]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>

            <span className="font-sans font-bold text-[12px] sm:text-[13px] text-[#111111] tracking-wider uppercase">
              PREV / NEXT
            </span>

            {nextEntrepreneur && (
              <Link
                href={`${basePath}/${slugify(nextEntrepreneur.name)}`}
                className="w-8 h-8 rounded-full border border-[#DDD8CC] bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#111111] flex items-center justify-center transition-colors shadow-2xs shrink-0"
                title={`Next: ${nextEntrepreneur.name}`}
              >
                <svg className="w-4 h-4 text-[#444444]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            )}
          </div>
        ) : (
          nextEntrepreneur && (
            <Link
              href={`${basePath}/${slugify(nextEntrepreneur.name)}`}
              className="group font-sans font-extrabold text-[11px] sm:text-[12px] uppercase tracking-wider text-[#111111] hover:text-[#333333] flex items-center space-x-2 cursor-pointer"
              suppressHydrationWarning
            >
              <span>NEXT</span>
              <span className="w-7 h-7 rounded-full border border-[#DDD8CC] group-hover:border-black flex items-center justify-center text-xs transition-colors bg-white">
                →
              </span>
            </Link>
          )
        )}
      </Container>

      <Container className="flex-1 py-4 sm:py-6 bg-white">
        {/* ========================================================================= */}
        {/* MAIN PROFILE HERO CARD: ALL WHITE BACKGROUND                              */}
        {/* Profile info, Image 1 Companies Carousel (5 companies, 5 dots), & Photo   */}
        {/* ========================================================================= */}
        <div className="w-full bg-white border border-[#E5E0D5] rounded-none overflow-hidden my-3 sm:my-5 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column (expanded to ~67%-75% width on desktop for company carousel) */}
            <div className="lg:col-span-8 xl:col-span-9 p-6 sm:p-8 md:p-9 flex flex-col justify-between bg-white order-2 lg:order-1">
              <div>
                {/* Tracker Label */}
                <span className="font-sans font-extrabold text-[11px] uppercase tracking-[0.2em] text-[#555555]">
                  PROFILE
                </span>

                {/* Big Serif Name */}
                <h1 className="font-serif font-black text-[36px] sm:text-[46px] md:text-[52px] leading-[1.08] text-[#111111] mt-2 tracking-tight">
                  {item.name}
                </h1>

                {/* Role / Subtitle */}
                <p className="font-sans font-medium text-[15px] sm:text-[16px] text-[#222222] mt-1.5">
                  {item.titleRole || "Founder & CEO"}
                </p>

                {/* Bio Description */}
                <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-[#333333] mt-3.5 max-w-xl text-left">
                  {item.bio || `${item.name} is a visionary entrepreneur building innovative companies that create a more sustainable, connected and inclusive future.`}
                </p>

                {/* Personal Website Link */}
                {item.website && (
                  <div className="mt-3">
                    <a
                      href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans font-bold text-[13.5px] sm:text-[14px] text-[#111111] hover:underline inline-block"
                    >
                      {item.website}
                    </a>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* COMPANIES & SHAREHOLDINGS (EXACT REPLICA OF IMAGE 1)                       */}
                {/* Gold Underline, 4 Company Columns, Left/Right Arrows, and Filled Pagination Dots */}
                {/* ========================================================================= */}
                <div className="mt-7 pt-4">
                  <div className="mb-4">
                    <h3 className="font-sans font-extrabold text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-[#111111]">
                      COMPANIES & SHAREHOLDINGS
                    </h3>
                    {/* Gold Accent Line directly below heading */}
                    <div className="w-10 h-[3px] bg-[#EAB308] mt-1.5" />
                  </div>

                  {/* Carousel Container */}
                  <div className="relative mt-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Left Arrow */}
                      <button
                        type="button"
                        onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1))}
                        className="w-6 h-6 flex items-center justify-center text-[#111111] hover:text-black rounded-full cursor-pointer shrink-0 transition-colors text-base font-bold "
                        aria-label="Previous companies"
                      >
                        ←
                      </button>

                      {/* 4 Company Columns Exactly Matching Image 1 (No Card Boxes, Divided by Lines, Single Line Name) */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E5E0D5]">
                        {displayedCompanies.map((comp, idx) => {
                          const domain = getCleanDomain(comp.website);
                          const effectiveLogo = comp.logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : "");

                          return (
                            <div
                              key={comp.id || idx}
                              className="px-2.5 sm:px-3 py-1 flex flex-col justify-between first:pl-0 last:pr-0 min-w-0"
                            >
                              {/* Top Row: Logo & Company Name & Role */}
                              <div className="flex items-center space-x-2.5 min-w-0">
                                {effectiveLogo ? (
                                  <img
                                    src={effectiveLogo}
                                    alt={comp.name}
                                    className="w-8 h-8 object-contain shrink-0"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = "none";
                                    }}
                                    suppressHydrationWarning
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                    {comp.name ? comp.name.charAt(0) : "C"}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <h4
                                    className="font-bold text-[13.5px] sm:text-[14.5px] text-[#111111] leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                    title={comp.name}
                                  >
                                    {comp.name}
                                  </h4>
                                  <p
                                    className="text-[10.5px] sm:text-[11px] text-[#666666] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                  >
                                    {comp.role || "Founder & CEO"}
                                  </p>
                                </div>
                              </div>

                              {/* Bottom Row: External Website Pill Button (Matching Image 1 with Black Globe Icon & Poppins Sans) */}
                              <div className="mt-3">
                                <a
                                  href={comp.website?.startsWith("http") ? comp.website : `https://${comp.website || ""}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full inline-flex items-center justify-between px-2.5 py-1 rounded-full border border-[#DCD5C5] bg-transparent hover:bg-[#FAF7EE] text-[10.5px] text-[#222222] transition-colors"
                                  style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                  <svg
                                    className="w-3 h-3 text-black shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M2 12h20" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                  </svg>
                                  <span
                                    className="text-[10px] sm:text-[10.5px] text-[#111111] font-medium px-1 whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-center"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                  >
                                    {comp.website?.replace(/^https?:\/\//i, "") || domain}
                                  </span>
                                  <span className="text-[9px] text-[#111111] shrink-0 font-bold">↗</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Arrow */}
                      <button
                        type="button"
                        onClick={() => setCarouselIndex((prev) => (prev + 1) % totalSlides)}
                        className="w-6 h-6 flex items-center justify-center text-[#111111] hover:text-black rounded-full cursor-pointer shrink-0 transition-colors text-base font-bold "
                        aria-label="Next companies"
                      >
                        →
                      </button>
                    </div>

                    {/* Slider Box Indicators Below Carousel (Render only filled sliders, max 5) */}
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      {Array.from({ length: totalSlides }).map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setCarouselIndex(dotIdx)}
                          className={`w-2.5 h-2.5 rounded-[1.5px] transition-all cursor-pointer ${
                            carouselIndex === dotIdx ? "bg-[#EAB308] shadow-xs" : "bg-[#DDD6C6] hover:bg-[#C8C2B3]"
                          }`}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Rectangular Portrait Image (~25%-33% width on desktop) */}
            <div className="lg:col-span-4 xl:col-span-3 relative bg-[#EAE6DA] border-b lg:border-b-0 lg:border-l border-[#E5E0D5] min-h-[340px] sm:min-h-[400px] flex items-center justify-center overflow-hidden order-1 lg:order-2">
              <img
                src={item.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"}
                alt={item.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-full object-contain object-center absolute inset-0 bg-[#EAE6DA]"
                suppressHydrationWarning
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTAINER BLOCK 1: MAIN SECTIONS 1-6 & RIGHT SIDEBAR                      */}
        {/* Exactly matching layout & structure of /world-billionaire/1                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          {/* Main Content Column (Left & Middle - 8 Cols) with dashed right divider */}
          <div className="lg:col-span-8 space-y-10 border-b lg:border-b-0 lg:border-r border-dashed border-[#CCCCCC] pr-0 lg:pr-8 pb-8 lg:pb-0">
            {/* 1st Section: "From the Editor" Bullet Points */}
            <div className="w-full bg-white border border-[#E5E0D5] p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5] mb-5 text-left">
                <h3
                  className="font-bold text-[15px] sm:text-[16px] text-[#111111] text-left"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  From the Editor
                </h3>
                <span className="font-sans text-[11px] sm:text-[12px] text-[#777777]">
                  {item.editorLastUpdated?.replace(/\s*EDT\s*/gi, "") || "Last Updated Oct 10, 2026, 9:00am"}
                </span>
              </div>

              <ul
                className="space-y-4 text-[15px] sm:text-[16px] leading-relaxed text-[#222222] list-disc pl-5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {bulletPoints.map((pt, idx) => (
                  <li key={idx} className="pl-1">
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2nd Section: "Personal Stats" Table (NO Wealth History) */}
            <div className="w-full pt-6 pb-2 border-t border-[#111111]">
              <h3
                className="font-bold text-[15px] text-[#333333] mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Personal Stats
              </h3>

              <div className="divide-y divide-[#E5E0D5] border-t border-b border-[#E5E0D5] text-[13.5px] sm:text-[14px] font-sans">
                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Age</span>
                  <span className="text-[#111111] font-semibold">{item.age || 38}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Source of Wealth</span>
                  <span className="text-[#111111] font-semibold">{item.source || "CleanTech & Software"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Self-Made Score</span>
                  <span className="text-[#111111] font-semibold">{item.selfMadeScore ?? 8}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Philanthropy Score</span>
                  <span className="text-[#111111] font-semibold">{item.philanthropyScore ?? 2}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Residence</span>
                  <span className="text-[#111111] font-semibold">{item.residence || "San Francisco, California"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Citizenship</span>
                  <span className="text-[#111111] font-semibold">{item.citizenship || item.country || "United States"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Marital Status</span>
                  <span className="text-[#111111] font-semibold">{item.maritalStatus || "Single"}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-center justify-between">
                  <span className="font-bold text-[#111111]">Children</span>
                  <span className="text-[#111111] font-semibold">{item.children ?? 0}</span>
                </div>

                <div className="py-3 px-2 bg-white flex items-start sm:items-center justify-between gap-4">
                  <span className="font-bold text-[#111111] shrink-0">Education</span>
                  <span className="text-[#111111] font-semibold text-right break-words max-w-[70%] sm:max-w-none">{item.education || "Bachelor of Science, Stanford University"}</span>
                </div>

                {item.netWorthMillions && (
                  <div className="py-3 px-2 bg-white flex items-center justify-between">
                    <span className="font-bold text-[#111111]">Valuation / Equity Metric</span>
                    <span className="text-[#111111] font-semibold">{item.netWorthMillions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3rd Section: "Did you know" Fact Carousel (Exact structure as /world-billionaire/1) */}
            <DidYouKnowSlider facts={item.didYouKnowFacts} />

            {/* 4th Section: Middle In-Line Advertisement Slot (Exact size with name inside grey box) */}
            <div className="w-full my-6 flex flex-col items-center justify-center border-y border-dashed border-[#CCCCCC] py-4 bg-[#fafafa]">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#94a3b8] font-bold mb-2">Advertisement</span>
              <AdPlaceholder
                slotId="entrepreneur_profile_inline_ad"
                width="w-full max-w-[728px]"
                height="h-[90px]"
                resolution="728 × 90"
              />
            </div>

            {/* 5th Section: "In Their Own Words" Quote Block (2-Quote Slider) */}
            <div className="w-full pt-8 pb-4 border-t border-[#111111]">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="font-bold text-[20px] text-[#111111]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  In Their Own Words
                </h3>
                {ownWordsQuotes.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setQuoteIdx((prev) => (prev > 0 ? prev - 1 : ownWordsQuotes.length - 1))}
                      className="w-7 h-7 rounded-full border border-[#DDD8CC] bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#111111] flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                      aria-label="Previous quote"
                    >
                      ←
                    </button>
                    <span className="text-xs font-bold text-[#666666] font-sans">
                      {quoteIdx + 1} / {ownWordsQuotes.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuoteIdx((prev) => (prev < ownWordsQuotes.length - 1 ? prev + 1 : 0))}
                      className="w-7 h-7 rounded-full border border-[#DDD8CC] bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#111111] flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                      aria-label="Next quote"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#E5E0D5] p-8 sm:p-12 text-center shadow-2xs relative">
                <blockquote
                  className="text-[18px] sm:text-[22px] leading-relaxed text-[#111111] max-w-2xl mx-auto min-h-[70px] flex items-center justify-center transition-opacity duration-200"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {ownWordsQuotes[quoteIdx]}
                </blockquote>

                <div className="mt-5 inline-block border-b-2 border-[#41516c] pb-1">
                  <p
                    className="font-bold text-[15px] text-[#111111]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {item.name}
                  </p>
                </div>

                {ownWordsQuotes.length > 1 && (
                  <div className="flex justify-center space-x-1.5 mt-4">
                    {ownWordsQuotes.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setQuoteIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          i === quoteIdx ? "bg-[#111111] w-4" : "bg-[#CCCCCC]"
                        }`}
                        aria-label={`Go to quote ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 6th Section: "Other Entrepreneurs" Section (Exact structure as /world-billionaire/1 Other Billionaires) */}
            <div className="w-full pt-8 pb-4 border-t border-[#111111]">
              <h3
                className="font-bold text-[20px] text-[#111111] mb-5"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Other Entrepreneurs
              </h3>

              <div className="bg-white border border-[#E5E0D5] p-4 sm:p-6 divide-y divide-[#E5E0D5]">
                {displayedOthers.map((other) => (
                  <div key={other.id} className="py-4 flex items-center justify-between gap-4 first:pt-2 last:pb-2">
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                      <img
                        src={other.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"}
                        alt={other.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#DDD8CC]"
                        suppressHydrationWarning
                      />
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-bold text-[15px] text-[#111111] truncate"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {other.name}
                        </h4>
                        <p
                          className="text-[12px] text-[#666666] truncate"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Rank #{other.rank} • {other.source} ({other.industry})
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`${basePath}/${slugify(other.name)}`}
                      className="bg-white hover:bg-[#F0EDE6] border border-[#CCCCCC] text-[#111111] font-bold text-[12px] px-4 py-2 rounded-full transition-colors flex items-center space-x-1.5 shrink-0"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <span>View Profile</span>
                      <span>→</span>
                    </Link>
                  </div>
                ))}
              </div>

              {/* See All / See More Action Button */}
              {otherEntrepreneurs.length > 5 && (
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAllEntrepreneurs(!showAllEntrepreneurs)}
                    className="bg-[#262626] hover:bg-[#111111] text-white font-sans font-bold text-[12.5px] px-6 py-2.5 rounded-xl cursor-pointer shadow-2xs transition-colors"
                  >
                    {showAllEntrepreneurs ? "Show Less" : "See All"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column: Exactly like /world-billionaire/1 Sidebar */}
          <div className="lg:col-span-4 hidden lg:block space-y-6">
            {/* 1. Top Right Sidebar Advertisement (300 × 250) */}
            <div className="w-full">
              <AdPlaceholder
                slotId="entrepreneur_slot_2"
                width="w-full"
                height="h-[250px]"
                resolution="300 × 250"
                className="w-full my-0"
              />
            </div>

            {/* 2 & 3. Sticky Unit: ALSO ON TIMES CHICAGO 3-Article Widget & Ad below it (Image 4) */}
            <div className="sticky top-24 w-full space-y-6">
              <div className="w-full bg-white border border-[#E5E0D5] p-5 shadow-2xs">
                <h3 className="font-sans font-extrabold text-[12px] uppercase tracking-wider text-[#777777] pb-3 border-b border-[#E5E0D5]">
                  ALSO ON TIMES CHICAGO
                </h3>
                <div className="divide-y divide-[#E5E0D5]">
                  {sidebarRelatedArticles.map((art) => (
                    <div key={art.id} className="py-3.5 first:pt-3 last:pb-1">
                      <h4
                        className="font-bold text-[15px] sm:text-[16px] leading-snug text-[#111111] hover:underline cursor-pointer"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        <Link href={`/article/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <AdPlaceholder
                  slotId="entrepreneur_slot_3"
                  width="w-full"
                  height="h-[250px]"
                  resolution="300 × 250"
                  className="w-full my-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTAINER BLOCK 2: "MORE FROM TIMES CHICAGO" & STICKY AD                  */}
        {/* Exactly matching layout & structure of /world-billionaire/1                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          {/* Main Content Column (More from Times Chicago with Inline Ad & Pagination) */}
          <div className="lg:col-span-8 space-y-8 border-b-0 md:border-b lg:border-b-0 lg:border-r border-dashed border-[#CCCCCC] pr-0 lg:pr-8 pb-8 lg:pb-0">
            <div className="w-full pt-8 pb-4 border-t border-[#111111]">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="font-bold text-[20px] text-[#111111]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  More from Times Chicago
                </h3>
              </div>

              <div className="space-y-8">
                {currentVisibleArticles.map((art, index) => (
                  <React.Fragment key={art.id}>
                    <article className="bg-white border border-[#E5E0D5] p-5 sm:p-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-6 shadow-2xs">
                      <div className="flex-1 space-y-2">
                        <span className="font-sans text-[11px] text-[#777777] uppercase tracking-wider block">
                          {art.date}
                        </span>
                        <h4
                          className="font-bold text-[18px] sm:text-[21px] leading-snug text-[#111111] hover:underline cursor-pointer"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          <Link href={`/article/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h4>
                        <p className="font-sans text-[13.5px] leading-relaxed text-[#444444] line-clamp-2">
                          {art.description}
                        </p>
                        <p className="font-sans text-[11.5px] font-bold text-[#666666] pt-1">
                          {art.author}
                        </p>
                      </div>

                      <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-[#EFECE6] border border-[#DDD8CC]">
                        <Link href={`/article/${art.slug}`}>
                          <img
                            src={art.image}
                            alt=""
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            suppressHydrationWarning
                          />
                        </Link>
                      </div>
                    </article>

                    {/* Inline Advertisement inserted directly after 3rd article (index 2) */}
                    {index === 2 && (
                      <div className="hidden md:flex w-full flex-col items-center justify-center my-6 py-2">
                        <AdPlaceholder
                          slotId="entrepreneur_profile_inline_ad"
                          width="w-full"
                          height="h-[90px]"
                          resolution="728 × 90"
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* "More articles" Action Button */}
              {visibleArticleCount < articlesList.length && (
                <div className="flex justify-center mt-8 pt-4 border-t-0 md:border-t border-[#E5E0D5]">
                  <button
                    type="button"
                    onClick={() => setVisibleArticleCount((prev) => Math.min(prev + 3, articlesList.length))}
                    className="bg-[#111111] hover:bg-[#333333] text-white font-sans font-bold text-[13px] px-8 py-3 rounded-full cursor-pointer shadow-sm transition-colors uppercase tracking-wider"
                  >
                    More articles
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column 2: Sticky Ad 2 (Vertically aligned with More from Times Chicago) */}
          <div className="lg:col-span-4 hidden lg:block pt-8">
            <div className="sticky top-24 w-full">
              <AdPlaceholder
                slotId="entrepreneur_slot_4"
                width="w-full"
                height="h-[250px]"
                resolution="300 × 250"
                className="w-full my-0"
              />
            </div>
          </div>
        </div>
      </Container>

      <Footer />
      <StickySubscribeBar />
    </main>
  );
}
