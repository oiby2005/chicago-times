"use client";

import React from "react";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface Ad2SectionProps {
  className?: string;
}

export const Ad2Section: React.FC<Ad2SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans  py-1 my-1 ${className}`}>
      <AdPlaceholder slotId="hp_slot_2" width="w-full max-w-full" height="h-[175px]" resolution="970 × 175" className="w-full" />
    </div>
  );
};

export default Ad2Section;
