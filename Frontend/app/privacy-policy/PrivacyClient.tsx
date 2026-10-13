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
  { id: "who-we-are", label: "1. Who We Are and Scope" },
  { id: "info-we-collect", label: "2. Categories of Information We Collect" },
  { id: "how-we-use", label: "3. How We Use Information" },
  { id: "legal-bases", label: "4. Legal Bases for Processing" },
  { id: "news-tips", label: "5. News Tips, Sources & Confidentiality" },
  { id: "cookies-pixels", label: "6. Cookies, Pixels & Technologies" },
  { id: "newsletters", label: "7. Newsletters and Email" },
  { id: "how-we-disclose", label: "8. How We Disclose Information" },
  { id: "advertising-sponsorships", label: "9. Advertising & Third-Party Tools" },
  { id: "data-retention", label: "10. Data Retention" },
  { id: "security-measures", label: "11. Security Measures" },
  { id: "privacy-rights", label: "12. Privacy Rights and Choices" },
  { id: "children-minors", label: "13. Children and Minors" },
  { id: "third-party-websites", label: "14. Third-Party Websites & Social Media" },
  { id: "international-transfers", label: "15. International Data Transfers" },
  { id: "privacy-signals", label: "16. Do Not Track & Privacy Signals" },
  { id: "changes-policy", label: "17. Changes to This Privacy Policy" },
  { id: "contact-requests", label: "18. Contact and Privacy Requests" },
  { id: "important-notice", label: "19. Important Notice About This Policy" },
];

