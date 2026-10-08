"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import SearchOverlay from "@/components/search/SearchOverlay";
import { slugifyAuthorName } from "@/data/authors";

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
  Interviews: {
    title: "Interviews",
    href: "/interviews",
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
  "Interviews",
];

export function getCategoryRoute(title: string, writerPrefix: string = ""): string {
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
    Interviews: "/interviews",
  };
  const base = map[title] || `/${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  return writerPrefix ? `${writerPrefix}${base}` : base;
}

import { getArticleViews } from "@/lib/viewTracker";

export interface MegaMenuArticle {
  id: string;
  title: string;
  summary: string;
  image: string;
  slug: string;
  viewsCount?: number;
}

function getFallbackArticlesForCategory(categoryTitle: string): MegaMenuArticle[] {
  const norm = (categoryTitle || "").toLowerCase().trim();

  if (norm.includes("business")) {
    return [
      {
        id: "biz-1",
        title: "Strategic Capital Deployment Reaches Record Highs",
        summary: "Venture capital funds and private equity firms expand commitments across market leaders...",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fm=webp&fit=crop&w=300&q=80",
        slug: "business-policy-shifts",
        viewsCount: 142,
      },
      {
        id: "biz-2",
        title: "Executive Leadership Trends Reshaping Enterprise",
        summary: "Modern management frameworks guide executives through international trade complexities...",
        image: "/images/world/jose_rizal.jpg",
        slug: "business-economic-outlook",
        viewsCount: 118,
      },
      {
        id: "biz-3",
        title: "Corporate Earnings Surpass Analysts' Expectations",
        summary: "Quarterly balance sheets reflect strong consumer demand and supply chain efficiency...",
        image: "/images/world/trump_tariffs.jpg",
        slug: "us-strategy-in-business",
        viewsCount: 96,
      },
      {
        id: "biz-4",
        title: "Small Business Innovation Drives Regional Growth",
        summary: "Entrepreneurial ventures introduce digital automation tools to scale local operations...",
        image: "/images/world/perez_hilton.jpg",
        slug: "innovation-in-business",
        viewsCount: 85,
      },
    ];
  }

  if (norm.includes("tech")) {
    return [
      {
        id: "tech-1",
        title: "Artificial Intelligence Models Transform Enterprise Tech",
        summary: "Next-generation generative models streamline software development and data processing...",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?fm=webp&fit=crop&w=300&q=80",
        slug: "tech-policy-shifts",
        viewsCount: 165,
      },
      {
        id: "tech-2",
        title: "Global Cybersecurity Standards Updated Amid Cloud Threats",
        summary: "Security researchers outline multi-layered defense protocols to safeguard cloud networks...",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fm=webp&fit=crop&w=300&q=80",
        slug: "tech-economic-outlook",
        viewsCount: 130,
      },
      {
        id: "tech-3",
        title: "Semiconductor Production Facilities Scale Manufacturing",
        summary: "Chips manufacturers invest billions into advanced fabrication facilities to meet demand...",
        image: "/images/world/crypto_midterm.jpg",
        slug: "us-strategy-in-tech",
        viewsCount: 104,
      },
      {
        id: "tech-4",
        title: "Quantum Computing Milestones Open New Frontiers",
        summary: "Research labs demonstrate record qubit stability for complex mathematical algorithms...",
        image: "/images/world/mercury_retrograde.jpg",
        slug: "innovation-in-tech",
        viewsCount: 92,
      },
    ];
  }

  if (norm.includes("market") || norm.includes("finance")) {
    return [
      {
        id: "mkt-1",
        title: "Global Stock Markets Rally Following Federal Rate Moves",
        summary: "Equity indices post strong gains across major trading hubs in New York, London, and Tokyo...",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?fm=webp&fit=crop&w=300&q=80",
        slug: "markets-finance-policy-shifts",
        viewsCount: 154,
      },
      {
        id: "mkt-2",
        title: "Banking Consolidations Create New Financial Heavyweights",
        summary: "Mergers and acquisitions reshape institutional lending standards and commercial deposits...",
        image: "/images/world/crypto_midterm.jpg",
        slug: "markets-finance-economic-outlook",
        viewsCount: 122,
      },
      {
        id: "mkt-3",
        title: "Digital Currencies Stabilize Amid Institutional Adoption",
        summary: "Financial firms incorporate crypto assets into diversified wealth management portfolios...",
        image: "/images/world/trump_tariffs.jpg",
        slug: "us-strategy-in-markets-finance",
        viewsCount: 98,
      },
      {
        id: "mkt-4",
        title: "Bond Yields Shift as Treasury Issues Guidance",
        summary: "Fixed income investors adjust yield curve expectations following updated fiscal disclosures...",
        image: "/images/world/venezuela_city.jpg",
        slug: "innovation-in-markets-finance",
        viewsCount: 88,
      },
    ];
  }

  if (norm.includes("politic")) {
    return [
      {
        id: "pol-1",
        title: "Bipartisan Coalition Reaches Milestone Infrastructure Deal",
        summary: "Legislators approve landmark funding for national transport and clean energy modernization...",
        image: "/images/world/trump_venezuela.jpg",
        slug: "politics-policy-shifts",
        viewsCount: 148,
      },
      {
        id: "pol-2",
        title: "Key Congressional Committees Debating Electoral Reform",
        summary: "Lawmakers review proposed voting security guidelines ahead of upcoming midterm elections...",
        image: "/images/world/afiuni_judge.jpg",
        slug: "politics-economic-outlook",
        viewsCount: 125,
      },
      {
        id: "pol-3",
        title: "International Summit Focuses on Diplomatic Alliances",
        summary: "World leaders gather to negotiate trade agreements and regional security initiatives...",
        image: "/images/world/jose_rizal.jpg",
        slug: "us-strategy-in-politics",
        viewsCount: 102,
      },
      {
        id: "pol-4",
        title: "State Governors Announce Regional Economic Policies",
        summary: "Gubernatorial coalitions outline joint tax incentives to spur local industrial growth...",
        image: "/images/world/gaza_grieve.jpg",
        slug: "innovation-in-politics",
        viewsCount: 84,
      },
    ];
  }

  return [
    {
      id: `${norm}-1`,
      title: `Key Legislative Shifts Impacting ${categoryTitle} Policies`,
      summary: `Regulatory frameworks governing ${categoryTitle.toLowerCase()} undergo major updates following bipartisan deliberations...`,
      image: "/images/world/afiuni_judge.jpg",
      slug: `${norm}-policy-shifts`,
      viewsCount: 135,
    },
    {
      id: `${norm}-2`,
      title: `Global Economic Outlook & Impact on ${categoryTitle}`,
      summary: `Analysts examine quarterly performance indicators across major markets, highlighting resilience amid shifting trade dynamics...`,
      image: "/images/world/venezuela_city.jpg",
      slug: `${norm}-economic-outlook`,
      viewsCount: 112,
    },
    {
      id: `${norm}-3`,
      title: `U.S. Strategy in ${categoryTitle}: Industry Trust & Reform`,
      summary: `Federal leaders shift strategy toward long-term market stability and infrastructure investments...`,
      image: "/images/world/trump_venezuela.jpg",
      slug: `us-strategy-in-${norm}`,
      viewsCount: 95,
    },
    {
      id: `${norm}-4`,
      title: `The Breakthrough Innovations Transforming ${categoryTitle}`,
      summary: `Industry pioneers reveal how next-generation operations restructure supply chains and consumer expectations...`,
      image: "/images/world/perez_hilton.jpg",
      slug: `innovation-in-${norm}`,
      viewsCount: 82,
    },
  ];
}

function getCategoryMostReadArticles(categoryTitle: string): MegaMenuArticle[] {
  if (typeof window === "undefined" || !categoryTitle) return getFallbackArticlesForCategory(categoryTitle || "News");

  try {
    let posts: any[] = [];
    const p1 = localStorage.getItem("wsj_posts");
    if (p1) posts = [...posts, ...JSON.parse(p1)];
    const p2 = localStorage.getItem("wsj_published_posts");
    if (p2) posts = [...posts, ...JSON.parse(p2)];

    const normalize = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const targetNorm = normalize(categoryTitle);

    const catPosts = posts.filter((p: any) => {
      if (!p || p.status !== "Published") return false;
      const catNorm = normalize(p.category || "");
      const subsNorm = (p.subCategories || []).map((s: string) => normalize(s));
      const placementNorm = normalize(p.homepagePlacement || "");

      return (
        catNorm === targetNorm ||
        catNorm.includes(targetNorm) ||
        (targetNorm.length >= 4 && catNorm.includes(targetNorm)) ||
        subsNorm.includes(targetNorm) ||
        placementNorm.includes(targetNorm)
      );
    });

    const fallback = getFallbackArticlesForCategory(categoryTitle);

    const formatted: MegaMenuArticle[] = catPosts.map((p: any) => {
      const s = p.slug || String(p.id) || "article";
      const v = getArticleViews(s);
      return {
        id: p.id || s,
        title: p.title,
        summary:
          p.subheadline ||
          p.cardSummary ||
          (p.bodyContent ? p.bodyContent.replace(/<[^>]+>/g, " ").trim().slice(0, 80) + "..." : ""),
        image: p.thumbnail || fallback[0].image,
        slug: s,
        viewsCount: v,
      };
    });

    fallback.forEach((fb) => {
      if (!formatted.some((f) => f.slug === fb.slug || f.title === fb.title)) {
        const v = getArticleViews(fb.slug, fb.viewsCount || 60);
        formatted.push({ ...fb, viewsCount: v });
      }
    });

    formatted.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    return formatted.slice(0, 4);
  } catch (e) {
    return getFallbackArticlesForCategory(categoryTitle);
  }
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [hoveredOffsetLeft, setHoveredOffsetLeft] = useState<number>(0);
  const [hoveredWidth, setHoveredWidth] = useState<number>(0);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [writerPrefix, setWriterPrefix] = useState<string>("");
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("wsj_user") || localStorage.getItem("wsj_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u && (u.role || "").toLowerCase() === "writer") {
          const writerName = u.full_name || u.name || (u.email ? u.email.split("@")[0] : "writer");
          const slug = slugifyAuthorName(writerName);
          if (slug) setWriterPrefix(`/${slug}`);
        }
      }
    } catch (e) {}
  }, []);

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
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-5 md:px-6 relative flex items-center justify-between">
          <div className="flex items-end h-[36px] overflow-x-auto md:overflow-x-visible no-scrollbar justify-start md:justify-between w-full flex-1 gap-1 sm:gap-1.5 md:gap-0">
            {allCategories.map((title, index) => {
              const isHovered = activeTab === title;

              return (
                <div
                  key={title}
                  ref={(el) => { tabRefs.current[title] = el; }}
                  onMouseEnter={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 768) return;
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
                    href={getCategoryRoute(title, writerPrefix)}
                    prefetch={false}
                    className={`text-[13px] font-['Century_Gothic','Publica_Sans_Light','Kumbh_Sans',sans-serif] ${
                      index === 0 ? "pl-0 pr-2.5" : "px-2.5"
                    } pb-2 pt-1 border transition-all whitespace-nowrap leading-none ${
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

            {/* Integrated Search Icon - Positioned next to Interviews */}
            <div className="flex items-end flex-shrink-0 relative z-50 pb-2 pl-2 sm:pl-2.5 h-full">
              <button
                onClick={() => setIsSearchOverlayOpen(true)}
                aria-label="Search"
                className="p-0 text-[#111111] hover:text-[#990000] transition-colors focus:outline-none cursor-pointer flex items-center justify-center translate-y-0"
                suppressHydrationWarning
              >
                <svg
                  className="w-4 h-4 text-[#111111] hover:text-[#990000]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
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

        {/* Category Sub-Categories & MOST READ 100% Full-Width Hover Dropdown Panel */}
        {activeTab && (
          <div
            onMouseEnter={() => setActiveTab(activeTab)}
            onMouseLeave={() => setActiveTab(null)}
            className="hidden md:block absolute left-0 right-0 w-full top-[36px] bg-[#f9f9f8] border-b border-t border-[#dcd6cd] shadow-xl z-40 py-6 min-h-[190px] transition-all duration-150 animate-fadeIn select-none"
          >
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-5 md:px-6 relative flex flex-col md:flex-row gap-8 items-stretch">
              {/* Seamless patch div: erases the top border line ONLY directly underneath the hovered tab */}
              {hoveredWidth > 0 && (
                <div
                  className="absolute -top-[25px] bg-[#f9f9f8] h-[3px] z-50 transition-all duration-150"
                  style={{
                    left: `${hoveredOffsetLeft}px`,
                    width: `${hoveredWidth}px`,
                  }}
                />
              )}

              {/* Column 1 (Left): Sub-Categories / SECTIONS */}
              {currentMenu?.columns?.[0]?.links && currentMenu.columns[0].links.length > 0 && (
                <div className="w-full md:w-[220px] shrink-0 self-stretch border-b md:border-b-0 md:border-r border-[#dcd6cd] pb-4 md:pb-0 pr-0 md:pr-6">
                  <h3 className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#666666] mb-3">
                    SECTIONS
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {currentMenu.columns[0].links.map((link) => (
                      <Link
                        key={link.name}
                        href={writerPrefix ? `${writerPrefix}${link.href}` : link.href}
                        className="block text-[13.5px] font-sans font-semibold text-[#222222] hover:text-[#990000] hover:underline transition-colors py-0.5"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Column 2 & 3 (Right): MOST READ IN [CATEGORY] - 4 Articles in 2 Columns (Col 1: 2 articles, Col 2: 2 articles) matching Image 2 */}
              <div className="flex-1 w-full pl-0 md:pl-2">
                <h3 className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#666666] mb-4">
                  MOST READ IN {activeTab.toUpperCase()}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {getCategoryMostReadArticles(activeTab).map((article) => (
                    <Link
                      key={article.id || article.slug}
                      href={writerPrefix ? `${writerPrefix}/article/${article.slug}` : `/article/${article.slug}`}
                      className="flex items-start gap-3.5 group cursor-pointer"
                    >
                      {/* Left Thumbnail Image */}
                      <div className="w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] shrink-0 overflow-hidden bg-gray-100 border border-[#dcd6cd] rounded-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Right Title & Brief Summary Paragraph */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-bold text-[13.5px] leading-[1.25] text-[#111111] group-hover:text-[#990000] group-hover:underline line-clamp-1">
                          {article.title}
                        </h4>
                        <p className="font-sans text-[11.5px] leading-[1.38] text-[#555555] mt-1 line-clamp-2">
                          {article.summary}
                        </p>
                      </div>
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
