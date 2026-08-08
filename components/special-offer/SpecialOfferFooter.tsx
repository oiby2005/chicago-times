import React from "react";

export const SpecialOfferFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#e2e2e2] py-8 px-4 text-center select-none mt-12">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center space-y-2">
        {/* Powered by Dow Jones Logo */}
        <div className="flex items-center justify-center space-x-1.5 text-[11px] font-sans text-[#333333] uppercase tracking-wider font-bold">
          <div className="w-3.5 h-3.5 bg-[#007cba] text-white flex items-center justify-center font-bold text-[9px] rounded-xs leading-none">
            D
          </div>
          <span>
            POWERED BY <strong className="font-extrabold">DOW JONES</strong>
          </span>
        </div>

        {/* Links Row */}
        <div className="flex items-center justify-center space-x-2 text-[11.5px] text-[#666666] font-sans">
          <a href="#" className="hover:text-black hover:underline transition-colors">
            Customer Service
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="#" className="hover:text-black hover:underline transition-colors">
            Privacy Notice
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="#" className="hover:text-black hover:underline transition-colors">
            Cookie Notice
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-[#888888] font-sans pt-0.5">
          © 2026 Dow Jones & Company, Inc. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default SpecialOfferFooter;
