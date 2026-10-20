"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSettingsModal, { UserProfile } from "@/components/ui/ProfileSettingsModal";
import PressIdModal from "@/components/ui/PressIdModal";
import { getAuthorSlugForUser, slugifyAuthorName, getEditPostUrl } from "@/data/authors";
import { getAuthHeaders } from "@/lib/authHeader";

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
  const [showPressIdModal, setShowPressIdModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Contributor Quota & Live Countdown State
  interface QuotaStatus {
    is_contributor: boolean;
    writer_type?: string;
    is_blocked?: boolean;
    block_reason?: string;
    weeklyTarget?: number;
    weeklyPublished?: number;
    weeklyRemaining?: number;
    monthlyTarget?: number;
    monthlyPublished?: number;
    monthlyRemaining?: number;
    cycleStartMs?: number;
    cycleEndMs?: number;
    msLeft?: number;
    daysLeft?: number;
    dayOfCycle?: number;
    isWarningPeriod?: boolean;
  }
  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const fetchQuotaStatus = async (email: string) => {
    if (!email) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("wsj_token") : null;
      const res = await fetch(`http://localhost:5000/api/contributors/quota-status?email=${encodeURIComponent(email)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setQuotaStatus(data);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (!quotaStatus?.cycleEndMs) return;
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, (quotaStatus.cycleEndMs || 0) - now);
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [quotaStatus?.cycleEndMs]);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  const confirmDeletePermanently = (post: PostItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDeleteConfirmModal({
      isOpen: true,
      title: "Permanently Delete Article",
      message: `Are you sure you want to permanently delete "${post.title}"? This action cannot be undone.`,
      confirmText: "Delete Permanently",
      onConfirm: () => {
        handleDeletePermanently(post.id);
        setDeleteConfirmModal(null);
      },
    });
  };

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

  const loadPosts = async () => {
    if (typeof window === "undefined") return;

    let localPosts: PostItem[] = [];
    try {
      const storedPosts = localStorage.getItem("wsj_posts");
      if (storedPosts) {
        const parsed: PostItem[] = JSON.parse(storedPosts);
        if (parsed && Array.isArray(parsed)) {
          localPosts = parsed;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch("http://localhost:5000/api/posts");
      if (res.ok) {
        const data = await res.json();
        const postsArray = Array.isArray(data) ? data : (data && data.posts && Array.isArray(data.posts) ? data.posts : []);
        if (postsArray.length > 0) {
          const serverIds = new Set(postsArray.map((p: any) => String(p.id)));
          const unsavedLocalDrafts = localPosts.filter((p) => !serverIds.has(String(p.id)) && String(p.id).startsWith("post_"));
          const merged = [...postsArray, ...unsavedLocalDrafts];
          localStorage.setItem("wsj_posts", JSON.stringify(merged));
          localPosts = merged;
        }
      }
    } catch (e) {}

    localPosts.sort((a: any, b: any) => {
      const timeA = a.publishedAt || (a.id && !isNaN(Number(a.id)) ? Number(a.id) : 0);
      const timeB = b.publishedAt || (b.id && !isNaN(Number(b.id)) ? Number(b.id) : 0);
      return timeB - timeA;
    });

    setPosts(localPosts);
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

  const handleMoveToTrash = async (id: string, e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const targetId = String(id);

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (String(p.id) === targetId) {
          const currentStatus = p.status;
          const origStatus = currentStatus !== "Trash" ? currentStatus : (p.previousStatus || "Drafts");
          return {
            ...p,
            previousStatus: origStatus,
            status: "Trash" as const,
          };
        }
        return p;
      })
    );

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_posts");
        const allPosts: PostItem[] = stored ? JSON.parse(stored) : [];
        const updatedLocal = allPosts.map((p) => {
          if (String(p.id) === targetId) {
            const currentStatus = p.status;
            const origStatus = currentStatus !== "Trash" ? currentStatus : (p.previousStatus || "Drafts");
            return {
              ...p,
              previousStatus: origStatus,
              status: "Trash" as const,
            };
          }
          return p;
        });
        localStorage.setItem("wsj_posts", JSON.stringify(updatedLocal));

        fetch("http://localhost:5000/api/posts", {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(updatedLocal),
        }).catch(() => null);
      } catch (err) {}
    }
  };

  const handleRestoreFromTrash = async (id: string, e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const targetId = String(id);

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (String(p.id) === targetId) {
          return {
            ...p,
            status: (p.previousStatus || "Drafts") as any,
          };
        }
        return p;
      })
    );

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_posts");
        const allPosts: PostItem[] = stored ? JSON.parse(stored) : [];
        const updatedLocal = allPosts.map((p) => {
          if (String(p.id) === targetId) {
            return {
              ...p,
              status: (p.previousStatus || "Drafts") as any,
            };
          }
          return p;
        });
        localStorage.setItem("wsj_posts", JSON.stringify(updatedLocal));

        fetch("http://localhost:5000/api/posts", {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(updatedLocal),
        }).catch(() => null);
      } catch (err) {}
    }
  };

  const handleDeletePermanently = async (id: string, e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const targetId = String(id);

    setPosts((prevPosts) => prevPosts.filter((p) => String(p.id) !== targetId));

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_posts");
        const allPosts: PostItem[] = stored ? JSON.parse(stored) : [];
        const updatedLocal = allPosts.filter((p) => String(p.id) !== targetId);
        localStorage.setItem("wsj_posts", JSON.stringify(updatedLocal));

        await fetch(`http://localhost:5000/api/posts/${encodeURIComponent(targetId)}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        }).catch(() => null);
      } catch (err) {}
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const tabUser = sessionStorage.getItem("wsj_user");

      let parsed: any = null;
      if (tabUser) {
        try { parsed = JSON.parse(tabUser); } catch (e) {}
      }

      if (parsed && parsed.email) {
        const cleanEmail = parsed.email.toLowerCase().trim();
        const userRole = (parsed.role || "").toLowerCase();
        if (userRole === "admin") {
          router.push("/admin-dashboard");
          return;
        }
        if (userRole === "reader") {
          router.push("/reader-dashboard");
          return;
        }

        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("wsj_token") : null;
          const res = await fetch(`http://localhost:5000/api/users/${encodeURIComponent(cleanEmail)}`, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              parsed = { ...parsed, ...data.user };
              sessionStorage.setItem("wsj_user", JSON.stringify(parsed));
            }
          }
        } catch (e) {}

        setCurrentUser(parsed);
        fetchQuotaStatus(cleanEmail);
      } else {
        router.push("/signin");
      }
    };

    loadUser();

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wsj_user_sync");
      channel.onmessage = () => {
        loadUser();
      };
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "wsj_user" || e.key === "wsj_users_by_email") {
        loadUser();
      }
    };

    window.addEventListener("wsj_user_updated", loadUser);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("wsj_user_updated", loadUser);
      window.removeEventListener("storage", handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const getWriterSlug = () => {
    const name = currentUser?.full_name || currentUser?.name || (currentUser?.email ? currentUser.email.split("@")[0] : "writer");
    return slugifyAuthorName(name);
  };

  const getCreatePostUrl = (postId?: string) => {
    if (postId) {
      return `/author-workspace/create-post?id=${encodeURIComponent(postId)}`;
    }
    return `/author-workspace/create-post`;
  };

  useEffect(() => {
    if (currentUser) {
      const slug = getWriterSlug();
      if (typeof window !== "undefined") {
        const search = window.location.search || "";
        const expectedPath = `/writer-dashboard/${slug}`;
        if (window.location.pathname !== expectedPath && !window.location.pathname.includes('/create-post')) {
          window.history.replaceState(null, "", `${expectedPath}${search}`);
        }
      }
    }
  }, [currentUser]);

  const displayName = currentUser?.full_name || "";
  const displayEmail = currentUser?.email || "";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const writerEmailLower = (currentUser?.email || "").toLowerCase().trim();

  const writerOwnedPosts = posts.filter((p: any) => {
    if (!writerEmailLower) return true;
    const pEmail = (p.authorEmail || "").toLowerCase().trim();
    const pAuthor = (p.author || "").toLowerCase().trim();

    // 1. Direct email match (Primary)
    if (pEmail) {
      return pEmail === writerEmailLower;
    }

    // 2. Author name match
    if (pAuthor) {
      const writerName = (currentUser?.full_name || currentUser?.name || "").toLowerCase().trim();
      if (writerName && (pAuthor === writerName || pAuthor.includes(writerName) || writerName.includes(pAuthor))) {
        return true;
      }
    }

    // 3. Fallbacks for default template writers or unassigned articles
    if (writerEmailLower === "writer1@gmail.com") {
      return pAuthor === "writer1" || !pAuthor;
    }
    if (writerEmailLower === "writer@gmail.com") {
      return pAuthor !== "writer1";
    }

    // Default: new writers only see their own authored posts (0 if brand new)
    return false;
  });

  const matchesTab = (postStatus: string, tab: string) => {
    const normPost = (postStatus || "").trim().toLowerCase();
    const normTab = (tab || "").trim().toLowerCase();
    if (normTab === "drafts" || normTab === "draft") {
      return normPost === "drafts" || normPost === "draft";
    }
    if (normTab === "pending review" || normTab === "pending") {
      return normPost === "pending review" || normPost === "pending";
    }
    return normPost === normTab;
  };

  const getTabCount = (tab: string) => {
    return writerOwnedPosts.filter((p) => matchesTab(p.status, tab)).length;
  };

  const filteredPosts = writerOwnedPosts
    .filter(
      (p) =>
        matchesTab(p.status, activeTab) &&
        (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a: any, b: any) => {
      const timeA = a.publishedAt || (a.id && !isNaN(Number(a.id)) ? Number(a.id) : 0);
      const timeB = b.publishedAt || (b.id && !isNaN(Number(b.id)) ? Number(b.id) : 0);
      return timeB - timeA;
    });

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-[#0f172a] font-sans flex flex-col justify-between">
      <div>
        {/* ================================================================= */}
        {/* TOP NAVBAR                                                        */}
        {/* ================================================================= */}
        {/* ================================================================= */}
        {/* TOP NAVBAR (Matching homepage white palette & category styles)   */}
        {/* ================================================================= */}
        <header className="bg-white border-b border-[#e2e8f0] h-auto min-h-[82px] px-3 sm:px-6 md:px-8 lg:px-[3.8cm] pt-4 pb-0 flex items-end justify-between sticky top-0 z-30 shadow-2xs">
          {/* Left Navigation: Back Arrow, Website Logo, WRITER PORTAL Badge */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 shrink-0 pb-3">
            <button
              onClick={() => router.push("/")}
              className="p-1 text-black hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center shrink-0"
              title="Go to Homepage"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            {/* Website Logo */}
            <Link href="/" className="flex items-center shrink min-w-0">
              <img
                src="/images/design-reference/Times Chicago.svg"
                alt="Times Chicago"
                className="h-7 sm:h-9 md:h-10 w-auto object-contain block"
              />
            </Link>

            <span className="hidden sm:inline-flex bg-[#eff6ff] text-[#2563eb] text-[9.5px] sm:text-[10.5px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider  shrink-0">
              WRITER PORTAL
            </span>
          </div>

          {/* Middle Section Navigation Tabs: Published, Drafts, Pending review, Rejected, Trash */}
          <div className="flex items-end space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar mx-2 sm:mx-4">
            {(["Published", "Drafts", "Pending review", "Rejected", "Trash"] as const).map((tab) => {
              const isActive = activeTab === tab;
              const count = getTabCount(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ fontFamily: "'Century Gothic', 'Publica Sans Light', 'Kumbh Sans', sans-serif" }}
                  className={`text-[13px] transition-colors relative cursor-pointer flex items-center space-x-1.5 whitespace-nowrap py-2.5 px-1.5 sm:px-2.5 ${
                    isActive
                      ? "font-bold text-[#94a3b8]"
                      : "font-normal text-[#111111] hover:text-[#94a3b8]"
                  }`}
                >
                  <span>{tab}</span>
                  {count > 0 && (
                    <span
                      className={`text-[11px] sm:text-xs font-bold ${
                        isActive ? "text-[#94a3b8]" : "text-[#111111]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-[2.5px] bg-[#94a3b8]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right User Badge */}
          <div className="relative shrink-0 pb-3" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-[#cbd5e1] rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-2xs"
            >
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={displayName}
                  className="w-7 h-7 rounded-lg object-cover shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-7 h-7 bg-[#ea580c] text-white rounded-lg flex items-center justify-center font-bold text-xs font-sans shadow-2xs shrink-0">
                  {avatarLetter}
                </div>
              )}
              <span className="font-bold text-[13px] text-[#0f172a] tracking-tight truncate max-w-[120px] sm:max-w-none">{displayName}</span>
              <svg
                className={`w-3.5 h-3.5 text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""}`}
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
                    href={getAuthorSlugForUser(currentUser)}
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>
                      {(quotaStatus?.is_contributor || (currentUser?.writer_type || "").toLowerCase() === "contributor")
                        ? "Contributor page"
                        : "Staff Writer"}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowPressIdModal(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.364a4.125 4.125 0 00-6.338 0 .375.375 0 00.287.636h5.764a.375.375 0 00.287-.636z" />
                    </svg>
                    <span>
                      {(quotaStatus?.is_contributor || (currentUser?.writer_type || "").toLowerCase() === "contributor")
                        ? "Contributor ID"
                        : "Staff ID"}
                    </span>
                  </button>
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
                      sessionStorage.clear();
                      localStorage.removeItem("wsj_user");
                      localStorage.removeItem("wsj_token");
                      localStorage.removeItem("wsj_admin_user");
                      localStorage.removeItem("wsj_writer_user");
                      localStorage.removeItem("wsj_reader_user");
                      localStorage.removeItem("wsj_session_active");
                      sessionStorage.setItem("wsj_logged_out", "true");
                      localStorage.setItem("wsj_logged_out", "true");
                      window.dispatchEvent(new Event("wsj_user_updated"));
                      window.dispatchEvent(new Event("wsj_logout"));
                      window.location.href = "/";
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
        <main className="w-full px-3 sm:px-6 md:px-8 lg:px-[3.8cm] mt-6 sm:mt-10 pt-4 sm:pt-6 pb-8 flex-1">
          {/* Sub-Header Row: Exchanged Search Bar (Left) and Create New Post (Right) */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
            <h1
              className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight leading-none "
              style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 900, letterSpacing: '-0.03em' }}
            >
              {activeTab} Posts
            </h1>

            <div className="flex items-center space-x-3 shrink-0 ml-auto">
              {/* 1. Search Bar (Now first / left position) */}
              <div className="flex items-center space-x-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-full px-3.5 py-2 w-48 sm:w-60 text-xs text-gray-700 focus-within:border-[#2563eb] focus-within:bg-white transition-all shadow-2xs">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs text-gray-700 placeholder-gray-400 font-sans"
                />
              </div>

              {/* 2. Create New Post Button (Now second / right position) */}
              <button
                onClick={() => router.push(getCreatePostUrl())}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-[13px] px-4 py-2 rounded-full flex items-center space-x-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
              >
                <span className="text-sm font-bold">+</span>
                <span>Create New Post</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Layout for Contributor (Compressed Table on Left, Countdown on Right) OR Full Table for Staff Writer */}
          {quotaStatus?.is_contributor ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Compressed Table */}
              <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xs py-3 sm:py-4 flex flex-col relative overflow-hidden">
                {filteredPosts.length > 0 ? (
                  <div className="w-full max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left font-sans border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr
                          style={{ fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                          className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] text-[8.5px] xs:text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider"
                        >
                          <th className="py-2.5 pl-3 sm:pl-6 pr-2 font-bold">POST TITLE & SUMMARY</th>
                          <th className="py-2.5 px-2 sm:px-3 font-bold whitespace-nowrap">CATEGORY</th>
                          <th className="py-2.5 px-2 sm:px-3 font-bold whitespace-nowrap hidden sm:table-cell">DATE</th>
                          <th className="py-2.5 px-2 sm:px-3 font-bold text-center whitespace-nowrap">STATUS</th>
                          <th className="py-2.5 pl-2 pr-3 sm:pr-6 font-bold text-right whitespace-nowrap">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {filteredPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* POST TITLE & SUMMARY */}
                            <td className="py-2.5 sm:py-3 pl-3 sm:pl-6 pr-2 text-left">
                              <div className="max-w-[160px] xs:max-w-[220px] sm:max-w-[320px]">
                                <div className="font-bold text-xs sm:text-[13px] text-[#0f172a] font-sans leading-tight line-clamp-2">
                                  {post.title}
                                </div>
                                {post.subheadline && (
                                  <div className="hidden xs:block text-[10.5px] sm:text-[11px] text-[#475569] font-sans mt-0.5 leading-snug line-clamp-1">
                                    {post.subheadline}
                                  </div>
                                )}
                                <div className="text-[8.5px] sm:text-[9px] font-mono text-[#94a3b8] mt-0.5 font-normal lowercase">
                                  {post.readDuration ? post.readDuration.toLowerCase() : "5 min read"}
                                </div>
                              </div>
                            </td>

                            {/* CATEGORY */}
                            <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-[10px] sm:text-[11.5px] font-bold text-[#0f172a] whitespace-nowrap">
                              {post.category}
                            </td>

                            {/* DATE */}
                            <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-[9.5px] sm:text-[11px] text-[#64748b] font-mono whitespace-nowrap hidden sm:table-cell">
                              {post.date}
                            </td>

                            {/* STATUS */}
                            <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-center whitespace-nowrap">
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
                            <td className="py-2.5 sm:py-3 pl-2 pr-3 sm:pr-6 text-right whitespace-nowrap">
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
                                    onClick={(e) => confirmDeletePermanently(post, e)}
                                    className="text-[#0f172a] hover:text-red-600 transition-colors cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-end space-x-2 sm:space-x-3 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => router.push(getEditPostUrl(post, currentUser))}
                                    className="text-[#2563eb] hover:text-[#1d4ed8] font-bold text-[10.5px] sm:text-[11.5px] font-sans transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleMoveToTrash(post.id, e)}
                                    className="text-gray-400 hover:text-red-600 active:text-red-700 transition-colors cursor-pointer p-1.5 rounded-md hover:bg-red-50 active:bg-red-100"
                                    aria-label="Move to Trash"
                                  >
                                    <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                  <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                      <div className="absolute top-2 left-4 w-5 h-5 bg-[#1e293b] rounded-lg transform -rotate-12 shadow-2xs" />
                      <div className="absolute bottom-2 right-4 w-4 h-4 bg-[#10b981] rounded-full shadow-2xs" />
                      <div className="absolute bottom-1 left-6 w-10 h-5 bg-[#f59e0b] rounded-b-full transform -rotate-6" />
                      <div className="relative z-10 w-10 h-10 bg-[#2563eb] text-white rounded-xl shadow-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0f172a] font-sans tracking-tight">
                      Share what's on your mind
                    </h3>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                      Create or import posts to start publishing.
                    </p>
                    <button
                      onClick={() => router.push(getCreatePostUrl())}
                      className="text-[#2563eb] hover:text-[#1d4ed8] font-bold text-xs mt-3 flex items-center space-x-1 transition-colors cursor-pointer hover:underline"
                    >
                      <span className="text-base leading-none">+</span>
                      <span>Create Post</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Contributor Quota & Live Countdown Widget */}
              <div className="lg:col-span-4 flex flex-col space-y-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="bg-white border border-[#e2e8f0] shadow-2xs overflow-hidden">
                  
                  {/* Countdown Timer at the Top (Clean White/Ash Theme, No Header Above) */}
                  <div className="p-4 sm:p-5 border-b border-[#e2e8f0] bg-white">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-[#f8fafc] border border-[#e2e8f0] py-2 px-1">
                        <span className="text-base sm:text-lg font-bold text-[#0f172a] block leading-tight">
                          {String(countdown.days).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-[#64748b] font-semibold uppercase tracking-wider block mt-0.5">
                          Days
                        </span>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e8f0] py-2 px-1">
                        <span className="text-base sm:text-lg font-bold text-[#0f172a] block leading-tight">
                          {String(countdown.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-[#64748b] font-semibold uppercase tracking-wider block mt-0.5">
                          Hours
                        </span>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e8f0] py-2 px-1">
                        <span className="text-base sm:text-lg font-bold text-[#0f172a] block leading-tight">
                          {String(countdown.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-[#64748b] font-semibold uppercase tracking-wider block mt-0.5">
                          Mins
                        </span>
                      </div>
                      <div className="bg-[#f8fafc] border border-[#e2e8f0] py-2 px-1">
                        <span className="text-base sm:text-lg font-bold text-[#0f172a] block leading-tight">
                          {String(countdown.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-[#64748b] font-semibold uppercase tracking-wider block mt-0.5">
                          Secs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Details & Rules */}
                  <div className="p-4 sm:p-5 space-y-4 bg-white">
                    {/* 1. Weekly Progress */}
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[11px] text-[#0f172a] tracking-tight">WEEKLY REQUIREMENT</span>
                        <span className="font-mono font-bold text-[11px] text-[#1e293b]">
                          {Math.min(quotaStatus.weeklyTarget || 4, quotaStatus.weeklyPublished || 0)} / {quotaStatus.weeklyTarget || 4} Submitted
                        </span>
                      </div>
                      <div className="w-full bg-[#e2e8f0] h-2 overflow-hidden mb-2">
                        <div
                          className={`h-full transition-all duration-500 ${
                            (quotaStatus.weeklyPublished || 0) >= (quotaStatus.weeklyTarget || 4)
                              ? "bg-emerald-500"
                              : (quotaStatus.isWarningPeriod ? "bg-red-500" : "bg-blue-600")
                          }`}
                          style={{
                            width: `${Math.min(100, (((quotaStatus.weeklyPublished || 0) / (quotaStatus.weeklyTarget || 4)) * 100))}%`
                          }}
                        />
                      </div>
                      <div className="text-[11px]">
                        {(quotaStatus.weeklyRemaining || 0) > 0 ? (
                          <span className="text-red-600 font-semibold">{quotaStatus.weeklyRemaining} more article{(quotaStatus.weeklyRemaining || 0) > 1 ? 's' : ''} to submit</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">✓ Weekly requirement satisfied</span>
                        )}
                      </div>
                    </div>

                    {/* 2. Monthly Progress */}
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[11px] text-[#0f172a] tracking-tight">MONTHLY REQUIREMENT</span>
                        <span className="font-mono font-bold text-[11px] text-[#1e293b]">
                          {Math.min(quotaStatus.monthlyTarget || 16, quotaStatus.monthlyPublished || 0)} / {quotaStatus.monthlyTarget || 16} Submitted
                        </span>
                      </div>
                      <div className="w-full bg-[#e2e8f0] h-2 overflow-hidden mb-2">
                        <div
                          className={`h-full transition-all duration-500 ${
                            (quotaStatus.monthlyPublished || 0) >= (quotaStatus.monthlyTarget || 16)
                              ? "bg-emerald-500"
                              : "bg-indigo-600"
                          }`}
                          style={{
                            width: `${Math.min(100, (((quotaStatus.monthlyPublished || 0) / (quotaStatus.monthlyTarget || 16)) * 100))}%`
                          }}
                        />
                      </div>
                      <div className="text-[11px]">
                        {(quotaStatus.monthlyRemaining || 0) > 0 ? (
                          <span className="text-[#475569] font-medium">{quotaStatus.monthlyRemaining} more left this month</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">✓ Monthly quota fulfilled</span>
                        )}
                      </div>
                    </div>

                    {/* Warning Alert if Day 5+ */}
                    {quotaStatus.isWarningPeriod && (
                      <div className="bg-red-50 border border-red-200 p-3 flex items-start space-x-2 text-red-900">
                        <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-[11px] leading-tight">
                          <strong className="block font-bold text-red-900 mb-0.5">Urgent: {quotaStatus.weeklyRemaining} Article(s) Left ({quotaStatus.daysLeft || 1}d remaining)</strong>
                          Submit articles before cycle deadline to avoid automatic account suspension.
                        </div>
                      </div>
                    )}

                    {/* Bullet Points with Contributor Common Rules */}
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3.5 text-xs text-[#334155] space-y-2">
                      <div className="font-semibold text-[#0f172a] text-[11.5px] flex items-center gap-1.5 pb-1 border-b border-[#e2e8f0]">
                        <svg className="w-3.5 h-3.5 text-[#2563eb] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Contributor Policy & Requirements</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] leading-relaxed text-[#475569] list-disc list-inside">
                        <li>You must publish a minimum of <strong>4 articles per week</strong> (every 7 days).</li>
                        <li>You must publish a minimum of <strong>16 articles per month</strong> (every 30 days).</li>
                        <li>If you fail to meet these minimums, your account will be <strong>automatically suspended</strong> and login will be blocked.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Staff Writer View: Clean Full-Width Posts Table (No Quota Banner, No Countdown) */
            <div className="w-full bg-white border border-[#e2e8f0] rounded-2xl shadow-2xs py-3 sm:py-4 flex flex-col relative overflow-hidden">
              {filteredPosts.length > 0 ? (
                <div className="w-full max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left font-sans border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr
                        style={{ fontFamily: '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                        className="bg-[#f8fafc] border-t border-b border-[#e2e8f0] text-[8.5px] xs:text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider"
                      >
                        <th className="py-2.5 pl-3 sm:pl-8 pr-2 font-bold">POST TITLE & SUMMARY</th>
                        <th className="py-2.5 px-2 sm:px-4 font-bold whitespace-nowrap">CATEGORY</th>
                        <th className="py-2.5 px-2 sm:px-4 font-bold whitespace-nowrap hidden sm:table-cell">DATE</th>
                        <th className="py-2.5 px-2 sm:px-4 font-bold text-center whitespace-nowrap">STATUS</th>
                        <th className="py-2.5 pl-2 pr-3 sm:pr-8 font-bold text-right whitespace-nowrap">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* POST TITLE & SUMMARY */}
                          <td className="py-2.5 sm:py-3 pl-3 sm:pl-8 pr-2 text-left">
                            <div className="max-w-[180px] xs:max-w-[280px] sm:max-w-[440px]">
                              <div className="font-bold text-xs sm:text-[13px] text-[#0f172a] font-sans leading-tight line-clamp-2">
                                {post.title}
                              </div>
                              {post.subheadline && (
                                <div className="hidden xs:block text-[10.5px] sm:text-[11px] text-[#475569] font-sans mt-0.5 leading-snug line-clamp-1">
                                  {post.subheadline}
                                </div>
                              )}
                              <div className="text-[8.5px] sm:text-[9px] font-mono text-[#94a3b8] mt-0.5 font-normal lowercase">
                                {post.readDuration ? post.readDuration.toLowerCase() : "5 min read"}
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}
                          <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-[11.5px] font-bold text-[#0f172a] whitespace-nowrap">
                            {post.category}
                          </td>

                          {/* DATE */}
                          <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-[9.5px] sm:text-[11px] text-[#64748b] font-mono whitespace-nowrap hidden sm:table-cell">
                            {post.date}
                          </td>

                          {/* STATUS */}
                          <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
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
                          <td className="py-2.5 sm:py-3 pl-2 pr-3 sm:pr-8 text-right whitespace-nowrap">
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
                                  onClick={(e) => confirmDeletePermanently(post, e)}
                                  className="text-[#0f172a] hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-end space-x-2.5 sm:space-x-3 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => router.push(getEditPostUrl(post, currentUser))}
                                  className="text-[#2563eb] hover:text-[#1d4ed8] font-bold text-[10.5px] sm:text-[11.5px] font-sans transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleMoveToTrash(post.id, e)}
                                  className="text-gray-400 hover:text-red-600 active:text-red-700 transition-colors cursor-pointer p-1.5 rounded-md hover:bg-red-50 active:bg-red-100"
                                  aria-label="Move to Trash"
                                >
                                  <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <div className="absolute top-2 left-4 w-6 h-6 bg-[#1e293b] rounded-lg transform -rotate-12 shadow-2xs" />
                    <div className="absolute bottom-3 right-4 w-5 h-5 bg-[#10b981] rounded-full shadow-2xs" />
                    <div className="absolute bottom-1 left-7 w-12 h-6 bg-[#f59e0b] rounded-b-full transform -rotate-6" />
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
                    onClick={() => router.push(getCreatePostUrl())}
                    className="text-[#2563eb] hover:text-[#1d4ed8] font-bold text-xs sm:text-sm mt-4 flex items-center space-x-1 transition-colors cursor-pointer hover:underline"
                  >
                    <span className="text-base leading-none">+</span>
                    <span>Create Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* SUSPENDED CONTRIBUTOR OVERLAY MODAL */}
      {quotaStatus?.is_blocked && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center space-y-4 border border-red-100 font-sans animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="inline-block bg-red-100 text-red-800 text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full">
              ACCOUNT SUSPENDED
            </span>
            <h3 className="font-serif font-bold text-xl text-slate-900 leading-snug">
              Contributor Access Restricted
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {quotaStatus.block_reason || "Your Contributor account has been suspended because the mandatory publication quota was not met (minimum 4 articles per week or 16 per month)."}
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 text-left space-y-1">
              <div><strong>Account:</strong> {currentUser?.email}</div>
              <div><strong>Policy:</strong> Contributor Quota Enforcement (Weekly 4 / Monthly 16)</div>
              <div><strong>Status:</strong> Blocked — Cannot Sign In / Submit Posts</div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`mailto:worldnews@timeschicago.com?subject=Contributor%20Account%20Reactivation%20Request%20-%20${encodeURIComponent(currentUser?.email || '')}`}
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                Contact Administration via Email
              </a>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.clear();
                  localStorage.clear();
                  window.location.href = "/signin";
                }}
                className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <option value="Interviews">Interviews</option>
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

      {/* Render Press ID Card Modal */}
      <PressIdModal
        isOpen={showPressIdModal}
        onClose={() => setShowPressIdModal(false)}
        user={currentUser}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {deleteConfirmModal.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {deleteConfirmModal.message}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirmModal.onConfirm();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                {deleteConfirmModal.confirmText || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
