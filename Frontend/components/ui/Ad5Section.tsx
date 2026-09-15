"use client";

import React from "react";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface Ad5SectionProps {
  className?: string;
}

export const Ad5Section: React.FC<Ad5SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans select-none py-0 my-0 ${className}`}>
      <AdPlaceholder slotId="hp_slot_5" width="w-full" height="h-[320px]" resolution="300 × 320" />
    </div>
  );
};

export default Ad5Section;
