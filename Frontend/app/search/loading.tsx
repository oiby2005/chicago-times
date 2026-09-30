import React from "react";
import Header from "@/components/navigation/Header";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        <Header />

        {/* Search Bar Skeleton Header */}
        <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] py-8">
          <Container className="max-w-4xl mx-auto space-y-4">
            <div className="h-6 w-48 bg-gray-300 rounded-sm" />
            <div className="h-12 w-full bg-gray-200 rounded-lg" />
          </Container>
        </div>

        {/* Search Results Skeleton Grid */}
        <Container className="py-10 max-w-5xl mx-auto space-y-8">
          <div className="h-5 w-36 bg-gray-200 rounded-sm" />

          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="py-6 flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-4 w-24 bg-gray-200 rounded-sm" />
                  <div className="h-6 w-5/6 bg-gray-300 rounded-sm" />
                  <div className="h-4 w-full bg-gray-200 rounded-sm" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded-sm" />
                  <div className="h-3 w-32 bg-gray-200 rounded-sm pt-1" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
