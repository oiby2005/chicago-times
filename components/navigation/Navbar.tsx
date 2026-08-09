"use client";

import React, { useState } from "react";
import Link from "next/link";
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

const megaMenuData: Record<string, CategoryMegaMenu> = {
  World: {
    title: "World",
    href: "/world",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Africa", href: "/world/africa" },
          { name: "Americas", href: "/world/americas" },
          { name: "Asia", href: "/world/asia" },
          { name: "China", href: "/world/china" },
          { name: "Europe", href: "/world/europe" },
          { name: "Middle East", href: "/world/middle-east" },
          { name: "India", href: "/world/india" },
          { name: "Oceania", href: "/world/oceania" },
          { name: "Russia", href: "/world/russia" },
          { name: "U.K.", href: "/world/uk" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "Science", href: "/world/science" },
          { name: "Anthropology", href: "/world/anthropology" },
          { name: "Biology", href: "/world/biology" },
          { name: "Environment", href: "/world/environment" },
          { name: "Physics", href: "/world/physics" },
          { name: "Space & Astronomy", href: "/world/space" },
          { name: "World Video", href: "/world/video" },
          { name: "Obituaries", href: "/world/obituaries" },
        ],
      },
    ],
  },

  Business: {
    title: "Business",
    href: "/business",
    columns: [
      {
        sections: [
          {
            heading: "Topics",
            links: [
              { name: "Airlines", href: "/business/airlines" },
              { name: "Autos", href: "/business/autos" },
              { name: "C-Suite", href: "/business/c-suite" },
              { name: "Deals", href: "/business/deals" },
              { name: "Earnings", href: "/business/earnings" },
              { name: "Energy & Oil", href: "/business/energy" },
              { name: "Entrepreneurship", href: "/business/entrepreneurship" },
              { name: "Telecom", href: "/business/telecom" },
              { name: "Retail", href: "/business/retail" },
              { name: "Hospitality", href: "/business/hospitality" },
              { name: "Logistics", href: "/business/logistics" },
              { name: "Media", href: "/business/media" },
            ],
          },
          {
            heading: "C-Suite",
            links: [
              { name: "CFO Journal", href: "/business/cfo-journal" },
              { name: "CIO Journal", href: "/business/cio-journal" },
              { name: "CMO Today", href: "/business/cmo-today" },
              { name: "Logistics Report", href: "/business/logistics-report" },
              { name: "Risk & Compliance", href: "/business/risk-compliance" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            heading: "WSJ Professional",
            links: [
              { name: "WSJ Pro Bankruptcy", href: "/pro/bankruptcy" },
              { name: "WSJ Pro Central Banking", href: "/pro/central-banking" },
              { name: "WSJ Pro Cybersecurity", href: "/pro/cybersecurity" },
              { name: "WSJ Pro Private Equity", href: "/pro/private-equity" },
              { name: "WSJ Pro Venture Capital", href: "/pro/vc" },
            ],
          },
          {
            heading: "More",
            links: [
              { name: "Heard On The Street", href: "/business/heard-on-street" },
              { name: "Journal Reports", href: "/business/journal-reports" },
              { name: "Business Video", href: "/business/video" },
              { name: "Business Podcast", href: "/business/podcast" },
            ],
          },
        ],
      },
    ],
  },

  "U.S.": {
    title: "U.S.",
    href: "/us",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Climate & Environment", href: "/us/climate" },
          { name: "Education", href: "/us/education" },
          { name: "Law", href: "/us/law" },
          { name: "USA250", href: "/us/usa250" },
          { name: "College Rankings 2026", href: "/us/college-rankings" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "U.S. Video", href: "/us/video" },
          { name: "What's News Podcast", href: "/us/whats-news-podcast" },
        ],
      },
    ],
  },

  Politics: {
    title: "Politics",
    href: "/politics",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Elections", href: "/politics/elections" },
          { name: "National Security", href: "/politics/national-security" },
          { name: "Policy", href: "/politics/policy" },
        ],
      },
      {
        heading: "More",
        links: [{ name: "Politics Video", href: "/politics/video" }],
      },
    ],
  },

  Economy: {
    title: "Economy",
    href: "/economy",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Central Banking", href: "/economy/central-banking" },
          { name: "Consumers", href: "/economy/consumers" },
          { name: "Housing", href: "/economy/housing" },
          { name: "Jobs", href: "/economy/jobs" },
          { name: "Trade", href: "/economy/trade" },
          { name: "Global", href: "/economy/global" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "Capital Account", href: "/economy/capital-account" },
          { name: "Economic Forecasting Survey", href: "/economy/forecasting" },
          { name: "Economy Video", href: "/economy/video" },
        ],
      },
    ],
  },

  Tech: {
    title: "Tech",
    href: "/tech",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "AI", href: "/tech/ai" },
          { name: "Biotech", href: "/tech/biotech" },
          { name: "Cybersecurity", href: "/tech/cybersecurity" },
          { name: "Personal Technology", href: "/tech/personal-technology" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "Keywords By Christopher Mims", href: "/tech/mims" },
          { name: "Personal Tech By Joanna Stern", href: "/tech/stern" },
          { name: "Family & Tech By Julie Jargon", href: "/tech/jargon" },
          { name: "Personal Tech By Nicole Nguyen", href: "/tech/nguyen" },
          { name: "The Future Of Everything", href: "/tech/future-of-everything" },
          { name: "Tech Video", href: "/tech/video" },
          { name: "Tech Podcast", href: "/tech/podcast" },
        ],
      },
    ],
  },

  "Markets & Finance": {
    title: "Markets & Finance",
    href: "/markets",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Banking", href: "/markets/banking" },
          { name: "Commodities & Futures", href: "/markets/commodities-futures" },
          { name: "Currencies", href: "/markets/currencies" },
          { name: "Investing", href: "/markets/investing" },
          { name: "Regulation", href: "/markets/regulation" },
          { name: "Stocks", href: "/markets/stocks" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "Heard On The Street", href: "/markets/heard-on-street" },
          { name: "Capital Account By Greg Ip", href: "/markets/greg-ip" },
          { name: "The Intelligent Investor By Jason Zweig", href: "/markets/jason-zweig" },
          { name: "Tax Report By Laura Saunders", href: "/markets/laura-saunders" },
          { name: "Streetwise By James Mackintosh", href: "/markets/streetwise" },
          { name: "Markets Video", href: "/markets/video" },
          { name: "Your Money Briefing Podcast", href: "/markets/podcast" },
        ],
      },
      {
        heading: "Market Data",
        links: [
          { name: "Market Data Home", href: "/markets/data-home" },
          { name: "Companies", href: "/markets/companies" },
          { name: "U.S. Stocks", href: "/markets/us-stocks" },
          { name: "Commodities", href: "/markets/data-commodities" },
          { name: "Bonds & Rates", href: "/markets/bonds-rates" },
          { name: "Currencies Market Data", href: "/markets/currencies-data" },
          { name: "Mutual Funds & ETFs", href: "/markets/etfs" },
          { name: "Investment Banking Scorecard", href: "/markets/scorecard" },
          { name: "Earnings Predictions", href: "/markets/earnings-predictions" },
        ],
      },
    ],
  },

  Opinion: {
    title: "Opinion",
    href: "/opinion",
    columns: [
      {
        heading: "Columnists",
        links: [
          { name: "Gerard Baker", href: "/opinion/baker" },
          { name: "Sadanand Dhume", href: "/opinion/dhume" },
          { name: "Allysia Finley", href: "/opinion/finley" },
          { name: "James Freeman", href: "/opinion/freeman" },
          { name: "William A. Galston", href: "/opinion/galston" },
          { name: "Holman W. Jenkins", href: "/opinion/jenkins" },
          { name: "Andy Kessler", href: "/opinion/kessler" },
          { name: "William McGurn", href: "/opinion/mcgurn" },
          { name: "Walter Russell Mead", href: "/opinion/mead" },
          { name: "Peggy Noonan", href: "/opinion/noonan" },
          { name: "Mary Anastasia O'Grady", href: "/opinion/ogrady" },
          { name: "Jason Riley", href: "/opinion/riley" },
          { name: "Joseph Sternberg", href: "/opinion/sternberg" },
          { name: "Kimberley A. Strassel", href: "/opinion/strassel" },
          { name: "Barton Swaim", href: "/opinion/swaim" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "Editorials", href: "/opinion/editorials" },
          { name: "Commentary", href: "/opinion/commentary" },
          { name: "Future View", href: "/opinion/future-view" },
          { name: "Houses Of Worship", href: "/opinion/houses-of-worship" },
          { name: "Cross Country", href: "/opinion/cross-country" },
          { name: "Letters To The Editor", href: "/opinion/letters" },
          { name: "The Weekend Interview", href: "/opinion/weekend-interview" },
          { name: "Potomac Watch Podcast", href: "/opinion/potomac-watch" },
          { name: "Free Expression Podcast", href: "/opinion/free-expression-podcast" },
          { name: "All Things With Kim Strassel Podcast", href: "/opinion/strassel-podcast" },
          { name: "Opinion Video", href: "/opinion/video" },
          { name: "WSJ Opinion Documentaries", href: "/opinion/documentaries" },
          { name: "Notable & Quotable", href: "/opinion/notable-quotable" },
          { name: "Podcast Transcripts", href: "/opinion/transcripts" },
        ],
      },
      {
        heading: "Newsletters",
        links: [
          { name: "Morning Editorial Report", href: "/opinion/morning-report" },
          { name: "All Things With Kim Strassel", href: "/opinion/strassel-newsletter" },
          { name: "Best Of The Web", href: "/opinion/best-of-web" },
          { name: "Opinion Spotlight", href: "/opinion/spotlight" },
        ],
      },
    ],
  },

  "Free Expression": {
    title: "Free Expression",
    href: "/free-expression",
    columns: [
      {
        heading: "Columnists",
        links: [
          { name: "Matthew Continetti", href: "/free-expression/continetti" },
          { name: "Meghan Cox Gurdon", href: "/free-expression/gurdon" },
          { name: "James B. Meigs", href: "/free-expression/meigs" },
          { name: "John J. Miller", href: "/free-expression/miller" },
          { name: "Louise Perry", href: "/free-expression/perry" },
          { name: "Ben Sasse", href: "/free-expression/sasse" },
          { name: "Kyle Smith", href: "/free-expression/smith" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "About Free Expression", href: "/free-expression/about" },
          { name: "Free Expression Newsletter", href: "/free-expression/newsletter" },
          { name: "Recent Newsletters", href: "/free-expression/recent-newsletters" },
        ],
      },
    ],
  },

  Arts: {
    title: "Arts",
    href: "/arts",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Books", href: "/arts/books" },
          { name: "Film", href: "/arts/film" },
          { name: "Fine Art", href: "/arts/fine-art" },
          { name: "History", href: "/arts/history" },
          { name: "Music", href: "/arts/music" },
          { name: "Television", href: "/arts/television" },
          { name: "Theater", href: "/arts/theater" },
        ],
      },
      {
        heading: "Reviews",
        links: [
          { name: "Appreciation", href: "/arts/appreciation" },
          { name: "Architecture Review", href: "/arts/architecture-review" },
          { name: "Art Reviews", href: "/arts/art-reviews" },
          { name: "Book Reviews", href: "/arts/book-reviews" },
          { name: "Film Reviews", href: "/arts/film-reviews" },
          { name: "Television Reviews", href: "/arts/tv-reviews" },
          { name: "Theater Reviews", href: "/arts/theater-reviews" },
          { name: "Masterpiece Series", href: "/arts/masterpiece" },
          { name: "Music Reviews", href: "/arts/music-reviews" },
          { name: "Dance Reviews", href: "/arts/dance-reviews" },
          { name: "Opera Reviews", href: "/arts/opera-reviews" },
          { name: "Exhibition Reviews", href: "/arts/exhibition-reviews" },
          { name: "Cultural Commentary", href: "/arts/commentary" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "WSJ Puzzles", href: "/arts/puzzles" },
          { name: "What To Watch", href: "/arts/what-to-watch" },
          { name: "Arts Calendar", href: "/arts/calendar" },
          { name: "America 250", href: "/arts/america-250" },
          { name: "America 250 Calendar", href: "/arts/america-250-calendar" },
        ],
      },
    ],
  },

  Lifestyle: {
    title: "Lifestyle",
    href: "/lifestyle",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Careers", href: "/lifestyle/careers" },
          { name: "Cars", href: "/lifestyle/cars" },
          { name: "Fitness", href: "/lifestyle/fitness" },
          { name: "Food & Cooking", href: "/lifestyle/food-cooking" },
          { name: "Relationships", href: "/lifestyle/relationships" },
          { name: "Travel", href: "/lifestyle/travel" },
          { name: "Workplace", href: "/lifestyle/workplace" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "Carry On By Dawn Gilbertson", href: "/lifestyle/carry-on" },
          { name: "On The Clock By Callum Borchers", href: "/lifestyle/on-the-clock" },
          { name: "Elizabeth Bernstein", href: "/lifestyle/bernstein" },
          { name: "Turning Points By Clare Ansberry", href: "/lifestyle/turning-points" },
          { name: "WSJ Puzzles", href: "/lifestyle/puzzles" },
          { name: "Recipes", href: "/lifestyle/recipes" },
        ],
      },
    ],
  },

  "Real Estate": {
    title: "Real Estate",
    href: "/real-estate",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Commercial Real Estate", href: "/real-estate/commercial" },
          { name: "Luxury Homes", href: "/real-estate/luxury-homes" },
        ],
      },
    ],
  },

  "Personal Finance": {
    title: "Personal Finance",
    href: "/personal-finance",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Retirement", href: "/personal-finance/retirement" },
          { name: "Savings", href: "/personal-finance/savings" },
          { name: "Credit", href: "/personal-finance/credit" },
          { name: "Taxes", href: "/personal-finance/taxes" },
          { name: "Mortgages", href: "/personal-finance/mortgages" },
        ],
      },
      {
        heading: "More",
        links: [
          { name: "The Intelligent Investor By Jason Zweig", href: "/personal-finance/zweig" },
          { name: "Tax Report By Laura Saunders", href: "/personal-finance/saunders" },
          { name: "Streetwise By James Mackintosh", href: "/personal-finance/mackintosh" },
        ],
      },
    ],
  },

  Health: {
    title: "Health",
    href: "/health",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Healthcare", href: "/health/healthcare" },
          { name: "Pharma", href: "/health/pharma" },
          { name: "Wellness", href: "/health/wellness" },
        ],
      },
      {
        heading: "More",
        links: [{ name: "Your Health By Sumathi Reddy", href: "/health/reddy" }],
      },
    ],
  },

  Style: {
    title: "Style",
    href: "/style",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Beauty", href: "/style/beauty" },
          { name: "Design", href: "/style/design" },
          { name: "Fashion", href: "/style/fashion" },
        ],
      },
      {
        heading: "More",
        links: [{ name: "My Monday Morning", href: "/style/my-monday-morning" }],
      },
    ],
  },

  Sports: {
    title: "Sports",
    href: "/sports",
    columns: [
      {
        heading: "Topics",
        links: [
          { name: "Baseball", href: "/sports/baseball" },
          { name: "Basketball", href: "/sports/basketball" },
          { name: "Football", href: "/sports/football" },
          { name: "Golf", href: "/sports/golf" },
          { name: "Hockey", href: "/sports/hockey" },
          { name: "Olympics", href: "/sports/olympics" },
          { name: "Soccer", href: "/sports/soccer" },
          { name: "Tennis", href: "/sports/tennis" },
        ],
      },
      {
        heading: "More",
        links: [{ name: "Jason Gay", href: "/sports/jason-gay" }],
      },
    ],
  },
};

