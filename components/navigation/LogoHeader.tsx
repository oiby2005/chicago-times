import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import WSJLogo from "@/components/ui/WSJLogo";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";

export const LogoHeader: React.FC = () => {
  const editionLinks = [
    { label: "English Edition ▼", href: "#" },
    { label: "Print Edition", href: "#" },
    { label: "Video", href: "#" },
    { label: "Audio", href: "#" },
    { label: "Latest Headlines", href: "#" },
    { label: "Puzzles", href: "#" },
    { label: "More ▼", href: "#" },
  ];

  return (
    <div className="bg-white pt-1 pb-0.5 relative">
      <Container>
        {/* Main Logo & Auth Action Buttons Grid */}
        <div className="relative flex items-center justify-between py-0">
          {/* Left space for centering balance */}
          <div className="hidden md:block w-[420px]" />

          {/* Centered Masthead Logo */}
          <div className="flex-1 text-center py-0 my-0">
            <a href="/" className="inline-block py-0 my-0 leading-none">
              <WSJLogo />
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 w-[420px] justify-end">
            <Link href="/newsletters">
              <button className="bg-black hover:bg-gray-800 text-white font-sans text-xs font-bold px-3.5 py-1 rounded-sm tracking-tight transition-colors whitespace-nowrap">
                Newsletter
              </button>
            </Link>
            <SpecialOfferPopover>
              <button className="bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold px-3.5 py-1 rounded-sm tracking-tight transition-colors whitespace-nowrap">
                Special Offer
              </button>
            </SpecialOfferPopover>
            <Link href="/signin">
              <button className="bg-white hover:bg-gray-50 text-black border border-[#767676] font-sans text-xs font-semibold px-3 py-1 rounded-sm tracking-tight transition-colors whitespace-nowrap cursor-pointer">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Sub-Utility Edition Navigation - Vertically compact directly under logo */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-[#555555] font-sans -mt-1 sm:-mt-1.5 pb-0.5 relative z-10">
          {editionLinks.map((item, idx) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                className="hover:text-black hover:underline cursor-pointer transition-colors"
              >
                {item.label}
              </a>
              {idx < editionLinks.length - 1 && (
                <span className="text-[#cccccc] font-light">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default LogoHeader;
