"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import SearchOverlay from "@/components/search/SearchOverlay";

interface MenuSection {
  heading: string;
  links: { name: string; href: string }[];
}

interface ColumnGroup {
  heading?: string;
  links?: { name: string; href: string }[];
  sections?: MenuSection[];
}

interface CategoryMegaMenu {
  title: string;
  href: string;
  columns: ColumnGroup[];
}

export const megaMenuData: Record<string, CategoryMegaMenu> = {
  News: {
    title: "News",
    href: "/news",
    columns: [
      {
        links: [
          { name: "U.S. News", href: "/news/us-news" },
          { name: "International News", href: "/news/international-news" },
        ],
      },
    ],
  },
  Law: {
    title: "Law",
    href: "/law",
    columns: [
      {
        links: [
          { name: "Criminal Cases", href: "/law/criminal-cases" },
          { name: "Legal Affairs", href: "/law/legal-affairs" },
        ],
      },
    ],
  },
  Politics: {
    title: "Politics",
    href: "/politics",
    columns: [
      {
        links: [
          { name: "World Politics", href: "/politics/world-politics" },
          { name: "Congress", href: "/politics/congress" },
          { name: "Elections", href: "/politics/elections" },
        ],
      },
    ],
  },
  Business: {
    title: "Business",
    href: "/business",
    columns: [
      {
        links: [
          { name: "Corporate News", href: "/business/corporate-news" },
          { name: "Small Business", href: "/business/small-business" },
          { name: "Entrepreneurship", href: "/business/entrepreneurship" },
          { name: "CEOs & Executives", href: "/business/ceos-and-executives" },
        ],
      },
    ],
  },
  "Markets & Finance": {
    title: "Markets & Finance",
    href: "/markets-finance",
    columns: [
      {
        links: [
          { name: "Stocks", href: "/markets-finance/stocks" },
          { name: "Currencies", href: "/markets-finance/currencies" },
          { name: "Banking", href: "/markets-finance/banking" },
        ],
      },
    ],
  },
  Economy: {
    title: "Economy",
    href: "/economy",
    columns: [
      {
        links: [
          { name: "Jobs & Employment", href: "/economy/jobs-employment" },
          { name: "Interest Rates", href: "/economy/interest-rates" },
        ],
      },
    ],
  },
  Tech: {
    title: "Tech",
    href: "/tech",
    columns: [
      {
        links: [
          { name: "Artificial Intelligence", href: "/tech/artificial-intelligence" },
          { name: "Cybersecurity", href: "/tech/cybersecurity" },
          { name: "Innovation", href: "/tech/innovation" },
        ],
      },
    ],
  },
  Entertainment: {
    title: "Entertainment",
    href: "/entertainment",
    columns: [
      {
        links: [
          { name: "Movies", href: "/entertainment/movies" },
          { name: "Television", href: "/entertainment/television" },
          { name: "Music", href: "/entertainment/music" },
          { name: "Celebrity", href: "/entertainment/celebrity" },
        ],
      },
    ],
  },
  Arts: {
    title: "Arts",
    href: "/arts",
    columns: [
      {
        links: [
          { name: "Upcoming Brands", href: "/arts/upcoming-brands" },
          { name: "Architecture", href: "/arts/architecture" },
          { name: "Books", href: "/arts/books" },
          { name: "Culture", href: "/arts/culture" },
        ],
      },
    ],
  },
  Industries: {
    title: "Industries",
    href: "/industries",
    columns: [
      {
        links: [
          { name: "Energy", href: "/industries/energy" },
          { name: "Automotive", href: "/industries/automotive" },
          { name: "Manufacturing", href: "/industries/manufacturing" },
          { name: "Agriculture", href: "/industries/agriculture" },
          { name: "Construction", href: "/industries/construction" },
        ],
      },
    ],
  },
  Fashion: {
    title: "Fashion",
    href: "/fashion",
    columns: [
      {
        links: [
          { name: "Designers", href: "/fashion/designers" },
          { name: "Jewelry", href: "/fashion/jewelry" },
        ],
      },
    ],
  },
  Investing: {
    title: "Investing",
    href: "/investing",
    columns: [
      {
        links: [
          { name: "Stocks", href: "/investing/stocks" },
          { name: "Real Estate", href: "/investing/real-estate" },
          { name: "Wealth Management", href: "/investing/wealth-management" },
          { name: "Crypto", href: "/investing/crypto" },
        ],
      },
    ],
  },
  Health: {
    title: "Health",
    href: "/health",
    columns: [
      {
        links: [
          { name: "Medical Research", href: "/health/medical-research" },
          { name: "Mental Health", href: "/health/mental-health" },
        ],
      },
    ],
  },
  Sports: {
    title: "Sports",
    href: "/sports",
    columns: [
      {
        links: [
          { name: "Soccer", href: "/sports/soccer" },
          { name: "Golf", href: "/sports/golf" },
          { name: "Tennis", href: "/sports/tennis" },
          { name: "Cricket", href: "/sports/cricket" },
        ],
      },
    ],
  },
  Lifestyle: {
    title: "Lifestyle",
    href: "/lifestyle",
    columns: [
      {
        links: [
          { name: "Travel", href: "/lifestyle/travel" },
          { name: "Food & Dining", href: "/lifestyle/food-dining" },
          { name: "Cars", href: "/lifestyle/cars" },
        ],
      },
    ],
  },
  Science: {
    title: "Science",
    href: "/science",
    columns: [
      {
        links: [
          { name: "Space", href: "/science/space" },
          { name: "Climate", href: "/science/climate" },
          { name: "Environment", href: "/science/environment" },
          { name: "Research", href: "/science/research" },
        ],
      },
    ],
  },
  Opinions: {
    title: "Opinions",
    href: "/opinion",
    columns: [],
  },
  Editorials: {
    title: "Editorials",
    href: "/editorials",
    columns: [],
  },
};

