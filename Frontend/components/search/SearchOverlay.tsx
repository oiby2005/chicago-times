"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { homepageArticles } from "@/data/articles";

import { authorsList } from "@/data/authors";

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

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [writerName, setWriterName] = useState("Reader User");
  const [writerBio, setWriterBio] = useState("Avid Reader & News Enthusiast");
  const [writerAvatar, setWriterAvatar] = useState("");
  const [writerRole, setWriterRole] = useState("READER");
  const [allArticles, setAllArticles] = useState<any[]>([]);

  useEffect(() => {
    let name = "Reader User";
    let bio = "Avid Reader & News Enthusiast";
    let avatar = "";
    let role = "READER";
    const storedUser = localStorage.getItem("wsj_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.full_name || u.name) name = u.full_name || u.name;
        if (u.bio) bio = u.bio;
        if (u.avatar_url) avatar = u.avatar_url;
        if (u.role) role = u.role.toUpperCase();
      } catch (e) {}
    }
    setWriterName(name);
    setWriterBio(bio);
    setWriterAvatar(avatar);
    setWriterRole(role);

    let combined = Object.values(homepageArticles);
    const storedPosts = localStorage.getItem("wsj_posts");
    if (storedPosts) {
      try {
        const parsed = JSON.parse(storedPosts);
        const userArticles = parsed.map((p: any) => ({
          id: p.id || String(Date.now()),
          title: p.title,
          summary: p.subheadline || p.title,
          category: p.category || "Business",
          author: name,
          publishedDate: p.date,
          imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
        }));
        combined = [...userArticles, ...combined];
      } catch (e) {}
    }
    setAllArticles(combined);
  }, [isOpen]);

  const cleanQuery = query.trim().toLowerCase();

  // Dynamically assemble active authors & users list
  const activeAuthors = [
    {
      slug: "user",
      name: writerName,
      role: writerRole,
      bio: writerBio,
      image: writerAvatar,
      href: writerRole === "ADMIN" ? "/admin-dashboard" : writerRole === "READER" ? "/reader-dashboard" : "/writer",
    },
    ...authorsList.filter((a) => a.slug !== "writer"),
  ];

  const matchingAuthors = cleanQuery
    ? activeAuthors.filter((author) => author.name.toLowerCase().includes(cleanQuery))
    : [];

  const results = cleanQuery
    ? allArticles.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(cleanQuery);
        const summaryMatch = article.summary?.toLowerCase().includes(cleanQuery);
        const categoryMatch = article.category?.toLowerCase().includes(cleanQuery);
        const authorMatch = article.author?.toLowerCase().includes(cleanQuery);
        return titleMatch || summaryMatch || categoryMatch || authorMatch;
      })
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white w-full h-full min-h-screen flex flex-col justify-start pt-6 px-4 md:px-12 select-none overflow-y-auto">
      {/* Top Close Button (Screenshot) */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-2xl font-light text-gray-500 hover:text-black transition-colors focus:outline-none cursor-pointer"
        aria-label="Close search"
      >
        ✕
      </button>

      <div className="max-w-4xl mx-auto w-full pt-10 pb-16">
        {/* Main Search Input Form Row */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-10"
        >
          <div className="flex-1 relative border-b-2 border-[#007cba] pb-1">
            <input
              type="text"
              placeholder="Enter News, Quotes, Companies or Videos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-lg sm:text-2xl font-sans text-black placeholder:text-gray-400 outline-none pr-4"
            />
          </div>

          <button
            type="submit"
            className="bg-[#bcbcbc] hover:bg-[#999999] text-white text-xs font-bold font-sans tracking-wider px-5 py-2.5 rounded-xs flex items-center justify-center space-x-1.5 uppercase transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <span>SEARCH</span>
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Centered Helper Box */}
        <div className="max-w-xl mx-auto bg-[#f2f2f2] p-8 text-center rounded-xs space-y-3 border border-[#e2e2e2] shadow-xs my-6">
          <div className="text-xl text-black flex justify-center mb-1">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h3 className="font-sans font-black text-xl sm:text-2xl text-black leading-tight">
            Find what you’re looking for
          </h3>

          <p className="text-xs font-sans text-[#555555] leading-relaxed max-w-md mx-auto">
            Search for topics like “tariffs”, your favorite authors, companies or even a more specific query like “dollar’s role as a reserve currency”.
          </p>
        </div>

        {/* Search Results Display */}
        {cleanQuery !== "" && (
          <div className="mt-8 pt-6 border-t border-[#e2e2e2]">
            {/* Matching Writers & Authors Section */}
            {matchingAuthors.length > 0 && (
              <div className="mb-8">
                <div className="text-xs font-sans font-bold text-[#007cba] uppercase tracking-wider mb-3">
                  Matching Writers ({matchingAuthors.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingAuthors.map((author) => (
                    <Link
                      key={author.slug}
                      href={(author as any).href || `/author/${author.slug}`}
                      onClick={onClose}
                      className="block group bg-white p-4 border border-[#e2e2e2] hover:border-[#007cba] transition-colors rounded-xs shadow-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        {author.image ? (
                          <img
                            src={author.image}
                            alt={author.name}
                            className="w-11 h-11 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#f05011] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(author.name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-base text-[#111111] group-hover:underline truncate">
                              {author.name}
                            </h4>
                            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#007cba] bg-[#e0f2fe] px-1.5 py-0.5 rounded-xs shrink-0">
                              {author.role || "READER"}
                            </span>
                          </div>
                          <p className="text-xs font-sans text-gray-500 truncate mt-0.5">
                            {author.bio}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Article Results */}
            <div className="text-xs font-sans font-bold text-gray-500 uppercase tracking-wider mb-4">
              Article Results ({results.length})
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    onClick={onClose}
                    className="block group bg-white p-4 border border-[#e2e2e2] rounded-xs hover:border-black transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#cc0000]">
                          {article.category || "News"}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-black leading-tight group-hover:underline">
                          {article.title}
                        </h4>
                        {article.summary && (
                          <p className="text-xs font-sans text-gray-600 line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        <div className="text-[11px] font-sans text-gray-500 pt-1">
                          By <span className="font-bold text-black">{article.author || "WSJ Staff"}</span> • {article.publishedDate || "August 7, 2026"}
                        </div>
                      </div>
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-20 h-16 object-cover rounded-xs shrink-0"
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              matchingAuthors.length === 0 && (
                <div className="text-center py-8 text-sm font-sans text-gray-500">
                  No matching articles or writers found for “<strong className="text-black">{query}</strong>”. Try another search term.
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
