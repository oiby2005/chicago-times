"use client";

import React, { useState } from "react";

interface SpecialOfferPopoverProps {
  children?: React.ReactNode;
}

export const SpecialOfferPopover: React.FC<SpecialOfferPopoverProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children ? (
        children
      ) : (
        <button className="bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold px-3.5 py-1 rounded-sm tracking-tight transition-colors whitespace-nowrap">
          Special Offer
        </button>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute top-full right-0 pt-2 z-50 animate-in fade-in duration-150">
          <div className="w-[320px] bg-white border border-[#e2e2e2] shadow-xl rounded-sm p-6 text-center select-none">
            {/* WSJ Logo Header */}
            <div className="mb-3">
              <img
                src="/images/wsj-masthead.svg"
                alt="The Wall Street Journal"
                className="h-5 sm:h-6 w-auto mx-auto object-contain"
              />
            </div>

            {/* Price Headline */}
            <h3 className="font-serif font-bold text-[26px] text-black tracking-tight leading-none mb-2">
              $3 USD/Month
            </h3>

            {/* Special Offer Tag */}
            <p className="font-sans font-medium text-[14.5px] text-[#333333] mb-1">
              Special Offer
            </p>

            {/* Subtitle / Description */}
            <p className="font-sans font-normal text-[13.5px] text-[#555555] mb-6">
              Global News and Business Insights
            </p>

            {/* Subscribe Action Button */}
            <a
              href="/special-offer"
              className="w-full max-w-[210px] mx-auto block bg-[#007cba] hover:bg-[#006996] text-white font-sans text-[13px] font-bold py-2.5 px-4 rounded-xs tracking-tight transition-colors text-center"
            >
              Subscribe Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialOfferPopover;
