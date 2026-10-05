"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SpecialOfferPopoverProps {
  children?: React.ReactNode;
}

export const SpecialOfferPopover: React.FC<SpecialOfferPopoverProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block z-[999]"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="cursor-pointer inline-block w-full"
      >
        {children ? (
          children
        ) : (
          <button className="bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold px-3.5 py-1 rounded-sm tracking-tight transition-colors whitespace-nowrap">
            Special Offer
          </button>
        )}
      </div>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute top-full right-0 sm:right-0 pt-2 z-[9999] animate-in fade-in duration-150">
          <div className="w-[280px] sm:w-[320px] bg-white border border-[#e2e2e2] shadow-2xl rounded-xl p-5 text-center select-none relative font-sans">
            {/* Close button for touch / mobile */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-black text-xs p-1 cursor-pointer"
              aria-label="Close card"
            >
              ✕
            </button>

            {/* Price Headline */}
            <h3 className="font-serif font-bold text-[24px] sm:text-[26px] text-black tracking-tight leading-none mb-1.5 pt-1">
              $3 USD/Month
            </h3>

            {/* Special Offer Tag */}
            <p className="font-sans font-medium text-[13.5px] text-[#333333] mb-1">
              Special Offer
            </p>

            {/* Subtitle / Description */}
            <p className="font-sans font-normal text-[12.5px] text-[#555555] mb-5">
              Global News and Business Insights
            </p>

            {/* Subscribe Action Button */}
            <Link
              href="/special-offer"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-[210px] mx-auto block bg-[#007cba] hover:bg-[#006996] text-white font-sans text-[13px] font-bold py-2.5 px-4 rounded-xs tracking-tight transition-colors text-center"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialOfferPopover;
