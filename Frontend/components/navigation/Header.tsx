import React from "react";
import TopNetworkBar from "./TopNetworkBar";
import LogoHeader from "./LogoHeader";
import Navbar from "./Navbar";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#FAF7EE] flex flex-col border-b border-[#EAE6DA] relative z-50">
      <TopNetworkBar />
      <LogoHeader />
      <Navbar />
    </header>
  );
};

export default Header;
