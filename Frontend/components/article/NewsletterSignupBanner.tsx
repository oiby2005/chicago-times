"use client";

import React, { useState } from "react";

export default function NewsletterSignupBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      try {
        const stored = localStorage.getItem("wsj_newsletter_subscribers");
        const list = stored ? JSON.parse(stored) : [];
        if (list.some((s: any) => (typeof s === "string" ? s : s.email || "").toLowerCase().trim() === cleanEmail)) {
          setErrorMsg("You have already signed up for the newsletter with this email address. Please try signing up with a different email address.");
          return;
        }
      } catch (e) {}

      try {
        const res = await fetch("http://localhost:5000/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || (data && !data.success)) {
          setErrorMsg(
            data?.message ||
            "You have already signed up for the newsletter with this email address. Please try signing up with a different email address."
          );
          return;
        }
      } catch (err) {
        setErrorMsg("You have already signed up for the newsletter with this email address. Please try signing up with a different email address.");
        return;
      }

      setSubscribed(true);

      try {
        const stored = localStorage.getItem("wsj_newsletter_subscribers");
        const list = stored ? JSON.parse(stored) : [];
        if (!list.some((s: any) => (typeof s === "string" ? s : s.email).toLowerCase() === cleanEmail.toLowerCase())) {
          list.unshift({
            id: "sub_" + Date.now(),
            email: cleanEmail,
            newsletters: ["US", "WORLD", "BUSINESS"],
            subscribedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          });
          localStorage.setItem("wsj_newsletter_subscribers", JSON.stringify(list));
        }
      } catch (e) {}
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("wsj_newsletter_updated"));
      }
    }
  };

  return (
    <div className="w-full border-y border-[#e5e7eb] py-6 my-8 clear-both flow-root">
      {/* Title / Heading */}
      <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#b8860b] leading-tight">
        Times Chicago Fast Start — Let the best of news come to you
      </h3>

      {/* Subtitle */}
      <p className="font-sans text-sm text-[#444444] mt-1.5 mb-4">
        Sign up and stay up to date with our daily newsletter.
      </p>

      {errorMsg && (
        <div className="text-red-600 font-sans text-xs font-semibold mb-3">
          {errorMsg}
        </div>
      )}

      {/* Form or Success State */}
      {subscribed ? (
        <div className="bg-[#fefce8] border border-[#fef08a] text-[#854d0e] px-4 py-3 rounded-xs text-sm font-semibold">
          Thank you for subscribing to Times Chicago Fast Start!
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