export const allCategories = [
  "News",
  "Law",
  "Politics",
  "Business",
  "Markets & Finance",
  "Economy",
  "Tech",
  "Entertainment",
  "Arts",
  "Industries",
  "Fashion",
  "Investing",
  "Health",
  "Sports",
  "Lifestyle",
  "Science",
];

export function getCategoryRoute(title: string): string {
  const map: Record<string, string> = {
    News: "/news",
    Law: "/law",
    Politics: "/politics",
    Business: "/business",
    "Markets & Finance": "/markets-finance",
    Economy: "/economy",
    Tech: "/tech",
    Entertainment: "/entertainment",
    Arts: "/arts",
    Industries: "/industries",
    Fashion: "/fashion",
    Investing: "/investing",
    Health: "/health",
    Sports: "/sports",
    Lifestyle: "/lifestyle",
    Science: "/science",
    Opinions: "/opinion",
    Editorials: "/editorials",
  };
  return map[title] || `/${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [hoveredOffsetLeft, setHoveredOffsetLeft] = useState<number>(0);
  const [hoveredWidth, setHoveredWidth] = useState<number>(0);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentMenu = activeTab ? megaMenuData[activeTab] : null;

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />

      <nav
        className="w-full bg-white border-b border-[#EAE6DA] relative z-30 font-sans shadow-2xs"
        aria-label="Category Navigation"
        onMouseLeave={() => setActiveTab(null)}
      >
        <div className="w-full max-w-[1280px] mx-auto px-2 relative">
          <div className="flex items-end h-[34px] overflow-x-auto no-scrollbar">
            <div className="flex items-end justify-between w-full min-w-max lg:min-w-0 h-full">
              {allCategories.map((title) => {
                const isHovered = activeTab === title;

                return (
                  <div
                    key={title}
                    ref={(el) => { tabRefs.current[title] = el; }}
                    onMouseEnter={() => {
                      setActiveTab(title);
                      const currentTabEl = tabRefs.current[title];
                      if (currentTabEl) {
                        setHoveredOffsetLeft(currentTabEl.offsetLeft);
                        setHoveredWidth(currentTabEl.offsetWidth);
                      }
                    }}
                    className="relative flex-shrink-0 flex items-end h-full"
                  >
                    <Link
                      href={getCategoryRoute(title)}
                      prefetch={false}
                      className={`text-[13px] font-['Century_Gothic','Publica_Sans_Light','Kumbh_Sans',sans-serif] px-2.5 pb-1.5 pt-1 border transition-all whitespace-nowrap leading-none ${
                        isHovered
                          ? "bg-[#f9f9f8] text-[#111111] font-bold border-[#dcd6cd] border-b-transparent rounded-t-sm z-50 relative -mb-[1px]"
                          : "text-[#111111] font-normal border-transparent hover:text-[#990000]"
                      }`}
                    >
                      {title}
                    </Link>
                  </div>
                );
              })}

              {/* Integrated Search Icon */}
              <div className="flex items-center flex-shrink-0 relative z-50 pb-1.5 px-2">
                <button
                  onClick={() => router.push("/search")}
                  aria-label="Search"
                  className="py-1 text-[#444444] hover:text-black transition-colors focus:outline-none cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Sub-Categories 100% Viewport Full-Width Hover Dropdown Panel */}
        {currentMenu && currentMenu.columns && currentMenu.columns.length > 0 && currentMenu.columns[0]?.links && currentMenu.columns[0].links.length > 0 && (
          <div
            onMouseEnter={() => setActiveTab(activeTab)}
            onMouseLeave={() => setActiveTab(null)}
            className="absolute left-0 right-0 w-full top-[34px] bg-[#f9f9f8] border-b border-t border-[#dcd6cd] shadow-lg z-40 py-5 min-h-[180px] transition-all duration-150 animate-fadeIn"
          >
            <div className="w-full max-w-[1280px] mx-auto px-2 relative">
              {/* Seamless patch div: erases the top border line ONLY directly underneath the hovered tab */}
              {activeTab && hoveredWidth > 0 && (
                <div
                  className="absolute -top-[21px] bg-[#f9f9f8] h-[3px] z-50 transition-all duration-150"
                  style={{
                    left: `${hoveredOffsetLeft}px`,
                    width: `${hoveredWidth}px`,
                  }}
                />
              )}

              <div
                className="transition-all duration-150"
                style={{ paddingLeft: `${hoveredOffsetLeft}px` }}
              >
                <div className="flex flex-col space-y-2 min-w-[200px] max-w-[280px]">
                  {currentMenu.columns[0]?.links?.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-[13.5px] font-sans text-[#333333] hover:text-[#990000] hover:underline transition-colors py-0.5"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
