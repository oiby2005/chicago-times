"use client";

import React, { useState, useEffect, useRef } from "react";

export interface MarketTickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number; // percentage change, e.g. 1.20 or -0.45
  isPositive: boolean;
  prefix?: string;
  decimals?: number;
  flash?: "up" | "down" | null;
}

const INITIAL_MARKETS: MarketTickerItem[] = [
  { symbol: "Nikkei", name: "Nikkei 225", price: 66109.69, change: 1.20, isPositive: true, decimals: 2 },
  { symbol: "Hang Seng", name: "Hang Seng Index", price: 25793.20, change: 1.17, isPositive: true, decimals: 2 },
  { symbol: "Shanghai", name: "Shanghai Composite", price: 3892.77, change: -0.04, isPositive: false, decimals: 2 },
  { symbol: "S&P 500", name: "S&P 500 Index", price: 5751.20, change: 0.45, isPositive: true, decimals: 2 },
  { symbol: "NASDAQ", name: "Nasdaq Composite", price: 18119.50, change: 0.82, isPositive: true, decimals: 2 },
  { symbol: "BSE Sensex", name: "BSE Sensex", price: 77401.14, change: 0.64, isPositive: true, decimals: 2 },
  { symbol: "Gold", name: "Gold Spot", price: 2654.10, change: 0.12, isPositive: true, prefix: "$", decimals: 2 },
  { symbol: "Crude Oil", name: "WTI Crude Oil", price: 91.15, change: 0.04, isPositive: true, prefix: "$", decimals: 2 },
  { symbol: "Bitcoin", name: "Bitcoin / USD", price: 85494.55, change: 0.09, isPositive: true, prefix: "$", decimals: 2 },
  { symbol: "Ethereum", name: "Ethereum / USD", price: 2782.24, change: -0.98, isPositive: false, prefix: "$", decimals: 2 },
];

export const TopNetworkBar: React.FC = () => {
  const [markets, setMarkets] = useState<MarketTickerItem[]>(INITIAL_MARKETS);
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Live Fetch Real Crypto Prices (Bitcoin & Ethereum) from CoinGecko API
  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
        );
        if (res.ok) {
          const data = await res.json();
          setMarkets((prev) =>
            prev.map((item) => {
              if (item.symbol === "Bitcoin" && data.bitcoin) {
                const newPrice = data.bitcoin.usd;
                const newChange = data.bitcoin.usd_24h_change || item.change;
                return {
                  ...item,
                  price: newPrice,
                  change: parseFloat(newChange.toFixed(2)),
                  isPositive: newChange >= 0,
                  flash: newPrice > item.price ? "up" : newPrice < item.price ? "down" : null,
                };
              }
              if (item.symbol === "Ethereum" && data.ethereum) {
                const newPrice = data.ethereum.usd;
                const newChange = data.ethereum.usd_24h_change || item.change;
                return {
                  ...item,
                  price: newPrice,
                  change: parseFloat(newChange.toFixed(2)),
                  isPositive: newChange >= 0,
                  flash: newPrice > item.price ? "up" : newPrice < item.price ? "down" : null,
                };
              }
              return item;
            })
          );
        }
      } catch (err) {
        // Fallback silently if offline/rate-limited
      }
    };

    fetchLivePrices();
    const fetchInterval = setInterval(fetchLivePrices, 15000);
    return () => clearInterval(fetchInterval);
  }, []);

  // 2. Real-time Live Ticker Tick Engine (Simulates real market trading ticks every 3 seconds)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setMarkets((prevMarkets) => {
        const randomIndex1 = Math.floor(Math.random() * prevMarkets.length);
        const randomIndex2 = Math.floor(Math.random() * prevMarkets.length);

        return prevMarkets.map((item, idx) => {
          if (idx === randomIndex1 || idx === randomIndex2) {
            const deltaPercent = (Math.random() - 0.49) * 0.16;
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
    }, 3000);

    return () => clearInterval(tickInterval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white text-[#111111] font-sans border-b border-[#EAE6DA] select-none py-1 relative z-40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-5 md:px-6 flex items-center justify-between text-[11px] font-sans tracking-normal">
        {/* Leftmost Dropdown Caret & Ticker Items List */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 overflow-hidden whitespace-nowrap flex-1 justify-start relative">
          {/* Caret & Live Indicator */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Market overview"
              className="flex items-center space-x-1.5 pr-2 border-r border-[#e5e5e5] cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
              suppressHydrationWarning
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
              </span>
              <span className="font-semibold text-[10px] uppercase text-[#059669] tracking-wider hidden sm:inline-block">
                LIVE
              </span>
            </button>

            {/* Dropdown Full Market Overview Card */}
            {showDropdown && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-[#e2e8f0] shadow-2xl rounded-none p-4 z-50 text-left animate-in zoom-in-95 duration-100 font-sans">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f5f9] mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                    <span className="font-serif font-bold text-sm text-[#0f172a]">Financial Markets Overview</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">REAL-TIME</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-1">
                  {markets.map((m) => (
                    <div key={m.symbol} className="flex items-center justify-between p-2 rounded-none hover:bg-slate-50 transition-colors border border-[#f8fafc]">
                      <div>
                        <div className="font-bold text-xs text-[#1e293b]">{m.symbol}</div>
                        <div className="text-[10px] text-gray-500">{m.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-[#0f172a]">
                          {m.prefix || ""}{m.price.toLocaleString(undefined, { minimumFractionDigits: m.decimals || 2 })}
                        </div>
                        <div className={`text-[10.5px] font-bold ${m.isPositive ? "text-[#047857]" : "text-[#dc2626]"}`}>
                          {m.isPositive ? "+" : ""}{m.change.toFixed(2)}% {m.isPositive ? "↑" : "↓"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticker Scroll Area */}
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-4 sm:space-x-5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap flex-1 py-0.5"
          >
            {markets.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center space-x-1 text-[11px] font-sans px-1.5 py-0.5"
              >
                <span className="font-bold text-[#111111]">{item.symbol}</span>
                <span className={item.isPositive ? "font-bold text-[#047857]" : "font-bold text-[#dc2626]"}>
                  {item.prefix || ""}{item.price.toLocaleString(undefined, { minimumFractionDigits: item.decimals || 2 })}
                </span>
                <span className={item.isPositive ? "text-[#10b981]" : "text-[#ef4444]"}>
                  {item.isPositive ? "+" : ""}{item.change.toFixed(2)}%
                </span>
                <span className={item.isPositive ? "text-[#10b981] font-bold text-[10px]" : "text-[#ef4444] font-bold text-[10px]"}>
                  {item.isPositive ? "↑" : "↓"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chevron Controls */}
        <div className="flex items-center space-x-1 pl-2 text-[#777777] font-sans text-[13px] shrink-0">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous market ticker"
            className="hover:text-black cursor-pointer leading-none text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors"
            suppressHydrationWarning
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next market ticker"
            className="hover:text-black cursor-pointer font-bold leading-none text-black hover:bg-gray-100 p-1 pr-0 rounded transition-colors"
            suppressHydrationWarning
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNetworkBar;
