import React from "react";

export default function ReaderAccountSkeleton() {
  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col font-sans select-none animate-pulse">
      {/* Top Mobile Bar Skeleton */}
      <div className="lg:hidden bg-white border-b border-[#E5E5E5] px-4 py-3 flex items-center justify-between">
        <div className="h-6 w-28 bg-gray-200 rounded" />
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Sidebar Skeleton */}
        <aside className="w-full lg:w-72 bg-white border-r border-[#E5E5E5] shrink-0 hidden lg:flex flex-col p-6 space-y-6">
          {/* Logo placeholder */}
          <div className="pt-2">
            <div className="h-9 w-40 bg-gray-200 rounded" />
          </div>

          {/* Back to Home link */}
          <div className="h-4 w-28 bg-gray-200 rounded" />

          <hr className="border-[#E5E5E5] my-2" />

          {/* Profile Photo & Name */}
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-md bg-gray-300" />
            <div className="h-6 w-36 bg-gray-300 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>

          <hr className="border-[#E5E5E5] my-2" />

          {/* Menu Items */}
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 w-full bg-gray-100 rounded-lg flex items-center px-4 space-x-3">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="h-3.5 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 p-4 sm:p-8 md:p-10 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-48 bg-gray-300 rounded" />
            </div>
            <div className="h-7 w-28 bg-gray-200 rounded-full" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-2xs space-y-3 pb-4">
                <div className="w-full h-36 bg-gray-200" />
                <div className="p-3.5 space-y-2.5">
                  <div className="flex space-x-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 w-full bg-gray-300 rounded" />
                  <div className="h-4 w-3/4 bg-gray-300 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded pt-1" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
