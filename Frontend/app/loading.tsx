import React from "react";
import Header from "@/components/navigation/Header";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export default function RootLoading() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        <Header />
        <Container className="py-8">
          <div className="space-y-6">
            <div className="h-8 w-64 bg-gray-300 rounded-xs" />
            <div className="w-full aspect-[16/9] bg-gray-200 rounded-sm" />
            <div className="space-y-3">
              <div className="h-5 w-full bg-gray-200 rounded-xs" />
              <div className="h-5 w-4/5 bg-gray-200 rounded-xs" />
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
