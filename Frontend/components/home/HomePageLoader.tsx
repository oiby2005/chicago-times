"use client";

import React, { useState, useEffect } from "react";

export default function HomePageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center transition-opacity duration-300 select-none">
          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            {/* Times Chicago Publication Brand */}
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#111111] tracking-tight uppercase">
              Times Chicago
            </h1>
            <div className="w-12 h-0.5 bg-[#111111]/20" />

            {/* Spinner */}
            <div className="w-8 h-8 border-2 border-slate-200 border-t-[#111111] rounded-full animate-spin my-2" />

            {/* Loading text */}
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Loading Homepage...
            </p>
          </div>
        </div>
      )}

      <div className={loading ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"}>
        {children}
      </div>
    </>
  );
}
