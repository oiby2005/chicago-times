"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";

interface PolicyItem {
  title: string;
  href: string;
}

const POLICY_ITEMS: PolicyItem[] = [
  {
    title: "Terms and Conditions",
    href: "/terms-and-conditions",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    title: "Cookie Policy",
    href: "/cookie-policy",
  },
  {
    title: "Copyright Policy",
    href: "/copyright-policy",
  },
  {
    title: "Editorial Policy",
    href: "/editorial-policy",
  },
  {
    title: "Accessibility",
    href: "/accessibility",
  },
];

export default function LegalPoliciesClient() {
  return (
    <div className="min-h-screen bg-[#FCFBF7] flex flex-col justify-between text-[#111111] select-none">
      <div>
        <Header />
        <StickyHeaderBar />

        <main className="py-10 sm:py-16 border-b border-[#EAE6DA]">
          <Container>
            <div className="w-full text-left">
              {/* Heading matching Image 2 */}
              <h1 className="font-serif font-black text-[32px] sm:text-[40px] leading-tight text-[#111111] tracking-tight pb-3">
                Legal &amp; Info
              </h1>

              {/* Horizontal line divider directly below title */}
              <div className="border-b border-[#D7D2D2] w-full mb-0" />

              {/* Stacked list matching Image 2 */}
              <ul className="divide-y divide-[#EAE6DA] w-full">
                {POLICY_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group block py-3.5 sm:py-4 transition-colors text-left"
                    >
                      <span className="font-serif text-[17px] sm:text-[18px] text-[#00558c] group-hover:underline group-hover:text-[#003d66] font-medium inline-block text-left">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </main>
      </div>

      <Footer />
      <StickySubscribeBar />
    </div>
  );
}
