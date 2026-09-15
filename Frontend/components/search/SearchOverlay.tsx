"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { homepageArticles } from "@/data/articles";
import { authorsList, getAuthorForArticle, slugifyAuthorName } from "@/data/authors";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const getInitials = (name: string) => {
  if (!name) return "WR";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const websiteCategories = [
  { name: "US", href: "/us" },
  { name: "News", href: "/news" },
  { name: "Politics", href: "/politics" },
  { name: "Economy & Markets", href: "/business/economy-markets" },
  { name: "Business", href: "/business" },
  { name: "Crypto", href: "/markets" },
  { name: "Technology", href: "/tech" },
  { name: "Travel", href: "/lifestyle" },
  { name: "Opinion", href: "/opinion" },
  { name: "CEO Spotlight", href: "/business/cfo-spotlight" },
  { name: "Sports", href: "/sports" },
  { name: "Health", href: "/health" },
  { name: "Real Estate", href: "/real-estate" },
  { name: "Lifestyle", href: "/lifestyle" },
  { name: "Arts", href: "/arts" },
];

const EmptyState: React.FC<{ query: string }> = ({ query }) => (
  <div className="text-center py-10 px-4 font-sans select-none animate-in fade-in duration-150">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h4 className="font-bold text-sm text-slate-800 mb-1">
      No results found for &ldquo;{query}&rdquo;
    </h4>
    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
      Try a different keyword or adjust filters
    </p>
  </div>
);

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "articles" | "authors">("all");
  const [allWriters, setAllWriters] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const loadData = async () => {
    const writersMap = new Map<string, any>();

    // 1. Template writers (Nivedita Chakrapani, Ethan Smith, Samuel Rubenfeld, Nivedita Bhattacharjee)
    authorsList.forEach((a) => {
      const roleUpper = (a.role || "WRITER").toUpperCase();
      if (roleUpper !== "READER" && roleUpper !== "ADMIN") {
        const key = a.email ? a.email.toLowerCase().trim() : a.slug.toLowerCase();
        writersMap.set(key, {
          slug: a.slug,
          name: a.name,
          role: roleUpper,
          bio: a.bio,
          image: a.image,
          email: a.email || "",
          href: `/author/${a.slug}`,
        });
      }
    });

    // 2. Real registered users in localStorage (wsj_users_by_email)
    if (typeof window !== "undefined") {
      try {
        const profilesMap = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
        Object.values(profilesMap).forEach((u: any) => {
          if (!u || !u.email) return;
          const roleUpper = (u.role || "READER").toUpperCase();
          if (roleUpper === "WRITER" || roleUpper === "AUTHOR") {
            const cleanEmail = u.email.toLowerCase().trim();
            const displayName = u.full_name || u.name || cleanEmail.split("@")[0];
            const authorSlug = slugifyAuthorName(displayName);
            writersMap.set(cleanEmail, {
              slug: authorSlug,
              name: displayName,
              role: "WRITER",
              bio: u.bio || "Journalist & Columnist covering news, analysis, and current affairs.",
              image: u.avatar_url || u.image || "",
              email: cleanEmail,
              href: cleanEmail === "writer1@gmail.com" ? "/author/writer1" : `/author/${authorSlug}`,
            });
          }
        });
      } catch (e) {}

      // Current Session user if writer
      try {
        const sessionUser = JSON.parse(sessionStorage.getItem("wsj_user") || localStorage.getItem("wsj_user") || "null");
        if (sessionUser && sessionUser.email) {
          const roleUpper = (sessionUser.role || "READER").toUpperCase();
          if (roleUpper === "WRITER" || roleUpper === "AUTHOR") {
            const cleanEmail = sessionUser.email.toLowerCase().trim();
            const displayName = sessionUser.full_name || sessionUser.name || cleanEmail.split("@")[0];
            const authorSlug = slugifyAuthorName(displayName);
            writersMap.set(cleanEmail, {
              slug: authorSlug,
              name: displayName,
              role: "WRITER",
              bio: sessionUser.bio || "Journalist & Columnist covering news, analysis, and current affairs.",
              image: sessionUser.avatar_url || sessionUser.image || "",
              email: cleanEmail,
              href: cleanEmail === "writer1@gmail.com" ? "/author/writer1" : `/author/${authorSlug}`,
            });
          }
        }
      } catch (e) {}
    }

    // 3. Backend API users list
    try {
      const res = await fetch("http://localhost:5000/api/users").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const list = data.list || (data.users ? Object.values(data.users) : []);
        list.forEach((u: any) => {
          if (!u || !u.email) return;
          const roleUpper = (u.role || "READER").toUpperCase();
          if (roleUpper === "WRITER" || roleUpper === "AUTHOR") {
            const cleanEmail = u.email.toLowerCase().trim();
            const displayName = u.full_name || u.name || cleanEmail.split("@")[0];
            const authorSlug = slugifyAuthorName(displayName);
            writersMap.set(cleanEmail, {
              slug: authorSlug,
              name: displayName,
              role: "WRITER",
              bio: u.bio || "Journalist & Columnist covering news, analysis, and current affairs.",
              image: u.avatar_url || u.image || "",
              email: cleanEmail,
              href: cleanEmail === "writer1@gmail.com" ? "/author/writer1" : `/author/${authorSlug}`,
            });
          }
        });
      }
    } catch (e) {}

    // Final list of active writers (Excluding READERS and ADMINS)
    const writersList = Array.from(writersMap.values());
    setAllWriters(writersList);

    // Assembly of articles
    let combined = Object.values(homepageArticles);
    if (typeof window !== "undefined") {
      const storedPosts = localStorage.getItem("wsj_posts");
      if (storedPosts) {
        try {
          const parsed = JSON.parse(storedPosts);
          const userArticles = parsed.map((p: any) => ({
            id: p.id || String(Date.now()),
            title: p.title,
            summary: p.subheadline || p.title,
            category: p.category || "Business",
            author: p.author || "Times Chicago Staff",
            authorEmail: p.authorEmail || "",
            publishedDate: p.date,
            imageUrl: p.thumbnail || p.image || p.imageUrl || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=1200&q=80",
            slug: p.slug || String(p.id),
          }));
          combined = [...userArticles, ...combined];
        } catch (e) {}
      }
    }
    setAllArticles(combined);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const cleanQuery = query.trim().toLowerCase();

  // Filter matching authors (Writers ONLY - Readers and Admins excluded)
  const matchingAuthors = cleanQuery
    ? allWriters.filter((author) => author.name.toLowerCase().includes(cleanQuery))
    : [];

  // Filter matching articles (Matches Article Title, Summary, or Category)
  const results = cleanQuery
    ? allArticles.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(cleanQuery);
        const summaryMatch = article.summary?.toLowerCase().includes(cleanQuery);
        const categoryMatch = article.category?.toLowerCase().includes(cleanQuery);
        return titleMatch || summaryMatch || categoryMatch;
      })
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/15 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150 font-sans select-none">
      {/* Modal Dialog Card (Matching Image 3) */}
      <div className="bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        
        {/* Top Search Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center gap-3.5 bg-white">
          <svg className="w-5 h-5 text-[#00558c] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles, authors, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base sm:text-lg font-sans text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer shrink-0 ml-1"
            aria-label="Close search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Pills (All / Articles / Authors) */}
        <div className="px-5 sm:px-6 pt-3 pb-3 flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              typeFilter === "all"
                ? "bg-black text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter("articles")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              typeFilter === "articles"
                ? "bg-black text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setTypeFilter("authors")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              typeFilter === "authors"
                ? "bg-black text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Authors
          </button>
        </div>

        {/* Modal Body Content (Trending Categories or Search Results) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!cleanQuery ? (
            /* TRENDING CATEGORIES SECTION */
            <div className="space-y-3.5">
              <div className="flex items-center space-x-2 text-xs font-bold font-mono text-[#00558c] uppercase tracking-wider">
                <svg className="w-4 h-4 text-[#00558c]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>TRENDING CATEGORIES</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {websiteCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setQuery(cat.name)}
                    className="px-4 py-2 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 rounded-full text-xs font-medium text-slate-800 transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ACTIVE SEARCH RESULTS DISPLAY */
            <div className="space-y-6">
              {/* ======================================================== */}
              {/* TAB: 'all'                                               */}
              {/* ======================================================== */}
              {typeFilter === "all" && (
                <>
                  {results.length === 0 && matchingAuthors.length === 0 ? (
                    /* Single clean empty state for 'All' tab when NOTHING matches */
                    <EmptyState query={query} />
                  ) : (
                    <>
                      {/* Authors Section in 'All' Tab (Only shown if matchingAuthors > 0) */}
                      {matchingAuthors.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-400 font-sans mb-3">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>AUTHORS</span>
                            </div>
                            <span className="text-xs text-slate-400 font-sans">
                              {matchingAuthors.length} {matchingAuthors.length === 1 ? "result" : "results"}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {matchingAuthors.map((author) => (
                              <Link
                                key={author.slug}
                                href={(author as any).href || `/author/${author.slug}`}
                                onClick={onClose}
                                className="block bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-300 rounded-2xl p-3.5 transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  {author.image ? (
                                    <img
                                      src={author.image}
                                      alt={author.name}
                                      className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                      {getInitials(author.name)}
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center space-x-2 flex-wrap">
                                      <span className="font-bold text-sm text-slate-900 group-hover:underline">
                                        {author.name}
                                      </span>
                                      <span className="bg-[#0f172a] text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-wider shrink-0">
                                        {author.role || "WRITER"}
                                      </span>
                                      {author.bio && (
                                        <span className="text-xs text-slate-500 font-sans truncate font-normal min-w-0 flex-1">
                                          {author.bio}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Articles Section in 'All' Tab (Only shown if results > 0) */}
                      {results.length > 0 && (
                        <div className={matchingAuthors.length > 0 ? "pt-4 border-t border-slate-100" : ""}>
                          <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Articles ({results.length})
                          </div>
                          <div className="space-y-2.5">
                            {results.map((article) => {
                              const authorObj = getAuthorForArticle(article.slug, article.author, article.authorEmail);
                              const displayAuthor = authorObj?.name || article.author || "Times Chicago Staff";
                              return (
                                <Link
                                  key={article.id}
                                  href={`/article/${article.slug}`}
                                  onClick={onClose}
                                  className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-300 rounded-2xl p-3 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                                >
                                  <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                                    {article.imageUrl && (
                                      <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                                      />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <span className="bg-[#990000] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-2xs inline-block mb-1 font-sans">
                                        {(article.category || "WORLD").toUpperCase()}
                                      </span>
                                      <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug group-hover:underline truncate">
                                        {article.title}
                                      </h4>
                                      <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                                        {displayAuthor} · {article.publishedDate || "Recently"}
                                      </div>
                                    </div>
                                  </div>
                                  <svg
                                    className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* ======================================================== */}
              {/* TAB: 'articles'                                          */}
              {/* ======================================================== */}
              {typeFilter === "articles" && (
                <div>
                  <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Articles ({results.length})
                  </div>
                  {results.length > 0 ? (
                    <div className="space-y-2.5">
                      {results.map((article) => {
                        const authorObj = getAuthorForArticle(article.slug, article.author, article.authorEmail);
                        const displayAuthor = authorObj?.name || article.author || "Times Chicago Staff";
                        return (
                          <Link
                            key={article.id}
                            href={`/article/${article.slug}`}
                            onClick={onClose}
                            className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-300 rounded-2xl p-3 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                              {article.imageUrl && (
                                <img
                                  src={article.imageUrl}
                                  alt={article.title}
                                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="bg-[#990000] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-2xs inline-block mb-1 font-sans">
                                  {(article.category || "WORLD").toUpperCase()}
                                </span>
                                <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug group-hover:underline truncate">
                                  {article.title}
                                </h4>
                                <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                                  {displayAuthor} · {article.publishedDate || "Recently"}
                                </div>
                              </div>
                            </div>
                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState query={query} />
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB: 'authors'                                           */}
              {/* ======================================================== */}
              {typeFilter === "authors" && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-sans mb-3">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>AUTHORS</span>
                    </div>
                    <span className="text-xs text-slate-400 font-sans">
                      {matchingAuthors.length} {matchingAuthors.length === 1 ? "result" : "results"}
                    </span>
                  </div>

                  {matchingAuthors.length > 0 ? (
                    <div className="space-y-2.5">
                      {matchingAuthors.map((author) => (
                        <Link
                          key={author.slug}
                          href={(author as any).href || `/author/${author.slug}`}
                          onClick={onClose}
                          className="block bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-300 rounded-2xl p-3.5 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            {author.image ? (
                              <img
                                src={author.image}
                                alt={author.name}
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {getInitials(author.name)}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2 flex-wrap">
                                <span className="font-bold text-sm text-slate-900 group-hover:underline">
                                  {author.name}
                                </span>
                                <span className="bg-[#0f172a] text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-wider shrink-0">
                                  {author.role || "WRITER"}
                                </span>
                                {author.bio && (
                                  <span className="text-xs text-slate-500 font-sans truncate font-normal min-w-0 flex-1">
                                    {author.bio}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyState query={query} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Bar (Matching Image 3) */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-sans">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-2xs text-slate-600 font-bold">Enter</kbd>
              <span>to search</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-2xs text-slate-600 font-bold">Esc</kbd>
              <span>to close</span>
            </span>
          </div>
          <div className="font-serif font-bold text-slate-600 tracking-tight text-xs">
            Times Chicago
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
