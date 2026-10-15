"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HELP_CATEGORIES, HelpTopicItem, HelpCategory } from "@/data/helpCenterFaqs";

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const trimmed = query ? query.trim() : "";
  if (!trimmed) return <>{text}</>;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, idx) =>
        regex.test(part) ? (
          <mark
            key={idx}
            className="bg-amber-200 text-slate-900 font-semibold px-0.5 rounded-xs"
          >
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}

export default function ReaderHelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("general-information");
  const [selectedTopic, setSelectedTopic] = useState<HelpTopicItem | null>(null);
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const toggleCategory = (catId: string) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId));
  };

  const handleOpenTopic = (item: HelpTopicItem) => {
    setSelectedTopic(item);
  };

  const isSearching = searchQuery.trim().length > 0;
  const filteredCategories = HELP_CATEGORIES.map((cat) => {
    if (!isSearching) return cat;
    const lower = searchQuery.toLowerCase().trim();
    const catMatches = cat.title.toLowerCase().includes(lower);
    const matchedItems = cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        (Array.isArray(item.answer) ? item.answer.some((p: string) => p.toLowerCase().includes(lower)) : String(item.answer).toLowerCase().includes(lower)) ||
        catMatches
    );
    return {
      ...cat,
      items: catMatches ? cat.items : matchedItems,
    };
  }).filter((cat) => {
    if (!isSearching) return true;
    const lower = searchQuery.toLowerCase().trim();
    return cat.title.toLowerCase().includes(lower) || cat.items.length > 0;
  });

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setShowQuickContact(false);
      setContactSubject("");
      setContactMessage("");
    }, 2200);
  };

  return (
    <div className="w-full font-sans  pb-12">
      {/* ================================================================= */}
      {/* HERO BANNER SECTION (Matching Image 1 Reference)                  */}
      {/* ================================================================= */}
      <div className="w-full bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-10 md:p-12 mb-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left Decorative Illustration (Editorial Writer at Desk) */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-52 pointer-events-none  opacity-90">
            <svg viewBox="0 0 200 160" className="w-full h-auto">
              {/* Desk */}
              <rect x="20" y="125" width="160" height="8" rx="4" fill="#0f172a" />
              <rect x="40" y="133" width="8" height="25" fill="#334155" />
              <rect x="152" y="133" width="8" height="25" fill="#334155" />
              {/* Laptop */}
              <rect x="55" y="105" width="40" height="20" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
              <line x1="50" y1="125" x2="100" y2="125" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              {/* Document with 'T' */}
              <rect x="110" y="60" width="55" height="65" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <path d="M 145 60 L 165 80 L 145 80 Z" fill="#475569" />
              <text x="125" y="98" fill="#1e293b" fontSize="24" fontWeight="bold" fontFamily="serif">T</text>
              <line x1="120" y1="108" x2="155" y2="108" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              <line x1="120" y1="114" x2="148" y2="114" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              {/* Lamp / Lightbulb idea */}
              <circle cx="137" cy="40" r="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
              <line x1="137" y1="22" x2="137" y2="26" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              <line x1="125" y1="27" x2="128" y2="30" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              <line x1="149" y1="27" x2="146" y2="30" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              {/* Person seated */}
              <circle cx="75" cy="78" r="12" fill="#e2e8f0" />
              <path d="M 68 72 Q 75 64 82 72 Q 85 82 75 80 Z" fill="#0f172a" />
              <path d="M 60 95 C 60 90, 70 88, 75 88 C 80 88, 90 90, 90 95 L 90 125 L 60 125 Z" fill="#334155" />
            </svg>
          </div>

          {/* Center Main Text matching Image 1 */}
          <div className="flex-1 text-center">
            <h1 className="font-poppins font-black text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#0f172a] leading-[1.18] tracking-tight mb-2">
              All Your Reading Needs, <br className="hidden sm:inline" />
              <span className="text-slate-600">One Trusted Platform</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm md:text-[14.5px] text-[#64748b] max-w-xl mx-auto leading-relaxed mt-3">
              Investigative reports, world news, market analyses, writer guidelines, and reader support — expert answers, on time, every time.
            </p>

            {/* Live Search Bar for Help Topics */}
            <div className="mt-6 max-w-lg mx-auto relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help topics, FAQs, guides..."
                className="w-full bg-white border border-[#cbd5e1] rounded-full py-3 pl-11 pr-4 text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-slate-600 shadow-2xs transition-all"
              />
              <svg
                className="w-4 h-4 text-[#94a3b8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Decorative Illustration (Review Checklist & Ratings) */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-52 pointer-events-none  opacity-90">
            <svg viewBox="0 0 200 160" className="w-full h-auto">
              {/* Paper Plane */}
              <path d="M 150 20 L 175 45 L 140 40 L 150 20 Z" fill="#475569" />
              <path d="M 140 40 L 160 38" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
              {/* Clipboard with Checklist */}
              <rect x="75" y="45" width="85" height="105" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="100" y="38" width="35" height="12" rx="2" fill="#0f172a" />
              {/* Checklist lines with checkmarks */}
              <rect x="85" y="60" width="10" height="10" rx="1" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 87 65 L 90 68 L 94 62" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="102" y1="65" x2="148" y2="65" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              <rect x="85" y="80" width="10" height="10" rx="1" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 87 85 L 90 88 L 94 82" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="102" y1="85" x2="148" y2="85" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              <rect x="85" y="100" width="10" height="10" rx="1" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 87 105 L 90 108 L 94 102" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="102" y1="105" x2="148" y2="105" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              <rect x="85" y="120" width="10" height="10" rx="1" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 87 125 L 90 128 L 94 122" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="102" y1="120" x2="140" y2="120" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              {/* 5 Stars Rating pill */}
              <rect x="25" y="35" width="65" height="22" rx="11" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
              <text x="32" y="50" fill="#334155" fontSize="12" fontWeight="bold">★★★★★</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 16 HELP CENTER ACCORDION CATEGORIES (Images 2 - 17)                */}
      {/* ================================================================= */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredCategories.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-10 text-center">
            <p className="text-sm font-bold text-slate-700">No help topics match "{searchQuery}"</p>
            <p className="text-xs text-slate-500 mt-1">Try another keyword or browse the full categories below.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 px-4 py-1.5 text-xs font-bold text-white bg-slate-800 rounded-md hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isExpanded = isSearching || expandedCategory === category.id;

            return (
              <div
                key={category.id}
                className={`transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? "bg-white border-2 border-slate-700 rounded-2xl shadow-sm"
                    : "bg-white border border-[#e2e8f0] rounded-2xl hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Accordion Header Row matching reference design */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer transition-colors"
                >
                  <span
                    className={`font-poppins font-bold text-sm sm:text-base tracking-tight transition-colors ${
                      isExpanded ? "text-slate-900" : "text-[#0f172a]"
                    }`}
                  >
                    <HighlightMatch text={category.title} query={searchQuery} />
                  </span>

                  {/* Circular Toggle Button matching reference images */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isExpanded
                        ? "bg-slate-800 text-white"
                        : "bg-[#f1f5f9] text-[#64748b] hover:bg-slate-200"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Accordion Body matching Images 2-17 */}
                {isExpanded && (
                  <div className="border-t border-[#f1f5f9] px-5 sm:px-6 py-4 space-y-3.5 bg-white">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenTopic(item)}
                        className="flex items-center space-x-3 text-xs sm:text-[13.5px] text-slate-700 hover:text-slate-950 transition-colors cursor-pointer group py-1"
                      >
                        {/* Open Book Icon matching screenshot symbol (📖) */}
                        <svg
                          className="w-4 h-4 text-slate-500 group-hover:text-slate-900 shrink-0 group-hover:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>

                        <span className="font-poppins font-medium group-hover:underline leading-relaxed">
                          <HighlightMatch text={item.title} query={searchQuery} />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================================================================= */}
      {/* BOTTOM CONTACT INFORMATION SECTION (Matching Image 1 Reference)   */}
      {/* ================================================================= */}
      <div className="mt-12 bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 md:p-9 shadow-2xs">
        <h3 className="text-xl sm:text-2xl font-bold text-[#23496d] font-serif mb-3 tracking-tight">
          Contact Information
        </h3>
        <div className="space-y-1.5 text-sm sm:text-[15px] text-[#222222] font-sans leading-relaxed">
          <p className="font-semibold text-[#111111]">Times Chicago LLC</p>
          <p>
            <span className="text-[#333333]">Website: </span>
            <a
              href="https://www.timeschicago.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00558c] hover:underline"
            >
              https://www.timeschicago.com/
            </a>
          </p>
          <p>
            <span className="text-[#333333]">Email: </span>
            <a
              href="mailto:worldnews@timeschicago.com"
              className="text-[#00558c] hover:underline"
            >
              worldnews@timeschicago.com
            </a>
          </p>
          <p>
            <span className="text-[#333333]">Address: </span>
            <span>1246 J Clark St, Suite 1100, Chicago, IL 60603, United States</span>
          </p>
        </div>
      </div>
      {/* TOPIC DETAIL MODAL                                                */}
      {/* ================================================================= */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                {selectedTopic.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h3 className="font-poppins font-bold text-xl sm:text-2xl text-slate-900 mt-4 leading-snug">
              {selectedTopic.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed space-y-3">
              {Array.isArray(selectedTopic.answer) ? (
                selectedTopic.answer.map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>{selectedTopic.answer}</p>
              )}
            </div>

            {selectedTopic.steps && selectedTopic.steps.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  Step-by-step instructions:
                </h4>
                <ol className="space-y-2 text-xs sm:text-[13px] text-slate-600 list-decimal list-inside leading-relaxed">
                  {selectedTopic.steps.map((st, i) => (
                    <li key={i} className="pl-1">
                      <span className="font-medium text-slate-800">{st}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {selectedTopic.tips && selectedTopic.tips.length > 0 && (
              <div className="mt-4 p-3.5 bg-slate-100/80 border border-slate-200 rounded-xl">
                <h4 className="text-[11.5px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span>💡</span> Helpful Tip
                </h4>
                <ul className="text-xs text-slate-700 space-y-1">
                  {selectedTopic.tips.map((tp, idx) => (
                    <li key={idx}>• {tp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/contact-us"
                onClick={() => setSelectedTopic(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center"
              >
                Still have questions? Ask Support
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* QUICK CONTACT SUPPORT MODAL                                       */}
      {/* ================================================================= */}
      {showQuickContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.861-.861 5.973 5.973 0 011.057-2.035C4.03 16.556 3 14.416 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Times Chicago Reader Support
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickContact(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {contactSent ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h4 className="font-bold text-base text-slate-900">Message Delivered!</h4>
                <p className="text-xs text-slate-500">Our reader assistance team will reply to your account email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Question about subscription / article access"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Question / Message</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe what you need assistance with..."
                    required
                    className="w-full border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-slate-700 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">Live chat hours: 8:00 AM – 8:00 PM ET</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowQuickContact(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!contactMessage.trim()}
                      className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-50 rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
