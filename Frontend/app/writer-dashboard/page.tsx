"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSettingsModal, { UserProfile } from "@/components/ui/ProfileSettingsModal";

interface PostItem {
  id: string;
  title: string;
  subheadline?: string;
  bodyContent?: string;
  category: string;
  status: "Published" | "Drafts" | "Pending review" | "Rejected" | "Trash";
  previousStatus?: "Published" | "Drafts" | "Pending review" | "Rejected";
  date: string;
  readDuration?: string;
  views?: number;
}

export default function WriterDashboard() {
  const router = useRouter();

  const INITIAL_SAMPLE_POSTS: PostItem[] = [
    {
      id: "sample_draft_1",
      title: "From $1 Billion to $2.7 Billion, Spider-Man Is Chasing Box-Office History",
      subheadline: "Spider-Man: Brand New Day opened with an enormous $932 million worldwide, giving it the second-biggest global opening weekend in movie history. The film has continued its strong run since then. Box...",
      bodyContent: "<p>Spider-Man: Brand New Day opened with an enormous $932 million worldwide, giving it the second-biggest global opening weekend in movie history. The film has continued its strong run since then. Box office analysts predict another record-breaking weekend as audiences flood theaters globally.</p><p>With unmatched momentum across international markets, the web-slinger is set to redefine modern blockbusters for years to come.</p>",
      category: "World",
      status: "Drafts",
      date: "Aug 15, 2026",
      readDuration: "5 min read",
      views: 1420,
    },
    {
      id: "sample_draft_2",
      title: "Olugbenga \"GB\" Agboola: The Nigerian Entrepreneur Building Africa's Global Payment Network",
      subheadline: "Olugbenga \"GB\" Agboola is one of Africa's best-known fintech entrepreneurs and the founder and CEO of Flutterwave...",
      bodyContent: "<p>Olugbenga \"GB\" Agboola is one of Africa's best-known fintech entrepreneurs and the founder and CEO of Flutterwave. Under his leadership, the company has transformed payment infrastructure across the continent, connecting millions of businesses to global commerce.</p><p>Agboola's vision continues to drive innovation in cross-border financial technology, unlocking economic opportunities for emerging markets.</p>",
      category: "Business",
      status: "Drafts",
      date: "Aug 14, 2026",
      readDuration: "5 min read",
      views: 890,
    },
    {
      id: "sample_trash_1",
      title: "Draft Article Archived",
      subheadline: "Archived draft post content...",
      bodyContent: "<p>Archived draft post content...</p>",
      category: "Technology",
      status: "Trash",
      date: "Aug 10, 2026",
      readDuration: "3 min read",
      views: 0,
    },
  ];

  const [activeTab, setActiveTab] = useState<"Published" | "Drafts" | "Pending review" | "Rejected" | "Trash">("Drafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // New post form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Business");
  const [newContent, setNewContent] = useState("");
  const [newStatus, setNewStatus] = useState<"Published" | "Drafts">("Published");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost: PostItem = {
      id: "post_" + Date.now(),
      title: newTitle.trim(),
      subheadline: newContent.trim().substring(0, 120) || "Newly created article post...",
      bodyContent: newContent,
      category: newCategory,
      status: newStatus,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readDuration: "3 min read",
      views: 0,
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("wsj_posts", JSON.stringify(updated));

    setNewTitle("");
    setNewContent("");
    setNewCategory("Business");
    setNewStatus("Published");
    setShowCreateModal(false);
  };

  // Posts list
  const [posts, setPosts] = useState<PostItem[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadPosts = () => {
    if (typeof window === "undefined") return;
    const storedPosts = localStorage.getItem("wsj_posts");
    if (storedPosts) {
      try {
        const parsed: PostItem[] = JSON.parse(storedPosts);
        if (parsed && Array.isArray(parsed)) {
          setPosts(parsed);
          return;
        }
      } catch (e) {}
    }
    setPosts([]);
    try {
      localStorage.setItem("wsj_posts", JSON.stringify([]));
    } catch (e) {}
  };

  useEffect(() => {
    loadPosts();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["Published", "Drafts", "Pending review", "Rejected", "Trash"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
    window.addEventListener("wsj_posts_updated", loadPosts);
    return () => window.removeEventListener("wsj_posts_updated", loadPosts);
  }, []);

  const handleMoveToTrash = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts((prevPosts) => {
      const updated = prevPosts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            previousStatus: p.status === "Trash" ? "Drafts" : (p.status as any),
            status: "Trash" as const,
          };
        }
        return p;
      });
      localStorage.setItem("wsj_posts", JSON.stringify(updated));
      window.dispatchEvent(new Event("wsj_posts_updated"));
      return updated;
    });
  };

  const handleRestoreFromTrash = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts((prevPosts) => {
      const updated = prevPosts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: (p.previousStatus || "Drafts") as any,
          };
        }
        return p;
      });
      localStorage.setItem("wsj_posts", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeletePermanently = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts((prevPosts) => {
      const updated = prevPosts.filter((p) => p.id !== id);
      localStorage.setItem("wsj_posts", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const loadUser = () => {
      const tabUser = sessionStorage.getItem("wsj_user");
      const writerUser = localStorage.getItem("wsj_writer_user");
      const adminUser = localStorage.getItem("wsj_admin_user");
      const generalUser = localStorage.getItem("wsj_user");

      let parsed: any = null;
      if (tabUser) {
        try { parsed = JSON.parse(tabUser); } catch (e) {}
      }
      if (!parsed && writerUser) {
        try { parsed = JSON.parse(writerUser); } catch (e) {}
      }
      if (!parsed && adminUser) {
        try { parsed = JSON.parse(adminUser); } catch (e) {}
      }
      if (!parsed && generalUser) {
        try { parsed = JSON.parse(generalUser); } catch (e) {}
      }

      if (parsed) {
        setCurrentUser(parsed);
      } else {
        router.push("/signin");
      }
    };

    loadUser();
    window.addEventListener("wsj_user_updated", loadUser);
    return () => window.removeEventListener("wsj_user_updated", loadUser);
  }, [router]);

  const getTabCount = (tab: string) => {
    return posts.filter((p) => p.status === tab).length;
  };

  const displayName = currentUser?.full_name || "";
  const displayEmail = currentUser?.email || "";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const filteredPosts = posts.filter(
    (p) =>
      p.status === activeTab &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans flex flex-col justify-between">
      <div>
        {/* ================================================================= */}
        {/* TOP NAVBAR                                                        */}
        {/* ================================================================= */}
        <header className="bg-white border-t border-t-[#262626] border-b border-b-[#e2e8f0] h-auto min-h-[56px] sm:min-h-[64px] lg:min-h-[2.5cm] px-3 sm:px-6 md:px-8 lg:px-[3.8cm] py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Left Navigation: Back Arrow, Website Logo, WRITER PORTAL Pill */}
          <div className="flex items-center space-x-1 sm:space-x-2.5 min-w-0">
            <button
              onClick={() => router.push("/")}
              className="p-0.5 sm:p-1 text-gray-400 hover:text-black transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Go to Homepage"
            >
              <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            {/* Website Logo */}
            <Link href="/" className="flex items-center shrink min-w-0">
              <img
                src="/images/design-reference/Times Chicago.svg"
                alt="Times Chicago"
                className="h-3 sm:h-4.5 max-w-[95px] xs:max-w-[140px] sm:max-w-none w-auto object-contain block"
              />
            </Link>

            {/* WRITER PORTAL Pill Badge with Spacing on BOTH sides */}
            <span className="bg-[#eff6ff] text-[#2563eb] text-[8px] xs:text-[9.5px] sm:text-[10.5px] font-mono font-bold px-1.5 xs:px-2 sm:px-2.5 mx-1 xs:mx-2 sm:mx-3 h-3.5 xs:h-4 sm:h-4.5 inline-flex items-center justify-center rounded-[4px] uppercase tracking-wider select-none leading-none shrink-0 self-center">
              WRITER PORTAL
            </span>
          </div>

          {/* Right User Badge */}
          <div className="relative shrink-0 ml-1 sm:ml-2" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-1 sm:space-x-2 bg-white hover:bg-gray-50 border border-[#cbd5e1] rounded-xl p-0.5 pr-1.5 xs:pr-2 sm:pr-2.5 transition-all cursor-pointer shadow-2xs"
            >
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={displayName}
                  className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-lg object-cover shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-5.5 h-5.5 sm:w-7 sm:h-7 bg-[#ea580c] text-white rounded-lg flex items-center justify-center font-bold text-[10px] sm:text-xs font-sans shadow-2xs shrink-0">
                  {avatarLetter}
                </div>
              )}
              <span className="font-bold text-[11px] sm:text-xs text-[#0f172a] tracking-tight truncate max-w-[65px] xs:max-w-[110px] sm:max-w-none">{displayName}</span>
              <svg
                className={`w-3 h-3 text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-24px)] bg-white border border-[#e2e8f0] shadow-2xl rounded-xl z-50 overflow-hidden font-sans text-left">
                <div className="px-4 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <div className="font-bold text-sm text-[#0f172a] truncate">{displayName}</div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{displayEmail}</div>
                </div>
                <div className="py-1">
                  <Link
                    href="/writer"
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>View Writer Page</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("wsj_user");
                      localStorage.removeItem("wsj_token");
                      localStorage.removeItem("wsj_admin_user");
                      sessionStorage.removeItem("wsj_session_active");
                      window.dispatchEvent(new Event("wsj_user_updated"));
                      router.push("/");
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ================================================================= */}
        {/* MAIN WRITER DASHBOARD BODY                                        */}
        {/* ================================================================= */}
        <main className="w-full px-3 sm:px-6 md:px-8 lg:px-[3.8cm] py-4 sm:py-6 md:py-8 flex-1">
          {/* Header Row: Title & Create New Post Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
            <h1
              className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#0f172a] tracking-tight leading-none select-none"
              style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 900, letterSpacing: '-0.03em' }}
            >
              Posts
            </h1>
            <button
              onClick={() => router.push("/writer-dashboard/create-post")}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-[13px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center space-x-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
              style={{ fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              <span className="text-sm font-bold">+</span>
              <span>Create New Post</span>
            </button>
          </div>

          {/* Section Navigation Tabs (Horizontally Scrollable) */}
          <div className="border-b border-[#e2e8f0] flex items-center justify-between mb-4 sm:mb-5 relative w-full overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center space-x-4 sm:space-x-7 min-w-max pb-2">
              {(["Published", "Drafts", "Pending review", "Rejected", "Trash"] as const).map((tab) => {
                const isActive = activeTab === tab;
                const count = getTabCount(tab);
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                    className={`text-xs sm:text-[13px] transition-all relative cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                      isActive
                        ? "font-bold text-[#2563eb]"
                        : "font-medium text-[#475569] hover:text-[#0f172a]"
                    }`}
                  >
                    <span>{tab}</span>
                    {count > 0 && (
                      <span
                        className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center bg-[#e0edff] text-[#2563eb] ml-1"
                      >
                        {count}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#2563eb] rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort Selector Icon */}
            <div className="pb-2 pl-2 text-[#94a3b8] hover:text-[#475569] cursor-pointer transition-colors flex items-center shrink-0">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 4l-5 6h10l-5-6zM12 20l5-6H7l5 6z" />
              </svg>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-2xs py-4 sm:py-5 min-h-[400px] flex flex-col relative overflow-hidden">
            {/* Top Right Search Input Box */}
            <div className="flex justify-end px-3 sm:px-7 mb-4">
              <div className="flex items-center space-x-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-full px-3 py-1 w-full xs:w-52 sm:w-56 text-xs text-gray-700 focus-within:border-[#2563eb] focus-within:bg-white transition-all">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-[11px] text-gray-700 placeholder-gray-400 font-sans"
                />
              </div>
            </div>

            {/* Posts Table (Non-Scrollable) */}
            {filteredPosts.length > 0 ? (
              <div className="w-full">
                <table className="w-full text-left font-sans border-collapse">
                  <thead>
                    <tr
                      style={{ fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                      className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] text-[8.5px] xs:text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider"
                    >
                      <th className="py-2 sm:py-2.5 pl-3 sm:pl-8 pr-2 sm:pr-3 font-bold">POST TITLE & SUMMARY</th>
                      <th className="py-2 sm:py-2.5 px-2 sm:px-4 font-bold whitespace-nowrap">CATEGORY</th>
                      <th className="py-2 sm:py-2.5 px-2 sm:px-4 font-bold whitespace-nowrap hidden xs:table-cell">DATE</th>
                      <th className="py-2 sm:py-2.5 px-2 sm:px-4 font-bold text-center whitespace-nowrap">STATUS</th>
                      <th className="py-2 sm:py-2.5 pl-2 sm:pl-4 pr-3 sm:pr-8 font-bold text-right whitespace-nowrap">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* POST TITLE & SUMMARY */}
                        <td className="py-3 sm:py-4 pl-3 sm:pl-8 pr-2 sm:pr-3 text-left">
                          <div className="max-w-[160px] xs:max-w-[240px] sm:max-w-[420px]">
                            <div className="font-bold text-xs sm:text-[13px] text-[#0f172a] font-sans leading-tight line-clamp-2">
                              {post.title}
                            </div>
                            {post.subheadline && (
                              <div className="hidden xs:block text-[10.5px] sm:text-[11px] text-[#475569] font-sans mt-0.5 leading-snug line-clamp-1 sm:line-clamp-2">
                                {post.subheadline}
                              </div>
                            )}
                            <div className="text-[8.5px] sm:text-[9px] font-mono text-[#94a3b8] mt-0.5 sm:mt-1 font-normal lowercase">
                              {post.readDuration ? post.readDuration.toLowerCase() : "5 min read"}
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-[10px] sm:text-[11.5px] font-bold text-[#0f172a] whitespace-nowrap">
                          {post.category}
                        </td>

                        {/* DATE */}
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-[9.5px] sm:text-[11px] text-[#64748b] font-mono whitespace-nowrap hidden xs:table-cell">
                          {post.date}
                        </td>

                        {/* STATUS */}
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-center whitespace-nowrap">
                          {post.status === "Trash" ? (
                            <span className="inline-block bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] text-[8px] sm:text-[9.5px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              TRASH
                            </span>
                          ) : post.status === "Pending review" ? (
                            <span className="inline-block bg-[#fef3c7] text-[#d97706] border border-[#fde68a] text-[8px] sm:text-[9.5px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              PENDING
                            </span>
                          ) : post.status === "Rejected" ? (
                            <span className="inline-block bg-[#ffe4e6] text-[#e11d48] border border-[#fecdd3] text-[8px] sm:text-[9.5px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              REJECTED
                            </span>
                          ) : post.status === "Published" ? (
                            <span className="inline-block bg-[#d1fae5] text-[#059669] border border-[#a7f3d0] text-[8px] sm:text-[9.5px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              PUBLISHED
                            </span>
                          ) : (
                            <span className="inline-block bg-[#f1f5f9] text-[#1e293b] border border-[#e2e8f0] text-[8px] sm:text-[9.5px] font-bold px-2 sm:px-3 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              DRAFT
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 sm:py-4 pl-2 sm:pl-4 pr-3 sm:pr-8 text-right whitespace-nowrap">
                          {post.status === "Trash" ? (
                            <div className="inline-flex items-center justify-end space-x-1.5 sm:space-x-3 font-sans font-bold text-[10px] sm:text-[11px]">
                              <button
                                type="button"
                                onClick={(e) => handleRestoreFromTrash(post.id, e)}
                                className="text-[#0f172a] hover:text-[#2563eb] transition-colors cursor-pointer"
                              >
                                Restore
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeletePermanently(post.id, e)}
                                className="text-[#0f172a] hover:text-red-600 transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-end space-x-1.5 sm:space-x-2 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => router.push(`/writer-dashboard/create-post?id=${post.id}`)}
                                className="text-[#2563eb] hover:text-[#1d4ed8] font-bold text-[10.5px] sm:text-[11.5px] font-sans transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleMoveToTrash(post.id, e)}
                                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                                title="Move to Trash"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Centralized Empty State Graphical Artwork */
              <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                  <div className="absolute top-2 left-4 w-6 h-6 bg-[#1e293b] rounded-lg transform -rotate-12 shadow-2xs" />
                  <div className="absolute bottom-3 right-4 w-5 h-5 bg-[#10b981] rounded-full shadow-2xs" />
                  <div className="absolute bottom-1 left-7 w-12 h-6 bg-[#f59e0b] rounded-b-full transform -rotate-6" />
                  <svg className="absolute top-1 right-2 w-14 h-14 text-[#f472b6]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
                    <path d="M 30,70 A 30,30 0 0,1 70,30" strokeLinecap="round" />
                  </svg>
                  <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-[#1e293b] rounded-full" />
                  <div className="absolute bottom-7 left-12 w-1.5 h-1.5 bg-[#94a3b8] rounded-full" />
                  <div className="relative z-10 w-12 h-12 bg-[#2563eb] text-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0f172a] font-sans tracking-tight">
                  Share what's on your mind
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-sans mt-1">
                  Create or import posts to start publishing.
                </p>

                <button
                  onClick={() => router.push("/writer-dashboard/create-post")}
                  className="text-[#2563eb] hover:text-[#1d4ed8] font-bold text-xs sm:text-sm mt-4 flex items-center space-x-1 transition-colors cursor-pointer hover:underline"
                >
                  <span className="text-base leading-none">+</span>
                  <span>Create Post</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================================================================= */}
      {/* CREATE POST MODAL                                                 */}
      {/* ================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left font-sans animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Create New Article Post</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">
                ×
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter article headline..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="World">World</option>
                    <option value="Business">Business</option>
                    <option value="U.S.">U.S.</option>
                    <option value="Politics">Politics</option>
                    <option value="Tech">Tech</option>
                    <option value="Opinion">Opinion</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Publishing Mode
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as "Published" | "Drafts")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Published">Publish Immediately</option>
                    <option value="Drafts">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Content / Body Excerpt
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your article content here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#2563eb] text-white rounded-full hover:bg-[#1d4ed8]"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Profile Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSave={(updated) => setCurrentUser(updated)}
      />
    </div>
  );
}
