import React from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import NewHomeBody from "@/components/home/NewHomeBody";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header />
        <StickyHeaderBar />
        <NewHomeBody />
        <StickySubscribeBar />
      </div>
      <Footer />
    </main>
  );
}
