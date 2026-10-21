"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import { setSiteLanguageEdition, getSavedEdition } from "@/components/ui/GoogleTranslateProvider";

// NEWS Column 1 (8 items max)
const newsLinksCol1 = [
  { name: "News", href: "/news" },
  { name: "Law", href: "/law" },
  { name: "Politics", href: "/politics" },
  { name: "Business", href: "/business" },
  { name: "Markets & Finance", href: "/markets-finance" },
  { name: "Economy", href: "/economy" },
  { name: "Tech", href: "/tech" },
  { name: "Entertainment", href: "/entertainment" },
];

// NEWS Column 2 (9 items)
const newsLinksCol2 = [
  { name: "Arts", href: "/arts" },
  { name: "Industries", href: "/industries" },
  { name: "Fashion", href: "/fashion" },
  { name: "Investing", href: "/investing" },
  { name: "Health", href: "/health" },
  { name: "Sports", href: "/sports" },
  { name: "Lifestyle", href: "/lifestyle" },
  { name: "Science", href: "/science" },
  { name: "Interviews", href: "/interviews" },
];

// FEATURED Column 1 (8 items)
const featuredLinksCol1 = [
  { name: "Editorials", href: "/editorial-policy" },
  { name: "Opinions", href: "/opinion" },
  { name: "U.S. News", href: "/us" },
  { name: "International News", href: "/world" },
  { name: "World Politics", href: "/politics" },
  { name: "Corporate News", href: "/business" },
  { name: "CEO & Executives", href: "/business" },
  { name: "Small Business", href: "/business" },
];

// FEATURED Column 2 (6 items)
const featuredLinksCol2 = [
  { name: "Artificial Intelligence", href: "/tech" },
  { name: "Innovation", href: "/tech" },
  { name: "Stocks", href: "/markets-finance" },
  { name: "Real Estate", href: "/real-estate" },
  { name: "Crypto", href: "/markets-finance" },
  { name: "Space", href: "/science" },
];

