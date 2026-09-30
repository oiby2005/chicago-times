"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ShareCardModal from "@/components/article/ShareCardModal";
import ArticleAudioReader from "@/components/article/ArticleAudioReader";
import BookmarkButton from "@/components/article/BookmarkButton";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";
import SidebarDrawer from "@/components/navigation/SidebarDrawer";
import { getUserDashboardUrl } from "@/data/authors";
import { UserProfile } from "@/components/ui/ProfileSettingsModal";

const MENU_CATEGORIES = [
  {
    name: "News",
    route: "/news",
    subs: ["World", "US Politics", "Economy", "Law"],
  },
  {
    name: "Business",
    route: "/business",
    subs: ["Markets & Finance", "Industries", "Real Estate", "Personal Finance"],
  },
  {
    name: "Tech",
    route: "/tech",
    subs: ["AI & Software", "Cybersecurity", "Personal Tech"],
  },
  {
    name: "Opinion",
    route: "/opinion",
    subs: ["Editorials", "Commentary", "Letters to the Editor"],
  },
  {
    name: "Arts & Life",
    route: "/lifestyle",
    subs: ["Entertainment", "Arts", "Sports", "Fashion", "Health", "Science"],
  },
];

interface ArticleToolbarProps {
  articleTitle?: string;
  articleUrl?: string;
  deck?: string;
  bodyContent?: string;
  commentCount?: number;
  onFontSizeChange?: (size: "sm" | "md" | "lg") => void;
  currentFontSize?: "sm" | "md" | "lg";
  article?: any;
}

export default function ArticleToolbar({
  articleTitle = "Article",
  articleUrl,
  deck = "",
  bodyContent = "",
  commentCount = 291,
  onFontSizeChange,
  currentFontSize = "md",
  article,
}: ArticleToolbarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadUser = () => {
    if (typeof window === "undefined") return;
    const tabUser = sessionStorage.getItem("wsj_user");
    const sessionActive = sessionStorage.getItem("wsj_session_active");

    let parsed: any = null;
    if (tabUser && sessionActive === "true") {
      try {
        parsed = JSON.parse(tabUser);
      } catch (e) {}
    }

    if (parsed) {
      setCurrentUser(parsed);
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("wsj_user_updated", loadUser);
    return () => window.removeEventListener("wsj_user_updated", loadUser);
  }, []);

  // Click outside for user profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.removeItem("wsj_user");
      localStorage.removeItem("wsj_token");
      localStorage.removeItem("wsj_admin_user");
      localStorage.removeItem("wsj_session_active");
      setCurrentUser(null);
      setShowUserDropdown(false);
      window.dispatchEvent(new Event("wsj_user_updated"));
      window.dispatchEvent(new Event("wsj_logout"));
      window.location.href = "/";
    }
  };

  const articleData = article || {
    title: articleTitle,
    slug: articleUrl || "",
    deck: deck,
  };

  if (!isSticky) return null;

  return (
    <>
      {/* Sticky Article Navbar - Increased Height (h-16 sm:h-20 ~ 64px to 80px tall) */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-[#CCCCCC] shadow-sm transition-all duration-200 select-none">
        <Container>
          <div className="h-16 sm:h-20 flex items-center justify-between w-full">
            
            {/* Left Section: Toggle Bar Button (☰) + Original Times Chicago Logo + Article Title */}
            <div className="flex items-center space-x-3 sm:space-x-4 overflow-hidden mr-4">
              
              {/* Toggle Bar Button (☰) */}
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#cbd5e1] text-[#111111] transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="Toggle Categories & Sections Menu"
                aria-label="Toggle Categories & Sections Menu"
              >
                <svg className="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {/* Original Times Chicago SVG Logo */}
              <Link href="/" className="inline-block shrink-0 py-1 hover:opacity-85 transition-opacity">
                <img
                  src="/images/design-reference/Times Chicago.svg"
                  alt="Times Chicago"
                  className="h-8 sm:h-10 md:h-11 w-auto object-contain block max-h-12"
                />
              </Link>

              <div className="h-6 w-[1px] bg-[#CCCCCC] shrink-0 hidden lg:block ml-1 mr-1" />

              {/* Article Headline Title */}
              <span className="font-serif text-[14px] sm:text-[15px] font-bold text-[#222222] truncate hidden lg:block max-w-sm xl:max-w-xl leading-snug">
                {articleTitle}
              </span>
            </div>

            {/* Right Section: Share + Bookmark | Listen (1 min) aligned to right edge of container */}
            <div className="flex items-center space-x-3 text-xs text-[#333333] shrink-0 font-sans">
              
              {/* Share Icon Box */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsShareOpen(!isShareOpen)}
                  className="inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg border border-[#cbd5e1] bg-white hover:bg-slate-100 text-[#334155] transition-colors cursor-pointer shadow-2xs"
                  title="Share Article"
                  aria-label="Share Article"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 19c2.5-2.5 6-4.5 11-4.5v4.5l8-8.5L15 2v4.5C8.5 6.5 4.5 11 4 19z" />
                  </svg>
                </button>
                <ShareCardModal
                  isOpen={isShareOpen}
                  onClose={() => setIsShareOpen(false)}
                  title={articleTitle}
                  url={articleUrl}
                />
              </div>

              {/* Bookmark Box */}
              <BookmarkButton article={articleData} variant="inline" />

              {/* Vertical Divider | + Listen (Google Auto Reader with Bookmark Color) */}
              <ArticleAudioReader title={articleTitle} deck={deck} bodyContent={bodyContent} />
            </div>
          </div>
        </Container>
      </div>

      {/* Vertical Side Drawer (Matching Image 1) */}
      <SidebarDrawer
        isOpen={isCategoryMenuOpen}
        onClose={() => setIsCategoryMenuOpen(false)}
        currentUser={currentUser}
      />
    </>
  );
}
