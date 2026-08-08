"use client";

import React from "react";
import Container from "@/components/layout/Container";

const newsColumnLeft = [
  "Live Coverage",
  "Business",
  "Politics",
  "Tech",
  "Arts and Culture",
  "Real Estate",
  "Health",
  "Sports",
  "Science",
  "Middle East",
  "Policy",
  "Investing",
  "Taxes",
  "Obituaries",
];

const newsColumnRight = [
  "World",
  "U.S.",
  "Economy",
  "Finance",
  "Lifestyle",
  "Personal Finance",
  "Style",
  "China",
  "Ukraine",
  "Elections",
  "Trade",
  "Earnings",
  "AI",
];

const marketsLinks = [
  "Stocks",
  "Bonds",
  "Money Rates",
  "DJIA",
  "S&P 500",
  "Nasdaq",
];

const opinionLinks = [
  "Opinion & Reviews",
  "Film Review",
  "Television Review",
  "Bookshelf",
  "Music Review",
  "What to Watch",
  "Art Review",
];

const membershipLinks = [
  "Subscription Options",
  "Corporate Subscriptions",
  "WSJ Higher Education Program",
  "WSJ High School Program",
  "Public Library Program",
  "Dow Jones Events",
  "Commercial Partnerships",
  "WSJ Leadership Institute",
];

const customerServiceLinks = [
  "Customer Center",
  "Contact Us",
  "Cancel My Subscription",
];

const adsLinks = [
  "Advertise",
  "Commercial Real Estate Ads",
  "Place a Classified Ad",
  "Sell Your Business",
  "Sell Your Home",
  "Recruitment & Career Ads",
  "Digital Self Service",
];

const toolsLinks = [
  "Newsletters & Alerts",
  "Topics",
  "Podcasts",
  "Video Center",
  "Watchlist",
  "Latest News",
];

const moreLinks = [
  "About Us",
  "Content Partnerships",
  "Corrections",
  "Jobs at WSJ",
  "News Archive",
  "Register for Free",
  "Reprints & Licensing",
  "Buy Issues",
  "WSJ Shop",
  "Dow Jones Press Room",
  "Dow Jones Smart Money",
];

const dowJonesProductsRow1 = [
  "Barron's",
  "Dow Jones Newswires",
  "Factiva",
  "Financial News",
  "Mansion Global",
  "MarketWatch",
  "Risk & Compliance",
];

const dowJonesProductsRow2 = [
  "WSJ | Buy Side",
  "WSJ Pro",
  "WSJ Video",
  "WSJ Wine",
  "The Times",
];

