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
  { id: "our-commitment", label: "Our Commitment" },
  { id: "accuracy-verification", label: "1. Accuracy & Verification" },
  { id: "editorial-independence", label: "2. Editorial Independence" },
  { id: "fairness-balance", label: "3. Fairness and Balance" },
  { id: "source-standards", label: "4. Source Standards" },
  { id: "original-journalism", label: "5. Original Journalism" },
  { id: "attribution-copyright", label: "6. Attribution & Copyright" },
  { id: "opinion-content", label: "7. Opinion Content" },
  { id: "corrections-updates", label: "8. Corrections & Updates" },
  { id: "artificial-intelligence", label: "9. Artificial Intelligence (AI)" },
  { id: "visuals-multimedia", label: "10. Visuals & Multimedia" },
  { id: "user-generated-content", label: "11. User-Generated Content" },
  { id: "sponsored-content", label: "12. Sponsored Content & Ads" },
  { id: "conflicts-of-interest", label: "13. Conflicts of Interest" },
  { id: "diversity-inclusion", label: "14. Diversity & Inclusion" },
  { id: "source-security", label: "15. Security & Confidential Sources" },
  { id: "community-standards", label: "16. Community Standards" },
  { id: "transparency-policy", label: "17. Transparency" },
  { id: "continuous-improvement", label: "18. Continuous Improvement" },
  { id: "editorial-promise", label: "Our Editorial Promise" },
];

