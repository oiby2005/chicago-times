import React from "react";
import Header from "@/components/navigation/Header";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export default function CategorySkeleton() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        <Header />
        <Container className="py-8">
          {/* Category Banner Skeleton */}
          <div className="border-b border-gray-200 pb-4 mb-6 space-y-2">
            <div className="h-8 w-48 bg-gray-300 rounded-sm" />
            <div className="h-4 w-96 bg-gray-200 rounded-sm" />
          </div>

          {/* Grid Layout Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Stream (Span 8) */}
            <div className="lg:col-span-8 space-y-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100">
                  <div className="w-full sm:w-48 aspect-[16/10] bg-gray-200 rounded-md shrink-0" />
                  <div className="space-y-3 flex-1">
                    <div className="h-3 w-20 bg-gray-200 rounded-sm" />
                    <div className="h-6 w-full bg-gray-300 rounded-sm" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded-sm" />
                    <div className="h-3 w-32 bg-gray-200 rounded-sm pt-2" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-gray-200 p-4 rounded-sm space-y-4">
                <div className="h-5 w-32 bg-gray-300 rounded-sm" />
                {[1, 2, 3].map((sb) => (
                  <div key={sb} className="space-y-2 pb-3 border-b border-gray-100 last:border-0">
                    <div className="h-4 w-full bg-gray-300 rounded-sm" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
