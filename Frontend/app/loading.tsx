import React from "react";

export default function RootLoading() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        {/* Top Network Bar Skeleton */}
        <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] py-2 px-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="h-3.5 w-40 bg-gray-200 rounded-sm" />
            <div className="flex items-center space-x-4">
              <div className="h-3.5 w-24 bg-gray-200 rounded-sm" />
              <div className="h-3.5 w-16 bg-gray-200 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Masthead Logo Header Skeleton */}
        <div className="py-6 border-b border-[#e2e8f0] bg-white">
          <div className="max-w-[1400px] mx-auto px-4 flex flex-col items-center justify-center space-y-3">
            <div className="h-3 w-32 bg-gray-200 rounded-sm" />
            <div className="h-10 sm:h-14 w-72 sm:w-96 bg-gray-300 rounded-sm" />
            <div className="h-3 w-48 bg-gray-200 rounded-sm" />
          </div>
        </div>

        {/* Navbar Categories Bar Skeleton */}
        <div className="border-b border-black bg-white py-2 px-4 shadow-2xs">
          <div className="max-w-[1400px] mx-auto flex items-center justify-center space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div key={idx} className="h-4 w-16 sm:w-20 bg-gray-200 rounded-sm shrink-0" />
            ))}
          </div>
        </div>

        {/* Main News Canvas Grid Skeleton */}
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column - Main Hero Article (Span 7) */}
            <div className="lg:col-span-7 space-y-5 pr-0 lg:pr-4 lg:border-r border-gray-200">
              <div className="h-4 w-24 bg-gray-300 rounded-sm" />
              <div className="h-8 sm:h-11 w-full bg-gray-300 rounded-sm" />
              <div className="h-8 sm:h-11 w-4/5 bg-gray-300 rounded-sm" />
              <div className="w-full aspect-[16/9] bg-gray-200 rounded-lg" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-gray-200 rounded-sm" />
                <div className="h-4 w-11/12 bg-gray-200 rounded-sm" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-sm" />
              </div>
            </div>

            {/* Middle Column - Secondary Articles (Span 3) */}
            <div className="lg:col-span-3 space-y-6 lg:border-r border-gray-200 lg:pr-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-full aspect-[4/3] bg-gray-200 rounded-md" />
                  <div className="h-3 w-16 bg-gray-200 rounded-sm" />
                  <div className="h-5 w-full bg-gray-300 rounded-sm" />
                  <div className="h-5 w-4/5 bg-gray-300 rounded-sm" />
                  <div className="h-3 w-28 bg-gray-200 rounded-sm" />
                </div>
              ))}
            </div>

            {/* Right Column - Opinion & Quick Read (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-5 w-32 bg-gray-300 rounded-sm mb-4" />
              {[1, 2, 3, 4].map((op) => (
                <div key={op} className="space-y-2 pb-4 border-b border-gray-100 last:border-0">
                  <div className="h-3 w-20 bg-gray-200 rounded-sm" />
                  <div className="h-4 w-full bg-gray-300 rounded-sm" />
                  <div className="h-4 w-3/4 bg-gray-300 rounded-sm" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="w-full bg-[#111111] text-white py-10 mt-16">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col items-center space-y-4">
          <div className="h-8 w-48 bg-gray-800 rounded-sm" />
          <div className="h-3 w-72 bg-gray-800 rounded-sm" />
        </div>
      </div>
    </main>
  );
}
