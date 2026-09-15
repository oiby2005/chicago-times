"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import { homepageArticles } from "@/data/articles";
import { authorsList, getAuthorForArticle, slugifyAuthorName } from "@/data/authors";

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

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "articles" | "authors">("all");
  const [allWriters, setAllWriters] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);

  const loadData = async () => {
    const writersMap = new Map<string, any>();

    // 1. Template writers
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

    // 2. Real registered users in localStorage
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
    }

    // 3. Backend API users
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

    setAllWriters(Array.from(writersMap.values()));

    // Assembly of articles using their ACTUAL images
    let combined = Object.values(homepageArticles).map((art) => ({
      ...art,
      imageUrl: art.imageUrl || (art as any).image || (art as any).thumbnail || "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?fm=webp&fit=crop&w=1200&q=80",
    }));

    if (typeof window !== "undefined") {
      const storedPosts = localStorage.getItem("wsj_posts");
      if (storedPosts) {
        try {
          const parsed = JSON.parse(storedPosts);
          const userArticles = parsed.map((p: any) => ({
            id: p.id || String(Date.now()),
            title: p.title,
            summary: p.subheadline || p.excerpt || p.title,
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
    loadData();
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  const matchingAuthors = cleanQuery
    ? allWriters.filter((author) => author.name.toLowerCase().includes(cleanQuery))
    : [];

  const results = cleanQuery
    ? allArticles.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(cleanQuery);
        const summaryMatch = article.summary?.toLowerCase().includes(cleanQuery);
        const categoryMatch = article.category?.toLowerCase().includes(cleanQuery);
        return titleMatch || summaryMatch || categoryMatch;
      })
    : [];

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />
      <StickyHeaderBar />

      <main className="w-full flex-1 py-10 sm:py-14 bg-slate-50/50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Title */}
            <div>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-slate-900 mb-2">
                Search Articles & Authors
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                Search through our archive of news, editorials, analysis, and writer profiles.
              </p>
            </div>

            {/* Main Search Input Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-3">
              <svg className="w-5 h-5 text-[#00558c] shrink-0 ml-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Type to search articles, authors, topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full text-base sm:text-lg font-sans text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === "all"
                    ? "bg-black text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("articles")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === "articles"
                    ? "bg-black text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Articles ({results.length})
              </button>
              <button
                onClick={() => setTypeFilter("authors")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === "authors"
                    ? "bg-black text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Authors ({matchingAuthors.length})
              </button>
            </div>

            {/* Body Results or Trending Categories */}
            {!cleanQuery ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
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
              <div className="space-y-6">
                {(typeFilter === "all" || typeFilter === "authors") && matchingAuthors.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Authors ({matchingAuthors.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchingAuthors.map((author) => (
                        <Link
                          key={author.slug}
                          href={(author as any).href || `/author/${author.slug}`}
                          className="bg-slate-50/80 hover:bg-slate-100 border border-slate-100 hover:border-slate-300 rounded-xl p-3.5 transition-colors group flex items-center space-x-3 cursor-pointer"
                        >
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
                            <span className="font-bold text-sm text-slate-900 group-hover:underline block truncate">
                              {author.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-sans block truncate">
                              {author.role || "WRITER"}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(typeFilter === "all" || typeFilter === "articles") && results.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Articles ({results.length})
                    </h3>
                    <div className="space-y-4">
                      {results.map((article) => {
                        const authorObj = getAuthorForArticle(article.slug, article.author, article.authorEmail);
                        const displayAuthor = authorObj?.name || article.author || "Times Chicago Staff";
                        return (
                          <Link
                            key={article.id}
                            href={`/article/${article.slug}`}
                            className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 bg-slate-200"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="bg-[#990000] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-2xs inline-block mb-1 font-sans">
                                  {(article.category || "WORLD").toUpperCase()}
                                </span>
                                <h4 className="font-serif font-bold text-base text-slate-900 leading-snug group-hover:underline line-clamp-2">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-slate-600 line-clamp-1 mt-1">
                                  {article.summary}
                                </p>
                                <div className="text-[11px] text-slate-500 font-sans mt-1.5">
                                  {displayAuthor} · {article.publishedDate || "Recently"}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {results.length === 0 && matchingAuthors.length === 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs">
                    <h4 className="font-bold text-sm text-slate-800 mb-1">
                      No results found for &ldquo;{query}&rdquo;
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Try searching for a different keyword or category name.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </main>

      <StickySubscribeBar />
      <Footer />
    </div>
  );
}
