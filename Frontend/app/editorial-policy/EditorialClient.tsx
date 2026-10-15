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
  { id: "mission", label: "1. Our Editorial Mission" },
  { id: "accuracy", label: "2. Accuracy and Verification" },
  { id: "sources", label: "3. Sources and Attribution" },
  { id: "fairness", label: "4. Fairness and Right of Reply" },
  { id: "independence", label: "5. Editorial Independence" },
  { id: "labels", label: "6. News, Opinion & Sponsored Content" },
  { id: "multimedia", label: "7. Headlines, Images & Multimedia" },
  { id: "privacy", label: "8. Privacy & Sensitive Reporting" },
  { id: "allegations", label: "9. Allegations & Defamation" },
  { id: "ai-tools", label: "10. Artificial Intelligence & Tools" },
  { id: "user-content", label: "11. User-Generated Content" },
  { id: "corrections", label: "12. Errors, Corrections & Updates" },
  { id: "complaints", label: "13. Complaints & Editorial Review" },
  { id: "copyright-reuse", label: "14. Copyright and Reuse" },
  { id: "policy-review", label: "15. Policy Review" },
  { id: "contact", label: "Contact Information" },
];

export default function EditorialClient() {
  const [activeSection, setActiveSection] = useState<string>("mission");
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
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#111111]">
      <div>
        <Header />
        <StickyHeaderBar />

        <main className="bg-white py-8 sm:py-12 border-b border-[#EAE6DA]">
          <Container>
            {/* Header / Legal Document Title Bar */}
            <div className="text-center max-w-4xl mx-auto mb-8">
              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight">
                EDITORIAL POLICY
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
                <div className="bg-white border border-[#E2DDD0] p-4 sm:p-5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className={`w-full flex items-center justify-between text-left lg:pb-3 lg:mb-3 lg:border-b lg:border-[#E5E0D3] ${
                      isTocOpen ? "pb-3 mb-3 border-b border-[#E5E0D3]" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <h3
                        className="font-serif font-bold text-[15px] uppercase tracking-wider text-[#111111]"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        POLICY SECTIONS
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

              {/* ==================== RIGHT MAIN COLUMN: DOCUMENT SECTIONS ==================== */}
              <div className="lg:col-span-8 bg-white border border-[#E2DDD0] p-6 sm:p-10 shadow-xs space-y-8 font-sans text-[14px] leading-relaxed text-[#333333] policy-doc-content [&_h2]:font-['Georgia',serif]">
                {/* 1. Our Editorial Mission */}
                <section id="mission" className="scroll-mt-28">
                  <h2 className="font-serif font-bold text-[22px] text-[#111111] pb-2 mb-4 border-b border-[#E5E0D3]">
                    1. Our Editorial Mission
                  </h2>
                  <p>
                    Times Chicago LLC aims to publish timely, relevant, clear, and informative journalism for readers. Our editorial approach is guided by accuracy, fairness, independence, accountability, and respect for the public interest. We seek to distinguish verified information from allegation, analysis, commentary, and opinion.
                  </p>
                </section>

                {/* 2. Accuracy and Verification */}
                <section id="accuracy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    2. Accuracy and Verification
                  </h2>
                  <p>
                    We make reasonable efforts to verify factual claims before publication using reliable sources, relevant documents, direct observation, and on-the-record statements where appropriate. We check names, dates, figures, quotations, and context. When information cannot be independently verified, we aim to explain that limitation clearly rather than present uncertain information as established fact.
                  </p>
                </section>

                {/* 3. Sources and Attribution */}
                <section id="sources" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    3. Sources and Attribution
                  </h2>
                  <p>
                    We identify sources where appropriate and provide links, citations, or attribution when useful to readers. Anonymous sources may be used only when the information is important, the source has a credible basis for knowing it, and there is a reasonable justification for withholding the source’s identity. Editors should assess possible conflicts, motives, and risks before relying on anonymous information.
                  </p>
                </section>

                {/* 4. Fairness and Right of Reply */}
                <section id="fairness" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    4. Fairness and Right of Reply
                  </h2>
                  <p>
                    We aim to represent relevant perspectives fairly and in context. When an article contains significant allegations about an identifiable person or organization, we will make reasonable efforts to seek a response before publication, where practicable. If a response is not received by the editorial deadline, the article may state that a request was made and whether a response had been received at publication time.
                  </p>
                </section>

                {/* 5. Editorial Independence and Conflicts of Interest */}
                <section id="independence" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    5. Editorial Independence and Conflicts of Interest
                  </h2>
                  <p>
                    Editorial decisions should be based on newsworthiness, evidence, relevance, and public interest—not on payment, personal relationships, political pressure, or commercial influence. Staff and contributors should disclose material conflicts of interest to an editor. Advertisers, sponsors, clients, and business partners must not be promised editorial coverage or favorable treatment in exchange for payment unless the material is clearly identified as advertising, sponsored content, or another paid placement.
                  </p>
                </section>

                {/* 6. News, Opinion, Sponsored Content, and Corrections */}
                <section id="labels" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    6. News, Opinion, Sponsored Content, and Corrections
                  </h2>
                  <p>
                    We aim to label content clearly so readers can distinguish reporting from opinion, analysis, reviews, press releases, sponsored material, and advertising. Sponsored or paid content should be identified in a prominent and understandable way. Press releases and submissions may be edited, checked, rejected, or independently reported before publication; publication does not necessarily mean that Times Chicago LLC endorses every claim made by the source.
                  </p>
                </section>

                {/* 7. Headlines, Images, and Multimedia */}
                <section id="multimedia" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    7. Headlines, Images, and Multimedia
                  </h2>
                  <p>
                    Headlines, captions, photographs, graphics, and videos should fairly represent the content and must not knowingly mislead readers. Images should not be manipulated in a way that materially distorts the facts. Illustrative, file, archive, or AI-generated images should be labelled where necessary to avoid misleading readers. We seek to respect copyright, licensing terms, privacy, and the dignity of people depicted.
                  </p>
                </section>

                {/* 8. Privacy, Children, and Sensitive Reporting */}
                <section id="privacy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    8. Privacy, Children, and Sensitive Reporting
                  </h2>
                  <p>
                    We consider privacy, public interest, potential harm, and the circumstances of each case when reporting on private individuals and sensitive matters. Particular care should be taken when reporting on children, victims of abuse, health matters, grief, or other vulnerable circumstances. We avoid publishing unnecessary identifying details that could expose a person to foreseeable harm, subject to legitimate public-interest considerations and applicable law.
                  </p>
                </section>

                {/* 9. Allegations, Defamation, and Presumption of Innocence */}
                <section id="allegations" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    9. Allegations, Defamation, and Presumption of Innocence
                  </h2>
                  <p>
                    Allegations should be clearly attributed and not presented as proven facts unless they have been established by reliable evidence or an appropriate legal finding. Reporting about criminal investigations or proceedings should accurately describe the status of the matter and respect applicable legal restrictions. Editors should review serious allegations carefully and seek legal guidance when appropriate.
                  </p>
                </section>

                {/* 10. Artificial Intelligence and Editorial Tools */}
                <section id="ai-tools" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    10. Artificial Intelligence and Editorial Tools
                  </h2>
                  <p>
                    Digital tools, including AI-assisted tools, may be used to support tasks such as transcription, translation, research organization, or editing, subject to editorial oversight. They must not replace verification or editorial responsibility. Staff should not publish AI-generated factual claims, quotations, images, or references without appropriate checks. Confidential, personal, or sensitive information should not be entered into external tools unless authorized and appropriate safeguards are in place.
                  </p>
                </section>

                {/* 11. User-Generated Content and Moderation */}
                <section id="user-content" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    11. User-Generated Content and Moderation
                  </h2>
                  <p>
                    Comments, tips, submitted articles, images, and other user material may be reviewed before or after publication. We may edit for clarity, reject, remove, or restrict material that is unlawful, abusive, discriminatory, threatening, deceptive, spam, infringing, or otherwise inconsistent with our standards. User submissions are not automatically endorsed by Times Chicago LLC.
                  </p>
                </section>

                {/* 12. Errors, Corrections, and Updates */}
                <section id="corrections" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    12. Errors, Corrections, and Updates
                  </h2>
                  <p>
                    We seek to correct material factual errors promptly and transparently. Readers who identify a possible error can contact us with the article URL, the disputed statement, and reliable supporting information. Where a correction is warranted, we may amend the article and add a correction note or update notice when appropriate. Significant changes should not be made in a way that conceals a material error.
                  </p>
                </section>

                {/* 13. Complaints and Editorial Review */}
                <section id="complaints" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    13. Complaints and Editorial Review
                  </h2>
                  <p>
                    Readers may raise concerns about accuracy, fairness, sourcing, conflicts of interest, or compliance with this policy by emailing{" "}
                    <a href="mailto:worldnews@timeschicago.com" className="font-bold text-[#00558c] hover:underline">
                      worldnews@timeschicago.com
                    </a>
                    . Please include the article URL, a clear description of the concern, and any supporting documentation. We will review complaints as reasonably practicable, though we cannot guarantee a particular outcome or response time.
                  </p>
                </section>

                {/* 14. Copyright and Reuse */}
                <section id="copyright-reuse" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    14. Copyright and Reuse
                  </h2>
                  <p>
                    We seek to use text, photographs, graphics, video, and other third-party materials only where we have permission, a suitable licence, or another lawful basis. Attribution alone does not necessarily authorize reuse. We expect contributors to submit material they have the right to provide and to disclose relevant restrictions or third-party rights.
                  </p>
                </section>

                {/* 15. Policy Review */}
                <section id="policy-review" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    15. Policy Review
                  </h2>
                  <p>
                    This policy may be revised as our editorial practices and applicable requirements evolve. The latest version will be published on our Website with an updated revision date.
                  </p>
                </section>

                {/* Contact */}
                <section id="contact" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    Contact
                  </h2>
                  <div className="bg-[#FAF8F5] p-5 border border-[#E5E0D3] space-y-1.5 text-xs sm:text-sm">
                    <p><strong className="font-bold text-[#111111]">Times Chicago LLC</strong></p>
                    <p><strong className="font-bold text-[#111111]">Website:</strong> <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a></p>
                    <p><strong className="font-bold text-[#111111]">Editorial email:</strong> <a href="mailto:worldnews@timeschicago.com" className="text-[#00558c] hover:underline">worldnews@timeschicago.com</a></p>
                    <p><strong className="font-bold text-[#111111]">Address:</strong> 1246 J Clark St, Suite 1100, Chicago, IL 60603, United States</p>
                  </div>
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
