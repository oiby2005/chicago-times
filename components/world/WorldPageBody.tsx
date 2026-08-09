"use client";

import React from "react";
import Container from "@/components/layout/Container";
import WorldPart1Hero from "@/components/world/WorldPart1Hero";
import WorldPart2Section from "@/components/world/WorldPart2Section";

export default function WorldPageBody() {
  return (
    <div className="bg-white min-h-[50vh] text-[#111111]">
      <Container className="pt-2 pb-10">
        {/* Part 1: Hero / Top 3-Column Section */}
        <WorldPart1Hero />

        {/* Part 2: MORE NEWS list + Sidebar (Trending + Ad Banners) */}
        <WorldPart2Section />
      </Container>
    </div>
  );
}
