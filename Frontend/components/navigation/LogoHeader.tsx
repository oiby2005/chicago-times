"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import WSJLogo from "@/components/ui/WSJLogo";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";
import ProfileSettingsModal, { UserProfile } from "@/components/ui/ProfileSettingsModal";
import MobileNavDrawer from "@/components/navigation/MobileNavDrawer";
import SearchOverlay from "@/components/search/SearchOverlay";

export const LogoHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const isAdminDashboard = pathname?.includes("/admin-dashboard");
  const isWriterDashboard = pathname?.includes("/writer-dashboard");
  const isReaderDashboard = pathname?.includes("/reader-dashboard");
  const isDashboardPage = isAdminDashboard || isWriterDashboard || isReaderDashboard;

  // Hide Special Offer button on Admin Dashboard & Writer Dashboard
  const hideSpecialOffer = isAdminDashboard || isWriterDashboard;

  const loadUserFromStorage = () => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("wsj_user") || localStorage.getItem("wsj_user");
    const sessionActive = sessionStorage.getItem("wsj_session_active");

    let parsed: any = null;
    if (stored) {
      try { parsed = JSON.parse(stored); } catch (e) {}
    }

    if (parsed && (sessionActive === "true" || sessionStorage.getItem("wsj_user"))) {
      setCurrentUser(parsed);
    } else {
      // By default, the website is SIGNED OUT
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, [pathname, isDashboardPage, isAdminDashboard, isWriterDashboard, isReaderDashboard]);

  // Event listener for profile updates & open modal events
  useEffect(() => {
    const handleUpdate = () => loadUserFromStorage();
    const handleOpenModal = () => setShowProfileModal(true);

    window.addEventListener("wsj_user_updated", handleUpdate);
    window.addEventListener("wsj_open_profile_modal", handleOpenModal);

    return () => {
      window.removeEventListener("wsj_user_updated", handleUpdate);
      window.removeEventListener("wsj_open_profile_modal", handleOpenModal);
    };
  }, []);

  // Click outside listener to close dropdown on desktop or mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = dropdownRef.current && dropdownRef.current.contains(target);
      const insideMobile = mobileDropdownRef.current && mobileDropdownRef.current.contains(target);
      if (!insideDesktop && !insideMobile) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("wsj_user");
    sessionStorage.removeItem("wsj_session_active");
    localStorage.removeItem("wsj_user");
    localStorage.removeItem("wsj_token");
    localStorage.removeItem("wsj_admin_user");
    setCurrentUser(null);
    setShowDropdown(false);
    window.dispatchEvent(new Event("wsj_user_updated"));
    router.push("/");
  };

  const editionLinks = [
    { label: "English Edition ▼", href: "#" },
    { label: "Opinions", href: "/opinion" },
    { label: "Upcoming Entrepreneurs", href: "#" },
    { label: "Top 20 Billionaires", href: "#" },
  ];

  const isLoggedIn = currentUser !== null;
  const userRole = currentUser?.role?.toLowerCase() || "";

  const displayName = currentUser?.full_name || "";
  const displayEmail = currentUser?.email || "";
  let dashboardLabel = "Dashboard";
  let dashboardHref = "/";

  if (userRole === "writer") {
    dashboardLabel = "Writer Dashboard";
    dashboardHref = "/writer-dashboard";
  } else if (userRole === "reader") {
    dashboardLabel = "Reader dashboard";
    dashboardHref = "/reader-dashboard";
  } else if (userRole === "admin") {
    dashboardLabel = "Admin dashboard";
    dashboardHref = "/admin-dashboard";
  }

  const renderDropdownMenu = () => (
    <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-24px)] bg-white border border-[#e2e8f0] shadow-2xl rounded-2xl p-4 z-50 animate-in zoom-in-95 duration-100 font-sans text-left">
      {/* Top User Info Section matching user screenshot */}
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
            href="/writer"
           
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
            setShowProfileModal(true);
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

  return (
    <div className="bg-white h-auto min-h-[90px] md:h-[100px] pb-2 md:pb-0 relative select-none">
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
      <MobileNavDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentUser={currentUser}
        onOpenSearch={() => setIsSearchOverlayOpen(true)}
      />
      <div className="max-w-[1280px] mx-auto px-2 relative h-full">
        {/* Main Logo & Auth Action Buttons Row */}
        <div className="relative flex flex-col md:flex-row items-start justify-between w-full h-full pt-2">
          {/* Hamburger button on mobile / tablet */}
          <div className="flex md:hidden items-center justify-between w-full pb-1 mb-1 border-b border-gray-200">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1.5 text-[#111111] hover:text-gray-700 transition-colors cursor-pointer focus:outline-none"
              aria-label="Open mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setIsSearchOverlayOpen(true)}
              className="p-1.5 text-[#111111] hover:text-gray-700 transition-colors cursor-pointer focus:outline-none"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Left Action Button: Newsletter (Generous padding on all sides) */}
          <div className="hidden md:flex items-center w-[200px] lg:w-[230px] justify-start pt-1">
            <Link
              href="/newsletters"
              className="bg-black hover:bg-gray-900 text-white font-sans text-[11.5px] font-medium px-5 py-2 h-auto flex items-center justify-center rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer inline-flex leading-none shadow-xs"
              suppressHydrationWarning
            >
              Newsletter
            </Link>
          </div>

          {/* Centered Masthead Logo */}
          <div className="flex-1 text-center py-0 my-0 flex items-center justify-center w-full md:w-auto">
            <Link href="/" className="inline-block py-0 my-0 leading-none">
              <WSJLogo />
            </Link>
          </div>

          {/* Desktop Right Action Buttons: Special Offer & Sign In (Generous padding on all sides) */}
          <div className="hidden md:flex items-center space-x-2.5 w-[230px] lg:w-[270px] justify-end pt-1">
            <SpecialOfferPopover>
              <button
                className="bg-[#007cb9] hover:bg-[#006996] text-white font-sans text-[11.5px] font-medium px-5 py-2 h-auto flex items-center justify-center rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer shadow-xs leading-none"
                suppressHydrationWarning
              >
                Special Offer
              </button>
            </SpecialOfferPopover>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#f3f4f6] hover:bg-[#e5e7eb] border-2 border-[#1e293b] rounded-full flex items-center justify-center relative overflow-hidden transition-colors cursor-pointer shadow-xs"
                  aria-label="User Profile"
                  title={`${displayName} (${displayEmail})`}
                  suppressHydrationWarning
                >
                  {currentUser?.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <svg className="w-5 h-5 text-[#1e293b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00c853] border-2 border-white rounded-full shadow-2xs z-10" />
                </button>

                {showDropdown && renderDropdownMenu()}
              </div>
            ) : (
              <Link
                href="/signin"
                className="bg-white hover:bg-gray-50 text-black border border-black font-sans text-[11.5px] font-medium px-5 py-2 h-auto flex items-center justify-center rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer shadow-xs leading-none"
                aria-label="Sign In"
                suppressHydrationWarning
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Sub-Utility Edition Navigation: Clean normal weight text without heavy bolding */}
        <div className="md:absolute md:top-[78px] md:left-1/2 md:-translate-x-1/2 flex items-center justify-center text-[11px] sm:text-[12px] font-['Century_Gothic','Publica_Sans_Light','Kumbh_Sans',sans-serif] font-normal text-[#333333] tracking-tight select-none z-10 whitespace-nowrap overflow-x-auto no-scrollbar max-w-full my-1 md:my-0 py-1 px-1">
          {/* English Edition */}
          <a
            href="/edition/english"
            className="hover:underline cursor-pointer font-normal text-[#666666] hover:text-black flex items-center leading-none"
          >
            <span>English Edition</span>
            <span className="text-[7.5px] text-[#111111] font-bold inline-block leading-none ml-0.5">▼</span>
          </a>

          {/* Gap between ▼ and | (0.2 cm = 8px) */}
          <span className="ml-[8px] mr-[8px] text-[#999999] font-light text-[10px] leading-none shrink-0">|</span>

          {/* Opinions */}
          <a
            href="/opinions"
            className="hover:underline cursor-pointer font-normal text-[#333333] hover:text-black leading-none"
          >
            Opinions
          </a>

          {/* Gap between Opinions and | (0.4 cm = 15px) & | and Upcoming Entrepreneurs (0.4 cm = 15px) */}
          <span className="ml-[15px] mr-[15px] text-[#999999] font-light text-[10px] leading-none shrink-0">|</span>

          {/* Upcoming Entrepreneurs */}
          <a
            href="/upcoming-entrepreneurs"
            className="hover:underline cursor-pointer font-normal text-[#333333] hover:text-black leading-none"
          >
            Upcoming Entrepreneurs
          </a>

          {/* Gap between Upcoming Entrepreneurs and | (0.4 cm = 15px) & | and Top 20 Billionaires (0.4 cm = 15px) */}
          <span className="ml-[15px] mr-[15px] text-[#999999] font-light text-[10px] leading-none shrink-0">|</span>

          {/* Top 20 Billionaires */}
          <a
            href="/top-20-billionaires"
            className="hover:underline cursor-pointer font-normal text-[#333333] hover:text-black leading-none"
          >
            Top 20 Billionaires
          </a>
        </div>

        {/* Mobile Action Buttons Row (Strictly BELOW English Edition Links) */}
        <div className="flex md:hidden items-center justify-center space-x-2 pt-2 pb-1 border-t border-gray-100 mt-1">
          <Link href="/newsletters">
            <button className="h-7 bg-black hover:bg-gray-800 text-white font-sans text-[11px] font-bold px-3 transition-colors whitespace-nowrap flex items-center justify-center leading-none rounded-none cursor-pointer">
              Newsletter
            </button>
          </Link>

          <SpecialOfferPopover>
            <button className="h-7 bg-[#007cb9] hover:bg-[#006996] text-white font-sans text-[11px] font-bold px-3 transition-colors whitespace-nowrap flex items-center justify-center leading-none rounded-none cursor-pointer shadow-xs">
              Special Offer
            </button>
          </SpecialOfferPopover>

          {isLoggedIn ? (
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-7 h-7 bg-[#f3f4f6] hover:bg-[#e5e7eb] border-2 border-[#1e293b] rounded-full flex items-center justify-center relative overflow-hidden transition-colors cursor-pointer shadow-xs shrink-0"
                aria-label="User Profile"
                title={displayName}
              >
                {currentUser?.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg className="w-4 h-4 text-[#1e293b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00c853] border-2 border-white rounded-full shadow-2xs z-10" />
              </button>

              {showDropdown && renderDropdownMenu()}
            </div>
          ) : (
            <Link href="/signin">
              <button className="h-7 bg-white hover:bg-gray-50 text-black border border-[#333333] hover:border-black font-sans text-[11px] font-bold px-3 transition-colors whitespace-nowrap flex items-center justify-center leading-none rounded-none cursor-pointer">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Render Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSave={(updated) => {
          setCurrentUser(updated);
        }}
      />
    </div>
  );
};

export default LogoHeader;
