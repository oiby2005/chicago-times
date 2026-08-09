"use client";

import React from "react";
import Container from "@/components/layout/Container";
import NewHomeSection1 from "@/components/home/NewHomeSection1";
import NewHomeSection2 from "@/components/home/NewHomeSection2";
import NewHomeSection3 from "@/components/home/NewHomeSection3";
import NewHomeSection4 from "@/components/home/NewHomeSection4";

export default function NewHomeBody() {
  return (
    <div className="bg-white min-h-[50vh] text-[#111111]">
      <Container className="pt-2 pb-10">
        {/* Section 1 of New Homepage */}
        <NewHomeSection1 />

        {/* Section 2 of New Homepage */}
        <NewHomeSection2 />

        {/* Section 3 of New Homepage */}
        <NewHomeSection3 />

        {/* Section 4 of New Homepage */}
        <NewHomeSection4 />
      </Container>
    </div>
  );
}
