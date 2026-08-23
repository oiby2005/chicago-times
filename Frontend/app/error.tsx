"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between">
      <div>
        <Header />
        <Container className="py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="font-serif text-5xl font-bold text-black">Something went wrong</h1>
            <p className="font-serif text-sm text-[#666666] leading-relaxed">
              An unexpected error occurred. Please try refreshing or return home.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => reset()}
                className="bg-[#111111] text-white font-sans text-xs font-bold px-6 py-2.5 rounded-xs hover:bg-[#333333] transition-colors uppercase tracking-wider cursor-pointer"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="bg-white border border-[#111111] text-[#111111] font-sans text-xs font-bold px-6 py-2.5 rounded-xs hover:bg-gray-50 transition-colors uppercase tracking-wider"
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
