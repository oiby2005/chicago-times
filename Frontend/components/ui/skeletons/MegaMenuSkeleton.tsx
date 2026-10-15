import React from "react";

export default function MegaMenuSkeleton({ categoryName }: { categoryName?: string }) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 items-stretch animate-pulse ">
      {/* Column 1 (Left): Sub-Categories / SECTIONS Skeleton */}
      <div className="w-full md:w-[220px] shrink-0 self-stretch border-b md:border-b-0 md:border-r border-[#dcd6cd] pb-4 md:pb-0 pr-0 md:pr-6 space-y-3">
        <div className="h-3.5 w-20 bg-gray-300 rounded-sm mb-3" />
        <div className="space-y-2.5">
          <div className="h-4 w-28 bg-gray-200 rounded-sm" />
          <div className="h-4 w-36 bg-gray-200 rounded-sm" />
          <div className="h-4 w-24 bg-gray-200 rounded-sm" />
          <div className="h-4 w-32 bg-gray-200 rounded-sm" />
        </div>
      </div>

      {/* Column 2 & 3 (Right): MOST READ Articles Grid Skeleton */}
      <div className="flex-1 w-full pl-0 md:pl-2 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-3.5 w-36 bg-gray-300 rounded-sm" />
          {categoryName && (
            <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-gray-400">
              {categoryName}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3.5">
              {/* Thumbnail Image Skeleton */}
              <div className="w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] shrink-0 bg-gray-200 border border-[#dcd6cd]" />

              {/* Title & Summary Lines */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3.5 w-full bg-gray-300 rounded-xs" />
                <div className="h-2.5 w-4/5 bg-gray-200 rounded-xs" />
                <div className="h-2.5 w-3/5 bg-gray-200 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
