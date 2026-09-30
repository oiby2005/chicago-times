import React from "react";

export default function AuthorWorkspaceLoading() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans animate-pulse p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="h-8 w-56 bg-gray-300 rounded-md" />
        <div className="h-9 w-32 bg-gray-200 rounded-md" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6 py-6">
        <div className="h-6 w-40 bg-gray-300 rounded-md" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5 space-y-3 bg-gray-50">
              <div className="h-5 w-3/4 bg-gray-300 rounded-sm" />
              <div className="h-4 w-full bg-gray-200 rounded-sm" />
              <div className="h-3 w-40 bg-gray-200 rounded-sm pt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
