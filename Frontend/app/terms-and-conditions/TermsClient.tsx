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
  { id: "eligibility", label: "1. Eligibility" },
  { id: "services", label: "2. Our Services" },
  { id: "user-accounts", label: "3. User Accounts" },
  { id: "user-content", label: "4. User Content" },
  { id: "editorial-independence", label: "5. Editorial Independence" },
  { id: "intellectual-property", label: "6. Intellectual Property" },
  { id: "sponsored-content", label: "7. Sponsored Content & Ads" },
  { id: "third-party-links", label: "8. Third-Party Links" },
  { id: "copyright-policy", label: "9. Copyright Policy" },
  { id: "acceptable-use", label: "10. Acceptable Use" },
  { id: "disclaimer", label: "11. Disclaimer" },
  { id: "limitation-liability", label: "12. Limitation of Liability" },
  { id: "indemnification", label: "13. Indemnification" },
  { id: "privacy-policy", label: "14. Privacy Policy Link" },
  { id: "changes-services", label: "15. Changes to Services" },
  { id: "governing-law", label: "16. Governing Law" },
  { id: "contact-info", label: "17. Contact Information" },
];

export default function TermsClient() {
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
                LEGAL DOCUMENT • TERMS OF USE
              </span>

              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight mb-2">
                Terms and Conditions
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
                      <span className="text-[#990000] text-[16px]">⚖️</span>
                      <h3 className="font-serif font-bold text-[15px] uppercase tracking-wider text-[#111111]">
                        TABLE OF CONTENTS
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1.5 lg:hidden text-[#990000] font-sans text-xs font-bold bg-[#FAF5F5] px-2.5 py-1 rounded border border-[#F5E6E6]">
                      <span>{isTocOpen ? "Hide" : `Show (${TOC_ITEMS.length} Sections)`}</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isTocOpen ? "rotate-180" : ""}`}
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

              {/* ==================== RIGHT MAIN COLUMN: DOCUMENT SECTIONS (8 of 12 cols ~ 67%) ==================== */}
              <div className="lg:col-span-8 bg-white border border-[#E2DDD0] p-6 sm:p-10 shadow-xs space-y-8 font-sans text-[14px] leading-relaxed text-[#333333]">

                {/* Introduction */}
                <section id="intro" className="scroll-mt-28">
                  <h2 className="font-serif font-bold text-[24px] text-[#111111] pb-2 mb-4 border-b border-[#E5E0D3]">
                    Introduction
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Welcome to <strong className="font-bold text-[#111111]">Times Chicago</strong> (&ldquo;Times Chicago,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Times Chicago website, mobile services, digital publications, and all related platforms (collectively, the &ldquo;Platform&rdquo;).
                    </p>
                    <p>
                      By accessing, browsing, submitting content, or using any part of our Platform, you agree to comply with these Terms. If you do not agree with these Terms, please discontinue use of the Platform immediately.
                    </p>
                    <p>
                      Times Chicago reserves the right to update or modify these Terms at any time. Continued use of the Platform following any updates constitutes acceptance of the revised Terms.
                    </p>
                  </div>
                </section>

                {/* 1. Eligibility */}
                <section id="eligibility" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">1.</span> Eligibility
                  </h3>
                  <p>
                    You must be at least 18 years old, or have permission from a parent or legal guardian, to use our Platform. By using our services, you represent that you have the legal authority to accept these terms.
                  </p>
                </section>

                {/* 2. Our Services */}
                <section id="services" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">2.</span> Our Services
                  </h3>
                  <p className="mb-3">
                    Times Chicago is an independent digital news and media platform providing breaking news, politics, business, technology, science, world news, health, CEO spotlight, opinion articles, press releases, sponsored content, and multimedia publications.
                  </p>
                  <p>
                    Our editorial team reserves the right to determine which content is published on our Platform.
                  </p>
                </section>

                {/* 3. User Accounts */}
                <section id="user-accounts" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">3.</span> User Accounts
                  </h3>
                  <p>
                    Certain services may require registration. You agree to provide accurate information, maintain the confidentiality of your account, notify us immediately of unauthorized access, and accept responsibility for all activity occurring under your account. We reserve the right to suspend or terminate accounts that violate these Terms.
                  </p>
                </section>

                {/* 4. User Content */}
                <section id="user-content" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">4.</span> User Content
                  </h3>
                  <p className="mb-3">
                    Users may submit articles, press releases, images, videos, comments, or other content. By submitting content, you represent that you own the content, it does not violate intellectual property rights, it is truthful, and it does not contain defamatory or illegal material.
                  </p>
                  <p>
                    By submitting content, you grant Times Chicago a worldwide, non-exclusive, royalty-free license to publish, distribute, edit, archive, translate, reproduce, and promote your content across our platforms. We reserve the right to remove submitted content without notice.
                  </p>
                </section>

                {/* 5. Editorial Independence */}
                <section id="editorial-independence" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">5.</span> Editorial Independence
                  </h3>
                  <p>
                    Submission of content does not guarantee publication. Our editorial team may edit articles for clarity, formatting, SEO, and guidelines, add headlines/metadata, decline publication, or remove published content. All editorial decisions are final.
                  </p>
                </section>

                {/* 6. Intellectual Property */}
                <section id="intellectual-property" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">6.</span> Intellectual Property
                  </h3>
                  <p>
                    Unless otherwise stated, all content on Times Chicago including articles, logos, graphics, videos, photographs, website design, branding, and software is the exclusive property of Times Chicago or its licensors. You may not reproduce, copy, distribute, or commercially exploit any material without prior written permission.
                  </p>
                </section>

                {/* 7. Sponsored Content & Advertising */}
                <section id="sponsored-content" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">7.</span> Sponsored Content &amp; Advertising
                  </h3>
                  <p>
                    Times Chicago may publish sponsored articles, advertisements, affiliate links, and promotional campaigns. Sponsored material will be clearly identified. Publication of sponsored content does not imply endorsement by Times Chicago.
                  </p>
                </section>

                {/* 8. Third-Party Links */}
                <section id="third-party-links" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">8.</span> Third-Party Links
                  </h3>
                  <p>
                    Our Platform may contain links to third-party websites. We do not control or endorse those websites and are not responsible for their accuracy, security, privacy practices, or services. Users access third-party websites at their own risk.
                  </p>
                </section>

                {/* 9. Copyright Policy */}
                <section id="copyright-policy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">9.</span> Copyright Policy
                  </h3>
                  <p>
                    Times Chicago respects intellectual property rights. If you believe content published on our Platform infringes your copyright, please contact us with details including your name, copyrighted work description, and URI of the material.
                  </p>
                </section>

                {/* 10. Acceptable Use */}
                <section id="acceptable-use" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">10.</span> Acceptable Use
                  </h3>
                  <p>
                    Users may not upload malicious software, attempt unauthorized access, spam or distribute promotions, impersonate others, or publish misleading information. Violation of this policy may result in immediate termination of access.
                  </p>
                </section>

                {/* 11. Disclaimer */}
                <section id="disclaimer" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">11.</span> Disclaimer
                  </h3>
                  <p className="mb-3">
                    All information is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. Although Times Chicago strives for accuracy, we make no warranties regarding completeness, timeliness, availability, or reliability. News develops rapidly, and published information may change over time.
                  </p>
                  <p>
                    <strong className="font-bold text-[#111111]">Nothing published on this Platform constitutes legal, financial, investment, medical, or professional advice. Users should seek independent professional advice before relying on published information.</strong>
                  </p>
                </section>

                {/* 12. Limitation of Liability */}
                <section id="limitation-liability" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">12.</span> Limitation of Liability
                  </h3>
                  <p>
                    To the fullest extent permitted by law, Times Chicago shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from the use of or inability to access the Platform, errors/omissions, user-generated content, or website interruptions.
                  </p>
                </section>

                {/* 13. Indemnification */}
                <section id="indemnification" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">13.</span> Indemnification
                  </h3>
                  <p>
                    You agree to indemnify and hold harmless Times Chicago, its directors, officers, editors, and affiliates from any claims, damages, liabilities, or expenses arising from your use of the Platform or violation of these Terms.
                  </p>
                </section>

                {/* 14. Privacy Policy Link */}
                <section id="privacy-policy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">14.</span> Privacy Policy
                  </h3>
                  <p>
                    Your use of the Platform is also governed by our Privacy Policy, which explains how we collect, use, store, and protect personal information.
                  </p>
                </section>

                {/* 15. Changes to Services */}
                <section id="changes-services" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">15.</span> Changes to Services
                  </h3>
                  <p>
                    Times Chicago may modify, suspend, discontinue, or update any part of the Platform without prior notice. We shall not be liable for any resulting loss or inconvenience.
                  </p>
                </section>

                {/* 16. Governing Law */}
                <section id="governing-law" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">16.</span> Governing Law
                  </h3>
                  <p>
                    These Terms shall be governed by and interpreted under the laws of the State of Washington, United States, without regard to conflict of law principles. Any legal dispute arising from these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Washington.
                  </p>
                </section>

                {/* 17. Contact Information */}
                <section id="contact-info" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">17.</span> Contact Information
                  </h3>
                  <p className="mb-4">
                    For legal inquiries, copyright notices, or questions regarding these Terms, please contact:
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
