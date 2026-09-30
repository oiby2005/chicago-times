import React from "react";
import Header from "@/components/navigation/Header";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export default function NewslettersLoading() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        <Header />

        {/* Hero Skeleton Header */}
        <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] py-12">
          <Container className="max-w-3xl mx-auto text-center space-y-4">
            <div className="h-8 sm:h-12 w-3/4 mx-auto bg-gray-300 rounded-sm" />
            <div className="h-5 w-5/6 mx-auto bg-gray-200 rounded-sm" />
          </Container>
        </div>

        {/* Newsletter Categories Skeleton Cards */}
        <Container className="py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div key={card} className="border border-[#e2e8f0] rounded-xl p-6 space-y-4 bg-white shadow-2xs">
                <div className="w-full h-40 bg-gray-200 rounded-lg" />
                <div className="h-6 w-3/4 bg-gray-300 rounded-sm" />
                <div className="h-4 w-full bg-gray-200 rounded-sm" />
                <div className="h-4 w-5/6 bg-gray-200 rounded-sm" />
                <div className="h-10 w-full bg-gray-200 rounded-lg pt-2" />
              </div>
            ))}
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
