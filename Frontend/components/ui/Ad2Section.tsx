"use client";

import React from "react";

interface Ad2SectionProps {
  className?: string;
}

export const Ad2Section: React.FC<Ad2SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans select-none py-2 my-1 flex justify-center ${className}`}>
      <div className="w-full max-w-[800px] h-[110px] sm:h-[130px] bg-[#E8E3D7] flex items-center justify-center text-center p-4">
        <span className="font-sans font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
          Ad 02
        </span>
      </div>
    </div>
  );
};

export default Ad2Section;
