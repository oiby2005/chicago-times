"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileSettingsModal, { UserProfile } from "@/components/ui/ProfileSettingsModal";

interface ProjectItem {
  id: string;
  title: string;
  subheadline?: string;
  excerpt: string;
  bodyContent?: string;
  readTime: string;
  category: string;
  subCategories?: string[];
  tags?: string[];
  isExclusive?: boolean;
  cardSummary?: string;
  focusKeyword?: string;
  seoDescription?: string;
  seoTitle?: string;
  author: string;
  submittedDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  thumbnail: string;
}

interface NewsletterSub {
  id: string;
  email: string;
  newsletters: string[];
  subscribedDate: string;
}

interface PublishedPostItem {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  placement?: string;
  author: string;
  views: number;
  comments: number;
  thumbnail: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "Overview"
    | "Newsletter"
    | "Published Posts"
    | "Users"
    | "Manage Ads"
    | "Contact Us Submissions"
    | "Advertise Leads"
    | "Database Backups"
  >("Overview");

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ProjectItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Pending Projects Data (Overview tab)
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // 2. Newsletter Subscribers Data (Newsletter tab)
  const [subscribers, setSubscribers] = useState<NewsletterSub[]>([
    {
      id: "sub_1",
      email: "akramyoonos54354@gmail.com",
      newsletters: ["US", "ECONOMY & MARKETS"],
      subscribedDate: "Aug 17, 2026",
    },
    {
      id: "sub_2",
      email: "circuitridergary@duck.com",
      newsletters: [
        "US",
        "WORLD",
        "POLITICS",
        "ECONOMY & MARKETS",
        "BUSINESS",
        "CRYPTO",
        "TECHNOLOGY",
        "TRAVEL",
        "OPINION",
        "CEO SPOTLIGHT",
        "SPORTS",
        "HEALTH",
      ],
      subscribedDate: "Aug 14, 2026",
    },
    {
      id: "sub_3",
      email: "monlinebrands@gmail.com",
      newsletters: ["US", "POLITICS", "SPORTS"],
      subscribedDate: "Aug 11, 2026",
    },
    {
      id: "sub_4",
      email: "akramyoonos1433@gmail.com",
      newsletters: ["US", "WORLD", "ECONOMY & MARKETS", "BUSINESS"],
      subscribedDate: "Aug 10, 2026",
    },
    {
      id: "sub_5",
      email: "odulio.dylan@gmail.com",
      newsletters: [
        "US",
        "WORLD",
        "POLITICS",
        "ECONOMY & MARKETS",
        "BUSINESS",
        "CRYPTO",
        "TECHNOLOGY",
        "TRAVEL",
        "OPINION",
        "CEO SPOTLIGHT",
        "SPORTS",
        "HEALTH",
      ],
      subscribedDate: "Aug 10, 2026",
    },
  ]);
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);

  // 3. Published Posts Data (Published Posts tab)
  const [publishedPosts, setPublishedPosts] = useState<PublishedPostItem[]>([]);

  // Filter state for Published Posts
  const [pubCategoryFilter, setPubCategoryFilter] = useState("All Categories");
  const [pubPlacementFilter, setPubPlacementFilter] = useState("All Placements");
  const [pubSearchQuery, setPubSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Load current user from storage & guard auth
  const loadUserData = () => {
    if (typeof window === "undefined") return;
    const storedAdmin = localStorage.getItem("wsj_admin_user");
    const storedUser = localStorage.getItem("wsj_user");
    let name = "Admin User";
    let email = "admin@gmail.com";
    let avatarUrl = "";
    let bio = "Senior System Administrator & Chief Editor";

    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        if (parsed) {
          if (parsed.full_name) name = parsed.full_name;
          if (parsed.email) email = parsed.email;
          if (parsed.avatar_url) avatarUrl = parsed.avatar_url;
          if (parsed.bio) bio = parsed.bio;
        }
      } catch (e) {}
    } else if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && (parsed.role === "ADMIN" || parsed.role === "admin")) {
          if (parsed.full_name) name = parsed.full_name;
          if (parsed.email) email = parsed.email;
          if (parsed.avatar_url) avatarUrl = parsed.avatar_url;
          if (parsed.bio) bio = parsed.bio;
        }
      } catch (e) {}
    }

    const adminUser = {
      full_name: name,
      email: email,
      role: "ADMIN",
      bio: bio,
      avatar_url: avatarUrl,
    };

    setCurrentUser(adminUser);
  };

  // Load newsletter subscribers from storage & listen for live updates
  const loadSubscribersData = () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("wsj_newsletter_subscribers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSubscribers(parsed);
          return;
        }
      } catch (e) {}
    }
    setSubscribers([]);
  };

  // Load submitted pending posts & published posts from storage & listen for live updates
  const loadPostsData = () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("wsj_posts");
    if (!stored) {
      setProjects([]);
      setPublishedPosts([]);
      return;
    }
    try {
      const parsedPosts = JSON.parse(stored);
      if (Array.isArray(parsedPosts)) {
        // Pending posts
        const pending = parsedPosts.filter(
          (p: any) =>
            p.status?.toLowerCase() === "pending review" ||
            p.status?.toLowerCase() === "pending"
        );

        if (pending.length > 0) {
          const mappedProjects: ProjectItem[] = pending.map((p: any) => {
            let thumb = p.thumbnail || p.coverImage;
            if (!thumb && p.bodyContent) {
              const match = p.bodyContent.match(/src=["']([^"']+)["']/);
              if (match) thumb = match[1];
            }
            if (!thumb) thumb = "/images/hero-ai-software.jpg";

            let excerpt = p.subheadline || p.excerpt;
            if (!excerpt && p.bodyContent) {
              excerpt =
                p.bodyContent.replace(/<[^>]+>/g, "").slice(0, 150) + "...";
            }

            return {
              id: p.id,
              title: p.title,
              subheadline: p.subheadline || "",
              excerpt: excerpt || "Submitted article pending editor review.",
              bodyContent: p.bodyContent || "",
              readTime: p.readDuration || p.readTime || "5 min read",
              category: (p.category || "BUSINESS").toUpperCase(),
              subCategories: p.subCategories || [],
              tags: p.tags || [],
              isExclusive: p.isExclusive,
              cardSummary: p.cardSummary || "",
              focusKeyword: p.focusKeyword || "",
              seoDescription: p.seoDescription || "",
              seoTitle: p.seoTitle || "",
              author: p.author || "Writer User",
              submittedDate: p.date || p.submittedDate || "Aug 18, 2026",
              status: "PENDING",
              thumbnail: thumb,
            };
          });

          setProjects(mappedProjects);
        } else {
          setProjects([]);
        }

        // Published posts
        const published = parsedPosts.filter(
          (p: any) =>
            p.status?.toLowerCase() === "published" ||
            p.status?.toLowerCase() === "approved"
        );
        if (published.length > 0) {
          const mappedPubs: PublishedPostItem[] = published.map((p: any) => ({
            id: p.id,
            title: p.title,
            excerpt:
              p.subheadline ||
              (p.bodyContent
                ? p.bodyContent.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
                : ""),
            readTime: p.readDuration || "5 min read",
            category: (p.category || "BUSINESS").toUpperCase(),
            placement: "Main Grid",
            author: p.author || "Writer User",
            views: p.views || 0,
            comments: 0,
            thumbnail: p.thumbnail || "/images/hero-ai-software.jpg",
          }));

          setPublishedPosts(mappedPubs);
        } else {
          setPublishedPosts([]);
        }
      }
    } catch (e) {
      console.error("Error parsing wsj_posts:", e);
    }
  };

  const generateArticleTextFile = (post: any): string => {
    const title = post.title?.trim() || "Untitled Article";
    const subheadline = post.subheadline?.trim() || post.subtitle?.trim() || post.excerpt?.trim() || "";
    const author = post.author?.trim() || "Unknown Author";
    const date = post.date?.trim() || "Aug 18, 2026";
    const category = post.category?.trim() || "General";
    const imageUrl = post.thumbnail?.trim() || post.imageUrl?.trim() || "";

    let rawBody = post.bodyContent || "";
    let plainContent = "";

    if (rawBody && typeof window !== "undefined") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = rawBody;

      const blockNodes = tempDiv.querySelectorAll("p, h1, h2, h3, h4, h5, h6, blockquote, pre, figure, div");
      if (blockNodes.length > 0) {
        const textBlocks: string[] = [];
        blockNodes.forEach((node) => {
          if (node.tagName === "FIGURE") {
            const creditSpan = node.querySelector("span:last-child");
            let credit = creditSpan?.textContent?.trim() || "";
            if (credit && !credit.startsWith("(PHOTO:")) {
              credit = `(PHOTO: ${credit})`;
            }
            if (credit) textBlocks.push(credit);
          }

          const text = node.textContent?.trim();
          if (text && !textBlocks.includes(text)) {
            textBlocks.push(text);
          }
        });
        plainContent = textBlocks.join("\n\n\n");
      } else {
        plainContent = tempDiv.textContent?.trim() || "";
      }
    } else if (rawBody) {
      plainContent = rawBody.replace(/<[^>]+>/g, "\n\n").trim();
    }

    let summary = post.summary?.trim() || post.excerpt?.trim() || "";
    if (!summary && plainContent) {
      summary = plainContent.slice(0, 240).trim() + (plainContent.length > 240 ? "…" : "");
    }

    const border70 = "======================================================================";
    const divider70 = "----------------------------------------------------------------------";

    return `${border70}
TITLE: ${title}
SUBTITLE: ${subheadline}
AUTHOR: ${author}
DATE: ${date}
CATEGORY: ${category}
IMAGE URL: ${imageUrl}
${border70}

SUMMARY:
${summary}

${divider70}
CONTENT:
${plainContent}
${divider70}
`;
  };

  const handleDownloadArticlesZip = async () => {
    let fullPosts: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wsj_posts");
        if (stored) {
          const parsed = JSON.parse(stored);
          fullPosts = parsed.filter((p: any) => p.status === "Published" || p.status === "APPROVED");
        }
      } catch (e) {}
    }

    if (fullPosts.length === 0 && publishedPosts.length > 0) {
      fullPosts = publishedPosts.map((p) => ({
        title: p.title,
        subheadline: p.excerpt,
        author: p.author,
        date: "Aug 18, 2026",
        category: p.category,
        thumbnail: p.thumbnail,
        bodyContent: `<p>${p.excerpt}</p>`,
      }));
    }

    if (fullPosts.length === 0) {
      alert("No published articles found to backup.");
      return;
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    fullPosts.forEach((post, index) => {
      const fileContent = generateArticleTextFile(post);
      const cleanTitle = (post.title || `Article_${index + 1}`)
        .replace(/[^a-zA-Z0-9\s_-]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 60);
      const filename = `${cleanTitle || `article_${index + 1}`}.txt`;
      zip.file(filename, fileContent);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const downloadUrl = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `wsj_published_articles_backup_${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        setActiveTab(tabParam as any);
      }
    }
    loadUserData();
    loadSubscribersData();
    loadPostsData();
    window.addEventListener("wsj_user_updated", loadUserData);
    window.addEventListener("wsj_newsletter_updated", loadSubscribersData);
    window.addEventListener("wsj_posts_updated", loadPostsData);
    return () => {
      window.removeEventListener("wsj_user_updated", loadUserData);
      window.removeEventListener(
        "wsj_newsletter_updated",
        loadSubscribersData
      );
      window.removeEventListener("wsj_posts_updated", loadPostsData);
    };
  }, [router]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("wsj_user");
    localStorage.removeItem("wsj_token");
    localStorage.removeItem("wsj_admin_user");
    sessionStorage.removeItem("wsj_session_active");
    window.dispatchEvent(new Event("wsj_user_updated"));
    router.push("/");
  };

  if (!currentUser) {
    return null;
  }

  // Derive admin initials & name
  const adminName = currentUser.full_name || "Admin User";
  const adminEmail = currentUser.email || "admin@gmail.com";

  const getInitials = (name: string) => {
    if (!name) return "AU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const adminInitials = getInitials(adminName);

  const pendingCount = projects.filter((p) => p.status === "PENDING").length;

  // Handlers for Newsletter Subscribers
  const handleRemoveSub = (id: string) => {
    setSubscribers((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wsj_newsletter_subscribers",
          JSON.stringify(updated)
        );
      }
      return updated;
    });
    setSelectedSubIds((prev) => prev.filter((i) => i !== id));
  };

  const handleToggleSelectAllSubs = () => {
    if (selectedSubIds.length === subscribers.length) {
      setSelectedSubIds([]);
    } else {
      setSelectedSubIds(subscribers.map((s) => s.id));
    }
  };

  const handleToggleSelectSub = (id: string) => {
    if (selectedSubIds.includes(id)) {
      setSelectedSubIds(selectedSubIds.filter((i) => i !== id));
    } else {
      setSelectedSubIds([...selectedSubIds, id]);
    }
  };

  const handleExportCSV = () => {
    const header = "id,email,newsletters,subscribedAt";
    const rows = subscribers.map((s) => {
      let datePart = s.subscribedDate;
      const parts = s.subscribedDate.replace(",", "").trim().split(/\s+/);
      if (parts.length === 3) {
        // e.g. ["Aug", "17", "2026"] -> "17-Aug,2026"
        datePart = `${parts[1]}-${parts[0]},${parts[2]}`;
      } else if (parts.length === 2 && parts[0].includes("-")) {
        // e.g. ["17-Aug", "2026"] -> "17-Aug,2026"
        datePart = `${parts[0]},${parts[1]}`;
      }
      return `${s.id},${s.email},"${s.newsletters.join("|")}",${datePart}`;
    });
    const csvText = [header, ...rows].join("\n");
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handlers for Published Posts
  const handleDeletePost = (id: string) => {
    setPublishedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPublishedPosts = publishedPosts.filter((post) => {
    const postCat = post.category ? post.category.toLowerCase().trim() : "";
    const filterCat = pubCategoryFilter.toLowerCase().trim();

    const matchesCategory =
      pubCategoryFilter === "All Categories" ||
      postCat === filterCat ||
      (filterCat === "u.s." && (postCat === "us" || postCat === "u.s.")) ||
      (filterCat === "us" && (postCat === "us" || postCat === "u.s.")) ||
      (filterCat === "tech" && (postCat === "technology" || postCat === "tech")) ||
      (filterCat === "technology" && (postCat === "technology" || postCat === "tech")) ||
      (filterCat === "markets & finance" && (postCat === "markets" || postCat === "markets & finance"));
    const matchesPlacement =
      pubPlacementFilter === "All Placements" ||
      (post.placement &&
        post.placement.toLowerCase() === pubPlacementFilter.toLowerCase());
    const matchesSearch =
      !pubSearchQuery.trim() ||
      post.title.toLowerCase().includes(pubSearchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(pubSearchQuery.toLowerCase());

    return matchesCategory && matchesPlacement && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row font-sans text-[#333333] relative">
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
        />
      )}

      {/* ================================================================= */}
      {/* LEFT SIDEBAR (Light, Elegant Neutral Grey Navigation Bar)          */}
      {/* ================================================================= */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 lg:z-20 w-64 lg:w-72 bg-[#4b5563] text-white flex flex-col justify-between shrink-0 h-screen shadow-lg transition-transform duration-200 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Top WSJ Logo / Masthead Header */}
          <div className="pt-6 pb-5 px-6 border-b border-[#6b7280]/60 text-center flex items-center justify-between lg:justify-center">
            <Link href="/admin-dashboard" className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/images/design-reference/Times Chicago.svg"
                alt="Times Chicago"
                className="h-6 sm:h-7 w-auto object-contain mx-auto brightness-0 invert block"
              />
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-[#e5e7eb] hover:text-white p-1"
              title="Close Menu"
            >
              ✕
            </button>
          </div>

          {/* Back to Home Navigation Item */}
          <div className="px-4 pt-5 pb-3">
            <Link
              href="/"
              className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-medium text-[#e5e7eb] hover:text-white hover:bg-[#6b7280]/60 rounded-xl transition-all cursor-pointer group"
            >
              <svg
                width={16}
                height={16}
                style={{ width: "16px", height: "16px", minWidth: "16px", minHeight: "16px" }}
                className="shrink-0 text-[#e5e7eb] group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Sidebar Menu Options (Lighter Grey Palette) */}
          <nav className="px-4 space-y-1.5 mt-1">
            {/* 1. Overview */}
            <button
              onClick={() => {
                setActiveTab("Overview");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Overview"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span>Overview</span>
            </button>

            {/* 2. Newsletter */}
            <button
              onClick={() => {
                setActiveTab("Newsletter");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Newsletter"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>Newsletter</span>
            </button>

            {/* 3. Published Posts */}
            <button
              onClick={() => {
                setActiveTab("Published Posts");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Published Posts"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Published Posts</span>
            </button>

            {/* 4. Users */}
            <button
              onClick={() => {
                setActiveTab("Users");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Users"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <span>Users</span>
            </button>

            {/* 5. Manage Ads */}
            <button
              onClick={() => {
                setActiveTab("Manage Ads");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Manage Ads"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.38-.09-2.07-.09-1.99 0-3.95.23-5.85.67V6.75c1.9-.44 3.86-.67 5.85-.67 1.99 0 3.95.23 5.85.67v8.94c-1.25-.29-2.54-.47-3.84-.53zM10.34 15.84v4.91m0 0a2.25 2.25 0 002.25-2.25v-2.66" />
              </svg>
              <span>Manage Ads</span>
            </button>

            {/* 6. Contact Us Submissions */}
            <button
              onClick={() => {
                setActiveTab("Contact Us Submissions");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Contact Us Submissions"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h9m-9 3.75h5.25M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span>Contact Us Submissions</span>
            </button>

            {/* 7. Advertise Leads */}
            <button
              onClick={() => {
                setActiveTab("Advertise Leads");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Advertise Leads"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v9.75a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
              </svg>
              <span>Advertise Leads</span>
            </button>

            {/* 8. Database Backups */}
            <button
              onClick={() => {
                setActiveTab("Database Backups");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "Database Backups"
                  ? "bg-[#6b7280] text-white border border-[#9ca3af]/40 shadow-sm"
                  : "text-[#e5e7eb] hover:bg-[#6b7280]/40 hover:text-white"
              }`}
            >
              <svg
                width={18}
                height={18}
                style={{ width: "18px", height: "18px", minWidth: "18px", minHeight: "18px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <span>Database Backups</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Copyright */}
        <div className="p-4 border-t border-[#6b7280]/60 text-[10px] text-[#e5e7eb] text-center font-mono">
          © 2026 Dow Jones & Company, Inc.
        </div>
      </aside>

      {/* ================================================================= */}
      {/* RIGHT MAIN WORKSPACE CONTENT AREA                                 */}
      {/* ================================================================= */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-10 max-w-7xl w-full min-w-0 overflow-y-auto">
        {/* Top Workspace Header Bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-2 gap-3">
          {/* Left Title & Welcome Subtitle */}
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-[#4b5563] hover:text-black hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200 shrink-0"
              title="Toggle Sidebar Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#374151] tracking-tight leading-none">
                My Workspace
              </h1>
              <p className="text-xs sm:text-sm text-[#6b7280] font-medium mt-1">
                Welcome back, {adminName}!
              </p>
            </div>
          </div>

          {/* Right Profile Icon Dropdown Card Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl sm:rounded-3xl px-3 py-1.5 transition-all cursor-pointer shadow-2xs"
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={adminName}
                  className="w-8 h-8 rounded-xl object-cover shadow-2xs shrink-0 border border-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                  {adminInitials}
                </div>
              )}
              <span className="font-bold text-sm text-[#0f172a] tracking-tight">
                {adminName}
              </span>
              <svg
                width={14}
                height={14}
                style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                className={`shrink-0 text-[#64748b] transition-transform duration-200 ${
                  showProfileDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>

            {/* Profile Dropdown Card matching uploaded design */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-50 animate-in zoom-in-95 duration-100 font-sans text-left">
                {/* User Info Header */}
                <div className="flex items-center space-x-3">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={adminName}
                      className="w-10 h-10 rounded-xl object-cover shadow-2xs shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-2xs">
                      {adminInitials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-base text-[#0f172a] truncate">
                      {adminName}
                    </div>
                    <div className="font-mono text-xs text-[#64748b] mt-0.5 tracking-tight truncate">
                      {adminEmail}
                    </div>
                    <div className="mt-1.5">
                      <span className="bg-[#f1f5f9] text-[#334155] font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-block">
                        ADMIN
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#f1f5f9] my-3" />

                {/* Profile Settings Option */}
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm font-semibold text-[#1e293b] transition-colors cursor-pointer text-left"
                >
                  <svg
                    width={18}
                    height={18}
                    className="shrink-0 text-[#64748b]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>Profile Settings</span>
                </button>

                <div className="border-t border-[#f1f5f9] my-2" />

                {/* Log Out Option */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-colors cursor-pointer text-left"
                >
                  <svg
                    width={18}
                    height={18}
                    className="shrink-0 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top 3 Stat Metric Cards (3 Horizontal Aligning Boxes matching reference site) */}
        <div className="grid grid-cols-3 gap-2 xs:gap-3.5 sm:gap-6 mb-5 sm:mb-6">
          {/* Card 1: ACTIVE REVIEWS (Purple accent line & container) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#e5e7eb] shadow-2xs relative overflow-hidden flex flex-col justify-between border-l-4 border-l-[#8b5cf6]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8.5px] xs:text-[10px] sm:text-[11px] font-bold text-[#6b7280] tracking-wider sm:tracking-widest uppercase font-mono truncate">
                ACTIVE REVIEWS
              </span>
              <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#f3e8ff] text-[#8b5cf6] flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#111827] leading-none">
                {pendingCount}
              </span>
            </div>
          </div>

          {/* Card 2: COMPLETED RELEASES (Teal/Green accent line & container) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#e5e7eb] shadow-2xs relative overflow-hidden flex flex-col justify-between border-l-4 border-l-[#10b981]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8.5px] xs:text-[10px] sm:text-[11px] font-bold text-[#6b7280] tracking-wider sm:tracking-widest uppercase font-mono truncate">
                COMPLETED RELEASES
              </span>
              <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#d1fae5] text-[#10b981] flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#111827] leading-none">
                {publishedPosts.length}
              </span>
            </div>
          </div>

          {/* Card 3: NEWSLETTER SUBS (Orange accent line & container) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#e5e7eb] shadow-2xs relative overflow-hidden flex flex-col justify-between border-l-4 border-l-[#ea580c]">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8.5px] xs:text-[10px] sm:text-[11px] font-bold text-[#6b7280] tracking-wider sm:tracking-widest uppercase font-mono truncate">
                NEWSLETTER SUBS
              </span>
              <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#ffedd5] text-[#ea580c] flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#111827] leading-none">
                {subscribers.length}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Section Content based on Active Tab */}
        {activeTab === "Overview" ? (
          /* ============================================================= */
          /* MAIN SECTION: Recent Projects (Pending Review)               */
          /* ============================================================= */
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#e5e7eb] shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-1">
              <h2 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight">
                Recent Projects (Pending Review)
              </h2>
              <span className="bg-[#f3f4f6] text-[#4b5563] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#d1d5db] font-mono">
                Pending Count: {pendingCount}
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-sans border-t border-[#f3f4f6]">
                <svg
                  className="w-10 h-10 text-gray-300 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p className="text-xs font-bold text-[#374151]">No pending articles found</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5">
                  Articles submitted by writers for review will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] text-[9.5px] font-mono font-bold text-[#9ca3af] uppercase tracking-wider">
                        <th className="pb-2.5 pr-4 font-bold min-w-[260px] sm:min-w-[300px]">ARTICLE DETAILS</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">CATEGORY</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">AUTHOR</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">SUBMITTED DATE</th>
                        <th className="pb-2.5 px-3 font-bold whitespace-nowrap">STATUS</th>
                        <th className="pb-2.5 pl-3 text-right whitespace-nowrap">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {projects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-[#f9fafb] transition-colors">
                          <td className="py-2.5 sm:py-3 pr-4 text-left">
                            <div className="flex items-center space-x-3 max-w-lg">
                              <img
                                src={proj.thumbnail}
                                alt={proj.title}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-[#e5e7eb] shadow-2xs"
                              />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-xs sm:text-[13px] text-[#111827] leading-snug line-clamp-1">
                                  {proj.title}
                                </h3>
                                <p className="text-[11px] text-[#6b7280] mt-0.5 line-clamp-1 leading-snug">
                                  {proj.excerpt}
                                </p>
                                <span className="inline-block text-[10px] font-mono text-[#9ca3af] mt-0.5 font-normal">
                                  {proj.readTime}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 whitespace-nowrap">
                            <span className="bg-[#f3f4f6] text-[#4b5563] border border-[#d1d5db] text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                              {proj.category}
                            </span>
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 text-xs font-semibold text-[#374151] whitespace-nowrap">
                            {proj.author}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 text-xs font-mono text-[#6b7280] whitespace-nowrap">
                            {proj.submittedDate}
                          </td>
                          <td className="py-2.5 sm:py-3 px-3 whitespace-nowrap">
                            <span className="bg-[#f3f4f6] text-[#4b5563] border border-[#d1d5db] text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                              {proj.status}
                            </span>
                          </td>
                          <td className="py-2.5 sm:py-3 pl-3 text-right whitespace-nowrap">
                            <button
                              onClick={() =>
                                router.push(`/admin-dashboard/review-post?id=${proj.id}`)
                              }
                              className="bg-[#4b5563] hover:bg-[#374151] text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-md transition-all cursor-pointer shadow-2xs"
                            >
                              OPEN
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        ) : activeTab === "Newsletter" ? (
          /* ============================================================= */
          /* NEWSLETTER SUBSCRIBERS VIEW                                   */
          /* ============================================================= */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#f3f4f6]">
              <div>
                <h2 className="text-xl font-bold text-[#374151] tracking-tight">
                  Newsletter Subscribers
                </h2>
                <p className="text-xs text-[#6b7280] font-mono mt-1">
                  Emails collected from the Newsletter signup page.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-2 bg-white hover:bg-[#f3f4f6] border border-[#6b7280] text-[#374151] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <svg
                    width={14}
                    height={14}
                    style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                    className="shrink-0 text-[#374151]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>EXPORT CSV</span>
                </button>
                <span className="bg-[#f3f4f6] text-[#4b5563] text-xs font-semibold px-3 py-2 rounded-xl border border-[#d1d5db] font-mono">
                  Total: {subscribers.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left font-sans border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider">
                    <th className="py-3 px-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedSubIds.length === subscribers.length && subscribers.length > 0}
                        onChange={handleToggleSelectAllSubs}
                        className="rounded-md border-gray-400 text-gray-700 focus:ring-gray-700 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 font-bold min-w-[200px]">EMAIL</th>
                    <th className="py-3 px-4 font-bold min-w-[240px] sm:min-w-[280px]">NEWSLETTERS</th>
                    <th className="py-3 px-4 font-bold whitespace-nowrap">SUBSCRIBED</th>
                    <th className="py-3 pl-4 pr-3 font-bold text-right whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="py-4 px-3">
                        <input
                          type="checkbox"
                          checked={selectedSubIds.includes(sub.id)}
                          onChange={() => handleToggleSelectSub(sub.id)}
                          className="rounded-md border-gray-400 text-gray-700 focus:ring-gray-700 cursor-pointer"
                        />
                      </td>

                      <td className="py-4 px-4 font-bold text-xs sm:text-sm text-[#374151]">
                        <div className="flex items-center space-x-2.5">
                          <svg
                            width={16}
                            height={16}
                            style={{ width: "16px", height: "16px", minWidth: "16px", minHeight: "16px" }}
                            className="shrink-0 text-[#6b7280]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          <span>{sub.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xl">
                          {sub.newsletters.map((tag) => (
                            <span
                              key={tag}
                              className="bg-[#f3f4f6] text-[#374151] text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#d1d5db] inline-block"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-[#6b7280] whitespace-nowrap">
                        {sub.subscribedDate}
                      </td>

                      <td className="py-4 pl-4 pr-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveSub(sub.id)}
                          className="inline-flex items-center space-x-1 border border-[#6b7280] bg-white hover:bg-[#f3f4f6] text-[#374151] font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                        >
                          <svg
                            width={13}
                            height={13}
                            style={{ width: "13px", height: "13px", minWidth: "13px", minHeight: "13px" }}
                            className="shrink-0 text-[#374151]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          <span>REMOVE</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "Published Posts" ? (
          /* ============================================================= */
          /* PUBLISHED POSTS VIEW                                          */
          /* ============================================================= */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e7eb] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#f3f4f6]">
              <div>
                <h2 className="text-xl font-bold text-[#374151] tracking-tight">
                  Published Posts
                </h2>
                <p className="text-xs text-[#6b7280] font-sans mt-1 max-w-2xl leading-relaxed">
                  This panel grants the Chief Editor absolute authority to inspect engagement metrics and permanently delete/de-list articles from the database.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={handleDownloadArticlesZip}
                  className="flex items-center space-x-2 bg-white hover:bg-[#f3f4f6] border border-[#6b7280] text-[#374151] font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <svg
                    width={14}
                    height={14}
                    style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                    className="shrink-0 text-[#374151]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>BACKUP ARTICLES (ZIP)</span>
                </button>
                <span className="bg-[#f3f4f6] text-[#4b5563] text-xs font-mono font-semibold px-3 py-2 rounded-xl border border-[#d1d5db]">
                  Live items: {filteredPublishedPosts.length} / {publishedPosts.length}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#d1d5db] rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                    FILTER BY CATEGORY
                  </label>
                  <select
                    value={pubCategoryFilter}
                    onChange={(e) => setPubCategoryFilter(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] text-xs text-[#374151] rounded-xl px-3 py-2.5 outline-none focus:border-[#374151] transition-all font-sans cursor-pointer"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="World">World</option>
                    <option value="Business">Business</option>
                    <option value="U.S.">U.S.</option>
                    <option value="Politics">Politics</option>
                    <option value="Economy">Economy</option>
                    <option value="Tech">Tech</option>
                    <option value="Markets & Finance">Markets & Finance</option>
                    <option value="Opinion">Opinion</option>
                    <option value="Free Expression">Free Expression</option>
                    <option value="Arts">Arts</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Personal Finance">Personal Finance</option>
                    <option value="Health">Health</option>
                    <option value="Style">Style</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                    FILTER BY PLACEMENT
                  </label>
                  <select
                    value={pubPlacementFilter}
                    onChange={(e) => setPubPlacementFilter(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] text-xs text-[#374151] rounded-xl px-3 py-2.5 outline-none focus:border-[#374151] transition-all font-sans cursor-pointer"
                  >
                    <option value="All Placements">All Placements</option>
                    <option value="Main Grid">Main Grid</option>
                    <option value="Top Lead">Top Lead</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Tech News">Tech News</option>
                    <option value="World News">World News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider mb-1.5">
                    SEARCH ARTICLES
                  </label>
                  <input
                    type="text"
                    placeholder="Search title, author..."
                    value={pubSearchQuery}
                    onChange={(e) => setPubSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] text-xs text-[#374151] rounded-xl px-3 py-2.5 outline-none focus:border-[#374151] transition-all font-sans placeholder:text-[#9ca3af]"
                  />
                </div>

                <div className="flex justify-end pb-1.5">
                  <button
                    onClick={() => {
                      setPubCategoryFilter("All Categories");
                      setPubPlacementFilter("All Placements");
                      setPubSearchQuery("");
                    }}
                    className="text-xs font-bold text-[#374151] hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {filteredPublishedPosts.length === 0 ? (
              <div className="py-16 text-center text-gray-500 font-sans border-t border-[#f3f4f6]">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p className="text-sm font-bold text-[#374151]">No published articles found</p>
                <p className="text-xs text-[#6b7280] mt-1">
                  Articles approved and published from the review queue will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider">
                        <th className="pb-3 pr-4 font-bold min-w-[280px] sm:min-w-[320px]">ARTICLE DETAILS</th>
                        <th className="pb-3 px-4 font-bold whitespace-nowrap">CATEGORY</th>
                        <th className="pb-3 px-4 font-bold whitespace-nowrap">AUTHOR</th>
                        <th className="pb-3 px-4 font-bold whitespace-nowrap">METRICS DESK</th>
                        <th className="pb-3 pl-4 pr-2 font-bold text-right whitespace-nowrap">DELETE GATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {filteredPublishedPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-[#f9fafb] transition-colors">
                          <td className="py-5 pr-4 text-left">
                            <div className="flex items-start space-x-4 max-w-lg">
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-[#e5e7eb] shadow-2xs"
                              />
                              <div>
                                <h3 className="font-bold text-xs sm:text-sm text-[#374151] leading-snug">
                                  {post.title}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-[#6b7280] mt-1 line-clamp-2 leading-relaxed">
                                  {post.excerpt}
                                </p>
                                <span className="inline-block text-[10px] font-mono text-[#9ca3af] mt-1 font-normal">
                                  {post.readTime}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-5 px-4 whitespace-nowrap">
                            <span className="bg-[#f3f4f6] text-[#374151] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#d1d5db] inline-block">
                              {post.category}
                            </span>
                          </td>

                          <td className="py-5 px-4 text-xs font-semibold text-[#4b5563] whitespace-nowrap">
                            {post.author}
                          </td>

                          <td className="py-5 px-4 text-xs font-mono text-[#4b5563] font-semibold whitespace-nowrap">
                            {post.views} Views • {post.comments} Comments
                          </td>

                          <td className="py-5 pl-4 pr-2 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end space-x-2">
                              <button
                                onClick={() => router.push(`/admin-dashboard/edit-post?id=${post.id}`)}
                                className="w-8 h-8 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] border border-[#d1d5db] flex items-center justify-center transition-colors cursor-pointer"
                                title="Edit Article"
                              >
                                <svg
                                  width={14}
                                  height={14}
                                  style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                                  className="shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                              </button>

                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="w-8 h-8 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] border border-[#d1d5db] flex items-center justify-center transition-colors cursor-pointer"
                                title="Permanently Delete Article"
                              >
                                <svg
                                  width={14}
                                  height={14}
                                  style={{ width: "14px", height: "14px", minWidth: "14px", minHeight: "14px" }}
                                  className="shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#f3f4f6] text-xs">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-white border border-[#6b7280] text-[#374151] rounded-xl font-medium hover:bg-[#f3f4f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ‹ Previous
                  </button>

                  <span className="font-mono text-[#6b7280] font-medium">
                    Page {currentPage} of 10
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
                    className="px-4 py-2 bg-white border border-[#6b7280] text-[#374151] rounded-xl font-medium hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                  >
                    Next ›
                  </button>
                </div>
              </>
            )}
        </div>
        ) : activeTab === "Database Backups" ? (
          <div className="bg-white rounded-3xl p-8 border border-[#e5e7eb] shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-5">
              <div>
                <h2 className="text-xl font-bold text-[#374151]">Database Backups & Export</h2>
                <p className="text-xs text-[#6b7280] mt-1">
                  Export all published articles into standardized text formatted archive files (.zip).
                </p>
              </div>
              <button
                onClick={handleDownloadArticlesZip}
                className="flex items-center space-x-2 bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>BACKUP ARTICLES (ZIP)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-2xl">
                <span className="text-[10px] font-mono font-bold text-[#94a3b8] uppercase">Published Articles</span>
                <p className="text-2xl font-bold text-[#0f172a] mt-1">{publishedPosts.length}</p>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-2xl">
                <span className="text-[10px] font-mono font-bold text-[#94a3b8] uppercase">Export Format</span>
                <p className="text-sm font-bold text-[#0f172a] mt-1">ZIP / Plain Text (.txt)</p>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4 rounded-2xl">
                <span className="text-[10px] font-mono font-bold text-[#94a3b8] uppercase">Metadata Included</span>
                <p className="text-xs font-bold text-[#0f172a] mt-1">Title, Subtitle, Author, Date, Category, Image URL, Summary, Body</p>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder View for Other Sidebar Tabs */
          <div className="bg-white rounded-3xl p-8 border border-[#e5e7eb] shadow-2xs min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb] rounded-2xl flex items-center justify-center mb-4">
              <svg
                width={32}
                height={32}
                style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }}
                className="shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#374151]">{activeTab} Management</h2>
            <p className="text-xs text-[#6b7280] mt-1 max-w-md">
              Manage all {activeTab.toLowerCase()} settings and records from your administrator portal.
            </p>
            <button
              onClick={() => setActiveTab("Overview")}
              className="mt-5 text-xs font-bold text-[#374151] hover:underline"
            >
              ← Return to Workspace Overview
            </button>
          </div>
        )}
      </main>

      {/* Render Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSave={(updated) => {
          setCurrentUser(updated);
          if (typeof window !== "undefined") {
            localStorage.setItem("wsj_admin_user", JSON.stringify(updated));
            window.dispatchEvent(new Event("wsj_user_updated"));
          }
        }}
      />
    </div>
  );
}
