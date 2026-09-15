"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";

const COVERAGE_TOPICS = [
  "U.S. News",
  "World News",
  "Politics",
  "Business & Economy",
  "Technology",
  "Science",
  "Health",
  "Education",
  "Environment",
  "Sports",
  "Entertainment",
  "Lifestyle",
  "Opinion & Editorials",
  "Press Releases",
  "Sponsored Content",
];

const EDITORIAL_VALUES = [
  {
    title: "Accuracy & Fact-Checking",
    description: "Rigorous fact-checking and verify-first reporting on all articles.",
  },
  {
    title: "Editorial Independence",
    description: "Free from corporate bias, external influence, or political agendas.",
  },
  {
    title: "Transparency & Accountability",
    description: "Openly correcting mistakes and revealing information sources.",
  },
  {
    title: "Fairness & Balance",
    description: "Presenting multi-dimensional viewpoints and stories without prejudice.",
  },
  {
    title: "Respect for Diversity",
    description: "Representing varied perspectives and amplifying underrepresented voices.",
  },
  {
    title: "Ethical Journalism",
    description: "Following professional standard ethics and respect for privacy.",
  },
];

export default function AboutUsClient() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#111111] select-none">
      <div>
        <Header />
        <StickyHeaderBar />

        <main className="bg-white py-8 sm:py-12 border-b border-[#eaedf1]">
          <Container>
            {/* Header / Editorial Profile Top Title Bar */}
            <div className="text-center max-w-4xl mx-auto mb-8">
              <span className="font-sans font-extrabold text-[11px] tracking-[0.22em] text-[#990000] uppercase block mb-2">
                ESTABLISHED 2026 • EDITORIAL PROFILE
              </span>
              
              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight mb-3">
                About Times Chicago
              </h1>

              <p className="font-serif italic text-[16px] sm:text-[18px] text-[#4a5568] max-w-2xl mx-auto">
                &ldquo;Delivering Trusted News. Empowering Informed Communities.&rdquo;
              </p>

              {/* Matching 100% Identical Parallel Lines */}
              <div className="w-full flex flex-col gap-[3px] mt-6 mb-8">
                <div className="w-full h-[1.5px] bg-[#111111]"></div>
                <div className="w-full h-[1.5px] bg-[#111111]"></div>
              </div>
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ==================== LEFT MAIN COLUMN (8 of 12 cols ~ 66.7%) ==================== */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Who We Are Section */}
                <section className="bg-white border border-[#e2e8f0] p-6 sm:p-8 shadow-xs">
                  <h2 className="font-serif font-bold text-[22px] sm:text-[26px] text-[#111111] pb-3 mb-4 border-b border-[#edf2f7]">
                    Who We Are
                  </h2>

                  <div className="space-y-4 font-sans text-[14px] sm:text-[14.5px] leading-relaxed text-[#4a5568]">
                    <p>
                      Welcome to <strong className="font-bold text-[#1a202c]">Times Chicago</strong>, an independent digital news platform dedicated to delivering accurate, timely, and impactful journalism. Our mission is to provide readers with reliable news coverage, insightful analysis, and balanced reporting on the stories that matter most locally, nationally, and around the world.
                    </p>
                    <p>
                      We strive to uphold the highest standards of journalistic integrity while embracing innovation in digital media. Our newsroom is committed to factual reporting, editorial independence, and responsible storytelling that informs, educates, and inspires.
                    </p>
                  </div>
                </section>

                {/* 2. What We Cover Section */}
                <section className="bg-white border border-[#e2e8f0] p-6 sm:p-8 shadow-xs">
                  <h2 className="font-serif font-bold text-[22px] sm:text-[26px] text-[#111111] pb-3 mb-2 border-b border-[#edf2f7]">
                    What We Cover
                  </h2>

                  <p className="font-sans text-[13.5px] text-[#718096] mb-5">
                    Times Chicago publishes dynamic, professional content across a comprehensive range of critical topics:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {COVERAGE_TOPICS.map((topic) => (
                      <div
                        key={topic}
                        className="bg-[#f8fafc] border border-[#edf2f7] py-2.5 px-3.5 flex items-center text-[13px] font-sans font-medium text-[#2d3748]"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#990000] mr-2.5 shrink-0"></span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Our Editorial Values Section */}
                <section className="bg-white border border-[#e2e8f0] p-6 sm:p-8 shadow-xs">
                  <h2 className="font-serif font-bold text-[22px] sm:text-[26px] text-[#111111] pb-3 mb-2 border-b border-[#edf2f7]">
                    Our Editorial Values
                  </h2>

                  <p className="font-sans text-[13.5px] text-[#718096] mb-6">
                    Every story published by Times Chicago is guided by our core journalistic values:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {EDITORIAL_VALUES.map((val) => (
                      <div
                        key={val.title}
                        className="bg-[#f8fafc] border border-[#edf2f7] p-5 sm:p-6 flex flex-col justify-start"
                      >
                        <h3 className="font-sans font-bold text-[14.5px] text-[#1a202c] mb-1.5">
                          {val.title}
                        </h3>
                        <p className="font-sans text-[13px] text-[#4a5568] leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <span className="font-serif italic text-[12.5px] text-[#718096] pt-4 border-t border-[#edf2f7] block">
                    Our editorial team follows strict review processes to ensure our reporting meets professional standards and serves the public interest.
                  </span>
                </section>

              </div>

              {/* ==================== RIGHT SIDEBAR COLUMN (4 of 12 cols ~ 33.3%) ==================== */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 1. Our Mission Card */}
                <div className="bg-[#f0f7fa] border border-[#d0e3ef] p-6 shadow-xs">
                  <h3 className="font-serif font-bold text-[20px] text-[#00558c] mb-3">
                    Our Mission
                  </h3>
                  <p className="font-sans text-[13px] text-[#334455] leading-relaxed">
                    Our mission is to empower individuals through credible journalism by providing fair, accurate, and accessible news. We believe that informed citizens build stronger communities, and we are dedicated to making trustworthy information available to everyone.
                  </p>
                </div>

                {/* 2. Our Vision Card */}
                <div className="bg-[#fcf5f5] border border-[#f2dada] p-6 shadow-xs">
                  <h3 className="font-serif font-bold text-[20px] text-[#990000] mb-3">
                    Our Vision
                  </h3>
                  <p className="font-sans text-[13px] text-[#553333] leading-relaxed">
                    We aim to become one of the most trusted digital news platforms in the United States by delivering high-quality journalism, embracing technological innovation, and fostering meaningful public dialogue.
                  </p>
                </div>

                {/* 3. Contact Us Card */}
                <div className="bg-white border border-[#e2e8f0] p-6 shadow-xs">
                  <h3 className="font-serif font-bold text-[20px] text-[#111111] pb-2 mb-4 border-b border-[#edf2f7]">
                    Contact Us
                  </h3>

                  <div className="space-y-4">
                    {/* Address Item */}
                    <div className="flex items-start space-x-3 text-[13px] font-sans text-[#333333]">
                      <svg className="w-5 h-5 text-[#888888] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <strong className="font-bold text-[#111111] block mb-0.5">
                          Times Chicago Headquarters
                        </strong>
                        <p className="leading-snug text-[#4a5568]">
                          2316 Eastgate St #160<br />
                          Walla Walla, Washington (WA) 99362<br />
                          United States
                        </p>
                      </div>
                    </div>

                    {/* Email Inquiry Item */}
                    <div className="flex items-start space-x-3 text-[13px] font-sans text-[#333333] pt-2 border-t border-[#edf2f7]">
                      <svg className="w-5 h-5 text-[#888888] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="font-sans font-extrabold text-[10px] tracking-wider text-[#718096] uppercase block mb-0.5">
                          EMAIL INQUIRY
                        </span>
                        <a
                          href="mailto:info@timeschicago.com"
                          className="font-bold text-[13.5px] text-[#00558c] hover:underline block"
                        >
                          info@timeschicago.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <span className="font-serif italic text-[11.5px] text-[#718096] mt-5 pt-3 border-t border-[#edf2f7] block">
                    We will make reasonable efforts to respond to inquiries in a timely manner.
                  </span>
                </div>

                {/* 4. Stay Connected Card */}
                <div className="bg-[#111111] text-white p-6 shadow-xs">
                  <h3 className="font-serif font-bold text-[20px] text-white mb-2 text-center">
                    Stay Connected
                  </h3>
                  <p className="font-sans text-[12.5px] text-[#cbd5e1] text-center mb-5 leading-relaxed">
                    Join our Times Chicago community to receive weekly summaries, breaking alerts, and professional editor highlights.
                  </p>
                  <Link
                    href="/newsletter"
                    className="w-full bg-[#990000] hover:bg-[#770000] text-white font-sans font-bold text-[12.5px] uppercase tracking-wider py-3 px-4 block text-center transition-colors cursor-pointer"
                  >
                    SUBSCRIBE NOW
                  </Link>
                </div>

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
