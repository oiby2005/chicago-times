"use client";

import React, { useState } from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

export default function CareerClient() {
  const [copied, setCopied] = useState<boolean>(false);
  const officialEmail = "worldnews@timeschicago.com";

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(officialEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#111111] font-sans selection:bg-slate-200 selection:text-slate-900">
      <div>
        <Header />
        <StickyHeaderBar />

        <main className="py-10 sm:py-16 bg-white">
          <Container>
            <div className="max-w-4xl mx-auto space-y-14 sm:space-y-20">
              
              {/* ========================================================= */}
              {/* SECTION 1: HERO (Full black Georgia title, Ash subtitle) */}
              {/* ========================================================= */}
              <section className="text-center px-4 py-8 sm:py-12 bg-white rounded-3xl border border-[#e2e8f0] shadow-xs">
                <div className="max-w-3xl mx-auto space-y-4">
                  {/* Main Title: Full black, Georgia font, no highlights */}
                  <h1
                    className="text-3xl sm:text-5xl font-bold text-black tracking-tight leading-tight"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Join the Times Chicago
                  </h1>

                  {/* Subtitle in Ash color */}
                  <p className="text-base sm:text-xl font-bold text-[#64748b]">
                    Build Your Writing Career With Us
                  </p>

                  {/* Divider Line (Ash) */}
                  <div className="w-14 h-1 bg-[#94a3b8] mx-auto rounded-full mt-3 mb-5" />

                  {/* Intro text specifically tailored to article writing on Times Chicago */}
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto pt-1 font-sans">
                    Are you passionate about article writing, reporting, and storytelling? Join Times Chicago to write and publish your articles for a global readership. We provide a focused editorial platform where writers can publish their original articles, showcase their professional experience, education, and publications, and connect directly with an engaged audience.
                  </p>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 2: CURRENT OPPORTUNITIES (Compact Cards)          */}
              {/* ========================================================= */}
              <section className="space-y-6">
                {/* Heading with Vertical Ash Accent Bar */}
                <div className="flex items-center space-x-3">
                  <span className="w-1.5 h-7 bg-[#475569] rounded-xs inline-block" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight font-sans">
                    Current Opportunities
                  </h2>
                </div>

                {/* Opportunities Cards Grid - Compact Box format with Poppins Sans font */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Article Writer */}
                  <div
                    className="w-full bg-white border border-[#e2e8f0] hover:border-[#64748b] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 font-poppins flex flex-col justify-between"
                    style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        {/* Document / Article Icon in Ash */}
                        <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#475569]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>

                        {/* Ash Tag */}
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#f8fafc] text-[#475569] border border-[#cbd5e1] uppercase">
                          ARTICLE WRITER
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0f172a]">
                          Article Writer
                        </h3>
                      </div>

                      <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                        At Times Chicago, an article writer writes and submits original articles for editorial review and publication. You have a dedicated author profile page where you can showcase your experience, publications, and education alongside your published work.
                      </p>

                      {/* Capabilities List */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                          What You Can Do:
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#334155]">
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Publish Articles:</strong> Write and submit original news and articles.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Showcase Experience:</strong> Highlight your career background.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Showcase Publications:</strong> Feature your books and papers.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Showcase Education:</strong> Display degrees and universities.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Contributing Writer */}
                  <div
                    className="w-full bg-white border border-[#e2e8f0] hover:border-[#64748b] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 font-poppins flex flex-col justify-between"
                    style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        {/* Quill / Pen Icon in Ash */}
                        <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#475569]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </div>

                        {/* Ash Tag */}
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#f8fafc] text-[#475569] border border-[#cbd5e1] uppercase">
                          CONTRIBUTING WRITER
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0f172a]">
                          Contributing Writer
                        </h3>
                      </div>

                      <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                        At Times Chicago, a contributing writer provides expert opinion pieces, market analysis, and specialized commentary. As an independent contributor, you receive an official press credential and an author profile featuring your published columns and credentials.
                      </p>

                      {/* Capabilities List */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                          What You Can Do:
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#334155]">
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Submit Columns:</strong> Write and submit analysis and opinion pieces.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Dedicated Profile:</strong> Display your credentials and author bio.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Press Credential:</strong> Receive an official Contributor ID.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Global Reach:</strong> Connect with an international readership.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Investigative Journalist */}
                  <div
                    className="w-full bg-white border border-[#e2e8f0] hover:border-[#64748b] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 font-poppins flex flex-col justify-between"
                    style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        {/* Search / Magnifying Glass Icon in Ash */}
                        <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#475569]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                          </svg>
                        </div>

                        {/* Ash Tag */}
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#f8fafc] text-[#475569] border border-[#cbd5e1] uppercase">
                          INVESTIGATIVE JOURNALIST
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0f172a]">
                          Investigative Journalist
                        </h3>
                      </div>

                      <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                        At Times Chicago, an investigative journalist uncovers high-impact enterprise stories, corporate accountability reports, and policy developments with deep reporting and verified documentation.
                      </p>

                      {/* Capabilities List */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                          What You Can Do:
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#334155]">
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>In-Depth Investigations:</strong> Produce detailed, original investigative features.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Direct Editorial Desk:</strong> Collaborate closely with senior editors.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Front-Page Visibility:</strong> Feature on homepage and major category headers.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Verified Credentials:</strong> Showcase awards, investigations, and verified credentials.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Financial & Markets Analyst */}
                  <div
                    className="w-full bg-white border border-[#e2e8f0] hover:border-[#64748b] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 font-poppins flex flex-col justify-between"
                    style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        {/* Trending Graph Icon in Ash */}
                        <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#475569]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                          </svg>
                        </div>

                        {/* Ash Tag */}
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#f8fafc] text-[#475569] border border-[#cbd5e1] uppercase">
                          MARKETS & FINANCE
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0f172a]">
                          Financial & Markets Analyst
                        </h3>
                      </div>

                      <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                        At Times Chicago, a financial and markets analyst reports on equities, emerging venture valuations, economic policy, and wealth trends, translating complex data into clear analysis.
                      </p>

                      {/* Capabilities List */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748b]">
                          What You Can Do:
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#334155]">
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Market Commentaries:</strong> Write daily analysis on equities, crypto, and economy.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Wealth & Indexes:</strong> Contribute to founder rankings and market reports.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Data Visualizations:</strong> Enhance articles with rich metrics and charts.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#64748b] mt-1.5 shrink-0" />
                            <span><strong>Global Distribution:</strong> Reach thousands of investors and business executives.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* SECTION 3: SUBMIT YOUR CV (Pure White Box, No Underline)   */}
              {/* ========================================================= */}
              <section className="bg-white border border-[#e2e8f0] rounded-3xl p-8 sm:p-14 shadow-xs max-w-3xl mx-auto text-center space-y-6">
                <div className="space-y-2">
                  <h2
                    className="text-2xl sm:text-4xl font-bold text-[#0f172a]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Submit Your CV
                  </h2>
                  <p className="text-sm sm:text-base text-[#64748b]">
                    Ready to start your writing journey?
                  </p>
                </div>

                {/* Email Submission Card Box - Pure White, No Underline on Email */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-8 max-w-lg mx-auto space-y-3 shadow-xs">
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748b]">
                    Send your CV and portfolio to:
                  </p>

                  <div className="flex items-center justify-center space-x-2.5">
                    {/* Mail icon */}
                    <svg className="w-5 h-5 text-[#475569] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>

                    {/* Official Times Chicago Email - NOT underlined */}
                    <a
                      href={`mailto:${officialEmail}?subject=Times%20Chicago%20-%20Article%20Writer%20Application`}
                      className="font-bold text-[#0f172a] hover:text-[#00558c] text-[11px] min-[360px]:text-[11.5px] sm:text-base md:text-lg transition-colors no-underline break-all sm:break-normal"
                    >
                      {officialEmail}
                    </a>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1.5 text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      title="Copy email to clipboard"
                    >
                      {copied ? (
                        <span className="text-[11px] font-mono font-bold text-emerald-600">Copied!</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#64748b] max-w-xl mx-auto leading-relaxed font-sans">
                  Our recruitment team reviews applications on an ongoing basis. If your profile matches our current requirements, we&apos;ll contact you for the next steps.
                </p>

                {/* Bottom Callout in Ash */}
                <div className="pt-6 border-t border-slate-100">
                  <p
                    className="italic font-bold text-base sm:text-lg text-[#475569]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Start your career with Times Chicago and write your future with us.
                  </p>
                </div>
              </section>

            </div>
          </Container>
        </main>
      </div>

      <Footer />
    </div>
  );
}