const legalLinks = [
  "Privacy Notice",
  "Cookie Notice",
  "Copyright Policy",
  "Legal Policies",
  "Terms of Use",
  "Your Ad Choices",
  "Accessibility",
];

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full text-[#333333] font-sans select-none">
      {/* Top White Strip for Back To Top Button */}
      <div className="w-full bg-white border-t border-[#d4d4d4] py-2">
        <Container className="flex justify-end">
          <button
            onClick={scrollToTop}
            className="bg-[#b3b3b3] hover:bg-[#a0a0a0] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 flex items-center space-x-1.5 transition-colors"
          >
            <span>BACK TO TOP</span>
            <span className="text-[11px] font-black">^</span>
          </button>
        </Container>
      </div>

      {/* Band 1: Lighter Gray Header Row (Logo + Parallel English Edition + Subscribe/Sign In) */}
      <div className="w-full bg-[#f2f2f2] pt-5 pb-5">
        <Container>
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <div className="flex items-center space-x-6">
                <a href="/" className="inline-block">
                  <img
                    src="/images/wsj-masthead.svg"
                    alt="The Wall Street Journal"
                    className="h-6 sm:h-7 w-auto object-contain block -ml-3 sm:-ml-3.5"
                  />
                </a>
                <div className="hidden sm:flex items-center space-x-1 text-[12px] text-[#444444] cursor-pointer hover:underline">
                  <span>English Edition</span>
                  <span className="text-[10px]">▼</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-[#333333] font-sans mt-0.5 pl-0.5">
                a Dow Jones company
              </p>
            </div>

            <div className="flex items-center space-x-6 text-[12.5px] font-bold text-black mt-3 sm:mt-0">
              <a href="#" className="hover:underline">
                Subscribe Now
              </a>
              <a href="#" className="hover:underline">
                Sign In
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Band 2: Slightly Darker Gray Multi-Column Links & Social Icons Section */}
      <div className="w-full bg-[#e8e8e8] pt-6 pb-6">
        <Container>
          {/* Multi-Column Links Section */}
          <div className="pb-6 overflow-x-auto">
            <div className="min-w-[980px] grid grid-cols-12 gap-0 text-[11.5px]">
              {/* Column 1: News (Span 3) */}
              <div className="col-span-3 pr-4 border-r border-[#d4d4d4]">
                <h4 className="font-bold text-black text-[12px] mb-2.5">News</h4>
                <div className="grid grid-cols-2 gap-x-2">
                  <ul className="space-y-1.5">
                    {newsColumnLeft.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-[#444444] hover:text-black hover:underline block leading-snug"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-1.5">
                    {newsColumnRight.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-[#444444] hover:text-black hover:underline block leading-snug"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 2: Markets (Span 1) */}
              <div className="col-span-1 px-4 border-r border-[#d4d4d4]">
                <h4 className="font-bold text-black text-[12px] mb-2.5">
                  Markets
                </h4>
                <ul className="space-y-1.5">
                  {marketsLinks.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[#444444] hover:text-black hover:underline block leading-snug"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Opinion (Span 1) */}
              <div className="col-span-1 px-4 border-r border-[#d4d4d4]">
                <h4 className="font-bold text-black text-[12px] mb-2.5">
                  Opinion
                </h4>
                <ul className="space-y-1.5">
                  {opinionLinks.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[#444444] hover:text-black hover:underline block leading-snug"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: WSJ Membership (Span 2) */}
              <div className="col-span-2 px-4 border-r border-[#d4d4d4]">
                <h4 className="font-bold text-black text-[12px] mb-2.5">
                  WSJ Membership
                </h4>
                <ul className="space-y-1.5">
                  {membershipLinks.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[#444444] hover:text-black hover:underline block leading-snug"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5: Customer Service & Ads & Tools (Span 3: 3 sub-columns) */}
              <div className="col-span-3 grid grid-cols-3 gap-0 px-4 border-r border-[#d4d4d4]">
                {/* Customer Service */}
                <div className="pr-2 border-r border-[#d4d4d4]">
                  <h4 className="font-bold text-black text-[12px] mb-2.5">
                    Customer Service
                  </h4>
                  <ul className="space-y-1.5">
                    {customerServiceLinks.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-[#444444] hover:text-black hover:underline block leading-snug"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ads */}
                <div className="px-2 border-r border-[#d4d4d4]">
                  <h4 className="font-bold text-black text-[12px] mb-2.5">Ads</h4>
                  <ul className="space-y-1.5">
                    {adsLinks.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-[#444444] hover:text-black hover:underline block leading-snug"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools & Features */}
                <div className="pl-2">
                  <h4 className="font-bold text-black text-[12px] mb-2.5 whitespace-nowrap">
                    Tools & Features
                  </h4>
                  <ul className="space-y-1.5">
                    {toolsLinks.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-[#444444] hover:text-black hover:underline block leading-snug"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 6: More (Span 2) */}
              <div className="col-span-2 pl-4">
                <h4 className="font-bold text-black text-[12px] mb-2.5">More</h4>
                <ul className="space-y-1.5">
                  {moreLinks.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[#444444] hover:text-black hover:underline block leading-snug"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Social Icons & App Store Badges Row */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            {/* Facebook */}
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center text-xs transition-colors"
              aria-label="Facebook"
            >
              f
            </a>
            {/* X / Twitter */}
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center text-xs transition-colors font-bold"
              aria-label="X"
            >
              𝕏
            </a>
            {/* Instagram */}
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center text-xs transition-colors"
              aria-label="Instagram"
            >
              📷
            </a>
            {/* YouTube */}
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center text-xs transition-colors"
              aria-label="YouTube"
            >
              ▶
            </a>
            {/* Podcast */}
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center text-xs transition-colors"
              aria-label="Podcast"
            >
              🎙
            </a>
            {/* Snapchat */}
            <a
              href="#"
              className="w-7 h-7 rounded-full bg-[#333333] hover:bg-black text-white flex items-center justify-center text-xs transition-colors"
              aria-label="Snapchat"
            >
              👻
            </a>

            {/* Google Play & App Store Badges */}
            <div className="flex items-center space-x-2 pl-3">
              <button className="bg-black text-white px-2.5 py-1 rounded text-[10px] font-sans flex items-center space-x-1">
                <span className="text-[12px]">▶</span>
                <div className="text-left leading-none">
                  <span className="text-[7px] uppercase block text-gray-400">
                    GET IT ON
                  </span>
                  <span className="font-bold text-[10px]">Google Play</span>
                </div>
              </button>
              <button className="bg-black text-white px-2.5 py-1 rounded text-[10px] font-sans flex items-center space-x-1">
                <span className="text-[12px]"></span>
                <div className="text-left leading-none">
                  <span className="text-[7px] uppercase block text-gray-400">
                    Download on the
                  </span>
                  <span className="font-bold text-[10px]">App Store</span>
                </div>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Band 3: Lighter Gray Dow Jones Products Band */}
      <div className="w-full bg-[#f2f2f2] py-5">
        <Container>
          <div className="text-center text-[11.5px] space-y-1.5">
            <div className="flex flex-wrap items-center justify-center gap-x-2 text-[#444444]">
              <span className="font-bold text-black">Dow Jones Products</span>
              <span className="text-[#999999]">|</span>
              {dowJonesProductsRow1.map((item, idx) => (
                <React.Fragment key={item}>
                  <a href="#" className="hover:text-black hover:underline">
                    {item}
                  </a>
                  {idx < dowJonesProductsRow1.length - 1 && (
                    <span className="text-[#cccccc]">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 text-[#444444]">
              {dowJonesProductsRow2.map((item, idx) => (
                <React.Fragment key={item}>
                  <a href="#" className="hover:text-black hover:underline">
                    {item}
                  </a>
                  {idx < dowJonesProductsRow2.length - 1 && (
                    <span className="text-[#cccccc]">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Band 4: Bottom Legal & Copyright Band */}
      <div className="w-full bg-[#e8e8e8] py-5">
        <Container>
          <div className="text-center text-[11px] text-[#555555] space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-3">
              {legalLinks.map((link, idx) => (
                <React.Fragment key={link}>
                  <a href="#" className="hover:text-black hover:underline">
                    {link}
                  </a>
                  {idx < legalLinks.length - 1 && (
                    <span className="text-[#cccccc]">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[#666666] font-sans">
              Copyright ©2026 Dow Jones & Company, Inc. All Rights Reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
