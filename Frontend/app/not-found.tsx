"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none">
      <div>
        <Header />
        <Container className="py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="font-serif text-6xl font-bold text-black">404</h1>
            <h2 className="font-serif text-2xl font-semibold text-[#222222]">
              Page Not Found
            </h2>
            <p className="font-serif text-sm text-[#666666] leading-relaxed">
              We couldn't find the page you were looking for. It may have been moved, updated, or is temporarily unavailable.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/"
                className="bg-[#111111] text-white font-sans text-xs font-bold px-6 py-2.5 rounded-sm hover:bg-[#333333] transition-colors uppercase tracking-wider"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
