import React from "react";
import Link from "next/link";

export const SpecialOfferHeader: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-[#e2e2e2] py-3.5 px-4 select-none relative">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="text-xs font-sans font-bold text-[#333333] hover:text-[#007cba] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        {/* Centered Logo */}
        <Link href="/" className="inline-block absolute left-1/2 -translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/design-reference/Times Chicago.svg"
            alt="Times Chicago"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </Link>

        {/* Spacer for Flex Balance */}
        <div className="w-24 hidden sm:block" aria-hidden="true" />
      </div>
    </header>
  );
};

export default SpecialOfferHeader;
