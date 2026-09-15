"use client";

import React from "react";
import Container from "@/components/layout/Container";

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
const aboutLinks = [
  { name: "About us", href: "/about-us" },
  { name: "Contact us", href: "/contact-us" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Editorial Policy", href: "/editorial-policy" },
  { name: "Advertise with us", href: "/advertise-with-us" },
  { name: "RSS Feed", href: "/newsletter" },
];

// EDITIONS Column (5 items)
const editionsLinks = [
  { name: "United States", href: "/" },
  { name: "Australia", href: "/news" },
  { name: "India", href: "/news" },
  { name: "Singapore", href: "/news" },
  { name: "United Kingdom", href: "/news" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAF7EE] text-[#111111] border-t border-[#EAE6DA] font-sans select-none pt-10 pb-8">
      <Container>
        {/* Multi-Column Grid (Max 8 items per list, split into columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 pb-10">
          {/* Column 1: NEWS (Part 1) */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
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

          {/* Column 2: NEWS (Part 2 - Continuation without duplicate heading) */}
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
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
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

          {/* Column 4: FEATURED (Part 2 - Continuation without duplicate heading) */}
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
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
              ABOUT
            </h3>
            <ul className="space-y-2.5 text-xs text-[#444444]">
              {aboutLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-[#00558c] transition-colors block">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: EDITIONS */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
              EDITIONS
            </h3>
            <ul className="space-y-2.5 text-xs text-[#444444]">
              {editionsLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-[#00558c] transition-colors block text-[#111111] font-medium">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 7: FOLLOW US */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-4">
              FOLLOW US
            </h3>
            <ul className="space-y-3 text-xs text-[#444444]">
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-[#00558c] transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-[#00558c] transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600 fill-current" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-[#00558c] transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://rumble.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2.5 hover:text-[#00558c] transition-colors"
                >
                  <div className="w-4 h-4 rounded-full bg-[#85c441] flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <span>Rumble</span>
                </a>
              </li>
              <li>
                <a
                  href="/newsletter"
                  className="flex items-center space-x-2.5 hover:text-[#00558c] transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Newsletter</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Divider, Centered Logo, and Copyright Notice */}
        <div className="border-t border-[#EAE6DA] pt-8 pb-4 text-center">
          <a href="/" className="inline-block mb-3">
            <img
              src="/images/design-reference/Times Chicago.svg"
              alt="Times Chicago"
              className="h-8 sm:h-9 w-auto mx-auto object-contain"
            />
          </a>
          <p className="text-[11px] text-[#666666] font-sans">
            © Copyright 2026 Times Chicago Media LLC. All Rights Reserved. All standard legal notices apply.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
