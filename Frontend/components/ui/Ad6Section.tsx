"use client";

import React from "react";

interface Ad6SectionProps {
  className?: string;
}

export const Ad6Section: React.FC<Ad6SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans select-none py-2 my-2 flex justify-center ${className}`}>
      <div className="w-full max-w-[800px] h-[110px] sm:h-[130px] bg-[#E6DFC6] bg-[#E8E3D7] flex items-center justify-center text-center p-4">
        <span className="font-sans font-medium text-2xl sm:text-3xl text-[#111111] tracking-tight">
          Ad 06
        </span>
      </div>
    </div>
  );
};

export default Ad6Section;
