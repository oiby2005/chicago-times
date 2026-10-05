import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans animate-pulse p-4 sm:p-8 space-y-6 select-none">
      {/* Top Bar / Header Skeleton */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-300 rounded-md" />
          <div className="h-3 w-32 bg-gray-200 rounded-sm" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-9 w-28 bg-gray-200 rounded-md" />
          <div className="h-9 w-9 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="flex space-x-4 border-b border-gray-100 pb-2 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((tab) => (
          <div key={tab} className="h-8 w-24 bg-gray-200 rounded-md shrink-0" />
        ))}
      </div>

      {/* Metric / Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="bg-[#f8fafc] p-5 rounded-xl border border-gray-200 space-y-3 shadow-2xs">
            <div className="h-4 w-28 bg-gray-200 rounded-sm" />
            <div className="h-8 w-20 bg-gray-300 rounded-sm" />
            <div className="h-3 w-36 bg-gray-200 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Main Table / List Container Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-gray-300 rounded-md" />
          <div className="h-8 w-32 bg-gray-200 rounded-md" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="h-12 w-full bg-gray-100 rounded-md flex items-center px-4 justify-between">
              <div className="h-4 w-1/3 bg-gray-200 rounded-sm" />
              <div className="h-4 w-1/6 bg-gray-200 rounded-sm" />
              <div className="h-6 w-20 bg-gray-300 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
