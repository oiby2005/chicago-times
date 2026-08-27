"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/layout/Container";
import Navbar, { getCategoryRoute } from "@/components/navigation/Navbar";
import SearchOverlay from "@/components/search/SearchOverlay";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";
import { UserProfile } from "@/components/ui/ProfileSettingsModal";

export const StickyHeaderBar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
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

  const isLoggedIn = currentUser !== null;

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
        <div className="flex items-center justify-between h-9 sm:h-11 border-b border-[#f0f0f0] relative px-2 sm:px-0">
          {/* Left Action Button: Newsletter */}
          <div className="hidden md:flex items-center z-10 shrink-0">
            <Link
              href="/newsletters"
              className="h-6 sm:h-7 bg-black hover:bg-gray-800 text-white font-sans text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 rounded-none tracking-tight transition-colors whitespace-nowrap flex items-center justify-center leading-none cursor-pointer"
              suppressHydrationWarning
            >
              Newsletter
            </Link>
          </div>

          {/* Centered Masthead Logo on desktop, left-aligned on mobile */}
          <div className="static md:absolute md:left-1/2 md:-translate-x-1/2 shrink-0">
            <Link href="/">
              <img
                src="/images/design-reference/Times Chicago.svg"
                alt="Times Chicago"
                className="h-3.5 sm:h-5 md:h-6 w-auto object-contain block"
              />
            </Link>
          </div>

          {/* Right Buttons: Small & Compact (Special Offer & Profile/Sign In) */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 z-10 shrink-0">

            <SpecialOfferPopover>
              <button
                className="h-6 sm:h-7 bg-[#007cb9] hover:bg-[#006996] text-white font-sans text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 rounded-none tracking-tight transition-colors whitespace-nowrap flex items-center justify-center leading-none cursor-pointer shadow-xs"
                suppressHydrationWarning
              >
                Special Offer
              </button>
            </SpecialOfferPopover>

            {isLoggedIn ? (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("wsj_open_profile_modal"))}
                className="w-6 h-6 sm:w-7 sm:h-7 bg-[#f3f4f6] hover:bg-[#e5e7eb] border-2 border-[#1e293b] rounded-full flex items-center justify-center relative p-0.5 transition-colors cursor-pointer shadow-xs shrink-0"
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
                  <svg className="w-3.5 h-3.5 text-[#1e293b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#00c853] border-2 border-white rounded-full" />
              </button>
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
