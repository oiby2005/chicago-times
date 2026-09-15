"use client";

import React from "react";
import AdPlaceholder from "@/components/ui/AdPlaceholder";

export default function LouisVuittonAdBanner() {
  return (
    <div className="w-full mt-4 select-none">
      <AdPlaceholder slotId="author_slot_1" width="w-full" height="h-[250px]" resolution="300 × 250" />
    </div>
  );
}
