"use client";

import React from "react";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface Ad3SectionProps {
  className?: string;
}

export const Ad3Section: React.FC<Ad3SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans select-none py-1 my-1 flex justify-center ${className}`}>
      <AdPlaceholder slotId="hp_slot_3" width="w-full" height="h-[120px]" resolution="970 × 120" />
    </div>
  );
};

export default Ad3Section;
