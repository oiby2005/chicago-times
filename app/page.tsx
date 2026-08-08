import React from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import HomeMainGrid from "@/components/home/HomeMainGrid";
import HomeSecondarySections from "@/components/home/HomeSecondarySections";
import HomeBottomGrid from "@/components/home/HomeBottomGrid";
import HomeCategoryGrid from "@/components/home/HomeCategoryGrid";
import HomeRealEstateInsights from "@/components/home/HomeRealEstateInsights";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header />
        <StickyHeaderBar />
        <HomeMainGrid />
        <HomeSecondarySections />
        <HomeBottomGrid />
        <HomeCategoryGrid />
        <HomeRealEstateInsights />
        <StickySubscribeBar />
      </div>
      <Footer />
    </main>
  );
}
