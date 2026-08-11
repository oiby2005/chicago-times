import React from "react";
import SpecialOfferHeader from "./SpecialOfferHeader";
import SpecialOfferFooter from "./SpecialOfferFooter";
import SpecialOfferAccordion from "./SpecialOfferAccordion";

export const SpecialOfferPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#eeeeee] flex flex-col justify-between font-sans text-black selection:bg-gray-200">
      {/* Dedicated Special Offer Header */}
      <SpecialOfferHeader />

      {/* Main Special Offer Content Container */}
      <main className="flex-1 w-full max-w-[960px] mx-auto px-4 py-8 sm:py-10">
        {/* Page Title & Subtitle */}
        <div className="text-center mb-8 sm:mb-10 select-none">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-[32px] font-normal text-[#111111] tracking-tight mb-2">
            Special Offer:{" "}
            <span className="line-through text-[#777777] font-normal mr-2">
              $9.99 USD
            </span>{" "}
            <span className="font-bold text-black">$3 USD Per Month</span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-[#333333] font-normal">
            Choose your WSJ Subscription
          </p>
        </div>

        {/* Subscription Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
          {/* CARD 1: WSJ Digital */}
          <div className="bg-white border border-[#e2e2e2] rounded-xs shadow-xs p-6 sm:p-8 flex flex-col justify-between text-center select-none">
            <div>
              {/* Card Title */}
              <h2 className="font-sans font-bold text-xl text-black mb-5">
                WSJ Digital
              </h2>

              {/* Logo Graphic */}
              <div className="h-12 flex items-center justify-center mb-6">
                <img
                  src="/images/wsj-masthead.svg"
                  alt="The Wall Street Journal"
                  className="h-5 sm:h-6 w-auto object-contain"
                />
              </div>

              {/* Strikethrough Price */}
              <div className="font-serif text-[#888888] line-through text-base sm:text-lg font-normal mb-1">
                $9.99 USD/Month
              </div>

              {/* Main Price Headline */}
              <div className="font-serif font-bold text-2xl sm:text-[26px] text-black tracking-tight mb-6">
                $3 USD/Month for 1 Year
              </div>

              {/* Subscribe CTA Button */}
              <button className="w-full max-w-[240px] mx-auto block bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold py-3 px-6 rounded-xs tracking-tight transition-colors shadow-xs">
                Subscribe Now
              </button>

              {/* Cancel Anytime Note */}
              <p className="text-[11.5px] text-[#666666] font-sans mt-2.5 mb-6">
                You can cancel anytime.
              </p>

              {/* Divider */}
              <div className="border-t border-[#e2e2e2] mx-4 mb-6" />

              {/* Features Heading */}
              <h3 className="font-sans font-bold text-xs text-black mb-4">
                What you&apos;ll enjoy:
              </h3>

              {/* Feature Bullets List */}
              <ul className="space-y-3 text-left pl-2 sm:pl-4 text-[12.5px] text-[#333333] font-sans">
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Unlimited access on WSJ.com and in the WSJ app</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Daily puzzles and crosswords</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Audio versions of WSJ articles</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CARD 2: WSJ Digital Bundle */}
          <div className="bg-white border border-[#e2e2e2] rounded-xs shadow-xs p-6 sm:p-8 flex flex-col justify-between text-center select-none">
            <div>
              {/* Card Title */}
              <h2 className="font-sans font-bold text-xl text-black mb-5">
                WSJ Digital Bundle
              </h2>

              {/* Stacked Logos Graphic */}
              <div className="h-12 flex flex-col items-center justify-center space-y-1 mb-6">
                <img
                  src="/images/wsj-masthead.svg"
                  alt="The Wall Street Journal"
                  className="h-4 sm:h-4.5 w-auto object-contain"
                />
                <span className="text-gray-400 font-sans text-[11px] leading-none">
                  +
                </span>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-serif font-black tracking-wider text-black text-[12px] uppercase">
                    BARRON&apos;S
                  </span>
                  <span className="font-sans font-black italic text-[#008a00] text-[12px]">
                    MarketWatch
                  </span>
                </div>
              </div>

              {/* Strikethrough Price */}
              <div className="font-serif text-[#888888] line-through text-base sm:text-lg font-normal mb-1">
                $11.99 USD/Month
              </div>

              {/* Main Price Headline */}
              <div className="font-serif font-bold text-2xl sm:text-[26px] text-black tracking-tight mb-6">
                $5 USD/Month for 1 Year
              </div>

              {/* Subscribe CTA Button */}
              <button className="w-full max-w-[240px] mx-auto block bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold py-3 px-6 rounded-xs tracking-tight transition-colors shadow-xs">
                Subscribe Now
              </button>

              {/* Cancel Anytime Note */}
              <p className="text-[11.5px] text-[#666666] font-sans mt-2.5 mb-6">
                You can cancel anytime.
              </p>

              {/* Divider */}
              <div className="border-t border-[#e2e2e2] mx-4 mb-6" />

              {/* Features Heading */}
              <h3 className="font-sans font-bold text-xs text-black mb-4">
                Includes a WSJ Digital Subscription:
              </h3>

              {/* Feature Bullets List 1 */}
              <ul className="space-y-3 text-left pl-2 sm:pl-4 text-[12.5px] text-[#333333] font-sans">
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Unlimited access on WSJ.com and in the WSJ app</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Daily puzzles and crosswords</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Audio versions of WSJ articles</span>
                </li>
              </ul>

              {/* Plus Sub-heading */}
              <div className="font-sans font-bold text-xs text-black my-4 text-center">
                Plus
              </div>

              {/* Feature Bullets List 2 */}
              <ul className="space-y-3 text-left pl-2 sm:pl-4 text-[12.5px] text-[#333333] font-sans">
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Unlimited access on Barrons.com and Marketwatch.com
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>The Barron&apos;s and MarketWatch apps</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Access to all three publications with a single account
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Live events with journalists from all three publications
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Personal finance advice, stock picks, and news, all in one
                    subscription
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="mb-6">
          <SpecialOfferAccordion />
        </div>

        {/* Disclaimer Text */}
        <div className="text-center text-[12px] text-[#555555] font-sans py-2 select-none">
          We&apos;ll let you know in advance of any price changes. Learn more
          about our{" "}
          <a
            href="#"
            className="text-[#007cba] font-semibold hover:underline"
          >
            cancellation
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-[#007cba] font-semibold hover:underline"
          >
            renewal policies
          </a>
          .
        </div>
      </main>

      {/* Dedicated Special Offer Footer */}
      <SpecialOfferFooter />
    </div>
  );
};

export default SpecialOfferPage;
