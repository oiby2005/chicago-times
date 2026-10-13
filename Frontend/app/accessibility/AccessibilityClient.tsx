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
  { id: "commitment", label: "1. Our Accessibility Commitment" },
  { id: "features", label: "2. Accessibility Features and Practices" },
  { id: "improvements", label: "3. Ongoing Improvements and Known Limitations" },
  { id: "tips", label: "4. Tips for Using the Website" },
  { id: "reporting", label: "5. Reporting an Accessibility Problem" },
  { id: "contact", label: "6. Contact Information" },
  { id: "updates", label: "7. Updates to This Statement" },
];

export default function AccessibilityClient() {
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
              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight">
                WEBSITE ACCESSIBILITY STATEMENT
              </h1>
              <p className="mt-2 text-xs font-sans text-[#666666]">
                Website: <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a>
                <span className="mx-2">|</span>
                Effective Date: October 10, 2026
                <span className="mx-2">|</span>
                Last Updated: October 10, 2026
              </p>
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ==================== LEFT SIDEBAR: STICKY TABLE OF CONTENTS ==================== */}
              <div className="lg:col-span-4 sticky top-20 z-10 self-start w-full">
                <div className="bg-white border border-[#E2DDD0] p-3 sm:p-4 lg:p-5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className={`w-full flex items-center justify-between text-left lg:pb-3 lg:mb-3 lg:border-b lg:border-[#E5E0D3] gap-1.5 ${
                      isTocOpen ? "pb-3 mb-3 border-b border-[#E5E0D3]" : ""
                    }`}
                  >
                    <div className="flex items-center min-w-0 pr-1">
                      <h3 className="font-serif font-bold text-[11px] xs:text-[12px] sm:text-[14px] lg:text-[15px] uppercase tracking-tight sm:tracking-wider text-[#111111] whitespace-nowrap truncate">
                        ACCESSIBILITY SECTIONS
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1 lg:hidden text-[#990000] font-sans text-[10.5px] xs:text-xs font-bold bg-[#FAF5F5] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-[#F5E6E6] shrink-0 whitespace-nowrap">
                      <span>{isTocOpen ? "Hide" : `Show (${TOC_ITEMS.length} Sections)`}</span>
                      <svg
                        className={`w-3 h-3 xs:w-3.5 xs:h-3.5 transition-transform duration-200 shrink-0 ${isTocOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
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

              {/* ==================== RIGHT MAIN COLUMN: DOCUMENT SECTIONS ==================== */}
              <div className="lg:col-span-8 bg-white border border-[#E2DDD0] p-6 sm:p-10 shadow-xs space-y-8 font-sans text-[14px] leading-relaxed text-[#333333]">
                {/* Introduction */}
                <section id="intro" className="scroll-mt-28">
                  <h2 className="font-serif font-bold text-[22px] text-[#111111] pb-2 mb-4 border-b border-[#E5E0D3]">
                    Introduction
                  </h2>
                  <p>
                    Times Chicago LLC is committed to making its website and digital content accessible to as many people as possible, including people with disabilities. We aim to improve the usability of <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a> and to support visitors who use assistive technologies, keyboard navigation, screen magnification, captions, or other accessibility tools.
                  </p>
                </section>

                {/* 1. Our Accessibility Commitment */}
                <section id="commitment" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    1. Our Accessibility Commitment
                  </h2>
                  <p className="mb-3">
                    We aim to make our website content understandable and usable for a broad audience. Accessibility is an ongoing effort, and we may review and improve website design, navigation, editorial presentation, and technical features over time.
                  </p>
                  <p>
                    We seek to consider recognized accessibility practices, including the Web Content Accessibility Guidelines (WCAG), when developing or updating website features. This statement does not represent a certification that every page or feature currently conforms to a particular WCAG level.
                  </p>
                </section>

                {/* 2. Accessibility Features and Practices */}
                <section id="features" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    2. Accessibility Features and Practices
                  </h2>
                  <p className="mb-3">
                    Depending on the page and features available, we aim to support:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Clear page headings and a logical content structure.</li>
                    <li>Readable text, adequate contrast, and scalable text where practicable.</li>
                    <li>Keyboard access to navigation and interactive controls.</li>
                    <li>Descriptive links and meaningful labels for forms and controls.</li>
                    <li>Alternative text for informative images where appropriate.</li>
                    <li>Captions or text alternatives for audio and video content where available or required.</li>
                    <li>Compatibility with commonly used screen readers and other assistive technologies.</li>
                    <li>Responsive layouts that can be used across different screen sizes and devices.</li>
                  </ul>
                </section>

                {/* 3. Ongoing Improvements and Known Limitations */}
                <section id="improvements" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    3. Ongoing Improvements and Known Limitations
                  </h2>
                  <p className="mb-3">
                    Some content or features may not yet be fully accessible. Potential issues can arise with older articles, third-party embeds, advertisements, externally hosted media, documents, interactive tools, or content supplied by outside providers.
                  </p>
                  <p>
                    We will consider reported accessibility issues and may prioritize fixes based on their impact, frequency, technical feasibility, and available resources. Third-party services may be governed by their own accessibility practices and are not always under our direct control.
                  </p>
                </section>

                {/* 4. Tips for Using the Website */}
                <section id="tips" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    4. Tips for Using the Website
                  </h2>
                  <p className="mb-3">
                    You may be able to improve your browsing experience by using your browser’s zoom controls, operating-system accessibility settings, screen reader, speech recognition software, high-contrast settings, or keyboard navigation features.
                  </p>
                  <p>
                    If a particular article, image, video, or feature is difficult to access, please contact us and identify the page and the problem so we can review it.
                  </p>
                </section>

                {/* 5. Reporting an Accessibility Problem */}
                <section id="reporting" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    5. Reporting an Accessibility Problem
                  </h2>
                  <p className="mb-3">
                    We welcome feedback about barriers that prevent or limit access to our website. When contacting us, please include the page URL, a brief description of the issue, the device or browser involved if known, and the assistive technology you were using if you are comfortable sharing that information.
                  </p>
                  <p className="mb-3">
                    Please do not send passwords, payment-card details, government identification numbers, or other unnecessary sensitive information in an accessibility report.
                  </p>
                  <p>
                    We will review accessibility feedback and respond where reasonably practicable. Response times may vary depending on the nature of the issue and the information provided.
                  </p>
                </section>

                {/* 6. Contact Information */}
                <section id="contact" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    6. Contact Information
                  </h2>
                  <p className="mb-3">
                    For accessibility questions, requests, or feedback, contact:
                  </p>
                  <div className="bg-[#FAF8F5] p-5 border border-[#E5E0D3] space-y-1.5 text-xs sm:text-sm">
                    <p><strong className="font-bold text-[#111111]">Times Chicago LLC</strong></p>
                    <p>1246 J Clark St, Suite 1100</p>
                    <p>Chicago, IL 60603, United States</p>
                    <p><strong className="font-bold text-[#111111]">Email:</strong> <a href="mailto:worldnews@timeschicago.com" className="text-[#00558c] hover:underline">worldnews@timeschicago.com</a></p>
                    <p><strong className="font-bold text-[#111111]">Website:</strong> <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a></p>
                  </div>
                </section>

                {/* 7. Updates to This Statement */}
                <section id="updates" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    7. Updates to This Statement
                  </h2>
                  <p>
                    We may update this Accessibility Statement as our website, features, accessibility practices, or applicable requirements change. The &ldquo;Last Updated&rdquo; date above indicates when this statement was most recently revised.
                  </p>
                </section>
              </div>
            </div>
          </Container>
        </main>
      </div>

      <Footer />
      <StickySubscribeBar />
    </div>
  );
}
