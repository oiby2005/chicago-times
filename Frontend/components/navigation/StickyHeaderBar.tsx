"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/layout/Container";
import Navbar, { getCategoryRoute } from "@/components/navigation/Navbar";
import SearchOverlay from "@/components/search/SearchOverlay";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";
import { getAuthorSlugForUser, getUserDashboardUrl, getAuthorBySlug } from "@/data/authors";
import { UserProfile } from "@/components/ui/ProfileSettingsModal";

export const StickyHeaderBar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isDashboardPage =
    pathname?.includes("/admin-dashboard") ||
    pathname?.includes("/writer-dashboard") ||
    pathname?.includes("/reader-dashboard");

  const loadUser = () => {
    if (typeof window === "undefined") return;
    const tabUser = sessionStorage.getItem("wsj_user");
    const sessionActive = sessionStorage.getItem("wsj_session_active");

    let parsed: any = null;
    if (tabUser && sessionActive === "true") {
      try { parsed = JSON.parse(tabUser); } catch (e) {}
    } else if (isDashboardPage) {
      const generalUser = localStorage.getItem("wsj_user");
      if (generalUser) {
        try { parsed = JSON.parse(generalUser); } catch (e) {}
      }
    }

    if (!parsed && pathname) {
      const match = pathname.match(/^\/(writer|admin|reader)\/([^/]+)/i);
      if (match) {
        const role = match[1].toLowerCase();
        const slug = match[2];
        const authorObj = getAuthorBySlug(slug);
        parsed = {
          id: authorObj?.id || slug,
          full_name: authorObj?.name || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
          email: authorObj?.email || `${slug}@gmail.com`,
          role: role,
          bio: authorObj?.bio || "",
          avatar_url: authorObj?.avatarUrl || "",
        };
      }
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
  }, [pathname, isDashboardPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside listener to close dropdown on desktop or mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
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
      setShowDropdown(false);
      window.dispatchEvent(new Event("wsj_user_updated"));
      window.dispatchEvent(new Event("wsj_logout"));
      window.location.href = "/";
    }
  };

  const isLoggedIn = currentUser !== null;
  const userRole = currentUser?.role?.toLowerCase() || "";
  const displayName = currentUser?.full_name || "";
  const displayEmail = currentUser?.email || "";
  let dashboardLabel = "Dashboard";
  let dashboardHref = "/";

  if (currentUser) {
    dashboardHref = getUserDashboardUrl(currentUser);
    if (userRole === "writer") dashboardLabel = "Writer Dashboard";
    else if (userRole === "reader") dashboardLabel = "Reader dashboard";
    else if (userRole === "admin") dashboardLabel = "Admin dashboard";
  }

  const renderDropdownMenu = () => (
    <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-24px)] bg-white border border-[#e2e8f0] shadow-2xl rounded-2xl p-4 z-[100] animate-in zoom-in-95 duration-100 font-sans text-left">
      {/* Top User Info Section matching non-scrolled header */}
      <div className="pb-3 border-b border-[#f1f5f9]">
        <div className="font-sans font-bold text-sm text-[#0f172a] truncate">
          {displayName}
        </div>
        <div className="font-mono text-[11px] text-[#64748b] font-normal mt-0.5 tracking-tight truncate">
          {displayEmail}
        </div>
        <div className="mt-2.5">
          <span className="bg-[#eff4f8] text-[#506175] font-sans text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
            {(userRole || "READER").toUpperCase()}
          </span>
        </div>
      </div>

      <div className="pt-2 space-y-1">
        <Link
          href={dashboardHref}
          onClick={() => setShowDropdown(false)}
          className="flex items-center space-x-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-[#1e293b] transition-colors cursor-pointer group"
        >
          <svg className="w-4 h-4 text-[#059669] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>{dashboardLabel}</span>
        </Link>

        {userRole === "writer" && (
          <Link
            href={getAuthorSlugForUser(currentUser)}
            onClick={() => setShowDropdown(false)}
            className="flex items-center space-x-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-[#1e293b] transition-colors cursor-pointer group"
          >
            <svg className="w-4 h-4 text-[#2563eb] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Writer Page</span>
          </Link>
        )}

        <div
          onClick={() => {
            setShowDropdown(false);
            window.dispatchEvent(new CustomEvent("wsj_open_profile_modal"));
          }}
          className="flex items-center space-x-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-[#1e293b] transition-colors cursor-pointer group"
        >
          <svg className="w-4 h-4 text-[#64748b] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span>Profile Settings</span>
        </div>

        <div
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-3 py-2.5 hover:bg-red-50 text-[#dc2626] rounded-xl text-xs font-bold transition-colors cursor-pointer group"
        >
          <svg className="w-4 h-4 text-[#dc2626] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
          </svg>
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );

  if (!isSticky) return null;

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    <div className="sticky top-0 z-40 w-full bg-white border-b border-[#d4d4d4] shadow-sm transition-all duration-200 select-none">
      <Container>
        {/* Top Header Row of Sticky Bar */}
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 border-b border-[#f0f0f0] relative px-2 sm:px-0">
          {/* Left Action Button: Newsletter */}
          <div className="hidden md:flex items-center z-10 shrink-0">
            <Link
              href="/newsletters"
              className="h-7 sm:h-8 bg-black hover:bg-gray-800 text-white font-sans text-[11px] sm:text-[12px] font-bold px-3 py-1 rounded-none tracking-tight transition-colors whitespace-nowrap flex items-center justify-center leading-none cursor-pointer"
              suppressHydrationWarning
            >
              Newsletter
            </Link>
          </div>

          {/* Centered Masthead Logo on desktop, left-aligned on mobile */}
          <div className="static md:absolute md:left-1/2 md:-translate-x-1/2 shrink-0 flex items-center justify-center">
            <Link href="/" className="inline-block py-1">
              <img
                src="/images/design-reference/Times Chicago.svg"
                alt="Times Chicago"
                className="h-7 sm:h-9 md:h-10 lg:h-11 w-auto object-contain block max-h-12"
              />
            </Link>
          </div>

          {/* Right Buttons: Small & Compact (Special Offer & Profile/Sign In) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 z-50 shrink-0 relative">

            <SpecialOfferPopover>
              <button
                className="h-6 sm:h-7 bg-[#007cb9] hover:bg-[#006996] text-white font-sans text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 rounded-none tracking-tight transition-colors whitespace-nowrap flex items-center justify-center leading-none cursor-pointer shadow-xs"
                suppressHydrationWarning
              >
                Special Offer
              </button>
            </SpecialOfferPopover>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#f3f4f6] hover:bg-[#e5e7eb] border-2 border-[#1e293b] rounded-full flex items-center justify-center relative p-0.5 transition-colors cursor-pointer shadow-xs shrink-0"
                  aria-label="User Profile"
                  title={currentUser?.full_name || "User Profile"}
                  suppressHydrationWarning
                >
                  {currentUser?.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser?.full_name || "User Profile"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <svg className="w-4 h-4 text-[#1e293b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00c853] border-2 border-white rounded-full" />
                </button>
                {showDropdown && renderDropdownMenu()}
              </div>
            ) : (
              <Link
                href="/signin"
                className="h-6 sm:h-7 bg-white hover:bg-gray-50 text-black border border-[#333333] hover:border-black font-sans text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 rounded-none tracking-tight transition-colors whitespace-nowrap flex items-center justify-center leading-none cursor-pointer"
                suppressHydrationWarning
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </Container>
      <Navbar />
    </div>
    </>
  );
};

export default StickyHeaderBar;
