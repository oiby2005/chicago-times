"use client";

import React, { useState } from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";

interface TocItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "what-are-cookies", label: "1. What Are Cookies?" },
  { id: "types-of-cookies", label: "2. Types of Cookies We Use" },
  { id: "how-we-use", label: "3. How We Use Cookies" },
  { id: "managing-cookies", label: "4. Managing Cookies" },
  { id: "changes-policy", label: "5. Changes to This Policy" },
  { id: "contact-us", label: "6. Contact Us" },
];

export default function CookieClient() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setIsTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#111111] select-none">
      <div>
        <Header />
        <StickyHeaderBar />

        <main className="bg-white py-8 sm:py-12 border-b border-[#EAE6DA]">
          <Container>
            {/* Header / Legal Document Title Bar */}
            <div className="text-center max-w-4xl mx-auto mb-8">
              <span className="font-sans font-extrabold text-[11px] tracking-[0.22em] text-[#990000] uppercase block mb-2">
                LEGAL DOCUMENT • COOKIE MANAGEMENT
              </span>

              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight mb-2">
                Cookie Policy
              </h1>

              <span className="font-mono text-[11px] tracking-widest text-[#666666] uppercase block">
                LAST UPDATED: JUNE 30, 2026
              </span>

              {/* 100% Matching Double Header Lines */}
              <div className="w-full flex flex-col gap-[3px] mt-6 mb-8">
                <div className="w-full h-[1.5px] bg-[#111111]"></div>
                <div className="w-full h-[1.5px] bg-[#111111]"></div>
              </div>
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ==================== LEFT SIDEBAR: STICKY TABLE OF CONTENTS (4 of 12 cols ~ 33%) ==================== */}
              <div className="lg:col-span-4 sticky top-20 z-10 self-start w-full">
                <div className="bg-white border border-[#E2DDD0] p-4 sm:p-5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className={`w-full flex items-center justify-between text-left lg:pb-3 lg:mb-3 lg:border-b lg:border-[#E5E0D3] ${
                      isTocOpen ? "pb-3 mb-3 border-b border-[#E5E0D3]" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[#990000] text-[16px]">🌐</span>
                      <h3 className="font-serif font-bold text-[15px] uppercase tracking-wider text-[#111111]">
                        COOKIE POLICY SECTIONS
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1 lg:hidden text-[#990000] font-sans text-xs font-bold">
                      <span>{isTocOpen ? "Hide" : "Show"}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isTocOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <nav className={`space-y-0.5 ${isTocOpen ? "block" : "hidden lg:block"}`}>
                    {TOC_ITEMS.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-3 py-1.5 text-[12.5px] font-sans transition-colors rounded-none flex items-center cursor-pointer ${
                            isActive
                              ? "bg-[#FAF5F5] text-[#990000] font-bold border-l-2 border-[#990000]"
                              : "text-[#555555] hover:text-[#990000] hover:bg-[#FAF5F5]"
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* ==================== RIGHT MAIN COLUMN: DOCUMENT SECTIONS (8 of 12 cols ~ 67%) ==================== */}
              <div className="lg:col-span-8 bg-white border border-[#E2DDD0] p-6 sm:p-10 shadow-xs space-y-8 font-sans text-[14px] leading-relaxed text-[#333333]">

                {/* Introduction */}
                <section id="intro" className="scroll-mt-28">
                  <h2 className="font-serif font-bold text-[24px] text-[#111111] pb-2 mb-4 border-b border-[#E5E0D3]">
                    Introduction
                  </h2>
                  <div className="space-y-4">
                    <p>
                      This Cookie Policy explains how <strong className="font-bold text-[#111111]">Times Chicago</strong> (&ldquo;Times Chicago,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) uses cookies and similar tracking technologies when you visit our website and use our online services.
                    </p>
                    <p>
                      By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy, unless you disable them through your browser settings.
                    </p>
                  </div>
                </section>

                {/* 1. What Are Cookies? */}
                <section id="what-are-cookies" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">1.</span> What Are Cookies?
                  </h3>
                  <div className="space-y-3">
                    <p>
                      Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They help websites function properly, improve user experience, remember preferences, and provide analytical information.
                    </p>
                    <p>
                      Cookies do not generally contain information that personally identifies you, but they may be linked to personal information that you voluntarily provide.
                    </p>
                  </div>
                </section>

                {/* 2. Types of Cookies We Use */}
                <section id="types-of-cookies" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-4">
                    <span className="text-[#990000] font-bold mr-1">2.</span> Types of Cookies We Use
                  </h3>

                  <div className="space-y-4">
                    {/* ESSENTIAL COOKIES */}
                    <div className="bg-[#F8F5EC] border border-[#E5E0D3] p-4 sm:p-5">
                      <h4 className="font-sans font-bold text-[13px] uppercase tracking-wider text-[#111111] mb-1.5">
                        ESSENTIAL COOKIES
                      </h4>
                      <p className="text-[13px] text-[#555555]">
                        These cookies are necessary for the operation of our website. They enable core features such as page navigation, secure access, account login, and website functionality. These cookies cannot be disabled.
                      </p>
                    </div>

                    {/* PERFORMANCE AND ANALYTICS COOKIES */}
                    <div className="bg-[#F8F5EC] border border-[#E5E0D3] p-4 sm:p-5">
                      <h4 className="font-sans font-bold text-[13px] uppercase tracking-wider text-[#111111] mb-1.5">
                        PERFORMANCE AND ANALYTICS COOKIES
                      </h4>
                      <p className="text-[13px] text-[#555555]">
                        These cookies help us understand how visitors interact with our website by collecting anonymous statistical information such as pages visited, time spent, traffic sources, device type, browser settings, and geographic region.
                      </p>
                    </div>

                    {/* FUNCTIONALITY COOKIES */}
                    <div className="bg-[#F8F5EC] border border-[#E5E0D3] p-4 sm:p-5">
                      <h4 className="font-sans font-bold text-[13px] uppercase tracking-wider text-[#111111] mb-1.5">
                        FUNCTIONALITY COOKIES
                      </h4>
                      <p className="text-[13px] text-[#555555]">
                        These cookies remember your preferences and settings, including language selection, region, login preferences, and display settings, providing a more personalized browsing experience.
                      </p>
                    </div>

                    {/* ADVERTISING COOKIES */}
                    <div className="bg-[#F8F5EC] border border-[#E5E0D3] p-4 sm:p-5">
                      <h4 className="font-sans font-bold text-[13px] uppercase tracking-wider text-[#111111] mb-1.5">
                        ADVERTISING COOKIES
                      </h4>
                      <p className="text-[13px] text-[#555555]">
                        Advertising cookies may be used to display relevant advertisements based on your interests and browsing activity, measure campaign effectiveness, and limit ad repetitions.
                      </p>
                    </div>

                    {/* THIRD-PARTY COOKIES */}
                    <div className="bg-[#F8F5EC] border border-[#E5E0D3] p-4 sm:p-5">
                      <h4 className="font-sans font-bold text-[13px] uppercase tracking-wider text-[#111111] mb-1.5">
                        THIRD-PARTY COOKIES
                      </h4>
                      <p className="text-[13px] text-[#555555]">
                        Some features of our website rely on trusted third party services (such as analytics providers, embedded videos, social media tools, and advertising networks). These third parties may place cookies on your device. Times Chicago does not control third-party cookies.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 3. How We Use Cookies */}
                <section id="how-we-use" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">3.</span> How We Use Cookies
                  </h3>
                  <p>
                    We use cookies to operate and secure our website, remember user preferences, improve website performance, analyze visitor behavior, enhance user experience, measure website traffic, support marketing activities, and detect fraud.
                  </p>
                </section>

                {/* 4. Managing Cookies */}
                <section id="managing-cookies" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">4.</span> Managing Cookies
                  </h3>
                  <div className="space-y-3">
                    <p>
                      Most web browsers allow you to control cookies through their settings. You may choose to accept all cookies, reject non-essential cookies, delete existing cookies, or receive notifications before cookies are stored.
                    </p>
                    <p>
                      Please note that disabling certain cookies may affect the functionality and performance of our website.
                    </p>
                  </div>
                </section>

                {/* 5. Changes to This Cookie Policy */}
                <section id="changes-policy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">5.</span> Changes to This Cookie Policy
                  </h3>
                  <p>
                    We may update this Cookie Policy periodically to reflect changes in technology, legal requirements, or our business practices. The updated version will be posted on this page with a revised &ldquo;Last Updated&rdquo; date.
                  </p>
                </section>

                {/* 6. Contact Us */}
                <section id="contact-us" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">6.</span> Contact Us
                  </h3>
                  <p className="mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>

                  <div className="bg-[#F8F5EC] border border-[#E5E0D3] p-5 font-sans text-[13.5px] text-[#333333]">
                    <strong className="font-bold text-[#111111] block mb-1 text-[14px]">
                      Times Chicago
                    </strong>
                    <p className="leading-snug text-[#555555]">
                      2316 Eastgate St #160<br />
                      Walla Walla, Washington (WA) 99362<br />
                      United States<br />
                      Email: <a href="mailto:info@timeschicago.com" className="font-bold text-[#00558C] hover:underline">info@timeschicago.com</a>
                    </p>
                  </div>
                </section>

              </div>

            </div>
          </Container>
        </main>
      </div>

      <StickySubscribeBar />
      <Footer />
    </div>
  );
}
