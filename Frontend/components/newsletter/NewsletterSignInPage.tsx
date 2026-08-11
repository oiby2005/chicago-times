"use client";

import React, { useState } from "react";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";

interface NewsletterItem {
  id: string;
  title: string;
  frequency: string;
  description: string;
}

const newslettersList: NewsletterItem[] = [
  {
    id: "us",
    title: "US",
    frequency: "Weekday mornings",
    description:
      "The biggest national headlines, policy shifts and the stories shaping America — delivered before your first coffee.",
  },
  {
    id: "world",
    title: "World",
    frequency: "Daily",
    description:
      "Global affairs, conflicts, diplomacy and the international stories that move markets and minds.",
  },
  {
    id: "politics",
    title: "Politics",
    frequency: "Weekday mornings",
    description:
      "Sharp coverage of Washington, elections, legislation and the power plays behind the headlines.",
  },
  {
    id: "economy-markets",
    title: "Economy & Markets",
    frequency: "Weekday mornings",
    description:
      "Markets, macro trends, Fed watch and the numbers that matter — explained clearly, every trading day.",
  },
  {
    id: "business",
    title: "Business",
    frequency: "Daily",
    description:
      "Corporate earnings, deals, leadership moves and the strategies driving the world of business.",
  },
  {
    id: "crypto",
    title: "Crypto",
    frequency: "Weekday Morning",
    description:
      "Up to date, breaking crypto news about the latest Bitcoin, Ethereum, Blockchain, NFTs, and Altcoin trends and events.",
  },
  {
    id: "technology",
    title: "Technology",
    frequency: "Daily",
    description:
      "AI, big tech, startups and the innovations rewriting how we live and work.",
  },
  {
    id: "travel",
    title: "Travel",
    frequency: "Once a week",
    description:
      "Destinations, industry trends and smart travel intelligence for the modern globetrotter.",
  },
  {
    id: "opinion",
    title: "Opinion",
    frequency: "Twice a week",
    description:
      "Provocative columns and expert commentary on the debates that define our time.",
  },
  {
    id: "ceo-spotlight",
    title: "CEO Spotlight",
    frequency: "Once a week",
    description:
      "Exclusive profiles and insights from the executives and visionaries leading global business.",
  },
  {
    id: "sports",
    title: "Sports",
    frequency: "Daily",
    description:
      "Scores, storylines and the business of sports — from the field to the boardroom.",
  },
  {
    id: "health",
    title: "Health",
    frequency: "Once a week",
    description:
      "The latest health news, scientific trends and medical information, covered in a way that helps you make sense of the complex and constantly changing field of medical knowledge.",
  },
];

