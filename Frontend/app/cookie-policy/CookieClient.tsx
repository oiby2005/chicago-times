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
  { id: "what-are-cookies", label: "1. What Are Cookies?" },
  { id: "why-we-use", label: "2. Why We May Use Cookies" },
  { id: "categories", label: "3. Categories of Cookies" },
  { id: "first-third-party", label: "4. First-Party and Third-Party Cookies" },
  { id: "duration", label: "5. Cookie Duration" },
  { id: "choices", label: "6. Your Cookie Choices" },
  { id: "browser-signals", label: "7. Browser and Privacy Signals" },
  { id: "used-shared", label: "8. How Cookie Information Is Used or Shared" },
  { id: "updates", label: "9. Updates to This Cookie Policy" },
  { id: "contact-us", label: "10. Contact Us" },
];

export default function CookieClient() {
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
                COOKIE POLICY
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
                        COOKIE POLICY SECTIONS
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
                    This Cookie Policy explains how Times Chicago LLC (&ldquo;Times Chicago,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) may use cookies and similar technologies when you visit <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a> (the &ldquo;Website&rdquo;). It should be read together with our Privacy Policy. This policy is a template and must be checked against the cookies, scripts, advertising tools, analytics services, and other technologies actually enabled on the Website.
                  </p>
                </section>

                {/* 1. What Are Cookies? */}
                <section id="what-are-cookies" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    1. What Are Cookies?
                  </h2>
                  <p className="mb-3">
                    Cookies are small text files that a website may store on your browser or device when you visit. They can help a website remember settings, support core functions, understand how visitors use the site, and provide or measure certain features.
                  </p>
                  <p>
                    Similar technologies may include pixels, tags, local storage, software development kits, and scripts that store or access information on a device. This Policy uses the term &ldquo;cookies&rdquo; to include these technologies where appropriate.
                  </p>
                </section>

                {/* 2. Why We May Use Cookies */}
                <section id="why-we-use" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    2. Why We May Use Cookies
                  </h2>
                  <p className="mb-3">
                    Depending on the features enabled on the Website, Times Chicago may use cookies or similar technologies to operate the Website, maintain security, remember preferences, measure traffic, understand reader engagement, improve performance, support embedded media, and measure advertising or promotional campaigns.
                  </p>
                  <p>
                    We will use these technologies only in ways that are permitted by applicable law and consistent with any consent or choice requirements that apply.
                  </p>
                </section>

                {/* 3. Categories of Cookies */}
                <section id="categories" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    3. Categories of Cookies
                  </h2>
                  <div className="space-y-3">
                    <p>
                      <strong className="font-bold text-[#111111]">Strictly Necessary Cookies:</strong> These may be needed for core website functions, security, network management, or features you request. If required for the Website to operate, they may not be available for disabling through a cookie preference tool, although browser settings may allow you to block them.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Preference or Functional Cookies:</strong> These may remember settings such as language, region, or display preferences to make future visits more convenient.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Analytics and Performance Cookies:</strong> If enabled, these may help us understand visitor numbers, page views, referral sources, navigation patterns, and Website performance. We may use this information to improve our content and services.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Advertising and Measurement Cookies:</strong> If enabled, these may help measure advertisements or campaigns, limit repeated ads, or understand whether an advertisement led to a visit or other action. Advertising providers may use information collected through their technologies under their own policies.
                    </p>
                    <p>
                      <strong className="font-bold text-[#111111]">Social Media and Embedded Content Technologies:</strong> Content such as videos, social media posts, or other embedded features may use technologies controlled by the relevant third party. Those providers may collect information according to their own policies.
                    </p>
                  </div>
                </section>

                {/* 4. First-Party and Third-Party Cookies */}
                <section id="first-third-party" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    4. First-Party and Third-Party Cookies
                  </h2>
                  <p className="mb-3">
                    First-party cookies are set by the Website or the domain you are visiting. Third-party cookies or similar technologies may be set or operated by external providers whose services appear on, support, or measure the Website.
                  </p>
                  <p>
                    The identity of third-party providers depends on the Website’s actual configuration. Before publishing this Policy, Times Chicago should list the specific analytics, advertising, video, social media, consent-management, and other providers currently in use, along with links to their privacy information where appropriate.
                  </p>
                </section>

                {/* 5. Cookie Duration */}
                <section id="duration" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    5. Cookie Duration
                  </h2>
                  <p className="mb-3">
                    Session cookies generally expire when you close your browser. Persistent cookies may remain on your device for a defined period or until you delete them. Actual duration varies according to the cookie’s purpose and the provider that sets it.
                  </p>
                  <p>
                    Times Chicago should maintain an accurate cookie inventory showing each cookie or technology, its provider, purpose, category, and retention period where that information is available.
                  </p>
                </section>

                {/* 6. Your Cookie Choices */}
                <section id="choices" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    6. Your Cookie Choices
                  </h2>
                  <p className="mb-3">
                    Where available, you may use the Website’s cookie banner or preference centre to accept, reject, or customize non-essential cookies. Your available choices may depend on your location and applicable law.
                  </p>
                  <p className="mb-3">
                    You can also manage or delete cookies through your browser settings. If you block all cookies, some Website features may not work as intended.
                  </p>
                  <p>
                    Where consent is legally required, non-essential cookies should not be activated before the required consent is obtained. You should be able to change or withdraw your choice using the cookie settings made available on the Website, where required by law.
                  </p>
                </section>

                {/* 7. Browser and Privacy Signals */}
                <section id="browser-signals" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    7. Browser and Privacy Signals
                  </h2>
                  <p className="mb-3">
                    Some browsers offer privacy settings or signals intended to communicate preferences about online tracking. The effect of these signals depends on applicable law and the technologies in use. Where the Website is legally required to recognize a specific signal, Times Chicago will handle it as required.
                  </p>
                  <p>
                    Before publication, confirm whether the Website’s consent-management system supports relevant privacy signals and describe that functionality accurately.
                  </p>
                </section>

                {/* 8. How Cookie Information May Be Used or Shared */}
                <section id="used-shared" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    8. How Cookie Information May Be Used or Shared
                  </h2>
                  <p className="mb-3">
                    Information collected through cookies may be processed by Times Chicago and by service providers that support Website hosting, security, analytics, advertising, embedded content, or other functions. Some third-party providers may collect information directly through their own tools.
                  </p>
                  <p>
                    We should not claim that cookie information is never shared, sold, or used for targeted advertising unless that statement has been verified against the Website’s actual practices and applicable law. Please review the Privacy Policy for additional information about collection, use, disclosure, and privacy rights.
                  </p>
                </section>

                {/* 9. Updates to This Cookie Policy */}
                <section id="updates" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    9. Updates to This Cookie Policy
                  </h2>
                  <p>
                    We may update this Cookie Policy when the Website’s technologies, services, or legal requirements change. The &ldquo;Last Updated&rdquo; date at the beginning of the Policy will be revised when appropriate. Where required by law, we will provide notice or seek consent for relevant changes.
                  </p>
                </section>

                {/* 10. Contact Us */}
                <section id="contact-us" className="scroll-mt-28 pt-4 border-t border-[#F0ECE1]">
                  <h2 className="font-serif font-bold text-[20px] text-[#111111] mb-3">
                    10. Contact Us
                  </h2>
                  <p className="mb-3">
                    If you have questions about this Cookie Policy or how cookies are used on the Website, contact:
                  </p>
                  <div className="bg-[#FAF8F5] p-5 border border-[#E5E0D3] space-y-1.5 text-xs sm:text-sm">
                    <p><strong className="font-bold text-[#111111]">Times Chicago LLC</strong></p>
                    <p>1246 J Clark St, Suite 1100</p>
                    <p>Chicago, IL 60603, United States</p>
                    <p><strong className="font-bold text-[#111111]">Email:</strong> <a href="mailto:worldnews@timeschicago.com" className="text-[#00558c] hover:underline">worldnews@timeschicago.com</a></p>
                    <p><strong className="font-bold text-[#111111]">Website:</strong> <a href="https://www.timeschicago.com/" className="text-[#00558c] hover:underline">https://www.timeschicago.com/</a></p>
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
