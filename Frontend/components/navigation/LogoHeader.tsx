import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import WSJLogo from "@/components/ui/WSJLogo";
import SpecialOfferPopover from "@/components/navigation/SpecialOfferPopover";

export const LogoHeader: React.FC = () => {
  const editionLinks = [
    { label: "English Edition ▼", href: "#" },
    { label: "Print Edition", href: "#", highlighted: true },
    { label: "Video", href: "#" },
    { label: "Audio", href: "#" },
    { label: "Latest Headlines", href: "#" },
    { label: "Puzzles", href: "#" },
    { label: "More ▼", href: "#" },
  ];

  return (
    <div className="bg-white pt-1 sm:pt-1.5 pb-0.5 relative select-none">
      <Container>
        {/* Main Logo & Auth Action Buttons Grid */}
        <div className="relative flex flex-col md:flex-row items-center justify-between py-1 min-h-[50px] sm:min-h-[58px] md:min-h-[64px]">
          {/* Left space for centering balance on desktop */}
          <div className="hidden md:block w-[240px] lg:w-[300px]" />

          {/* Centered Masthead Logo */}
          <div className="flex-1 text-center py-0 my-0 flex items-center justify-center">
            <a href="/" className="inline-block py-0 my-0 leading-none">
              <WSJLogo />
            </a>
          </div>

          {/* Right Action Buttons - Perfectly horizontally aligned with the letter L in logo */}
          <div className="flex items-center space-x-2 w-full md:w-[300px] lg:w-[340px] justify-center md:justify-end my-auto self-center mt-2 md:mt-0">
            <Link href="/newsletters">
              <button className="bg-black hover:bg-gray-800 text-white font-sans text-[11.5px] sm:text-[12px] font-bold px-3 py-1.5 rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer">
                Newsletter
              </button>
            </Link>
            <SpecialOfferPopover>
              <button className="bg-[#007cb9] hover:bg-[#006996] text-white font-sans text-[12px] sm:text-[12.5px] font-bold px-3.5 py-1.5 rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer shadow-xs">
                Special Offer
              </button>
            </SpecialOfferPopover>
            <Link href="/signin">
              <button className="bg-white hover:bg-gray-50 text-black border border-[#333333] hover:border-black font-sans text-[11.5px] sm:text-[12px] font-bold px-3 py-1.5 rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Sub-Utility Edition Navigation - Pulled directly under logo matching wsj.com Image 2 */}
        <div className="flex flex-wrap items-center justify-center space-x-2 text-[11px] font-sans -mt-2 sm:-mt-2.5 pb-0.5 relative z-10">
          {editionLinks.map((item, idx) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                className={`hover:underline cursor-pointer transition-colors font-normal ${
                  item.highlighted
                    ? "text-[#007cba] hover:text-[#005a87]"
                    : "text-[#555555] hover:text-black"
                }`}
              >
                {item.label}
              </a>
              {idx < editionLinks.length - 1 && (
                <span className="text-[#cccccc] font-light px-0.5">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default LogoHeader;
