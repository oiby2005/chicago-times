import React from "react";

export const TopNetworkBar: React.FC = () => {
  const tickerItems = [
    { symbol: "Nikkei", price: "66109.69", change: "1.20%", isPositive: true },
    { symbol: "Hang Seng", price: "25793.20", change: "1.17%", isPositive: true },
    { symbol: "Shanghai", price: "3892.77", change: "-0.04%", isPositive: false },
    { symbol: "BSE Sensex", price: "77401.14", change: "0.64%", isPositive: true },
    { symbol: "Singapore", price: "5673.31", change: "-0.37%", isPositive: false },
    { symbol: "Kospi", price: "6814.56", change: "5.31%", isPositive: true },
    { symbol: "Kospi", price: "6814.56", change: "5.31%", isPositive: true },
  ];

  return (
    <div className="w-full bg-white text-[#111111] font-sans border-b border-[#EAE6DA] select-none py-1">
      <div className="max-w-[1280px] mx-auto px-2 flex items-center justify-between text-[11px] font-sans tracking-normal">
        {/* Leftmost Dropdown Caret & Ticker Items List */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 overflow-x-auto no-scrollbar whitespace-nowrap flex-1 justify-start">
          {/* Left Dropdown Caret */}
          <div className="flex items-center pr-1 cursor-pointer">
            <svg className="w-3 h-3 text-[#222222]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-1 text-[11px] font-sans">
              <span className="font-bold text-[#111111]">{item.symbol}</span>
              <span className={item.isPositive ? "font-bold text-[#047857]" : "font-bold text-[#dc2626]"}>
                {item.price}
              </span>
              <span className={item.isPositive ? "text-[#10b981]" : "text-[#ef4444]"}>
                {item.change}
              </span>
              <span className={item.isPositive ? "text-[#10b981] font-bold text-[10px]" : "text-[#ef4444] font-bold text-[10px]"}>
                {item.isPositive ? "↑" : "↓"}
              </span>
            </div>
          ))}
        </div>

        {/* Right Chevron Controls ending at exact right margin */}
        <div className="flex items-center space-x-1.5 pl-2 text-[#777777] font-sans text-[12px] shrink-0">
          <button aria-label="Previous market ticker" className="hover:text-black cursor-pointer leading-none text-gray-400">
            ‹
          </button>
          <button aria-label="Next market ticker" className="hover:text-black cursor-pointer font-bold leading-none text-black">
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNetworkBar;

