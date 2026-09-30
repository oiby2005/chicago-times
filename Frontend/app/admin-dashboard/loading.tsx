import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans animate-pulse p-4 sm:p-8 space-y-6">
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
        <div className="h-8 w-48 bg-slate-700 rounded-md" />
        <div className="flex items-center space-x-3">
          <div className="h-8 w-24 bg-slate-700 rounded-md" />
          <div className="h-8 w-8 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="bg-[#1e293b] p-5 rounded-xl border border-[#334155] space-y-3">
            <div className="h-4 w-28 bg-slate-700 rounded-sm" />
            <div className="h-8 w-16 bg-slate-600 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Main Table Skeleton */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6 space-y-4">
        <div className="h-6 w-36 bg-slate-700 rounded-md" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="h-12 w-full bg-slate-800/80 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
