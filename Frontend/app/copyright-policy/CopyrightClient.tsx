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
  { id: "purpose-scope", label: "1. Purpose and Scope" },
  { id: "ownership", label: "2. Ownership of Content" },
  { id: "permitted-use", label: "3. Permitted Use" },
  { id: "attribution", label: "4. Attribution & Third-Party Material" },
  { id: "user-submissions", label: "5. User Submissions" },
  { id: "complaints", label: "6. Copyright Complaints & Takedown" },
  { id: "dmca-notices", label: "7. DMCA Notices (United States)" },
  { id: "counter-notices", label: "8. Counter-Notices" },
  { id: "repeat-infringement", label: "9. Repeat Infringement" },
  { id: "copyright-our-material", label: "10. Copyright in Our Material" },
  { id: "external-websites", label: "11. External Websites and Links" },
  { id: "changes-policy", label: "12. Changes to This Policy" },
  { id: "contact-us", label: "13. Contact Us" },
];

export default function CopyrightClient() {
  const [activeSection, setActiveSection] = useState<string>("purpose-scope");
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
                COPYRIGHT POLICY
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
                {/* 1. Purpose and Scope */}
                <section id="purpose-scope" className="scroll-mt-28">
                  <h2 className="font-serif font-bold text-[22px] text-[#111111] pb-2 mb-4 border-b border-[#E5E0D3]">
                    1. Purpose and Scope
                  </h2>
                  <p>
                    This Copyright Policy explains how Times Chicago LLC (&ldquo;Times Chicago,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) addresses copyright on <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a> (the &ldquo;Website&rdquo;). It applies to material published on the Website, including articles, photographs, illustrations, graphics, videos, logos, page design, and other content, subject to the rights of their respective owners.
                  </p>
                </section>

                {/* 2. Ownership of Content */}
                <section id="ownership" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    2. Ownership of Content
                  </h2>
                  <p className="mb-3">
                    Unless a page or item states otherwise, original content created for and published by Times Chicago LLC may be protected by copyright and other applicable intellectual-property laws. Rights in third-party material remain with their respective copyright owners. Nothing in this Policy transfers ownership of third-party material to Times Chicago LLC.
                  </p>
                  <p>
                    Copyright does not generally protect facts, ideas, or news events as such, although it may protect the original wording, photographs, artwork, video, and other creative expression used to report them.
                  </p>
                </section>

                {/* 3. Permitted Use */}
                <section id="permitted-use" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    3. Permitted Use
                  </h2>
                  <p className="mb-3">
                    You may access and read Website content for personal, non-commercial use, subject to applicable law and any additional terms displayed on the Website. Unless you have written permission, a licence, or another lawful basis, do not reproduce, republish, redistribute, sell, publicly display, or create derivative works from protected content in a way that infringes the rights of the owner.
                  </p>
                  <p>
                    Brief quotations for purposes such as criticism, commentary, or reporting may be permitted in some circumstances under applicable law. Attribution alone does not automatically make copying lawful, and exceptions vary by jurisdiction. Seek permission when required.
                  </p>
                </section>

                {/* 4. Attribution and Third-Party Material */}
                <section id="attribution" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    4. Attribution and Third-Party Material
                  </h2>
                  <p>
                    Where reasonably practicable, Times Chicago LLC seeks to identify sources and credit third-party material according to the applicable licence, permission, or source requirements. A credit line or link does not, by itself, establish permission to use a photograph, graphic, article, or other work. If you believe material has been credited incorrectly or used without authorization, contact us using the details below and identify the specific page and material.
                  </p>
                </section>

                {/* 5. User Submissions */}
                <section id="user-submissions" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    5. User Submissions
                  </h2>
                  <p>
                    If the Website allows you to submit comments, articles, photographs, documents, or other material, you retain any rights you own in your submission. By submitting material, you represent that you have the necessary rights and permissions and that your submission does not unlawfully infringe another person’s rights. You grant Times Chicago LLC only those permissions reasonably necessary to receive, review, moderate, publish, display, and operate the relevant Website feature, as described in the applicable submission terms. If no submission feature exists, this section does not apply.
                  </p>
                </section>

                {/* 6. Copyright Complaints and Takedown Requests */}
                <section id="complaints" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    6. Copyright Complaints and Takedown Requests
                  </h2>
                  <p className="mb-3">
                    If you believe material on the Website infringes copyright you own or are authorized to represent, send a written notice to <a href="mailto:worldnews@timeschicago.com" className="font-bold text-[#00558c] hover:underline">worldnews@timeschicago.com</a>. Please include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 mb-3">
                    <li>Your name and contact information.</li>
                    <li>Identification of the copyrighted work you claim has been infringed.</li>
                    <li>The exact URL(s) of the material you believe is infringing, with enough detail for us to locate it.</li>
                    <li>An explanation of your ownership or authority to act for the rights holder.</li>
                    <li>A description of the alleged infringement and the action you request.</li>
                    <li>A statement that the information in your notice is accurate and that you are the rights holder or authorized to act on the rights holder’s behalf.</li>
                  </ul>
                  <p>
                    We may request additional information, review the complaint, restrict access to the identified material, or take other appropriate action. A complaint does not guarantee removal. We may notify the person who submitted the material where appropriate and lawful. Please do not knowingly submit false or misleading claims.
                  </p>
                </section>

                {/* 7. DMCA Notices (United States) */}
                <section id="dmca-notices" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    7. DMCA Notices (United States)
                  </h2>
                  <p className="mb-3">
                    If you intend to submit a notice under the United States Digital Millennium Copyright Act (DMCA), include the information required by 17 U.S.C. § 512(c)(3), which generally includes a physical or electronic signature; identification of the copyrighted work; identification of the allegedly infringing material and information reasonably sufficient to locate it; your contact information; a good-faith statement that the use is not authorized by the copyright owner, its agent, or the law; and a statement, under penalty of perjury, that the information is accurate and that you are authorized to act for the owner of an exclusive right allegedly infringed.
                  </p>
                  <p>
                    Send notices to <a href="mailto:worldnews@timeschicago.com" className="font-bold text-[#00558c] hover:underline">worldnews@timeschicago.com</a> with the subject line &ldquo;Copyright / DMCA Notice.&rdquo; This email contact is provided for receiving inquiries and notices; it does not mean that Times Chicago LLC has registered a DMCA designated agent with the U.S. Copyright Office. If a designated agent is required for your operations, confirm registration and publish the agent’s official details before relying on this section as a formal DMCA process.
                  </p>
                </section>

                {/* 8. Counter-Notices */}
                <section id="counter-notices" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    8. Counter-Notices
                  </h2>
                  <p>
                    If your material is removed or disabled following a copyright complaint and you believe this was a mistake or misidentification, you may contact us with the relevant URL, an explanation, and supporting information. A formal DMCA counter-notice has specific statutory requirements and legal consequences. Before submitting one, review 17 U.S.C. § 512(g) and consider obtaining legal advice. We will handle formal counter-notices only in accordance with applicable law and any valid process we have established.
                  </p>
                </section>

                {/* 9. Repeat Infringement */}
                <section id="repeat-infringement" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    9. Repeat Infringement
                  </h2>
                  <p>
                    Where applicable law requires or permits it, Times Chicago LLC may restrict or terminate access for users or contributors who repeatedly infringe copyright. Any action will be assessed in light of the circumstances, available information, and applicable law.
                  </p>
                </section>

                {/* 10. Copyright in Our Material */}
                <section id="copyright-our-material" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    10. Copyright in Our Material
                  </h2>
                  <p>
                    To request permission to reproduce original Times Chicago LLC content, contact <a href="mailto:worldnews@timeschicago.com" className="font-bold text-[#00558c] hover:underline">worldnews@timeschicago.com</a> and provide the URL, the material you want to use, the intended use, the audience, and the publication or platform where it will appear. Permission is not granted unless confirmed by an authorized representative in writing or through a valid licence.
                  </p>
                </section>

                {/* 11. External Websites and Links */}
                <section id="external-websites" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    11. External Websites and Links
                  </h2>
                  <p>
                    The Website may link to third-party websites or display material provided by third parties. Times Chicago LLC does not claim ownership of third-party content merely because it is linked to, embedded, or referenced. Third-party websites are governed by their own terms and policies.
                  </p>
                </section>

                {/* 12. Changes to This Policy */}
                <section id="changes-policy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    12. Changes to This Policy
                  </h2>
                  <p>
                    We may update this Policy from time to time. The &ldquo;Last Updated&rdquo; date above indicates when it was most recently revised. The updated version will be posted on the Website and will apply from its stated effective date, subject to applicable law.
                  </p>
                </section>

                {/* 13. Contact Us */}
                <section id="contact-us" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    13. Contact Us
                  </h2>
                  <div className="bg-[#FAF8F5] p-5 border border-[#E5E0D3] space-y-1.5 text-xs sm:text-sm">
                    <p><strong className="font-bold text-[#111111]">Times Chicago LLC</strong></p>
                    <p><strong className="font-bold text-[#111111]">Website:</strong> <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a></p>
                    <p><strong className="font-bold text-[#111111]">Email:</strong> <a href="mailto:worldnews@timeschicago.com" className="text-[#00558c] hover:underline">worldnews@timeschicago.com</a></p>
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
