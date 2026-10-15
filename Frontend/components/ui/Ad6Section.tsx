"use client";

import React from "react";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

interface Ad6SectionProps {
  className?: string;
}

export const Ad6Section: React.FC<Ad6SectionProps> = ({ className = "" }) => {
  return (
    <div className={`w-full font-sans  py-1 my-1 ${className}`}>
      <AdPlaceholder slotId="hp_slot_6" width="w-full max-w-full" height="h-[180px]" resolution="970 × 180" className="w-full" />
    </div>
  );
};

export default Ad6Section;
