import React from "react";
import Header from "@/components/navigation/Header";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";

export default function AuthorLoading() {
  return (
    <main className="min-h-screen bg-white text-[#111111] font-sans flex flex-col justify-between select-none animate-pulse">
      <div>
        <Header />

        {/* Author Profile Skeleton Header */}
        <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0] py-10">
          <Container className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 shrink-0" />
            <div className="space-y-3 text-center sm:text-left w-full">
              <div className="h-7 w-48 bg-gray-300 rounded-sm mx-auto sm:mx-0" />
              <div className="h-4 w-32 bg-gray-200 rounded-sm mx-auto sm:mx-0" />
              <div className="h-4 w-full max-w-lg bg-gray-200 rounded-sm mx-auto sm:mx-0" />
            </div>
          </Container>
        </div>

        {/* Author Articles Skeleton List */}
        <Container className="py-10 max-w-4xl mx-auto space-y-6">
          <div className="h-6 w-40 bg-gray-300 rounded-sm" />
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-6 flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-full sm:w-44 h-28 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2.5 w-full">
                  <div className="h-3.5 w-20 bg-gray-200 rounded-sm" />
                  <div className="h-5 w-5/6 bg-gray-300 rounded-sm" />
                  <div className="h-4 w-full bg-gray-200 rounded-sm" />
                  <div className="h-3 w-28 bg-gray-200 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
