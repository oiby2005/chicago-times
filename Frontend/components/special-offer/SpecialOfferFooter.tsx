import React from "react";

export const SpecialOfferFooter: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#e2e2e2] py-8 px-4 text-center  mt-12">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center space-y-2">
        {/* Powered by Times Chicago */}
        <div className="flex items-center justify-center space-x-1.5 text-[11px] font-sans text-[#333333] uppercase tracking-wider font-bold">
          <span>
            POWERED BY <strong className="font-extrabold">TIMES CHICAGO</strong>
          </span>
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11.5px] text-[#666666] font-sans">
          <a href="/terms-and-conditions" className="hover:text-black hover:underline transition-colors">
            Terms &amp; Conditions
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/privacy-policy" className="hover:text-black hover:underline transition-colors">
            Privacy Policy
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/cookie-policy" className="hover:text-black hover:underline transition-colors">
            Cookie Policy
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/editorial-policy" className="hover:text-black hover:underline transition-colors">
            Editorial Policy
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/legal-policies" className="hover:text-black hover:underline transition-colors">
            Legal Policies
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/copyright-policy" className="hover:text-black hover:underline transition-colors">
            Copyright Policy
          </a>
          <span className="text-[#cccccc] font-light">|</span>
          <a href="/accessibility" className="hover:text-black hover:underline transition-colors">
            Accessibility
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-[#888888] font-sans pt-0.5">
          © 2026 Times Chicago LLC, All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default SpecialOfferFooter;
