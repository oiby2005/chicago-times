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
  { id: "sec-1", label: "1. Company Information & Contact" },
  { id: "sec-2", label: "2. Eligibility and Lawful Use" },
  { id: "sec-3", label: "3. Permitted Use" },
  { id: "sec-4", label: "4. News Content & Editorial Standards" },
  { id: "sec-5", label: "5. Accuracy and Completeness" },
  { id: "sec-6", label: "6. No Professional Advice" },
  { id: "sec-7", label: "7. Intellectual Property" },
  { id: "sec-8", label: "8. User Submissions" },
  { id: "sec-9", label: "9. News Tips and Confidentiality" },
  { id: "sec-10", label: "10. Comments & Interactive Features" },
  { id: "sec-11", label: "11. Advertising & Sponsored Content" },
  { id: "sec-12", label: "12. Third-Party Websites" },
  { id: "sec-13", label: "13. Privacy and Cookies" },
  { id: "sec-14", label: "14. Accounts and Security" },
  { id: "sec-15", label: "15. Availability and Changes" },
  { id: "sec-16", label: "16. Copyright Complaints" },
  { id: "sec-17", label: "17. Disclaimer of Warranties" },
  { id: "sec-18", label: "18. Limitation of Liability" },
  { id: "sec-19", label: "19. Indemnification" },
  { id: "sec-20", label: "20. Suspension and Termination" },
  { id: "sec-21", label: "21. Governing Law & Jurisdiction" },
  { id: "sec-22", label: "22. Changes to These Terms" },
  { id: "sec-23", label: "23. Severability and No Waiver" },
  { id: "sec-24", label: "24. Entire Agreement" },
  { id: "sec-25", label: "25. Contact Us" },
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
              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight">
                Terms and Conditions
              </h1>
              <p className="font-serif text-[18px] sm:text-[20px] text-[#444444] mt-2">
                Times Chicago LLC
              </p>
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ==================== LEFT SIDEBAR: STICKY TABLE OF CONTENTS (4 of 12 cols ~ 33%) ==================== */}
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
                        TABLE OF CONTENTS
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

                  <nav className={`space-y-0.5 ${isTocOpen ? "block" : "hidden lg:block"} max-h-[70vh] overflow-y-auto no-scrollbar`}>
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

                {/* Metadata Summary Table */}
                <div className="border border-[#E2DDD0] overflow-hidden rounded-none">
                  <table className="w-full text-left text-xs sm:text-[13px] font-sans">
                    <tbody className="divide-y divide-[#E2DDD0]">
                      <tr className="bg-[#FAF8F5]">
                        <th className="py-2.5 px-4 font-bold text-[#111111] w-1/3 border-r border-[#E2DDD0]">Website</th>
                        <td className="py-2.5 px-4 text-[#00558c]">
                          <a href="https://www.timeschicago.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                            https://www.timeschicago.com/
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th className="py-2.5 px-4 font-bold text-[#111111] border-r border-[#E2DDD0]">Business Address</th>
                        <td className="py-2.5 px-4 text-[#333333]">1246 J Clark St, Suite 1100, Chicago, IL 60603, United States</td>
                      </tr>
                      <tr className="bg-[#FAF8F5]">
                        <th className="py-2.5 px-4 font-bold text-[#111111] border-r border-[#E2DDD0]">Effective Date</th>
                        <td className="py-2.5 px-4 text-[#333333]">October 10, 2026</td>
                      </tr>
                      <tr>
                        <th className="py-2.5 px-4 font-bold text-[#111111] border-r border-[#E2DDD0]">Last Updated</th>
                        <td className="py-2.5 px-4 text-[#333333]">October 10, 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Introduction */}
                <section id="intro" className="scroll-mt-28">
                  <h2 className="font-serif font-bold text-[24px] text-[#111111] pb-2 mb-4 border-b border-[#E5E0D3]">
                    Introduction
                  </h2>
                  <div className="space-y-4">
                    <p>
                      These Terms and Conditions (&ldquo;Terms&rdquo;) govern access to and use of Times Chicago LLC&rsquo;s website at{" "}
                      <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">
                        https://www.timeschicago.com/
                      </a>{" "}
                      and related digital platforms, content, and services (collectively, the &ldquo;Services&rdquo;), including news articles, reporting, commentary, analysis, photographs, videos, graphics, newsletters, and interactive features.
                    </p>
                    <p>
                      By accessing or using the Services, you agree to these Terms. If you do not agree, please stop using the Services. These Terms should be read together with any applicable Privacy Policy and additional terms presented for a particular feature or service.
                    </p>
                  </div>
                </section>

                {/* 1. Company Information and Contact */}
                <section id="sec-1" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">1.</span> Company Information and Contact
                  </h3>
                  <div className="space-y-3">
                    <p className="font-semibold text-[#111111]">Times Chicago LLC</p>
                    <p>1246 J Clark St, Suite 1100<br />Chicago, IL 60603, United States</p>
                    <p>Website: <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a></p>
                    <p>General inquiries: use the contact information published on the official website.</p>
                    <p>Legal and privacy inquiries: use the relevant contact channel published on the official website. Before publication, ensure working contact details are available for legal notices and privacy requests.</p>
                  </div>
                </section>

                {/* 2. Eligibility and Lawful Use */}
                <section id="sec-2" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">2.</span> Eligibility and Lawful Use
                  </h3>
                  <p>
                    You may use the Services only for lawful purposes and in accordance with these Terms. You agree not to misuse the Services, submit fraudulent information, impersonate another person, interfere with other users, or violate applicable laws. If you use the Services on behalf of an organization, you represent that you are authorized to do so.
                  </p>
                </section>

                {/* 3. Permitted Use */}
                <section id="sec-3" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">3.</span> Permitted Use
                  </h3>
                  <p>
                    You may access and read publicly available content for personal, non-commercial purposes and share links to our pages, provided you do not misrepresent the content or imply an endorsement that does not exist. You must not copy, republish, sell, distribute, scrape, or commercially exploit substantial portions of our content without permission, except where applicable law permits. You must not bypass access controls, disrupt the Services, introduce malware, or attempt unauthorized access.
                  </p>
                </section>

                {/* 4. News Content and Editorial Standards */}
                <section id="sec-4" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">4.</span> News Content and Editorial Standards
                  </h3>
                  <p>
                    Times Chicago may publish news, reporting, interviews, analysis, opinion, photographs, videos, graphics, syndicated material, licensed material, and links to third-party sources. We aim to publish relevant and reliable material, but news can develop quickly and information may change. We may update, correct, clarify, edit, or remove content when appropriate. Opinion and sponsored material should be identified where required by law or editorial policy.
                  </p>
                </section>

                {/* 5. Accuracy and Completeness */}
                <section id="sec-5" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">5.</span> Accuracy and Completeness
                  </h3>
                  <p>
                    We make reasonable efforts to maintain the quality of our content but do not guarantee that every article, statement, statistic, image, quotation, or link is accurate, complete, current, or error-free. To the extent permitted by law, the Services and content are provided without a guarantee of completeness or suitability for a particular purpose. Nothing in these Terms excludes a right or responsibility that cannot legally be excluded.
                  </p>
                </section>

                {/* 6. No Professional Advice */}
                <section id="sec-6" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">6.</span> No Professional Advice
                  </h3>
                  <p>
                    Content is provided for general informational purposes and is not individualized legal, medical, tax, accounting, investment, or other professional advice unless expressly stated otherwise. Financial and market coverage is not an individualized investment recommendation. Consider consulting a qualified professional before making decisions that require specialized advice.
                  </p>
                </section>

                {/* 7. Intellectual Property */}
                <section id="sec-7" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">7.</span> Intellectual Property
                  </h3>
                  <p>
                    Unless otherwise stated, original content, articles, graphics, logos, design elements, videos, photographs, and other materials on the Services are owned by Times Chicago LLC or used under license and may be protected by intellectual property laws. You may not reproduce, modify, republish, commercially exploit, or redistribute protected material without permission, except as permitted by applicable law. Third-party materials remain subject to their owners&rsquo; rights and applicable licenses.
                  </p>
                </section>

                {/* 8. User Submissions */}
                <section id="sec-8" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">8.</span> User Submissions
                  </h3>
                  <p>
                    If you submit news tips, photographs, videos, comments, documents, story ideas, or other materials (&ldquo;User Submissions&rdquo;), you represent that you have the necessary rights and permissions and that the material does not unlawfully infringe another person&rsquo;s rights. You retain ownership of material you own. By submitting material for consideration, you grant Times Chicago LLC a non-exclusive, worldwide, royalty-free license to review, reproduce, edit, adapt, publish, display, distribute, and use the material in connection with editorial operations and the Services, to the extent reasonably necessary for those purposes. A separate written agreement may govern a specific submission. Submission does not guarantee publication, payment, confidentiality, or a response.
                  </p>
                </section>

                {/* 9. News Tips and Confidentiality */}
                <section id="sec-9" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">9.</span> News Tips and Confidentiality
                  </h3>
                  <p>
                    Submitting a news tip does not automatically establish a confidential, privileged, or protected journalist-source relationship. Ordinary email and website forms may not be secure or anonymous. Do not submit confidential or sensitive information unless necessary and after considering the risks. If source confidentiality is important, contact the editorial team before sending sensitive material and use an appropriate secure method where available.
                  </p>
                </section>

                {/* 10. Comments and Interactive Features */}
                <section id="sec-10" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">10.</span> Comments and Interactive Features
                  </h3>
                  <p>
                    If comments, forums, or other interactive features are available, users must not post unlawful, fraudulent, threatening, harassing, defamatory, infringing, or otherwise prohibited material. We may moderate, restrict, remove, or decline to publish content in accordance with applicable law and our editorial policies. Users remain responsible for their submissions.
                  </p>
                </section>

                {/* 11. Advertising and Sponsored Content */}
                <section id="sec-11" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">11.</span> Advertising and Sponsored Content
                  </h3>
                  <p>
                    The Services may contain advertising, sponsorships, affiliate links, or promotional content. The presence of an advertisement does not necessarily constitute an endorsement. Advertisers and sponsors are responsible for their claims, materials, and legal compliance. Commercial relationships do not automatically guarantee editorial coverage or a favorable editorial outcome. Sponsored material should be identified where required by law.
                  </p>
                </section>

                {/* 12. Third-Party Websites */}
                <section id="sec-12" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">12.</span> Third-Party Websites
                  </h3>
                  <p>
                    Our Services may link to websites or services operated by third parties. We do not control all third-party content, security, or privacy practices and are not responsible for their independent operation. Links do not necessarily imply endorsement. Your use of third-party services is subject to their own terms and policies.
                  </p>
                </section>

                {/* 13. Privacy and Cookies */}
                <section id="sec-13" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">13.</span> Privacy and Cookies
                  </h3>
                  <p>
                    Your use of the Services is also subject to our Privacy Policy, which should be available at a clearly identified location on{" "}
                    <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">
                      https://www.timeschicago.com/
                    </a>. Our website may use cookies, analytics, log files, or similar technologies depending on the features enabled. The Privacy Policy should accurately describe the data actually collected, how it is used and shared, retention, security, and available privacy choices. These Terms do not replace any legally required consent or privacy disclosure.
                  </p>
                </section>

                {/* 14. Accounts and Security */}
                <section id="sec-14" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">14.</span> Accounts and Security
                  </h3>
                  <p>
                    If accounts are offered, you must provide accurate information and take reasonable steps to protect your credentials. Notify us promptly if you suspect unauthorized account access. You must not access another person&rsquo;s account without authorization. We may restrict access where reasonably necessary to protect users, the Services, or our legal rights.
                  </p>
                </section>

                {/* 15. Availability and Changes */}
                <section id="sec-15" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">15.</span> Availability and Changes
                  </h3>
                  <p>
                    We may modify, suspend, discontinue, or restrict any part of the Services for operational, editorial, security, legal, or business reasons. We do not guarantee uninterrupted access or freedom from technical errors. Where required by law, we will provide any required notice of material changes.
                  </p>
                </section>

                {/* 16. Copyright and Intellectual Property Complaints */}
                <section id="sec-16" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">16.</span> Copyright and Intellectual Property Complaints
                  </h3>
                  <p>
                    If you believe material on the Services infringes your copyright or other rights, contact us through the legal or copyright contact published on the official website. Provide your contact details, identify the work and disputed material (including its URL), explain the basis of your claim, and provide information reasonably establishing your authority. We may investigate and take appropriate action. Formal notices under the U.S. Digital Millennium Copyright Act may have additional requirements; do not assume a general contact channel is a designated DMCA agent.
                  </p>
                </section>

                {/* 17. Disclaimer of Warranties */}
                <section id="sec-17" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">17.</span> Disclaimer of Warranties
                  </h3>
                  <p>
                    To the fullest extent permitted by applicable law, the Services and content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not warrant that the Services will be uninterrupted, secure, error-free, or suitable for every purpose. This section does not limit any warranty or right that cannot lawfully be excluded.
                  </p>
                </section>

                {/* 18. Limitation of Liability */}
                <section id="sec-18" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">18.</span> Limitation of Liability
                  </h3>
                  <p>
                    To the fullest extent permitted by law, Times Chicago LLC and its owners, officers, employees, contractors, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, business opportunities, goodwill, or data arising from use of or inability to use the Services. This section does not exclude or limit liability for fraud, intentional misconduct, gross negligence, or any liability that cannot legally be excluded or limited, and does not restrict non-waivable consumer rights.
                  </p>
                </section>

                {/* 19. Indemnification */}
                <section id="sec-19" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">19.</span> Indemnification
                  </h3>
                  <p>
                    To the extent permitted by law, you are responsible for losses, claims, liabilities, and reasonable expenses arising directly from your unlawful use of the Services, material violation of these Terms, or infringement of another person&rsquo;s rights. This section does not require indemnification for our own conduct where prohibited by law.
                  </p>
                </section>

                {/* 20. Suspension and Termination */}
                <section id="sec-20" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">20.</span> Suspension and Termination
                  </h3>
                  <p>
                    We may restrict or terminate access where we reasonably believe a user has materially violated these Terms, created a security risk, engaged in unlawful activity, or misused the Services. Where appropriate and practicable, we may provide notice or an opportunity to address the issue. Accrued rights and provisions that by their nature should survive termination remain unaffected.
                  </p>
                </section>

                {/* 21. Governing Law and Jurisdiction */}
                <section id="sec-21" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">21.</span> Governing Law and Jurisdiction
                  </h3>
                  <p>
                    These Terms are governed by the laws of the State of Illinois, without regard to conflict-of-law principles, except where applicable law requires otherwise. Subject to mandatory consumer protections and jurisdictional requirements, disputes will be brought before competent state or federal courts located in Illinois. Nothing in this section prevents a person from exercising rights that applicable law requires or permits.
                  </p>
                </section>

                {/* 22. Changes to These Terms */}
                <section id="sec-22" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">22.</span> Changes to These Terms
                  </h3>
                  <p>
                    We may revise these Terms to reflect changes to our Services, operations, or legal requirements. The &ldquo;Last Updated&rdquo; date indicates when they were most recently revised. Where required, material changes will be communicated through the website or another appropriate method. Continued use after revised Terms become effective may constitute acceptance where legally valid.
                  </p>
                </section>

                {/* 23. Severability and No Waiver */}
                <section id="sec-23" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">23.</span> Severability and No Waiver
                  </h3>
                  <p>
                    If any provision is found unlawful, invalid, or unenforceable, it will be limited or severed to the minimum extent necessary, and the remaining provisions will continue to apply to the extent permitted by law. A failure or delay in enforcing a provision does not waive the right to enforce it later.
                  </p>
                </section>

                {/* 24. Entire Agreement */}
                <section id="sec-24" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">24.</span> Entire Agreement
                  </h3>
                  <p>
                    These Terms, together with the Privacy Policy and any additional terms expressly incorporated by reference, govern your use of the Services. A separate written agreement for a particular service, contributor relationship, subscription, or commercial arrangement will govern to the extent it expressly conflicts with these Terms.
                  </p>
                </section>

                {/* 25. Contact Us */}
                <section id="sec-25" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h3 className="font-serif font-bold text-[19px] text-[#111111] mb-3">
                    <span className="text-[#990000] font-bold mr-1">25.</span> Contact Us
                  </h3>
                  <div className="space-y-3">
                    <p>
                      For questions about these Terms and Conditions, visit{" "}
                      <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">
                        https://www.timeschicago.com/
                      </a>{" "}
                      and use the official contact information published there.
                    </p>
                    <div className="pt-2 text-xs sm:text-[13px] text-[#555555] space-y-1">
                      <p className="font-bold text-[#111111]">Times Chicago LLC</p>
                      <p>1246 J Clark St, Suite 1100</p>
                      <p>Chicago, IL 60603, United States</p>
                      <p>Website: <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a></p>
                    </div>
                    <p className="pt-2 text-xs text-[#777777]">
                      &copy; 2026 Times Chicago LLC. All rights reserved.
                    </p>
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
