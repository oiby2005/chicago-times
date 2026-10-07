"use client";

import React, { useState, useEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import { MarketTickerItem } from "./TopNetworkBar";

const INITIAL_MARKETS: MarketTickerItem[] = [
  { symbol: "Nikkei", name: "Nikkei 225", price: 65649.73, change: -0.05, isPositive: false, decimals: 2 },
  { symbol: "Hang Seng", name: "Hang Seng Index", price: 25624.82, change: 0.37, isPositive: true, decimals: 2 },
  { symbol: "Shanghai", name: "Shanghai Composite", price: 3931.93, change: 0.81, isPositive: true, decimals: 2 },
  { symbol: "BSE Sensex", name: "BSE Sensex", price: 78582.01, change: -0.47, isPositive: false, decimals: 2 },
  { symbol: "Singapore", name: "Singapore STI", price: 5694.53, change: 0.98, isPositive: true, decimals: 2 },
  { symbol: "Kospi", name: "Kospi Index", price: 6247.07, change: -0.78, isPositive: false, decimals: 2 },
];

export const MarketTickerBar: React.FC = () => {
  const [markets, setMarkets] = useState<MarketTickerItem[]>(INITIAL_MARKETS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setMarkets((prevMarkets) => {
        const randomIndex = Math.floor(Math.random() * prevMarkets.length);
        return prevMarkets.map((item, idx) => {
          if (idx === randomIndex) {
            const deltaPercent = (Math.random() - 0.49) * 0.14;
            const priceChange = item.price * (deltaPercent / 100);
            const updatedPrice = parseFloat((item.price + priceChange).toFixed(item.decimals || 2));
            const updatedChange = parseFloat((item.change + deltaPercent / 10).toFixed(2));
            const isUp = updatedPrice >= item.price;

            return {
              ...item,
              price: updatedPrice,
              change: updatedChange,
              isPositive: updatedChange >= 0,
              flash: isUp ? "up" : "down",
            };
          }
          return { ...item, flash: null };
        });
      });
    }, 3500);

    return () => clearInterval(tickInterval);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border-b border-[#e2e2e2] text-xs font-sans py-1.5 select-none">
      <Container className="flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-6 text-[12px] flex-1">
          {/* Chevron Dropdown trigger */}
          <button className="text-gray-700 hover:text-black focus:outline-none flex items-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping mr-1"></span>
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
          <div ref={scrollRef} className="flex items-center space-x-6 whitespace-nowrap overflow-x-auto no-scrollbar scroll-smooth">
            {markets.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center space-x-1.5 text-[11px] font-sans px-1 py-0.5"
              >
                <span className="font-semibold text-black">{item.symbol}</span>
                <span className="font-semibold text-black">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: item.decimals || 2 })}
                </span>
                <span
                  className={`flex items-center text-[11px] font-medium ${
                    item.isPositive ? "text-[#008a00]" : "text-[#d00000]"
                  }`}
                >
                  {item.isPositive ? "+" : ""}{item.change.toFixed(2)}%
                  <span className="ml-0.5 font-bold">
                    {item.isPositive ? "↑" : "↓"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center space-x-2 pl-4 text-gray-500 shrink-0">
          <button onClick={() => handleScroll("left")} className="hover:text-black p-0.5">
            ‹
          </button>
          <button onClick={() => handleScroll("right")} className="hover:text-black p-0.5 font-bold">
            ›
          </button>
        </div>
      </Container>
    </div>
  );
};

export default MarketTickerBar;
