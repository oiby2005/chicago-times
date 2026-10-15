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
import { setSiteLanguageEdition, getSavedEdition } from "@/components/ui/GoogleTranslateProvider";

import { getAuthorSlugForUser, getUserDashboardUrl, getAuthorBySlug, slugifyAuthorName } from "@/data/authors";

export const LogoHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [showEditionDropdown, setShowEditionDropdown] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState("English");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const editionRef = useRef<HTMLDivElement>(null);
  const [logoHref, setLogoHref] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const match = path.match(/\/admin\/([^/]+)/);
      if (match && match[1]) {
        setLogoHref(`/admin/${match[1]}`);
        return;
      }
    }
    if (currentUser?.role === "admin") {
      const nameStr = currentUser.username || currentUser.name || "admin1";
      setLogoHref(`/admin/${nameStr.toLowerCase().trim().replace(/\s+/g, "-")}`);
    } else if ((currentUser?.role || "").toLowerCase() === "writer") {
      const writerName = currentUser.full_name || currentUser.name || "writer";
      setLogoHref(`/${slugifyAuthorName(writerName)}`);
    } else {
      setLogoHref("/");
    }
  }, [currentUser, pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelectedEdition(getSavedEdition());
    }

    const handleEditionChange = (e: any) => {
      if (e.detail?.label) {
        setSelectedEdition(e.detail.label);
      }
    };

    window.addEventListener("wsj_edition_changed", handleEditionChange);
    return () => window.removeEventListener("wsj_edition_changed", handleEditionChange);
  }, []);

  const isAdminDashboard = pathname?.includes("/admin-dashboard");
  const isWriterDashboard = pathname?.includes("/writer-dashboard");
  const isReaderDashboard = pathname?.includes("/reader-dashboard");
  const isDashboardPage = isAdminDashboard || isWriterDashboard || isReaderDashboard;

  // Hide Special Offer button on Admin Dashboard & Writer Dashboard
  const hideSpecialOffer = isAdminDashboard || isWriterDashboard;

  const loadUserFromStorage = () => {
    if (typeof window === "undefined") return;
    try { localStorage.removeItem("wsj_user"); } catch (e) {}

    if (sessionStorage.getItem("wsj_logged_out") === "true" || localStorage.getItem("wsj_logged_out") === "true") {
      setCurrentUser(null);
      return;
    }

    const tabUser = sessionStorage.getItem("wsj_user");
    let parsed: any = null;
    if (tabUser) {
      try { parsed = JSON.parse(tabUser); } catch (e) {}
    }

    if (!parsed && pathname && sessionStorage.getItem("wsj_session_active") === "true") {
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

    if (parsed && parsed.email) {
      const cleanEmail = (parsed.email || "").toLowerCase().trim();
      try {
        const map = JSON.parse(localStorage.getItem("wsj_users_by_email") || "{}");
        if (map[cleanEmail]) {
          const mapped = map[cleanEmail];
          parsed = {
            ...parsed,
            ...mapped,
            full_name: mapped.full_name || mapped.name || parsed.full_name,
            name: mapped.full_name || mapped.name || parsed.name,
          };
        }
      } catch (e) {}
    }

    setCurrentUser(parsed);

    // Revalidate with backend to ensure the latest user profile and name in the active tab
    if (parsed && parsed.email) {
      const cleanEmail = (parsed.email || "").toLowerCase().trim();
      fetch(`http://localhost:5000/api/users/${encodeURIComponent(cleanEmail)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.user) {
            const serverUser = data.user;
            const updated = {
              ...parsed,
              ...serverUser,
              full_name: serverUser.full_name || serverUser.name || parsed.full_name,
              name: serverUser.full_name || serverUser.name || parsed.name,
            };
            sessionStorage.setItem("wsj_user", JSON.stringify(updated));
            setCurrentUser(updated);
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, [pathname, isDashboardPage, isAdminDashboard, isWriterDashboard, isReaderDashboard]);

  // Event listener for profile updates & open modal events & cross-tab sync
  useEffect(() => {
    const handleUpdate = () => loadUserFromStorage();
    const handleOpenModal = () => setShowProfileModal(true);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wsj_user_sync");
      channel.onmessage = () => {
        // Only re-sync if this specific tab already has an active session
        if (sessionStorage.getItem("wsj_user")) {
          loadUserFromStorage();
        }
      };
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "wsj_users_by_email" && sessionStorage.getItem("wsj_user")) {
        loadUserFromStorage();
      }
    };

    window.addEventListener("wsj_user_updated", handleUpdate);
    window.addEventListener("wsj_open_profile_modal", handleOpenModal);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("wsj_user_updated", handleUpdate);
      window.removeEventListener("wsj_open_profile_modal", handleOpenModal);
      window.removeEventListener("storage", handleStorage);
      if (channel) channel.close();
    };
  }, []);

  // Click outside listener to close dropdown on desktop, mobile, or edition card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDesktop = dropdownRef.current && dropdownRef.current.contains(target);
      const insideMobile = mobileDropdownRef.current && mobileDropdownRef.current.contains(target);
      const insideEdition = editionRef.current && editionRef.current.contains(target);
      if (!insideDesktop && !insideMobile && !insideEdition) {
        setShowDropdown(false);
        setShowEditionDropdown(false);
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
      localStorage.removeItem("wsj_writer_user");
      localStorage.removeItem("wsj_reader_user");
      localStorage.removeItem("wsj_session_active");
      sessionStorage.setItem("wsj_logged_out", "true");
      localStorage.setItem("wsj_logged_out", "true");
      setCurrentUser(null);
      setShowDropdown(false);
      window.dispatchEvent(new Event("wsj_user_updated"));
      window.dispatchEvent(new Event("wsj_logout"));
      window.location.href = "/";
    }
  };

  const editionLinks = [
    { label: "English Edition ▼", href: "#" },
    { label: "Opinions", href: "/opinion" },
    { label: "Upcoming Top 20", href: "/upcoming-top-20" },
    { label: "World Billionaires", href: "/world-billionaire" },
  ];

  const isLoggedIn = currentUser !== null;
  const userRole = currentUser?.role?.toLowerCase() || "";

  const displayName = currentUser?.full_name || currentUser?.name || "";
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
    <div className="bg-white h-auto py-2 sm:py-3 relative z-50 ">
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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-5 md:px-6 relative">
        {/* Main Logo & Auth Action Buttons Row */}
        <div className="relative flex flex-row items-center justify-between w-full pb-2 md:pb-0 border-b md:border-none border-gray-200">
          
          {/* Mobile Hamburger button (visible on < md) */}
          <div className="flex md:hidden items-center justify-start w-10">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1 text-[#111111] hover:text-gray-700 transition-colors cursor-pointer focus:outline-none"
              aria-label="Open mobile menu"
              suppressHydrationWarning
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop Left Action Button: Newsletter (visible on md+) */}
          <div className="hidden md:flex items-center flex-1 justify-start pt-1">
            <Link
              href="/newsletters"
              className="bg-black hover:bg-gray-900 text-white font-sans text-[11.5px] font-medium px-5 py-2 h-auto flex items-center justify-center rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer inline-flex leading-none shadow-xs"
              suppressHydrationWarning
            >
              Newsletter
            </Link>
          </div>

          {/* Centered Masthead Logo */}
          <div className="flex-1 text-center py-0 my-0 flex items-center justify-center">
            <Link
              href={logoHref}
              className="inline-block py-0 my-0 leading-none"
            >
              <WSJLogo />
            </Link>
          </div>

          {/* Mobile Search button (visible on < md) */}
          <div className="flex md:hidden items-center justify-end w-10">
            <button
              onClick={() => setIsSearchOverlayOpen(true)}
              className="p-1 text-[#111111] hover:text-gray-700 transition-colors cursor-pointer focus:outline-none"
              aria-label="Search"
              suppressHydrationWarning
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Desktop Right Action Buttons: Special Offer & Sign In (visible on md+) */}
          <div className="hidden md:flex items-center space-x-2.5 flex-1 justify-end pt-1 relative z-[100]">
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
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#f3f4f6] hover:bg-[#e5e7eb] border-none rounded-full flex items-center justify-center relative overflow-hidden transition-colors cursor-pointer shadow-xs"
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

        {/* Sub-Utility Edition Navigation */}
        <div className="flex items-center justify-center max-w-full overflow-x-hidden sm:overflow-visible no-scrollbar w-full text-[10px] min-[360px]:text-[10.5px] min-[390px]:text-[11px] sm:text-[12px] font-['Century_Gothic','Publica_Sans_Light','Kumbh_Sans',sans-serif] font-normal text-[#333333] tracking-tight z-30 whitespace-nowrap my-1.5 pt-2 pb-2.5 md:pb-0.5 px-1 sm:px-1 border-b md:border-b-0 border-gray-200">
          {/* Edition Selection Dropdown Card - Desktop and Laptop only */}
          <div className="hidden md:inline-block relative" ref={editionRef}>
            <button
              type="button"
              suppressHydrationWarning
              onClick={(e) => {
                e.stopPropagation();
                setShowEditionDropdown((prev) => !prev);
              }}
              className="hover:underline cursor-pointer font-normal text-[#666666] hover:text-black flex items-center leading-none focus:outline-none"
            >
              <span>{selectedEdition} Edition</span>
              <span className="text-[7.5px] text-[#111111] font-bold inline-block leading-none ml-0.5">▼</span>
            </button>

            {showEditionDropdown && (
              <div className="absolute left-0 top-[calc(100%+6px)] w-40 bg-white border border-[#e2e8f0] shadow-2xl rounded-xl p-2 z-[100] text-left animate-in zoom-in-95 duration-100 font-sans">
                {["English", "Spanish", "German", "Korean", "Chinese"].map((edition) => (
                  <button
                    key={edition}
                    type="button"
                    onClick={() => {
                      setSelectedEdition(edition);
                      setSiteLanguageEdition(edition);
                      setShowEditionDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      selectedEdition === edition
                        ? "bg-[#eff6ff] text-[#2563eb]"
                        : "text-[#334155] hover:bg-slate-50"
                    }`}
                  >
                    <span>{edition}</span>
                    {selectedEdition === edition && (
                      <svg className="w-3.5 h-3.5 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gap between ▼ and | - Desktop and Laptop only */}
          <span className="hidden md:inline mx-1 sm:ml-[8px] sm:mr-[8px] text-[#999999] font-light text-[9px] sm:text-[10px] leading-none shrink-0">|</span>

          {/* Opinions */}
          <a
            href="/opinions"
            className="hover:underline cursor-pointer font-normal text-[#333333] hover:text-black leading-none"
          >
            Opinions
          </a>

          {/* Gap between Opinions and | */}
          <span className="mx-0.5 min-[390px]:mx-1 sm:ml-[15px] sm:mr-[15px] text-[#999999] font-light text-[9px] sm:text-[10px] leading-none shrink-0">|</span>

          {/* Upcoming Top 20 Entrepreneurs */}
          <Link
            href="/upcoming-top-20"
            className="hover:underline cursor-pointer font-normal text-[#333333] hover:text-black leading-none"
          >
            Upcoming Top 20 Entrepreneurs
          </Link>

          {/* Gap between Upcoming Top 20 and | */}
          <span className="mx-0.5 min-[390px]:mx-1 sm:ml-[15px] sm:mr-[15px] text-[#999999] font-light text-[9px] sm:text-[10px] leading-none shrink-0">|</span>

          {/* World 20 Billionaires */}
          <Link
            href="/world-billionaire"
            className="hover:underline cursor-pointer font-normal text-[#333333] hover:text-black leading-none"
          >
            World 20 Billionaires
          </Link>
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