export default function EditorialClient() {
  const [activeSection, setActiveSection] = useState<string>("our-commitment");

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
                ETHICS • EDITORIAL GUIDELINES
              </span>

              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight mb-2">
                Editorial Guidelines &amp; Ethics Policy
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
                    <span className="text-[#990000] text-[16px]">🖋️</span>
                    <h3 className="font-serif font-bold text-[15px] uppercase tracking-wider text-[#111111]">
                      POLICY SECTIONS
                    </h3>
                  </div>

                  <nav className="space-y-0.5">
                    {TOC_ITEMS.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-3 py-1 text-[12px] font-sans transition-colors rounded-none flex items-center cursor-pointer ${
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

                {/* Our Commitment */}
                <section id="our-commitment" className="scroll-mt-28">
                  <h2 className="font-serif font-bold text-[24px] text-[#111111] pb-2 mb-4 border-b border-[#E5E0D3]">
                    Our Commitment to Journalism
                  </h2>
                  <div className="space-y-4">
                    <p>
                      At <strong className="font-bold text-[#111111]">Times Chicago</strong>, journalism is a public responsibility. Our mission is to deliver accurate, fair, independent, and responsible reporting that helps readers understand the events shaping their communities, the nation, and the world.
                    </p>
                    <p>
                      We are committed to the highest standards of editorial integrity, transparency, accountability, and ethical journalism. Every article, investigation, opinion piece, and multimedia publication is produced under rigorous editorial oversight to ensure that our readers receive trustworthy information.
                    </p>
                  </div>
                </section>

                {/* 1. Accuracy & Verification */}
                <section id="accuracy-verification" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">1.</span> Accuracy and Verification
                  </h3>
                  <p className="mb-3">
                    Accuracy is the foundation of our journalism. Before publication, our editorial team strives to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-3">
                    <li>Verify information through reliable and credible sources.</li>
                    <li>Confirm facts using official records whenever possible.</li>
                    <li>Review names, dates, statistics, quotations, and references for accuracy.</li>
                    <li>Seek multiple independent sources before publishing significant claims.</li>
                    <li>Clearly distinguish verified facts from opinions or analysis.</li>
                  </ul>
                  <p>
                    If new verified information becomes available after publication, articles are updated promptly.
                  </p>
                </section>

                {/* 2. Editorial Independence */}
                <section id="editorial-independence" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">2.</span> Editorial Independence
                  </h3>
                  <p>
                    Times Chicago maintains complete editorial independence. Editorial decisions are never influenced by advertisers, sponsors, political organizations, government agencies, business partners, financial contributors, or individuals seeking favorable coverage. Our journalists and editors are expected to make decisions solely in the public interest.
                  </p>
                </section>

                {/* 3. Fairness and Balance */}
                <section id="fairness-balance" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">3.</span> Fairness and Balance
                  </h3>
                  <p>
                    Our reporting aims to present issues fairly and responsibly. Whenever practical, we seek responses from individuals or organizations that are the subject of our reporting. We strive to present multiple viewpoints, avoid sensationalism, provide context, separate facts from commentary, and avoid misleading headlines or imagery.
                  </p>
                </section>

                {/* 4. Source Standards */}
                <section id="source-standards" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">4.</span> Source Standards
                  </h3>
                  <p className="mb-3">
                    Times Chicago relies on credible and verifiable sources. Preferred sources include government agencies, courts, academic institutions, peer-reviewed research, public records, qualified experts, and official statements.
                  </p>
                  <p>
                    Anonymous sources are used only when disclosure would place the source at genuine risk, the information is of significant public interest, and the identity of the source is approved by and known to the responsible editor. Times Chicago never pays for interviews or confidential information.
                  </p>
                </section>

                {/* 5. Original Journalism */}
                <section id="original-journalism" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">5.</span> Original Journalism
                  </h3>
                  <p>
                    We encourage independent reporting and original journalism. Our reporters identify themselves honestly, respect privacy and legal rights, conduct interviews ethically, preserve quotations accurately, and follow all applicable laws. Original reporting remains one of our highest priorities.
                  </p>
                </section>

                {/* 6. Attribution & Copyright */}
                <section id="attribution-copyright" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">6.</span> Attribution and Copyright
                  </h3>
                  <p>
                    Whenever information originates from another publication or organization, appropriate attribution is provided. Times Chicago respects intellectual property rights and does not tolerate plagiarism, fabricated quotations, copyright infringement, or misrepresentation of sources.
                  </p>
                </section>

                {/* 7. Opinion Content */}
                <section id="opinion-content" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">7.</span> Opinion and Editorial Content
                  </h3>
                  <p>
                    Opinion articles represent the views of their respective authors. Pieces are clearly labeled as opinion, editorials reflect the position of Times Chicago&apos; Editorial Board, and opinion content is kept separate from factual reporting. Contributors are expected to support opinions with credible evidence.
                  </p>
                </section>

                {/* 8. Corrections & Updates */}
                <section id="corrections-updates" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">8.</span> Corrections and Updates
                  </h3>
                  <p>
                    Transparency builds credibility. When errors are identified, we correct factual inaccuracies promptly, add correction notes, update developing stories with verified information, and publish retractions when necessary. Readers may report errors through our editorial channels.
                  </p>
                </section>

                {/* 9. Artificial Intelligence (AI) */}
                <section id="artificial-intelligence" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">9.</span> Artificial Intelligence (AI)
                  </h3>
                  <p className="mb-3">
                    Times Chicago may use artificial intelligence tools to assist with research support, language refinement, content organization, translation, or multimedia production.
                  </p>
                  <p>
                    However, human editors review all AI-assisted material. AI may never invent facts or quotations, and final responsibility always rests with human editors. Accuracy remains our highest priority.
                  </p>
                </section>

                {/* 10. Visuals & Multimedia */}
                <section id="visuals-multimedia" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">10.</span> Images, Video and Multimedia
                  </h3>
                  <p>
                    Visual content must accurately represent events. Times Chicago prohibits misleading image manipulation, fabricated visuals presented as authentic, or deceptive editing. Permitted edits include cropping, brightness, color, and resolution adjustments. Illustrations or AI-generated visual simulations will be clearly identified.
                  </p>
                </section>

                {/* 11. User-Generated Content */}
                <section id="user-generated-content" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">11.</span> User-Generated Content
                  </h3>
                  <p>
                    Readers may contribute comments, guest articles, opinion submissions, press releases, or letters to the editor. Times Chicago reserves the right to edit, reject, or remove submissions containing hate speech, defamation, false information, copyright violations, spam, illegal content, or personal harassment.
                  </p>
                </section>

                {/* 12. Sponsored Content & Ads */}
                <section id="sponsored-content" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">12.</span> Sponsored Content and Advertising
                  </h3>
                  <p>
                    Advertising is clearly separated from editorial content. Sponsored material is identified using labels such as Sponsored, Advertisement, Paid Partnership, or Promotional Content. Sponsors have no influence over newsroom decisions or coverage.
                  </p>
                </section>

                {/* 13. Conflicts of Interest */}
                <section id="conflicts-of-interest" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">13.</span> Conflicts of Interest
                  </h3>
                  <p>
                    Staff must avoid conflicts of interest. Members may not accept gifts/payments for coverage, invest in companies they regularly report on, cover organizations where they have financial interests, or use confidential information for personal gain. Any potential conflict must be disclosed.
                  </p>
                </section>

                {/* 14. Diversity & Inclusion */}
                <section id="diversity-inclusion" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">14.</span> Diversity and Inclusion
                  </h3>
                  <p>
                    Times Chicago believes journalism should represent diverse communities and perspectives. We are committed to inclusive reporting, respectful language, cultural sensitivity, equal opportunity, and avoiding stereotypes and discrimination.
                  </p>
                </section>

                {/* 15. Security and Confidential Sources */}
                <section id="source-security" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">15.</span> Security and Confidential Sources
                  </h3>
                  <p>
                    We recognize the importance of protecting confidential sources. Times Chicago uses reasonable measures to safeguard sensitive communications and respects legally protected journalistic confidentiality.
                  </p>
                </section>

                {/* 16. Community Standards */}
                <section id="community-standards" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">16.</span> Community Standards
                  </h3>
                  <p>
                    We encourage respectful discussion. Users may not post content that promotes violence, encourages illegal activity, contains threats/harassment, spreads deliberate misinformation, or violates intellectual property. Violations may result in restrictions.
                  </p>
                </section>

                {/* 17. Transparency */}
                <section id="transparency-policy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">17.</span> Transparency
                  </h3>
                  <p>
                    Whenever practical, Times Chicago explains how information was obtained, why anonymous sources were used, whether content was updated, whether AI tools assisted, and whether content is sponsored. Transparency helps readers evaluate reliability.
                  </p>
                </section>

                {/* 18. Continuous Improvement */}
                <section id="continuous-improvement" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">18.</span> Continuous Improvement
                  </h3>
                  <p className="mb-4">
                    Editorial standards evolve. Times Chicago regularly reviews its practices to reflect technological developments, industry best practices, legal requirements, and ethical standards. Staff receive ongoing training to maintain excellence.
                  </p>

                  {/* Contact Our Editorial Team Card */}
                  <div className="bg-[#F8F5EC] border border-[#E5E0D3] p-5 font-sans text-[13.5px] text-[#333333]">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[#00558C]">✉️</span>
                      <strong className="font-bold text-[#111111] text-[14px]">
                        Contact Our Editorial Team
                      </strong>
                    </div>
                    <p className="text-[12.5px] text-[#666666] mb-3">
                      Questions about our editorial standards, corrections, or news coverage may be directed to:
                    </p>
                    <p className="leading-snug text-[#555555]">
                      <strong className="font-bold text-[#111111]">Editorial Department</strong><br />
                      Times Chicago<br />
                      2316 Eastgate St #160<br />
                      Walla Walla, Washington (WA) 99362<br />
                      Email: <a href="mailto:info@timeschicago.com" className="font-bold text-[#00558C] hover:underline">info@timeschicago.com</a>
                    </p>
                  </div>
                </section>

                {/* Our Editorial Promise */}
                <section id="editorial-promise" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <div className="bg-[#F4F8FA] border border-[#D5E5EE] p-6 font-sans">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-[#00558C] text-[18px]">🎗️</span>
                      <h3 className="font-serif font-bold text-[20px] text-[#003366]">
                        Our Editorial Promise
                      </h3>
                    </div>
                    <div className="space-y-3 text-[13.5px] leading-relaxed text-[#334455]">
                      <p>
                        Times Chicago is committed to producing journalism that serves the public interest with honesty, independence, and accountability. We believe that trust is earned through transparency, ethical reporting, rigorous fact-checking, and a commitment to correcting mistakes when they occur.
                      </p>
                      <p>
                        Every story we publish reflects our dedication to informing readers with accuracy, fairness, and integrity while upholding the highest standards of professional journalism.
                      </p>
                    </div>
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
