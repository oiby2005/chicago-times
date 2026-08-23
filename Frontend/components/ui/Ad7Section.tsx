"use client";

import React from "react";

interface Ad7SectionProps {
  className?: string;
}

export const Ad7Section: React.FC<Ad7SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans select-none my-0 ${className}`}>
      <div className="w-full aspect-square bg-[#E8E3D7] flex items-center justify-center text-center p-4">
        <span className="font-sans font-medium text-3xl sm:text-4xl text-[#111111] tracking-tight">
          Ad 07
        </span>
      </div>
    </div>
  );
};

export default Ad7Section;
