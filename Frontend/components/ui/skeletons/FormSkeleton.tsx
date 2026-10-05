import React from "react";

export default function FormSkeleton() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans animate-pulse p-4 sm:p-8 space-y-6 select-none max-w-4xl mx-auto">
      {/* Form Header Skeleton */}
      <div className="border-b border-gray-200 pb-4 space-y-2">
        <div className="h-8 w-64 bg-gray-300 rounded-md" />
        <div className="h-4 w-96 bg-gray-200 rounded-sm" />
      </div>

      {/* Form Inputs Skeleton */}
      <div className="space-y-6 bg-[#f8fafc] border border-gray-200 p-6 rounded-xl shadow-2xs">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-300 rounded-sm" />
          <div className="h-10 w-full bg-gray-200 rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 rounded-sm" />
            <div className="h-10 w-full bg-gray-200 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 rounded-sm" />
            <div className="h-10 w-full bg-gray-200 rounded-md" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded-sm" />
          <div className="h-32 w-full bg-gray-200 rounded-md" />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <div className="h-10 w-24 bg-gray-200 rounded-md" />
          <div className="h-10 w-32 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
}