export const NewsletterSignInPage: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSelectAll = () => {
    if (selectedIds.length === newslettersList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(newslettersList.map((item) => item.id));
    }
  };

  const toggleCheckbox = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one newsletter.");
      return;
    }
    setErrorMessage("");
    setSubmitted(true);
  };

  const isAllSelected = selectedIds.length === newslettersList.length;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-yellow-100">
      {/* Existing Homepage Header (Locked) */}
      <Header />

      {/* Main Newsletter Content */}
      <main className="flex-1 w-full bg-white">
        {/* Top Gold Banner */}
        <section className="w-full bg-[#f6f5f1] py-9 sm:py-11 text-center border-b border-[#e5e4de] select-none">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#b8860b] uppercase tracking-[0.25em] mb-2.5">
              NEWSLETTERS
            </h1>
            <div className="w-12 h-[2px] bg-[#b8860b] mx-auto mb-3" />
            <p className="font-sans text-xs sm:text-[13px] text-[#666666] font-normal">
              Stay up to date with our daily newsletter
            </p>
          </div>
        </section>

        {/* Hero Headline Section */}
        <section className="w-full py-10 sm:py-14 px-4 select-none">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[32px] font-bold text-[#111111] leading-tight mb-3">
              Let the best of The Wall Street Journal news come to you.
            </h2>

            <div className="w-10 h-[2px] bg-[#b8860b] mx-auto mb-6" />

            <div className="font-sans text-[12.5px] text-[#555555] leading-relaxed max-w-[580px] mx-auto mb-8 space-y-1">
              <p>
                Select any of the free newsletters below. Then, enter your
                email address and click &quot;Sign Up.&quot;
              </p>
              <p>
                Your newsletter subscriptions with us are subject to The Wall
                Street Journal&apos;s{" "}
                <a
                  href="#"
                  className="text-[#b8860b] font-medium hover:underline"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-[#b8860b] font-medium hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Select All Button */}
            <button
              onClick={toggleSelectAll}
              className="bg-[#b8860b] hover:bg-[#996f08] text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-none transition-colors shadow-xs mx-auto block text-center cursor-pointer"
            >
              {isAllSelected ? "DESELECT ALL NEWSLETTERS" : "SELECT ALL NEWSLETTERS"}
            </button>
          </div>
        </section>

        {/* Horizontal Divider */}
        <div className="border-b border-[#e2e2e2] max-w-[840px] mx-auto mb-10 px-4" />

        {/* 2-Column Newsletter Selection Grid */}
        <section className="max-w-[840px] mx-auto px-4 mb-16 select-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left">
            {newslettersList.map((item) => {
              const isChecked = selectedIds.includes(item.id);

              return (
                <div key={item.id} className="flex items-start space-x-3 group">
                  <input
                    type="checkbox"
                    id={`checkbox-${item.id}`}
                    checked={isChecked}
                    onChange={() => toggleCheckbox(item.id)}
                    className="w-4 h-4 rounded-xs border-gray-400 text-[#b8860b] focus:ring-[#b8860b] accent-[#b8860b] cursor-pointer mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`checkbox-${item.id}`}
                      className="font-serif font-bold text-xl text-[#111111] cursor-pointer hover:text-[#b8860b] transition-colors block leading-tight"
                    >
                      {item.title}
                    </label>
                    <p className="font-sans italic text-[12px] text-[#777777] mt-0.5 mb-2">
                      {item.frequency}
                    </p>
                    <p className="font-sans text-[13px] text-[#444444] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider above Email Form */}
        <div className="border-t border-[#e2e2e2] max-w-[840px] mx-auto mb-10 px-4" />

        {/* Email Signup Form Section */}
        <section className="max-w-[840px] mx-auto px-4 pb-16">
          {submitted ? (
            <div className="bg-[#f6f5f1] border border-[#b8860b] p-6 max-w-[540px] mx-auto text-center rounded-xs shadow-xs">
              <h3 className="font-serif font-bold text-xl text-[#111111] mb-2">
                Thank You for Subscribing!
              </h3>
              <p className="font-sans text-xs text-[#555555]">
                We have saved your newsletter preferences for{" "}
                <strong className="text-black">{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              {errorMessage && (
                <div className="text-red-600 font-sans text-xs text-center mb-4 font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 max-w-[600px] mx-auto mb-4">
                {/* Email Input Field with Mail Icon */}
                <div className="relative w-full sm:w-[340px]">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 border border-[#cccccc] focus:border-[#b8860b] text-xs sm:text-sm font-sans text-[#333333] placeholder-gray-400 outline-none transition-colors rounded-none bg-white"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#b8860b] hover:bg-[#996f08] text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-none transition-colors whitespace-nowrap cursor-pointer"
                >
                  SIGN UP NOW
                </button>
              </div>

              {/* Bottom Disclaimer */}
              <p className="font-sans text-[11.5px] text-[#777777] text-center max-w-[560px] mx-auto select-none">
                You can unsubscribe at any time. By signing up you are agreeing
                to our{" "}
                <a
                  href="#"
                  className="text-[#b8860b] font-medium hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-[#b8860b] font-medium hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </section>
      </main>

      {/* Existing Homepage Footer (Locked) */}
      <Footer />
    </div>
  );
};

export default NewsletterSignInPage;
