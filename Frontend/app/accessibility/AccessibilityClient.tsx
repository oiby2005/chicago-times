"use client";

import React from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";

export default function AccessibilityClient() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#111111] select-none">
      <div>
        <Header />
        <StickyHeaderBar />

        <main className="bg-white py-8 sm:py-12 border-b border-[#EAE6DA]">
          <Container>
            {/* Document Header Title Bar */}
            <div className="text-center max-w-4xl mx-auto mb-10">
              <h1 className="font-serif font-black text-[32px] sm:text-[44px] leading-tight text-[#111111] tracking-tight">
                Times Chicago Accessibility Statement
              </h1>
            </div>

            {/* Document Body Card */}
            <div className="max-w-4xl mx-auto bg-white border border-[#E2DDD0] p-6 sm:p-10 shadow-xs space-y-6 font-sans text-[14px] leading-relaxed text-[#333333]">
              <p>
                Times Chicago is committed to serving a wide and diverse audience and is dedicated to making our products accessible and user-friendly for all. We welcome your feedback and encourage you to contact us if you have experienced any difficulty viewing, listening to or navigating content on any of our platforms. We&apos;d also like to hear if you have identified any content or functionality that you believe is not accessible to people with disabilities.
              </p>

              <p>
                We invite you to send any questions, feedback or suggestions for improvement to our Accessibility team at{" "}
                <a
                  href="mailto:Accessibility@timeschicago.com"
                  className="font-bold text-[#00558C] hover:underline"
                >
                  Accessibility@timeschicago.com
                </a>
                .
              </p>

              <p>
                Please be advised that while we may not be able to respond to every email, we will acknowledge receipt of your message and promise its review by our Accessibility team.
              </p>

              <p>
                We take your feedback very seriously and will apply it to our ongoing efforts to improve the accessibility experience for all of our valued customers.
              </p>
            </div>
          </Container>
        </main>
      </div>

      <StickySubscribeBar />
      <Footer />
    </div>
  );
}
