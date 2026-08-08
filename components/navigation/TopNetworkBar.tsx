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
    <div className="w-full bg-[#191919] text-white text-[11px] font-sans border-b border-[#2a2a2a]">
      <Container className="flex items-center justify-between h-7 px-4">
        <div className="flex items-center space-x-4">
          {leftLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`hover:underline tracking-tight ${
                link.active ? "font-semibold text-white" : "text-[#cccccc]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center">
          <a
            href="#"
            className="text-[#cccccc] hover:underline tracking-tight text-[11px]"
          >
            WSJ | Buy Side
          </a>
        </div>
      </Container>
    </div>
  );
};

export default TopNetworkBar;
