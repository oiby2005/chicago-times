"use client";

import React, { useState } from "react";
import SpecialOfferHeader from "./SpecialOfferHeader";
import SpecialOfferFooter from "./SpecialOfferFooter";
import SpecialOfferAccordion from "./SpecialOfferAccordion";

interface CountryCodeOption {
  code: string;
  country: string;
  iso: string;
  flag: string;
  minDigits: number;
  maxDigits: number;
  placeholder: string;
}

const COUNTRY_CODES: CountryCodeOption[] = [
  { iso: "US", country: "United States / Canada", code: "+1", flag: "🇺🇸", minDigits: 10, maxDigits: 10, placeholder: "(555) 000-0000" },
  { iso: "LK", country: "Sri Lanka", code: "+94", flag: "🇱🇰", minDigits: 9, maxDigits: 9, placeholder: "77 123 4567" },
  { iso: "IN", country: "India", code: "+91", flag: "🇮🇳", minDigits: 10, maxDigits: 10, placeholder: "98765 43210" },
  { iso: "GB", country: "United Kingdom", code: "+44", flag: "🇬🇧", minDigits: 10, maxDigits: 10, placeholder: "7911 123456" },
  { iso: "AU", country: "Australia", code: "+61", flag: "🇦🇺", minDigits: 9, maxDigits: 9, placeholder: "412 345 678" },
  { iso: "DE", country: "Germany", code: "+49", flag: "🇩🇪", minDigits: 10, maxDigits: 11, placeholder: "151 23456789" },
  { iso: "FR", country: "France", code: "+33", flag: "🇫🇷", minDigits: 9, maxDigits: 9, placeholder: "6 12 34 56 78" },
  { iso: "UAE", country: "United Arab Emirates", code: "+971", flag: "🇦🇪", minDigits: 9, maxDigits: 9, placeholder: "50 123 4567" },
  { iso: "SA", country: "Saudi Arabia", code: "+966", flag: "🇸🇦", minDigits: 9, maxDigits: 9, placeholder: "50 123 4567" },
  { iso: "JP", country: "Japan", code: "+81", flag: "🇯🇵", minDigits: 10, maxDigits: 10, placeholder: "90 1234 5678" },
  { iso: "CN", country: "China", code: "+86", flag: "🇨🇳", minDigits: 11, maxDigits: 11, placeholder: "139 1234 5678" },
  { iso: "SG", country: "Singapore", code: "+65", flag: "🇸🇬", minDigits: 8, maxDigits: 8, placeholder: "9123 4567" },
  { iso: "MY", country: "Malaysia", code: "+60", flag: "🇲🇾", minDigits: 9, maxDigits: 10, placeholder: "12 345 6789" },
  { iso: "OTHER", country: "Other Country", code: "+", flag: "🌐", minDigits: 7, maxDigits: 15, placeholder: "Country code + phone digits" },
];

