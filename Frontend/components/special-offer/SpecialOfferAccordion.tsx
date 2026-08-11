"use client";

import React, { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const SpecialOfferAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const items: AccordionItem[] = [
    {
      id: "options",
      title: "More Subscription Options",
      content: (
        <div className="space-y-3 text-xs text-[#555555] font-sans leading-relaxed">
          <p>
            Looking for print delivery or corporate access? We offer tailored subscription plans including WSJ Print Edition delivery, WSJ Classic, Corporate & Academic group access, and Student memberships.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#444444]">
            <li>WSJ Print + Digital Bundle — Daily home delivery plus unlimited digital access.</li>
            <li>Student & Educator Discounts — Special rates available with valid educational credentials.</li>
            <li>Corporate & Enterprise Licensing — Scalable access for teams and organizations.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-3.5 text-xs text-[#555555] font-sans leading-relaxed">
          <div>
            <h4 className="font-bold text-[#222222] mb-1">When will my subscription renew?</h4>
            <p>
              Your subscription automatically renews at the standard monthly rate after your initial 1-year introductory offer period ends unless cancelled.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#222222] mb-1">Can I cancel my subscription anytime?</h4>
            <p>
              Yes, you can cancel your subscription at any time online through your Account Settings or by contacting Customer Service.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#222222] mb-1">What is included in the WSJ Digital Bundle?</h4>
            <p>
              The WSJ Digital Bundle grants full, unlimited access to WSJ.com, Barrons.com, and Marketwatch.com, along with their mobile apps and exclusive subscriber events.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      content: (
        <div className="space-y-2.5 text-[11.5px] text-[#666666] font-sans leading-normal">
          <p>
            Offer valid for new subscribers only. Offer cannot be combined with any other offer or promotion. Subscription will automatically renew monthly after the introductory rate period ends at the then-prevailing standard rate.
          </p>
          <p>
            Sales tax may apply. Subscriptions are non-refundable and subject to the Dow Jones Subscriber Agreement and Terms of Use.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white border border-[#e2e2e2] rounded-xs shadow-xs overflow-hidden select-none">
      {items.map((item, idx) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className={`border-b border-[#e2e2e2] last:border-b-0 ${
              isOpen ? "bg-[#fafafa]" : "bg-white"
            }`}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-4 px-6 text-left focus:outline-none hover:bg-[#f9f9f9] transition-colors"
            >
              <span className="font-sans font-bold text-[13.5px] text-[#222222]">
                {item.title}
              </span>
              <svg
                className={`w-4 h-4 text-[#555555] transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="px-6 pb-5 pt-1 border-t border-[#f0f0f0]">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SpecialOfferAccordion;
