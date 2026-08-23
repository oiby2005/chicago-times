import React from "react";
import Header from "@/components/navigation/Header";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        <Header />

        {/* Category Header Skeleton */}
        <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] py-6">
          <Container>
            <div className="h-8 w-48 bg-gray-300 rounded-xs mb-2" />
            <div className="h-4 w-72 bg-gray-200 rounded-xs" />
          </Container>
        </div>

        {/* Category Main Content Skeleton */}
        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Column Skeleton (Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="w-full aspect-[16/9] bg-gray-200 rounded-sm" />
              <div className="h-7 w-3/4 bg-gray-300 rounded-xs" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded-xs" />
                <div className="h-4 w-5/6 bg-gray-200 rounded-xs" />
              </div>

              <div className="divide-y divide-gray-200 pt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="py-4 flex gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-5/6 bg-gray-300 rounded-xs" />
                      <div className="h-4 w-full bg-gray-200 rounded-xs" />
                      <div className="h-3 w-32 bg-gray-200 rounded-xs" />
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-sm shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Skeleton (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-[#e2e8f0] p-4 space-y-4 rounded-sm">
                <div className="h-5 w-32 bg-gray-300 rounded-xs" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-xs w-full" />
                  <div className="h-4 bg-gray-200 rounded-xs w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-xs w-full" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
