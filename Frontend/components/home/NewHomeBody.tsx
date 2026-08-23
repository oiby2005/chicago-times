"use client";

import React from "react";
import Container from "@/components/layout/Container";
import NewHomeSection1 from "@/components/home/NewHomeSection1";

export default function NewHomeBody() {
  return (
    <div className="bg-white min-h-[50vh] text-[#111111]">
      <Container className="pt-[1cm] pb-10">
        {/* New Homepage Content (Up to Business Category & Ad 1) */}
        <NewHomeSection1 />
      </Container>
    </div>
  );
}
