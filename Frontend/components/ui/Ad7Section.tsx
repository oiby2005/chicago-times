"use client";

import React from "react";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface Ad7SectionProps {
  className?: string;
}

export const Ad7Section: React.FC<Ad7SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans select-none my-0 ${className}`}>
      <AdPlaceholder slotId="hp_slot_7" width="w-full" height="h-[320px]" resolution="300 × 320" />
    </div>
  );
};

export default Ad7Section;
