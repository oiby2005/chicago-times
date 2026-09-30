import React from "react";

export const SpecialOfferFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#e2e2e2] py-8 px-4 text-center select-none mt-12">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center space-y-2">
        {/* Powered by Times Chicago */}
        <div className="flex items-center justify-center space-x-1.5 text-[11px] font-sans text-[#333333] uppercase tracking-wider font-bold">
          <span>
            POWERED BY <strong className="font-extrabold">TIMES CHICAGO</strong>
          </span>
        </div>

        {/* Links Row */}
        <div className="flex items-center justify-center space-x-2 text-[11.5px] text-[#666666] font-sans">
          <a href="/terms-and-conditions" className="hover:text-black hover:underline transition-colors">
            Terms &amp; Conditions
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/privacy-policy" className="hover:text-black hover:underline transition-colors">
            Privacy Notice
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/cookie-policy" className="hover:text-black hover:underline transition-colors">
            Cookie Notice
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-[#888888] font-sans pt-0.5">
          © 2026 Times Chicago Media LLC, All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default SpecialOfferFooter;