export default function PrivacyClient() {
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
                PRIVACY POLICY
              </h1>
              <p className="mt-2 text-xs font-sans text-[#666666]">
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
                        PRIVACY POLICY SECTIONS
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
                    This Privacy Policy describes how Times Chicago LLC (&ldquo;Times Chicago,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) may collect, receive, use, store, disclose, and otherwise process information in connection with <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a> and related digital services, including news articles, newsletters, contact forms, reader communications, interactive features, and any associated services (collectively, the &ldquo;Services&rdquo;). It is intended to provide a detailed explanation of our privacy practices. It must be checked against the Services and technologies actually in use before publication; this document is not a claim that every practice described is currently enabled.
                  </p>
                </section>

                {/* 1. Who We Are and Scope of This Policy */}
                <section id="who-we-are" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    1. Who We Are and Scope of This Policy
                  </h2>
                  <p className="mb-3">
                    Times Chicago LLC operates the website identified above. This Policy applies to information processed through the Services and to communications you send to us in connection with them. It does not automatically apply to independent third-party websites, services, or platforms that we do not control.
                  </p>
                  <p>
                    If a particular feature has a separate privacy notice, subscription agreement, contest rule, or other specific terms, that notice may supplement this Policy for that feature. If a separate notice conflicts with this Policy, the separate notice will govern to the extent stated in it and permitted by law.
                  </p>
                </section>

                {/* 2. Categories of Information We May Collect */}
                <section id="info-we-collect" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    2. Categories of Information We May Collect
                  </h2>
                  <div className="space-y-3">
                    <p>
                      <strong className="font-bold text-[#111111]">Information you provide directly.</strong> This may include your name, email address, message contents, newsletter preferences, comments, survey responses, news tips, photographs, videos, documents, story ideas, and other information you choose to submit through forms, email, or other communication channels.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Technical and device information.</strong> When you visit the Services, our systems or service providers may receive information such as IP address, browser type, operating system, device identifiers, language settings, referring or exit pages, pages viewed, dates and times of visits, approximate location inferred from an IP address, and diagnostic or security logs.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Usage and interaction information.</strong> Depending on the features enabled, we may collect information about how visitors navigate the website, which pages or links they use, whether content or newsletters are opened, and interactions with embedded media or other website features.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Cookie and similar technology data.</strong> Cookies, pixels, local storage, tags, or similar tools may be used for essential functionality, preference management, audience measurement, security, advertising, or performance analytics, where enabled and permitted.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Information from other sources.</strong> We may receive information from vendors, newsletter or hosting providers, analytics services, social media platforms, or other sources when those sources lawfully provide it to us or when you choose to interact with them.
                    </p>
                  </div>
                </section>

                {/* 3. How We Use Information */}
                <section id="how-we-use" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    3. How We Use Information
                  </h2>
                  <p className="mb-3">
                    We may use information for the following purposes, as relevant to the Services:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To operate, maintain, troubleshoot, and improve the website and its features.</li>
                    <li>To respond to questions, messages, corrections, feedback, press inquiries, and news tips.</li>
                    <li>To send newsletters or updates when requested and to manage subscriptions and unsubscribe requests.</li>
                    <li>To review submissions and support editorial, reporting, moderation, and publication workflows.</li>
                    <li>To understand readership, measure audience engagement, and assess content performance.</li>
                    <li>To detect, prevent, investigate, and respond to fraud, spam, abuse, security incidents, and technical problems.</li>
                    <li>To enforce our terms, protect our rights, and protect users, staff, sources, and the public.</li>
                    <li>To comply with applicable laws, lawful requests, regulatory obligations, and court orders.</li>
                    <li>To establish, exercise, or defend legal claims and to maintain appropriate business records.</li>
                  </ul>
                </section>

                {/* 4. Legal Bases for Processing Where Required */}
                <section id="legal-bases" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    4. Legal Bases for Processing Where Required
                  </h2>
                  <p className="mb-3">
                    Depending on the applicable privacy law and the context, our processing may rely on one or more lawful grounds, such as your consent; the need to provide a service or take steps you request; compliance with a legal obligation; our legitimate interests in operating a news publication, securing our services, communicating with readers, and improving our website; or the establishment, exercise, or defence of legal claims.
                  </p>
                  <p>
                    Where consent is required, you may withdraw it as permitted by law. Withdrawal does not affect processing that took place before withdrawal or processing that relies on another lawful basis.
                  </p>
                </section>

                {/* 5. News Tips, Sources, and Confidential Information */}
                <section id="news-tips" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    5. News Tips, Sources, and Confidential Information
                  </h2>
                  <p className="mb-3">
                    News tips and editorial submissions may contain personal, confidential, or sensitive information about you or other people. Please consider the risks before sending such material. Standard email and ordinary website forms may not be encrypted end-to-end, anonymous, or suitable for highly sensitive information.
                  </p>
                  <p className="mb-3">
                    Sending a news tip does not automatically create a confidential, privileged, or legally protected journalist-source relationship. Any source-protection obligations depend on the circumstances and applicable law. If confidentiality is important, contact the editorial team before sending sensitive information and ask whether an appropriate secure method is available.
                  </p>
                  <p>
                    Please do not submit information you are not legally entitled to disclose, or personal information about another person that is unnecessary for the matter you are reporting.
                  </p>
                </section>

                {/* 6. Cookies, Pixels, and Similar Technologies */}
                <section id="cookies-pixels" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    6. Cookies, Pixels, and Similar Technologies
                  </h2>
                  <p className="mb-3">
                    The Services may use cookies or similar technologies to remember settings, maintain site functionality, measure performance, detect abuse, understand audience trends, or support advertising and embedded content, depending on the technologies enabled.
                  </p>
                  <div className="space-y-2 mb-3">
                    <p><strong className="font-bold text-[#111111]">Strictly necessary technologies.</strong> These may support security, network management, accessibility, or features you specifically request.</p>
                    <p><strong className="font-bold text-[#111111]">Preference technologies.</strong> These may remember choices such as language or display settings.</p>
                    <p><strong className="font-bold text-[#111111]">Analytics technologies.</strong> If enabled, these may help measure visits, page views, referral sources, and general usage patterns.</p>
                    <p><strong className="font-bold text-[#111111]">Advertising and social technologies.</strong> If enabled, these may measure campaigns, limit repeated advertisements, or support third-party content and social media features.</p>
                  </div>
                  <p className="mb-3">
                    You can control cookies through your browser settings and, where provided, the website&apos;s cookie preference tool. Blocking certain technologies may affect website functionality. Where consent, opt-out, or a universal preference signal must be honored under applicable law, the relevant mechanisms should be configured accordingly.
                  </p>
                  <p>
                    Before publication, Times Chicago should identify the specific cookies, pixels, analytics services, advertising providers, and embedded technologies actually used, and provide accurate information about their purposes and retention.
                  </p>
                </section>

                {/* 7. Newsletters and Email Communications */}
                <section id="newsletters" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    7. Newsletters and Email Communications
                  </h2>
                  <p className="mb-3">
                    If you subscribe to a newsletter or other email update, we may use your email address and subscription preferences to deliver the requested communications and administer your subscription.
                  </p>
                  <p className="mb-3">
                    You may unsubscribe from promotional or newsletter communications through the unsubscribe link included in the message, where available, or by contacting us at <a href="mailto:worldnews@timeschicago.com" className="font-bold text-[#00558c] hover:underline">worldnews@timeschicago.com</a>. We may still send non-promotional messages relating to a request you made or a legal or administrative matter where appropriate.
                  </p>
                  <p>
                    If a third-party provider manages newsletter delivery, that provider may process information on our behalf under its own service terms and privacy safeguards. The provider should be identified in this Policy if used.
                  </p>
                </section>

                {/* 8. How We Disclose Information */}
                <section id="how-we-disclose" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    8. How We Disclose Information
                  </h2>
                  <p className="mb-3">
                    We may disclose information in the following circumstances, subject to applicable law:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mb-3">
                    <li><strong className="font-bold text-[#111111]">Service providers.</strong> To vendors that provide hosting, security, website maintenance, email delivery, newsletter management, analytics, technical support, or similar services.</li>
                    <li><strong className="font-bold text-[#111111]">Editorial and user-directed sharing.</strong> Where you ask us to publish or share a submission, or where publication is part of the service you requested. We will consider the context and any applicable agreement or legal obligation.</li>
                    <li><strong className="font-bold text-[#111111]">Legal and safety matters.</strong> Where we reasonably believe disclosure is required by law, legal process, or a valid governmental request, or is necessary to protect rights, safety, property, or the integrity of the Services.</li>
                    <li><strong className="font-bold text-[#111111]">Business transactions.</strong> In connection with a proposed or completed merger, restructuring, financing, acquisition, sale, or transfer of some or all of the relevant business or assets, subject to appropriate safeguards.</li>
                    <li><strong className="font-bold text-[#111111]">With consent or at your direction.</strong> Where you have requested or authorized a particular disclosure.</li>
                  </ul>
                  <p>
                    We do not make a blanket promise that information is never shared or sold. Any statement about sale, sharing for targeted advertising, or other regulated data use must reflect our actual practices and applicable law.
                  </p>
                </section>

                {/* 9. Advertising, Sponsorships, and Third-Party Tools */}
                <section id="advertising-sponsorships" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    9. Advertising, Sponsorships, and Third-Party Tools
                  </h2>
                  <p className="mb-3">
                    The Services may contain advertisements, sponsored content, affiliate links, social media features, video players, maps, or other third-party integrations. If enabled, these third parties may collect information directly through their tools and may combine it with information they already hold, subject to their own privacy notices and settings.
                  </p>
                  <p>
                    Times Chicago should identify relevant advertising, analytics, affiliate, and embedded-content providers and explain applicable opt-out or consent choices where required. The presence of a link, advertisement, or sponsor does not necessarily constitute an endorsement.
                  </p>
                </section>

                {/* 10. Data Retention */}
                <section id="data-retention" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    10. Data Retention
                  </h2>
                  <p className="mb-3">
                    We retain information only for as long as reasonably necessary for the purposes described in this Policy, unless a longer period is required or permitted by law. Retention may depend on the type of information, the purpose for collection, legal obligations, security needs, dispute resolution, and editorial or recordkeeping requirements.
                  </p>
                  <p>
                    For example, correspondence may be retained long enough to respond and maintain business records; subscription data may be retained while a subscription is active and for a reasonable period afterward; and technical logs may be retained for security, diagnostics, and operational purposes. Actual retention periods should be set according to the systems and vendors in use.
                  </p>
                </section>

                {/* 11. Security Measures */}
                <section id="security-measures" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    11. Security Measures
                  </h2>
                  <p className="mb-3">
                    We may use administrative, technical, and organizational measures designed to protect information against unauthorized access, loss, misuse, alteration, or disclosure. Measures may include access controls, service-provider safeguards, software updates, and security monitoring, depending on the systems used.
                  </p>
                  <p>
                    No method of transmission or electronic storage is completely secure. We cannot guarantee absolute security. If a security incident occurs, we will take steps required by applicable law and appropriate to the circumstances.
                  </p>
                </section>

                {/* 12. Privacy Rights and Choices */}
                <section id="privacy-rights" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    12. Privacy Rights and Choices
                  </h2>
                  <p className="mb-3">
                    Depending on your location and applicable law, you may have rights to request access to personal information, obtain a portable copy, correct inaccurate information, request deletion, object to or restrict certain processing, withdraw consent, or appeal a decision concerning a privacy request.
                  </p>
                  <p className="mb-3">
                    You may also have rights to opt out of certain sales, sharing, targeted advertising, profiling, or other processing where those concepts and rights apply under the law governing your request. The availability and scope of rights vary by jurisdiction and are subject to legal exceptions.
                  </p>
                  <p className="mb-3">
                    To make a request, email <a href="mailto:worldnews@timeschicago.com" className="font-bold text-[#00558c] hover:underline">worldnews@timeschicago.com</a> and describe the request and the website interaction involved. We may ask for information reasonably necessary to verify your identity and authority, and we will respond within the time required by applicable law. We will not unlawfully discriminate against you for exercising a privacy right.
                  </p>
                  <p>
                    If an authorized agent submits a request on your behalf, we may require proof of the agent&apos;s authority and, where permitted, verification directly with you.
                  </p>
                </section>

                {/* 13. Children and Minors */}
                <section id="children-minors" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    13. Children and Minors
                  </h2>
                  <p className="mb-3">
                    The Services are intended for a general audience and are not directed to children under 13. We do not knowingly seek to collect personal information from children under 13 through the Services. If you believe a child has submitted personal information, contact us at <a href="mailto:worldnews@timeschicago.com" className="font-bold text-[#00558c] hover:underline">worldnews@timeschicago.com</a> so we can review the situation and take appropriate action.
                  </p>
                  <p>
                    If a feature is designed for children or we learn that we have collected children&apos;s information in circumstances requiring parental consent or additional safeguards, we will address that collection in accordance with applicable law.
                  </p>
                </section>

                {/* 14. Third-Party Websites and Social Media */}
                <section id="third-party-websites" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    14. Third-Party Websites and Social Media
                  </h2>
                  <p>
                    The Services may link to third-party websites or display content hosted by third parties. Those websites and providers operate independently and have their own privacy policies, security practices, and terms. We are not responsible for their independent practices. Review their notices before providing information or interacting with their features.
                  </p>
                </section>

                {/* 15. International Data Transfers */}
                <section id="international-transfers" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    15. International Data Transfers
                  </h2>
                  <p className="mb-3">
                    Times Chicago is identified in this Policy as operating from the United States. Depending on your location and our service providers, information may be processed in the United States or other countries whose privacy laws may differ from those where you live.
                  </p>
                  <p>
                    Where applicable law requires safeguards for international transfers, we will use an appropriate transfer mechanism or other lawful basis. The safeguards actually used should be confirmed with the relevant service providers.
                  </p>
                </section>

                {/* 16. Do Not Track and Global Privacy Signals */}
                <section id="privacy-signals" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    16. Do Not Track and Global Privacy Signals
                  </h2>
                  <p>
                    Some browsers and devices offer privacy signals or settings intended to communicate a user&apos;s preferences. The legal effect of these signals varies by jurisdiction and over time. Where applicable law requires us to recognize a particular signal, we will do so as required. This Policy should be updated to describe the specific signals supported by the website and its consent-management tools.
                  </p>
                </section>

                {/* 17. Changes to This Privacy Policy */}
                <section id="changes-policy" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    17. Changes to This Privacy Policy
                  </h2>
                  <p>
                    We may update this Policy to reflect changes in our Services, data practices, service providers, or legal requirements. The &ldquo;Last Updated&rdquo; date at the beginning of the Policy indicates when it was most recently revised. Where required by law, we will provide additional notice or obtain consent before implementing material changes.
                  </p>
                </section>

                {/* 18. Contact and Privacy Requests */}
                <section id="contact-requests" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    18. Contact and Privacy Requests
                  </h2>
                  <p className="mb-3">
                    For privacy questions, requests, or concerns, contact:
                  </p>
                  <div className="bg-[#FAF8F5] p-5 border border-[#E5E0D3] space-y-1.5 text-xs sm:text-sm mb-3">
                    <p><strong className="font-bold text-[#111111]">Times Chicago LLC</strong></p>
                    <p>1246 J Clark St, Suite 1100</p>
                    <p>Chicago, IL 60603, United States</p>
                    <p><strong className="font-bold text-[#111111]">Email:</strong> <a href="mailto:worldnews@timeschicago.com" className="text-[#00558c] hover:underline">worldnews@timeschicago.com</a></p>
                    <p><strong className="font-bold text-[#111111]">Website:</strong> <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a></p>
                  </div>
                  <p className="text-xs text-[#666666] italic">
                    Please do not include passwords, payment-card details, government identification numbers, or other unnecessary sensitive information in an initial email.
                  </p>
                </section>

                {/* 19. Important Notice About This Policy */}
                <section id="important-notice" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    19. Important Notice About This Policy
                  </h2>
                  <p className="mb-3">
                    This document is a general privacy-policy template, not legal advice. It must be reviewed and customized to match the website&apos;s actual data collection, advertising, analytics, newsletter, hosting, and security practices. Publishing statements that do not match actual practices may mislead visitors or create legal risk.
                  </p>
                  <p>
                    Before publication, confirm the business details, list the actual service providers and technologies, establish retention periods, configure any legally required cookie consent and privacy-request processes, and obtain qualified legal review where appropriate.
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
