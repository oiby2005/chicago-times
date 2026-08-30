"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

export interface AuthorArticleItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  slug: string;
}

const baseAuthorArticlesData: AuthorArticleItem[] = [
  {
    id: "a1",
    category: "POLITICS",
    title: "Pax Silica Could Transform the Philippines. But Who Really Benefits?",
    excerpt: "Four thousand acres. To some people, that is merely a number. To others, it is a home. It is farmland, a source of livelihood, and a place where generations of families have built their lives. Pax...",
    author: "writer",
    date: "AUG 07, 2026",
    image: "/images/investigator-magnifying-glass.jpg",
    slug: "pax-silica-could-transform-philippines",
  },
  {
    id: "a2",
    category: "POLITICS",
    title: "The Philippine Vice President, the Missing Millions, and the Questions That Followed",
    excerpt: "Millions of pesos. That is where the controversy began. Months later, the issue has grown into one of the biggest political stories in the Philippines and one that has attracted attention far...",
    author: "writer",
    date: "AUG 08, 2026",
    image: "/images/labor_market.jpg",
    slug: "philippine-vice-president-missing-millions",
  },
  {
    id: "a3",
    category: "BUSINESS",
    title: "The Bodies Were Finally Found. Gaza Is Only Beginning to Grieve.",
    excerpt: "A funeral is usually held days after a death. In Gaza, some families waited almost three years. This week, thousands of Palestinians gathered in Gaza City for a mass funeral following the recovery...",
    author: "writer",
    date: "AUG 08, 2026",
    image: "/images/refinery-energy.jpg",
    slug: "bodies-finally-found-gaza-grieve",
  },
  {
    id: "a4",
    category: "WORLD",
    title: "Mercury Retrograde Had Everyone Looking Back At Their Exes",
    excerpt: "Did you lose someone recently? Did a relationship end out of nowhere? Did someone you cared about suddenly become a stranger? Maybe you experienced what astrology believers call the \"Mercury...",
    author: "writer",
    date: "AUG 07, 2026",
    image: "/images/wine-plane.jpg",
    slug: "mercury-retrograde-looking-back-exes",
  },
  {
    id: "a5",
    category: "WORLD",
    title: "This Italian Festival Lets You \"Dunk\" the Politician You Hate",
    excerpt: "Imagine choosing the politician who annoyed people the most this year then watching them get lowered into a river three times. That is the idea behind La Tonca, one of the strongest traditions...",
    author: "writer",
    date: "AUG 07, 2026",
    image: "/images/dc-townhouse.jpg",
    slug: "italian-festival-dunk-politician",
  },
  {
    id: "a6",
    category: "POLITICS",
    title: "The World Needs More People Like José Rizal",
    excerpt: "But first of all, who is José Rizal? If you ask Filipinos, they will tell you that José Rizal is a hero, a writer, and a martyr who died for his country. But that is probably the least interesting...",
    author: "writer",
    date: "AUG 08, 2026",
    image: "/images/kevin_warsh.jpg",
    slug: "world-needs-more-people-jose-rizal",
  },
  {
    id: "a7",
    category: "US",
    title: "The Livestream That Ended With Police Outside the Door",
    excerpt: "For years, Perez Hilton made a living by talking about other people's lives. This week, the internet was talking about his. Celebrity blogger Perez Hilton, whose real name is Mario Lavandeira Jr.,...",
    author: "writer",
    date: "AUG 08, 2026",
    image: "/images/podcast-tech-news.jpg",
    slug: "livestream-ended-with-police",
  },
  {
    id: "a8",
    category: "WORLD",
    title: "People at This Hospital Reported Seeing a Grim Reaper on the Roof",
    excerpt: "Patients and hospital visitors at Ysbyty Glan Clwyd in St Asaph, Wales, were confronted with an unusual sight on June 6, 2026, when a man dressed in a Grim Reaper-style costume climbed onto the...",
    author: "writer",
    date: "AUG 09, 2026",
    image: "/images/bangkok-factory.jpg",
    slug: "grim-reaper-on-hospital-roof",
  },
  {
    id: "a9",
    category: "WORLD",
    title: "Why Is Everyone Talking About Ariana Grande's Body Again?",
    excerpt: "A photograph of Ariana Grande can now spark a debate far beyond the music she is promoting. In recent weeks, the singer's appearance has become the subject of intense discussion online...",
    author: "writer",
    date: "AUG 09, 2026",
    image: "/images/ariana-grande.jpg",
    slug: "ariana-grande-body-discussion",
  },
  {
    id: "a10",
    category: "US",
    title: "How Serious Is Joe Biden’s Cancer as His Son Says the Disease Has Spread Further",
    excerpt: "Joe Biden's health has taken a more serious turn. In an interview with the BBC on Friday, August 7, 2026, Hunter Biden said his father's prostate cancer has spread further, including to his bones...",
    author: "writer",
    date: "AUG 09, 2026",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
    slug: "biden-cancer-disease-spread-further",
  },
  {
    id: "a11",
    category: "ECONOMY",
    title: "Global Supply Chains Shift Toward Southeast Asian Manufacturing Hubs",
    excerpt: "As trade relations evolve, major global manufacturers are accelerating investments across Vietnam, Indonesia, and the Philippines, altering regional economic balances...",
    author: "writer",
    date: "AUG 05, 2026",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    slug: "global-supply-chains-southeast-asia",
  },
  {
    id: "a12",
    category: "TECH",
    title: "The Battle for AI Data Centers: Power Grids Face Unprecedented Strain",
    excerpt: "From California to Dublin, local energy authorities are struggling to meet the electrical demands of next-generation artificial intelligence computing infrastructure...",
    author: "writer",
    date: "AUG 04, 2026",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    slug: "battle-for-ai-data-centers-power-grids",
  },
];

