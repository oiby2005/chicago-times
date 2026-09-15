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
  { id: "info-we-collect", label: "1. Information We Collect" },
  { id: "how-we-use", label: "2. How We Use Your Information" },
  { id: "cookies-tracking", label: "3. Cookies & Tracking" },
  { id: "newsletter", label: "4. Newsletter Communications" },
  { id: "sharing-info", label: "5. Sharing of Information" },
  { id: "data-security", label: "6. Data Security" },
  { id: "data-retention", label: "7. Data Retention" },
  { id: "privacy-rights", label: "8. Your Privacy Rights" },
  { id: "childrens-privacy", label: "9. Children's Privacy" },
  { id: "third-party-websites", label: "10. Third-Party Websites" },
  { id: "international-transfers", label: "11. International Data Transfers" },
  { id: "changes-policy", label: "12. Changes to This Policy" },
  { id: "contact-us", label: "13. Contact Us" },
];

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState<string>("intro");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
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
                LEGAL DOCUMENT • DATA PROTECTION
              </span>

              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight mb-2">
                Privacy Policy
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
                  <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-[#E5E0D3]">
                    <span className="text-[#990000] text-[16px]">🔒</span>
                    <h3 className="font-serif font-bold text-[15px] uppercase tracking-wider text-[#111111]">
                      PRIVACY POLICY SECTIONS
                    </h3>
                  </div>

                  <nav className="space-y-0.5">
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
                      <strong className="font-bold text-[#111111]">Times Chicago</strong> (&ldquo;Times Chicago,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, subscribe to our newsletters, submit content, or otherwise interact with our Platform.
                    </p>
                    <p>
                      By using the Times Chicago Platform, you agree to the practices described in this Privacy Policy.
                    </p>
                  </div>
                </section>

                {/* 1. Information We Collect */}
                <section id="info-we-collect" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">1.</span> Information We Collect
                  </h3>
                  <p className="mb-3">
                    We may collect the following categories of information:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="font-bold text-[#111111]">Personal Information:</strong> Full name, email address, phone number (if provided), postal address (if provided), account information, and billing information (when applicable).
                    </li>
                    <li>
                      <strong className="font-bold text-[#111111]">Technical Information:</strong> IP address, browser type, device information, operating system, referring website, pages visited, date and time of access, and cookies.
                    </li>
                    <li>
                      <strong className="font-bold text-[#111111]">Content You Submit:</strong> When you submit articles, comments, press releases, photographs, videos, or other materials, we collect the information necessary to process and publish your submission.
                    </li>
                  </ul>
                </section>

                {/* 2. How We Use Your Information */}
                <section id="how-we-use" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">2.</span> How We Use Your Information
                  </h3>
                  <p>
                    We use your information to operate and improve our Platform, publish submitted content, respond to inquiries, process subscriptions or purchases, send newsletters, personalize your experience, detect fraud/security threats, comply with legal obligations, and analyze user engagement.
                  </p>
                </section>

                {/* 3. Cookies and Tracking Technologies */}
                <section id="cookies-tracking" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">3.</span> Cookies and Tracking Technologies
                  </h3>
                  <p>
                    Times Chicago uses cookies to remember your preferences, improve website functionality, measure traffic, analyze visitor behavior, and deliver relevant advertising. You may disable cookies through your browser settings; however, some features of the Platform may not function properly.
                  </p>
                </section>

                {/* 4. Newsletter Communications */}
                <section id="newsletter" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">4.</span> Newsletter Communications
                  </h3>
                  <p>
                    If you subscribe to our newsletter, we may send you news updates, editorial highlights, press releases, and promotional announcements. You may unsubscribe at any time using the &ldquo;Unsubscribe&rdquo; link included in our emails.
                  </p>
                </section>

                {/* 5. Sharing of Information */}
                <section id="sharing-info" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">5.</span> Sharing of Information
                  </h3>
                  <p>
                    We do not sell your personal information. We may share information with trusted service providers, payment processors, website hosting services, analytics providers, email delivery platforms, and government authorities when required by law.
                  </p>
                </section>

                {/* 6. Data Security */}
                <section id="data-security" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">6.</span> Data Security
                  </h3>
                  <p>
                    We implement reasonable administrative, technical, and organizational safeguards designed to protect your personal information from unauthorized access, alteration, disclosure, or destruction. No method of internet transmission can be guaranteed to be completely secure.
                  </p>
                </section>

                {/* 7. Data Retention */}
                <section id="data-retention" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">7.</span> Data Retention
                  </h3>
                  <p>
                    We retain personal information only for as long as necessary to provide our services, meet legal obligations, resolve disputes, and maintain business records. When no longer required, data is securely deleted or anonymized.
                  </p>
                </section>

                {/* 8. Your Privacy Rights */}
                <section id="privacy-rights" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">8.</span> Your Privacy Rights
                  </h3>
                  <p>
                    Depending on applicable law, you may have the right to access your personal information, correct inaccurate information, request deletion of your data, restrict certain processing activities, withdraw consent, or request a copy of your data. Please contact us to exercise these rights.
                  </p>
                </section>

                {/* 9. Children's Privacy */}
                <section id="childrens-privacy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">9.</span> Children&apos;s Privacy
                  </h3>
                  <p>
                    Times Chicago is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that such information has been collected, we will take reasonable steps to delete it promptly.
                  </p>
                </section>

                {/* 10. Third-Party Websites */}
                <section id="third-party-websites" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">10.</span> Third-Party Websites
                  </h3>
                  <p>
                    Our Platform may contain links to third-party websites. We are not responsible for the privacy practices, content, or security of external websites. We encourage users to review the privacy policies of those websites before providing personal information.
                  </p>
                </section>

                {/* 11. International Data Transfers */}
                <section id="international-transfers" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">11.</span> International Data Transfers
                  </h3>
                  <p>
                    If you access Times Chicago from outside the United States, your information may be transferred to and processed in the United States or other countries. By using our Platform, you consent to such transfers in accordance with applicable law.
                  </p>
                </section>

                {/* 12. Changes to This Privacy Policy */}
                <section id="changes-policy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">12.</span> Changes to This Privacy Policy
                  </h3>
                  <p>
                    We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised &ldquo;Last Updated&rdquo; date. Continued use of the Platform after changes constitute acceptance of the revised policy.
                  </p>
                </section>

                {/* 13. Contact Us */}
                <section id="contact-us" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">13.</span> Contact Us
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
