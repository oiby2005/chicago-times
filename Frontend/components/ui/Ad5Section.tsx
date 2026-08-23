"use client";

import React from "react";

interface Ad5SectionProps {
  className?: string;
}

export const Ad5Section: React.FC<Ad5SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans select-none py-0 my-0 ${className}`}>
      <div className="w-full aspect-[4/3] bg-[#E8E3D7] flex items-center justify-center text-center p-4">
        <span className="font-sans font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
          Ad 05
        </span>
      </div>
    </div>
  );
};

export default Ad5Section;
