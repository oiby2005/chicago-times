"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface AdSlotConfig {
  id: string;
  slotName: string;
  dimension: string;
  placementGroup: "Homepage" | "Category" | "Author";
  description: string;
  active: boolean;
  actionType: string;
  targetUrl: string;
  selectedArticleSlug?: string;
  imageUrl: string;
}

interface AdPlaceholderProps {
  slotId?: string;
  width?: string;
  height?: string;
  resolution?: string; // e.g. "728 × 90", "300 × 250", "300 × 600", "970 × 250"
  className?: string;
}

const DEFAULT_SLOT_DIMENSIONS: Record<string, { width: string; height: string; resolution: string }> = {
  hp_slot_1: { width: "w-full max-w-[300px]", height: "h-[300px]", resolution: "300 × 300" },
  hp_slot_2: { width: "w-full max-w-[970px]", height: "h-[175px]", resolution: "970 × 175" },
  hp_slot_3: { width: "w-full max-w-[970px]", height: "h-[120px]", resolution: "970 × 120" },
  hp_slot_4: { width: "w-full max-w-[300px]", height: "h-[150px]", resolution: "300 × 150" },
  hp_slot_5: { width: "w-full max-w-[300px]", height: "h-[320px]", resolution: "300 × 320" },
  hp_slot_6: { width: "w-full max-w-[970px]", height: "h-[180px]", resolution: "970 × 180" },
  hp_slot_7: { width: "w-full max-w-[300px]", height: "h-[320px]", resolution: "300 × 320" },
  cat_slot_1: { width: "w-full max-w-[300px]", height: "h-[250px]", resolution: "300 × 250" },
  cat_slot_2: { width: "w-full max-w-[300px]", height: "h-[600px]", resolution: "300 × 600" },
  author_slot_1: { width: "w-full max-w-[300px]", height: "h-[250px]", resolution: "300 × 250" },
};

const SLOT_TITLE_MAP: Record<string, string> = {
  hp_slot_1: "Homepage ad 1",
  hp_slot_2: "Homepage ad 2",
  hp_slot_3: "Homepage ad 3",
  hp_slot_4: "Homepage ad 4",
  hp_slot_5: "Homepage ad 5",
  hp_slot_6: "Homepage ad 6",
  hp_slot_7: "Homepage ad 7",
  cat_slot_1: "Category Page ad 1",
  cat_slot_2: "Category Page ad 2",
  author_slot_1: "Writer Page ad 1",
};

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotId,
  width = "w-full",
  height = "h-[250px]",
  resolution = "300 × 250",
  className = "",
}) => {
  const [slot, setSlot] = useState<AdSlotConfig | null>(null);

  const loadSlotConfig = () => {
    if (!slotId || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("wsj_ad_slots_config");
      if (stored) {
        const parsed: AdSlotConfig[] = JSON.parse(stored);
        const match = parsed.find((s) => s.id === slotId);
        if (match) {
          setSlot(match);
          return;
        }
      }
    } catch (e) {}
    setSlot(null);
  };

  useEffect(() => {
    loadSlotConfig();

    const handleUpdate = () => {
      loadSlotConfig();
    };

    window.addEventListener("wsj_ads_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("wsj_ads_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [slotId]);

  // Derive effective height and resolution from slot.dimension or default slot mapping
  let effectiveHeight = height;
  let effectiveResolution = resolution;

  const slotDim = slot?.dimension || (slotId ? DEFAULT_SLOT_DIMENSIONS[slotId]?.resolution?.replace(" × ", "x") : null);

  if (slotDim && slotDim.includes("x")) {
    const [wStr, hStr] = slotDim.toLowerCase().split("x");
    const w = parseInt(wStr, 10);
    const h = parseInt(hStr, 10);
    if (w && h) {
      effectiveResolution = `${w} × ${h}`;
      if (slotId !== "hp_slot_1") {
        effectiveHeight = `h-[${h}px]`;
      }
    }
  } else if (slotId && DEFAULT_SLOT_DIMENSIONS[slotId]) {
    const defaultInfo = DEFAULT_SLOT_DIMENSIONS[slotId];
    if (slotId !== "hp_slot_1") {
      effectiveHeight = defaultInfo.height;
    }
    effectiveResolution = defaultInfo.resolution;
  }

  // Aspect ratio styling from slot dimension
  let aspectRatioStyle: React.CSSProperties = {};
  if (slotDim && slotDim.includes("x")) {
    const [wStr, hStr] = slotDim.toLowerCase().split("x");
    const w = parseInt(wStr, 10);
    const h = parseInt(hStr, 10);
    if (w && h && slotId !== "hp_slot_1") {
      aspectRatioStyle = { aspectRatio: `${w} / ${h}` };
    }
  }

  const slotTitle = slot?.slotName || (slotId ? SLOT_TITLE_MAP[slotId] : null);

  // If slot configuration is active and has an image URL:
  if (slot && slot.active && slot.imageUrl) {
    let targetLink = "";
    if (slot.actionType === "Internal Promoted Article" && slot.selectedArticleSlug) {
      targetLink = `/article/${slot.selectedArticleSlug}`;
    } else if (slot.actionType === "External Link (URL)" && slot.targetUrl) {
      targetLink = slot.targetUrl;
    }

    const ImageElement = (
      <div className={`flex flex-col w-full ${className.includes("my-") ? "" : "my-3"} ${className}`}>
        <div
          style={aspectRatioStyle}
          className={`${width} ${effectiveHeight} relative overflow-hidden rounded-xs border border-[#e2e2e2] shadow-2xs group flex-1 w-full flex flex-col`}
        >
          <img
            src={slot.imageUrl}
            alt={slot.slotName || "Advertisement"}
            className="w-full h-full flex-1 object-fill transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>
      </div>
    );

    if (targetLink) {
      if (targetLink.startsWith("/")) {
        return (
          <Link href={targetLink} target="_blank" rel="noopener noreferrer" className="w-full h-full flex-1 flex flex-col">
            {ImageElement}
          </Link>
        );
      }
      return (
        <a href={targetLink} target="_blank" rel="noopener noreferrer" className="w-full h-full flex-1 flex flex-col">
          {ImageElement}
        </a>
      );
    }

    return ImageElement;
  }

  return (
    <div className={`flex flex-col select-none w-full ${className.includes("my-") ? "" : "my-3"} ${className}`}>
      {/* Empty Banner Container with title and resolution size */}
      <div
        style={aspectRatioStyle}
        className={`${width} ${effectiveHeight} flex-1 bg-[#f5f5f5] border border-dashed border-[#cccccc] flex flex-col items-center justify-center text-center p-3 rounded-xs shadow-2xs transition-colors hover:bg-[#eaeaea] gap-1.5`}
      >
        {slotTitle && (
          <span className="text-[11px] font-sans font-extrabold text-[#0f172a] uppercase tracking-wider">
            {slotTitle}
          </span>
        )}
        <span className="text-xs font-mono font-bold text-[#444444] bg-white px-3.5 py-1 rounded-xs border border-[#d0d0d0] shadow-2xs">
          {effectiveResolution}
        </span>
      </div>
    </div>
  );
};

export default AdPlaceholder;
