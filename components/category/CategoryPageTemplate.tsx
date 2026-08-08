"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";

interface CategoryPageTemplateProps {
  categoryTitle?: string;
}

export default function CategoryPageTemplate({
  categoryTitle = "Real Estate",
}: CategoryPageTemplateProps) {
  const [currentBannerSlide, setCurrentBannerSlide] = useState(1);
  const [searchLocation, setSearchLocation] = useState("");

  const bannerProperties = [
    {
      id: 1,
      title: "Lake Oswego, Oregon",
      image:
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Cambridge, Ontario",
      image:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "New York, New York",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const luxuryCards = [
    {
      id: 1,
      badge: "New Development",
      location: "Miami, United States",
      price: "From $1,107,000",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      badge: "Virtual listing",
      location: "Friday Harbor, USA",
      price: "$28,000,000",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      badge: "",
      location: "Santa Barbara, USA",
      price: "$6,499,000",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const mostPopular = [
    {
      id: "1",
      slug: "billions-reviving-downtown-detroit-skyline",
      title:
        "He Spent Billions Reviving Downtown Detroit. Now He Wants to Remake Its Skyline.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "2",
      slug: "high-powered-real-estate-fund-college-students",
      title:
        "This High-Powered Real-Estate Fund Is Run by College Students",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "3",
      slug: "nyc-pied-a-terre-owners-dodge-new-tax",
      title:
        "NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "4",
      slug: "fdr-grandson-lists-texas-ranch-21m",
      badge: "EXCLUSIVE",
      title:
        "FDR’s Grandson Lists Texas Ranch for $21.5 Million",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "5",
      slug: "san-francisco-apartment-tower-generational-fight",
      title:
        "A San Francisco Apartment Tower Ignites a Generational Fight Over Housing",
      image:
        "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const relatedOpinion = [
    {
      id: "1",
      slug: "mamdani-class-enemies-list",
      author: "THE EDITORIAL BOARD",
      title: "Mamdani’s Class Enemies List",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "2",
      slug: "mao-meets-manhattan",
      author: "WILLIAM MCGURN",
      title: "Mao Meets Manhattan",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "3",
      slug: "florida-makes-property-tax-mistake",
      author: "THE EDITORIAL BOARD",
      title: "Florida Makes a Property Tax Mistake",
      image:
        "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "4",
      slug: "will-new-york-tax-my-upstate-house",
      author: "MITCH ZIMMER",
      title: "Will New York Tax My Upstate House?",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "5",
      slug: "miami-evolving-new-york-once-did",
      author: "",
      title: "Miami Is Evolving the Way New York Once Did",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const videoArticles = [
    {
      id: "v1",
      slug: "billionaires-dont-just-want-mansions-they-want-entire-block",
      title: "Billionaires Don't Just Want Mansions. They Want the Entire Block",
      summary:
        "Deep-pocketed buyers—aka “landmaxxers”—are increasingly snapping up neighboring properties to create private compounds, with amenities from parking to padel. Photo: 1 OAK Studios",
      duration: "1:08",
      date: "July 31, 2026",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "v2",
      slug: "how-140-million-crypto-real-estate-empire-fell-apart",
      title: "How a $140 Million Crypto Real Estate Empire Fell Apart",
      summary:
        "WSJ's Tomas Navia investigates how RealToken, a crypto company that pitched itself as the future of real estate, went from attracting thousands of investors to liquidating its $140 million portfolio. Illustration: June Bang",
      duration: "23:20",
      date: "July 28, 2026",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "v3",
      slug: "can-this-guy-get-people-to-live-in-emptiest-downtown",
      title: "Can This Guy Get People to Live in America's Emptiest Downtown?",
      summary:
        "America's downtowns are suffering a crisis. Office work has migrated into the suburbs, leaving abandoned buildings and blighted conditions behind. Photo: Theo Stroomer for WSJ",
      duration: "1:09",
      date: "June 29, 2026",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "v4",
      slug: "how-messi-became-miamis-billion-dollar-economic-engine",
      title: "How Messi Became Miami's Billion-Dollar Economic Engine",
      summary:
        "Lionel Messi has been a one-man economic stimulus engine for the Miami area, boosting its international profile, drawing hordes of tourists and powering sectors including real estate, hospitality and retail. Photo: Getty Images",
      duration: "1:04",
      date: "May 30, 2026",
      image:
        "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "v5",
      slug: "the-fight-over-nantuckets-eroding-coastline",
      title: "The Fight Over Nantucket's Eroding Coastline",
      summary:
        "With rising seas threatening Nantucket homes, a divisive vote over an erosion-control system offers a glimpse into the costly climate battles facing coastal towns. Photo: Uncredited",
      duration: "7:25",
      date: "May 23, 2026",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const mostRecentAuthors = [
    {
      name: "Ashlea Ebeling",
      role: "Reporter",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Rebecca Picciotto",
      role: "Reporter",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Kerry Barger",
      role: "Senior Platform Editor",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const moreInRealEstate = [
    {
      id: "m1",
      slug: "where-reit-investors-have-earned-best-returns",
      tag: "JOURNAL REPORTS",
      title: "Where REIT Investors Have Earned the Best Returns",
      summary:
        "The U.S. market has been best for real-estate investment trusts over the past 10 years, led by funds focused on data centers.",
      author: "Derek Horstmeyer",
      comments: 12,
      date: "August 6, 2026",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m2",
      slug: "gary-indiana-wants-comeback-demolish-downtown",
      tag: "U.S.",
      title:
        "Gary, Indiana, Wants a Comeback. Step One: Demolish a Chunk of Downtown.",
      summary:
        "With an $80 million blight elimination campaign, the steel town is clearing out 7,000 abandoned properties to make room for new investment.",
      author: "Jeanne Whalen",
      comments: 167,
      date: "August 4, 2026",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m3",
      slug: "star-trek-ethan-peck-spock-gregory-peck",
      tag: "HOUSE CALL",
      title:
        "‘Star Trek’ Co-Star Ethan Peck on His Spock Role and Grandfather Gregory Peck",
      summary:
        "The actor recalls his battle with perfectionism, his mom’s encouragement and his “Spellbound” revelation.",
      author: "Marc Myers",
      comments: 0,
      date: "August 4, 2026",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m4",
      slug: "jpmorgan-chase-750b-housing-supply-homeownership",
      tag: "FINANCE",
      title:
        "JPMorgan Chase to Invest $750 Billion to Boost U.S. Housing Supply, Homeownership",
      summary:
        "The bank aims to finance one million affordable housing units and provide loans to 200,000 first-time home buyers through 2035.",
      author: "Joseph De Avila",
      comments: 0,
      date: "August 3, 2026",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m5",
      slug: "take-this-home-for-a-test-drive",
      tag: "IN THE TRENCHES",
      title: "Take This Home for a Test-Drive",
      summary:
        "Three real-estate agents reveal their most over-the-top open houses, from Ferrari viewings to interpretive dance.",
      author: "Robyn A. Friedman",
      comments: 9,
      date: "August 3, 2026",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const whatsNews = [
    {
      id: "wn1",
      slug: "trump-frustrated-homeland-security",
      title:
        "Trump Is Increasingly Frustrated With His Homeland Security Secretary",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "wn2",
      slug: "why-slow-job-growth-labor-market",
      title:
        "Why Slow Job Growth Doesn't Mean the Labor Market Is in Trouble",
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "wn3",
      slug: "why-impossible-restaurant-reservation",
      title: "Why It's Impossible to Get a Restaurant Reservation",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "wn4",
      slug: "situational-awareness-400m-stealth-chip-startup",
      title:
        "Situational Awareness Bets $400 Million on Stealth Chip Startup After Crash",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "wn5",
      slug: "hegseth-strips-security-clearance-air-force-secretary",
      title:
        "Hegseth Strips Security Clearance From Biden’s Air Force Secretary",
      image:
        "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const dianomiAds = [
    {
      id: "d1",
      title: "What is the latest on ETFs?",
      tag: "MarketViews",
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "d2",
      title:
        "Uncover the latest trends in retirement planning strategies.",
      tag: "MarketViews",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "d3",
      title: "Stay updated with the newest gold market developments.",
      tag: "MarketViews",
      image:
        "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "d4",
      title:
        "Robotics and Artificial Intelligence. Discover the trends.",
      tag: "MarketViews",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "d5",
      title: "Get the latest commodity trends from industry experts.",
      tag: "MarketViews",
      image:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "d6",
      title:
        "The Latest Market Thinking From The World’s Finance Experts",
      tag: "MarketViews",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        <Header />
        <StickyHeaderBar />

        {/* ==================================================================== */}
        {/* 1. TOP CORCORAN CAROUSEL ADVERTISEMENT BANNER                       */}
        {/* ==================================================================== */}
        <div className="w-full bg-white border-b border-[#e2e2e2] pt-2 pb-4">
          <Container>
            <div className="text-center text-[10px] font-sans text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
              Advertisement
            </div>

            <div className="relative w-full overflow-hidden bg-gray-900 rounded-none shadow-xs">
              {/* Carousel Images Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
                {bannerProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="relative group overflow-hidden aspect-[16/9] md:aspect-[4/3] cursor-pointer"
                  >
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4 text-white">
                      <span className="font-sans font-bold text-sm sm:text-base tracking-tight drop-shadow-md">
                        {prop.title}
                      </span>
                      <span className="text-lg font-bold group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Left/Right Buttons */}
              <button
                type="button"
                onClick={() =>
                  setCurrentBannerSlide(
                    currentBannerSlide === 0 ? 2 : currentBannerSlide - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center font-bold text-sm shadow-md hover:bg-white transition-colors z-10"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentBannerSlide((currentBannerSlide + 1) % 3)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center font-bold text-sm shadow-md hover:bg-white transition-colors z-10"
              >
                ›
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10">
                <span className="w-2 h-2 rounded-full bg-white block" />
                <span className="w-2 h-2 rounded-full bg-white/50 block" />
              </div>
            </div>

            {/* Sponsor Bar */}
            <div className="flex items-center justify-center space-x-4 py-3 bg-white border border-t-0 border-[#e2e2e2] text-xs font-sans text-[#333333]">
              <span className="font-semibold">See more at corcoran.com</span>
              <span className="text-[#cccccc]">|</span>
              <span className="font-serif italic font-extrabold text-base tracking-wider text-black">
                corcoran
              </span>
            </div>
          </Container>
        </div>

        <div className="py-4 bg-white">
          <Container>
            {/* ============================================================== */}
            {/* 2. MAIN CATEGORY TOPIC HEADER (DYNAMIC HEADING)                */}
            {/* ============================================================== */}
            <div className="w-full border-t border-b border-[#111111] py-2 text-center mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#111111] tracking-tight inline-block transform-gpu scale-y-[1.18] tracking-tighter">
                {categoryTitle}
              </h1>
            </div>

            {/* ============================================================== */}
            {/* 3. MAIN SECTION GRID: LUXURY SEARCH & HERO + SIDEBAR          */}
            {/* ============================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 pb-8 border-b border-[#e2e2e2]">
              {/* Left Main Column (8 Cols) */}
              <div className="lg:col-span-8">
                {/* Property / Topic Search Widget */}
                <div className="mb-8 pb-6 border-b border-[#e2e2e2]">
                  <div className="mb-3">
                    <h2 className="text-lg font-sans font-bold text-[#111111]">
                      Search {categoryTitle}
                    </h2>
                    <p className="text-[11px] font-sans text-gray-500">
                      Mansion Global is part of Dow Jones&apos;s Barron&apos;s Group
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Search Inputs Box */}
                    <div className="md:col-span-5 space-y-3">
                      <div className="flex items-center">
                        <select className="bg-white border border-[#cccccc] border-r-0 text-xs font-sans px-2.5 py-2 outline-none text-[#333333] cursor-pointer">
                          <option>Buy</option>
                          <option>Rent</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Select A Location"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="flex-1 bg-white border border-[#cccccc] text-xs font-sans px-2.5 py-2 outline-none text-gray-800 placeholder-gray-400 min-w-0"
                        />
                        <button className="bg-[#8b734b] hover:bg-[#78623d] text-white text-xs font-sans font-bold px-3 py-2 flex items-center space-x-1 transition-colors shrink-0">
                          <span>Search</span>
                          <span>🔍</span>
                        </button>
                      </div>

                      <div className="text-[11px] font-sans text-gray-600 flex items-center space-x-1 pt-1">
                        <span>Listings by:</span>
                        <strong className="font-serif font-black text-black tracking-wider uppercase text-xs">
                          MANSION GLOBAL
                        </strong>
                      </div>
                    </div>

                    {/* 3 Featured Cards */}
                    <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
                      {luxuryCards.map((card) => (
                        <div
                          key={card.id}
                          className="border border-[#e2e2e2] rounded-xs overflow-hidden group cursor-pointer bg-white"
                        >
                          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                            <img
                              src={card.image}
                              alt={card.location}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {card.badge && (
                              <span className="absolute top-1 left-1 bg-black/80 text-white text-[8px] font-sans font-bold px-1 py-0.5 uppercase tracking-wider">
                                {card.badge}
                              </span>
                            )}
                          </div>
                          <div className="p-1.5">
                            <div className="text-[10px] font-sans font-medium text-gray-800 truncate">
                              {card.location}
                            </div>
                            <div className="text-[10.5px] font-sans font-bold text-black mt-0.5 truncate">
                              {card.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hero Article */}
                <Link
                  href="/article/was-his-home-connecticut-or-florida-tax-bill"
                  className="block group mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Left: Featured Image */}
                    <div className="md:col-span-7 w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-xs">
                      <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                        alt="Was His Home Connecticut or Florida?"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Right: Article Details */}
                    <div className="md:col-span-5 space-y-2">
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-gray-500 block">
                        BUSINESS
                      </span>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#111111] leading-tight group-hover:underline mb-2 tracking-tight">
                        Was His Home Connecticut or Florida? The Difference Is a $13 Million Tax Bill
                      </h2>
                      <p className="text-xs font-sans text-[#333333] leading-relaxed mb-3">
                        As states look to tax people with multiple luxury homes, one estate is fighting back.
                      </p>
                      <div className="text-xs font-sans text-gray-600">
                        By <span className="font-bold text-[#111111]">Ashlea Ebeling</span>
                      </div>
                      <div className="text-xs font-sans text-gray-500 flex items-center space-x-1.5 pt-1">
                        <span>💬 28</span>
                        <span>•</span>
                        <span className="text-[#cc0000] font-semibold">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 3-Card Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#e2e2e2]">
                  {/* Card 1 */}
                  <Link
                    href="/article/nyc-pied-a-terre-owners-dodge-new-tax"
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80"
                          alt="NYC Pied-à-Terre"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-gray-600 block">
                        REAL ESTATE
                      </span>
                      <h3 className="text-base font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                        NYC’s Pied-à-Terre Owners Hunt for Creative Ways to Dodge New Tax
                      </h3>
                      <p className="text-xs font-sans text-gray-700 leading-relaxed">
                        Owners of second homes are “apoplectic” over the levy. Some are highlighting flaws to try to reduce their home&apos;s value or moving in family members.
                      </p>
                      <div className="text-[11px] font-sans text-gray-500">
                        By <span className="font-bold text-[#111111]">Rebecca Picciotto</span>
                      </div>
                      <div className="text-[11px] font-sans text-gray-500 flex items-center space-x-1">
                        <span>💬 1,274</span>
                        <span>•</span>
                        <span>3 hours ago</span>
                      </div>
                    </div>
                  </Link>

                  {/* Card 2 */}
                  <Link
                    href="/article/dc-home-market-billionaire-bump"
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80"
                          alt="D.C. Home Market"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-gray-600 block">
                        WSJ HOMES
                      </span>
                      <h3 className="text-base font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                        The D.C. Home Market Gets a Billionaire Bump
                      </h3>
                      <p className="text-xs font-sans text-gray-700 leading-relaxed">
                        Plus, a couple builds their dream home in Ireland and a record-breaking deal just outside of San Francisco.
                      </p>
                      <div className="text-[11px] font-sans text-gray-500">
                        By <span className="font-bold text-[#111111]">Kerry Barger</span>
                      </div>
                      <div className="text-[11px] font-sans text-gray-500">
                        5 hours ago
                      </div>
                    </div>
                  </Link>

                  {/* Card 3 */}
                  <Link
                    href="/article/house-of-the-week-new-zealand"
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80"
                          alt="House of the Week"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-gray-600 block">
                        HOMES
                      </span>
                      <h3 className="text-base font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                        House of the Week: Built Off-Site and Hauled to Remote New Zealand
                      </h3>
                      <p className="text-xs font-sans text-gray-700 leading-relaxed">
                        Because the terrain was too rugged, the owners constructed the home in one location and hauled it to the property in sections.
                      </p>
                      <div className="text-[11px] font-sans text-gray-500">
                        By <span className="font-bold text-[#111111]">Sarah Paynter</span>
                      </div>
                      <div className="text-[11px] font-sans text-gray-500 flex items-center space-x-1">
                        <span>💬 23</span>
                        <span>•</span>
                        <span>6 hours ago</span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* 3-Card Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#e2e2e2] mt-6">
                  {/* Card 1: Paid Program */}
                  <div className="space-y-2 bg-[#f9f9f9] p-3 rounded-xs border border-gray-100">
                    <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80"
                        alt="Corcoran Paid Program"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[9.5px] font-sans font-bold uppercase tracking-wider text-gray-500 block">
                      PAID PROGRAM: CORCORAN
                    </span>
                    <h3 className="text-base font-serif font-bold leading-tight text-[#111111]">
                      Be swoony. Be dusky. Be spellbound. Be home.
                    </h3>
                    <p className="text-xs font-sans text-gray-600 leading-relaxed">
                      Visit corcoran.com to find your next home.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <Link
                    href="/article/mirrored-new-york-home-blends-nature"
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80"
                          alt="Mirrored NY Home"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="inline-block bg-[#111111] text-white text-[9px] font-sans font-bold px-1.5 py-0.5 uppercase tracking-wider mb-1">
                        EXCLUSIVE
                      </span>
                      <h3 className="text-base font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                        A Mirrored New York Home That Blends Into Nature Lists for $15 Million
                      </h3>
                      <p className="text-xs font-sans text-gray-700 leading-relaxed">
                        The contemporary house in Westchester County has a reflective facade and a glass bridge.
                      </p>
                      <div className="text-[11px] font-sans text-gray-500">
                        By <span className="font-bold text-[#111111]">E.B. Solomon</span>
                      </div>
                      <div className="text-[11px] font-sans text-gray-500">
                        7 hours ago
                      </div>
                    </div>
                  </Link>

                  {/* Card 3 */}
                  <Link
                    href="/article/washington-dc-billionaire-boomtown"
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=80"
                          alt="Washington D.C. Boomtown"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-gray-600 block">
                        PRIVATE PROPERTIES
                      </span>
                      <h3 className="text-base font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                        Washington, D.C., Is America’s Newest Billionaire Boomtown
                      </h3>
                      <p className="text-xs font-sans text-gray-700 leading-relaxed">
                        Cabinet officials and tech moguls are snapping up trophy properties, pushing the area&apos;s luxury housing market to new highs.
                      </p>
                      <div className="text-[11px] font-sans text-gray-500">
                        By <span className="font-bold text-[#111111]">Rachel Kurzius</span>
                      </div>
                      <div className="text-[11px] font-sans text-gray-500 flex items-center space-x-1">
                        <span>💬 57</span>
                        <span>•</span>
                        <span>August 7, 2026</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Sidebar Column (4 Cols) */}
              <div className="lg:col-span-4 lg:border-l lg:border-[#e2e2e2] lg:pl-6 space-y-6">
                {/* Most Popular in Category */}
                <div>
                  <h3 className="text-base font-sans font-bold text-[#111111] mb-4 pb-1 border-b border-[#e2e2e2]">
                    Most Popular in {categoryTitle}
                  </h3>
                  <div className="space-y-3">
                    {mostPopular.map((item) => (
                      <Link
                        key={item.id}
                        href={`/article/${item.slug}`}
                        className="block group"
                      >
                        <div className="flex justify-between gap-3 pb-2.5 border-b border-gray-100 last:border-b-0">
                          <h4 className="text-xs font-sans font-bold leading-snug text-[#111111] group-hover:underline flex-1">
                            {item.badge && (
                              <span className="inline-block border border-[#111111] text-[#111111] text-[9px] font-sans font-bold px-1 py-0.2 uppercase tracking-wider mr-1.5 align-middle">
                                {item.badge}
                              </span>
                            )}
                            {item.title}
                          </h4>
                          <div className="w-14 h-14 shrink-0 bg-gray-100 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sidebar Advertisement Box */}
                <div className="w-full text-center space-y-1">
                  <div className="text-[10px] font-sans text-gray-500 uppercase tracking-widest font-semibold">
                    Advertisement
                  </div>
                  <div className="w-full h-64 border border-[#e2e2e2] bg-white p-3 relative text-left rounded-xs">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-black text-xs font-bold p-1 rounded-full border border-gray-200 inline-flex items-center justify-center w-6 h-6"
                      title="Refresh Advertisement"
                    >
                      ↻
                    </button>
                  </div>
                </div>

                {/* Related Opinion */}
                <div className="pt-2">
                  <h3 className="text-base font-sans font-bold text-[#990000] mb-4 pt-3 border-t border-[#990000]">
                    Related Opinion
                  </h3>
                  <div className="space-y-4">
                    {relatedOpinion.map((item) => (
                      <Link
                        key={item.id}
                        href={`/article/${item.slug}`}
                        className="block group"
                      >
                        <div className="flex justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1 space-y-1">
                            {item.author && (
                              <div className="text-[10px] font-sans font-bold uppercase text-gray-600 tracking-wider">
                                {item.author}
                              </div>
                            )}
                            <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                              {item.title}
                            </h4>
                          </div>
                          <div className="w-12 h-12 shrink-0 bg-gray-100 overflow-hidden rounded-full border border-gray-200">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Related Topics */}
                <div className="pt-2">
                  <h3 className="text-sm font-sans font-bold text-[#111111] mb-3 pt-3 border-t border-[#111111]">
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3.5 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-sans font-semibold text-[#111111] rounded-full cursor-pointer transition-colors">
                      Commercial
                    </span>
                    <span className="px-3.5 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-sans font-semibold text-[#111111] rounded-full cursor-pointer transition-colors">
                      Luxury Homes
                    </span>
                  </div>
                </div>

                {/* Bottom Sidebar Ad Placeholder */}
                <div className="w-full py-12 bg-[#f2f2f2] border border-[#e2e2e2] text-center text-xs text-gray-500 uppercase font-sans tracking-wider font-semibold">
                  Advertisement
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 5. LUXURY HOMES SECTION                                        */}
            {/* ============================================================== */}
            <div className="mb-10 pb-8 border-b border-[#e2e2e2]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="border-t border-[#111111] pt-3 mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-[#111111]">
                      Luxury Homes
                    </h2>
                    <Link
                      href="#"
                      className="text-xs font-sans font-bold text-[#111111] hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Featured Left Card */}
                    <div className="md:col-span-5 space-y-2">
                      <Link
                        href="/article/howard-schultz-sells-hawaii-home"
                        className="block group"
                      >
                        <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-3">
                          <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                            alt="Howard Schultz Hawaii Home"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-lg font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                          Former Starbucks CEO Howard Schultz Sells His Hawaii Home for $36 Million
                        </h3>
                      </Link>
                      <div className="text-xs font-sans text-gray-500">
                        By <span className="font-bold text-[#111111]">Sarah Paynter</span>
                      </div>
                      <div className="text-xs font-sans text-gray-500">
                        August 7, 2026
                      </div>
                    </div>

                    {/* Right 2x2 Grid */}
                    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link
                        href="/article/san-francisco-ai-boom-record-breaking-home-sale"
                        className="block group pb-3 border-b border-gray-100 sm:border-b-0"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            San Francisco’s AI Boom Fuels Record-Breaking Home Sale Just Beyond the City
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">Libertina Brandt</span>
                          </div>
                          <div className="text-[11px] font-sans text-gray-500 flex items-center space-x-1">
                            <span>💬 58</span>
                            <span>•</span>
                            <span>August 6, 2026</span>
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/article/branding-mogul-miami-beach-home-lists-68m"
                        className="block group pb-3 border-b border-gray-100 sm:border-b-0"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            A Branding Mogul’s Miami Beach Home Lists for $68.5 Million
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">E.B. Solomon</span>
                          </div>
                          <div className="text-[11px] font-sans text-gray-500">
                            August 6, 2026
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/article/ramshackle-hut-cliff-edge-dream-home"
                        className="block group pt-2 border-t border-gray-100"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            It Was a Ramshackle Hut on the Edge of a Cliff. They Made It a Dream Home.
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">Ruth Bloomfield</span> | Photography by Eoin O&apos;Conaill for WSJ
                          </div>
                          <div className="text-[11px] font-sans text-gray-500">
                            August 6, 2026
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/article/sheila-johnson-sells-virginia-home"
                        className="block group pt-2 border-t border-gray-100"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            BET Co-Founder Sheila Johnson Sells Virginia Home for $3.15 Million
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">Sarah Paynter</span>
                          </div>
                          <div className="text-[11px] font-sans text-gray-500 flex items-center space-x-1">
                            <span>💬 25</span>
                            <span>•</span>
                            <span>August 5, 2026</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 lg:border-l lg:border-[#e2e2e2] lg:pl-6">
                  <div className="w-full py-16 bg-[#f2f2f2] border border-[#e2e2e2] text-center text-xs text-gray-500 uppercase font-sans tracking-wider font-semibold">
                    Advertisement
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 6. COMMERCIAL SECTION                                          */}
            {/* ============================================================== */}
            <div className="mb-10 pb-8 border-b border-[#e2e2e2]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="border-t border-[#111111] pt-3 mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-[#111111]">
                      Commercial
                    </h2>
                    <Link
                      href="#"
                      className="text-xs font-sans font-bold text-[#111111] hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Featured Left Card */}
                    <div className="md:col-span-5 space-y-2">
                      <Link
                        href="/article/billions-reviving-downtown-detroit-skyline"
                        className="block group"
                      >
                        <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-3">
                          <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                            alt="Downtown Detroit Skyline"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-lg font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                          He Spent Billions Reviving Downtown Detroit. Now He Wants to Remake Its Skyline.
                        </h3>
                      </Link>
                      <div className="text-xs font-sans text-gray-500">
                        By <span className="font-bold text-[#111111]">Nicholas G. Miller</span>
                      </div>
                      <div className="text-xs font-sans text-gray-500 flex items-center space-x-1">
                        <span>💬 265</span>
                        <span>•</span>
                        <span>August 6, 2026</span>
                      </div>
                    </div>

                    {/* Right 2x2 Grid */}
                    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link
                        href="/article/mamdani-pied-a-terre-tax-rollout-nyc-elites"
                        className="block group pb-3 border-b border-gray-100 sm:border-b-0"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            Mamdani’s Pied-à-Terre Tax Rollout is Unsettling New York City Elites
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">Craig Karmin</span>
                          </div>
                          <div className="text-[11px] font-sans text-gray-500">
                            August 5, 2026
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/article/inspections-180-ny-buildings-no-structural-problems"
                        className="block group pb-3 border-b border-gray-100 sm:border-b-0"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            Inspections of 180 New York Buildings Reveal No Structural Problems
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">Will Parker</span>
                          </div>
                          <div className="text-[11px] font-sans text-gray-500 flex items-center space-x-1">
                            <span>💬 14</span>
                            <span>•</span>
                            <span>August 5, 2026</span>
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/article/high-powered-real-estate-fund-college-students"
                        className="block group pt-2 border-t border-gray-100"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            This High-Powered Real-Estate Fund Is Run by College Students
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">Lily Belle Poling</span>
                          </div>
                          <div className="text-[11px] font-sans text-gray-500 flex items-center space-x-1">
                            <span>💬 198</span>
                            <span>•</span>
                            <span>August 4, 2026</span>
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/article/wealthy-renters-living-rent-stabilized-nyc-apartments"
                        className="block group pt-2 border-t border-gray-100"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-serif font-bold leading-snug text-[#111111] group-hover:underline">
                            The Wealthy Renters Living in Rent-Stabilized NYC Apartments
                          </h4>
                          <div className="text-[11px] font-sans text-gray-500">
                            By <span className="font-bold text-[#111111]">Craig Karmin</span>
                          </div>
                          <div className="text-[11px] font-sans text-gray-500">
                            July 29, 2026
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 lg:border-l lg:border-[#e2e2e2] lg:pl-6">
                  <div className="w-full py-16 bg-[#f2f2f2] border border-[#e2e2e2] text-center text-xs text-gray-500 uppercase font-sans tracking-wider font-semibold">
                    Advertisement
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 7. VIDEO SECTION                                               */}
            {/* ============================================================== */}
            <div className="mb-10 pb-8 border-b border-[#e2e2e2]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="border-t border-[#111111] pt-3 mb-6">
                    <h2 className="text-xl font-sans font-bold text-[#111111]">
                      Video
                    </h2>
                  </div>
                  {videoArticles.map((video) => (
                    <Link
                      key={video.id}
                      href={`/article/${video.slug}`}
                      className="block group"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pb-6 border-b border-gray-100 last:border-b-0">
                        {/* Video Thumbnail */}
                        <div className="sm:col-span-5 relative aspect-[16/10] bg-gray-100 overflow-hidden rounded-xs">
                          <img
                            src={video.image}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 left-2 bg-black/80 text-white font-sans text-[11px] font-bold px-2 py-0.5 rounded-xs flex items-center space-x-1">
                            <span className="text-[10px]">▶</span>
                            <span>{video.duration}</span>
                          </div>
                        </div>

                        {/* Video Text */}
                        <div className="sm:col-span-7 space-y-1.5">
                          <h3 className="text-lg font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                            {video.title}
                          </h3>
                          <p className="text-xs font-sans text-[#555555] leading-relaxed">
                            {video.summary}
                          </p>
                          <div className="text-[11px] font-sans text-gray-500 pt-1">
                            {video.date}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="lg:col-span-4 lg:border-l lg:border-[#e2e2e2] lg:pl-6">
                  <div className="w-full py-24 bg-[#f2f2f2] border border-[#e2e2e2] text-center text-xs text-gray-500 uppercase font-sans tracking-wider font-semibold">
                    Advertisement
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 8. MOST RECENT AUTHORS SECTION                                 */}
            {/* ============================================================== */}
            <div className="mb-10 pb-8 border-b border-[#e2e2e2]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="border-t border-[#111111] pt-3 mb-6">
                    <h2 className="text-xl font-sans font-bold text-[#111111]">
                      Most Recent Authors
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {mostRecentAuthors.map((author, idx) => (
                      <div
                        key={author.name}
                        className={`flex items-center justify-between py-2 ${
                          idx !== mostRecentAuthors.length - 1 ? "sm:border-r sm:border-[#e2e2e2] sm:pr-6" : ""
                        }`}
                      >
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#111111]">
                            {author.name}
                          </h3>
                          <p className="text-xs font-sans text-gray-500 mt-0.5">
                            {author.role}
                          </p>
                        </div>
                        <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 lg:border-l lg:border-[#e2e2e2] lg:pl-6">
                  <div className="w-full py-8 bg-[#f2f2f2] border border-[#e2e2e2] p-4 text-center text-xs text-gray-500 uppercase font-sans tracking-wider font-semibold">
                    Advertisement
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 9. MORE IN CATEGORY FEED & WHAT'S NEWS                         */}
            {/* ============================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 pb-8 border-b border-[#e2e2e2]">
              {/* Main Column */}
              <div className="lg:col-span-8">
                <div className="border-t border-[#111111] pt-3 mb-6">
                  <h2 className="text-xl font-serif font-bold text-[#111111]">
                    More in {categoryTitle}
                  </h2>
                </div>

                <div className="space-y-6">
                  {moreInRealEstate.map((item) => (
                    <Link
                      key={item.id}
                      href={`/article/${item.slug}`}
                      className="block group"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pb-6 border-b border-gray-100 last:border-b-0">
                        {/* Image */}
                        <div className="sm:col-span-5 aspect-[4/3] bg-gray-100 overflow-hidden rounded-xs">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Content */}
                        <div className="sm:col-span-7 space-y-1.5">
                          <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-gray-500 block">
                            {item.tag}
                          </span>
                          <h3 className="text-xl font-serif font-bold leading-tight text-[#111111] group-hover:underline">
                            {item.title}
                          </h3>
                          <p className="text-xs font-sans text-[#444444] leading-relaxed">
                            {item.summary}
                          </p>
                          <div className="text-xs font-sans text-gray-600">
                            By <span className="font-bold text-[#111111]">{item.author}</span>
                          </div>
                          <div className="text-xs font-sans text-gray-500 flex items-center space-x-1.5">
                            {item.comments > 0 && <span>💬 {item.comments} • </span>}
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Button */}
                <button
                  type="button"
                  className="border border-[#cccccc] hover:border-black bg-white font-sans font-bold text-xs text-[#333333] px-6 py-2.5 rounded-xs mx-auto block text-center my-8 cursor-pointer transition-colors"
                >
                  View All
                </button>
              </div>

              {/* Sidebar Column: What's News */}
              <div className="lg:col-span-4 lg:border-l lg:border-[#e2e2e2] lg:pl-6 space-y-6">
                <div>
                  <h3 className="text-base font-sans font-bold text-[#111111] mb-4 pb-1 border-b border-[#e2e2e2]">
                    What’s News
                  </h3>
                  <div className="space-y-4">
                    {whatsNews.map((item) => (
                      <Link
                        key={item.id}
                        href={`/article/${item.slug}`}
                        className="block group"
                      >
                        <div className="flex justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                          <h4 className="text-xs font-sans font-bold leading-snug text-[#111111] group-hover:underline flex-1">
                            {item.title}
                          </h4>
                          <div className="w-14 h-14 shrink-0 bg-gray-100 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sidebar Corcoran Ad */}
                <div className="w-full py-16 bg-[#f2f2f2] border border-[#e2e2e2] p-4 text-center">
                  <div className="text-[10px] font-sans text-gray-500 uppercase tracking-widest font-semibold mb-2">
                    Advertisement
                  </div>
                  <div className="font-serif italic font-extrabold text-xl text-black my-2">
                    corcoran
                  </div>
                  <div className="text-[10px] font-sans text-gray-600">
                    FIND YOUR HOME AT CORCORAN.COM
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 10. EXPLORE WSJ BUY SIDE & SPONSORED ADS (DIANOMI)              */}
            {/* ============================================================== */}
            <div className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Main Column (8 Cols) */}
                <div className="lg:col-span-8">
                  {/* Explore WSJ Buy Side Header */}
                  <div className="border-t-2 border-[#5c8a8a] pt-4 mb-6">
                    <h2 className="text-lg font-sans font-bold text-[#111111]">
                      Explore WSJ Buy Side
                    </h2>
                    <p className="text-[11px] font-sans text-gray-500">
                      Reviews and recommendations, independent of The Wall Street Journal newsroom
                    </p>
                  </div>

                  {/* 3 Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pb-8 border-b border-[#e2e2e2]">
                    <div className="pr-4 border-r-0 md:border-r border-[#e2e2e2]">
                      <h3 className="font-serif font-bold text-lg text-[#111111] mb-1.5">
                        Current Mortgage Rates
                      </h3>
                      <p className="text-xs font-sans text-[#444444] leading-relaxed">
                        Mortgage rates hit a one-year high—learn how to get today&apos;s best home loan rates.
                      </p>
                    </div>

                    <div className="px-0 md:px-4 border-r-0 md:border-r border-[#e2e2e2]">
                      <h3 className="font-serif font-bold text-lg text-[#111111] mb-1.5">
                        Current Home Equity Loan Rates
                      </h3>
                      <p className="text-xs font-sans text-[#444444] leading-relaxed">
                        Learn how to get the best rate on a home equity loan.
                      </p>
                    </div>

                    <div className="pl-0 md:pl-4">
                      <h3 className="font-serif font-bold text-lg text-[#111111] mb-1.5">
                        Should I Refinance My Mortgage?
                      </h3>
                      <p className="text-xs font-sans text-[#444444] leading-relaxed">
                        Normally when someone has a low mortgage rate, they don&apos;t refinance into a higher one.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Sponsored Ads (Dianomi) */}
                  <div className="border-t border-[#e2e2e2] pt-3">
                    <div className="flex justify-between items-center mb-4 text-[11px] font-sans font-bold text-gray-600 uppercase">
                      <span>Advertisement</span>
                      <span>Dianomi</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {dianomiAds.map((ad) => (
                        <div key={ad.id} className="flex items-start space-x-3 group cursor-pointer">
                          <div className="w-16 h-16 shrink-0 bg-gray-100 overflow-hidden rounded-xs">
                            <img
                              src={ad.image}
                              alt={ad.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-sans font-bold text-[#111111] leading-snug group-hover:underline">
                              {ad.title}
                            </h4>
                            <span className="text-[10px] font-sans text-gray-500 mt-1 block">
                              {ad.tag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Column (4 Cols) */}
                <div className="lg:col-span-4 lg:border-l lg:border-[#e2e2e2] lg:pl-6">
                  <div className="w-full text-center space-y-1">
                    <div className="text-[10px] font-sans text-gray-500 uppercase tracking-widest font-semibold">
                      Advertisement
                    </div>
                    <div className="w-full border border-[#e2e2e2] bg-white overflow-hidden rounded-xs">
                      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80"
                          alt="Corcoran floating"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-white font-serif italic text-xl font-bold tracking-wide">
                            be floating
                          </span>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between bg-white border-t border-gray-100">
                        <span className="font-serif italic font-extrabold text-base tracking-wider text-black">
                          corcoran
                        </span>
                        <span className="text-gray-400 text-xs">🔇</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <StickySubscribeBar />
      </div>
      <Footer />
    </main>
  );
}