import { extractSingleAuthorName } from "@/data/authors";

interface AuthorArticlesListProps {
  authorName?: string;
}

export default function AuthorArticlesList({
  authorName = "writer",
}: AuthorArticlesListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayName, setDisplayName] = useState<string>(extractSingleAuthorName(authorName));
  const topRef = useRef<HTMLDivElement>(null);

  const syncAuthorName = () => {
    if (typeof window === "undefined") return;
    const storedUserStr = localStorage.getItem("wsj_user");
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        const storedNameLower = (storedUser.full_name || storedUser.name || "").toLowerCase();
        const authorNameLower = authorName.toLowerCase();
        if (storedUser.full_name && (authorNameLower === "writer" || authorNameLower === "writer user" || storedNameLower === authorNameLower)) {
          setDisplayName(extractSingleAuthorName(storedUser.full_name).toUpperCase());
          return;
        }
      } catch (e) {
        console.error("Error reading author name from wsj_user:", e);
      }
    }
    setDisplayName(extractSingleAuthorName(authorName).toUpperCase());
  };

  React.useEffect(() => {
    syncAuthorName();
    window.addEventListener("wsj_user_updated", syncAuthorName);
    return () => window.removeEventListener("wsj_user_updated", syncAuthorName);
  }, [authorName]);

  const [userArticles, setUserArticles] = useState<AuthorArticleItem[]>([]);

  const extractText = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  const syncUserArticles = () => {
    if (typeof window === "undefined") return;
    try {
      let posts: any[] = [];
      const storedPostsStr = localStorage.getItem("wsj_posts");
      if (storedPostsStr) {
        posts = [...posts, ...JSON.parse(storedPostsStr)];
      }
      const storedPubStr = localStorage.getItem("wsj_published_posts");
      if (storedPubStr) {
        posts = [...posts, ...JSON.parse(storedPubStr)];
      }

      // Deduplicate published posts by ID / slug
      const uniqueMap = new Map();
      posts.forEach((p: any) => {
        if (p && p.status === "Published") {
          uniqueMap.set(String(p.id || p.slug), p);
        }
      });
      const publishedPosts = Array.from(uniqueMap.values());

      const formatted: AuthorArticleItem[] = publishedPosts.map((p: any) => {
        const dateStr = p.publishedAt
          ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()
          : (p.date || "AUG 30, 2026");
        const excerptText = p.subheadline || p.cardSummary || extractText(p.bodyContent || "") || "Read the latest update...";
        return {
          id: String(p.id),
          category: (p.category || "NEWS").toUpperCase(),
          title: p.title || "Untitled Article",
          excerpt: excerptText,
          author: p.author || displayName,
          date: dateStr,
          image: p.thumbnail || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80",
          slug: p.slug || String(p.id),
        };
      });

      setUserArticles(formatted);
    } catch (e) {
      console.error("Error reading published posts in AuthorArticlesList:", e);
    }
  };

  React.useEffect(() => {
    syncUserArticles();
    window.addEventListener("wsj_user_updated", syncUserArticles);
    window.addEventListener("wsj_posts_updated", syncUserArticles);
    return () => {
      window.removeEventListener("wsj_user_updated", syncUserArticles);
      window.removeEventListener("wsj_posts_updated", syncUserArticles);
    };
  }, [displayName]);

  const isWriterUser = (() => {
    if (typeof window === "undefined") return authorName.toLowerCase().includes("writer");
    
    const pathname = window.location.pathname;
    if (pathname === "/writer" || pathname.startsWith("/author/writer")) {
      return true;
    }

    const storedUserStr = localStorage.getItem("wsj_user");
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        const userRole = (storedUser.role || "").toLowerCase();
        const storedName = (storedUser.full_name || storedUser.name || "").toLowerCase();
        const currAuthor = authorName.toLowerCase();

        if (userRole === "writer" && (currAuthor === storedName || currAuthor === "writer" || currAuthor === "writer user")) {
          return true;
        }
      } catch (e) {}
    }

    return authorName.toLowerCase() === "writer" || authorName.toLowerCase() === "writer user";
  })();

  // For staff writers, use baseAuthorArticlesData with 11 pages
  // For Writer User, check wsj_published_posts
  const getArticlesForPage = (page: number) => {
    if (!isWriterUser) {
      const shift = (page - 1) % baseAuthorArticlesData.length;
      return [
        ...baseAuthorArticlesData.slice(shift),
        ...baseAuthorArticlesData.slice(0, shift),
      ];
    }
    return userArticles;
  };

  const handlePageChange = (newPage: number) => {
    const maxPages = isWriterUser ? Math.max(1, userArticles.length) : 11;
    if (newPage >= 1 && newPage <= maxPages) {
      setCurrentPage(newPage);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeArticles = getArticlesForPage(currentPage);
  const showEmptyState = isWriterUser && userArticles.length === 0;
  const totalPages = isWriterUser ? 1 : 11;

  return (
    <div ref={topRef} className="w-full select-none">
      {/* Header */}
      <div className="border-b border-[#111111] pb-1.5 mb-6 flex justify-between items-center">
        <h3 className="font-serif font-bold text-sm sm:text-[15px] uppercase tracking-wider text-[#111111]">
          MORE FROM {displayName}
        </h3>
        {!showEmptyState && (
          <span className="font-sans text-xs text-gray-500 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {showEmptyState ? (
        <div className="py-14 text-left">
          <p className="font-sans text-sm sm:text-base text-[#94a3b8]">
            This writer has no published articles yet.
          </p>
        </div>
      ) : (
        <>
          {/* List of Articles for current page */}
          <div className="space-y-6">
            {activeArticles.map((item, idx) => (
              <article
                key={`${item.id}-page${currentPage}-${idx}`}
                className="pb-6 border-b border-[#e5e7eb] last:border-b-0"
              >
                <Link
                  href={`/article/${item.slug}`}
                  className="flex flex-col sm:flex-row items-start gap-4 group"
                >
                  {/* Thumbnail Image */}
                  <div className="w-full sm:w-48 md:w-56 aspect-[16/10] shrink-0 overflow-hidden bg-gray-100 rounded-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-sans font-bold text-[10px] uppercase tracking-wider text-[#333333] mb-1">
                      {item.category}
                    </div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#111111] leading-snug group-hover:underline mb-1.5">
                      {item.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-[#666666] leading-relaxed line-clamp-2 mb-3">
                      {item.excerpt}
                    </p>
                    <div className="font-sans text-[10px] uppercase tracking-wider text-gray-400">
                      BY {displayName} &bull; {item.date}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-8 pb-4 mt-6 border-t border-gray-200">
            {/* PREV button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3.5 py-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                currentPage === 1
                  ? "bg-[#efeff1] text-[#8e8e93] cursor-not-allowed"
                  : "bg-[#f4f4f5] text-[#111111] hover:bg-[#e4e4e7] cursor-pointer"
              }`}
            >
              PREV
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center space-x-1 mx-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 text-[12px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#8b0000] text-white shadow-xs"
                        : "bg-transparent text-[#222222] hover:text-[#8b0000] hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* NEXT button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3.5 py-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                currentPage === totalPages
                  ? "bg-[#efeff1] text-[#8e8e93] cursor-not-allowed"
                  : "bg-[#f4f4f5] text-[#111111] hover:bg-[#e4e4e7] cursor-pointer"
              }`}
            >
              NEXT
            </button>
          </div>
        </>
      )}
    </div>
  );
}
