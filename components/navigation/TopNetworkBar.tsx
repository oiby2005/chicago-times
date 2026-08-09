import React from "react";
import Container from "@/components/layout/Container";

export const TopNetworkBar: React.FC = () => {
  const leftLinks = [
    { label: "WSJ", href: "#", active: true },
    { label: "Barron's", href: "#" },
    { label: "MarketWatch", href: "#" },
    { label: "IBD", href: "#" },
  ];

  return (
    <div className="w-full bg-[#191919] text-white font-sans border-b border-[#2a2a2a] select-none">
      <Container className="flex items-center justify-between h-6 sm:h-6.5 px-4">
        <div className="flex items-center space-x-5">
          {leftLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-[11.5px] sm:text-xs tracking-tight transition-colors hover:underline ${
                link.active
                  ? "font-medium text-white"
                  : "font-normal text-[#cccccc] hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center">
          <a
            href="#"
            className="text-[11.5px] sm:text-xs font-normal text-[#cccccc] hover:text-white hover:underline tracking-tight transition-colors"
          >
            WSJ | Buy Side
          </a>
        </div>
      </Container>
    </div>
  );
};

export default TopNetworkBar;
