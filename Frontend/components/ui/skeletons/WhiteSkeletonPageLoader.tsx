import React from "react";

export default function WhiteSkeletonPageLoader() {
  return (
    <div className="fixed inset-0 z-[999999] bg-white text-[#111111] font-sans flex flex-col justify-between select-none pointer-events-none overflow-hidden animate-pulse">
      <div>
        {/* Header Skeleton Bar */}
        <header className="w-full bg-white border-b border-[#E5E5E5] py-3.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="h-6 w-36 bg-gray-200 rounded-sm" />
            <div className="h-8 w-64 bg-gray-200 rounded-sm hidden md:block" />
            <div className="flex items-center space-x-3">
              <div className="h-7 w-16 bg-gray-200 rounded-sm" />
              <div className="h-7 w-20 bg-gray-300 rounded-sm" />
            </div>
          </div>
        </header>

        {/* Sub-header Navigation Skeleton Bar */}
        <div className="w-full bg-[#F9F9F9] border-b border-[#E5E5E5] py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center space-x-6 overflow-hidden">
            <div className="h-3 w-16 bg-gray-200 rounded-xs shrink-0" />
            <div className="h-3 w-20 bg-gray-200 rounded-xs shrink-0" />
            <div className="h-3 w-14 bg-gray-200 rounded-xs shrink-0" />
            <div className="h-3 w-24 bg-gray-200 rounded-xs shrink-0" />
            <div className="h-3 w-18 bg-gray-200 rounded-xs shrink-0" />
            <div className="h-3 w-20 bg-gray-200 rounded-xs shrink-0" />
          </div>
        </div>

        {/* Main Skeleton Layout Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left/Main Column Skeleton (Span 8) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Category Badge */}
              <div className="h-3 w-24 bg-gray-200 rounded-xs" />

              {/* Headline */}
              <div className="space-y-2.5">
                <div className="h-7 sm:h-9 bg-gray-300 rounded-xs w-full" />
                <div className="h-7 sm:h-9 bg-gray-300 rounded-xs w-3/4" />
              </div>

              {/* Featured Image Skeleton */}
              <div className="w-full aspect-[16/9] bg-gray-200 rounded-sm" />

              {/* Content Paragraph Skeletons */}
              <div className="space-y-3 pt-2">
                <div className="h-3.5 bg-gray-200 rounded-xs w-full" />
                <div className="h-3.5 bg-gray-200 rounded-xs w-11/12" />
                <div className="h-3.5 bg-gray-200 rounded-xs w-4/5" />
              </div>
            </div>

            {/* Sidebar Skeleton (Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-4 border border-[#E5E5E5] rounded-sm space-y-3.5">
                <div className="h-4 w-32 bg-gray-300 rounded-xs" />
                <div className="space-y-2.5 pt-1">
                  <div className="h-3.5 bg-gray-200 rounded-xs w-full" />
                  <div className="h-3.5 bg-gray-200 rounded-xs w-5/6" />
                  <div className="h-3.5 bg-gray-200 rounded-xs w-full" />
                </div>
              </div>

              <div className="p-4 border border-[#E5E5E5] rounded-sm space-y-3.5">
                <div className="h-4 w-28 bg-gray-300 rounded-xs" />
                <div className="w-full h-28 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
