"use client";

import React from "react";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export const ArticleSidebarAds: React.FC = () => {
  return (
    <div className="w-full space-y-6 my-8 select-none flex flex-col items-stretch">
      {/* Article Page Ad 01 (300x300) */}
      <AdPlaceholder
        slotId="article_slot_1"
        width="w-full max-w-full"
        height="h-[300px]"
        resolution="300 × 300"
        className="w-full my-0"
      />

      {/* Article Page Ad 02 (300x300) */}
      <AdPlaceholder
        slotId="article_slot_2"
        width="w-full max-w-full"
        height="h-[300px]"
        resolution="300 × 300"
        className="w-full my-0"
      />

      {/* Article Page Ad 03 (300x300) */}
      <AdPlaceholder
        slotId="article_slot_3"
        width="w-full max-w-full"
        height="h-[300px]"
        resolution="300 × 300"
        className="w-full my-0"
      />
    </div>
  );
};

export default ArticleSidebarAds;
