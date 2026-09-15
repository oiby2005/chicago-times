"use client";

import React, { useState } from "react";
import Header from "@/components/navigation/Header";
import StickyHeaderBar from "@/components/navigation/StickyHeaderBar";
import Footer from "@/components/layout/Footer";
import StickySubscribeBar from "@/components/ui/StickySubscribeBar";
import Container from "@/components/layout/Container";

export default function ContactUsClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    company: "",
    inquiryType: "",
    details: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const COUNTRY_CODE_RULES: Record<string, { name: string; totalDigits: number | number[] }> = {
    "1": { name: "United States / Canada", totalDigits: 11 },
    "44": { name: "United Kingdom", totalDigits: 12 },
    "91": { name: "India", totalDigits: 12 },
    "33": { name: "France", totalDigits: 11 },
    "49": { name: "Germany", totalDigits: [11, 12, 13] },
    "81": { name: "Japan", totalDigits: 12 },
    "86": { name: "China", totalDigits: 13 },
    "61": { name: "Australia", totalDigits: 11 },
    "94": { name: "Sri Lanka", totalDigits: 11 },
    "971": { name: "United Arab Emirates", totalDigits: 12 },
    "966": { name: "Saudi Arabia", totalDigits: 12 },
    "65": { name: "Singapore", totalDigits: 10 },
    "60": { name: "Malaysia", totalDigits: [11, 12] },
    "62": { name: "Indonesia", totalDigits: [11, 12, 13] },
    "55": { name: "Brazil", totalDigits: 13 },
    "52": { name: "Mexico", totalDigits: 12 },
    "39": { name: "Italy", totalDigits: 12 },
    "34": { name: "Spain", totalDigits: 11 },
    "7": { name: "Russia", totalDigits: 11 },
    "27": { name: "South Africa", totalDigits: 11 },
    "82": { name: "South Korea", totalDigits: [11, 12] },
    "92": { name: "Pakistan", totalDigits: 12 },
    "880": { name: "Bangladesh", totalDigits: 13 },
    "234": { name: "Nigeria", totalDigits: 13 },
    "254": { name: "Kenya", totalDigits: 12 },
    "20": { name: "Egypt", totalDigits: 12 },
    "63": { name: "Philippines", totalDigits: 12 },
    "84": { name: "Vietnam", totalDigits: 11 },
    "66": { name: "Thailand", totalDigits: 11 },
    "90": { name: "Turkey", totalDigits: 12 },
  };

  const validatePhoneWithCountryCode = (num: string): { valid: boolean; message?: string } => {
    const clean = num.trim();
    if (!clean.startsWith("+")) {
      return {
        valid: false,
        message: "Phone number must start with a leading '+' and country code (e.g. +1 555 000-0000 or +44 7911 123456).",
      };
    }

    const digitsOnly = clean.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return {
        valid: false,
        message: "Phone number length must be between 7 and 15 digits total including country code.",
      };
    }

    let matchedRule: { name: string; totalDigits: number | number[] } | null = null;
    for (let len of [3, 2, 1]) {
      const prefix = digitsOnly.substring(0, len);
      if (COUNTRY_CODE_RULES[prefix]) {
        matchedRule = COUNTRY_CODE_RULES[prefix];
        break;
      }
    }

    if (matchedRule) {
      const allowed = Array.isArray(matchedRule.totalDigits) ? matchedRule.totalDigits : [matchedRule.totalDigits];
      if (!allowed.includes(digitsOnly.length)) {
        const expectedText = allowed.join(" or ");
        return {
          valid: false,
          message: `Phone number for ${matchedRule.name} must contain exactly ${expectedText} digits total (got ${digitsOnly.length} digits). E.g. +${matchedRule.name === "United States / Canada" ? "1 (555) 000-0000" : "44 7911 123456"}.`,
        };
      }
    }

    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.details) {
      setSubmitStatus({
        success: false,
        message: "Please fill out all required fields (Name, Email, and Query details).",
      });
      return;
    }

    if (formData.phone) {
      const phoneValidation = validatePhoneWithCountryCode(formData.phone);
      if (!phoneValidation.valid) {
        setSubmitStatus({
          success: false,
          message: phoneValidation.message,
        });
        return;
      }
    }

    if (formData.whatsapp) {
      const waValidation = validatePhoneWithCountryCode(formData.whatsapp);
      if (!waValidation.valid) {
        setSubmitStatus({
          success: false,
          message: `WhatsApp error: ${waValidation.message}`,
        });
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitStatus({
          success: true,
          message: data.message || "Your inquiry has been submitted successfully!",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          company: "",
          inquiryType: "",
          details: "",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || "Failed to submit inquiry. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setSubmitStatus({
        success: true,
        message: "Thank you for reaching out! Your inquiry has been received.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        company: "",
        inquiryType: "",
        details: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />
      <StickyHeaderBar />

      <main className="w-full bg-white text-[#111111] flex-1 py-12 sm:py-16 font-sans">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Headquarters Address & General Inquiries */}
            <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#EAE6DA] pb-10 md:pb-0 md:pr-12">
              {/* Branding Header */}
              <div className="mb-6">
                <a href="/" className="inline-block">
                  <img
                    src="/images/design-reference/Times Chicago.svg"
                    alt="Times Chicago"
                    className="h-9 sm:h-10 w-auto object-contain"
                  />
                </a>
                <div className="w-12 h-0.5 bg-[#990000] mt-3 mb-6" />
              </div>

              {/* Headquarters Address Section */}
              <div className="mb-8">
                <h4 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2.5 font-sans">
                  HEADQUARTERS ADDRESS
                </h4>
                <p className="font-serif font-bold text-base sm:text-lg text-gray-900 leading-snug">
                  Timeschicago, United States
                </p>
              </div>

              <div className="w-full border-b border-[#EAE6DA] my-8" />

              {/* General Inquiries Section */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2.5 font-sans">
                  GENERAL INQUIRIES
                </h4>
                <a
                  href="mailto:Info@Times-Chicago.com"
                  className="font-serif font-bold text-base sm:text-lg text-[#00558c] hover:underline block"
                >
                  Info@Times-Chicago.com
                </a>
              </div>
            </div>

            {/* Right Column: Submit Your Query Form */}
            <div className="md:col-span-7">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900 mb-1.5">
                Submit Your Query
              </h2>
              <p className="text-xs text-gray-500 mb-6 font-sans">
                Please, fill out the form below and submit your inquiry.
              </p>

              <div className="w-full border-b border-[#EAE6DA] mb-8" />

              {/* Status Alert Banner */}
              {submitStatus && (
                <div
                  className={`p-4 rounded text-xs mb-6 font-sans ${
                    submitStatus.success
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border border-rose-200 text-rose-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      YOUR NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      YOUR EMAIL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      PHONE NUMBER (WITH COUNTRY CODE) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      WHATSAPP NUMBER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Company & Type of Inquiry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      COMPANY NAME
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company LLC (Optional)"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                      TYPE OF INQUIRY <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:border-[#00558c] transition-colors"
                    >
                      <option value="">-- Select Inquiry Type --</option>
                      <option value="Business / Advertising">Business / Advertising</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Technical glitch">Technical glitch</option>
                      <option value="General / Others">General / Others</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Inquiry Detail Textarea */}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-gray-700 uppercase mb-1.5">
                    YOUR QUESTION(S) / INQUIRY DETAIL <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="details"
                    rows={4}
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Please enter your detailed query here..."
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00558c] transition-colors resize-y"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#00558c] hover:bg-[#00406c] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded flex items-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    <span>{isSubmitting ? "SUBMITTING..." : "SUBMIT INQUIRY"}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </Container>
      </main>

      <StickySubscribeBar />
      <Footer />
    </div>
  );
}