// ABOUT Column
const aboutLinks: { name: string; href?: string; target?: string; disabled?: boolean; hidden?: boolean }[] = [
  { name: "About us", href: "/about-us" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Careers", href: "/career" },
  { name: "RSS Feed", href: "/rss.xml", target: "_blank" },
  { name: "Leadership", href: "/leadership", hidden: true },
];

export const Footer: React.FC = () => {
  const [activeEdition, setActiveEdition] = useState<string>("English");
  const [showEditionDropdown, setShowEditionDropdown] = useState<boolean>(false);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveEdition(getSavedEdition());
    }

    const handleEditionChange = (e: any) => {
      if (e.detail?.label) {
        setActiveEdition(e.detail.label);
      }
    };

    const handleBannerVisibility = (e: any) => {
      if (typeof e.detail?.visible === "boolean") {
        setIsBannerVisible(e.detail.visible);
      }
    };

    window.addEventListener("wsj_edition_changed", handleEditionChange);
    window.addEventListener("wsj_sticky_banner_visibility", handleBannerVisibility);
    return () => {
      window.removeEventListener("wsj_edition_changed", handleEditionChange);
      window.removeEventListener("wsj_sticky_banner_visibility", handleBannerVisibility);
    };
  }, []);

  return (
    <footer className="w-full text-[#111111] font-sans relative">
      {/* SECTION 1: Top Bar (Logo, Language Edition Dropdown & Back To Top) — Custom Shade 1 (#E8E8E8) */}
      <div className="w-full border-t border-b border-[#DCDCDC] py-3.5 bg-[#E8E8E8]">
        <Container>
          <div className="flex items-center justify-between flex-nowrap gap-2 sm:gap-4">
            {/* Left: Logo & Interactive English Edition Dropdown */}
            <div className="flex items-end space-x-2 sm:space-x-4 relative shrink-0 min-w-0 pb-0.5">
              <a href="/" className="inline-block shrink-0">
                <img
                  src="/images/design-reference/Times Chicago.svg"
                  alt="Times Chicago"
                  className="h-5 sm:h-8 w-auto object-contain shrink-0 block"
                />
              </a>
              <span className="text-[#999999] font-light text-xs shrink-0 self-end pb-0.5 sm:pb-1">|</span>
              <div className="relative shrink-0 self-end pb-0.5 sm:pb-1">
                <button
                  type="button"
                  onClick={() => setShowEditionDropdown(!showEditionDropdown)}
                  className="text-[11px] sm:text-[12px] font-sans font-normal text-[#333333] hover:text-black flex items-center space-x-1 cursor-pointer focus:outline-none whitespace-nowrap shrink-0 leading-none"
                  aria-label="Select edition"
                  suppressHydrationWarning
                >
                  <span className="whitespace-nowrap leading-none">{activeEdition} Edition</span>
                  <span className="text-[7.5px] sm:text-[8px] text-[#111111] font-bold ml-0.5 leading-none">▼</span>
                </button>

                {showEditionDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-[#e2e8f0] shadow-2xl rounded-xl p-2 z-[100] text-left animate-in zoom-in-95 duration-100 font-sans">
                    {["English", "Spanish", "German", "Korean", "Chinese"].map((edition) => (
                      <button
                        key={edition}
                        type="button"
                        onClick={() => {
                          setActiveEdition(edition);
                          setSiteLanguageEdition(edition);
                          setShowEditionDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                          activeEdition === edition
                            ? "bg-[#eff6ff] text-[#2563eb]"
                            : "text-[#334155] hover:bg-slate-50"
                        }`}
                      >
                        <span>{edition} Edition</span>
                        {activeEdition === edition && (
                          <svg className="w-3.5 h-3.5 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Back to Top Button aligned inside footer top bar with English Edition */}
            <div className="shrink-0">
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-[#64748B] hover:bg-[#475569] text-white font-sans text-[9.5px] sm:text-[10.5px] font-extrabold uppercase px-2.5 sm:px-3.5 py-1.5 flex items-center justify-center tracking-wider transition-colors cursor-pointer shadow-xs leading-none whitespace-nowrap shrink-0"
              >
                <span>BACK TO TOP</span>
                <span className="ml-1 sm:ml-1.5 text-[8px] sm:text-[9px] font-black">▲</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* SECTION 2: Multi-Column Directory Grid — Custom Shade 2 (#E3DEDE) */}
      <div className="w-full py-10 border-b border-[#D7D2D2] bg-[#E3DEDE]">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {/* Column 1: NEWS (Part 1) */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
                NEWS
              </h3>
              <ul className="space-y-2.5 text-xs text-[#444444]">
                {newsLinksCol1.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-[#00558c] transition-colors block">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: NEWS (Part 2) */}
            <div>
              <div className="h-4 mb-4 hidden sm:block" aria-hidden="true" />
              <ul className="space-y-2.5 text-xs text-[#444444]">
                {newsLinksCol2.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-[#00558c] transition-colors block">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: FEATURED (Part 1) */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
                FEATURED
              </h3>
              <ul className="space-y-2.5 text-xs text-[#444444]">
                {featuredLinksCol1.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-[#00558c] transition-colors block">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: FEATURED (Part 2) */}
            <div>
              <div className="h-4 mb-4 hidden sm:block" aria-hidden="true" />
              <ul className="space-y-2.5 text-xs text-[#444444]">
                {featuredLinksCol2.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-[#00558c] transition-colors block">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: ABOUT */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
                ABOUT
              </h3>
              <ul className="space-y-2.5 text-xs text-[#444444]">
                {aboutLinks.filter((item) => !item.hidden).map((item) => (
                  <li key={item.name}>
                    {item.disabled ? (
                      <span className="text-[#999999] cursor-default select-none block">
                        {item.name}
                      </span>
                    ) : (
                      <a
                        href={item.href}
                        target={item.target || undefined}
                        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                        className="hover:text-[#00558c] transition-colors block"
                      >
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 6: Customer Service */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
                Customer Service
              </h3>
              <ul className="space-y-2.5 text-xs text-[#444444]">
                <li>
                  <a href="/contact-us" className="hover:text-[#00558c] transition-colors block">
                    Customer Center
                  </a>
                </li>
                <li>
                  <a href="/contact-us" className="hover:text-[#00558c] transition-colors block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/contact-us" className="hover:text-[#00558c] transition-colors block">
                    Cancel My Subscription
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 7: Ads */}
            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
                Ads
              </h3>
              <ul className="space-y-2.5 text-xs text-[#444444]">
                <li>
                  <a href="/advertise-with-us" className="hover:text-[#00558c] transition-colors block">
                    Advertise with us
                  </a>
                </li>
                <li>
                  <a href="/advertise-with-us" className="hover:text-[#00558c] transition-colors block">
                    Commercial Real Estate Ads
                  </a>
                </li>
                <li>
                  <a href="/advertise-with-us" className="hover:text-[#00558c] transition-colors block">
                    Place a Classified Ad
                  </a>
                </li>
                <li>
                  <a href="/advertise-with-us" className="hover:text-[#00558c] transition-colors block">
                    Sell Your Business
                  </a>
                </li>
                <li>
                  <a href="/advertise-with-us" className="hover:text-[#00558c] transition-colors block">
                    Sell Your Home
                  </a>
                </li>
                <li>
                  <a href="/advertise-with-us" className="hover:text-[#00558c] transition-colors block">
                    Recruitment & Career Ads
                  </a>
                </li>
                <li>
                  <a href="/advertise-with-us" className="hover:text-[#00558c] transition-colors block">
                    Digital Self Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* SECTION 3: Centralized Social Links Row — Custom Shade 3 (#D9D4D4) */}
      <div className="w-full border-b border-[#CEC9C9] py-4 sm:py-5 bg-[#D9D4D4]">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-5 sm:gap-x-8 text-xs font-medium text-[#444444] text-center">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/times.chicago/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M15 8h-2a2 2 0 0 0-2 2v7" />
                <line x1="8.5" y1="12" x2="14.5" y2="12" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/times-chicago"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <line x1="8" y1="11" x2="8" y2="16.5" />
                <line x1="8" y1="8" x2="8.01" y2="8" />
                <path d="M12 13.5a2.5 2.5 0 0 1 5 0V16.5" />
                <line x1="12" y1="11" x2="12" y2="16.5" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/timeschicago/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Instagram</span>
            </a>

            {/* Rumble */}
            <a
              href="https://rumble.com/user/timeschicago"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <polygon points="10 8.5 16 12 10 15.5" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
              </svg>
              <span>Rumble</span>
            </a>

            {/* iTunes */}
            <a
              href="https://podcasts.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M9 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" />
                <path d="M15 14.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" />
                <path d="M10.5 14V8l6-1.5v6" strokeWidth="1.8" />
              </svg>
              <span>iTunes</span>
            </a>

            {/* Newsletter */}
            <a
              href="/newsletter"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Newsletter</span>
            </a>
          </div>
        </Container>
      </div>

      {/* SECTION 4: Legal Links & Copyright Notice — Custom Shade 4 (#D4CDCD) */}
      <div className={`w-full pt-5 transition-all duration-300 bg-[#D4CDCD] ${isBannerVisible ? "pb-[96px] sm:pb-[80px] md:pb-[68px]" : "pb-5"}`}>
        <Container>
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            {/* Policy Links Row */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11.5px] font-sans text-[#333333] font-medium text-center">
              <a href="/privacy-policy" className="hover:text-black hover:underline transition-colors">Privacy Policy</a>
              <span className="text-[#888888] font-light">|</span>
              <a href="/cookie-policy" className="hover:text-black hover:underline transition-colors">Cookie Policy</a>
              <span className="text-[#888888] font-light">|</span>
              <a href="/editorial-policy" className="hover:text-black hover:underline transition-colors">Editorial Policy</a>
              <span className="text-[#888888] font-light">|</span>
              <a href="/legal-policies" className="hover:text-black hover:underline transition-colors">Legal Policies</a>
              <span className="text-[#888888] font-light">|</span>
              <a href="/copyright-policy" className="hover:text-black hover:underline transition-colors">Copyright Policy</a>
              <span className="text-[#888888] font-light">|</span>
              <a href="/accessibility" className="hover:text-black hover:underline transition-colors">Accessibility</a>
            </div>

            {/* Copyright Line */}
            <p className="text-[11px] text-[#555555] font-sans font-medium">
              Copyright ©2026 Times Chicago LLC. All Rights Reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
