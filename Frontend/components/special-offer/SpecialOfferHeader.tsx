import React from "react";

export const SpecialOfferHeader: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-[#e2e2e2] py-3.5 px-4 select-none">
      <div className="max-w-[1200px] mx-auto flex items-center justify-center">
        <a href="/" className="inline-block">
          <img
            src="/images/wsj-masthead.svg"
            alt="The Wall Street Journal"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </a>
      </div>
    </header>
  );
};

export default SpecialOfferHeader;