const allCategories = [
  "World",
  "Business",
  "U.S.",
  "Politics",
  "Economy",
  "Tech",
  "Markets & Finance",
  "Opinion",
  "Free Expression",
  "Arts",
  "Lifestyle",
  "Real Estate",
  "Personal Finance",
  "Health",
  "Style",
  "Sports",
];

export function getCategoryRoute(title: string): string {
  const map: Record<string, string> = {
    World: "/world",
    Business: "/business",
    "U.S.": "/us",
    Politics: "/politics",
    Economy: "/economy",
    Tech: "/tech",
    "Markets & Finance": "/markets-finance",
    Opinion: "/opinion",
    "Free Expression": "/free-expression",
    Arts: "/arts",
    Lifestyle: "/lifestyle",
    "Real Estate": "/real-estate",
    "Personal Finance": "/personal-finance",
    Health: "/health",
    Style: "/style",
    Sports: "/sports",
  };
  return map[title] || `/${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

export const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const currentMenu = activeTab ? megaMenuData[activeTab] : null;

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
      <nav className="bg-white border-b border-[#e2e2e2] relative z-40 select-none overflow-visible">
        <Container className="relative xl:px-[3.5cm]">
          {/* Single Line Clean Navigation Row */}
          <div className="flex items-center justify-between py-0 overflow-visible relative">
            <div className="flex items-center justify-between w-full">
              {allCategories.map((title, index) => {
                const isActive = activeTab === title;
                const isFirst = index === 0;

                return (
                  <div
                    key={title}
                    className="relative flex-shrink-0"
                    onMouseEnter={() => setActiveTab(title)}
                    onMouseLeave={() => setActiveTab(null)}
                  >
                    <Link
                      href={getCategoryRoute(title)}
                      className={`text-[12px] font-sans ${isFirst ? "pr-1.5 pl-0" : "px-1.5"} py-1.5 inline-block whitespace-nowrap tracking-normal transition-colors relative z-50 ${
                        isActive
                          ? "bg-[#f8f8f8] font-bold text-black border-t border-l border-r border-[#d4d4d4] rounded-t-sm -mb-[2px] pb-[7px]"
                          : "border border-transparent text-[#444444] font-normal hover:text-black hover:underline"
                      }`}
                    >
                      {title}
                    </Link>
                  </div>
                );
              })}

              {/* Integrated Search Icon */}
              <div className="flex items-center flex-shrink-0 relative z-50">
                <Link
                  href="/search"
                  aria-label="Search"
                  className="py-1 pl-1 text-[#444444] hover:text-black transition-colors focus:outline-none cursor-pointer"
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
                </Link>
              </div>
            </div>
          </div>

        {/* Full-Bleed Mega Menu Overlay with Centralized Content Alignment */}
        {activeTab && currentMenu && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-screen bg-[#f8f8f8] border-b border-[#d4d4d4] top-full pt-5 pb-8 z-40 shadow-sm"
            onMouseEnter={() => setActiveTab(activeTab)}
            onMouseLeave={() => setActiveTab(null)}
          >
            <Container>
              <div className="flex items-start pl-64 lg:pl-[260px]">
                {currentMenu.columns.map((col, idx) => {
                  const sections: MenuSection[] = col.sections
                    ? col.sections
                    : [{ heading: col.heading!, links: col.links! }];

                  return (
                    <React.Fragment key={idx}>
                      <div className="w-[175px] flex-shrink-0 space-y-6">
                        {sections.map((sec) => (
                          <div key={sec.heading} className="space-y-2.5">
                            <h3 className="text-[12.5px] font-bold text-black tracking-tight font-sans">
                              {sec.heading}
                            </h3>
                            <ul className="space-y-1.5">
                              {sec.links.map((link) => (
                                <li key={link.name}>
                                  <a
                                    href={link.href}
                                    className="text-[12px] font-sans text-[#666666] hover:text-black hover:underline transition-colors block leading-snug"
                                  >
                                    {link.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Vertical Divider line between columns */}
                      {idx < currentMenu.columns.length - 1 && (
                        <div className="w-px bg-[#d4d4d4] self-stretch min-h-[180px] mx-10 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </Container>
          </div>
        )}
      </Container>
    </nav>
    </>
  );
};

export default Navbar;
