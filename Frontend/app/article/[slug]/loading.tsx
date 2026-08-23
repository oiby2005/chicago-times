import React from "react";
import Header from "@/components/navigation/Header";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export default function ArticleLoading() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        <Header />

        <div className="article-body">
          {/* Top Bar Skeleton */}
          <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] py-2 px-4">
            <Container className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded-xs" />
              <div className="flex items-center space-x-3">
                <div className="h-5 w-16 bg-gray-200 rounded-xs" />
                <div className="h-5 w-6 bg-gray-200 rounded-xs" />
                <div className="h-5 w-6 bg-gray-200 rounded-xs" />
              </div>
            </Container>
          </div>

          {/* Article Main Layout Skeleton */}
          <Container className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Main Article Body (Span 8) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Category Badge Skeleton */}
                <div className="h-4 w-20 bg-gray-200 rounded-xs" />

                {/* Headline Skeleton */}
                <div className="space-y-3">
                  <div className="h-9 sm:h-11 bg-gray-300 rounded-xs w-full" />
                  <div className="h-9 sm:h-11 bg-gray-300 rounded-xs w-4/5" />
                </div>

                {/* Deck / Subheadline Skeleton */}
                <div className="space-y-2 pt-2">
                  <div className="h-5 bg-gray-200 rounded-xs w-full" />
                  <div className="h-5 bg-gray-200 rounded-xs w-11/12" />
                </div>

                {/* Author Byline & Date Skeleton */}
                <div className="pt-3 pb-4 border-b border-[#e5e7eb] flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full bg-gray-300 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-gray-300 rounded-xs" />
                    <div className="h-3 w-44 bg-gray-200 rounded-xs" />
                  </div>
                </div>

                {/* Hero Image Skeleton */}
                <div className="w-full aspect-[16/10] bg-gray-200 rounded-lg" />

                {/* Article Body Paragraph Skeletons */}
                <div className="space-y-4 pt-4">
                  <div className="h-4 bg-gray-200 rounded-xs w-full" />
                  <div className="h-4 bg-gray-200 rounded-xs w-full" />
                  <div className="h-4 bg-gray-200 rounded-xs w-5/6" />
                  <div className="h-4 bg-gray-200 rounded-xs w-full" />
                  <div className="h-4 bg-gray-200 rounded-xs w-4/5" />
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
      </div>
      <Footer />
    </main>
  );
}
