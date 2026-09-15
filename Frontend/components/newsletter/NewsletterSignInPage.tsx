"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";

export interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: string[];
}

export const MAIN_18_CATEGORIES: CategoryGroup[] = [
  {
    id: "news",
    name: "News",
    description: "Breaking global coverage, essential morning briefings, and daily headlines.",
    icon: "📰",
    subcategories: ["U.S. News", "International News"],
  },
  {
    id: "law",
    name: "Law",
    description: "Supreme Court rulings, corporate litigation, and federal legal developments.",
    icon: "⚖️",
    subcategories: ["Criminal Cases", "Legal Affairs"],
  },
  {
    id: "politics",
    name: "Politics",
    description: "White House policy, Capitol Hill debates, and election analysis.",
    icon: "🏛️",
    subcategories: ["World Politics", "Congress", "Elections"],
  },
  {
    id: "business",
    name: "Business",
    description: "Corporate strategy, executive leadership, startup trends, and small business.",
    icon: "💼",
    subcategories: ["Corporate News", "Small Business", "Entrepreneurship", "CEOs & Executives"],
  },
  {
    id: "markets",
    name: "Markets & Finance",
    description: "Wall Street closing bells, stock movements, central banking, and currencies.",
    icon: "📈",
    subcategories: ["Stocks", "Currencies", "Banking"],
  },
  {
    id: "economy",
    name: "Economy",
    description: "Inflation reports, labor market statistics, global trade, and interest rates.",
    icon: "🌐",
    subcategories: ["Jobs & Employment", "Interest Rates"],
  },
  {
    id: "tech",
    name: "Tech",
    description: "Artificial intelligence breakthroughs, silicon valley innovations, and cybersecurity.",
    icon: "💻",
    subcategories: ["Artificial Intelligence", "Cybersecurity", "Innovation"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Hollywood releases, streaming platform updates, television, and music news.",
    icon: "🎬",
    subcategories: ["Movies", "Television", "Music", "Celebrity"],
  },
  {
    id: "arts",
    name: "Arts",
    description: "Architectural showcases, literary reviews, upcoming global brands, and culture.",
    icon: "🎨",
    subcategories: ["Upcoming Brands", "Architecture", "Books", "Culture"],
  },
  {
    id: "industries",
    name: "Industries",
    description: "Clean energy transitions, automotive shifts, manufacturing, and construction.",
    icon: "🏭",
    subcategories: ["Energy", "Automotive", "Manufacturing", "Agriculture", "Construction"],
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Haute couture designer spotlights, luxury jewelry, and runway trends.",
    icon: "👗",
    subcategories: ["Designers", "Jewelry"],
  },
  {
    id: "investing",
    name: "Investing",
    description: "Real estate trends, portfolio management, wealth strategies, and crypto markets.",
    icon: "📊",
    subcategories: ["Stocks", "Real Estate", "Wealth Management", "Crypto"],
  },
  {
    id: "health",
    name: "Health",
    description: "Medical research milestones, mental wellness, and healthcare updates.",
    icon: "🧪",
    subcategories: ["Medical Research", "Mental Health"],
  },
  {
    id: "sports",
    name: "Sports",
    description: "Scores, trade analysis, and championship coverage across premier leagues.",
    icon: "⚽",
    subcategories: ["Soccer", "Golf", "Tennis", "Cricket"],
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    description: "Destination travel guides, fine dining reviews, and automobile culture.",
    icon: "🍷",
    subcategories: ["Travel", "Food & Dining", "Cars"],
  },
  {
    id: "science",
    name: "Science",
    description: "Space exploration, climate research, and scientific discoveries.",
    icon: "🚀",
    subcategories: ["Space", "Climate", "Environment", "Research"],
  },
  {
    id: "opinions",
    name: "Opinions",
    description: "Thought-provoking columnists and independent perspectives.",
    icon: "✍️",
    subcategories: ["Opinions"],
  },
  {
    id: "editorials",
    name: "Editorials",
    description: "Editorial board positions and institutional commentary.",
    icon: "🗞️",
    subcategories: ["Editorials"],
  },
];

// Flat array of all subcategories across 18 cards
const ALL_SUBCATEGORIES_FLAT = Array.from(
  new Set(MAIN_18_CATEGORIES.flatMap((g) => g.subcategories))
);

export const NewsletterSignInPage: React.FC = () => {
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Select / Deselect All subcategories across all 18 cards
  const handleSelectAllGlobal = () => {
    if (selectedSubs.length === ALL_SUBCATEGORIES_FLAT.length) {
      setSelectedSubs([]);
    } else {
      setSelectedSubs([...ALL_SUBCATEGORIES_FLAT]);
    }
  };

  // Toggle single main category (Selects or Deselects all subcategories under it)
  const handleToggleMainCategory = (group: CategoryGroup) => {
    const allGroupSubsSelected = group.subcategories.every((sub) =>
      selectedSubs.includes(sub)
    );

    if (allGroupSubsSelected) {
      setSelectedSubs(
        selectedSubs.filter((sub) => !group.subcategories.includes(sub))
      );
    } else {
      const newSelected = new Set([...selectedSubs, ...group.subcategories]);
      setSelectedSubs(Array.from(newSelected));
    }
  };

  // Toggle single subcategory
  const handleToggleSubcategory = (sub: string) => {
    if (selectedSubs.includes(sub)) {
      setSelectedSubs(selectedSubs.filter((s) => s !== sub));
    } else {
      setSelectedSubs([...selectedSubs, sub]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (selectedSubs.length === 0) {
      setErrorMessage("Please select at least one newsletter.");
      return;
    }
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();

    // 1. Save newsletter subscription directly to Express API & MySQL database
    try {
      await fetch("http://localhost:5000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          newsletters: selectedSubs,
        }),
      });
    } catch (err) {
      console.error("Express API Newsletter fetch error:", err);
    }

    const now = new Date();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const dateStr = `${now.getDate()}-${months[now.getMonth()]},${now.getFullYear()}`;

    const newSub = {
      id: `nl-${Date.now()}`,
      email: cleanEmail,
      newsletters: selectedSubs,
      subscribedDate: dateStr,
    };

    const existingJson = localStorage.getItem("wsj_newsletter_subscribers");
    let existingSubs: any[] = [];
    if (existingJson) {
      try {
        existingSubs = JSON.parse(existingJson);
      } catch (err) {
        existingSubs = [];
      }
    }

    const updatedSubs = [newSub, ...existingSubs.filter((s: any) => (typeof s === "string" ? s : s.email).toLowerCase() !== cleanEmail)];
    localStorage.setItem(
      "wsj_newsletter_subscribers",
      JSON.stringify(updatedSubs)
    );

    window.dispatchEvent(new Event("wsj_newsletter_updated"));
    setSubmitted(true);
  };

  const isAllSelected = selectedSubs.length === ALL_SUBCATEGORIES_FLAT.length;

  // Search filter
  const filteredGroups = MAIN_18_CATEGORIES.filter((group) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    if (group.name.toLowerCase().includes(q)) return true;
    if (group.description.toLowerCase().includes(q)) return true;
    return group.subcategories.some((sub) => sub.toLowerCase().includes(q));
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-gray-200">
        <Header />
        <main className="flex-1 w-full bg-white select-none">
          {/* Black & White Gold Banner */}
          <section className="w-full bg-[#f4f4f4] py-6 sm:py-8 text-center border-b border-[#e5e5e5]">
            <div className="max-w-[1200px] mx-auto px-4">
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#111111] uppercase tracking-[0.25em] mb-1.5">
                NEWSLETTERS
              </h1>
              <div className="w-10 h-[2px] bg-[#111111] mx-auto mb-2" />
              <p className="font-sans text-xs sm:text-[13px] text-[#666666] font-normal">
                Stay up to date with our daily newsletter
              </p>
            </div>
          </section>

          <section className="w-full py-16 sm:py-24 px-4 text-center">
            <div className="max-w-[600px] mx-auto flex flex-col items-center border border-[#e5e5e5] rounded-none p-8 sm:p-12 bg-white">
              <div className="w-12 h-12 rounded-full border-2 border-[#111111] flex items-center justify-center mb-5 text-[#111111]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mb-3">
                You&apos;re all signed up!
              </h2>

              <p className="font-sans text-xs sm:text-sm text-[#555555] leading-relaxed max-w-[460px] mx-auto mb-8">
                Thanks for subscribing. We have saved your preferences for <strong className="text-black">{email}</strong>.
              </p>

              <Link
                href="/"
                className="bg-[#111111] hover:bg-[#333333] text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-8 transition-colors shadow-none rounded-none inline-block"
              >
                BACK TO HOME
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-gray-200">
      <Header />

      <main className="flex-1 w-full bg-white">
        {/* Top Monochrome Banner matching Image 1 */}
        <section className="w-full bg-[#f4f4f4] py-6 sm:py-8 text-center border-b border-[#e5e5e5] select-none">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#111111] uppercase tracking-[0.25em] mb-1.5">
              NEWSLETTERS
            </h1>
            <div className="w-10 h-[2px] bg-[#111111] mx-auto mb-2" />
            <p className="font-sans text-xs sm:text-[13px] text-[#666666] font-normal">
              Stay up to date with our daily newsletter
            </p>
          </div>
        </section>

        {/* Hero Headline & Intro Text matching Image 1 */}
        <section className="w-full py-8 px-4 select-none bg-white">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] leading-tight mb-2">
              Let the best of Times Chicago news come to you.
            </h2>

            <div className="w-8 h-[2px] bg-[#111111] mx-auto mb-4" />

            <div className="font-sans text-xs sm:text-[13px] text-[#555555] leading-relaxed max-w-[620px] mx-auto space-y-1">
              <p>
                Select any of the free newsletters below. Then, enter your email address and click &quot;Sign Up.&quot;
              </p>
              <p>
                Your newsletter subscriptions with us are subject to Times Chicago&apos;s{" "}
                <a href="#" className="text-[#111111] font-semibold underline hover:text-[#555555]">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#111111] font-semibold underline hover:text-[#555555]">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Top Toolbar: Centered SELECT ALL Button */}
        <section className="max-w-[1140px] mx-auto px-4 pt-2 pb-6 flex justify-center">
          <button
            type="button"
            onClick={handleSelectAllGlobal}
            className="bg-[#111111] hover:bg-[#333333] text-white font-sans font-bold text-xs uppercase tracking-wider py-2.5 px-8 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            {isAllSelected ? "DESELECT ALL NEWSLETTERS" : "SELECT ALL NEWSLETTERS"}
          </button>
        </section>

        {/* Horizontal Divider */}
        <div className="border-b border-[#e2e2e2] max-w-[1140px] mx-auto mb-8 px-4" />

        {/* Exactly 18 Main Categories Cards Grid (Black / White / Grey theme) */}
        <section className="max-w-[1140px] mx-auto px-4 mb-12 select-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              const selectedCount = group.subcategories.filter((sub) =>
                selectedSubs.includes(sub)
              ).length;
              const totalCount = group.subcategories.length;
              const isAllChecked = selectedCount === totalCount;
              const isPartiallyChecked = selectedCount > 0 && !isAllChecked;

              return (
                <div
                  key={group.id}
                  className={`bg-white border rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between ${
                    isAllChecked
                      ? "border-[#94a3b8] bg-[#f8fafc] shadow-2xs"
                      : isPartiallyChecked
                      ? "border-[#cbd5e1] bg-[#fafafa]"
                      : "border-[#e5e5e5]"
                  }`}
                >
                  <div>
                    {/* Header: Category Name + Master Toggle Button (No icon symbols) */}
                    <div className="flex items-start justify-between pb-3 border-b border-[#f0f0f0] mb-3">
                      <div className="pr-2">
                        <h3 className="font-serif font-bold text-lg text-[#111111] leading-snug">
                          {group.name}
                        </h3>
                        <p className="font-sans text-[11.5px] text-[#666666] leading-tight mt-0.5">
                          {group.description}
                        </p>
                      </div>

                      {/* Master Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleMainCategory(group)}
                        className={`mt-0.5 shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold uppercase transition-all flex items-center space-x-1 cursor-pointer border ${
                          isAllChecked
                            ? "bg-[#475569] text-white border-[#475569]"
                            : isPartiallyChecked
                            ? "bg-[#e2e8f0] text-[#1e293b] border-[#94a3b8]"
                            : "bg-[#f8f8f8] text-[#666666] border-[#cccccc] hover:bg-[#efefef]"
                        }`}
                        title="Click to toggle all subcategories in this card"
                      >
                        <input
                          type="checkbox"
                          checked={isAllChecked}
                          ref={(input) => {
                            if (input) input.indeterminate = isPartiallyChecked;
                          }}
                          onChange={() => handleToggleMainCategory(group)}
                          className="w-3.5 h-3.5 accent-[#334155] cursor-pointer"
                        />
                        <span>Select</span>
                      </button>
                    </div>

                    {/* Clean Subcategories List */}
                    <div className="space-y-1 py-1">
                      <div className="grid grid-cols-1 gap-1">
                        {group.subcategories.map((sub) => {
                          const isSubChecked = selectedSubs.includes(sub);
                          return (
                            <label
                              key={sub}
                              className={`flex items-center justify-between p-2 rounded-xl border text-xs font-sans cursor-pointer transition-all ${
                                isSubChecked
                                  ? "bg-[#f1f5f9] border-[#cbd5e1] text-[#0f172a] font-semibold"
                                  : "bg-[#fafafa] border-[#f0f0f0] text-[#444444] hover:bg-[#f2f2f2]"
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <input
                                  type="checkbox"
                                  checked={isSubChecked}
                                  onChange={() => handleToggleSubcategory(sub)}
                                  className="w-3.5 h-3.5 accent-[#334155] rounded border-gray-400 focus:ring-0 cursor-pointer"
                                />
                                <span>{sub}</span>
                              </div>
                              {isSubChecked && (
                                <span className="text-[10px] text-[#334155] font-mono font-bold">✓</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGroups.length === 0 && (
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-12 text-center my-8">
              <p className="font-serif text-lg text-[#111111] font-bold mb-2">No newsletters found</p>
              <p className="font-sans text-xs text-[#666666] mb-4">No category matches "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="bg-[#111111] text-white font-sans text-xs font-bold px-4 py-2 rounded-xl"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* Divider above Email Form */}
        <div className="border-t border-[#e2e2e2] max-w-[840px] mx-auto mb-10 px-4" />

        {/* Email Signup Form Section matching Image 2 in Black / White / Grey palette */}
        <section className="max-w-[840px] mx-auto px-4 pb-16">
          <form onSubmit={handleSubmit} className="w-full max-w-[640px] mx-auto text-center" suppressHydrationWarning>
            {errorMessage && (
              <div className="text-red-600 font-sans text-xs text-center mb-4 font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 w-full mb-4">
              {/* Email Input Field with Mail Icon matching Image 2 */}
              <div className="relative w-full sm:w-[380px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 border border-[#cccccc] focus:border-[#111111] text-xs sm:text-sm font-sans text-[#111111] placeholder-gray-400 outline-none transition-colors bg-white rounded-none"
                />
              </div>

              {/* Submit Button matching Image 2 in Black palette */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#111111] hover:bg-[#333333] text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-8 transition-colors whitespace-nowrap cursor-pointer rounded-none"
              >
                SIGN UP NOW
              </button>
            </div>

            {/* Bottom Disclaimer matching Image 2 */}
            <p className="font-sans text-[11.5px] text-[#777777] text-center max-w-[560px] mx-auto select-none">
              You can unsubscribe at any time. By signing up you are agreeing to our{" "}
              <a href="#" className="text-[#111111] font-semibold underline hover:text-[#555555]">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#111111] font-semibold underline hover:text-[#555555]">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NewsletterSignInPage;
