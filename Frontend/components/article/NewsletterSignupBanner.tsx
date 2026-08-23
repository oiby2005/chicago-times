"use client";

import React, { useState } from "react";

export default function NewsletterSignupBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="w-full border-y border-[#e5e7eb] py-6 my-8 clear-both flow-root">
      {/* Title / Heading */}
      <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#b8860b] leading-tight">
        Wall Street Journal Fast Start — Let the best of news come to you
      </h3>

      {/* Subtitle */}
      <p className="font-sans text-sm text-[#444444] mt-1.5 mb-4">
        Sign up and stay up to date with our daily newsletter.
      </p>

      {/* Form or Success State */}
      {subscribed ? (
        <div className="bg-[#fefce8] border border-[#fef08a] text-[#854d0e] px-4 py-3 rounded-xs text-sm font-semibold">
          Thank you for subscribing to Wall Street Journal Fast Start!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email."
            required
            className="flex-1 border border-[#d1d5db] px-3.5 py-2.5 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#b8860b] rounded-xs bg-white min-w-0"
          />
          <button
            type="submit"
            className="bg-[#b8860b] hover:bg-[#a07409] text-white font-sans font-bold text-xs tracking-wider uppercase px-7 py-3 rounded-xs transition-colors shrink-0 select-none"
          >
            SIGN UP NOW
          </button>
        </form>
      )}

      {/* Disclaimer / Footer Terms */}
      <p className="font-sans text-[11px] text-[#666666] mt-3 leading-normal">
        You can unsubscribe at any time. By signing up you are agreeing to our{" "}
        <a href="#" className="text-[#b8860b] underline font-medium hover:text-[#8a6408]">
          Terms &amp; Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="text-[#b8860b] underline font-medium hover:text-[#8a6408]">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
