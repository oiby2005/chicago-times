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

// NEWS Column 2 (8 items max)
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

// FEATURED Column 1 (8 items max - Small Business under CEO & Executives)
const featuredLinksCol1 = [
  { name: "Editorials", href: "/editorials" },
  { name: "Opinions", href: "/opinion" },
  { name: "U.S. News", href: "/news/us-news" },
  { name: "International News", href: "/news/international-news" },
  { name: "World Politics", href: "/politics/world-politics" },
  { name: "Corporate News", href: "/business/corporate-news" },
  { name: "CEO & Executives", href: "/business/ceos-and-executives" },
  { name: "Small Business", href: "/business/small-business" },
];

// FEATURED Column 2 (6 items)
const featuredLinksCol2 = [
  { name: "Artificial Intelligence", href: "/tech/artificial-intelligence" },
  { name: "Innovation", href: "/tech/innovation" },
  { name: "Stocks", href: "/markets-finance/stocks" },
  { name: "Real Estate", href: "/investing/real-estate" },
  { name: "Crypto", href: "/investing/crypto" },
  { name: "Space", href: "/science/space" },
];

// ABOUT Column (8 items max)
// ABOUT Column (5 items max)
const aboutLinks = [
  { name: "About us", href: "/about-us" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Editorial Policy", href: "/editorial-policy" },
  { name: "Leadership", href: "/leadership" },
  { name: "RSS Feed", href: "/rss.xml", target: "_blank" },
];

// LANGUAGE EDITIONS Column
const editionsLinks = [
  { name: "English" },
  { name: "Spanish" },
  { name: "German" },
  { name: "Korean" },
  { name: "Chinese" },
];

export const Footer: React.FC = () => {
  const [activeEdition, setActiveEdition] = useState<string>("English");
  const [showEditionDropdown, setShowEditionDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveEdition(getSavedEdition());
    }

    const handleEditionChange = (e: any) => {
      if (e.detail?.label) {
        setActiveEdition(e.detail.label);
      }
    };

    window.addEventListener("wsj_edition_changed", handleEditionChange);
    return () => window.removeEventListener("wsj_edition_changed", handleEditionChange);
  }, []);

  return (
    <footer className="w-full bg-[#FAF7EE] text-[#111111] border-t border-[#EAE6DA] font-sans select-none pt-0 pb-16">
      {/* TOP OF FOOTER: Back to Top button (no section line or separate bg) */}
      <div className="w-full py-2">
        <Container>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-white hover:bg-gray-50 text-black border border-[#dcd6cd] hover:border-black font-sans text-[11.5px] font-medium px-4 py-1.5 h-auto flex items-center justify-center rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer shadow-2xs leading-none"
            >
              <span>Back to Top</span>
              <span className="ml-1 text-[11px] font-bold">^</span>
            </button>
          </div>
        </Container>
      </div>

      {/* SECTION 1: Top Bar (Logo & Language Edition Dropdown) */}
      <div className="w-full border-b border-[#EAE6DA] py-4 bg-[#FAF7EE]">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Logo & Interactive English Edition Dropdown */}
            <div className="flex items-center space-x-4 relative">
              <a href="/" className="inline-block">
                <img
                  src="/images/design-reference/Times Chicago.svg"
                  alt="Times Chicago"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </a>
              <span className="text-[#999999] font-light text-xs">|</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEditionDropdown(!showEditionDropdown)}
                  className="text-[12px] font-sans font-normal text-[#333333] hover:text-black flex items-center space-x-1 cursor-pointer focus:outline-none"
                  aria-label="Select edition"
                  suppressHydrationWarning
                >
                  <span>{activeEdition} Edition</span>
                  <span className="text-[8px] text-[#111111] font-bold">▼</span>
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

            {/* Right: Subscribe Now, Sign In */}
            <div className="flex items-center space-x-2.5">
              <a
                href="/special-offer"
                className="bg-[#007cb9] hover:bg-[#006996] text-white font-sans text-[11.5px] font-medium px-4 py-1.5 h-auto flex items-center justify-center rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer shadow-2xs leading-none"
              >
                Subscribe Now
              </a>
              <a
                href="/signin"
                className="bg-white hover:bg-gray-50 text-black border border-black font-sans text-[11.5px] font-medium px-4 py-1.5 h-auto flex items-center justify-center rounded-none tracking-tight transition-colors whitespace-nowrap cursor-pointer shadow-2xs leading-none"
              >
                Sign In
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* SECTION 2: Multi-Column Directory Grid */}
      <div className="w-full py-10 bg-[#FAF7EE]">
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
                {aboutLinks.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target={item.target || undefined}
                      rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                      className="hover:text-[#00558c] transition-colors block"
                    >
                      {item.name}
                    </a>
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

      {/* SECTION 3: Centralized Social Links Row (Facebook, LinkedIn, Instagram, Rumble, Newsletter) */}
      <div className="w-full border-t border-[#EAE6DA] py-5 bg-[#FAF7EE]">
        <Container>
          <div className="flex flex-wrap items-center justify-center space-x-6 sm:space-x-8 text-xs font-medium text-[#444444] text-center">
            {/* Facebook */}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-current" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 fill-current" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
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
              href="https://rumble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-[#00558c] transition-colors"
            >
              <div className="w-4 h-4 rounded-full bg-[#64748b] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <svg className="w-2.5 h-2.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span>Rumble</span>
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

      {/* SECTION 4: Legal Links & Copyright Notice (Centralized) */}
      <div className="w-full border-t border-[#EAE6DA] pt-6 pb-2 bg-[#FAF7EE]">
        <Container>
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            {/* Policy Links Row */}
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11.5px] font-sans text-[#444444] text-center">
              <a href="/privacy-policy" className="hover:text-black hover:underline transition-colors">Privacy Policy</a>
              <span className="text-[#999999] font-light">|</span>
              <a href="/cookie-policy" className="hover:text-black hover:underline transition-colors">Cookie Policy</a>
              <span className="text-[#999999] font-light">|</span>
              <a href="/accessibility" className="hover:text-black hover:underline transition-colors">Accessibility</a>
            </div>

            {/* Copyright Line */}
            <p className="text-[11px] text-[#666666] font-sans">
              Copyright ©2026 Times Chicago Media LLC. All Rights Reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
