import React from "react";
import TopNetworkBar from "./TopNetworkBar";
import LogoHeader from "./LogoHeader";
import Navbar from "./Navbar";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white flex flex-col">
      <TopNetworkBar />
      <LogoHeader />
      <Navbar />
    </header>
  );
};

export default Header;
