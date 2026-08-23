"use client";

import React from "react";

interface Ad1SectionProps {
  className?: string;
}

export const Ad1Section: React.FC<Ad1SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full flex items-center justify-center select-none ${className}`}>
      <div className="w-full min-h-[250px] sm:min-h-[280px] bg-[#E8E3D7] border border-[#D6CEBF] flex items-center justify-center text-center p-6 shadow-2xs">
        <span className="font-serif font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
          Ad 1
        </span>
      </div>
    </div>
  );
};

export default Ad1Section;
