import React from "react";
import Container from "@/components/layout/Container";

interface MarketItem {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const marketData: MarketItem[] = [
  { name: "Nikkei", value: "65649.73", change: "-0.05%", isPositive: false },
  { name: "Hang Seng", value: "25624.82", change: "0.37%", isPositive: true },
  { name: "Shanghai", value: "3931.93", change: "0.81%", isPositive: true },
  { name: "BSE Sensex", value: "78582.01", change: "-0.47%", isPositive: false },
  { name: "Singapore", value: "5694.53", change: "0.98%", isPositive: true },
  { name: "Kospi", value: "6247.07", change: "-0.78%", isPositive: false },
];

export const MarketTickerBar: React.FC = () => {
  return (
    <div className="bg-white border-b border-[#e2e2e2] text-xs font-sans py-1.5 select-none">
      <Container className="flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-6 text-[12px]">
          {/* Chevron Dropdown trigger */}
          <button className="text-gray-700 hover:text-black focus:outline-none flex items-center">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Ticker items */}
          <div className="flex items-center space-x-6 whitespace-nowrap">
            {marketData.map((item) => (
              <div key={item.name} className="flex items-center space-x-1.5">
                <span className="font-semibold text-black">{item.name}</span>
                <span className="font-semibold text-black">{item.value}</span>
                <span
                  className={`flex items-center text-[11px] font-medium ${
                    item.isPositive ? "text-[#008a00]" : "text-[#d00000]"
                  }`}
                >
                  {item.change}
                  <span className="ml-0.5 font-bold">
                    {item.isPositive ? "↑" : "↓"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center space-x-2 pl-4 text-gray-500">
          <button className="hover:text-black p-0.5">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="hover:text-black p-0.5">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </Container>
    </div>
  );
};

export default MarketTickerBar;