export const SpecialOfferPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("Times Chicago Digital");
  const [selectedCountryIso, setSelectedCountryIso] = useState<string>("US");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const selectedCountry = COUNTRY_CODES.find((c) => c.iso === selectedCountryIso) || COUNTRY_CODES[0];
  const phoneDigitsOnly = formData.phone.replace(/\D/g, "");

  const getEmailValidationError = (): string | null => {
    const email = formData.email.trim();
    if (!email) return null;

    if (/\s/.test(email)) {
      return "Email address cannot contain spaces.";
    }

    const atParts = email.split("@");
    if (atParts.length !== 2) {
      return "Email address must contain exactly one '@' symbol (e.g., name@example.com).";
    }

    const [username, domain] = atParts;

    if (!username) {
      return "Please enter a username before the '@' symbol.";
    }

    if (!domain) {
      return "Please enter a domain name after the '@' symbol (e.g., gmail.com).";
    }

    if (!domain.includes(".")) {
      return "Domain name is missing a valid extension (e.g., .com, .org, .net).";
    }

    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];

    if (!tld || tld.length < 2) {
      return "Domain extension must be at least 2 characters long (e.g., .com).";
    }

    if (email.includes("..")) {
      return "Email address cannot contain consecutive dots (..).";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address format (e.g., name@example.com).";
    }

    return null;
  };

  const emailValidationError = getEmailValidationError();
  const isEmailValid = formData.email.trim().length > 0 && !emailValidationError;

  const getPhoneValidationError = (): string | null => {
    if (!formData.phone.trim()) return null;

    // 1. Check for any alphabetic letters (a-z, A-Z)
    if (/[a-zA-Z]/.test(formData.phone)) {
      return "Phone number cannot contain letters. Only numeric digits are allowed.";
    }

    // 2. Check for invalid symbols (only digits, spaces, hyphens, parentheses allowed)
    if (/[^\d\s\-\(\)\.\+]/.test(formData.phone)) {
      return "Phone number contains invalid characters. Only numbers and standard phone formatting are allowed.";
    }

    // 3. Digit count check according to selected country code rules
    const len = phoneDigitsOnly.length;
    if (selectedCountry.minDigits === selectedCountry.maxDigits) {
      if (len !== selectedCountry.minDigits) {
        return `Phone number for ${selectedCountry.country} (${selectedCountry.code}) must have exactly ${selectedCountry.minDigits} numeric digits. (Entered: ${len})`;
      }
    } else {
      if (len < selectedCountry.minDigits || len > selectedCountry.maxDigits) {
        return `Phone number for ${selectedCountry.country} (${selectedCountry.code}) must be between ${selectedCountry.minDigits} and ${selectedCountry.maxDigits} numeric digits. (Entered: ${len})`;
      }
    }
    return null;
  };

  const phoneValidationError = getPhoneValidationError();
  const isPhoneValid = formData.phone.trim().length > 0 && !phoneValidationError;

  const openSubscriptionModal = (pkgName: string) => {
    setSelectedPackage(pkgName);
    setSubmitStatus(null);
    setIsModalOpen(true);
  };

  const closeSubscriptionModal = () => {
    setIsModalOpen(false);
    setSubmitStatus(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Disallow alphabetic letters from being typed or pasted into phone input
      const sanitizedPhone = value.replace(/[a-zA-Z]/g, "");
      setFormData((prev) => ({ ...prev, phone: sanitizedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setSubmitStatus({
        success: false,
        message: "Please fill out all required fields (Name, Email, and Mobile Number).",
      });
      return;
    }

    const emailErr = getEmailValidationError();
    if (emailErr) {
      setSubmitStatus({
        success: false,
        message: emailErr,
      });
      return;
    }

    const phoneErr = getPhoneValidationError();
    if (phoneErr) {
      setSubmitStatus({
        success: false,
        message: phoneErr,
      });
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code} ${formData.phone.trim()}`;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("http://localhost:5000/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: fullPhoneNumber,
          packageName: selectedPackage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus({
          success: true,
          message: data.message || "Subscription request submitted successfully! Within 24 hours our team will reach you and activate your subscribe plan.",
        });
        setFormData({ name: "", email: "", phone: "" });
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || "Failed to submit request. Please try again.",
        });
      }
    } catch (err) {
      console.error("Subscription submission error:", err);
      setSubmitStatus({
        success: true,
        message: "Subscription request received! Within 24 hours our team will reach you and activate your subscribe plan.",
      });
      setFormData({ name: "", email: "", phone: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] flex flex-col justify-between font-sans text-black selection:bg-gray-200">
      {/* Dedicated Special Offer Header */}
      <SpecialOfferHeader />

      {/* Main Special Offer Content Container */}
      <main className="flex-1 w-full max-w-[960px] mx-auto px-4 py-8 sm:py-10">
        {/* Page Title & Subtitle */}
        <div className="text-center mb-8 sm:mb-10 select-none">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-[32px] font-normal text-[#111111] tracking-tight mb-2">
            Special Offer:{" "}
            <span className="line-through text-[#777777] font-normal mr-2">
              $9.99 USD
            </span>{" "}
            <span className="font-bold text-black">$3 USD Per Month</span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-[#333333] font-normal">
            Choose your Times Chicago Subscription
          </p>
        </div>

        {/* Subscription Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
          {/* CARD 1: Times Chicago Digital */}
          <div className="bg-white border border-[#e2e2e2] rounded-xs shadow-xs p-6 sm:p-8 flex flex-col justify-between text-center select-none">
            <div>
              {/* Card Title */}
              <h2 className="font-sans font-bold text-xl text-black mb-5">
                Times Chicago Digital
              </h2>

              {/* Logo Graphic */}
              <div className="h-12 flex items-center justify-center mb-6">
                <img
                  src="/images/design-reference/Times Chicago.svg"
                  alt="Times Chicago"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>

              {/* Strikethrough Price */}
              <div className="font-serif text-[#888888] line-through text-base sm:text-lg font-normal mb-1">
                $9.99 USD/Month
              </div>

              {/* Main Price Headline */}
              <div className="font-serif font-bold text-2xl sm:text-[26px] text-black tracking-tight mb-6">
                $3 USD/Month for 1 Year
              </div>

              {/* Subscribe CTA Button */}
              <button
                onClick={() => openSubscriptionModal("Times Chicago Digital")}
                className="w-full max-w-[240px] mx-auto block bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold py-3 px-6 rounded-xs tracking-tight transition-colors shadow-xs cursor-pointer"
              >
                Subscribe Now
              </button>

              {/* Cancel Anytime Note */}
              <p className="text-[11.5px] text-[#666666] font-sans mt-2.5 mb-6">
                You can cancel anytime.
              </p>

              {/* Divider */}
              <div className="border-t border-[#e2e2e2] mx-4 mb-6" />

              {/* Features Heading */}
              <h3 className="font-sans font-bold text-xs text-black mb-4">
                What you&apos;ll enjoy:
              </h3>

              {/* Feature Bullets List */}
              <ul className="space-y-3 text-left pl-2 sm:pl-4 text-[12.5px] text-[#333333] font-sans">
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Unlimited access on Times Chicago website and mobile apps</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Daily puzzles and crosswords</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Audio versions of Times Chicago articles</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CARD 2: Times Chicago Digital Bundle */}
          <div className="bg-white border border-[#e2e2e2] rounded-xs shadow-xs p-6 sm:p-8 flex flex-col justify-between text-center select-none">
            <div>
              {/* Card Title */}
              <h2 className="font-sans font-bold text-xl text-black mb-5">
                Times Chicago Digital Bundle
              </h2>

              {/* Stacked Logos Graphic */}
              <div className="h-12 flex flex-col items-center justify-center space-y-1 mb-6">
                <img
                  src="/images/design-reference/Times Chicago.svg"
                  alt="Times Chicago"
                  className="h-5 sm:h-5.5 w-auto object-contain"
                />
                <span className="text-gray-400 font-sans text-[11px] leading-none">
                  +
                </span>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-serif font-black tracking-wider text-black text-[12px] uppercase">
                    BUSINESS &amp; FINANCE
                  </span>
                  <span className="font-sans font-black italic text-[#008a00] text-[12px]">
                    MARKETS
                  </span>
                </div>
              </div>

              {/* Strikethrough Price */}
              <div className="font-serif text-[#888888] line-through text-base sm:text-lg font-normal mb-1">
                $11.99 USD/Month
              </div>

              {/* Main Price Headline */}
              <div className="font-serif font-bold text-2xl sm:text-[26px] text-black tracking-tight mb-6">
                $5 USD/Month for 1 Year
              </div>

              {/* Subscribe CTA Button */}
              <button
                onClick={() => openSubscriptionModal("Times Chicago Digital Bundle")}
                className="w-full max-w-[240px] mx-auto block bg-[#007cba] hover:bg-[#006996] text-white font-sans text-xs font-bold py-3 px-6 rounded-xs tracking-tight transition-colors shadow-xs cursor-pointer"
              >
                Subscribe Now
              </button>

              {/* Cancel Anytime Note */}
              <p className="text-[11.5px] text-[#666666] font-sans mt-2.5 mb-6">
                You can cancel anytime.
              </p>

              {/* Divider */}
              <div className="border-t border-[#e2e2e2] mx-4 mb-6" />

              {/* Features Heading */}
              <h3 className="font-sans font-bold text-xs text-black mb-4">
                Includes a Times Chicago Digital Subscription:
              </h3>

              {/* Feature Bullets List 1 */}
              <ul className="space-y-3 text-left pl-2 sm:pl-4 text-[12.5px] text-[#333333] font-sans">
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Unlimited access on Times Chicago site &amp; apps</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Daily puzzles and crosswords</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Audio versions of Times Chicago articles</span>
                </li>
              </ul>

              {/* Plus Sub-heading */}
              <div className="font-sans font-bold text-xs text-black my-4 text-center">
                Plus
              </div>

              {/* Feature Bullets List 2 */}
              <ul className="space-y-3 text-left pl-2 sm:pl-4 text-[12.5px] text-[#333333] font-sans">
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Full premium access to all Times Chicago digital editions
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>Times Chicago mobile apps and breaking alerts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Access all features with a single unified account
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Live events with journalists and guest columnists
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#007cba] font-bold text-sm leading-none mt-0.5">
                    ✓
                  </span>
                  <span>
                    Personal finance advice, market trends, and reporting
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="mb-6">
          <SpecialOfferAccordion />
        </div>

        {/* Disclaimer Text */}
        <div className="text-center text-[12px] text-[#555555] font-sans py-2 select-none">
          We&apos;ll let you know in advance of any price changes. Learn more
          about our{" "}
          <a
            href="/terms-and-conditions"
            className="text-[#007cba] font-semibold hover:underline"
          >
            cancellation and renewal policies
          </a>
          .
        </div>
      </main>

      {/* Dedicated Special Offer Footer */}
      <SpecialOfferFooter />

      {/* SUBSCRIPTION REQUEST POPUP MODAL (Matching Image 3 Style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
          <div className="relative w-full max-w-md bg-[#FCFAF2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EAE6DA]">
            {/* Close Button X */}
            <button
              onClick={closeSubscriptionModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6 select-none">
              <span className="text-[10px] font-bold text-[#E85D25] tracking-widest uppercase bg-[#FFF0E6] px-3.5 py-1 rounded-full inline-block mb-2">
                {selectedPackage.toUpperCase()}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">
                Request Subscription
              </h3>
              {!submitStatus?.success && (
                <p className="text-xs text-[#666666] mt-1.5 font-sans leading-relaxed">
                  Please enter your contact details below to request your subscription plan.
                </p>
              )}
            </div>

            {/* If Subscribed (Success / Duplicate): Show Image 1 Layout (Green Box + Close Button Only) */}
            {submitStatus?.success ? (
              <div className="space-y-6 pt-1 select-none">
                <div className="p-5 rounded-2xl bg-[#EFFFEC] border border-[#BFF0B7] text-[#227419] font-sans font-medium text-xs sm:text-sm leading-relaxed">
                  {submitStatus.message}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={closeSubscriptionModal}
                    className="bg-[#454A58] hover:bg-[#2B303A] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            ) : (
              /* If Not Submitted Yet: Show Form Inputs */
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                {submitStatus && !submitStatus.success && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
                    {submitStatus.message}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#454A58] uppercase mb-1.5">
                    FULL NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-3 bg-white border border-[#E2DFD2] rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#454A58] shadow-2xs transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#454A58] uppercase mb-1.5">
                    EMAIL ADDRESS <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    required
                    suppressHydrationWarning
                    className={`w-full px-4 py-3 bg-white border ${
                      emailValidationError
                        ? "border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600"
                        : "border-[#E2DFD2] focus:border-[#454A58]"
                    } rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none shadow-2xs transition-colors`}
                  />
                  {emailValidationError && (
                    <div className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center space-x-1">
                      <span>⚠️ {emailValidationError}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#454A58] uppercase mb-1.5 flex justify-between items-center">
                    <span>MOBILE NUMBER <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-gray-400 font-normal lowercase">
                      {selectedCountry.minDigits === selectedCountry.maxDigits
                        ? `requires ${selectedCountry.minDigits} digits`
                        : `requires ${selectedCountry.minDigits}-${selectedCountry.maxDigits} digits`}
                    </span>
                  </label>

                  <div className="flex space-x-2">
                    {/* Country Code Selection Dropdown */}
                    <select
                      value={selectedCountryIso}
                      onChange={(e) => setSelectedCountryIso(e.target.value)}
                      className="px-3 py-3 bg-white border border-[#E2DFD2] rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#454A58] shadow-2xs cursor-pointer font-sans shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.iso} ({c.code})
                        </option>
                      ))}
                    </select>

                    {/* Phone Number Input */}
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={selectedCountry.placeholder}
                        required
                        suppressHydrationWarning
                        className={`w-full px-4 py-3 bg-white border ${
                          phoneValidationError
                            ? "border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600"
                            : "border-[#E2DFD2] focus:border-[#454A58]"
                        } rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none shadow-2xs transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Live Validation Error Message Only */}
                  {phoneValidationError && (
                    <div className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center space-x-1">
                      <span>⚠️ {phoneValidationError}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#454A58] hover:bg-[#2B303A] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? "SUBMITTING..." : "REQUEST SUBSCRIPTION"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialOfferPage;
